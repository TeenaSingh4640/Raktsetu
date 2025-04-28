import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FaTint, FaBell, FaChartBar, FaUserCircle, FaSignOutAlt, FaBars, FaTimes, FaTachometerAlt, FaHandHoldingHeart, FaCog, FaShieldAlt, FaUsers, FaCalendarCheck } from 'react-icons/fa';

const commonNavItems = [
    { path: '/alerts', label: 'Alerts & Requests', icon: FaBell },
    { path: '/profile', label: 'My Profile', icon: FaUserCircle },
    { path: '/settings', label: 'Settings', icon: FaCog },
];

// Define role-specific navigation
const roleNavItems = {
    donor: [
        { path: '/donor-dashboard', label: 'Dashboard', icon: FaTachometerAlt },
        { path: '/my-donations', label: 'Donation History', icon: FaHandHoldingHeart },
        { path: '/rewards', label: 'Rewards', icon: FaGift }, // Assuming FaGift is imported or use another
        { path: '/schedule', label: 'Appointments', icon: FaCalendarCheck },
        ...commonNavItems,
    ],
    hospital: [
        { path: '/hospital-dashboard', label: 'Inventory Dashboard', icon: FaChartBar },
        { path: '/manage-requests', label: 'Manage Requests', icon: FaBell }, // Reuse or choose specific icon
        { path: '/donor-management', label: 'Donor Management', icon: FaUsers },
        { path: '/schedule-drives', label: 'Schedule Drives', icon: FaCalendarCheck },
        ...commonNavItems,
    ],
    authority: [
        { path: '/authority-dashboard', label: 'Analytics Dashboard', icon: FaChartBar },
        { path: '/blockchain-ledger', label: 'Transaction Ledger', icon: FaShieldAlt }, // Conceptual
        { path: '/oversight', label: 'System Oversight', icon: FaEye }, // Assuming FaEye imported
        ...commonNavItems,
    ],
};


// Mock function to get user role - replace with actual auth context
const getUserRole = () => 'donor'; // Change this to 'hospital' or 'authority' to test

const MainLayout = ({ children }) => {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const userRole = getUserRole(); // Get the current user's role
    const navItems = roleNavItems[userRole] || commonNavItems; // Get nav items based on role

    const activeClass = "bg-primary/20 text-primary border-l-4 border-primary";
    const inactiveClass = "text-text-secondary hover:bg-secondary/40 hover:text-text-main";
    const linkClass = `flex items-center px-4 py-3 text-sm font-medium transition-colors duration-150`;

    const sidebarContent = (
        <>
            {/* Logo/Brand */}
            <div className="px-4 py-6 flex items-center justify-center border-b border-secondary/30">
                <Link to="/" className="flex items-center text-primary gap-2">
                    <FaTint size={28} />
                    <span className="text-xl font-bold text-text-main">BloodLink</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="mt-6 flex-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end // Use 'end' prop for exact matching on dashboards etc.
                        className={({ isActive }) => `${linkClass} ${isActive ? activeClass : inactiveClass}`}
                        onClick={() => setIsSidebarOpen(false)} // Close sidebar on mobile nav click
                    >
                        <item.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            {/* Footer/Logout */}
            <div className="px-4 py-4 border-t border-secondary/30 mt-auto">
                <button
                    onClick={() => alert('Logout logic here')} // Replace with actual logout
                    className={`${linkClass} ${inactiveClass} w-full`}
                >
                    <FaSignOutAlt className="mr-3 h-5 w-5" aria-hidden="true" />
                    Logout
                </button>
            </div>
        </>
    );

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Static Sidebar for Desktop */}
            <aside className="hidden md:flex md:flex-col md:w-64 bg-background-light border-r border-secondary/30">
                {sidebarContent}
            </aside>

            {/* Mobile Sidebar & Overlay */}
            {isSidebarOpen && (
                <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
            )}
            <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-background-light border-r border-secondary/30 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:hidden flex flex-col`}>
                {sidebarContent}
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-y-auto">
                {/* Mobile Header */}
                <header className="md:hidden sticky top-0 z-20 bg-background-light/80 backdrop-blur-md border-b border-secondary/30 px-4 py-3 flex items-center justify-between">
                    <Link to="/" className="flex items-center text-primary gap-2">
                        <FaTint size={24} />
                        <span className="text-lg font-bold text-text-main">BloodLink</span>
                    </Link>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="text-text-secondary hover:text-text-main p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                    >
                        {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                    </button>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {/* Add a subtle animation to content */}
                    <div className="animate-fadeIn">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};
// Make sure to import any missing icons like FaGift, FaEye
import { FaGift, FaEye } from 'react-icons/fa';

export default MainLayout;