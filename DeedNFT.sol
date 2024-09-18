// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./AccessManager.sol";
import "./IFabricaValidator.sol";
import "./IFabricaValidatorRegistry.sol";

contract DeedNFT is
    Initializable,
    ERC721URIStorageUpgradeable,
    PausableUpgradeable,
    AccessControlUpgradeable,
    AccessManagerBase
{
    using StringsUpgradeable for uint256;

    // Roles for access control
    bytes32 public constant VALIDATOR_ROLE = keccak256("VALIDATOR_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    // Struct to store comprehensive metadata for each deed
    struct DeedInfo {
        AssetType assetType;
        bool isValidated;
        string operatingAgreement;
        string definition;
        string configuration;
        address validator;
        uint256[5] __gap; // Reserved for future use
    }

    // Enumeration of asset types
    enum AssetType {
        Land,
        Vehicle,
        Estate,
        CommercialEquipment
    }

    // State variables
    uint256 public nextDeedId;
    mapping(uint256 => DeedInfo) private deedInfoMap;

    address private defaultValidator;
    address private validatorRegistry;

    // Events for logging significant actions
    event DeedNFTMinted(uint256 deedId, DeedInfo deedInfo, address minter);
    event DeedNFTBurned(uint256 deedId);
    event DeedNFTValidatedChanged(uint256 deedId, bool isValid);
    event DeedNFTMetadataUpdated(uint256 deedId);
    event Paused(address account);
    event Unpaused(address account);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev Initializer function to set up the contract.
     */
    function initialize(
        address _accessManager,
        address _defaultValidator,
        address _validatorRegistry
    ) public initializer {
        __ERC721_init("DeedNFT", "DEED");
        __ERC721URIStorage_init();
        __Pausable_init();
        __AccessControl_init();

        AccessManagerBase.initialize(_accessManager);

        // Set up roles
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(VALIDATOR_ROLE, msg.sender);
        _setupRole(PAUSER_ROLE, msg.sender);

        // Initialize state variables
        defaultValidator = _defaultValidator;
        validatorRegistry = _validatorRegistry;
        nextDeedId = 1;
    }

    // Modifiers for function access control and validations
    modifier deedExists(uint256 _deedId) {
        require(_exists(_deedId), "DeedNFT: Deed does not exist");
        _;
    }

    modifier onlyDeedOwner(uint256 _deedId) {
        require(
            ownerOf(_deedId) == msg.sender,
            "DeedNFT: Caller is not the deed owner"
        );
        _;
    }

    modifier onlyValidatorOrOwner(uint256 _deedId) {
        require(
            hasRole(VALIDATOR_ROLE, msg.sender) || ownerOf(_deedId) == msg.sender,
            "DeedNFT: Caller is neither validator nor owner"
        );
        _;
    }

    // Functions for pausing and unpausing contract operations
    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
        emit Paused(msg.sender);
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
        emit Unpaused(msg.sender);
    }

    // Functions to set default validator and validator registry
    function setDefaultValidator(address _validator)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(
            _validator != address(0),
            "DeedNFT: Invalid validator address"
        );
        defaultValidator = _validator;
    }

    function setValidatorRegistry(address _registry)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(
            _registry != address(0),
            "DeedNFT: Invalid registry address"
        );
        validatorRegistry = _registry;
    }

    /**
     * @dev Mint a new deed NFT with comprehensive metadata.
     */
    function mintAsset(
        address _to,
        string memory _ipfsDetailsHash,
        AssetType _assetType,
        string memory _definition,
        string memory _operatingAgreement,
        string memory _configuration,
        address _validator
    ) public onlyRole(VALIDATOR_ROLE) whenNotPaused returns (uint256) {
        require(_to != address(0), "DeedNFT: Invalid recipient address");
        require(
            bytes(_definition).length > 0,
            "DeedNFT: Definition is required"
        );
        require(
            bytes(_operatingAgreement).length > 0,
            "DeedNFT: Operating agreement is required"
        );
        require(_validator != address(0), "DeedNFT: Validator address is required");

        uint256 deedId = nextDeedId;
        nextDeedId += 1;

        _mint(_to, deedId);

        DeedInfo storage deedInfo = deedInfoMap[deedId];
        deedInfo.assetType = _assetType;
        deedInfo.isValidated = true;
        deedInfo.definition = _definition;
        deedInfo.operatingAgreement = _operatingAgreement;
        deedInfo.configuration = _configuration;
        deedInfo.validator = _validator;

        _setTokenURI(deedId, _ipfsDetailsHash);

        emit DeedNFTMinted(deedId, deedInfo, msg.sender);
        return deedId;
    }

    /**
     * @dev Burn an existing deed NFT.
     */
    function burnAsset(uint256 _deedId)
        public
        onlyDeedOwner(_deedId)
        whenNotPaused
    {
        _burn(_deedId);
        delete deedInfoMap[_deedId];
        emit DeedNFTBurned(_deedId);
    }

    /**
     * @dev Validate or invalidate a deed NFT.
     */
    function validateAsset(uint256 _deedId, bool _isValid)
        public
        onlyRole(VALIDATOR_ROLE)
        whenNotPaused
    {
        require(
            ownerOf(_deedId) != msg.sender,
            "DeedNFT: Validator cannot validate own asset"
        );
        deedInfoMap[_deedId].isValidated = _isValid;
        emit DeedNFTValidatedChanged(_deedId, _isValid);
    }

    /**
     * @dev Update the metadata of a deed NFT.
     */
    function updateMetadata(
        uint256 _deedId,
        string memory _ipfsDetailsHash,
        string memory _definition,
        string memory _operatingAgreement,
        string memory _configuration
    ) public onlyValidatorOrOwner(_deedId) whenNotPaused {
        require(
            bytes(_definition).length > 0,
            "DeedNFT: Definition is required"
        );
        require(
            bytes(_operatingAgreement).length > 0,
            "DeedNFT: Operating agreement is required"
        );

        DeedInfo storage deedInfo = deedInfoMap[_deedId];
        deedInfo.definition = _definition;
        deedInfo.operatingAgreement = _operatingAgreement;
        deedInfo.configuration = _configuration;

        _setTokenURI(_deedId, _ipfsDetailsHash);

        if (!hasRole(VALIDATOR_ROLE, msg.sender)) {
            deedInfo.isValidated = false;
        }

        emit DeedNFTMetadataUpdated(_deedId);
    }

    /**
     * @dev Retrieve the metadata of a deed NFT.
     */
    function getDeedInfo(uint256 _deedId)
        public
        view
        deedExists(_deedId)
        returns (DeedInfo memory)
    {
        return deedInfoMap[_deedId];
    }

    /**
     * @dev Override the token URI function to use validator contracts.
     */
    function tokenURI(uint256 _deedId)
        public
        view
        override
        deedExists(_deedId)
        returns (string memory)
    {
        address validator = deedInfoMap[_deedId].validator;
        if (validator == address(0)) {
            validator = defaultValidator;
        }
        return IFabricaValidator(validator).uri(_deedId);
    }

    /**
     * @dev Support interface detection.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Upgradeable, AccessControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // Batch Operations

    /**
     * @dev Batch mint multiple deed NFTs.
     */
    function mintBatchAssets(
        address[] memory _toList,
        string[] memory _ipfsDetailsHashList,
        AssetType[] memory _assetTypes,
        string[] memory _definitions,
        string[] memory _operatingAgreements,
        string[] memory _configurations,
        address[] memory _validators
    ) public onlyRole(VALIDATOR_ROLE) whenNotPaused {
        uint256 length = _toList.length;
        require(
            length == _ipfsDetailsHashList.length &&
                length == _assetTypes.length &&
                length == _definitions.length &&
                length == _operatingAgreements.length &&
                length == _configurations.length &&
                length == _validators.length,
            "DeedNFT: Input arrays length mismatch"
        );

        for (uint256 i = 0; i < length; i++) {
            mintAsset(
                _toList[i],
                _ipfsDetailsHashList[i],
                _assetTypes[i],
                _definitions[i],
                _operatingAgreements[i],
                _configurations[i],
                _validators[i]
            );
        }
    }

    /**
     * @dev Batch burn multiple deed NFTs.
     */
    function burnBatchAssets(uint256[] memory _deedIds) public whenNotPaused {
        for (uint256 i = 0; i < _deedIds.length; i++) {
            if (ownerOf(_deedIds[i]) == msg.sender) {
                burnAsset(_deedIds[i]);
            }
        }
    }
}
