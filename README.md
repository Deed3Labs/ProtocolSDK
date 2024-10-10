# DeedNFT Contracts - The Deed Protocol

This repository contains the smart contracts for **The Deed Protocol**, which facilitates decentralized real estate transactions through NFTs. These contracts are designed to represent real estate assets as ERC721 tokens, ensuring seamless interaction with external validation services and supporting upgradeability for future expansions.

## Overview

The **Deed Protocol** brings blockchain technology to the real estate industry by tokenizing property ownership and management. Each property deed is represented as a unique, non-fungible token (NFT) on the blockchain, allowing for decentralized and secure ownership records. 

Key components of the protocol include:
- **DeedNFT**: The core NFT representing property deeds.
- **Validator**: A smart contract that verifies the integrity and authenticity of deed data.
- **ValidatorRegistry**: A registry for managing and tracking validators responsible for validating deeds.

## Key Contracts

### 1. **DeedNFT**
The main ERC721 token contract representing real estate deeds. Each deed token holds metadata and real estate data, including:
- **Custom Metadata**: Deeds are linked to metadata stored on decentralized services such as IPFS.
- **Validation Integration**: Each deed can be validated by third-party validators through the `Validator` contract, ensuring the authenticity and correctness of property data.
- **Upgradability**: Built using the UUPS (Universal Upgradeable Proxy Standard) pattern for seamless contract upgrades.
- **Batch Minting**: Allows for minting multiple deed tokens in one transaction, reducing gas costs and simplifying operations.

### 2. **Validator**
The `Validator` contract is responsible for verifying deed data and generating the appropriate metadata URI. This contract works in tandem with the `ValidatorRegistry` to ensure that only authorized validators can validate deeds.
- **Token Metadata Generation**: The contract generates token URIs that can be accessed externally to view property data.
- **Operating Agreement Management**: Stores and retrieves operating agreements related to properties.
- **Customizable Validation**: The `Validator` can be tailored to specific validation criteria required by different properties.

### 3. **ValidatorRegistry**
The `ValidatorRegistry` contract manages a list of authorized validators, ensuring that only trusted and approved validators can interact with the `DeedNFT` contract.
- **Validator Registration**: Enables the registration, update, and removal of validator contracts.
- **Validation Control**: Centralized control over which validators are authorized to verify deeds in the protocol.

### 4. **Proxy Contract**
A critical part of the Deed Protocol is its upgradability via a proxy contract. The proxy enables contract upgrades without changing the contract address, ensuring the continuity of data and assets.

## Features

- **UUPS Upgradeable**: All core contracts use OpenZeppelin’s UUPSUpgradeable pattern, allowing for future upgrades while ensuring security and backward compatibility.
- **Role-Based Access Control**: Permissions are controlled using `AccessControlUpgradeable`, allowing only authorized roles such as `VALIDATOR_ROLE` and `DEFAULT_ADMIN_ROLE` to perform critical actions.
- **Pausable Operations**: The protocol integrates a `PausableUpgradeable` feature, allowing for emergency stops in the event of system-critical issues.
- **Cross-Validator Functionality**: Multiple validators can be integrated into the system, each responsible for validating different deed types or regions.

## Installation and Setup

To interact with and deploy these contracts, follow the steps below:

### Prerequisites
- Node.js v16+
- Hardhat
- Solidity ^0.8.20
- A wallet provider like MetaMask for deploying on live networks

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Deed3Labs/DeedNFT-Contracts
   cd DeedNFT-Contracts
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Compile the contracts:
   ```bash
   npx hardhat compile
   ```

4. Run tests:
   ```bash
   npx hardhat test
   ```

## Usage

### Deploying Contracts
To deploy the contracts locally or to a testnet, you can use the provided deployment scripts in Hardhat. Make sure to configure your network settings in `hardhat.config.js`.

```bash
npx hardhat run scripts/deploy.js --network <network-name>
```

### Interacting with Deployed Contracts
After deployment, you can interact with the contracts using the provided interfaces in `IValidator.sol`, `IValidatorRegistry.sol`, and `DeedNFT.sol`.

## Testing

You can run the included test suite to ensure that the contracts are functioning as expected:

```bash
npx hardhat test
```

Tests are written using Hardhat's testing framework and cover core functionality such as minting, burning, and validator registration.

## License

The contracts in this repository are licensed under the **AGPL-3.0**. For more details, refer to the [LICENSE](./LICENSE) file.
