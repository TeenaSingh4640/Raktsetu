import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // --- SIMULATION ---
    // In a real app, check localStorage/sessionStorage or make an API call
    // to determine initial login state and user info.
    const [user, setUser] = useState(null); // null = logged out, { role: 'donor', ... } = logged in
    const [isLoading, setIsLoading] = useState(false); // To simulate login process

    // Simulated login function
    const login = async (email, password) => {
        setIsLoading(true);
        console.log("Attempting login for:", email);
        // Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // --- SIMULATED USER ROLES ---
        let loggedInUser = null;
        if (email === 'donor@test.com' && password === 'password') {
            loggedInUser = { id: 'user123', email: email, role: 'donor', name: 'John Doe' };
        } else if (email === 'hospital@test.com' && password === 'password') {
            loggedInUser = { id: 'hosp456', email: email, role: 'hospital', name: 'City Hospital Admin' };
        } else if (email === 'auth@test.com' && password === 'password') {
            loggedInUser = { id: 'auth789', email: email, role: 'authority', name: 'Health Authority Rep' };
        }
        // --- End Simulation ---

        if (loggedInUser) {
            setUser(loggedInUser);
            console.log("Login successful:", loggedInUser);
            setIsLoading(false);
            
            return true; // Indicate success
        } else {
            console.log("Login failed");
            setIsLoading(false);
            return false; // Indicate failure
        }
    };

    // Guest login function - bypass authentication
    const guestLogin = async (role = 'donor') => {
        setIsLoading(true);
        console.log("Logging in as guest with role:", role);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Create a guest user with the specified role
        const guestUser = { 
            id: `guest-${Date.now()}`, 
            email: 'guest@example.com', 
            role: role, 
            name: `Guest ${role.charAt(0).toUpperCase() + role.slice(1)}`,
            isGuest: true // Flag to identify guest users
        };
        
        setUser(guestUser);
        console.log("Guest login successful:", guestUser);
        setIsLoading(false);
        return true;
    };

    // Simulated signup function (doesn't log in automatically here)
    const signup = async (userData) => {
        setIsLoading(true);
        console.log("Attempting signup for:", userData.email);
        // Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        // Assume signup is successful for simulation
        console.log("Signup successful (simulated)");
        setIsLoading(false);
        return true; // Indicate success
    }

    // Simulated logout function
    const logout = () => {
        console.log("Logging out");
        setUser(null);
        // Clear tokens, etc. in a real app
    };

    const value = {
        user,
        isAuthenticated: !!user, // True if user object exists
        role: user?.role || null,
        isLoading,
        login,
        logout,
        signup,
        guestLogin,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};