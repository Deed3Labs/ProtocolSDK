// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/**
 * @title UUPSUpgradeable
 * @dev Base contract for UUPS (Universal Upgradeable Proxy Standard) upgradeability mechanism.
 */
abstract contract UUPSUpgradeable is Initializable {
    /**
     * @dev Emitted when the implementation is upgraded.
     * @param newImplementation Address of the new implementation.
     */
    event Upgraded(address indexed newImplementation);

    /**
     * @dev Storage slot with the address of the current implementation.
     * This is the same as defined in the Proxy contract.
     */
    bytes32 private constant _IMPLEMENTATION_SLOT = 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;

    /**
     * @dev Performs the upgrade to `newImplementation`.
     * @param newImplementation Address of the new implementation.
     */
    function upgradeTo(address newImplementation) external virtual {
        _authorizeUpgrade(newImplementation);
        _upgradeTo(newImplementation);
    }

    /**
     * @dev Internal function to perform the upgrade.
     * @param newImplementation Address of the new implementation.
     */
    function _upgradeTo(address newImplementation) internal {
        require(newImplementation != address(0), "UUPSUpgradeable: new implementation is zero address");
        require(_isContract(newImplementation), "UUPSUpgradeable: new implementation is not a contract");

        _setImplementation(newImplementation);
        emit Upgraded(newImplementation);
    }

    /**
     * @dev Sets the implementation address in storage.
     * @param newImplementation Address of the new implementation.
     */
    function _setImplementation(address newImplementation) private {
        bytes32 slot = _IMPLEMENTATION_SLOT;
        // solhint-disable-next-line no-inline-assembly
        assembly {
            sstore(slot, newImplementation)
        }
    }

    /**
     * @dev Returns the current implementation address.
     */
    function _getImplementation() internal view returns (address impl) {
        bytes32 slot = _IMPLEMENTATION_SLOT;
        // solhint-disable-next-line no-inline-assembly
        assembly {
            impl := sload(slot)
        }
    }

    /**
     * @dev Function that should revert when `msg.sender` is not authorized to upgrade the contract.
     * Called by `upgradeTo`.
     * @param newImplementation Address of the new implementation.
     */
    function _authorizeUpgrade(address newImplementation) internal virtual;

    /**
     * @dev Checks if an address is a contract.
     * @param account Address to check.
     * @return True if `account` is a contract, false otherwise.
     */
    function _isContract(address account) internal view returns (bool) {
        uint256 size;
        // solhint-disable-next-line no-inline-assembly
        assembly {
            size := extcodesize(account)
        }
        return size > 0;
    }

    uint256[50] private __gap; // Storage gap for future upgrades
}
