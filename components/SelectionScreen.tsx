import React from 'react';
import { ContractType } from '../types';

interface SelectionScreenProps {
  onSelect: (type: ContractType) => void;
}

export const SelectionScreen: React.FC<SelectionScreenProps> = ({ onSelect }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
          AI 스마트 계약서 생성기
        </h1>
        <p className="text-lg text-slate-600">
          복잡한 계약서, 이제 AI가 3초 만에 작성해 드립니다.<br/>
          원하시는 계약 종류를 선택해주세요.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Freelance Card */}
        <div 
          onClick={() => onSelect(ContractType.FREELANCE)}
          className="group relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all cursor-pointer border border-slate-100 hover:border-blue-500 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">프리랜서 용역 계약서</h2>
            <p className="text-slate-500">
              디자인, 개발, 글쓰기 등 프로젝트 단위의 업무 위탁 계약이 필요하신가요?
            </p>
          </div>
        </div>

        {/* Employment Card */}
        <div 
          onClick={() => onSelect(ContractType.EMPLOYMENT)}
          className="group relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all cursor-pointer border border-slate-100 hover:border-green-500 overflow-hidden"
        >
           <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
           <div className="relative z-10">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">표준 근로 계약서</h2>
            <p className="text-slate-500">
              정규직, 계약직 등 직원을 채용하고 근로 기준법에 맞는 계약이 필요하신가요?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};