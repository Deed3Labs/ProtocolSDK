export const SDK_VERSION = '0.1.0';

export function checkCompatibility(contractVersion: string): boolean {
  const [major, minor] = SDK_VERSION.split('.');
  const [cMajor, cMinor] = contractVersion.split('.');
  
  return major === cMajor && parseInt(minor) >= parseInt(cMinor);
} 