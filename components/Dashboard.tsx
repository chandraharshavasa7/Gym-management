
import React, { useMemo } from 'react';
import { Member, PaymentStatus } from '../types';
import { UsersIcon, CheckCircleIcon, XCircleIcon, ClockIcon, TrendingUpIcon } from './Icons';

interface DashboardProps {
  members: Member[];
}

interface StatCardProps {
    icon: React.ReactNode;
    title: string;
    value: number | string;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-4 transition-transform transform hover:scale-105">
        <div className={`rounded-full p-3 ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-brand-dark">{value}</p>
        </div>
    </div>
);


const Dashboard: React.FC<DashboardProps> = ({ members }) => {
  const stats = useMemo(() => {
    const total = members.length;
    
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const unpaidThisMonth = members.filter(m => {
        if (m.paymentStatus === PaymentStatus.UNPAID) return true;
        if (m.lastPaymentDate) {
            return new Date(m.lastPaymentDate) < firstDayOfMonth;
        }
        return true;
    }).length;

    const paidThisMonth = total - unpaidThisMonth;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const recentlyUpdated = members.filter(m => {
        return new Date(m.lastUpdatedDate) > thirtyDaysAgo;
    }).length;

    const activeLast30d = members.filter(m => {
        return m.lastPaymentDate && new Date(m.lastPaymentDate) > thirtyDaysAgo;
    }).length;

    return { total, paidThisMonth, unpaidThisMonth, recentlyUpdated, activeLast30d };
  }, [members]);

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <StatCard 
            icon={<UsersIcon className="h-8 w-8 text-white"/>} 
            title="Total Members" 
            value={stats.total} 
            color="bg-blue-500"
        />
        <StatCard 
            icon={<CheckCircleIcon className="h-8 w-8 text-white"/>}
            title="Paid This Month" 
            value={stats.paidThisMonth} 
            color="bg-green-500"
        />
        <StatCard 
            icon={<XCircleIcon className="h-8 w-8 text-white"/>}
            title="Unpaid This Month" 
            value={stats.unpaidThisMonth} 
            color="bg-red-500"
        />
        <StatCard 
            icon={<ClockIcon className="h-8 w-8 text-white"/>} 
            title="Updated Last 30d" 
            value={stats.recentlyUpdated} 
            color="bg-yellow-500"
        />
        <StatCard 
            icon={<TrendingUpIcon className="h-8 w-8 text-white"/>} 
            title="Active Members (30d)" 
            value={stats.activeLast30d} 
            color="bg-purple-500"
        />
      </div>
    </div>
  );
};

export default Dashboard;
