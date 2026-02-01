import React, { useState } from 'react';
import { ContractType, ContractFormData } from './types';
import { SelectionScreen } from './components/SelectionScreen';
import { InputForm } from './components/InputForm';
import { ResultView } from './components/ResultView';
import { generateContractContent } from './services/geminiService';

const App: React.FC = () => {
  const [step, setStep] = useState<'selection' | 'form' | 'result'>('selection');
  const [contractType, setContractType] = useState<ContractType | null>(null);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleTypeSelect = (type: ContractType) => {
    setContractType(type);
    setStep('form');
  };

  const handleFormSubmit = async (data: ContractFormData) => {
    if (!contractType) return;
    
    setIsLoading(true);
    try {
      const content = await generateContractContent(contractType, data);
      setGeneratedContent(content);
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
    setGeneratedContent('');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={handleReset}
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              A
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">EasyContract AI</span>
          </div>
          <div className="text-sm text-slate-500 hidden sm:block">
            Powered by Google Gemini
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {step === 'selection' && (
          <SelectionScreen onSelect={handleTypeSelect} />
        )}

        {step === 'form' && contractType && (
          <InputForm 
            type={contractType} 
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
      <footer className="bg-white border-t border-slate-200 py-8 mt-auto no-print">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} EasyContract AI. All rights reserved.</p>
          <p className="mt-2">
            본 서비스가 제공하는 계약서는 참고용이며, 법적 효력에 대한 최종 책임은 사용자에게 있습니다.<br/>
            중요한 계약은 반드시 법률 전문가의 검토를 받으시기 바랍니다.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;