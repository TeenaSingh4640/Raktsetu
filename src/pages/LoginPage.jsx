import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../components/ui/Input'; // Correct path
import Button from '../components/ui/Button'; // Correct path
import Card from '../components/ui/Card';   // Correct path
import { FaTint, FaEnvelope, FaLock } from 'react-icons/fa';

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // --- Simulated Login ---
        // Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        if (email === 'donor@test.com' && password === 'password') {
            console.log('Login Successful');
            // TODO: Set auth state (Context, Redux, Zustand)
            navigate('/donor-dashboard'); // Redirect to appropriate dashboard
        } else {
            setError('Invalid email or password.');
        }
        // --- End Simulation ---

        setIsLoading(false);
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
                        error={error && error.includes('email') ? error : null} // Example specific error
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
                        error={error && error.includes('password') ? error : null} // Example specific error
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

                <p className="mt-8 text-center text-sm text-text-secondary">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-semibold text-primary hover:underline">
                        Sign up now
                    </Link>
                </p>
            </Card>
        </div>
    );
};

export default LoginPage;