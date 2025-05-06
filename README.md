# Protocol SDK

A TypeScript SDK for interacting with Protocol Contracts, including DeedNFT, FundManager, Validator, and ValidatorRegistry.

## Features

- 🛡️ Type-safe contract interactions
- 🔄 Transaction management with retry logic
- 📊 Transaction monitoring and event tracking
- ✅ Input validation and error handling
- 🔒 Rate limiting and security features
- 📝 Comprehensive documentation

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

## Network Management

The SDK is designed to be network-agnostic. Network management, including chain IDs and contract addresses, should be handled by your application. Here's an example of how to manage networks in your application:

```typescript
// networks.ts
export const NETWORKS = {
  mainnet: {
    chainId: 1,
    rpcUrl: 'https://mainnet.infura.io/v3/YOUR_KEY',
    contracts: {
      deedNFT: '0x...',
      fundManager: '0x...',
      validator: '0x...',
      validatorRegistry: '0x...',
      metadataRenderer: '0x...'
    }
  },
  goerli: {
    chainId: 5,
    rpcUrl: 'https://goerli.infura.io/v3/YOUR_KEY',
    contracts: {
      deedNFT: '0x...',
      fundManager: '0x...',
      validator: '0x...',
      validatorRegistry: '0x...',
      metadataRenderer: '0x...'
    }
  }
} as const;

// networkManager.ts
import { ethers } from 'ethers';
import { TransactionManager } from '@protocol/sdk';

export class NetworkManager {
  private provider: ethers.Provider;
  private transactionManager: TransactionManager;
  private currentNetwork: keyof typeof NETWORKS;

  constructor(initialNetwork: keyof typeof NETWORKS) {
    this.currentNetwork = initialNetwork;
    this.provider = new ethers.JsonRpcProvider(NETWORKS[initialNetwork].rpcUrl);
    this.transactionManager = new TransactionManager(this.provider);
  }

  async switchNetwork(network: keyof typeof NETWORKS) {
    // Update provider
    this.provider = new ethers.JsonRpcProvider(NETWORKS[network].rpcUrl);
    this.transactionManager = new TransactionManager(this.provider);
    this.currentNetwork = network;
  }

  getContractAddress(contractName: keyof typeof NETWORKS['mainnet']['contracts']) {
    return NETWORKS[this.currentNetwork].contracts[contractName];
  }

  getProvider() {
    return this.provider;
  }

  getTransactionManager() {
    return this.transactionManager;
  }
}

// Usage example
const networkManager = new NetworkManager('goerli');

// Switch networks
await networkManager.switchNetwork('mainnet');

// Get contract address
const deedNFTAddress = networkManager.getContractAddress('deedNFT');

// Initialize contract
const deedNFT = new ethers.Contract(
  deedNFTAddress,
  deedNFTABI,
  signer
);
```

## API Documentation

### TransactionManager

Manages transaction sending and monitoring.

```typescript
const transactionManager = new TransactionManager(provider);

// Send transaction
const result = await transactionManager.sendTransaction(tx);

// Get transaction status
const status = await transactionManager.getTransactionStatus(txHash);

// Get gas price
const gasPrice = await transactionManager.getGasPrice();
```

### MonitoringSystem

Monitors transactions and contract events.

```typescript
const monitoringSystem = new MonitoringSystem(provider, {
  maxRetries: 3,
  retryDelay: 1000,
  timeout: 30000,
  confirmations: 1,
});

// Monitor transaction
const result = await monitoringSystem.monitorTransaction(txHash);

// Monitor contract events
monitoringSystem.monitorContractEvent(contract, 'Transfer', (event) => {
  console.log('Transfer event:', event);
});

// Get monitoring events
const events = monitoringSystem.getEvents();
```

### ValidationSystem

Validates input parameters and contract state.

```typescript
// Validate address
ValidationSystem.validateAddress(address);

// Validate amount
ValidationSystem.validateAmount(amount);

// Validate contract parameters
ValidationSystem.validateContractParams({
  owner: address,
  tokenId: 1,
});

// Validate gas price
await ValidationSystem.validateGasPrice(provider, maxGasPrice);

// Validate contract deployment
await ValidationSystem.validateContractDeployment(address, provider);
```

### RateLimiter

Implements rate limiting for API calls.

```typescript
const rateLimiter = new RateLimiter({
  maxRequests: 100,
  timeWindow: 60000, // 1 minute
});

// Check rate limit
rateLimiter.checkRateLimit();

// Get current count
const count = rateLimiter.getCurrentCount();

// Get time until next request
const timeUntilNext = rateLimiter.getTimeUntilNext();
```

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

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the AGPL 3.0 License - see the [LICENSE](LICENSE) file for details. 