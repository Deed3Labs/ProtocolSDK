# Protocol SDK

This SDK provides a set of functions to interact with the Protocol Contracts, including DeedNFT, FundManager, Validator, and ValidatorRegistry.

## Installation

```bash
npm install protocol-sdk
```

## Usage

```typescript
import { ethers } from 'ethers';
import { deedNFT, fundManager, validator, validatorRegistry } from 'protocol-sdk';

// Example: Mint a new deed
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(contractAddress, abi, signer);

const tokenId = await deedNFT.mintAsset(
  contract,
  owner,
  assetType,
  ipfsDetailsHash,
  definition,
  configuration,
  validatorAddress,
  salt
);

// Example: Validate a deed
const isValid = await validator.validateDeed(contract, tokenId);

// Example: Get validator info
const info = await validatorRegistry.getValidatorInfo(contract, validatorAddress);
```

## API Overview

- **DeedNFT**: Functions for minting, burning, transferring, and managing metadata.
- **FundManager**: Functions for minting, fee management, and administrative tasks.
- **Validator**: Functions for validation, criteria management, operating agreements, token/fee management, and royalty settings.
- **ValidatorRegistry**: Functions for querying validator information and status.

## License

MIT 