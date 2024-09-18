// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.20;

// OpenZeppelin Upgradeable Contracts
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/introspection/ERC165Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

// External validator and registry interfaces
import "./IValidator.sol";
import "./IValidatorRegistry.sol";

/**
 * @title DeedNFT
 * @dev An ERC-721 token representing deeds with complex metadata and validator integration.
 *      Implements UUPSUpgradeable for upgradability.
 */
contract DeedNFT is
    Initializable,
    ERC721URIStorageUpgradeable,
    AccessControlUpgradeable,
    PausableUpgradeable,
    UUPSUpgradeable
{
    using StringsUpgradeable for uint256;
    using AddressUpgradeable for address;

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
    event DeedNFTMinted(
        uint256 indexed deedId,
        DeedInfo deedInfo,
        address indexed minter,
        address validator
    );
    event DeedNFTBurned(uint256 indexed deedId);
    event DeedNFTValidatedChanged(uint256 indexed deedId, bool isValid);
    event DeedNFTMetadataUpdated(uint256 indexed deedId);
    event Paused(address account);
    event Unpaused(address account);

    // Storage gap for future upgrades
    uint256[50] private __gap;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev Initializes the contract with default validator and registry addresses.
     * @param _defaultValidator Address of the default validator contract.
     * @param _validatorRegistry Address of the validator registry contract.
     */
    function initialize(
        address _defaultValidator,
        address _validatorRegistry
    ) public initializer {
        __ERC721_init("DeedNFT", "DEED");
        __ERC721URIStorage_init();
        __AccessControl_init();
        __Pausable_init();
        __UUPSUpgradeable_init(); // Initialize UUPSUpgradeable

        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(VALIDATOR_ROLE, msg.sender);

        defaultValidator = _defaultValidator;
        validatorRegistry = _validatorRegistry;
        nextDeedId = 1;
    }

    /**
     * @dev Authorizes the contract upgrade. Only accounts with DEFAULT_ADMIN_ROLE can upgrade.
     * @param newImplementation Address of the new implementation contract.
     */
    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        // Authorization logic handled by onlyRole modifier
    }

    // Modifiers

    modifier deedExists(uint256 deedId) {
        require(_exists(deedId), "DeedNFT: Deed does not exist");
        _;
    }

    modifier onlyDeedOwner(uint256 deedId) {
        require(
            ownerOf(deedId) == msg.sender,
            "DeedNFT: Caller is not the owner"
        );
        _;
    }

    modifier onlyValidatorOrOwner(uint256 deedId) {
        require(
            hasRole(VALIDATOR_ROLE, msg.sender) ||
                ownerOf(deedId) == msg.sender,
            "DeedNFT: Caller is not validator or owner"
        );
        _;
    }

    // Pausable functions

    /**
     * @dev Pauses all contract operations.
     */
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
        emit Paused(msg.sender);
    }

    /**
     * @dev Unpauses all contract operations.
     */
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
        emit Unpaused(msg.sender);
    }

    // Validator functions

    /**
     * @dev Sets the default validator address.
     * @param validator Address of the new default validator.
     */
    function setDefaultValidator(address validator)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(validator != address(0), "DeedNFT: Invalid validator address");
        require(
            IValidatorRegistry(validatorRegistry).isValidatorRegistered(
                validator
            ),
            "DeedNFT: Validator is not registered"
        );
        defaultValidator = validator;
    }

    /**
     * @dev Sets the validator registry address.
     * @param registry Address of the validator registry.
     */
    function setValidatorRegistry(address registry)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(registry != address(0), "DeedNFT: Invalid registry address");
        validatorRegistry = registry;
    }

    // Minting functions

    /**
     * @dev Mints a new deed to the specified owner.
     * @param owner Address of the deed owner.
     * @param assetType Type of the asset.
     * @param ipfsDetailsHash IPFS hash of the deed details.
     * @param operatingAgreement Operating agreement associated with the deed.
     * @param definition Definition of the deed.
     * @param configuration Configuration data for the deed.
     * @param validator Address of the validator contract.
     * @return The ID of the minted deed.
     */
    function mintAsset(
        address owner,
        AssetType assetType,
        string memory ipfsDetailsHash,
        string memory operatingAgreement,
        string memory definition,
        string memory configuration,
        address validator
    ) external onlyRole(VALIDATOR_ROLE) whenNotPaused returns (uint256) {
        require(owner != address(0), "DeedNFT: Invalid owner address");
        require(
            bytes(ipfsDetailsHash).length > 0,
            "DeedNFT: IPFS details hash is required"
        );
        require(
            bytes(operatingAgreement).length > 0,
            "DeedNFT: Operating agreement is required"
        );
        require(
            bytes(definition).length > 0,
            "DeedNFT: Definition is required"
        );
        require(
            validator != address(0),
            "DeedNFT: Validator address is required"
        );

        // Ensure validator is registered and supports IValidator interface
        require(
            IValidatorRegistry(validatorRegistry).isValidatorRegistered(
                validator
            ),
            "DeedNFT: Validator is not registered"
        );
        require(
            IERC165Upgradeable(validator).supportsInterface(
                type(IValidator).interfaceId
            ),
            "DeedNFT: Validator does not support IValidator interface"
        );

        // Check if operating agreement is valid
        string memory agreementName = IValidator(validator)
            .operatingAgreementName(operatingAgreement);
        require(
            bytes(agreementName).length > 0,
            "DeedNFT: Invalid operating agreement"
        );

        uint256 deedId = nextDeedId++;
        _mint(owner, deedId);
        _setTokenURI(deedId, ipfsDetailsHash);

        DeedInfo storage deedInfo = deedInfoMap[deedId];
        deedInfo.assetType = assetType;
        deedInfo.isValidated = true;
        deedInfo.operatingAgreement = operatingAgreement;
        deedInfo.definition = definition;
        deedInfo.configuration = configuration;
        deedInfo.validator = validator;

        emit DeedNFTMinted(deedId, deedInfo, msg.sender, validator);
        return deedId;
    }

    /**
     * @dev Batch mints multiple deeds.
     * @param owners Array of owner addresses.
     * @param assetTypes Array of asset types.
     * @param ipfsDetailsHashes Array of IPFS details hashes.
     * @param operatingAgreements Array of operating agreements.
     * @param definitions Array of definitions.
     * @param configurations Array of configurations.
     * @param validators Array of validator addresses.
     * @return Array of minted deed IDs.
     */
    function mintBatchAssets(
        address[] memory owners,
        AssetType[] memory assetTypes,
        string[] memory ipfsDetailsHashes,
        string[] memory operatingAgreements,
        string[] memory definitions,
        string[] memory configurations,
        address[] memory validators
    ) external onlyRole(VALIDATOR_ROLE) whenNotPaused returns (uint256[] memory) {
        uint256 len = owners.length;
        require(
            len == assetTypes.length &&
                len == ipfsDetailsHashes.length &&
                len == operatingAgreements.length &&
                len == definitions.length &&
                len == configurations.length &&
                len == validators.length,
            "DeedNFT: Input arrays length mismatch"
        );

        uint256[] memory deedIds = new uint256[](len);

        for (uint256 i = 0; i < len; i++) {
            deedIds[i] = mintAsset(
                owners[i],
                assetTypes[i],
                ipfsDetailsHashes[i],
                operatingAgreements[i],
                definitions[i],
                configurations[i],
                validators[i]
            );
        }

        return deedIds;
    }

    // Burning functions

    /**
     * @dev Burns a deed owned by the caller.
     * @param deedId ID of the deed to burn.
     */
    function burnAsset(uint256 deedId)
        external
        onlyDeedOwner(deedId)
        whenNotPaused
    {
        _burn(deedId);
        delete deedInfoMap[deedId];
        emit DeedNFTBurned(deedId);
    }

    /**
     * @dev Batch burns multiple deeds owned by the caller.
     * @param deedIds Array of deed IDs to burn.
     */
    function burnBatchAssets(uint256[] memory deedIds)
        external
        whenNotPaused
    {
        for (uint256 i = 0; i < deedIds.length; i++) {
            uint256 deedId = deedIds[i];
            require(
                ownerOf(deedId) == msg.sender,
                "DeedNFT: Caller is not the owner of all deeds"
            );
            burnAsset(deedId);
        }
    }

    // Validation functions

    /**
     * @dev Validates or invalidates a deed.
     * @param deedId ID of the deed.
     * @param isValid Validation status to set.
     */
    function validateAsset(uint256 deedId, bool isValid)
        external
        onlyRole(VALIDATOR_ROLE)
        whenNotPaused
    {
        require(
            ownerOf(deedId) != msg.sender,
            "DeedNFT: Validator cannot validate own asset"
        );
        deedInfoMap[deedId].isValidated = isValid;
        emit DeedNFTValidatedChanged(deedId, isValid);
    }

    // Metadata functions

    /**
     * @dev Updates the metadata of a deed.
     * @param deedId ID of the deed.
     * @param ipfsDetailsHash New IPFS details hash.
     * @param operatingAgreement New operating agreement.
     * @param definition New definition.
     * @param configuration New configuration.
     */
    function updateMetadata(
        uint256 deedId,
        string memory ipfsDetailsHash,
        string memory operatingAgreement,
        string memory definition,
        string memory configuration
    ) external onlyValidatorOrOwner(deedId) whenNotPaused {
        require(
            bytes(ipfsDetailsHash).length > 0,
            "DeedNFT: IPFS details hash is required"
        );
        require(
            bytes(operatingAgreement).length > 0,
            "DeedNFT: Operating agreement is required"
        );
        require(
            bytes(definition).length > 0,
            "DeedNFT: Definition is required"
        );

        // Check if operating agreement is valid
        DeedInfo storage deedInfo = deedInfoMap[deedId];
        address validatorAddress = deedInfo.validator != address(0)
            ? deedInfo.validator
            : defaultValidator;

        require(
            validatorAddress != address(0),
            "DeedNFT: No validator available"
        );
        require(
            IERC165Upgradeable(validatorAddress).supportsInterface(
                type(IValidator).interfaceId
            ),
            "DeedNFT: Validator does not support IValidator interface"
        );

        string memory agreementName = IValidator(validatorAddress)
            .operatingAgreementName(operatingAgreement);
        require(
            bytes(agreementName).length > 0,
            "DeedNFT: Invalid operating agreement"
        );

        _setTokenURI(deedId, ipfsDetailsHash);

        deedInfo.operatingAgreement = operatingAgreement;
        deedInfo.definition = definition;
        deedInfo.configuration = configuration;

        if (!hasRole(VALIDATOR_ROLE, msg.sender)) {
            deedInfo.isValidated = false;
        }

        emit DeedNFTMetadataUpdated(deedId);
    }

    // Getter functions

    /**
     * @dev Retrieves the deed information.
     * @param deedId ID of the deed.
     * @return DeedInfo structure containing deed details.
     */
    function getDeedInfo(uint256 deedId)
        external
        view
        deedExists(deedId)
        returns (DeedInfo memory)
    {
        return deedInfoMap[deedId];
    }

    /**
     * @dev Determines whether the asset can be subdivided based on its type.
     * @param deedId ID of the deed.
     * @return True if the asset can be subdivided, false otherwise.
     */
    function canSubdivide(uint256 deedId)
        external
        view
        deedExists(deedId)
        returns (bool)
    {
        AssetType assetType = deedInfoMap[deedId].assetType;
        return assetType == AssetType.Land || assetType == AssetType.Estate;
    }

    /**
     * @dev Returns the token URI, potentially using a validator contract.
     * @param deedId ID of the deed.
     * @return The token URI string.
     */
    function tokenURI(uint256 deedId)
        public
        view
        override
        deedExists(deedId)
        returns (string memory)
    {
        DeedInfo storage deedInfo = deedInfoMap[deedId];
        address validatorAddress = deedInfo.validator != address(0)
            ? deedInfo.validator
            : defaultValidator;

        require(
            validatorAddress != address(0),
            "DeedNFT: No validator available"
        );
        require(
            validatorAddress.isContract(),
            "DeedNFT: Validator address is not a contract"
        );
        require(
            IERC165Upgradeable(validatorAddress).supportsInterface(
                type(IValidator).interfaceId
            ),
            "DeedNFT: Validator does not support IValidator interface"
        );

        IValidator validator = IValidator(validatorAddress);
        return validator.tokenURI(deedId);
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
