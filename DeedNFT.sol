// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

// External validator and registry interfaces
import "./IValidator.sol";
import "./IValidatorRegistry.sol";

/**
 * @title DeedNFT
 * @dev An ERC-721 token representing deeds with complex metadata and validator integration.
 */
contract DeedNFT is Initializable, ERC721URIStorageUpgradeable, AccessControlUpgradeable, PausableUpgradeable {
    using StringsUpgradeable for uint256;

    // Role definitions
    bytes32 public constant VALIDATOR_ROLE = keccak256("VALIDATOR_ROLE");

    // Deed information structure
    struct DeedInfo {
        AssetType assetType;
        bool isValidated;
        string operatingAgreement;
        string definition;
        string configuration;
        address validator;
        uint256[5] __gap; // Reserved for future use
    }

    // Asset types enumeration
    enum AssetType {
        Land,
        Vehicle,
        Estate,
        CommercialEquipment
    }

    uint256 public nextDeedId;
    mapping(uint256 => DeedInfo) private deedInfoMap;
    address private defaultValidator;
    address private validatorRegistry;

    // Events
    event DeedNFTMinted(uint256 indexed deedId, DeedInfo deedInfo, address indexed minter);
    event DeedNFTBurned(uint256 indexed deedId);
    event DeedNFTValidatedChanged(uint256 indexed deedId, bool isValid);
    event DeedNFTMetadataUpdated(uint256 indexed deedId);
    event Paused(address account);
    event Unpaused(address account);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev Initializes the contract with default validator and registry addresses.
     * @param _defaultValidator Address of the default validator contract.
     * @param _validatorRegistry Address of the validator registry contract.
     */
    function initialize(address _defaultValidator, address _validatorRegistry) public initializer {
        __ERC721_init("DeedNFT", "DEED");
        __ERC721URIStorage_init();
        __AccessControl_init();
        __Pausable_init();

        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(VALIDATOR_ROLE, msg.sender);

        defaultValidator = _defaultValidator;
        validatorRegistry = _validatorRegistry;
        nextDeedId = 1;
    }

    // Modifiers

    modifier deedExists(uint256 _deedId) {
        require(_exists(_deedId), "DeedNFT: Deed does not exist");
        _;
    }

    modifier onlyDeedOwner(uint256 _deedId) {
        require(ownerOf(_deedId) == msg.sender, "DeedNFT: Caller is not the owner");
        _;
    }

    modifier onlyValidatorOrOwner(uint256 _deedId) {
        require(
            hasRole(VALIDATOR_ROLE, msg.sender) || ownerOf(_deedId) == msg.sender,
            "DeedNFT: Caller is not validator or owner"
        );
        _;
    }

    // Pausable functions

    /**
     * @dev Pauses all contract operations.
     */
    function pause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
        emit Paused(msg.sender);
    }

    /**
     * @dev Unpauses all contract operations.
     */
    function unpause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
        emit Unpaused(msg.sender);
    }

    // Validator functions

    /**
     * @dev Sets the default validator address.
     * @param _validator Address of the new default validator.
     */
    function setDefaultValidator(address _validator) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_validator != address(0), "DeedNFT: Invalid validator address");
        defaultValidator = _validator;
    }

    /**
     * @dev Sets the validator registry address.
     * @param _registry Address of the validator registry.
     */
    function setValidatorRegistry(address _registry) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_registry != address(0), "DeedNFT: Invalid registry address");
        validatorRegistry = _registry;
    }

    // Minting functions

    /**
     * @dev Mints a new deed to the specified owner.
     * @param _owner Address of the deed owner.
     * @param _assetType Type of the asset.
     * @param _ipfsDetailsHash IPFS hash of the deed details.
     * @param _operatingAgreement Operating agreement associated with the deed.
     * @param _definition Definition of the deed.
     * @param _configuration Configuration data for the deed.
     * @param _validator Address of the validator contract.
     * @return The ID of the minted deed.
     */
    function mintAsset(
        address _owner,
        AssetType _assetType,
        string memory _ipfsDetailsHash,
        string memory _operatingAgreement,
        string memory _definition,
        string memory _configuration,
        address _validator
    ) public onlyRole(VALIDATOR_ROLE) whenNotPaused returns (uint256) {
        require(_owner != address(0), "DeedNFT: Invalid owner address");
        require(bytes(_ipfsDetailsHash).length > 0, "DeedNFT: IPFS details hash is required");
        require(bytes(_operatingAgreement).length > 0, "DeedNFT: Operating agreement is required");
        require(bytes(_definition).length > 0, "DeedNFT: Definition is required");
        require(_validator != address(0), "DeedNFT: Validator address is required");

        uint256 deedId = nextDeedId;
        nextDeedId += 1;

        _mint(_owner, deedId);
        _setTokenURI(deedId, _ipfsDetailsHash);

        DeedInfo storage deedInfo = deedInfoMap[deedId];
        deedInfo.assetType = _assetType;
        deedInfo.isValidated = true;
        deedInfo.operatingAgreement = _operatingAgreement;
        deedInfo.definition = _definition;
        deedInfo.configuration = _configuration;
        deedInfo.validator = _validator;

        emit DeedNFTMinted(deedId, deedInfo, msg.sender);
        return deedId;
    }

    /**
     * @dev Batch mints multiple deeds.
     * @param _owners Array of owner addresses.
     * @param _assetTypes Array of asset types.
     * @param _ipfsDetailsHashes Array of IPFS details hashes.
     * @param _operatingAgreements Array of operating agreements.
     * @param _definitions Array of definitions.
     * @param _configurations Array of configurations.
     * @param _validators Array of validator addresses.
     * @return Array of minted deed IDs.
     */
    function mintBatchAssets(
        address[] memory _owners,
        AssetType[] memory _assetTypes,
        string[] memory _ipfsDetailsHashes,
        string[] memory _operatingAgreements,
        string[] memory _definitions,
        string[] memory _configurations,
        address[] memory _validators
    ) public onlyRole(VALIDATOR_ROLE) whenNotPaused returns (uint256[] memory) {
        uint256 len = _owners.length;
        require(
            len == _assetTypes.length &&
            len == _ipfsDetailsHashes.length &&
            len == _operatingAgreements.length &&
            len == _definitions.length &&
            len == _configurations.length &&
            len == _validators.length,
            "DeedNFT: Input arrays length mismatch"
        );

        uint256[] memory deedIds = new uint256[](len);

        for (uint256 i = 0; i < len; i++) {
            deedIds[i] = mintAsset(
                _owners[i],
                _assetTypes[i],
                _ipfsDetailsHashes[i],
                _operatingAgreements[i],
                _definitions[i],
                _configurations[i],
                _validators[i]
            );
        }

        return deedIds;
    }

    // Burning functions

    /**
     * @dev Burns a deed owned by the caller.
     * @param _deedId ID of the deed to burn.
     */
    function burnAsset(uint256 _deedId) public onlyDeedOwner(_deedId) whenNotPaused {
        _burn(_deedId);
        delete deedInfoMap[_deedId];
        emit DeedNFTBurned(_deedId);
    }

    /**
     * @dev Batch burns multiple deeds owned by the caller.
     * @param _deedIds Array of deed IDs to burn.
     */
    function burnBatchAssets(uint256[] memory _deedIds) public whenNotPaused {
        for (uint256 i = 0; i < _deedIds.length; i++) {
            uint256 deedId = _deedIds[i];
            require(ownerOf(deedId) == msg.sender, "DeedNFT: Caller is not the owner of all deeds");
            burnAsset(deedId);
        }
    }

    // Validation functions

    /**
     * @dev Validates or invalidates a deed.
     * @param _deedId ID of the deed.
     * @param _isValid Validation status to set.
     */
    function validateAsset(uint256 _deedId, bool _isValid) public onlyRole(VALIDATOR_ROLE) whenNotPaused {
        require(ownerOf(_deedId) != msg.sender, "DeedNFT: Validator cannot validate own asset");
        deedInfoMap[_deedId].isValidated = _isValid;
        emit DeedNFTValidatedChanged(_deedId, _isValid);
    }

    // Metadata functions

    /**
     * @dev Updates the metadata of a deed.
     * @param _deedId ID of the deed.
     * @param _ipfsDetailsHash New IPFS details hash.
     * @param _operatingAgreement New operating agreement.
     * @param _definition New definition.
     * @param _configuration New configuration.
     */
    function updateMetadata(
        uint256 _deedId,
        string memory _ipfsDetailsHash,
        string memory _operatingAgreement,
        string memory _definition,
        string memory _configuration
    ) public onlyValidatorOrOwner(_deedId) whenNotPaused {
        require(bytes(_ipfsDetailsHash).length > 0, "DeedNFT: IPFS details hash is required");
        require(bytes(_operatingAgreement).length > 0, "DeedNFT: Operating agreement is required");
        require(bytes(_definition).length > 0, "DeedNFT: Definition is required");

        _setTokenURI(_deedId, _ipfsDetailsHash);

        DeedInfo storage deedInfo = deedInfoMap[_deedId];
        deedInfo.operatingAgreement = _operatingAgreement;
        deedInfo.definition = _definition;
        deedInfo.configuration = _configuration;

        if (!hasRole(VALIDATOR_ROLE, msg.sender)) {
            deedInfo.isValidated = false;
        }

        emit DeedNFTMetadataUpdated(_deedId);
    }

    // Getter functions

    /**
     * @dev Retrieves the deed information.
     * @param _deedId ID of the deed.
     * @return DeedInfo structure containing deed details.
     */
    function getDeedInfo(uint256 _deedId) public view deedExists(_deedId) returns (DeedInfo memory) {
        return deedInfoMap[_deedId];
    }

    /**
     * @dev Returns the token URI, potentially using a validator contract.
     * @param _deedId ID of the deed.
     * @return The token URI string.
     */
    function tokenURI(uint256 _deedId) public view override returns (string memory) {
        require(_exists(_deedId), "DeedNFT: URI query for nonexistent token");

        DeedInfo storage deedInfo = deedInfoMap[_deedId];
        address validatorAddress = deedInfo.validator != address(0) ? deedInfo.validator : defaultValidator;

        if (validatorAddress != address(0)) {
            IValidator validator = IValidator(validatorAddress);
            return validator.tokenURI(_deedId);
        } else {
            return super.tokenURI(_deedId);
        }
    }

    // Interface support

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Upgradeable, AccessControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
