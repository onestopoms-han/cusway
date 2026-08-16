import React, { useState, useEffect, useMemo } from 'react';

// Type Definitions based on Designer's FlowSchema and Integration Blueprint
interface RiskMetric {
  name: string;
  value: number;
  status: 'Green' | 'Gold' | 'Red'; // Deep Forest Green / Rich Gold mapping
  description: string;
}

interface SystemStatus {
  e2eSuccessRate: number; // 0 to 100
  legalRiskScore: number; // 0 to 100 (Lower is better)
  failurePathCount: number; // Count of active failure paths
  systemStability: 'Stable' | 'Warning' | 'Critical';
}

interface SafetyDashboardProps {
  systemData: SystemStatus;
  riskMetrics: RiskMetric[];
}

// Helper function to map score to color based on the established theme (Deep Forest Green/Rich Gold)
const getColor = (status: 'Stable' | 'Warning' | 'Critical'): string => {
  switch (status) {
    case 'Stable':
      return 'text-green-600 bg-green-100 border-green-400'; // Deep Forest Green vibe
    case 'Warning':
      return 'text-yellow-600 bg-yellow-100 border-yellow-400'; // Warning/Caution
    case 'Critical':
      return 'text-red-600 bg-red-100 border-red-400'; // High Risk
    default:
      return 'text-gray-500 bg-gray-100 border-gray-300';
  }
};

const SafetyDashboard: React.FC<SafetyDashboardProps> = ({ systemData, riskMetrics }) => {
  const { e2eSuccessRate, legalRiskScore, failurePathCount, systemStability } = systemData;

  // Determine overall dashboard status based on core metrics
  const overallStatus = useMemo(() => {
    if (systemStability === 'Critical' || e2eSuccessRate < 70 || legalRiskScore > 50) {
      return 'Critical';
    }
    if (systemStability === 'Warning' || e2eSuccessRate < 85 || legalRiskScore > 30) {
      return 'Warning';
    }
    return 'Stable';
  }, [systemStability, e2eSuccessRate, legalRiskScore]);

  const statusClass = getColor(overallStatus);

  // Simulate exception handling display based on failure paths
  const failurePathAlert = useMemo(() => {
      if (failurePathCount > 0) {
          return `⚠️ ${failurePathCount}개의 활성 실패 경로 감지됨. 즉각적인 개입 필요.`;
      }
      return '✅ 모든 주요 경로가 안정적으로 처리되고 있습니다.';
  }, [failurePathCount]);

  return (
    <div className={`p-6 rounded-xl shadow-2xl transition-all border-4 ${statusClass}`}>
      <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-3">
        통제된 안정성 대시보드 ⚙️
      </h2>

      {/* Overall Stability Indicator */}
      <div className={`p-4 mb-6 rounded-lg text-center ${statusClass.replace('bg-', 'bg-')}`}>
        <p className="text-xl font-semibold">시스템 안정성: <span className={`ml-2 text-4xl font-extrabold ${overallStatus === 'Stable' ? 'text-green-700' : overallStatus === 'Warning' ? 'text-yellow-700' : 'text-red-700'}`}>
          {systemStability}
        </span></p>
        <p className="mt-2 text-lg">
            {failurePathAlert}
        </p>
      </div>

      {/* Core Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* E2E Success Rate Card (Focus on Stability) */}
        <div className={`p-5 rounded-xl border ${overallStatus === 'Stable' ? 'border-green-500' : overallStatus === 'Warning' ? 'border-yellow-500' : 'border-red-500'}`}>
          <p className="text-sm font-medium text-gray-500">E2E 테스트 성공률</p>
          <p className={`mt-1 text-4xl font-extrabold ${overallStatus === 'Stable' ? 'text-green-700' : overallStatus === 'Warning' ? 'text-yellow-700' : 'text-red-700'}`}>
            {e2eSuccessRate.toFixed(1)}%
          </p>
          <p className="mt-2 text-sm">최종 안정성 지표</p>
        </div>

        {/* Legal Risk Score Card (Focus on Compliance) */}
        <div className={`p-5 rounded-xl border ${overallStatus === 'Stable' ? 'border-green-500' : overallStatus === 'Warning' ? 'border-yellow-500' : 'border-red-500'}`}>
          <p className="text-sm font-medium text-gray-500">법적 리스크 점수</p>
          <p className={`mt-1 text-4xl font-extrabold ${overallStatus === 'Stable' ? 'text-green-700' : overallStatus === 'Warning' ? 'text-yellow-700' : 'text-red-700'}`}>
            {legalRiskScore.toFixed(1)} / 100
          </p>
          <p className="mt-2 text-sm">규제 준수 상태</p>
        </div>

        {/* Failure Path Card (Focus on Actionability) */}
        <div className={`p-5 rounded-xl border ${overallStatus === 'Stable' ? 'border-green-500' : overallStatus === 'Warning' ? 'border-yellow-500' : 'border-red-500'}`}>
          <p className="text-sm font-medium text-gray-500">활성 실패 경로</p>
          <p className={`mt-1 text-4xl font-extrabold ${overallStatus === 'Stable' ? 'text-green-700' : overallStatus === 'Warning' ? 'text-yellow-700' : 'text-red-700'}`}>
            {failurePathCount}
          </p>
          <p className="mt-2 text-sm">즉각적 조치 필요 여부</p>
        </div>

      </div>

      {/* Detailed Risk Metrics (FlowSchema Integration) */}
      <h3 className="text-xl font-semibold mt-8 mb-4 border-t pt-4">세부 리스크 지표</h3>
      <div className="space-y-4">
        {riskMetrics.map((metric, index) => (
          <div key={index} className={`p-4 rounded-lg border ${metric.status === 'Red' ? 'bg-red-50 border-red-300' : metric.status === 'Yellow' ? 'bg-yellow-50 border-yellow-300' : 'bg-green-50 border-green-300'}`}>
            <div className="flex justify-between items-start">
              <p className="font-medium text-lg">{metric.name}</p>
              <span className={`text-xl font-bold ${getColor(metric.status).replace('border-', 'text-')}`}>{metric.value.toFixed(1)}</span>
            </div>
            <p className="text-sm mt-1 text-gray-600">{metric.description}</p>
          </div>
        ))}
      </div>

      {/* Flow Schema Visualization Placeholder (Future Expansion) */}
      <div className="mt-10 pt-4 border-t border-dashed">
        <h4 className="font-semibold text-lg text-gray-700">FlowSchema 시각화 영역 (Next Step)</h4>
        <p className="text-sm mt-2 text-gray-500">Designer의 FlowSchema를 기반으로 상태 전환 로직을 동적으로 표시할 예정입니다.</p>
      </div>

    </div>
  );
};

export default SafetyDashboard;