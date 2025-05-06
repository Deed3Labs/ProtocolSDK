export class ProtocolError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProtocolError';
  }
}

export class ValidationError extends ProtocolError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class AuthorizationError extends ProtocolError {
  constructor(message: string) {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export class ContractError extends ProtocolError {
  constructor(message: string) {
    super(message);
    this.name = 'ContractError';
  }
}

export class NetworkError extends ProtocolError {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class ConfigurationError extends ProtocolError {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigurationError';
  }
}

// Specific contract errors
export class DeedNFTError extends ContractError {
  constructor(message: string) {
    super(message);
    this.name = 'DeedNFTError';
  }
}

export class FundManagerError extends ContractError {
  constructor(message: string) {
    super(message);
    this.name = 'FundManagerError';
  }
}

export class ValidatorError extends ContractError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidatorError';
  }
}

export class ValidatorRegistryError extends ContractError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidatorRegistryError';
  }
}

export class MetadataRendererError extends ContractError {
  constructor(message: string) {
    super(message);
    this.name = 'MetadataRendererError';
  }
} 