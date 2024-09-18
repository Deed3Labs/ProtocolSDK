// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.20;

/**
 * @title IValidatorRegistry
 * @dev Interface for ValidatorRegistry contracts.
 */
interface IValidatorRegistry {
    /**
     * @dev Returns the name associated with a validator address.
     * @param validator Address of the validator.
     * @return Name string.
     */
    function getValidatorName(address validator)
        external
        view
        returns (string memory);

    /**
     * @dev Checks if a validator is registered.
     * @param validator Address of the validator.
     * @return True if registered, false otherwise.
     */
    function isValidatorRegistered(address validator)
        external
        view
        returns (bool);
}
