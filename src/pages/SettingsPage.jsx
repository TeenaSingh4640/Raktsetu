import React, { useState } from 'react';
import MainLayout from '../components/common/MainLayout'; // Adjust path if necessary
import Card from '../components/ui/Card'; // Adjust path if necessary
import Button from '../components/ui/Button'; // Adjust path if necessary
import Input from '../components/ui/Input'; // Adjust path if necessary
import { useAuth } from '../contexts/Authcontext'; // Adjust path if necessary
import { FaUserShield, FaBell, FaLock, FaTrashAlt, FaToggleOn, FaToggleOff, FaSave, FaSpinner } from 'react-icons/fa'; // Added FaSpinner
import { useNavigate } from 'react-router-dom'; // For redirect after delete

// Simple Toggle Switch Component (reusable within this page or move to ui components)
const ToggleSwitch = ({ label, enabled, onChange, disabled = false }) => (
    <div className="flex items-center justify-between py-3 border-b border-secondary/20 last:border-b-0">
        <span className={`text-sm ${disabled ? 'text-text-muted' : 'text-text-secondary'}`}>{label}</span>
        <button
            onClick={onChange}
            disabled={disabled}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed ${enabled ? 'bg-primary focus:ring-primary' : 'bg-secondary focus:ring-secondary'}`}
        >
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out ${enabled ? 'translate-x-6' : 'translate-x-1'}`}/>
        </button>
    </div>
);


const SettingsPage = () => {
  const { user, logout } = useAuth(); // Get current user and logout function
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // General loading state for save actions
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  // --- State for settings (replace with fetched data & API updates) ---
  const [notifications, setNotifications] = useState({
    urgentRequests: true,
    upcomingAppointments: true,
    rewardUpdates: false,
    communityNews: true,
  });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  // --- End State ---

  const handleNotificationToggle = async (key) => {
      const newState = !notifications[key];
      // Optimistically update UI
      setNotifications(prev => ({ ...prev, [key]: newState }));

      // --- Replace with actual API call to save preference ---
      console.log("Saving notification preference:", key, newState);
      try {
          setIsLoading(true); // Indicate saving
          await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
          // Handle success or revert UI on error
          console.log("Preference saved successfully (simulated)");
      } catch (error) {
          console.error("Failed to save notification preference:", error);
          // Revert UI state on error
          setNotifications(prev => ({ ...prev, [key]: !newState }));
          alert('Failed to save notification preference.'); // Show error to user
      } finally {
          setIsLoading(false);
      }
      // --- End Simulation ---
  };

  const handlePasswordChange = async (e) => {
      e.preventDefault();
      setPasswordError('');
      setPasswordSuccess('');

      if (!currentPassword || !newPassword || !confirmPassword) {
          setPasswordError('Please fill in all password fields.');
          return;
      }
      if (newPassword !== confirmPassword) {
          setPasswordError('New passwords do not match.');
          return;
      }
      if (newPassword.length < 6) {
          setPasswordError('New password must be at least 6 characters long.');
          return;
      }

      setIsPasswordLoading(true);
      // --- Replace with actual API call: POST /api/user/change-password ---
      console.log("Changing password for user:", user?.email);
      try {
          await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
          // Check API response for success/failure
          const success = true; // Simulate success
          if (success) {
              console.log("Password change successful (simulated)");
              setPasswordSuccess('Password updated successfully!');
              // Clear form fields after success
              setCurrentPassword('');
              setNewPassword('');
              setConfirmPassword('');
          } else {
               // Handle specific errors from API, e.g., incorrect current password
               setPasswordError('Failed to update password. Please check your current password.');
          }
      } catch (error) {
          console.error("Password change failed:", error);
          setPasswordError('An unexpected error occurred. Please try again.');
      } finally {
         setIsPasswordLoading(false);
      }
      // --- End Simulation ---
  };

  const handleDeleteAccount = async () => {
      const confirmationText = 'DELETE';
      if (window.confirm('DANGER: Are you absolutely sure you want to permanently delete your account? This action cannot be undone.')) {
          const userInput = window.prompt(`This will delete all your data associated with ${user?.email}.\n\nTo confirm, type "${confirmationText}" below:`);
          if (userInput === confirmationText) {
              setIsDeleteLoading(true);
              console.log("Deleting account for user:", user?.email);
              // --- Replace with actual API call: DELETE /api/user/account ---
              try {
                  await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
                   console.log("Account deleted successfully (simulated)");
                  alert('Account deleted successfully. You will now be logged out.');
                  logout(); // Log the user out
                  // Redirect handled by AuthContext or ProtectedRoute implicitly
                  // navigate('/login', { replace: true }); // Or navigate explicitly if needed

              } catch (error) {
                  console.error("Account deletion failed:", error);
                  alert('Failed to delete account. Please try again later.');
                  setIsDeleteLoading(false);
              }
              // No need to set isLoading to false if navigating away/logging out
              // --- End Simulation ---
          } else {
               alert('Account deletion cancelled. Confirmation text did not match or was empty.');
          }
      }
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fadeIn">
        <h1 className="text-3xl font-bold text-text-main">Settings</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Notifications Card */}
          <Card className="lg:col-span-1 lg:row-start-1"> {/* Adjusted grid position */}
             <h2 className="section-title flex items-center gap-2"><FaBell /> Notifications</h2>
             <p className="text-sm text-text-secondary mb-4">Manage how you receive updates.</p>
             <div className="space-y-1">
                 <ToggleSwitch
                    label="Urgent Blood Requests"
                    enabled={notifications.urgentRequests}
                    onChange={() => handleNotificationToggle('urgentRequests')}
                    disabled={isLoading}
                 />
                 <ToggleSwitch
                    label="Upcoming Appointments"
                    enabled={notifications.upcomingAppointments}
                    onChange={() => handleNotificationToggle('upcomingAppointments')}
                     disabled={isLoading}
                 />
                 <ToggleSwitch
                    label="Reward Program Updates"
                    enabled={notifications.rewardUpdates}
                    onChange={() => handleNotificationToggle('rewardUpdates')}
                     disabled={isLoading}
                 />
                  <ToggleSwitch
                    label="Community News & Events"
                    enabled={notifications.communityNews}
                    onChange={() => handleNotificationToggle('communityNews')}
                     disabled={isLoading}
                 />
             </div>
             {/* Optional: Add a master save button if toggles don't save individually */}
             {/* <Button variant="primary" className="w-full mt-6 text-sm" onClick={() => alert('Save All Preferences')} isLoading={isLoading} disabled={isLoading}>
                 Save Notification Preferences
             </Button> */}
          </Card>


          {/* Account & Security Card */}
          <Card className="lg:col-span-2 lg:row-start-1"> {/* Adjusted grid position */}
             <h2 className="section-title flex items-center gap-2"><FaUserShield /> Account & Security</h2>

            {/* Change Password Section */}
            <form onSubmit={handlePasswordChange} className="space-y-4 mt-4">
                <h3 className="text-md font-semibold text-text-secondary">Change Password</h3>
                {passwordError && <p className="text-xs text-red-400 mt-1">{passwordError}</p>}
                {passwordSuccess && <p className="text-xs text-green-400 mt-1">{passwordSuccess}</p>}
                <Input
                    id="currentPassword"
                    label="Current Password"
                    type="password"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    icon={<FaLock />}
                    required
                    disabled={isPasswordLoading}
                />
                 <Input
                    id="newPassword"
                    label="New Password"
                    type="password"
                    placeholder="•••••••• (min. 6 chars)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    icon={<FaLock />}
                    required
                     disabled={isPasswordLoading}
                />
                 <Input
                    id="confirmPassword"
                    label="Confirm New Password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    icon={<FaLock />}
                    required
                     disabled={isPasswordLoading}
                />
                <Button type="submit" variant="secondary" iconLeft={<FaSave/>} isLoading={isPasswordLoading} disabled={isPasswordLoading}>
                    Update Password
                </Button>
            </form>

            {/* Delete Account Section */}
            <div className="mt-8 border-t border-red-500/30 pt-4">
                 <h3 className="text-md font-semibold text-red-400">Delete Account</h3>
                 <p className="text-sm text-text-secondary mt-1 mb-3">Permanently delete your account and all associated data. This action cannot be undone.</p>
                 <Button
                    variant="danger"
                    iconLeft={isDeleteLoading ? <FaSpinner className="animate-spin"/> : <FaTrashAlt/>}
                    onClick={handleDeleteAccount}
                    isLoading={isDeleteLoading}
                    disabled={isDeleteLoading}
                >
                     Delete My Account
                 </Button>
            </div>
          </Card>

        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;