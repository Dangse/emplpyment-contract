import React from 'react';
import { ContractType, ContractHistoryItem } from '../types';

interface SelectionScreenProps {
  onSelect: (type: ContractType) => void;
  history: ContractHistoryItem[];
  onLoadHistory: (item: ContractHistoryItem) => void;
  onDeleteHistory: (id: string) => void;
}

export const SelectionScreen: React.FC<SelectionScreenProps> = ({ onSelect, history, onLoadHistory, onDeleteHistory }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-serif">
          대한세무법인 AI 계약서 생성기
        </h1>
        <div className="w-24 h-1 bg-slate-900 mx-auto rounded-full opacity-20"></div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-20">
        {/* Freelance Card */}
        <div 
          onClick={() => onSelect(ContractType.FREELANCE)}
          className="group relative bg-white rounded-xl p-10 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-slate-200 hover:border-slate-400 overflow-hidden text-center md:text-left"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          
          <div className="w-14 h-14 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-700 mb-6 mx-auto md:mx-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3 font-serif">프리랜서 용역 계약서</h2>
          <p className="text-slate-500 leading-relaxed">
            독립적 코치, 강사, 디자인, 개발, 글쓰기 등 프리랜서 계약이 필요하신가요?
          </p>
        </div>

        {/* Employment Card */}
        <div 
          onClick={() => onSelect(ContractType.EMPLOYMENT)}
          className="group relative bg-white rounded-xl p-10 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-slate-200 hover:border-slate-400 overflow-hidden text-center md:text-left"
        >
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
           
           <div className="w-14 h-14 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-700 mb-6 mx-auto md:mx-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3 font-serif">표준 근로 계약서</h2>
          <p className="text-slate-500 leading-relaxed">
            정규직, 계약직 등 직원을 채용하고 근로 기준법에 맞는 계약이 필요하신가요?
          </p>
        </div>
      </div>

      {history.length > 0 && (
        <div className="border-t border-slate-200 pt-12">
          <h3 className="text-xl font-bold text-slate-800 mb-6 font-serif">최근 작성 이력</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {history.map((item) => (
              <div 
                key={item.id}
                onClick={() => onLoadHistory(item)}
                className="group/item relative bg-white p-5 rounded-lg border border-slate-200 hover:border-slate-400 hover:shadow-md cursor-pointer transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-xs px-2 py-1 rounded font-medium ${item.type === ContractType.EMPLOYMENT ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'}`}>
                    {item.type === ContractType.EMPLOYMENT ? '근로계약' : '프리랜서'}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">
                        {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            if(window.confirm('삭제하시겠습니까?')) {
                                onDeleteHistory(item.id);
                            }
                        }}
                        className="text-slate-300 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"
                        title="삭제"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                  </div>
                </div>
                <div className="font-medium text-slate-800 truncate pr-6">
                  {item.formData.partyA} - {item.formData.partyB}
                </div>
                <div className="text-sm text-slate-500 mt-1 truncate">
                  {item.type === ContractType.EMPLOYMENT ? item.formData.jobTitle : item.formData.projectScope}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};