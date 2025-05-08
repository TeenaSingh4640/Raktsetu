import React, { useState, useEffect } from 'react';
import MainLayout from '../components/common/MainLayout'; // Adjust path
import Card from '../components/ui/Card'; // Adjust path
import Button from '../components/ui/Button'; // Adjust path
import { useAuth } from '../contexts/Authcontext'; // Adjust path
import { FaUser, FaEnvelope, FaIdBadge, FaTint, FaCalendarAlt, FaPhone, FaEdit, FaSpinner, FaMapMarkerAlt, FaGift } from 'react-icons/fa';

// Helper component for displaying profile info items
const ProfileInfoItem = ({ icon, label, value }) => (
    <div className="flex items-start py-3 border-b border-secondary/20 last:border-b-0">
        <div className="flex-shrink-0 w-8 pt-1 text-primary">
            {React.cloneElement(icon, { size: 18 })}
        </div>
        <div className="ml-3">
            <p className="text-xs font-medium text-text-secondary uppercase tracking-wider">{label}</p>
            <p className="text-sm text-text-main mt-0.5">{value || 'Not Provided'}</p>
        </div>
    </div>
);


const ProfilePage = () => {
    const { user, isLoading: authLoading } = useAuth(); // Get user info from context
    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // --- Simulate fetching detailed profile data ---
    useEffect(() => {
        const fetchProfileData = async () => {
            if (!user) {
                setIsLoading(false); // No user logged in
                return;
            }
            setIsLoading(true);
            console.log("Fetching profile data for user:", user.id);
            // Replace with actual API call: GET /api/profile/{user.id}
            await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay

            // --- Simulated Data (Combine context user with more details) ---
            const fetchedData = {
                ...user, // Include basic info from context
                // Add more details fetched from backend
                fullName: user.name || 'John Doe', // Use context name or default
                dob: '1995-08-15',
                gender: 'Male',
                phone: '+1 555 123 4567',
                address: '123 Main St, Anytown, USA 12345',
                bloodGroup: 'O+',
                lastDonation: '2023-07-15',
                totalDonations: 12,
                rewardPoints: 450,
                // Add role-specific data if needed
                hospitalName: user.role === 'hospital' ? 'City General Hospital' : null,
                authorityDept: user.role === 'authority' ? 'Regional Health Board' : null,
            };
            // --- End Simulation ---

            setProfileData(fetchedData);
            setIsLoading(false);
        };

        if (!authLoading) { // Only fetch if auth state is resolved
            fetchProfileData();
        }
    }, [user, authLoading]); // Re-fetch if user or auth loading state changes


    if (isLoading || authLoading) {
        return (
            <MainLayout>
                <div className="flex justify-center items-center h-64">
                    <FaSpinner className="animate-spin text-primary text-4xl" />
                </div>
            </MainLayout>
        );
    }

    if (!profileData) {
        return (
            <MainLayout>
                <Card>
                    <p className="text-center text-text-secondary">Could not load profile data. Please try logging in again.</p>
                </Card>
            </MainLayout>
        )
    }

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h1 className="text-3xl font-bold text-text-main">My Profile</h1>
                    <Button variant="outline" iconLeft={<FaEdit />} onClick={() => alert('Navigate to Edit Profile page (to be implemented)')}>
                        Edit Profile
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Personal Details Card */}
                    <Card className="lg:col-span-2">
                        <h2 className="text-xl font-semibold text-text-main mb-4 border-b border-secondary/30 pb-2">Personal Information</h2>
                        <div className="space-y-1">
                            <ProfileInfoItem icon={<FaUser />} label="Full Name" value={profileData.fullName} />
                            <ProfileInfoItem icon={<FaEnvelope />} label="Email Address" value={profileData.email} />
                            <ProfileInfoItem icon={<FaIdBadge />} label="Role" value={profileData.role?.charAt(0).toUpperCase() + profileData.role?.slice(1)} />
                            <ProfileInfoItem icon={<FaCalendarAlt />} label="Date of Birth" value={profileData.dob} />
                            <ProfileInfoItem icon={<FaVenusMars />} label="Gender" value={profileData.gender} />
                            <ProfileInfoItem icon={<FaPhone />} label="Phone Number" value={profileData.phone} />
                            <ProfileInfoItem icon={<FaMapMarkerAlt />} label="Address" value={profileData.address} />
                            {/* Show role-specific fields */}
                            {profileData.role === 'hospital' && profileData.hospitalName && (
                                <ProfileInfoItem icon={<FaHospital />} label="Hospital" value={profileData.hospitalName} /> // Assuming FaHospital
                            )}
                            {profileData.role === 'authority' && profileData.authorityDept && (
                                <ProfileInfoItem icon={<FaBuilding />} label="Department" value={profileData.authorityDept} /> // Assuming FaBuilding
                            )}
                        </div>
                    </Card>

                    {/* Donation/Role Specific Card */}
                    <Card className="lg:col-span-1">
                        {profileData.role === 'donor' && (
                            <>
                                <h2 className="text-xl font-semibold text-text-main mb-4 border-b border-secondary/30 pb-2">Donation Summary</h2>
                                <div className="space-y-1">
                                    <ProfileInfoItem icon={<FaTint />} label="Blood Group" value={profileData.bloodGroup} />
                                    <ProfileInfoItem icon={<FaCalendarAlt />} label="Last Donation" value={profileData.lastDonation} />
                                    <ProfileInfoItem icon={<FaHeartbeat />} label="Total Donations" value={profileData.totalDonations?.toString()} />
                                    <ProfileInfoItem icon={<FaGift />} label="Reward Points" value={profileData.rewardPoints?.toString()} />
                                </div>
                                <Button variant="primary" className="w-full mt-6 text-sm" onClick={() => navigate('/my-donations')}>View Full History</Button> {/* Assuming /my-donations route */}
                            </>
                        )}
                        {profileData.role === 'hospital' && (
                            <>
                                <h2 className="text-xl font-semibold text-text-main mb-4 border-b border-secondary/30 pb-2">Hospital Info</h2>
                                {/* Add relevant hospital profile details here */}
                                <p className="text-sm text-text-secondary">Display hospital-specific settings or stats.</p>
                                <Button variant="primary" className="w-full mt-6 text-sm" onClick={() => navigate('/hospital-settings')}>Manage Hospital Settings</Button> {/* Placeholder */}
                            </>
                        )}
                        {profileData.role === 'authority' && (
                            <>
                                <h2 className="text-xl font-semibold text-text-main mb-4 border-b border-secondary/30 pb-2">Authority Info</h2>
                                {/* Add relevant authority profile details here */}
                                <p className="text-sm text-text-secondary">Display authority-specific actions or info.</p>
                                <Button variant="primary" className="w-full mt-6 text-sm" onClick={() => navigate('/authority-oversight')}>Access Oversight Tools</Button> {/* Placeholder */}

                            </>
                        )}
                    </Card>

                </div>
            </div>
        </MainLayout>
    );
};
// Make sure to import missing icons if used
import { FaHospital, FaBuilding, FaHeartbeat, FaVenusMars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for button actions

export default ProfilePage;