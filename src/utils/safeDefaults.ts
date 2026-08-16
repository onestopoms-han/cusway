/**
 * Safe Default Value 로직 모듈. 시스템 안정성을 위해 경계값 처리를 보장합니다.
 */

export interface DefaultValues {
    rate: number;
    riskLevel: 'RED' | 'YELLOW' | 'GREEN';
    message: string;
}

/**
 * API 실패나 데이터 누락 시 안전 기본값을 계산하여 반환합니다.
 * @param input 원본 데이터 (null 허용)
 * @param defaults 적용할 안전값 객체
 * @returns 안전하게 보정된 값
 */
export function calculateSafeDefault(input: any, defaults: DefaultValues): DefaultValues {
    let rate = defaults.rate;
    let riskLevel = defaults.riskLevel;
    let message = defaults.message;

    if (input && typeof input.rate === 'number') {
        // 입력 값이 유효하면 이를 우선 사용
        rate = input.rate;
    } else if (!input) {
        // 입력 자체가 없으면 안전 기본값 사용
        console.warn("Input was null or undefined. Using default rate.");
    } else {
         // 데이터가 있지만 형식이 틀리면 (예: 문자열) 안전하게 처리
         rate = parseFloat(input.rate as any) || defaults.rate;
    }

    // 리스크 레벨은 항상 설정된 기본값으로 유지하거나, 명시적인 실패 시 'RED'로 강제
    if (riskLevel === 'RED' && input !== null) {
        // 만약 API가 Red를 반환했는데 데이터가 있다면, 그 데이터를 존중하되 안전성을 확인해야 함.
        // 여기서는 일단 기본값을 우선 적용하고, 실제 로직에서 더 정교하게 조정하도록 유도합니다.
    }

    return { rate: rate, riskLevel: riskLevel, message: message };
}