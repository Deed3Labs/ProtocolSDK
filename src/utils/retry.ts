import { ProtocolError, ErrorType } from './errors'

export const ERROR_CODES = {
  OPERATION_FAILED: ErrorType.TRANSACTION_FAILED,
  MAX_RETRIES_EXCEEDED: ErrorType.NETWORK_ERROR
} as const

export async function retry<T>(
  operation: () => Promise<T>,
  maxAttempts: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: Error | ProtocolError = new ProtocolError(
    'Operation failed',
    ErrorType.TRANSACTION_FAILED
  )
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error instanceof ProtocolError 
        ? error 
        : new ProtocolError(
            `Operation failed after ${attempt} attempts`,
            ErrorType.TRANSACTION_FAILED,
            error
          )
      
      if (attempt === maxAttempts) break
      
      // Exponential backoff
      await new Promise(resolve => 
        setTimeout(resolve, initialDelay * Math.pow(2, attempt - 1))
      )
    }
  }
  
  throw lastError
}