import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { FaChartPie, FaDatabase, FaShieldAlt, FaUsers, FaMapMarkedAlt, FaFileAlt, FaBalanceScale, FaBuilding, FaHospital } from 'react-icons/fa';

// Placeholder data (replace with actual API calls)
const stats = {
  totalDonors: 5820,
  activeDonors: 1530, // Example additional stat
  totalHospitals: 45,
  monthlyDonations: 1250,
  criticalStockAlerts: 3, // Hospitals with critical levels
  ledgerTransactions: 15043,
  avgResponseTime: '2h 15m', // Example for request fulfillment
};

// Example Chart Placeholder Component
const ChartPlaceholder = ({ title, icon = <FaChartPie/> }) => (
    <div className="h-56 bg-secondary rounded-lg flex flex-col items-center justify-center text-text-muted border border-secondary/40 p-4 text-center">
        {React.cloneElement(icon, { className: 'text-4xl mb-2 text-primary/60'})}
        <span className="text-sm font-medium">{title}</span>
         <span className="text-xs mt-1">(Chart Data Placeholder)</span>
    </div>
);

const AuthorityDashboardPage = () => {
  // Add state and useEffect for fetching real data later

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold text-text-main">Authority Dashboard</h1>
          {/* Actions like generating reports */}
          <Button variant="primary" iconLeft={<FaFileAlt />}>Generate System Report</Button>
      </div>

      {/* Stats Overview - Adjusted grid for potentially more stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
           {/* Using Card for better structure */}
           <Card padding="p-4">
              <div className="flex items-center space-x-3">
                  <FaUsers className="text-blue-400 text-3xl flex-shrink-0"/>
                  <div>
                      <p className="text-xs text-text-secondary uppercase tracking-wider">Registered Donors</p>
                      <p className="text-xl font-semibold">{stats.totalDonors.toLocaleString()}</p>
                  </div>
              </div>
           </Card>
            <Card padding="p-4">
              <div className="flex items-center space-x-3">
                  <FaHospital className="text-purple-400 text-3xl flex-shrink-0"/>
                  <div>
                      <p className="text-xs text-text-secondary uppercase tracking-wider">Registered Hospitals</p>
                      <p className="text-xl font-semibold">{stats.totalHospitals}</p>
                  </div>
              </div>
           </Card>
           <Card padding="p-4">
              <div className="flex items-center space-x-3">
                  <FaDatabase className="text-green-400 text-3xl flex-shrink-0"/>
                  <div>
                      <p className="text-xs text-text-secondary uppercase tracking-wider">Monthly Donations</p>
                      <p className="text-xl font-semibold">{stats.monthlyDonations.toLocaleString()}</p>
                  </div>
              </div>
           </Card>
            <Card padding="p-4">
              <div className="flex items-center space-x-3">
                  <FaShieldAlt className="text-yellow-400 text-3xl flex-shrink-0"/>
                  <div>
                      <p className="text-xs text-text-secondary uppercase tracking-wider">Ledger Transactions</p>
                      <p className="text-xl font-semibold">{stats.ledgerTransactions.toLocaleString()}</p>
                  </div>
              </div>
           </Card>
           {/* Add more stats cards as needed */}
      </div>

      {/* Main Dashboard Area - Charts and Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Analytics Charts Column */}
          <div className="lg:col-span-2 space-y-6">
              <Card>
                  <h2 className="section-title mb-0">Regional Supply vs Demand Trends</h2>
                  <p className="text-sm text-text-secondary mb-4">Monthly overview of blood supply and requests.</p>
                  <ChartPlaceholder title="Supply/Demand Over Time" icon={<FaBalanceScale />}/>
              </Card>
               <Card>
                  <h2 className="section-title mb-0">Donation Demographics</h2>
                  <p className="text-sm text-text-secondary mb-4">Breakdown of donations by key groups.</p>
                  <ChartPlaceholder title="Donations by Blood Type / Age Group" icon={<FaChartPie />}/>
              </Card>
               <Card>
                  <h2 className="section-title mb-0">Hospital Inventory Overview</h2>
                   <p className="text-sm text-text-secondary mb-4">Snapshot of current stock levels across facilities.</p>
                  <ChartPlaceholder title="Inventory Levels by Hospital" icon={<FaChartPie />}/>
               </Card>
          </div>

          {/* Oversight Tools & Quick Access Column */}
          <div className="lg:col-span-1 space-y-6">
              <Card>
                   <h2 className="section-title mb-0">Oversight Tools</h2>
                   <p className="text-sm text-text-secondary mb-4">Access key system management functions.</p>
                   <div className="space-y-3">
                       <Button variant="outline" className="w-full justify-start" iconLeft={<FaShieldAlt />} onClick={() => alert('Navigate to Blockchain Ledger page')}>
                           View Blockchain Ledger
                       </Button>
                       <Button variant="outline" className="w-full justify-start" iconLeft={<FaMapMarkedAlt />} onClick={() => alert('Navigate to Inventory Map page')}>
                           Hospital Inventory Map
                       </Button>
                       <Button variant="outline" className="w-full justify-start" iconLeft={<FaUsers />} onClick={() => alert('Navigate to User Management page')}>
                           Manage User Roles
                       </Button>
                       <Button variant="outline" className="w-full justify-start" iconLeft={<FaFileAlt />} onClick={() => alert('Navigate to Audit Logs page')}>
                           View Audit Logs
                       </Button>
                        <Button variant="secondary" className="w-full justify-start" iconLeft={<FaBalanceScale />} onClick={() => alert('Navigate to Stock Alerts page')}>
                           Review Stock Alerts ({stats.criticalStockAlerts})
                       </Button>
                   </div>
              </Card>

               <Card>
                  <h2 className="section-title mb-0">System Health</h2>
                  <p className="text-sm text-text-secondary mb-4">Monitor key operational metrics.</p>
                  {/* Replace with actual system health indicators */}
                   <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span>API Status:</span><span className="text-green-400 font-medium">Operational</span></div>
                      <div className="flex justify-between"><span>Ledger Sync:</span><span className="text-green-400 font-medium">Synced</span></div>
                      <div className="flex justify-between"><span>Avg. Req. Response:</span><span className="text-text-main font-medium">{stats.avgResponseTime}</span></div>
                   </div>
              </Card>

               <Card>
                  <h2 className="section-title mb-0">Quick Links</h2>
                  <p className="text-sm text-text-secondary mb-4">Frequently accessed resources.</p>
                   <div className="space-y-3">
                      <a href="#" className="flex items-center text-sm text-primary hover:underline"><FaBuilding className="mr-2"/> National Guidelines</a>
                      <a href="#" className="flex items-center text-sm text-primary hover:underline"><FaFileAlt className="mr-2"/> Reporting Templates</a>
                   </div>
              </Card>
          </div>
      </div>
    </div>
  );
};

export default AuthorityDashboardPage;