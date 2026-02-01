export enum ContractType {
  FREELANCE = 'FREELANCE',
  EMPLOYMENT = 'EMPLOYMENT',
}

export interface ContractFormData {
  // Common
  partyA: string; // 갑 (Employer/Client)
  partyB: string; // 을 (Employee/Freelancer)
  startDate: string;
  endDate?: string;
  paymentAmount: string;
  paymentTerms: string;
  
  // Specific to Employment
  workingHours?: string;
  workLocation?: string;
  jobTitle?: string;
  probationPeriod?: string;
  
  // Specific to Freelance
  projectScope?: string;
  deliverables?: string;
  
  // Extra
  additionalTerms?: string;
}

export interface GeneratedContract {
  title: string;
  content: string;
}