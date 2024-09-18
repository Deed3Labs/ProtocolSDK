// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.20;

/**
 * @title Proxy
 * @dev Minimal proxy contract for UUPS (Universal Upgradeable Proxy Standard) pattern.
 */
contract Proxy {
    /**
     * @dev Storage slot with the address of the current implementation.
     * This is keccak256("eip1967.proxy.implementation") - 1.
     */
    bytes32 private constant _IMPLEMENTATION_SLOT = 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;

    /**
     * @dev Initializes the proxy with an initial implementation specified by `_logic`.
     * @param _logic Address of the initial implementation.
     * @param _data Data to send as msg.data to the implementation to initialize it.
     * This should include the function signature and arguments.
     */
    constructor(address _logic, bytes memory _data) payable {
        require(_logic != address(0), "Proxy: implementation address cannot be zero");
        _setImplementation(_logic);

        if (_data.length > 0) {
            (bool success, ) = _logic.delegatecall(_data);
            require(success, "Proxy: initialization failed");
        }
    }

    /**
     * @dev Delegates the current call to the implementation.
     */
    fallback() external payable virtual {
        _delegate(_implementation());
    }

    receive() external payable virtual {
        _delegate(_implementation());
    }

    /**
     * @dev Returns the address of the current implementation.
     */
    function _implementation() internal view virtual returns (address impl) {
        bytes32 slot = _IMPLEMENTATION_SLOT;
        // solhint-disable-next-line no-inline-assembly
        assembly {
            impl := sload(slot)
        }
    }

    /**
     * @dev Stores a new address in the implementation slot.
     * @param newImplementation Address of the new implementation.
     */
    function _setImplementation(address newImplementation) private {
        require(newImplementation != address(0), "Proxy: new implementation cannot be zero address");
        bytes32 slot = _IMPLEMENTATION_SLOT;
        // solhint-disable-next-line no-inline-assembly
        assembly {
            sstore(slot, newImplementation)
        }
    }

    /**
     * @dev Delegates the call to the implementation.
     * @param impl Address of the implementation contract.
     */
    function _delegate(address impl) internal virtual {
        require(impl != address(0), "Proxy: implementation address not set");
        // solhint-disable-next-line no-inline-assembly
        assembly {
            // Copy msg.data. We take full control of memory in this inline assembly block.
            calldatacopy(0, 0, calldatasize())

            // Call the implementation.
            // out and outsize are 0 because we don't know the size yet.
            let result := delegatecall(gas(), impl, 0, calldatasize(), 0, 0)

            // Copy the returned data.
            returndatacopy(0, 0, returndatasize())

            switch result
            // delegatecall returns 0 on error.
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return(0, returndatasize())
            }
        }
    }
}
