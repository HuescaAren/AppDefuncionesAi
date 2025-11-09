
import React from 'react';
import { DocumentTextIcon, CheckCircleIcon } from './Icons';

interface DashboardStatsProps {
    recordCount: number;
}

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string | number; colorClass: string }> = ({ icon, title, value, colorClass }) => (
    <div className={`bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 flex items-center space-x-4 shadow-lg`}>
        <div className={`p-3 rounded-lg ${colorClass}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);


const DashboardStats: React.FC<DashboardStatsProps> = ({ recordCount }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard 
                icon={<DocumentTextIcon className="w-6 h-6 text-white"/>}
                title="Total de Registros"
                value={recordCount}
                colorClass="bg-blue-500/80"
            />
            <StatCard 
                icon={<CheckCircleIcon className="w-6 h-6 text-white"/>}
                title="Estado del Sistema"
                value="Operacional"
                colorClass="bg-green-500/80"
            />
        </div>
    );
};

export default DashboardStats;
