import { ProtocolSDK, createProtocolSDK } from './index';

declare global {
  interface Window {
    ProtocolSDK: typeof ProtocolSDK;
    createProtocolSDK: typeof createProtocolSDK;
  }
}

window.ProtocolSDK = ProtocolSDK;
window.createProtocolSDK = createProtocolSDK; 