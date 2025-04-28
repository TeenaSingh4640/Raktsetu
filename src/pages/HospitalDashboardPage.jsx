import React from 'react';
import MainLayout from '../components/common/MainLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { FaTint, FaChartBar, FaPlusCircle, FaExclamationTriangle, FaCheckCircle, FaHourglassHalf, FaShieldAlt, FaUsers } from 'react-icons/fa';

// Sample Data (replace with actual data/API calls)
const inventoryData = [
  { type: 'O+', units: 50, target: 60, status: 'Stable' },
  { type: 'O-', units: 15, target: 30, status: 'Low' },
  { type: 'A+', units: 75, target: 70, status: 'Good' },
  { type: 'A-', units: 20, target: 25, status: 'Low' },
  { type: 'B+', units: 40, target: 50, status: 'Stable' },
  { type: 'B-', units: 8, target: 20, status: 'Critical' },
  { type: 'AB+', units: 30, target: 25, status: 'Good' },
  { type: 'AB-', units: 5, target: 15, status: 'Critical' },
];

const pendingRequests = [
    { id: 'R101', type: 'A-', units: 2, urgency: 'High', status: 'Pending' },
    { id: 'R102', type: 'O+', units: 5, urgency: 'Medium', status: 'Pending' },
];

const recentTransactions = [ // Example for Blockchain Ledger idea
    { id: 'T201', type: 'Donation', blood: 'A+', units: 1, donor: 'J. Doe', timestamp: '2h ago', verified: true },
    { id: 'T202', type: 'Transfusion', blood: 'O-', units: 2, patient: 'P123', timestamp: '5h ago', verified: true },
    { id: 'T203', type: 'Donation', blood: 'B+', units: 1, donor: 'S. Smith', timestamp: '1d ago', verified: false }, // Example unverified
];


const InventoryBar = ({ type, units, target }) => {
  const percentage = target > 0 ? Math.min(100, (units / target) * 100) : 0;
  let bgColor = 'bg-accent-green';
  if (percentage < 30) bgColor = 'bg-accent-red';
  else if (percentage < 60) bgColor = 'bg-accent-yellow';

  return (
    <div className="flex items-center gap-3">
      <span className="w-8 font-semibold text-sm text-right text-text-main">{type}</span>
      <div className="flex-1 bg-secondary rounded-full h-3 relative overflow-hidden">
        <div
          className={`absolute top-0 left-0 h-full rounded-full ${bgColor} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        ></div>
         {/* Target line (optional) */}
         {/* <div className="absolute top-0 left-0 h-full w-px bg-white/50" style={{ left: '100%' }}></div> */}
      </div>
      <span className="w-10 text-xs text-text-secondary text-right">{units}/{target}</span>
    </div>
  );
};


const HospitalDashboardPage = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-3xl font-bold text-text-main">Hospital Inventory Dashboard</h1>
            <Button variant="primary" iconLeft={<FaPlusCircle />}>Create Blood Request</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Inventory Status */}
            <Card className="lg:col-span-2">
                <h2 className="section-title flex items-center gap-2"><FaTint className="text-primary"/> Live Inventory Status</h2>
                <div className="space-y-3">
                    {inventoryData.map(item => (
                        <InventoryBar key={item.type} type={item.type} units={item.units} target={item.target} />
                    ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-text-muted">
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-accent-red"></div> Critical (0-30%)</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-accent-yellow"></div> Low (30-60%)</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-accent-green"></div> Good (100-60%)</span>
                </div>
            </Card>

             {/* Pending Requests */}
            <Card>
                <h2 className="section-title flex items-center gap-2"><FaExclamationTriangle className="text-accent-yellow"/> Pending Requests</h2>
                 {pendingRequests.length > 0 ? (
                     <ul className="space-y-3">
                        {pendingRequests.map(req => (
                            <li key={req.id} className="text-sm border-b border-secondary/30 pb-2 last:border-b-0 last:pb-0">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-text-main">{req.type} - {req.units} Units</span>
                                    <span className={`text-xs px-2 py-0.5 rounded ${req.urgency === 'High' ? 'bg-red-500/80 text-white' : 'bg-yellow-500/80 text-black'}`}>{req.urgency}</span>
                                </div>
                                <div className="flex justify-between items-center mt-1 text-text-secondary">
                                     <span>ID: {req.id}</span>
                                     <Button size="sm" variant="ghost">Manage</Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                 ) : (
                     <p className="text-sm text-text-secondary">No pending requests.</p>
                 )}
                 <Button variant="outline" className="w-full mt-4 text-sm">View All Requests</Button>
            </Card>

             {/* Placeholder for Blockchain Ledger / Recent Transactions */}
             <Card className="lg:col-span-3">
                 <h2 className="section-title flex items-center gap-2"><FaShieldAlt className="text-accent-blue"/> Recent Verified Transactions (Ledger Concept)</h2>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-text-secondary uppercase bg-secondary/30">
                            <tr>
                                <th scope="col" className="px-4 py-2">Type</th>
                                <th scope="col" className="px-4 py-2">Blood/Units</th>
                                <th scope="col" className="px-4 py-2">Actor</th>
                                <th scope="col" className="px-4 py-2">Timestamp</th>
                                <th scope="col" className="px-4 py-2 text-center">Verified</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentTransactions.map(tx => (
                                <tr key={tx.id} className="border-b border-secondary/30 hover:bg-secondary/20">
                                    <td className="px-4 py-2 font-medium text-text-main">{tx.type}</td>
                                    <td className="px-4 py-2">{tx.blood} ({tx.units})</td>
                                    <td className="px-4 py-2 text-text-secondary">{tx.type === 'Donation' ? `Donor: ${tx.donor}` : `Patient: ${tx.patient}`}</td>
                                    <td className="px-4 py-2 text-text-secondary">{tx.timestamp}</td>
                                    <td className="px-4 py-2 text-center">
                                        {tx.verified
                                            ? <FaCheckCircle className="text-accent-green inline" title="Verified on Ledger"/>
                                            : <FaHourglassHalf className="text-accent-yellow inline" title="Pending Verification"/>
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
                 <Button variant="ghost" className="w-full mt-3 text-sm text-primary">View Full Ledger</Button>
             </Card>

             {/* Add Placeholders for other sections: Supply Trends, Demand Prediction, Donor Management Link */}
             <Card>
                 <h2 className="section-title flex items-center gap-2"><FaChartBar className="text-primary"/> Supply Trends</h2>
                 <div className="h-40 bg-secondary rounded flex items-center justify-center text-text-muted">Chart Placeholder</div>
             </Card>
             <Card>
                 <h2 className="section-title flex items-center gap-2"><FaUsers className="text-primary"/> Donor Management</h2>
                  <p className="text-sm text-text-secondary mb-3">Quick overview of active donors.</p>
                 <Button variant="outline" className="w-full text-sm">Go to Donor Management</Button>
             </Card>
             <Card>
                 <h2 className="section-title flex items-center gap-2"><FaBrain className="text-primary"/> AI Demand Prediction</h2> {/* Assuming FaBrain */}
                 <div className="h-40 bg-secondary rounded flex items-center justify-center text-text-muted">Prediction Placeholder</div>
             </Card>


        </div>
      </div>
    </MainLayout>
  );
};
import { FaBrain } from 'react-icons/fa'; // Ensure icon is imported

export default HospitalDashboardPage;