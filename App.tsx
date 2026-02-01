import React, { useState, useEffect } from 'react';
import { ContractType, ContractFormData, ContractHistoryItem } from './types';
import { SelectionScreen } from './components/SelectionScreen';
import { InputForm } from './components/InputForm';
import { ResultView } from './components/ResultView';
import { generateContractContent } from './services/geminiService';
import { saveHistory, getHistory } from './services/storageService';

const App: React.FC = () => {
  const [step, setStep] = useState<'selection' | 'form' | 'result'>('selection');
  const [contractType, setContractType] = useState<ContractType | null>(null);
  const [formData, setFormData] = useState<ContractFormData | null>(null);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<ContractHistoryItem[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleTypeSelect = (type: ContractType) => {
    setContractType(type);
    setFormData(null); // Reset form data for fresh start
    setStep('form');
  };

  const handleHistorySelect = (item: ContractHistoryItem) => {
    setContractType(item.type);
    setFormData(item.formData);
    setStep('form');
  };

  const handleFormSubmit = async (data: ContractFormData) => {
    if (!contractType) return;
    
    setIsLoading(true);
    try {
      const content = await generateContractContent(contractType, data);
      setGeneratedContent(content);
      
      // Save to history on success
      saveHistory(contractType, data);
      setHistory(getHistory()); // Refresh history list
      
      setStep('result');
    } catch (error) {
      alert("계약서 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStep('selection');
    setContractType(null);
    setFormData(null);
    setGeneratedContent('');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={handleReset}
          >
            <div className="w-10 h-10 bg-slate-900 text-white font-serif font-bold text-xl flex items-center justify-center rounded-sm group-hover:bg-slate-800 transition-colors">
              DH
            </div>
            <span className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight font-serif">
              대한세무법인
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {step === 'selection' && (
          <SelectionScreen 
            onSelect={handleTypeSelect} 
            history={history}
            onLoadHistory={handleHistorySelect}
          />
        )}

        {step === 'form' && contractType && (
          <InputForm 
            type={contractType} 
            initialData={formData}
            onSubmit={handleFormSubmit} 
            onBack={() => setStep('selection')}
            isLoading={isLoading}
          />
        )}

        {step === 'result' && (
          <ResultView 
            content={generatedContent} 
            onReset={handleReset} 
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 mt-auto no-print">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <p className="font-serif text-slate-300 text-lg mb-4">DH 대한세무법인</p>
          <p>© {new Date().getFullYear()} DH Tax Firm. All rights reserved.</p>
          <p className="mt-4 max-w-2xl mx-auto opacity-60">
            본 서비스가 제공하는 계약서는 기초 법률 검토용이며, 실제 계약 체결 시에는 반드시 법률 전문가의 최종 검토를 거쳐야 합니다. 
            대한세무법인은 생성된 계약서의 법적 효력에 대해 보증하지 않습니다.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;