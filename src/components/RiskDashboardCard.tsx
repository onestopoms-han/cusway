import React from 'react';

interface RiskData {
    score: number;
    riskLevel: 'Normal' | 'Warning' | 'Critical';
    actionPlan: string;
}

interface RiskDashboardCardProps {
    riskData: RiskData;
}

const RiskDashboardCard: React.FC<RiskDashboardCardProps> = ({ riskData }) => {
    let colorClass = '';
    switch (riskData.riskLevel) {
        case 'Normal':
            colorClass = 'bg-green-100 border-green-500 text-green-800';
            break;
        case 'Warning':
            colorClass = 'bg-yellow-100 border-yellow-500 text-yellow-800';
            break;
        case 'Critical':
            colorClass = 'bg-red-100 border-red-500 text-red-800';
            break;
    }

    return (
        <div className={`p-6 rounded-lg shadow-md border-l-4 ${colorClass}`}>
            <h3 className="text-xl font-bold mb-2">리스크 상태: {riskData.riskLevel}</h3>
            <p className="text-3xl font-extrabold mb-4 text-gray-900">{riskData.score}</p>
            <div className="mt-4 p-3 border-t border-gray-300">
                <h4 className="font-semibold mb-1">다음 행동 지침 (Actionable Blueprint)</h4>
                <p className="text-sm text-gray-700">{riskData.actionPlan}</p>
            </div>
        </div>
    );
};

export default RiskDashboardCard;