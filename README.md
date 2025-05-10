# Protocol SDK

A TypeScript SDK for interacting with Protocol Contracts, including DeedNFT, FundManager, Validator, and ValidatorRegistry.

## Features

- 🛡️ Type-safe contract interactions
- 🔄 Transaction management with retry logic
- 📊 Transaction monitoring and event tracking
- ✅ Input validation and error handling
- 🔒 Rate limiting and security features
- 📝 Comprehensive documentation
- 🧪 Extensive test coverage
- 🔍 Detailed logging and debugging
- 🔐 Secure key management
- 🌐 Multi-network support

## Installation

```bash
npm install @protocol/sdk
```

## Quick Start

```typescript
import { ethers } from 'ethers';
import { TransactionManager, ValidationSystem, MonitoringSystem } from '@protocol/sdk';

// Initialize provider and transaction manager
const provider = new ethers.JsonRpcProvider('YOUR_RPC_URL');
const transactionManager = new TransactionManager(provider);

// Initialize monitoring system
const monitoringSystem = new MonitoringSystem(provider, {
  maxRetries: 3,
  retryDelay: 1000,
  timeout: 30000,
  confirmations: 1,
});

// Monitor contract events
monitoringSystem.monitorContractEvent(contract, 'Transfer', (event) => {
  console.log('Transfer event:', event);
});

// Send transaction
const result = await transactionManager.sendTransaction(tx);
console.log('Transaction status:', result.status);
```

## Architecture

The SDK is organized into several key components:

### Core Components

1. **Transaction Management**
   - Transaction queue management
   - Gas price optimization
   - Transaction confirmation handling
   - Retry logic for failed transactions

2. **Validation System**
   - Input parameter validation
   - Contract state validation
   - Gas price validation
   - Contract deployment validation

3. **Monitoring System**
   - Event monitoring
   - Transaction status tracking
   - Network health monitoring
   - Error tracking and reporting

4. **Rate Limiting**
   - Request throttling
   - Rate limit tracking
   - Custom rate limit rules
   - Rate limit recovery

5. **Form Handling System**
   - Type-safe form fields and validation
   - Built-in validation for common field types
   - Custom validation support
   - Form state management
   - Event handling
   - Predefined schemas for common operations
   - Factory pattern for form creation

   #### Features

   - **Type-safe Form Fields**: All form fields are strongly typed with TypeScript.
   - **Built-in Validation**: Supports required fields, patterns, ranges, and custom validation.
   - **Form State Management**: Tracks form values, errors, and submission state.
   - **Event Handling**: Supports change, blur, submit, and reset events.
   - **Predefined Schemas**: Includes schemas for DeedNFT, Validator, and FundManager forms.
   - **Factory Pattern**: Simplified form creation and management.

   #### Usage

   ##### Creating a Form

   ```typescript
   import { FormFactory } from '@protocol/sdk';

   // Create a DeedNFT form
   const formFactory = FormFactory.getInstance();
   const deedNFTForm = formFactory.createForm('deedNFT', {
     validateOnChange: true,
     validateOnBlur: true
   });

   // Create a custom form
   const customForm = formFactory.createForm('custom', {
     validateOnChange: true
   }, {
     fields: [
       {
         name: 'customField',
         type: 'text',
         label: 'Custom Field',
         required: true
       }
     ]
   });
   ```

   ##### Handling Form Events

   ```typescript
   // Add event listeners
   deedNFTForm.addEventListener((event) => {
     if (event.type === 'change') {
       console.log(`Field ${event.field} changed to ${event.value}`);
     }
   });

   // Set form values
   await deedNFTForm.setValue('owner', '0x123...');
   await deedNFTForm.setValue('assetType', 'Land');

   // Validate form
   const isValid = await deedNFTForm.validateAll();
   if (isValid) {
     await deedNFTForm.submit();
   }
   ```

   ##### Form Validation

   ```typescript
   // Validate a single field
   await deedNFTForm.validateField('owner');

   // Get field error
   const error = deedNFTForm.getError('owner');

   // Validate all fields
   const isValid = await deedNFTForm.validateAll();
   ```

   ##### Form State

   ```typescript
   // Get form values
   const values = deedNFTForm.getValues();

   // Get form state
   const state = deedNFTForm.getState();
   console.log({
     values: state.values,
     errors: state.errors,
     isDirty: state.isDirty,
     isSubmitting: state.isSubmitting
   });
   ```

   #### Predefined Form Schemas

   ##### DeedNFT Form

   ```typescript
   {
     fields: [
       {
         name: 'owner',
         type: 'address',
         label: 'Owner Address',
         required: true
       },
       {
         name: 'assetType',
         type: 'select',
         label: 'Asset Type',
         required: true,
         options: ['Land', 'Building', 'Commercial']
       },
       // ... other fields
     ]
   }
   ```

   ##### Validator Form

   ```typescript
   {
     fields: [
       {
         name: 'name',
         type: 'text',
         label: 'Validator Name',
         required: true
       },
       {
         name: 'commissionPercentage',
         type: 'number',
         label: 'Commission Percentage',
         required: true,
         validation: {
           min: 0,
           max: 100,
           message: 'Commission must be between 0 and 100'
         }
       },
       // ... other fields
     ]
   }
   ```

   ##### FundManager Form

   ```typescript
   {
     fields: [
       {
         name: 'feeReceiver',
         type: 'address',
         label: 'Fee Receiver Address',
         required: true
       },
       {
         name: 'commissionPercentage',
         type: 'number',
         label: 'Commission Percentage',
         required: true,
         validation: {
           min: 0,
           max: 100,
           message: 'Commission must be between 0 and 100'
         }
       },
       // ... other fields
     ]
   }
   ```

   #### Integration

   The form handling system integrates with the rest of the SDK:

   ```typescript
   import { ProtocolSDK } from '@protocol/sdk';

   const sdk = new ProtocolSDK({
     provider: ethersProvider,
     signer: ethersSigner
   });

   // Create a form
   const form = formFactory.createForm('deedNFT');

   // Handle form submission
   form.addEventListener(async (event) => {
     if (event.type === 'submit') {
       const values = form.getValues();
       await sdk.deedNFT.mintAsset(values);
     }
   });
   ```

### Contract Interfaces

1. **DeedNFT**
   - Asset minting and burning
   - Dynamic trait management
   - Transfer validation
   - Royalty enforcement

2. **FundManager**
   - Fee management
   - Commission handling
   - Fund distribution
   - Validator rewards

3. **Validator**
   - Validation operations
   - Operating agreements
   - Token management
   - Fee collection

4. **ValidatorRegistry**
   - Validator registration
   - Status management
   - Asset type validation
   - Validator information

5. **MetadataRenderer**
   - Token metadata generation
   - URI management
   - Custom metadata storage
   - Dynamic content rendering

## Network Management

The SDK provides network-related types, utilities, and contract addresses for supported networks. Here's what's included:

```typescript
import { ChainId, NetworkConfig } from '@protocol/sdk';
import { getContractAddresses } from '@protocol/sdk/config/contracts';

// Types provided by the SDK
interface NetworkConfig {
  chainId: number;
  provider: ethers.Provider;
  contracts: {
    DeedNFT: string;
    FundManager: string;
    Validator: string;
    ValidatorRegistry: string;
    MetadataRenderer: string;
  };
}

// Common chain IDs for reference
enum ChainId {
  MAINNET = 1,
  ARBITRUM = 42161,
  BASE = 8453,
  BASE_SEPOLIA = 84532
}

// Get contract addresses for a network
const addresses = getContractAddresses(ChainId.BASE_SEPOLIA);
```

### Supported Networks

The SDK supports the following networks:

- Base Sepolia (Chain ID: 84532)
- Base Mainnet (Chain ID: 8453)
- Ethereum Mainnet (Chain ID: 1)
- Arbitrum One (Chain ID: 42161)

### Network Configuration

```typescript
import { ethers } from 'ethers';

// Configure your network settings
const networkConfig = {
  chainId: 84532, // base-sepolia
  provider: new ethers.JsonRpcProvider('https://sepolia.base.org'),
  contracts: {
    DeedNFT: '0x...',
    FundManager: '0x...',
    Validator: '0x...',
    ValidatorRegistry: '0x...',
    MetadataRenderer: '0x...'
  }
};

// Initialize the SDK with your network config
const sdk = new Protocol.SDK({
  network: networkConfig,
  signer: wallet // Your ethers signer
});
```

## Testing

The SDK includes comprehensive test suites for both API and core functionality:

### Test Structure

```
src/__tests__/
├── api/                    # API-level tests
│   ├── deedNFT.test.ts
│   ├── fundManager.test.ts
│   ├── metadataRenderer.test.ts
│   ├── validator.test.ts
│   └── validatorRegistry.test.ts
└── core/                   # Core functionality tests
    ├── deedNFT.test.ts
    ├── fundManager.test.ts
    ├── metadataRenderer.test.ts
    ├── validator.test.ts
    └── validatorRegistry.test.ts
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test suite
npm test -- -t "DeedNFT"

# Run tests in watch mode
npm run test:watch
```

### Test Coverage

The test suites cover:
- Contract interactions
- State management
- Event emissions
- Error handling
- Edge cases
- Integration scenarios

## Error Handling

The SDK provides custom error classes for better error handling:

```typescript
try {
  await transactionManager.sendTransaction(tx);
} catch (error) {
  if (error instanceof TransactionError) {
    console.error('Transaction failed:', error.txHash);
  } else if (error instanceof ValidationError) {
    console.error('Validation failed:', error.field);
  } else if (error instanceof NetworkError) {
    console.error('Network error:', error.network);
  } else if (error instanceof ContractError) {
    console.error('Contract error:', error.contractAddress);
  }
}
```

## Security

### Best Practices

1. **Key Management**
   - Never expose private keys
   - Use secure key storage
   - Implement key rotation
   - Use hardware wallets when possible

2. **Transaction Security**
   - Validate all inputs
   - Check gas prices
   - Implement timeouts
   - Use nonce management

3. **Network Security**
   - Use secure RPC endpoints
   - Implement rate limiting
   - Monitor network health
   - Handle network changes

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build the project
npm run build

# Run linter
npm run lint

# Run type checking
npm run type-check
```

### Code Style

- Follow TypeScript best practices
- Use ESLint for code linting
- Follow the project's coding standards
- Write comprehensive tests
- Update documentation

## License

This project is licensed under the AGPL 3.0 License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please:
1. Check the [documentation](docs/)
2. Open an issue in the repository
3. Contact the development team

## Roadmap

- [ ] Additional network support
- [ ] Enhanced monitoring capabilities
- [ ] Improved error handling
- [ ] Additional contract integrations
- [ ] Performance optimizations

