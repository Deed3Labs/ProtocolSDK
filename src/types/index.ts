export interface AssetCondition {
  generalCondition: string;
  lastInspectionDate: string;
  knownIssues: string[];
  improvements: string[];
  additionalNotes: string;
}

export interface LegalInfo {
  jurisdiction: string;
  registrationNumber: string;
  registrationDate: string;
  documents: string[];
  restrictions: string[];
  additionalInfo: string;
}

export interface Document {
  docType: string;
  documentURI: string;
}

export interface TokenMetadata {
  name: string;
  description: string;
  image: string;
  background_color: string;
  animation_url: string;
  external_link: string;
  galleryImages: string[];
  documents: Document[];
  customMetadata: string;
}

export interface TokenFeatures {
  features: string[];
}

export interface ValidationCriteria {
  requiredTraits: string[];
  additionalCriteria: string;
  requireOperatingAgreement: boolean;
  requireDefinition: boolean;
}

export interface ValidatorInfo {
  owner: string;
  name: string;
  isActive: boolean;
  assetTypes: number[];
  commissionPercentage: number;
} 