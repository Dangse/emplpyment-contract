import { ContractHistoryItem, ContractType, ContractFormData } from "../types";

const STORAGE_KEY = 'dh_contract_history';

export const saveHistory = (type: ContractType, formData: ContractFormData) => {
  try {
    const existing = getHistory();
    const newItem: ContractHistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      type,
      formData
    };
    
    // Keep only last 10 items
    const updated = [newItem, ...existing].slice(0, 10);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save history", e);
  }
};

export const getHistory = (): ContractHistoryItem[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to load history", e);
    return [];
  }
};