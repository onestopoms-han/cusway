from abc import ABC, abstractmethod
from typing import Dict, Any
from pydantic import BaseModel

# --- A. 내부 표준 스키마 정의 ---
class StandardRiskInput(BaseModel):
    source_system: str
    risk_variables: Dict[str, Any]
    metadata: Dict[str, str]

# --- B. Adapter 인터페이스 명세 ---
class DataAdapterInterface(ABC):
    """
    모든 외부 데이터 소스에서 데이터를 수집하고 내부 표준 스키마로 변환하는 인터페이스.
    """
    @abstractmethod
    def fetch_and_transform(self, query_params: Dict[str, Any]) -> StandardRiskInput:
        """
        지정된 쿼리 파라미터를 기반으로 외부 시스템에서 데이터를 가져와 내부 표준 형식으로 변환합니다.

        Args:
            query_params: 외부 API 호출에 필요한 필터 및 검색 조건.

        Returns:
            StandardRiskInput: 리스크 계산 엔진이 즉시 사용할 수 있는 표준화된 데이터 모델.
        """
        pass