import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from './ui/Input';
import Button from './ui/Button';
import Card from './ui/Card';

const AuthForm = ({ isSignUp = false }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        bloodGroup: '', // Example extra field for signup
        dob: '',       // Date of Birth
        gender: '',
        phone: '',
        registerAs: 'Donor', // Donor, Hospital, Authority etc.
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        if (isSignUp) {
            // Sign Up Logic
            if (formData.password !== formData.confirmPassword) {
                setError('Passwords do not match.');
                return;
            }
            // Add more validation as needed
            console.log('Signing up with:', formData);
            // TODO: Replace with actual API call
            alert('Sign up successful! (Simulated)');
            navigate('/alerts'); // Redirect after successful signup

        } else {
            // Login Logic
            console.log('Logging in with:', formData.email, formData.password);
            // TODO: Replace with actual API call & state management for login status
            if (formData.email === 'donor@test.com' && formData.password === 'password') {
                alert('Login successful! (Simulated)');
                navigate('/alerts'); // Redirect after successful login
            } else {
                setError('Invalid email or password.');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md" padding="p-8">
                <h2 className="text-2xl font-bold text-center text-text-main mb-6">
                    {isSignUp ? 'Create Account' : 'Welcome Back'}
                </h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {isSignUp && (
                        <Input
                            id="fullName"
                            label="Full Name"
                            placeholder="Enter your full name"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    )}
                    <Input
                        id="email"
                        label="Email Address"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        id="password"
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    {isSignUp && (
                        <>
                            <Input
                                id="confirmPassword"
                                label="Confirm Password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                id="dob"
                                label="Date of Birth"
                                type="date"
                                value={formData.dob}
                                onChange={handleChange}
                                required
                            />
                            <div className="w-full">
                                <label className="block text-sm font-medium text-text-secondary mb-1">Gender</label>
                                <div className="flex items-center space-x-4">
                                    <label className="flex items-center">
                                        <input type="radio" name="gender" value="Male" onChange={handleChange} className="form-radio text-primary focus:ring-primary" />
                                        <span className="ml-2 text-text-secondary">Male</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="radio" name="gender" value="Female" onChange={handleChange} className="form-radio text-primary focus:ring-primary" />
                                        <span className="ml-2 text-text-secondary">Female</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="radio" name="gender" value="Other" onChange={handleChange} className="form-radio text-primary focus:ring-primary" />
                                        <span className="ml-2 text-text-secondary">Other</span>
                                    </label>
                                </div>
                            </div>
                            <Input
                                id="phone"
                                label="Phone Number"
                                type="tel"
                                placeholder="Enter your phone number"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                            {/* Example Dropdown/Select */}
                            <div>
                                <label htmlFor="bloodGroup" className="block text-sm font-medium text-text-secondary mb-1">
                                    Blood Group (Optional)
                                </label>
                                <select
                                    id="bloodGroup"
                                    name="bloodGroup"
                                    value={formData.bloodGroup}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-secondary border border-gray-600 rounded-md text-text-main focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                >
                                    <option value="">Select...</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                </select>
                            </div>
                            {/* Register As - Radio buttons like screenshot */}
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Register as</label>
                                <div className="flex items-center space-x-4">
                                    <label className="flex items-center">
                                        <input type="radio" name="registerAs" value="Donor" checked={formData.registerAs === 'Donor'} onChange={handleChange} className="form-radio text-primary focus:ring-primary" />
                                        <span className="ml-2 text-text-secondary">Donor</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="radio" name="registerAs" value="Hospital" checked={formData.registerAs === 'Hospital'} onChange={handleChange} className="form-radio text-primary focus:ring-primary" />
                                        <span className="ml-2 text-text-secondary">Hospital</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="radio" name="registerAs" value="Authority" checked={formData.registerAs === 'Authority'} onChange={handleChange} className="form-radio text-primary focus:ring-primary" />
                                        <span className="ml-2 text-text-secondary">Authority</span>
                                    </label>
                                </div>
                            </div>
                        </>
                    )}
                    <Button type="submit" variant="primary" className="w-full">
                        {isSignUp ? 'Sign Up' : 'Login'}
                    </Button>
                </form>
                <p className="mt-6 text-center text-sm text-text-secondary">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button
                        onClick={() => navigate(isSignUp ? '/login' : '/signup')}
                        className="font-medium text-primary hover:underline"
                    >
                        {isSignUp ? 'Login here' : 'Sign up now'}
                    </button>
                </p>
            </Card>
        </div>
    );
};

export default AuthForm;