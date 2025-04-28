import React from 'react';
import MainLayout from '../components/common/MainLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { FaTint, FaCalendarAlt, FaGift, FaMapMarkerAlt, FaHeartbeat, FaUserEdit, FaSpinner } from 'react-icons/fa';

// Placeholder Data
const dashboardData = {
    nextAppointment: "Oct 25, 2023 - 10:00 AM",
    lastDonation: "Jul 15, 2023",
    totalDonations: 12,
    rewardPoints: 450,
    recentAlert: {
        type: 'Urgent',
        bloodType: 'O-',
        location: 'City General Hospital',
        time: '2h ago'
    },
    eligibilityStatus: 'Eligible', // Eligible, Deferred, Ineligible
};

const getEligibilityColor = (status) => {
    switch (status) {
        case 'Eligible': return 'text-accent-green';
        case 'Deferred': return 'text-accent-yellow';
        case 'Ineligible': return 'text-accent-red';
        default: return 'text-text-secondary';
    }
}

const StatCard = ({ icon, label, value, color = "text-primary" }) => (
    <Card padding="p-4" className="flex items-center space-x-4">
        <div className={`p-3 rounded-lg bg-gradient-to-br from-secondary to-secondary/60 ${color}`}>
            {React.cloneElement(icon, { size: 20, className: 'text-white' })}
        </div>
        <div>
            <p className="text-sm text-text-secondary">{label}</p>
            <p className="text-lg font-semibold text-text-main">{value}</p>
        </div>
    </Card>
);


const DonorDashboardPage = () => {
    // Replace with loading state from data fetching
    const isLoading = false;

    if (isLoading) {
        return (
            <MainLayout>
                <div className="flex justify-center items-center h-64">
                    <FaSpinner className="animate-spin text-primary text-4xl" />
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h1 className="text-3xl font-bold text-text-main">Donor Dashboard</h1>
                    <div className={`text-sm font-semibold px-3 py-1 rounded-full ${getEligibilityColor(dashboardData.eligibilityStatus)} bg-opacity-10 ${dashboardData.eligibilityStatus === 'Eligible' ? 'bg-green-500/10' : dashboardData.eligibilityStatus === 'Deferred' ? 'bg-yellow-500/10' : 'bg-red-500/10'}`}>
                        Status: {dashboardData.eligibilityStatus}
                    </div>
                </div>

                {/* Stat Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <StatCard icon={<FaCalendarAlt />} label="Next Appointment" value={dashboardData.nextAppointment || 'None Scheduled'} color="text-accent-blue" />
                    <StatCard icon={<FaTint />} label="Last Donation" value={dashboardData.lastDonation} color="text-accent-red" />
                    <StatCard icon={<FaHeartbeat />} label="Total Donations" value={dashboardData.totalDonations} color="text-accent-green" />
                    <StatCard icon={<FaGift />} label="Reward Points" value={dashboardData.rewardPoints} color="text-accent-yellow" />
                </div>

                {/* Quick Actions & Recent Alert */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Quick Actions */}
                    <Card className="lg:col-span-1 space-y-4">
                        <h2 className="text-lg font-semibold text-text-main border-b border-secondary/30 pb-2">Quick Actions</h2>
                        <Button variant="primary" className="w-full" iconLeft={<FaMapMarkerAlt />}>Find Donation Center</Button>
                        <Button variant="outline" className="w-full" iconLeft={<FaCalendarAlt />}>Schedule Appointment</Button>
                        <Button variant="outline" className="w-full" iconLeft={<FaUserEdit />}>Update Profile</Button>
                        <Button variant="ghost" className="w-full text-sm text-primary hover:text-primary-dark" >View Donation History</Button>
                    </Card>

                    {/* Recent Alert / Map Placeholder */}
                    <Card className="lg:col-span-2">
                        <h2 className="text-lg font-semibold text-text-main mb-3">Nearby Activity & Requests</h2>
                        {dashboardData.recentAlert ? (
                            <div className="bg-secondary/30 p-4 rounded-lg border border-secondary/50 mb-4">
                                <div className="flex justify-between items-center mb-1">
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${dashboardData.recentAlert.type === 'Urgent' ? 'bg-red-500/80 text-white' : 'bg-blue-500/80 text-white'}`}>
                                        {dashboardData.recentAlert.type} Need: {dashboardData.recentAlert.bloodType}
                                    </span>
                                    <span className="text-xs text-text-muted">{dashboardData.recentAlert.time}</span>
                                </div>
                                <p className="text-sm text-text-secondary">
                                    <FaMapMarkerAlt className="inline mr-1 mb-0.5 text-primary" /> {dashboardData.recentAlert.location}
                                </p>
                                <Button size="sm" variant="outline" className="mt-2">View Details</Button>
                            </div>
                        ) : (
                            <p className="text-sm text-text-secondary mb-4">No urgent requests nearby right now.</p>
                        )}
                        {/* Map Placeholder */}
                        <div className="h-48 bg-secondary rounded-lg flex items-center justify-center text-text-muted border border-secondary/40">
                            <FaMapMarkerAlt className="mr-2" /> Map Placeholder - Nearby Centers
                        </div>
                    </Card>
                </div>

                {/* Other potential sections: Rewards progress, Health Tips */}

            </div>
        </MainLayout>
    );
};

export default DonorDashboardPage;