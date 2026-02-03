import React, { useState, useEffect } from 'react';
import { ContractType, ContractFormData } from '../types';
import { InputField } from './InputField';
import { Button } from './Button';

interface InputFormProps {
  type: ContractType;
  initialData?: ContractFormData | null;
  onSubmit: (data: ContractFormData) => void;
  onBack: () => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ type, initialData, onSubmit, onBack, isLoading }) => {
  const defaultData: ContractFormData = {
    partyA: '',
    partyB: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    paymentAmount: '',
    paymentTerms: '',
    workingHours: '',
    workLocation: '',
    jobTitle: '',
    projectScope: '',
    deliverables: '',
    additionalTerms: '',
  };

  const [formData, setFormData] = useState<ContractFormData>(defaultData);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isEmployment = type === ContractType.EMPLOYMENT;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 md:p-10">
        <div className="mb-10 border-b border-slate-100 pb-6 flex items-baseline justify-between">
          <div>
             <h2 className="text-3xl font-bold text-slate-900 font-serif">
            {isEmployment ? '근로계약 정보 입력' : '프리랜서 계약 정보 입력'}
            </h2>
            <p className="text-slate-500 mt-2 text-sm">법률적 효력을 위해 정확한 정보를 입력해 주십시오.</p>
          </div>
          
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center">
              <span className="w-1.5 h-1.5 bg-slate-800 rounded-full mr-2"></span>
              당사자 정보
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField 
                label={isEmployment ? "사용자(갑) 성명/상호" : "의뢰인(갑) 성명/상호"}
                name="partyA" 
                value={formData.partyA} 
                onChange={handleChange} 
                placeholder="예: ㅇㅇ 권투체육관 "
                required 
              />
              <InputField 
                label={isEmployment ? "근로자(을) 성명" : "프리랜서(을) 성명"}
                name="partyB" 
                value={formData.partyB} 
                onChange={handleChange} 
                placeholder="예: 김철수"
                required 
              />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center">
              <span className="w-1.5 h-1.5 bg-slate-800 rounded-full mr-2"></span>
              계약 기간 및 조건
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField 
                label="계약 시작일" 
                type="date" 
                name="startDate" 
                value={formData.startDate} 
                onChange={handleChange} 
                required 
              />
              <InputField 
                label="계약 종료일 (선택임.정함이 없는 경우 안써도 됨)" 
                type="date" 
                name="endDate" 
                value={formData.endDate || ''} 
                onChange={handleChange} 
              />
            </div>
             {/* Conditional Fields based on Type */}
            {isEmployment ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   
                  
                </div>
               
              </>
            ) : (
              <>
                <InputField 
                  label="업무 범위" 
                  name="projectScope" 
                  value={formData.projectScope || ''} 
                  onChange={handleChange} 
                  placeholder="예: 관원 기본체력 보강 및 기초훈련 지도 "
                  textarea
                  required
                />
                
              </>
            )}
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center">
              <span className="w-1.5 h-1.5 bg-slate-800 rounded-full mr-2"></span>
              대금 지급
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <InputField 
                label={isEmployment ? "임금 (월급/연봉)" : "지급 기준 (성과급 등)"} 
                name="paymentAmount" 
                value={formData.paymentAmount} 
                onChange={handleChange} 
                placeholder={isEmployment ? "예: 월 3,000,000원 (세전)" : "예: 수업 1회당 3만원, 또는 매월 매출의 50% 지급"}
                required 
              />
               <InputField 
                label="지급 방법 및 시기" 
                name="paymentTerms" 
                value={formData.paymentTerms} 
                onChange={handleChange} 
                placeholder={isEmployment ? "예: 매월 25일 근로자 계좌로 입금" : "예: 익월 10일 계좌 이체"}
                required 
              />
            </div>
          </div>
          
           <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center">
              <span className="w-1.5 h-1.5 bg-slate-800 rounded-full mr-2"></span>
              기타
            </h3>
            <InputField 
              label="기타 특약 사항 (선택)" 
              name="additionalTerms" 
              value={formData.additionalTerms || ''} 
              onChange={handleChange} 
              textarea
              placeholder="추가적으로 명시하고 싶은 조항이 있다면 입력해주세요."
            />
          </div>

          <div className="flex gap-4 pt-8 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={onBack}>
              이전으로
            </Button>
            <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  작성 중...
                </>
              ) : (
                '계약서 생성하기'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};