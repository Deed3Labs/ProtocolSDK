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

### Application-Level Network Management

Your application should handle:
- RPC provider configuration
- Network switching logic
- Wallet connection management
- Network validation

Example application implementation:

```typescript
import { ChainId, NetworkConfig } from '@protocol/sdk';
import { getContractAddresses } from '@protocol/sdk/config/contracts';

// Your application's RPC configuration
const RPC_URLS = {
  [ChainId.BASE_SEPOLIA]: 'https://sepolia.base.org',
  [ChainId.BASE]: 'https://mainnet.base.org'
};

// Your application's network manager
class AppNetworkManager {
  private currentChainId: ChainId;
  
  constructor(initialChainId: ChainId) {
    this.currentChainId = initialChainId;
  }

  async switchNetwork(chainId: ChainId) {
    // Your network switching logic
  }

  getNetworkConfig(): NetworkConfig {
    return {
      chainId: this.currentChainId,
      provider: new ethers.JsonRpcProvider(RPC_URLS[this.currentChainId]),
      contracts: getContractAddresses(this.currentChainId)
    };
  }
}
```

## Network Configuration

The SDK is network-agnostic and requires the application to provide network configuration. Here's how to configure networks:

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

### Supported Networks

The SDK can work with any EVM-compatible network. Here are some commonly used networks:

- Base Sepolia (Chain ID: 84532)
- Base Mainnet (Chain ID: 8453)
- Ethereum Mainnet (Chain ID: 1)
- Arbitrum One (Chain ID: 42161)

### Network Switching

The SDK does not handle network switching internally. Your application should:

1. Listen for network changes in the user's wallet
2. Update the provider and contract instances accordingly
3. Validate that the network is supported by your application

Example network switching:

```typescript
// Handle network change
provider.on("network", (newNetwork, oldNetwork) => {
  // Handle network change in your application
  // Reinitialize SDK with new network if needed
});
```

## Network Monitoring

The SDK provides a `NetworkMonitor` class to track network health and status:

```typescript
import { NetworkMonitor } from '@protocol/sdk';

const monitor = new NetworkMonitor(provider, {
  pollingInterval: 5000,
  healthThreshold: 0.8,
});

// Start monitoring
await monitor.start();

// Listen for status changes
monitor.on('statusChange', (status) => {
  console.log('Network status:', status);
});

// Check if network is healthy
const isHealthy = await monitor.isHealthy();

// Wait for network to be ready
await monitor.waitForReady();
```

## Transaction Management

The SDK includes a `TransactionQueue` for managing multiple transactions:

```typescript
import { TransactionQueue } from '@protocol/sdk';

const queue = new TransactionQueue(provider, signer, {
  maxConcurrent: 3,
  maxRetries: 3,
  retryDelay: 1000,
  confirmations: 1,
  timeout: 300000,
});

// Add transaction to queue
const hash = await queue.add({
  from: '0x...',
  to: '0x...',
  value: ethers.parseEther('1.0'),
  data: '0x...',
  nonce: 1,
  gasLimit: 21000n,
});

// Get transaction status
const status = await queue.getStatus(hash);

// Get all pending transactions
const pending = queue.getPending();
```

## Contract Management

The SDK provides a clean interface for working with contracts:

```typescript
import { ContractFactory, IDeedNFT } from '@protocol/sdk';

// Create contract instance
const deedNFT = await ContractFactory.createContract<IDeedNFT>(
  provider,
  contractAddress,
  deedNFTAbi
);

// Use contract
const balance = await deedNFT.contract.balanceOf(address);
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