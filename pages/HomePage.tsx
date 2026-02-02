import React from 'react';
import { useNavigate } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}</style>
      
      {/* Background Decor - Subtle Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-50 rounded-full blur-[100px] opacity-60"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-50 rounded-full blur-[120px] opacity-60"></div>
      </div>

      {/* Header */}
      <header className="relative z-50 pt-6 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-slate-900 text-white font-serif font-bold text-xl flex items-center justify-center rounded-lg shadow-lg">
              DH
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 font-serif">
              대한세무법인
            </span>
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-500">
          <span className="text-xs px-3 py-1 bg-slate-100 rounded-full text-slate-600 font-bold">Premium Beta</span>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center px-4 py-16 md:py-24 max-w-7xl mx-auto w-full">
        
        {/* Hero Section */}
        <div className="text-center mb-16 md:mb-24 max-w-4xl mx-auto space-y-8 animate-fade-in-up">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-4">
             <span className="bg-gradient-to-r from-indigo-500 to-blue-600 bg-clip-text text-transparent text-xs md:text-sm font-bold tracking-wide uppercase">
               Next Generation Tax & Labor Solution
             </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 font-serif leading-[1.1] tracking-tight">
            관장님 덕분에 <br className="hidden md:block"/>
            <span className="relative inline-block">
              <span className="relative z-10">대한민국이 더 건강해졌어요.</span>
              <span className="absolute bottom-2 left-0 w-full h-3 bg-indigo-100/80 -z-0"></span>
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-light">
            계약서 작성부터  급여 계산까지.<br/>
            대한세무법인이 조금 더 도움이 되겠습니다.
          </p>
        </div>

        {/* Cards Section */}
        <div className="grid md:grid-cols-2 gap-6 w-full max-w-5xl px-2 mb-16">
          
          {/* Card 1: Contract - Clean White Theme */}
          <div 
            onClick={() => navigate('/contract')}
            className="group relative bg-white rounded-[2rem] p-8 md:p-12 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer border border-slate-100 overflow-hidden flex flex-col h-full min-h-[400px]"
          >
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 transform group-hover:scale-110 origin-top-right pointer-events-none">
               <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
            </div>

            <div className="relative z-10 flex flex-col h-full">
              <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-3xl mb-8 shadow-lg shadow-slate-900/20 group-hover:scale-110 transition-transform duration-300">
                <span className="text-white">⚖️</span>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 font-serif">
                AI 스마트 계약서
              </h2>
              <p className="text-slate-500 mb-8 leading-relaxed font-light">
                전문적인 계약서를 AI가 3초 만에 작성합니다.<br/>근로계약부터 프리랜서 용역까지 완벽하게.
              </p>
              
              <div className="mt-auto flex items-center font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                계약서 작성하기 
                <div className="ml-2 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Payroll - Dark Premium Theme */}
           <div 
            onClick={() => navigate('/payroll')}
            className="group relative bg-slate-900 rounded-[2rem] p-8 md:p-12 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer border border-slate-800 overflow-hidden flex flex-col h-full min-h-[400px]"
          >
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-indigo-600 rounded-full mix-blend-screen filter blur-[80px] opacity-20 animate-pulse"></div>
             <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity duration-500 transform group-hover:scale-110 origin-top-right pointer-events-none">
               <svg className="w-64 h-64 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>
            </div>

            <div className="relative z-10 flex flex-col h-full">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl mb-8 border border-white/10 group-hover:scale-110 transition-transform duration-300">
                <span className="text-white">💰</span>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 font-serif">
                급여관리
              </h2>
              <p className="text-slate-400 mb-8 leading-relaxed font-light">
                초간단 급여관리.<br/>클릭 한 번으로 대한세무법에 전달.
              </p>
              
              <div className="mt-auto flex items-center font-bold text-white group-hover:text-indigo-300 transition-colors">
                급여장부 관리하기 
                 <div className="ml-2 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* New Section: Start-up Checklist */}
          <div className="w-full max-w-5xl col-span-1 md:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-lg border border-slate-100 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-indigo-500 to-blue-600"></div>
               
               <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-6 font-serif flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 text-lg">💡</span> 
                  개업초기 알아야 할 일
               </h3>
               
               <ul className="grid gap-3 md:grid-cols-1">
                {[
                  "사업용계좌만들기 - 미이행시 매년수입금액 * 0.2% 가산세 ",
                  "10만원 이상 현금영수증의무발행 - 미이행시 미발행금액 *20% 가산세",
                  "지출신용카드 홈텍스에 반드시 등록하기",
                  "개업초기 인테리어 영수증 꼭 받기",
                  "권리금 주고 인수시 계약서와 대금지급영수증 챙기기"
                ].map((text, idx) => (
                  <li key={idx} className="flex items-center text-slate-600 bg-slate-50/50 p-4 rounded-xl border border-slate-100 hover:bg-indigo-50/30 hover:border-indigo-100 transition-all duration-300">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold mr-4 flex-shrink-0 shadow-sm">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-slate-700">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center text-slate-400 text-sm">
        <p className="font-serif opacity-50">DH Tax Firm © {new Date().getFullYear()} All rights reserved.</p>
      </footer>
    </div>
  );
};