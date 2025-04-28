import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTint, FaBell, FaChartBar, FaUserCircle } from 'react-icons/fa'; // Example icons

const Layout = ({ children }) => {
    const location = useLocation();

    // Basic sidebar navigation items
    const navItems = [
        { path: '/alerts', label: 'Alerts', icon: FaBell },
        { path: '/dashboard', label: 'Dashboard', icon: FaChartBar },
        // Add more links as needed
    ];

    return (
        <div className="flex min-h-screen bg-background">
            {/* Sidebar */}
            <aside className="w-16 md:w-20 bg-card-bg flex flex-col items-center py-6 space-y-6">
                <Link to="/" className="text-primary mb-6">
                    <FaTint size={28} title="Home/Login" />
                </Link>
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        title={item.label}
                        className={`p-2 rounded-lg ${location.pathname.startsWith(item.path)
                                ? 'bg-primary text-white'
                                : 'text-text-secondary hover:bg-secondary hover:text-white'
                            } transition-colors duration-150`}
                    >
                        <item.icon size={24} />
                    </Link>
                ))}
                <Link
                    to="/"
                    title="Profile/Login"
                    className={`mt-auto p-2 rounded-lg ${location.pathname === '/'
                            ? 'bg-primary text-white'
                            : 'text-text-secondary hover:bg-secondary hover:text-white'
                        } transition-colors duration-150`}
                >
                    <FaUserCircle size={24} />
                </Link>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
};

export default Layout;