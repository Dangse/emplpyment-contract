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
          <span className="text-xs text-slate-400 font-medium px-2 py-1 bg-slate-50 rounded">
            DH 대한세무법인
          </span>
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
                placeholder="예: 주식회사 000 대표 홍길동"
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
                label="계약 종료일 (선택)" 
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
                   <InputField 
                    label="근무 장소" 
                    name="workLocation" 
                    value={formData.workLocation || ''} 
                    onChange={handleChange} 
                    placeholder="예: 서울시 강남구 본사 사무실"
                    required
                  />
                  <InputField 
                    label="업무 내용 (직위)" 
                    name="jobTitle" 
                    value={formData.jobTitle || ''} 
                    onChange={handleChange} 
                    placeholder="예: 마케팅 팀장 / 웹 개발 업무"
                    required
                  />
                </div>
                <InputField 
                  label="근로 시간 및 휴게 시간" 
                  name="workingHours" 
                  value={formData.workingHours || ''} 
                  onChange={handleChange} 
                  placeholder="예: 09:00~18:00 (휴게시간 12:00~13:00)"
                  required
                />
              </>
            ) : (
              <>
                <InputField 
                  label="프로젝트/업무 범위" 
                  name="projectScope" 
                  value={formData.projectScope || ''} 
                  onChange={handleChange} 
                  placeholder="예: 관원 기본체력 보강 및 기초훈련 지도 "
                  textarea
                  required
                />
                <InputField 
                  label="" 
                  name="deliverables" 
                  value={formData.deliverables || ''} 
                  onChange={handleChange} 
                  placeholder="예: 디자인 원본 파일(PSD), 퍼블리싱 소스코드(HTML/CSS)"
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
                label={isEmployment ? "임금 (월급/연봉)" : "프리랜서지급액 (총액)"} 
                name="paymentAmount" 
                value={formData.paymentAmount} 
                onChange={handleChange} 
                placeholder={isEmployment ? "예: 월 3,000,000원 (세전)" : " 예 프리랜서 지급액 "}
                required 
              />
               <InputField 
                label="지급 방법 및 시기" 
                name="paymentTerms" 
                value={formData.paymentTerms} 
                onChange={handleChange} 
                placeholder={isEmployment ? "예: 매월 25일 근로자 계좌로 입금" : "매월25일 프리랜서 지급액 "}
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