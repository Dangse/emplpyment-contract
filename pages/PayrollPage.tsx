import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

// Types for Payroll Data
interface Coach {
  id: string;
  name: string;
  jumin: string;
}
interface DB {
  coaches: Coach[];
  years: Record<string, Record<string, number[]>>;
  rosters: Record<string, string[]>;
}

// Utility: Jumin Validation
const validateJumin = (jumin: string): { isValid: boolean; message: string } => {
  const cleanJumin = jumin.replace(/-/g, '');
  if (!/^\d+$/.test(cleanJumin)) return { isValid: false, message: "숫자만 입력해주세요." };
  if (cleanJumin.length !== 13) return { isValid: false, message: "13자리가 아닙니다." };

  // Checksum algorithm for Korean Resident Registration Number
  // Logic: (2*1st + 3*2nd + ... + 5*12th) % 11
  // Result = 11 - (Sum % 11)
  // Last digit match check
  const weights = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5];
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleanJumin[i]) * weights[i];
  }
  const checkDigit = (11 - (sum % 11)) % 10;
  
  if (checkDigit !== parseInt(cleanJumin[12])) {
    // Note: Some newer or foreigner numbers might fail standard checksum logic, 
    // but for most standard cases this works. We will give a warning but not block completely in case of exceptions.
    return { isValid: false, message: "유효하지 않은 주민번호 형식입니다." };
  }

  return { isValid: true, message: "유효한 주민번호입니다." };
};

export const PayrollPage: React.FC = () => {
  const navigate = useNavigate();
  const CURRENT_YEAR = new Date().getFullYear().toString();
  
  // State
  const [db, setDb] = useState<DB>({
    coaches: [],
    years: {},
    rosters: {}
  });
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [availableYears, setAvailableYears] = useState<string[]>([CURRENT_YEAR]);
  
  // Modal States
  const [isMasterModalOpen, setIsMasterModalOpen] = useState(false);
  const [isRosterModalOpen, setIsRosterModalOpen] = useState(false);
  const [rosterTargetMonth, setRosterTargetMonth] = useState<number>(0);
  
  // Input States
  const [newCoachName, setNewCoachName] = useState('');
  const [newCoachJumin, setNewCoachJumin] = useState('');
  const [juminValidationMsg, setJuminValidationMsg] = useState('');
  const [saveIndicator, setSaveIndicator] = useState('');

  // 1. Load Data on Mount
  useEffect(() => {
    // Load Payroll Data
    const saved = localStorage.getItem('boxing_payroll_v6_final');
    if (saved) {
      const parsed: DB = JSON.parse(saved);
      if (!parsed.years[CURRENT_YEAR]) parsed.years[CURRENT_YEAR] = {};
      if (!parsed.rosters) parsed.rosters = {};
      setDb(parsed);

      const years = Object.keys(parsed.years).sort();
      if (!years.includes(CURRENT_YEAR)) years.push(CURRENT_YEAR);
      setAvailableYears(years);
    } else {
         setDb(prev => ({
            ...prev,
            years: { [CURRENT_YEAR]: {} }
         }));
    }
  }, [CURRENT_YEAR]);

  // Jumin Input Handler
  const handleNewJuminChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/-/g, ''); // Auto strip hyphen
    if (val.length > 13) return; // Limit length
    setNewCoachJumin(val);
    
    if (val.length > 0) {
      const check = validateJumin(val);
      setJuminValidationMsg(check.isValid ? "✅ " + check.message : "❌ " + check.message);
    } else {
      setJuminValidationMsg('');
    }
  };

  // 2. Save Helper
  const saveData = (newDb: DB) => {
    setDb(newDb);
    localStorage.setItem('boxing_payroll_v6_final', JSON.stringify(newDb));
    setSaveIndicator("● 저장됨");
    setTimeout(() => setSaveIndicator(""), 2000);
  };

  // 3. Logic: Add Coach
  const addNewCoachToMaster = () => {
    if (!newCoachName.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }
    
    // Validate Jumin
    const validation = validateJumin(newCoachJumin);
    if (newCoachJumin && !validation.isValid) {
      if(!confirm(`주민번호 경고: ${validation.message}\n그래도 등록하시겠습니까?`)) return;
    }

    if (db.coaches.length >= 20) {
      alert("코치 등록은 최대 20명까지 가능합니다.");
      return;
    }

    const newId = 'c_' + Date.now();
    const newCoach = { id: newId, name: newCoachName.trim(), jumin: newCoachJumin.trim() };
    
    const newDb = { ...db };
    newDb.coaches.push(newCoach);
    
    // Auto-add to all rosters
    for(let m=0; m<12; m++) {
        if(!newDb.years[selectedYear]) newDb.years[selectedYear] = {};
        if(!newDb.years[selectedYear][newId]) newDb.years[selectedYear][newId] = Array(12).fill(0);
        
        const rKey = `${selectedYear}-${m}`;
        if(!newDb.rosters[rKey]) newDb.rosters[rKey] = [];
        if(!newDb.rosters[rKey].includes(newId)) newDb.rosters[rKey].push(newId);
    }
    
    saveData(newDb);
    setNewCoachName('');
    setNewCoachJumin('');
    setJuminValidationMsg('');
  };

  // Logic: Delete Coach
  const deleteMasterCoach = (id: string) => {
    if(window.confirm("정말 삭제하시겠습니까? 이 코치의 모든 급여 기록이 영구 삭제됩니다.")) {
        const newDb = { ...db };
        newDb.coaches = newDb.coaches.filter(c => c.id !== id);
        Object.keys(newDb.years).forEach(y => {
            if (newDb.years[y][id]) delete newDb.years[y][id];
        });
        Object.keys(newDb.rosters).forEach(k => {
            newDb.rosters[k] = newDb.rosters[k].filter(cid => cid !== id);
        });
        saveData(newDb);
    }
  };

  // Logic: Update Coach Jumin
  const updateCoachJumin = (id: string, rawVal: string) => {
    const cleanVal = rawVal.replace(/-/g, '');
    const newDb = { ...db };
    const coach = newDb.coaches.find(c => c.id === id);
    if(coach) {
        coach.jumin = cleanVal;
        saveData(newDb);
    }
  };

  // Logic: Roster Management
  const openRosterAddModal = (monthIndex: number) => {
    setRosterTargetMonth(monthIndex);
    setIsRosterModalOpen(true);
  };

  const addToRoster = (coachId: string) => {
    const newDb = { ...db };
    const key = `${selectedYear}-${rosterTargetMonth}`;
    
    if (!newDb.rosters[key]) newDb.rosters[key] = [];
    if (!newDb.rosters[key].includes(coachId)) newDb.rosters[key].push(coachId);
    
    if (!newDb.years[selectedYear]) newDb.years[selectedYear] = {};
    if (!newDb.years[selectedYear][coachId]) newDb.years[selectedYear][coachId] = Array(12).fill(0);

    saveData(newDb);
    setIsRosterModalOpen(false);
  };

  const removeFromRoster = (monthIndex: number, coachId: string) => {
    const newDb = { ...db };
    const key = `${selectedYear}-${monthIndex}`;
    if (newDb.rosters[key]) {
        newDb.rosters[key] = newDb.rosters[key].filter(id => id !== coachId);
    }
    saveData(newDb);
  };

  const updateAmount = (monthIndex: number, coachId: string, value: string) => {
    const num = parseInt(value.replace(/[^0-9]/g, '')) || 0;
    const newDb = { ...db };
    
    if (!newDb.years[selectedYear]) newDb.years[selectedYear] = {};
    if (!newDb.years[selectedYear][coachId]) newDb.years[selectedYear][coachId] = Array(12).fill(0);
    
    newDb.years[selectedYear][coachId][monthIndex] = num;
    saveData(newDb);
  };

  // --- Logic: Excel Export & Email ---
  const handleExcelAndEmail = () => {
    // 1. Prepare Data
    const rows = [];
    // Header
    const headers = [
      "귀속년월", "지급년월일", "소득자명", "주민등록번호", 
      "기본주소", "상세주소", "소득구분", "영수일자", 
      "지급총액", "세율(%)", "소득세", "지방소득세", 
      "내.외국인구분", "연말정산"
    ];
    rows.push(headers);

    let hasData = false;
    for (let m = 0; m < 12; m++) {
      const roster = db.rosters[`${selectedYear}-${m}`] || [];
      roster.forEach(id => {
        const val = db.years[selectedYear]?.[id]?.[m] || 0;
        if (val > 0) {
          hasData = true;
          const coach = db.coaches.find(c => c.id === id);
          if (coach) {
             // Calculations
             const incomeTax = Math.floor(val * 0.03); // 3%
             const localTax = Math.floor(incomeTax * 0.1); // 10% of Income Tax (0.3% total)
             // Or commonly 3.3% total. Let's use standard: Income Tax (3%) + Local Tax (0.3%)
             
             rows.push([
               `${selectedYear}-${String(m + 1).padStart(2, '0')}`, // 귀속년월
               ``, // 지급년월일 (Leave blank)
               coach.name, // 소득자명
               coach.jumin.replace(/-/g, ''), // 주민등록번호 (No hyphens)
               "", // 기본주소
               "", // 상세주소
               "사업소득", // 소득구분
               "", // 영수일자
               val, // 지급총액
               "3.3", // 세율
               incomeTax, // 소득세
               localTax, // 지방소득세
               "내국인", // 내.외국인구분
               "" // 연말정산
             ]);
          }
        }
      });
    }

    if (!hasData) {
      alert("전송할 급여 데이터가 없습니다.");
      return;
    }

    // 2. Generate Excel File
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(rows);
    
    // Column Widths
    ws['!cols'] = [
      { wch: 10 }, { wch: 12 }, { wch: 10 }, { wch: 15 },
      { wch: 20 }, { wch: 20 }, { wch: 10 }, { wch: 10 },
      { wch: 12 }, { wch: 8 }, { wch: 10 }, { wch: 10 },
      { wch: 10 }, { wch: 10 }
    ];

    XLSX.utils.book_append_sheet(wb, ws, "급여대장");
    XLSX.writeFile(wb, `${selectedYear}_급여신고자료.xlsx`);

    // 3. Alert Instructions for Mobile/Desktop
    alert(`[파일 저장 완료]\n\n엑셀 파일이 기기에 저장되었습니다.\n• PC: '다운로드' 폴더 확인\n• 모바일: '내 파일' 또는 '파일' 앱 내의 다운로드 폴더 확인\n\n확인 버튼을 누르면 이메일 앱이 열립니다.\n저장된 파일을 직접 첨부해서 보내주세요.`);

    // 4. Open Email Client
    const subject = encodeURIComponent(`${selectedYear}년 급여신고 자료 제출`);
    const body = encodeURIComponent(
      `세무사님 안녕하세요,\n\n${selectedYear}년도 체육관 급여신고 자료를 엑셀 파일로 송부드립니다.\n\n(다운로드된 엑셀 파일을 이 메일에 첨부하여 보내주세요.)\n\n감사합니다.`
    );
    
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  // Dashboard Stats
  const { yGross, yTax, yNet } = (() => {
    let yGross=0, yTax=0;
    for(let m=0; m<12; m++) {
        const roster = db.rosters[`${selectedYear}-${m}`] || [];
        roster.forEach(id => {
            const val = db.years[selectedYear]?.[id]?.[m] || 0;
            yGross += val;
            yTax += Math.floor(val * 0.033);
        });
    }
    return { yGross, yTax, yNet: yGross - yTax };
  })();

  return (
    <div className="bg-slate-50 min-h-screen pb-20 font-sans text-slate-800">
        <div className="max-w-3xl mx-auto px-4 py-4">
            {/* Nav */}
            <div className="flex items-center justify-between mb-3">
                 <button onClick={() => navigate('/')} className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    홈으로
                </button>
                <div className="text-xs font-bold text-slate-400">DH 급여관리 Pro</div>
            </div>

            {/* Header */}
            <header className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-5 sticky top-2 z-40">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-black text-slate-800 flex items-center gap-2">
                        🥊 급여 장부
                    </h1>
                    <select 
                        value={selectedYear} 
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="bg-slate-100 font-bold text-indigo-700 py-1 px-3 rounded-lg border-none outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {availableYears.map(y => <option key={y} value={y}>{y}년 장부</option>)}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setIsMasterModalOpen(true)} className="bg-white border-2 border-slate-100 text-slate-600 py-3 rounded-xl font-bold text-sm hover:border-indigo-200 hover:text-indigo-600 flex items-center justify-center gap-2 transition-all">
                        <span>👥</span> 코치 관리
                    </button>
                    <button onClick={handleExcelAndEmail} className="bg-green-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-green-700 flex items-center justify-center gap-2 transition-all shadow-md shadow-green-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        세무사 전송 (엑셀)
                    </button>
                </div>
                
                <div className={`text-right text-[10px] mt-2 h-4 font-medium transition-colors ${saveIndicator ? 'text-green-600' : 'text-slate-400'}`}>
                    {saveIndicator}
                </div>
            </header>

            {/* Dashboard */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-5 text-white shadow-lg mb-6">
                <div className="flex justify-between items-start mb-2">
                    <h2 className="text-sm font-bold text-indigo-100 opacity-80">올해 누적 지급 현황</h2>
                    <span className="bg-white/20 px-2 py-0.5 rounded text-[10px]">Total Year</span>
                </div>
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-xs text-indigo-200 mb-1">총 실지급액 (세후)</p>
                        <p className="text-3xl font-black tracking-tight">{yNet.toLocaleString()}원</p>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] text-indigo-200">총 세전 <span className="text-white font-bold ml-1 text-sm">{yGross.toLocaleString()}</span></div>
                        <div className="text-[10px] text-indigo-200">총 세금 <span className="text-red-200 font-bold ml-1 text-sm">{yTax.toLocaleString()}</span></div>
                    </div>
                </div>
            </div>

            {/* Month Cards */}
            <div className="space-y-6">
                {Array.from({length: 12}).map((_, i) => {
                    const monthIndex = i;
                    const rosterIds = db.rosters[`${selectedYear}-${monthIndex}`] || [];
                    const roster = rosterIds.map(id => db.coaches.find(c => c.id === id)).filter(c => c) as Coach[];
                    
                    let mGross=0, mTax=0, mNet=0;
                    roster.forEach(c => {
                        const val = db.years[selectedYear]?.[c.id]?.[monthIndex] || 0;
                        mGross += val;
                        mTax += Math.floor(val * 0.033);
                    });
                    mNet = mGross - mTax;

                    return (
                        <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="bg-slate-50 px-5 py-3 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="text-lg font-black text-slate-800">{monthIndex + 1}월</h3>
                                <button onClick={() => openRosterAddModal(monthIndex)} className="text-xs bg-white border border-slate-200 text-indigo-600 font-bold px-3 py-1.5 rounded-lg hover:bg-indigo-50 shadow-sm">+ 근무자 추가</button>
                            </div>
                            
                            <div className="px-5 py-2">
                                {roster.length === 0 ? (
                                    <div className="text-center py-6 text-xs text-slate-400">근무 기록이 없습니다.</div>
                                ) : (
                                    roster.map(c => {
                                        const val = db.years[selectedYear]?.[c.id]?.[monthIndex] || 0;
                                        const tax = Math.floor(val * 0.033);
                                        const net = val - tax;

                                        return (
                                            <div key={c.id} className="py-3 border-b border-slate-100 last:border-0">
                                                <div className="flex justify-between items-center mb-1">
                                                    <div className="font-bold text-slate-700 text-sm">{c.name}</div>
                                                    <button onClick={() => removeFromRoster(monthIndex, c.id)} className="text-[10px] text-slate-300 hover:text-red-500 border border-slate-100 hover:border-red-200 px-2 py-0.5 rounded transition-colors">이달 제외</button>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="relative flex-1">
                                                        <input 
                                                            type="tel" 
                                                            value={val > 0 ? val.toLocaleString() : ''}
                                                            onChange={(e) => updateAmount(monthIndex, c.id, e.target.value)}
                                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-right font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none text-sm placeholder-slate-300" 
                                                            placeholder="0" 
                                                        />
                                                        <span className="absolute left-2 top-2.5 text-[10px] text-slate-400 font-medium">지급액</span>
                                                    </div>
                                                    <div className="w-[40%] flex flex-col items-end text-right">
                                                        <div className="text-[10px] text-slate-500 mb-0.5">세금(3.3%) <span className="text-red-500 font-medium ml-1">{tax.toLocaleString()}</span></div>
                                                        <div className="text-sm font-black text-indigo-700"><span className="text-[10px] text-indigo-300 mr-1 font-normal">차인</span>{net.toLocaleString()}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                            
                            <div className="bg-indigo-50/50 border-t border-indigo-100 px-5 py-4 mt-2">
                                <div className="flex justify-between items-center mb-2"><span className="text-xs font-bold text-indigo-900 bg-indigo-100 px-2 py-1 rounded">월말 합계</span></div>
                                <div className="grid grid-cols-3 gap-2 text-center divide-x divide-indigo-200/50">
                                    <div><div className="text-[10px] text-slate-500 mb-1">총 지급액</div><div className="text-sm font-bold text-slate-700">{mGross.toLocaleString()}</div></div>
                                    <div><div className="text-[10px] text-slate-500 mb-1">총 원천세</div><div className="text-sm font-bold text-red-500">{mTax.toLocaleString()}</div></div>
                                    <div><div className="text-[10px] text-indigo-500 font-bold mb-1">총 차인지급액</div><div className="text-base font-black text-indigo-700">{mNet.toLocaleString()}</div></div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <div className="text-center text-slate-300 text-xs mt-10 mb-4">
                Boxing Gym Payroll System Final
            </div>
        </div>

        {/* Modal: Master Coach Manager */}
        {isMasterModalOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[60] flex items-center justify-center px-4">
                <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl flex flex-col max-h-[80vh]">
                    <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
                        <h3 className="text-lg font-bold text-slate-800">코치 인적사항 관리</h3>
                        <button onClick={() => setIsMasterModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                    </div>
                    
                    <div className="p-5 overflow-y-auto flex-1">
                        <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 mb-6">
                            <h4 className="text-xs font-bold text-indigo-800 mb-3">✨ 신규 코치 등록</h4>
                            <div className="space-y-2">
                                <input 
                                    type="text" 
                                    placeholder="이름 (예: 홍길동)" 
                                    value={newCoachName}
                                    onChange={(e) => setNewCoachName(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                                />
                                <div>
                                    <input 
                                        type="tel"
                                        placeholder="주민번호 (숫자만 입력)" 
                                        value={newCoachJumin}
                                        onChange={handleNewJuminChange}
                                        maxLength={13}
                                        className={`w-full px-3 py-2 rounded-lg border text-sm focus:ring-2 outline-none ${juminValidationMsg.includes('❌') ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-indigo-500'}`}
                                    />
                                    {juminValidationMsg && (
                                        <p className={`text-[10px] mt-1 ml-1 ${juminValidationMsg.includes('✅') ? 'text-green-600' : 'text-red-500'}`}>
                                            {juminValidationMsg}
                                        </p>
                                    )}
                                </div>
                                <button onClick={addNewCoachToMaster} className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg text-sm hover:bg-indigo-700 mt-2">등록하기</button>
                            </div>
                        </div>

                        <h4 className="text-xs font-bold text-slate-500 mb-3 ml-1">등록된 코치 명단</h4>
                        <div className="space-y-3">
                            {db.coaches.length === 0 ? (
                                <p className="text-center text-slate-400 text-xs py-4">등록된 코치가 없습니다.</p>
                            ) : (
                                db.coaches.map(c => (
                                    <div key={c.id} className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <div className="font-bold text-slate-800">{c.name}</div>
                                                <div className="text-xs text-slate-400 mt-0.5">ID: {c.id.slice(-4)}</div>
                                            </div>
                                            <button onClick={() => deleteMasterCoach(c.id)} className="text-xs text-red-400 hover:text-red-600 border border-slate-200 px-2 py-1 rounded">삭제</button>
                                        </div>
                                        <div className="mt-2 flex gap-2">
                                            <input 
                                                type="text" 
                                                defaultValue={c.jumin}
                                                maxLength={13}
                                                onBlur={(e) => {
                                                    const val = e.target.value.replace(/-/g, '');
                                                    if(val !== c.jumin) updateCoachJumin(c.id, val);
                                                }}
                                                placeholder="주민번호 (숫자만)"
                                                className="flex-1 bg-slate-50 border border-slate-100 rounded px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-indigo-300 tracking-wider" 
                                            />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Modal: Add to Roster */}
        {isRosterModalOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[60] flex items-center justify-center px-4">
                <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl">
                    <h3 className="text-lg font-bold mb-4">{rosterTargetMonth + 1}월 근무자 추가</h3>
                    <p className="text-xs text-slate-500 mb-4">이달 급여 대장에 포함할 코치를 선택하세요.</p>
                    
                    <div className="space-y-2 max-h-60 overflow-y-auto mb-4 custom-scroll">
                        {(() => {
                            const currentRoster = db.rosters[`${selectedYear}-${rosterTargetMonth}`] || [];
                            const available = db.coaches.filter(c => !currentRoster.includes(c.id));
                            
                            if (available.length === 0) return <p className="text-slate-400 text-sm text-center py-4">추가 가능한 코치가 없습니다.<br/>'코치 명단 관리'에서 신규 코치를 등록하세요.</p>;

                            return available.map(c => (
                                <button key={c.id} onClick={() => addToRoster(c.id)} className="w-full text-left flex justify-between items-center p-3 hover:bg-indigo-50 rounded-xl border border-slate-100 mb-2 group transition-colors">
                                    <span className="font-bold text-slate-700">{c.name}</span>
                                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded group-hover:bg-indigo-200 font-medium">추가하기 +</span>
                                </button>
                            ));
                        })()}
                    </div>
                    <div className="flex justify-end gap-2">
                        <button onClick={() => setIsRosterModalOpen(false)} className="px-4 py-2 text-slate-500 font-medium hover:bg-slate-100 rounded-lg">닫기</button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};