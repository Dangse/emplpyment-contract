import { GoogleGenAI } from "@google/genai";
import { ContractType, ContractFormData } from "../types";

const getSystemInstruction = (type: ContractType): string => {
  return `당신은 대한민국의 전문 변호사이자 법률 문서 작성 전문가입니다. 
  사용자의 요청에 따라 매우 구체적이고 전문적이며 법적 효력이 있는 '${type === ContractType.EMPLOYMENT ? '근로계약서' : '프리랜서 용역 계약서'}'를 작성해야 합니다.
  
  작성 원칙:
  1. 대한민국 현행 법령(근로기준법, 하도급법 등)을 준수하십시오.
  2. 문체는 정중하고 명확한 법률 용어를 사용하십시오.
  3. 마크다운 형식을 사용하여 제목(##), 조항(제1조, 제2조...)을 명확히 구분하십시오.
  4. 계약서의 서두에 계약의 목적을 명시하십시오.
  5. 마지막에는 서명란(날짜, 서명 공간 포함)을 반드시 만드십시오.
  6. 불필요한 서론이나 주석 없이 오직 계약서 본문 내용만 출력하십시오.`;
};

const buildPrompt = (type: ContractType, data: ContractFormData): string => {
  const commonInfo = `
  - 갑(사용자/의뢰인): ${data.partyA}
  - 을(근로자/프리랜서): ${data.partyB}
  - 계약 시작일: ${data.startDate}
  - 계약 종료일: ${data.endDate || '기간 정함 없음 (정규직 또는 프로젝트 완료 시까지)'}
  - 추가 특약 사항: ${data.additionalTerms || '없음'}
  `;

  if (type === ContractType.EMPLOYMENT) {
    return `
    다음 정보를 바탕으로 '표준 근로계약서'를 작성해줘:
    ${commonInfo}
    - 근무 장소: ${data.workLocation || '회사 지정 장소'}
    - 업무 내용(직위): ${data.jobTitle || '지정된 업무'}
    - 근로 시간/휴게 시간: ${data.workingHours || '법정 근로시간 준수'}
    - 임금: ${data.paymentAmount}
    - 지급 방법: ${data.paymentTerms}
    - 수습 기간: ${data.probationPeriod || '없음'}
    `;
  } else {
    return `
    다음 정보를 바탕으로 '프리랜서 업무 위탁(용역) 계약서'를 작성해줘:
    ${commonInfo}
    - 업무 범위: ${data.projectScope || '상호 협의된 업무'}
    - 결과물(납품 대상): ${data.deliverables || '완성된 결과물'}
    
    [중요: 대금 지급 및 세금 조건]
    1. 보수 지급 기준: "${data.paymentAmount}" 
       (총액 계약이 아니며, 매월 성과 또는 업무 수행 결과에 따라 지급한다는 취지로 작성할 것)
    2. 지급 시기: ${data.paymentTerms}
    3. 세금 처리: "을"은 3.3% 인적용역 사업소득세 납부 대상자이므로, "갑"은 소득세 및 지방소득세(총 3.3%)를 원천징수하고 지급한다. **부가가치세(VAT)는 별도로 발생하지 않음을 명시할 것.**
    `;
  }
};

export const generateContractContent = async (
  type: ContractType,
  data: ContractFormData
): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key is missing.");
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Using a model good for reasoning and text generation
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: buildPrompt(type, data),
      config: {
        systemInstruction: getSystemInstruction(type),
        temperature: 0.3, // Lower temperature for more formal/consistent output
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Failed to generate contract content.");
    }

    return text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};