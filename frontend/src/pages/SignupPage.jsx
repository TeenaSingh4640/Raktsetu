import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useAuth } from '../contexts/Authcontext';
import { FaTint, FaUser, FaEnvelope, FaLock, FaCalendar, FaPhone, FaVenusMars, FaIdBadge, FaTimes, FaHospital, FaShieldAlt } from 'react-icons/fa';

const SignupPage = () => {
    const navigate = useNavigate();
    const { signup, guestLogin, isLoading, isAuthenticated, user } = useAuth();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        dob: '',
        gender: '',
        phone: '',
        role: 'donor', // Default role
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showGuestModal, setShowGuestModal] = useState(false);

    // If user is already logged in, redirect to their dashboard
    if (isAuthenticated && user) {
        const dashboardPath = 
            user.role === 'donor' ? '/donor-dashboard' : 
            user.role === 'hospital' ? '/hospital-dashboard' : 
            user.role === 'authority' ? '/authority-dashboard' : '/';
        return <Navigate to={dashboardPath} replace />;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Basic Validation
        if (!formData.fullName || !formData.email || !formData.password || !formData.dob || !formData.gender || !formData.role) {
            setError('Please fill in all required fields.');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        // Add more robust validation as needed (email format, phone format, etc.)

        // Call the signup function from context
        const signupSuccessful = await signup(formData);

        if (signupSuccessful) {
            setSuccess('Signup successful! Redirecting to login...');
            // Clear form? Optional
            // setFormData({ fullName: '', email: '', password: '', confirmPassword: '', dob: '', gender: '', phone: '', role: 'donor' });
            setTimeout(() => {
                navigate('/login');
            }, 2000); // Wait 2 seconds before redirecting
        } else {
            // In a real app, the signup function might return specific errors
            setError('Signup failed. Please try again later.');
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
            <Card className="w-full max-w-lg animate-slideInUp"> {/* Increased max-w */}
                <div className="text-center mb-8">
                    <FaTint className="mx-auto text-primary text-5xl mb-3" />
                    <h1 className="text-3xl font-bold text-text-main">Create Account</h1>
                    <p className="text-text-secondary mt-1">Join the BloodLink community.</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-md mb-4 text-sm text-center">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-2 rounded-md mb-4 text-sm text-center">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Use grid for better layout on wider screens */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            id="fullName"
                            name="fullName"
                            label="Full Name"
                            placeholder="John Doe"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            icon={<FaUser />}
                        />
                        <Input
                            id="email"
                            name="email"
                            label="Email Address"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            icon={<FaEnvelope />}
                        />
                        <Input
                            id="password"
                            name="password"
                            label="Password"
                            type="password"
                            placeholder="•••••••• (min. 6 chars)"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            icon={<FaLock />}
                        />
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            icon={<FaLock />}
                        />
                        <Input
                            id="dob"
                            name="dob"
                            label="Date of Birth"
                            type="date"
                            value={formData.dob}
                            onChange={handleChange}
                            required
                            icon={<FaCalendar />}
                        />
                        <Input
                            id="phone"
                            name="phone"
                            label="Phone Number (Optional)"
                            type="tel"
                            placeholder="+1 234 567 890"
                            value={formData.phone}
                            onChange={handleChange}
                            icon={<FaPhone />}
                        />
                    </div>

                    {/* Gender Radio Buttons */}
                    <div className="w-full">
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">Gender <span className="text-red-500">*</span></label>
                        <div className="flex items-center space-x-4 bg-secondary/30 p-2 rounded-lg border border-secondary/60">
                            <FaVenusMars className="h-5 w-5 text-text-muted ml-1" />
                            <label className="flex items-center cursor-pointer">
                                <input type="radio" name="gender" value="Male" checked={formData.gender === 'Male'} onChange={handleChange} className="form-radio h-4 w-4 text-primary bg-background border-secondary/60 focus:ring-primary focus:ring-offset-background" required />
                                <span className="ml-2 text-text-secondary">Male</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input type="radio" name="gender" value="Female" checked={formData.gender === 'Female'} onChange={handleChange} className="form-radio h-4 w-4 text-primary bg-background border-secondary/60 focus:ring-primary focus:ring-offset-background" required />
                                <span className="ml-2 text-text-secondary">Female</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input type="radio" name="gender" value="Other" checked={formData.gender === 'Other'} onChange={handleChange} className="form-radio h-4 w-4 text-primary bg-background border-secondary/60 focus:ring-primary focus:ring-offset-background" required />
                                <span className="ml-2 text-text-secondary">Other</span>
                            </label>
                        </div>
                    </div>

                    {/* Role Selection Radio Buttons */}
                    <div className="w-full">
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">Register as <span className="text-red-500">*</span></label>
                        <div className="flex items-center space-x-4 bg-secondary/30 p-2 rounded-lg border border-secondary/60">
                            <FaIdBadge className="h-5 w-5 text-text-muted ml-1" />
                            <label className="flex items-center cursor-pointer">
                                <input type="radio" name="role" value="donor" checked={formData.role === 'donor'} onChange={handleChange} className="form-radio h-4 w-4 text-primary bg-background border-secondary/60 focus:ring-primary focus:ring-offset-background" />
                                <span className="ml-2 text-text-secondary">Donor</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input type="radio" name="role" value="hospital" checked={formData.role === 'hospital'} onChange={handleChange} className="form-radio h-4 w-4 text-primary bg-background border-secondary/60 focus:ring-primary focus:ring-offset-background" />
                                <span className="ml-2 text-text-secondary">Hospital</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input type="radio" name="role" value="authority" checked={formData.role === 'authority'} onChange={handleChange} className="form-radio h-4 w-4 text-primary bg-background border-secondary/60 focus:ring-primary focus:ring-offset-background" />
                                <span className="ml-2 text-text-secondary">Authority</span>
                            </label>
                        </div>
                    </div>

                    <Button type="submit" variant="primary" className="w-full mt-5" isLoading={isLoading} disabled={isLoading || !!success}>
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
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
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-primary hover:underline">
                        Login here
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

export default SignupPage;