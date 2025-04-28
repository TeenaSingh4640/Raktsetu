import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../components/ui/Input'; // Adjust path
import Button from '../components/ui/Button'; // Adjust path
import Card from '../components/ui/Card';   // Adjust path
import { useAuth } from '../contexts/Authcontext'; // Adjust path
import { FaTint, FaUser, FaEnvelope, FaLock, FaCalendar, FaPhone, FaVenusMars, FaIdBadge } from 'react-icons/fa'; // Added FaVenusMars, FaIdBadge

const SignupPage = () => {
    const navigate = useNavigate();
    const { signup, isLoading } = useAuth(); // Use signup from context
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

                <p className="mt-6 text-center text-sm text-text-secondary">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-primary hover:underline">
                        Login here
                    </Link>
                </p>
            </Card>
        </div>
    );
};

export default SignupPage;