import React from 'react';
import Card from '../components/ui/Card';
import Layout from '../components/Layout'; // Import Layout
import { FaTint, FaUsers, FaChartLine, FaCalendarAlt } from 'react-icons/fa';

// Sample data (replace with actual data fetching)
const inventoryData = [
    { type: 'O+', units: 50, status: 'Stable' },
    { type: 'O-', units: 15, status: 'Low' },
    { type: 'A+', units: 75, status: 'Good' },
    { type: 'A-', units: 20, status: 'Low' },
    { type: 'B+', units: 40, status: 'Stable' },
    { type: 'B-', units: 10, status: 'Critical' },
    { type: 'AB+', units: 30, status: 'Stable' },
    { type: 'AB-', units: 5, status: 'Critical' },
];

const eligibilityChecks = [
    { name: 'John Smith', eligible: true },
    { name: 'Emma Watson', eligible: true },
    { name: 'Michael Brown', eligible: false },
    { name: 'Sarah Davis', eligible: true },
];

const totalTokens = 150;
const redeemedTokens = 75;

// Function to determine status color
const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
        case 'good': return 'text-green-400';
        case 'stable': return 'text-yellow-400';
        case 'low': return 'text-orange-400';
        case 'critical': return 'text-red-500';
        default: return 'text-text-secondary';
    }
};

// Basic Bar component for visualization
const SimpleBar = ({ value, maxValue, colorClass }) => {
    const percentage = Math.max(0, Math.min(100, (value / maxValue) * 100));
    return (
        <div className="w-full bg-secondary rounded h-4 overflow-hidden">
            <div
                className={`${colorClass} h-full rounded transition-all duration-300 ease-out`}
                style={{ width: `${percentage}%` }}
                title={`${value} units`}
            ></div>
        </div>
    );
};

const DashboardPage = () => {
    const maxUnits = Math.max(...inventoryData.map(item => item.units), 100); // Find max units for bar scaling

    return (
        <Layout> {/* Wrap content in Layout */}
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-text-main">Blood Bank Dashboard</h1>

                {/* Grid for dashboard cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {/* Live Inventory Card */}
                    <Card className="md:col-span-2 lg:col-span-2">
                        <h2 className="text-xl font-semibold text-text-main mb-4 flex items-center">
                            <FaTint className="mr-2 text-primary" /> Live Inventory
                        </h2>
                        <div className="space-y-3">
                            {inventoryData.map(item => (
                                <div key={item.type} className="grid grid-cols-4 items-center gap-2">
                                    <span className="font-medium text-text-main col-span-1">{item.type}</span>
                                    <div className="col-span-2">
                                        <SimpleBar value={item.units} maxValue={maxUnits} colorClass={item.units < 20 ? 'bg-red-500' : item.units < 40 ? 'bg-yellow-500' : 'bg-accent-green'} />
                                    </div>
                                    <span className={`text-sm font-semibold ${getStatusColor(item.status)} col-span-1 text-right`}>
                                        {item.units} ({item.status})
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Eligibility Checks Card */}
                    <Card>
                        <h2 className="text-xl font-semibold text-text-main mb-4 flex items-center">
                            <FaUsers className="mr-2 text-primary" /> Eligibility Checks
                        </h2>
                        <ul className="space-y-2">
                            {eligibilityChecks.map((donor, index) => (
                                <li key={index} className="flex justify-between items-center text-sm">
                                    <span className="text-text-secondary">{donor.name}</span>
                                    <span className={`font-medium ${donor.eligible ? 'text-green-400' : 'text-red-500'}`}>
                                        {donor.eligible ? 'Eligible' : 'Not Eligible'}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <Button variant="outline" className="w-full mt-4 text-sm">View All Checks</Button>
                    </Card>

                    {/* Token Incentive System Card */}
                    <Card>
                        <h2 className="text-xl font-semibold text-text-main mb-4 flex items-center">
                            <FaChartLine className="mr-2 text-primary" /> Token Incentive System
                        </h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-text-secondary">Total Tokens Issued:</span>
                                <span className="font-semibold text-text-main">{totalTokens}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-text-secondary">Tokens Redeemed:</span>
                                <span className="font-semibold text-text-main">{redeemedTokens}</span>
                            </div>
                        </div>
                        <div className="w-full bg-secondary rounded h-2 mt-3">
                            <div
                                className="bg-primary h-2 rounded"
                                style={{ width: `${(redeemedTokens / totalTokens) * 100}%` }}
                            ></div>
                        </div>
                        <Button variant="outline" className="w-full mt-4 text-sm">Manage Tokens</Button>
                    </Card>

                    {/* Placeholder Cards for other data */}
                    <Card className="md:col-span-1 lg:col-span-1">
                        <h2 className="text-xl font-semibold text-text-main mb-4">Supply Trends</h2>
                        <div className="h-40 bg-secondary rounded flex items-center justify-center text-text-secondary">
                            Chart Placeholder
                        </div>
                    </Card>

                    <Card className="md:col-span-1 lg:col-span-1">
                        <h2 className="text-xl font-semibold text-text-main mb-4">Demand Prediction</h2>
                        <div className="h-40 bg-secondary rounded flex items-center justify-center text-text-secondary">
                            Chart Placeholder
                        </div>
                    </Card>

                    <Card className="md:col-span-2 lg:col-span-2">
                        <h2 className="text-xl font-semibold text-text-main mb-4 flex items-center">
                            <FaCalendarAlt className="mr-2 text-primary" /> Community Engagement
                        </h2>
                        <div className="h-40 bg-secondary rounded flex items-center justify-center text-text-secondary">
                            Calendar/Events Placeholder
                        </div>
                        <Button variant="outline" className="w-full mt-4 text-sm">View Calendar</Button>
                    </Card>

                </div>
            </div>
        </Layout>
    );
};

export default DashboardPage;