import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { FaTint, FaEnvelope, FaLock, FaUser, FaHospital, FaShieldAlt, FaTimes } from 'react-icons/fa';
import { useAuth } from '../contexts/Authcontext';

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showGuestModal, setShowGuestModal] = useState(false);
    const { login, guestLogin, isLoading, isAuthenticated, user } = useAuth();

    // If user is already logged in, redirect to their dashboard
    if (isAuthenticated && user) {
        const dashboardPath = 
            user.role === 'donor' ? '/donor-dashboard' : 
            user.role === 'hospital' ? '/hospital-dashboard' : 
            user.role === 'authority' ? '/authority-dashboard' : '/';
        return <Navigate to={dashboardPath} replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const success = await login(email, password);
            
            if (!success) {
                setError('Invalid email or password.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('An error occurred. Please try again.');
        }
    };

    const handleGuestLogin = async (role) => {
        try {
            await guestLogin(role);
            // After successful login, the component will re-render and redirect via the if statement above
        } catch (err) {
            console.error('Guest login error:', err);
            setError('Failed to log in as guest.');
        } finally {
            setShowGuestModal(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background-dark to-background p-4">
            <Card className="w-full max-w-md animate-slideInUp">
                <div className="text-center mb-8">
                    <FaTint className="mx-auto text-primary text-5xl mb-3" />
                    <h1 className="text-3xl font-bold text-text-main">Welcome Back</h1>
                    <p className="text-text-secondary mt-1">Login to access your BloodLink account.</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-md mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input
                        id="email"
                        label="Email Address"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        icon={<FaEnvelope />}
                        error={error && error.includes('email') ? error : null}
                    />
                    <Input
                        id="password"
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        icon={<FaLock />}
                        error={error && error.includes('password') ? error : null}
                    />

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center text-text-secondary">
                            <input type="checkbox" className="form-checkbox h-4 w-4 text-primary bg-secondary border-secondary/60 rounded focus:ring-primary focus:ring-offset-background" />
                            <span className="ml-2">Remember me</span>
                        </label>
                        <Link to="/forgot-password" className="font-medium text-primary hover:underline">
                            Forgot password?
                        </Link>
                    </div>

                    <Button type="submit" variant="primary" className="w-full" isLoading={isLoading} disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </Button>
                </form>

                <div className="mt-6 relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-secondary/30"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-text-secondary">Or</span>
                    </div>
                </div>

                <Button
                    variant="ghost"
                    className="w-full mt-6 border border-secondary/30"
                    onClick={() => setShowGuestModal(true)}
                >
                    Continue as Guest
                </Button>

                <p className="mt-4 text-center text-sm text-text-secondary">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-semibold text-primary hover:underline">
                        Sign up now
                    </Link>
                </p>
            </Card>

            {/* Guest Login Modal */}
            {showGuestModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
                        {/* Backdrop */}
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setShowGuestModal(false)}></div>
                        
                        {/* Modal Panel */}
                        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-medium transition-all sm:w-full sm:max-w-lg">
                            <div className="px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                <div className="flex justify-between items-center pb-3 border-b border-secondary/20">
                                    <h3 className="text-lg font-semibold leading-6 text-text-main">
                                        Select Guest Role
                                    </h3>
                                    <button 
                                        onClick={() => setShowGuestModal(false)}
                                        className="text-text-secondary hover:text-text-main rounded-full p-1 hover:bg-secondary/10 transition-colors"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                                <div className="mt-4">
                                    <p className="text-sm text-text-secondary mb-4">
                                        Experience the platform with different user roles without registering:
                                    </p>
                                    
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                        <button
                                            onClick={() => handleGuestLogin('donor')}
                                            className="flex flex-col items-center p-4 border border-secondary/20 rounded-lg hover:bg-secondary/10 transition-colors"
                                            disabled={isLoading}
                                        >
                                            <FaUser className="text-primary text-2xl mb-2" />
                                            <span className="font-medium text-text-main">Donor</span>
                                            <span className="text-xs text-text-secondary mt-1">Donate blood & schedule appointments</span>
                                        </button>
                                        
                                        <button
                                            onClick={() => handleGuestLogin('hospital')}
                                            className="flex flex-col items-center p-4 border border-secondary/20 rounded-lg hover:bg-secondary/10 transition-colors"
                                            disabled={isLoading}
                                        >
                                            <FaHospital className="text-primary text-2xl mb-2" />
                                            <span className="font-medium text-text-main">Hospital</span>
                                            <span className="text-xs text-text-secondary mt-1">Manage blood inventory & requests</span>
                                        </button>
                                        
                                        <button
                                            onClick={() => handleGuestLogin('authority')}
                                            className="flex flex-col items-center p-4 border border-secondary/20 rounded-lg hover:bg-secondary/10 transition-colors"
                                            disabled={isLoading}
                                        >
                                            <FaShieldAlt className="text-primary text-2xl mb-2" />
                                            <span className="font-medium text-text-main">Authority</span>
                                            <span className="text-xs text-text-secondary mt-1">Oversee data & manage system</span>
                                        </button>
                                    </div>
                                    
                                    {isLoading && (
                                        <div className="flex justify-center mt-4">
                                            <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginPage;