import React, { useRef } from 'react';
import { Button } from './Button';

interface ResultViewProps {
  content: string;
  onReset: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ content, onReset }) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = async () => {
    try {
      // For copy, we might want raw text, but strip markdown symbols for better paste
      const plainText = content.replace(/[#*]/g, '');
      await navigator.clipboard.writeText(plainText);
      alert('계약서 내용이 클립보드에 복사되었습니다.');
    } catch (err) {
      alert('복사에 실패했습니다.');
    }
  };

  // Function to parse markdown-like content into stylized HTML
  const renderFormattedContent = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      // 1. Headers (starts with #)
      if (line.trim().startsWith('#')) {
        const cleanText = line.replace(/^[#\s]+/, ''); // Remove # and leading spaces
        return (
          <h3 key={index} className="text-xl font-bold text-slate-900 mt-8 mb-4 font-serif border-b-2 border-slate-900 pb-2">
            {cleanText}
          </h3>
        );
      }
      
      // 2. Bold Text (wrapped in **) - simple handling
      // We will parse the line to find **bold** segments
      const parts = line.split(/(\*\*.*?\*\*)/g);
      
      const isEmpty = line.trim() === '';
      if (isEmpty) return <div key={index} className="h-4"></div>;

      return (
        <p key={index} className="text-base leading-relaxed text-slate-800 mb-2 text-justify">
          {parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
            }
            return <span key={i}>{part}</span>;
          })}
        </p>
      );
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6 no-print">
        <h2 className="text-2xl font-bold text-slate-900 font-serif">계약서 최종 확인</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onReset} className="hidden md:flex">
            새로 만들기
          </Button>
        </div>
      </div>

      <div className="bg-slate-200 p-1 md:p-8 rounded-xl shadow-inner">
        <div className="bg-white shadow-2xl rounded-sm overflow-hidden mb-8 max-w-[210mm] mx-auto min-h-[297mm]">
          {/* Toolbar */}
          <div className="bg-slate-50 p-4 flex gap-3 justify-end border-b border-slate-100 no-print">
             <Button variant="secondary" onClick={handleCopy} className="text-sm px-4 py-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
              </svg>
              텍스트 복사
            </Button>
            <Button variant="primary" onClick={handlePrint} className="text-sm px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white shadow-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
              </svg>
              인쇄 / PDF 저장
            </Button>
          </div>

          {/* Contract Content - A4 sized simulation */}
          <div ref={printRef} className="print-area p-10 md:p-16 bg-white text-slate-900">
            <div className="mb-12 text-center pb-8 border-b-4 border-double border-slate-900">
              <div className="inline-block border-2 border-slate-900 px-3 py-1 text-lg font-bold font-serif mb-4">DH 대한세무법인</div>
            </div>
            {renderFormattedContent(content)}
             <div className="mt-16 pt-8 border-t border-slate-300 text-center text-slate-500 text-xs font-serif">
              DH Tax Firm Contract Generation Service
            </div>
          </div>
        </div>
      </div>
       <div className="flex justify-center no-print pb-8">
        <Button variant="outline" onClick={onReset} className="md:hidden w-full">
            새로 만들기
        </Button>
       </div>
    </div>
  );
};