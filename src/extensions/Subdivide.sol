// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";

/**
 * @title IDeedNFT Interface
 * @dev Interface for interacting with the DeedNFT contract.
 *      Required for subdivision validation and ownership checks.
 */
interface IDeedNFT {
    enum AssetType { Land, Vehicle, Estate, CommercialEquipment }
    function ownerOf(uint256 tokenId) external view returns (address);
    function canSubdivide(uint256 tokenId) external view returns (bool);
    function getDeedInfo(uint256 tokenId) external view returns (
        AssetType assetType,
        bool isValidated,
        string memory operatingAgreement,
        string memory definition,
        string memory configuration,
        address validator
    );
}

/**
 * @title Subdivide
 * @dev Contract for subdividing DeedNFTs into multiple ERC1155 tokens.
 *      Allows DeedNFT owners to create and manage subdivisions of their Land or Estate assets.
 *      Each subdivision represents a collection of units or parcels tied to the original DeedNFT.
 *      Implements UUPSUpgradeable for upgradability.
 */
contract Subdivide is 
    Initializable,
    ERC1155Upgradeable,
    AccessControlUpgradeable,
    PausableUpgradeable,
    UUPSUpgradeable 
{
    using StringsUpgradeable for uint256;

    // Role definitions
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    
    // Contract references
    IDeedNFT public deedNFT;

    /**
     * @dev Struct containing information about a subdivision
     * @param name Name of the subdivision collection
     * @param description Description of the subdivision
     * @param symbol Symbol for the subdivision tokens
     * @param collectionUri Base URI for the subdivision collection
     * @param totalUnits Total number of units in the subdivision
     * @param activeUnits Number of currently active (minted and not burned) units
     * @param isActive Whether the subdivision is currently active
     * @param burnable Whether units in this subdivision can be burned
     * @param unitMetadata Mapping of unit IDs to their metadata URIs
     */
    struct SubdivisionInfo {
        string name;
        string description;
        string symbol;
        string collectionUri;
        uint256 totalUnits;
        uint256 activeUnits;
        bool isActive;
        bool burnable;
        mapping(uint256 => string) unitMetadata;
    }
    
    // Mapping from DeedNFT ID to subdivision information
    mapping(uint256 => SubdivisionInfo) public subdivisions;
    
    // Events
    /**
     * @dev Emitted when a new subdivision is created
     */
    event SubdivisionCreated(uint256 indexed deedId, string name, uint256 totalUnits);
    
    /**
     * @dev Emitted when a unit is minted within a subdivision
     */
    event UnitMinted(uint256 indexed deedId, uint256 indexed unitId, address to);
    
    /**
     * @dev Emitted when a subdivision's metadata is updated
     */
    event UnitMetadataUpdated(uint256 indexed deedId, uint256 indexed unitId, string metadata);
    
    /**
     * @dev Emitted when a subdivision is deactivated
     */
    event SubdivisionDeactivated(uint256 indexed deedId);
    
    /**
     * @dev Emitted when a subdivision's burnable status is changed
     */
    event BurnableStatusChanged(uint256 indexed deedId, bool burnable);
    
    /**
     * @dev Emitted when a unit is burned
     */
    event UnitBurned(uint256 indexed deedId, uint256 indexed unitId);

    // Storage gap for future upgrades
    uint256[50] private __gap;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev Initializes the Subdivide contract
     * @param _deedNFT Address of the DeedNFT contract
     */
    function initialize(address _deedNFT) public initializer {
        __ERC1155_init("");
        __AccessControl_init();
        __Pausable_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        
        require(_deedNFT != address(0), "Invalid DeedNFT address");
        deedNFT = IDeedNFT(_deedNFT);
    }

    /**
     * @dev Authorizes contract upgrades
     * @param newImplementation Address of the new implementation contract
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyRole(DEFAULT_ADMIN_ROLE) {}

    /**
     * @dev Creates a new subdivision for a DeedNFT
     * @param deedId ID of the DeedNFT to subdivide
     * @param name Name of the subdivision
     * @param description Description of the subdivision
     * @param totalUnits Total number of units to create
     */
    function createSubdivision(
        uint256 deedId,
        string memory name,
        string memory description,
        uint256 totalUnits
    ) external whenNotPaused {
        require(deedNFT.ownerOf(deedId) == msg.sender, "Not deed owner");
        require(deedNFT.canSubdivide(deedId), "Deed cannot be subdivided");
        require(totalUnits > 0, "Invalid units amount");
        require(!subdivisions[deedId].isActive, "Subdivision already exists");

        SubdivisionInfo storage newSubdivision = subdivisions[deedId];
        newSubdivision.name = name;
        newSubdivision.description = description;
        newSubdivision.totalUnits = totalUnits;
        newSubdivision.isActive = true;

        emit SubdivisionCreated(deedId, name, totalUnits);
    }

    /**
     * @dev Mints a subdivision unit
     * @param deedId ID of the DeedNFT
     * @param unitId ID of the unit within the subdivision
     * @param to Address to receive the unit
     * @param metadata Metadata URI for the unit
     */
    function mintUnit(
        uint256 deedId,
        uint256 unitId,
        address to,
        string memory metadata
    ) external whenNotPaused {
        require(deedNFT.ownerOf(deedId) == msg.sender, "Not deed owner");
        require(subdivisions[deedId].isActive, "Subdivision not active");
        require(unitId < subdivisions[deedId].totalUnits, "Invalid unit ID");

        uint256 tokenId = _generateTokenId(deedId, unitId);
        _mint(to, tokenId, 1, "");
        
        subdivisions[deedId].unitMetadata[unitId] = metadata;
        emit UnitMinted(deedId, unitId, to);
        emit UnitMetadataUpdated(deedId, unitId, metadata);
    }

    /**
     * @dev Deactivates a subdivision
     * @param deedId ID of the DeedNFT
     */
    function deactivateSubdivision(uint256 deedId) external {
        require(deedNFT.ownerOf(deedId) == msg.sender, "Not deed owner");
        require(subdivisions[deedId].isActive, "Subdivision not active");
        
        subdivisions[deedId].isActive = false;
        emit SubdivisionDeactivated(deedId);
    }

    /**
     * @dev Retrieves metadata for a specific unit
     * @param deedId ID of the DeedNFT
     * @param unitId ID of the unit
     * @return Metadata URI string
     */
    function getUnitMetadata(uint256 deedId, uint256 unitId) 
        external 
        view 
        returns (string memory) 
    {
        require(subdivisions[deedId].isActive, "Subdivision not active");
        return subdivisions[deedId].unitMetadata[unitId];
    }

    /**
     * @dev Generates a unique token ID by combining deedId and unitId
     * @param deedId ID of the DeedNFT
     * @param unitId ID of the unit
     * @return Combined token ID
     */
    function _generateTokenId(uint256 deedId, uint256 unitId) 
        internal 
        pure 
        returns (uint256) 
    {
        return (deedId << 128) | unitId;
    }

    /**
     * @dev Returns the metadata URI for a token
     * @param tokenId ID of the token
     * @return Metadata URI string
     */
    function uri(uint256 tokenId) public view override returns (string memory) {
        uint256 deedId = tokenId >> 128;
        uint256 unitId = tokenId & ((1 << 128) - 1);
        
        require(subdivisions[deedId].isActive, "Subdivision not active");
        return subdivisions[deedId].unitMetadata[unitId];
    }

    /**
     * @dev Pauses all contract operations
     */
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    /**
     * @dev Unpauses all contract operations
     */
    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    /**
     * @dev See {IERC165-supportsInterface}
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155Upgradeable, AccessControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
