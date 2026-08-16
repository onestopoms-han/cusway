// src/components/RiskDashboardPoC.tsx
import React, { useState } from 'react';
import { RiskProcessorService } from '../services/RiskProcessorService';
import { SafetyContext } from '../types/ActionBlueprintSchema'; // 가정된 스키마 임포트

interface RiskResult {
    status: 'Critical' | 'Warning' | 'Safe';
    action: string;
    message: string;
    visualColor: 'Red' | 'Amber' | 'Green';
}

// Mock Data for demonstration purposes (실제 API 호출을 대체)
const mockInputData = { violationType: 'API Failure', detail: '503 Service Unavailable' };
const mockContext: SafetyContext = { environment: 'Production', userRole: 'Admin' };

const RiskDashboardPoC: React.FC = () => {
    const [input, setInput] = useState(mockInputData);
    const [result, setResult] = useState<RiskResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const process = async () => {
        setIsLoading(true);
        // 실제 서비스 호출 시뮬레이션 (여기서는 동기적으로 처리)
        const processor = new RiskProcessorService();
        const processedResult = processor.processRisk(input, mockContext);
        setResult(processedResult);
        setIsLoading(false);
    };

    return (
        <div className="p-6 bg-gray-900 text-white min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-yellow-400 border-b border-yellow-700 pb-2">
                🛡️ Risk & Control Recovery PoC Demo
            </h1>

            <div className="mb-8 p-4 border border-gray-700 rounded-lg bg-gray-800">
                <h2 className="text-xl font-semibold mb-3 text-green-400">Input Scenario</h2>
                <p><strong>입력 데이터:</strong> {JSON.stringify(input)}</p>
                <button 
                    onClick={process} 
                    disabled={isLoading}
                    className={`mt-3 px-6 py-2 rounded font-bold transition duration-150 ${isLoading ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                >
                    {isLoading ? '처리 중...' : '시스템 리스크 처리 실행'}
                </button>
            </div>

            {result && (
                <div className={`p-6 border-4 rounded-xl shadow-2xl transition-all duration-500 ${result.visualColor === 'Red' ? 'bg-red-900 border-red-500' : result.visualColor === 'Amber' ? 'bg-amber-900 border-amber-500' : 'bg-green-900 border-green-500'}`}>
                    <h2 className={`text-3xl font-extrabold mb-4 text-${result.visualColor === 'Red' ? 'red-400' : result.visualColor === 'Amber' ? 'amber-400' : 'green-400'}`}>
                        {result.status} Status
                    </h2>
                    <div className="space-y-4">
                        <div className="p-3 bg-gray-700 rounded-md">
                            <p className="text-lg font-medium mb-1 text-yellow-300">Action Taken (Fallback)</p>
                            <p className="text-white">{result.action}</p>
                        </div>
                        <div className="p-3 bg-gray-700 rounded-md">
                            <p className="text-lg font-medium mb-1 text-yellow-300">System Message (Control Recovery)</p>
                            <p className="text-white italic">{result.message}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RiskDashboardPoC;