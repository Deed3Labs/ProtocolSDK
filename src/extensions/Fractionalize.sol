// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";

/// @notice Minimal interface for a DeedNFT asset.
interface IDeedNFT {
    function ownerOf(uint256 tokenId) external view returns (address);
    function transferFrom(address from, address to, uint256 tokenId) external;
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
}

/// @notice Minimal interface for a Subdivide asset.
interface ISubdivide {
    function ownerOf(uint256 tokenId) external view returns (address);
    function transferFrom(address from, address to, uint256 tokenId) external;
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
}

contract Fractionalize is 
    Initializable,
    ERC1155Upgradeable,
    AccessControlUpgradeable,
    PausableUpgradeable,
    UUPSUpgradeable 
{
    using StringsUpgradeable for uint256;

    // ========= Role Definitions =========
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    // ========= Contract References =========
    IDeedNFT public deedNFT;
    ISubdivide public subdivideNFT;

    // ========= Asset Type =========
    enum FractionAssetType { DeedNFT, SubdivisionNFT }

    // ========= Data Structures =========
    struct FractionInfo {
        string name;
        string description;
        string symbol;
        string collectionUri;
        uint256 totalShares;
        uint256 activeShares;
        uint256 maxSharesPerWallet;
        uint256 requiredApprovalPercentage;
        bool isActive;
        bool burnable;
        FractionAssetType assetType;
        uint256 originalTokenId;
        address collectionAdmin;
        // These mappings are stored in storage and cannot be returned in a single struct.
        mapping(uint256 => string) shareMetadata;
        mapping(address => bool) transferApprovals;
        mapping(address => bool) adminApprovals;
    }

    // ========= State Variables =========
    mapping(uint256 => FractionInfo) private fractions;
    uint256 public nextFractionId;

    // ========= Events =========
    event FractionCreated(uint256 indexed fractionId, FractionAssetType assetType, uint256 originalTokenId);
    event ShareMinted(uint256 indexed fractionId, uint256 indexed shareId, address to);
    event ShareBurned(uint256 indexed fractionId, uint256 indexed shareId);
    event AssetLocked(uint256 indexed fractionId, uint256 originalTokenId);
    event AssetUnlocked(uint256 indexed fractionId, uint256 originalTokenId, address to);
    event TransferApprovalSet(uint256 indexed fractionId, address indexed approver, bool approved);
    event AdminApprovalSet(uint256 indexed fractionId, address indexed approver, bool approved);

    // ========= Constructor & Initializer =========
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }
    
    function initialize(address _deedNFT, address _subdivideNFT) public initializer {
        __ERC1155_init(""); // empty URI (we override uri() below)
        __AccessControl_init();
        __Pausable_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);

        require(_deedNFT != address(0) && _subdivideNFT != address(0), "Invalid NFT addresses");
        deedNFT = IDeedNFT(_deedNFT);
        subdivideNFT = ISubdivide(_subdivideNFT);
        nextFractionId = 1;
    }

    // ========= Parameter Structs =========
    struct FractionCreationParams {
        FractionAssetType assetType;
        uint256 originalTokenId;
        string name;
        string description;
        string symbol;
        string collectionUri;
        uint256 totalShares;
        bool burnable;
        uint256 approvalPercentage;
    }

    struct BatchMintParams {
        uint256 fractionId;
        uint256[] shareIds;
        address[] recipients;
    }

    struct UnlockParams {
        uint256 fractionId;
        address to;
        bool checkApprovals;
    }

    // ========= Core Functions =========

    /// @notice Creates a new fraction by locking an NFT asset.
    function createFraction(FractionCreationParams calldata params) external whenNotPaused {
        require(params.totalShares > 0, "Invalid shares amount");
        require(bytes(params.symbol).length > 0, "Symbol required");
        require(params.approvalPercentage >= 51 && params.approvalPercentage <= 100, "Approval percentage must be between 51 and 100");

        // Transfer asset from caller to contract
        if (params.assetType == FractionAssetType.DeedNFT) {
            require(deedNFT.ownerOf(params.originalTokenId) == msg.sender, "Not asset owner");
            deedNFT.transferFrom(msg.sender, address(this), params.originalTokenId);
        } else {
            require(subdivideNFT.ownerOf(params.originalTokenId) == msg.sender, "Not asset owner");
            subdivideNFT.transferFrom(msg.sender, address(this), params.originalTokenId);
        }

        uint256 fractionId = nextFractionId++;
        FractionInfo storage newFraction = fractions[fractionId];
        newFraction.name = params.name;
        newFraction.description = params.description;
        newFraction.symbol = params.symbol;
        newFraction.collectionUri = params.collectionUri;
        newFraction.totalShares = params.totalShares;
        newFraction.activeShares = 0;
        newFraction.maxSharesPerWallet = params.totalShares; // default: each wallet can hold all shares
        newFraction.requiredApprovalPercentage = params.approvalPercentage;
        newFraction.isActive = true;
        newFraction.burnable = params.burnable;
        newFraction.assetType = params.assetType;
        newFraction.originalTokenId = params.originalTokenId;
        newFraction.collectionAdmin = msg.sender;

        emit FractionCreated(fractionId, params.assetType, params.originalTokenId);
        emit AssetLocked(fractionId, params.originalTokenId);
    }

    /// @notice Mints a single share for a given fraction.
    function mintShare(uint256 fractionId, uint256 shareId, address to) external whenNotPaused {
        FractionInfo storage fraction = fractions[fractionId];
        require(fraction.isActive, "Fraction not active");
        require(shareId < fraction.totalShares, "Invalid share ID");
        require(fraction.activeShares < fraction.totalShares, "All shares minted");

        address recipient = (to == address(0)) ? msg.sender : to;
        require(canReceiveShares(fractionId, recipient), "Exceeds wallet limit");

        _validateAndMintShare(fraction, fractionId, shareId, recipient);
    }

    /// @notice Batch-mints multiple shares.
    function batchMintShares(BatchMintParams calldata params) external whenNotPaused {
        FractionInfo storage fraction = fractions[params.fractionId];
        require(fraction.isActive, "Fraction not active");
        require(params.shareIds.length == params.recipients.length, "Array length mismatch");
        require(fraction.activeShares + params.shareIds.length <= fraction.totalShares, "Exceeds total shares");

        // Only the original owner (of the locked asset) can initiate batch minting.
        address originalOwner = (fraction.assetType == FractionAssetType.DeedNFT)
            ? deedNFT.ownerOf(fraction.originalTokenId)
            : subdivideNFT.ownerOf(fraction.originalTokenId);
        require(msg.sender == originalOwner, "Not original owner");

        for (uint256 i = 0; i < params.shareIds.length; i++) {
            require(params.shareIds[i] < fraction.totalShares, "Invalid share ID");
            address recipient = (params.recipients[i] == address(0)) ? msg.sender : params.recipients[i];
            require(canReceiveShares(params.fractionId, recipient), "Exceeds wallet limit");

            uint256 tokenId = _generateTokenId(params.fractionId, params.shareIds[i]);
            _mint(recipient, tokenId, 1, "");
            fraction.activeShares += 1;
            emit ShareMinted(params.fractionId, params.shareIds[i], recipient);
        }
    }

    /// @notice Burns a share (if burning is enabled).
    function burnShare(uint256 fractionId, uint256 shareId) external whenNotPaused {
        FractionInfo storage fraction = fractions[fractionId];
        require(fraction.isActive, "Fraction not active");
        require(fraction.burnable, "Burning not allowed");

        uint256 tokenId = _generateTokenId(fractionId, shareId);
        require(balanceOf(msg.sender, tokenId) > 0, "Not share owner");

        _burn(msg.sender, tokenId, 1);
        fraction.activeShares -= 1;
        emit ShareBurned(fractionId, shareId);
    }

    /// @notice Unlocks the underlying asset by burning all shares.
    function unlockAsset(UnlockParams calldata params) external whenNotPaused {
        require(params.to != address(0), "Invalid recipient");
        FractionInfo storage fraction = fractions[params.fractionId];
        require(fraction.isActive, "Fraction not active");

        if (params.checkApprovals) {
            require(_checkApproval(params.fractionId), "Transfer not approved");
        } else {
            require(getVotingPower(params.fractionId, msg.sender) == fraction.activeShares, "Must own all shares");
        }

        _burnAllShares(params.fractionId);
        _transferAsset(fraction, params.to);
        fraction.isActive = false;
        emit AssetUnlocked(params.fractionId, fraction.originalTokenId, params.to);
    }

    // ========= Internal Helper Functions =========

    /// @notice Generates a unique tokenId from fractionId and shareId.
    function _generateTokenId(uint256 fractionId, uint256 shareId) internal pure returns (uint256) {
        // The upper 128 bits hold fractionId and the lower 128 the shareId.
        return (fractionId << 128) | shareId;
    }

    /// @notice Internal helper to mint a share.
    function _validateAndMintShare(
        FractionInfo storage fraction,
        uint256 fractionId,
        uint256 shareId,
        address recipient
    ) internal {
        // Only the original asset owner can mint new shares.
        address originalOwner = (fraction.assetType == FractionAssetType.DeedNFT)
            ? deedNFT.ownerOf(fraction.originalTokenId)
            : subdivideNFT.ownerOf(fraction.originalTokenId);
        require(msg.sender == originalOwner, "Not original owner");

        uint256 tokenId = _generateTokenId(fractionId, shareId);
        _mint(recipient, tokenId, 1, "");
        fraction.activeShares += 1;
        emit ShareMinted(fractionId, shareId, recipient);
    }

    /// @notice Burns all shares held by the caller for a given fraction.
    function _burnAllShares(uint256 fractionId) internal {
        FractionInfo storage fraction = fractions[fractionId];
        for (uint256 i = 0; i < fraction.totalShares; i++) {
            uint256 tokenId = _generateTokenId(fractionId, i);
            // If the caller owns a share, burn it.
            if (balanceOf(msg.sender, tokenId) > 0) {
                _burn(msg.sender, tokenId, 1);
                emit ShareBurned(fractionId, i);
            }
        }
    }

    /// @notice Transfers the underlying asset to a recipient.
    function _transferAsset(FractionInfo storage fraction, address to) internal {
        if (fraction.assetType == FractionAssetType.DeedNFT) {
            deedNFT.transferFrom(address(this), to, fraction.originalTokenId);
        } else {
            subdivideNFT.transferFrom(address(this), to, fraction.originalTokenId);
        }
    }

    // ========= Approval & Voting Functions =========

    /// @notice Sets transfer approval for a given fraction.
    function setTransferApproval(uint256 fractionId, bool approved) external whenNotPaused {
        FractionInfo storage fraction = fractions[fractionId];
        require(fraction.isActive, "Fraction not active");
        require(getVotingPower(fractionId, msg.sender) > 0, "No shares owned");
        
        fraction.transferApprovals[msg.sender] = approved;
        emit TransferApprovalSet(fractionId, msg.sender, approved);
    }

    /// @notice Sets admin approval for a given fraction.
    function setAdminApproval(uint256 fractionId, bool approved) external whenNotPaused {
        FractionInfo storage fraction = fractions[fractionId];
        require(fraction.isActive, "Fraction not active");
        require(getVotingPower(fractionId, msg.sender) > 0, "No shares owned");
        
        fraction.adminApprovals[msg.sender] = approved;
        emit AdminApprovalSet(fractionId, msg.sender, approved);
    }

    /// @notice Returns the voting power (number of shares owned) for an account.
    function getVotingPower(uint256 fractionId, address account) public view returns (uint256) {
        FractionInfo storage fraction = fractions[fractionId];
        uint256 votingPower = 0;
        for (uint256 i = 0; i < fraction.totalShares; i++) {
            uint256 tokenId = _generateTokenId(fractionId, i);
            if (balanceOf(account, tokenId) > 0) {
                votingPower++;
            }
        }
        return votingPower;
    }

    /// @notice Checks if the required approval percentage is met for the fraction.
    function _checkApproval(uint256 fractionId) internal view returns (bool) {
        FractionInfo storage fraction = fractions[fractionId];
        uint256 totalVotes = 0;
        uint256 approvalVotes = 0;

        for (uint256 i = 0; i < fraction.totalShares; i++) {
            uint256 tokenId = _generateTokenId(fractionId, i);
            // For simplicity, we assume msg.sender's voting is counted if they hold any share.
            if (balanceOf(msg.sender, tokenId) > 0) {
                totalVotes++;
                if (fraction.adminApprovals[msg.sender]) {
                    approvalVotes++;
                }
            }
        }
        if (totalVotes == 0) {
            return false;
        }
        return (approvalVotes * 100) / totalVotes >= fraction.requiredApprovalPercentage;
    }

    /// @notice Checks if an account can receive another share (based on wallet limit).
    function canReceiveShares(uint256 fractionId, address account) public view returns (bool) {
        FractionInfo storage fraction = fractions[fractionId];
        if (!fraction.isActive || fraction.maxSharesPerWallet == 0) {
            return true;
        }
        return getVotingPower(fractionId, account) < fraction.maxSharesPerWallet;
    }

    // ========= View Functions for Fraction Details =========
    struct FractionBasicInfo {
        string name;
        string symbol;
        uint256 totalShares;
        uint256 activeShares;
        uint256 maxSharesPerWallet;
    }

    struct FractionExtendedInfo {
        string description;
        string collectionUri;
        uint256 requiredApprovalPercentage;
        bool isActive;
        bool burnable;
    }

    struct FractionOwnershipInfo {
        FractionAssetType assetType;
        uint256 originalTokenId;
        address collectionAdmin;
    }

    function getFractionBasicInfo(uint256 fractionId) external view returns (FractionBasicInfo memory) {
        FractionInfo storage fraction = fractions[fractionId];
        return FractionBasicInfo({
            name: fraction.name,
            symbol: fraction.symbol,
            totalShares: fraction.totalShares,
            activeShares: fraction.activeShares,
            maxSharesPerWallet: fraction.maxSharesPerWallet
        });
    }

    function getFractionExtendedInfo(uint256 fractionId) external view returns (FractionExtendedInfo memory) {
        FractionInfo storage fraction = fractions[fractionId];
        return FractionExtendedInfo({
            description: fraction.description,
            collectionUri: fraction.collectionUri,
            requiredApprovalPercentage: fraction.requiredApprovalPercentage,
            isActive: fraction.isActive,
            burnable: fraction.burnable
        });
    }

    function getFractionOwnershipInfo(uint256 fractionId) external view returns (FractionOwnershipInfo memory) {
        FractionInfo storage fraction = fractions[fractionId];
        return FractionOwnershipInfo({
            assetType: fraction.assetType,
            originalTokenId: fraction.originalTokenId,
            collectionAdmin: fraction.collectionAdmin
        });
    }

    /// @notice Returns share metadata if set; otherwise builds a URI from collectionUri and shareId.
    function getShareMetadata(uint256 fractionId, uint256 shareId) external view returns (string memory) {
        FractionInfo storage fraction = fractions[fractionId];
        require(fraction.isActive, "Fraction not active");
        require(shareId < fraction.totalShares, "Invalid share ID");
        string memory meta = fraction.shareMetadata[shareId];
        if (bytes(meta).length > 0) {
            return meta;
        }
        return string(abi.encodePacked(fraction.collectionUri, "/", shareId.toString()));
    }

    /// @notice Returns approval statuses for an account.
    function getApprovals(uint256 fractionId, address account) external view returns (bool transferApproved, bool adminApproved) {
        FractionInfo storage fraction = fractions[fractionId];
        return (fraction.transferApprovals[account], fraction.adminApprovals[account]);
    }

    // ========= Admin Functions =========
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    // ========= Overrides =========

    /// @notice Override for ERC1155 URI. Returns metadata for a token if set.
    function uri(uint256 tokenId) public view override returns (string memory) {
        uint256 fractionId = tokenId >> 128;
        uint256 shareId = tokenId & ((1 << 128) - 1);
        FractionInfo storage fraction = fractions[fractionId];
        require(fraction.isActive, "Fraction not active");
        string memory meta = fraction.shareMetadata[shareId];
        if (bytes(meta).length > 0) {
            return meta;
        }
        return string(abi.encodePacked(fraction.collectionUri, "/", shareId.toString()));
    }

    /// @notice Override for supportsInterface to satisfy both ERC1155 and AccessControl.
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155Upgradeable, AccessControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @dev Override safeTransferFrom to include extra transfer validations.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public virtual override {
        require(!paused(), "Pausable: paused");
        // For transfers (not minting or burning) add our custom validations
        if (from != address(0) && to != address(0)) {
            uint256 fractionId = id >> 128;
            FractionInfo storage fraction = fractions[fractionId];
            require(fraction.isActive, "Fraction not active");
            require(canReceiveShares(fractionId, to), "Exceeds wallet limit");
        }
        super.safeTransferFrom(from, to, id, amount, data);
    }

    /**
     * @dev Override safeBatchTransferFrom to include extra transfer validations.
     */
    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public virtual override {
        require(!paused(), "Pausable: paused");
        // For batch transfers, perform our custom validations on each token ID
        if (from != address(0) && to != address(0)) {
            for (uint256 i = 0; i < ids.length; i++) {
                uint256 fractionId = ids[i] >> 128;
                FractionInfo storage fraction = fractions[fractionId];
                require(fraction.isActive, "Fraction not active");
                require(canReceiveShares(fractionId, to), "Exceeds wallet limit");
            }
        }
        super.safeBatchTransferFrom(from, to, ids, amounts, data);
    }

    /// @notice Required override for UUPS upgradability.
    function _authorizeUpgrade(address newImplementation) internal override onlyRole(DEFAULT_ADMIN_ROLE) {}

}
