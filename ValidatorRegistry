// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.20;

// OpenZeppelin Upgradeable Contracts
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

// Interface
import "./IValidatorRegistry.sol";

/**
 * @title ValidatorRegistry
 * @dev Registry for managing validator contracts.
 *      Implements UUPSUpgradeable for upgradability.
 */
contract ValidatorRegistry is
    Initializable,
    OwnableUpgradeable,
    IValidatorRegistry,
    UUPSUpgradeable
{
    // Mapping from validator address to validator name
    mapping(address => string) private validatorNames;

    // Events
    event ValidatorRegistered(address indexed validator, string name);
    event ValidatorRemoved(address indexed validator);

    // Storage gap for future upgrades
    uint256[50] private __gap;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev Initializes the ValidatorRegistry contract.
     */
    function initialize() public initializer {
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    /**
     * @dev Authorizes the contract upgrade. Only the owner can upgrade.
     * @param newImplementation Address of the new implementation contract.
     */
    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyOwner
    {
        // Authorization logic handled by onlyOwner modifier
    }

    /**
     * @dev Registers a new validator.
     * @param validator Address of the validator contract.
     * @param name Name associated with the validator.
     */
    function registerValidator(address validator, string memory name)
        public
        onlyOwner
    {
        require(
            validator != address(0),
            "ValidatorRegistry: Invalid validator address"
        );
        require(
            bytes(name).length > 0,
            "ValidatorRegistry: Name cannot be empty"
        );
        require(
            bytes(validatorNames[validator]).length == 0,
            "ValidatorRegistry: Validator already registered"
        );

        validatorNames[validator] = name;
        emit ValidatorRegistered(validator, name);
    }

    /**
     * @dev Removes a validator from the registry.
     * @param validator Address of the validator contract.
     */
    function removeValidator(address validator) public onlyOwner {
        require(
            bytes(validatorNames[validator]).length > 0,
            "ValidatorRegistry: Validator not registered"
        );

        delete validatorNames[validator];
        emit ValidatorRemoved(validator);
    }

    /**
     * @dev Updates the name of a registered validator.
     * @param validator Address of the validator contract.
     * @param newName New name to associate with the validator.
     */
    function updateValidatorName(address validator, string memory newName)
        public
        onlyOwner
    {
        require(
            bytes(validatorNames[validator]).length > 0,
            "ValidatorRegistry: Validator not registered"
        );
        require(
            bytes(newName).length > 0,
            "ValidatorRegistry: Name cannot be empty"
        );

        validatorNames[validator] = newName;
        emit ValidatorRegistered(validator, newName);
    }

    /**
     * @dev Returns the name associated with a validator address.
     * @param validator Address of the validator.
     * @return Name string.
     */
    function getValidatorName(address validator)
        external
        view
        override
        returns (string memory)
    {
        return validatorNames[validator];
    }

    /**
     * @dev Checks if a validator is registered.
     * @param validator Address of the validator.
     * @return True if registered, false otherwise.
     */
    function isValidatorRegistered(address validator)
        external
        view
        override
        returns (bool)
    {
        return bytes(validatorNames[validator]).length > 0;
    }
}
