import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContractType, ContractFormData, ContractHistoryItem } from '../types';
import { SelectionScreen } from '../components/SelectionScreen';
import { InputForm } from '../components/InputForm';
import { ResultView } from '../components/ResultView';
import { generateContractContent } from '../services/geminiService';
import { saveHistory, getHistory, deleteHistory } from '../services/storageService';

export const ContractPage: React.FC = () => {
  const navigate = useNavigate();
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
    setFormData(null); 
    setStep('form');
  };

  const handleHistorySelect = (item: ContractHistoryItem) => {
    setContractType(item.type);
    setFormData(item.formData);
    setStep('form');
  };

  const handleDeleteHistory = (id: string) => {
    const updated = deleteHistory(id);
    setHistory(updated);
  };

  const handleFormSubmit = async (data: ContractFormData) => {
    if (!contractType) return;
    
    setIsLoading(true);
    try {
      const content = await generateContractContent(contractType, data);
      setGeneratedContent(content);
      
      saveHistory(contractType, data);
      setHistory(getHistory());
      
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
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => navigate('/')}
          >
             {/* Updated Logo Styling - Changed to logo192.png */}
             <img 
               src="/logo192.png" 
               alt="DH Logo" 
               className="w-10 h-10 rounded-full shadow-md object-contain bg-transparent group-hover:opacity-90 transition-opacity"
               onError={(e) => {
                 e.currentTarget.style.display = 'none';
                 e.currentTarget.nextElementSibling?.classList.remove('hidden');
               }}
             />
             {/* Fallback */}
            <div className="hidden w-10 h-10 bg-slate-900 text-white font-serif font-bold text-xl flex items-center justify-center rounded-sm group-hover:bg-slate-800 transition-colors">
              DH
            </div>
            <span className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight font-serif">
              대한세무법인
            </span>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={() => navigate('/payroll')} className="text-sm font-bold text-slate-500 hover:text-slate-900 hidden md:block">
                급여관리 바로가기
             </button>
             <button onClick={() => navigate('/')} className="text-sm font-bold text-slate-500 hover:text-slate-900">
                홈으로
             </button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {step === 'selection' && (
          <SelectionScreen 
            onSelect={handleTypeSelect} 
            history={history}
            onLoadHistory={handleHistorySelect}
            onDeleteHistory={handleDeleteHistory}
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

      <footer className="bg-slate-900 text-slate-400 py-10 mt-auto no-print">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <p className="font-serif text-slate-300 text-lg mb-4">DH 대한세무법인</p>
          <p>© {new Date().getFullYear()} DH Tax Firm. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};