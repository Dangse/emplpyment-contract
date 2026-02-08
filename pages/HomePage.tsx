import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Type definitions for accordion items
interface AccordionItem {
  id: number;
  title: string;
  subtitle?: string;
  // content allows ReactNode for rich formatting (lists, bold text, etc.)
  content: React.ReactNode; 
}

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // State for accordions
  const [openChecklistIndex, setOpenChecklistIndex] = useState<number | null>(null);
  const [openNewsIndex, setOpenNewsIndex] = useState<number | null>(null);

  const toggleChecklist = (index: number) => {
    setOpenChecklistIndex(openChecklistIndex === index ? null : index);
  };

  const toggleNews = (index: number) => {
    setOpenNewsIndex(openNewsIndex === index ? null : index);
  };

  // Data for Start-up Checklist
  const checklistItems: AccordionItem[] = [
    {
      id: 1,
      title: "사업용계좌 만들기",
      subtitle: "미이행시 매년수입금액 * 0.2% 가산세",
      content: (
        <>
          사업장 명의로 된 통장을 개설하고 반드시 <strong className="text-indigo-700">국세청 홈택스에 등록</strong>해야 합니다. 인건비, 임차료 등 주요 경비는 이 계좌를 통해 거래해야 비용 처리가 확실하며, 세무 조사 시 투명성을 입증하는 기본 자료가 됩니다.
        </>
      )
    },
    {
      id: 2,
      title: "10만원 이상 현금영수증 의무발행",
      subtitle: "미이행시 미발행금액 * 20% 가산세",
      content: (
        <>
          체육도장업은 현금영수증 의무발행 업종입니다. 소비자가 현금영수증 발급을 요청하지 않더라도, <strong className="text-red-600">건당 10만원 이상 거래 시</strong>에는 국세청 지정 코드(010-000-1234)로 자진 발급해야 가산세 폭탄을 피할 수 있습니다.
        </>
      )
    },
    {
      id: 3,
      title: "지출신용카드 홈택스에 등록하기",
      subtitle: "누락 시 비용 인정 어려움",
      content: (
        <>
          사업용으로 사용하는 신용카드(대표자 명의)를 홈택스 <strong>[조회/발급 &gt; 현금영수증 &gt; 사업용신용카드]</strong> 메뉴에 등록하세요. 등록된 카드로 결제한 내역은 부가가치세 신고 시 매입세액 공제 및 비용 처리가 자동으로 집계되어 절세에 큰 도움이 됩니다.
        </>
      )
    },
    {
      id: 4,
      title: "개업초기 인테리어 영수증 꼭 받기",
      subtitle: "적격증빙 수취 필수",
      content: (
        <>
          큰 비용이 들어가는 인테리어 공사 시, 반드시 <strong className="text-indigo-700">세금계산서, 현금영수증, 신용카드 매출전표</strong> 등 '적격증빙'을 받아야 합니다. 간이영수증이나 단순 이체 내역만으로는 감가상각비 처리가 불가능하여 향후 종합소득세 폭탄의 원인이 됩니다.
        </>
      )
    },
    {
      id: 5,
      title: "권리금 주고 인수시 서류 챙기기",
      subtitle: "계약서와 대금지급영수증",
      content: (
        <>
          권리금을 지급했다면 권리금 계약서를 작성하고, 권리금에 대한 <strong className="text-indigo-700">기타소득세(8.8%)</strong>를 원천징수하여 신고/납부해야 합니다. 이 과정을 거쳐야 지급한 권리금을 5년간 비용(감가상각)으로 인정받아 세금을 줄일 수 있습니다.
        </>
      )
    }
  ];

  // Data for Management News - Updated based on user request (2026.02.04)
  const newsItems: AccordionItem[] = [
    {
      id: 1,
      title: "💰 금융 및 운영자금 지원 (가장 시급)",
      content: (
        <div className="space-y-4 text-sm leading-relaxed text-slate-600">
           <div className="bg-white border border-slate-200 rounded-lg p-3">
             <div className="flex justify-between items-center mb-1">
                <strong className="text-indigo-700 text-base">스포츠산업 융자 (튼튼론)</strong>
                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">2/25 마감 (2차)</span>
             </div>
             <p className="mb-2">시설 개보수(10년 상환) 및 운영자금(2.96% 금리)을 지원합니다.</p>
             <a href="https://spobiz.kspo.or.kr" target="_blank" rel="noreferrer" className="text-indigo-500 font-bold hover:underline">👉 스포츠산업지원 (spobiz.kspo.or.kr)</a>
           </div>

           <div className="bg-white border border-slate-200 rounded-lg p-3">
             <strong className="text-slate-800 block mb-1">소상공인 정책자금</strong>
             <p className="mb-2">상시근로자 5인 미만 소상공인 대상, 시중 은행보다 낮은 금리로 대리 대출을 지원합니다.</p>
             <a href="https://ols.semas.or.kr" target="_blank" rel="noreferrer" className="text-slate-500 font-bold hover:underline">👉 소상공인시장진흥공단</a>
           </div>
        </div>
      )
    },
    {
      id: 2,
      title: "🎫 매출 및 수강생 유치 지원 (바우처)",
      content: (
        <div className="space-y-4 text-sm leading-relaxed text-slate-600">
           <div>
             <strong className="text-slate-800 block mb-1 text-base">✅ 스포츠강좌이용권 (시설 등록 필수)</strong>
             <ul className="list-disc pl-4 space-y-1">
                <li><strong>내용:</strong> 저소득층 유·청소년 월 수강료(10.5~11만원) 국비 지원</li>
                <li><strong>장점:</strong> 회원이 바우처 카드로 결제 시 자동 입금됩니다.</li>
                <li><a href="https://svoucher.kspo.or.kr" target="_blank" rel="noreferrer" className="text-indigo-500 font-bold hover:underline">등록하러 가기 (svoucher.kspo.or.kr)</a></li>
             </ul>
           </div>
           <hr className="border-slate-100"/>
           <div>
             <strong className="text-slate-800 block mb-1 text-base">🏃 튼튼머니 인증시설</strong>
             <p>국민체력100에 시설 등록 시, 회원이 출석할 때마다 현금성 포인트 지급. "운동하면 돈 버는 체육관"으로 홍보하세요.</p>
           </div>
        </div>
      )
    },
    {
      id: 3,
      title: "🛠 시설 및 환경 개선 (지원금)",
      content: (
         <div className="space-y-4 text-sm leading-relaxed text-slate-600">
            <div>
              <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded mb-1 inline-block">최대 1,500만원</span>
              <strong className="text-slate-800 block text-base">소상공인 스마트상점 기술보급</strong>
              <p>키오스크, 스마트미러, AI 동작분석기 등 도입 비용의 50~70%를 지원합니다. (2~4월 모집)</p>
            </div>
            <div>
              <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded mb-1 inline-block">최대 300만원</span>
              <strong className="text-slate-800 block text-base">경영환경개선 (성남시/경기도 등)</strong>
              <p>간판 교체, 인테리어, 바닥 공사 비용의 80~90% 지원. 지자체 공고(2~3월) 확인이 필수입니다.</p>
            </div>
            <div>
              <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded mb-1 inline-block">40% 환급</span>
              <strong className="text-slate-800 block text-base">한전 고효율기기 지원</strong>
              <p>에너지효율 1등급 냉난방기 신규 구매 시 구매 비용의 40%를 현금 환급해 드립니다.</p>
            </div>
         </div>
      )
    },
    {
      id: 4,
      title: "👥 인력 채용 지원 (인건비)",
      content: (
        <div className="text-sm leading-relaxed text-slate-600">
           <strong className="text-slate-800 block mb-1 text-base">스포츠산업 일자리 지원 (인턴십)</strong>
           <p className="mb-2">스포츠 직무 인턴 채용 시 인건비 일부(월 128만원 수준)를 지원하며, 정규직 전환 시 추가 혜택이 있습니다.</p>
           <div className="bg-slate-50 p-2 rounded text-xs">
             * 체육시설업 사업자 등록 및 4대보험 가입 필수
           </div>
        </div>
      )
    },
    {
      id: 5,
      title: "✅ 2월 관장님 핵심 체크리스트",
      content: (
         <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 text-sm text-slate-700">
            <ul className="space-y-3">
               <li className="flex gap-2">
                  <span className="text-red-500 font-bold">1.</span>
                  <span>
                    <strong>자금 신청 (2/25 마감):</strong><br/>
                    시설 투자가 필요하다면 '스포츠산업 융자(튼튼론)' 2차 접수를 놓치지 마세요.
                  </span>
               </li>
               <li className="flex gap-2">
                  <span className="text-red-500 font-bold">2.</span>
                  <span>
                    <strong>지자체 공고 확인:</strong><br/>
                    성남시청 홈페이지에서 "소상공인 경영환경개선" 검색 (간판/인테리어 지원)
                  </span>
               </li>
               <li className="flex gap-2">
                  <span className="text-red-500 font-bold">3.</span>
                  <span>
                    <strong>바우처 가맹:</strong><br/>
                    돈 드는 것 아니니 '스포츠강좌이용권' 가맹점 등록 즉시 신청!
                  </span>
               </li>
            </ul>
         </div>
      )
    }
  ];

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
           {/* Logo Image - Updated to logo192.png */}
           <img 
             src="/logo192.png" 
             alt="DH Logo" 
             className="w-12 h-12 rounded-full object-contain bg-transparent"
             onError={(e) => {
               // Fallback if image not found
               e.currentTarget.style.display = 'none';
               e.currentTarget.nextElementSibling?.classList.remove('hidden');
             }}
           />
           {/* Fallback div if image fails to load */}
           <div className="hidden w-10 h-10 bg-slate-900 text-white font-serif font-bold text-xl flex items-center justify-center rounded-lg shadow-lg">
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
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 font-serif leading-[1.1] tracking-tight">
            관장님 덕분에 <br className="hidden md:block"/>
            <span className="relative inline-block">
              <span className="relative z-10">대한민국이 더 건강해졌어요.</span>
              <span className="absolute bottom-2 left-0 w-full h-3 bg-indigo-100/80 -z-0"></span>
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-light">
            계약서 작성부터 급여 계산까지.<br/>
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

          {/* Section: Start-up Checklist (Accordion) */}
          <div className="w-full max-w-5xl col-span-1 md:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-lg border border-slate-100 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-indigo-500 to-blue-600"></div>
               
               <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-8 font-serif flex items-center gap-3">
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 text-2xl shadow-sm">💡</span> 
                  개업초기 알아야 할 일
                  <span className="text-sm font-sans font-normal text-slate-400 ml-auto">클릭하여 자세히 보기</span>
               </h3>
               
               <div className="space-y-3">
                {checklistItems.map((item, idx) => {
                  const isOpen = openChecklistIndex === idx;
                  return (
                    <div key={item.id} className={`rounded-xl border transition-all duration-300 overflow-hidden ${isOpen ? 'bg-indigo-50/30 border-indigo-200 ring-1 ring-indigo-200' : 'bg-slate-50/50 border-slate-100 hover:border-indigo-100'}`}>
                      <button 
                        onClick={() => toggleChecklist(idx)}
                        className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                      >
                        <div className="flex items-center gap-4">
                           <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors ${isOpen ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-white'}`}>
                            {idx + 1}
                          </span>
                          <div>
                            <span className={`font-bold text-lg block ${isOpen ? 'text-indigo-900' : 'text-slate-700'}`}>{item.title}</span>
                            {item.subtitle && <span className="text-xs text-slate-500 mt-0.5 block">{item.subtitle}</span>}
                          </div>
                        </div>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className={`h-5 w-5 text-slate-400 transform transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`} 
                          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <div className={`transition-[max-height,opacity] duration-300 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="px-5 pb-5 pl-[3.75rem] text-slate-600 leading-relaxed text-sm">
                          <div className="bg-white p-4 rounded-lg border border-indigo-100/50 shadow-sm">
                            <span className="font-bold text-indigo-500 mr-1">Detail.</span> {item.content}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* New Section: Management News (Accordion) */}
          <div className="w-full max-w-5xl col-span-1 md:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-lg border border-slate-100 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-emerald-500 to-teal-600"></div>
               
               <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-8 font-serif flex items-center gap-3">
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 text-2xl shadow-sm">📰</span> 
                  경영 소식 및 지원 정보
                  <span className="text-sm font-sans font-normal text-slate-400 ml-auto">최신 트렌드 확인하기</span>
               </h3>
               
               <div className="space-y-3">
                {newsItems.map((item, idx) => {
                  const isOpen = openNewsIndex === idx;
                  return (
                    <div key={item.id} className={`rounded-xl border transition-all duration-300 overflow-hidden ${isOpen ? 'bg-emerald-50/30 border-emerald-200 ring-1 ring-emerald-200' : 'bg-slate-50/50 border-slate-100 hover:border-emerald-100'}`}>
                      <button 
                        onClick={() => toggleNews(idx)}
                        className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                      >
                        <div className="flex items-center gap-4">
                           <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors ${isOpen ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-emerald-600'}`}>
                            N
                          </span>
                          <span className={`font-bold text-lg ${isOpen ? 'text-emerald-900' : 'text-slate-700'}`}>{item.title}</span>
                        </div>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className={`h-5 w-5 text-slate-400 transform transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-500' : ''}`} 
                          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <div className={`transition-[max-height,opacity] duration-300 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="px-5 pb-5 pl-[3.75rem] text-slate-600 leading-relaxed text-sm">
                          <div className="bg-white p-4 rounded-lg border border-emerald-100/50 shadow-sm flex gap-3">
                             <div className="w-1 bg-emerald-400 rounded-full flex-shrink-0"></div>
                             <div className="w-full">{item.content}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
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