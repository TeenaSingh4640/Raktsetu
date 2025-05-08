import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { FaUserCircle, FaMapMarkerAlt, FaThumbsUp, FaShare } from 'react-icons/fa';

// Placeholder for map image (replace with actual map component later)
import mapPlaceholder from '../assets/map-placeholder.png';

// Sample alert data
const sampleAlerts = [
    { id: 1, name: 'John Doe', avatar: null, bloodType: 'O-', message: 'Urgent need at City Hospital. Your donation can save a life.', time: '15m ago', location: 'City Hospital' },
    { id: 2, name: 'Jane Smith', avatar: null, bloodType: 'A+', message: 'Request - AB+ blood required at Downtown Clinic. Join the cause, be a hero.', time: '30m ago', location: 'Downtown Clinic' },
    { id: 3, name: 'Community Blood Drive', avatar: null, bloodType: 'All Types', message: 'Blood drive event this Saturday at Community Center. All types welcome!', time: '2h ago', location: 'Community Center' },
];

// Sample filter options
const filterOptions = [
    { id: 'requests', label: 'Requests' },
    { id: 'rewards', label: 'Rewards' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'matching', label: 'Matching' },
    { id: 'appointments', label: 'Appointments' },
]

const AlertsPage = () => {
    const [alerts, setAlerts] = useState(sampleAlerts);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilters, setSelectedFilters] = useState(
        filterOptions.reduce((acc, curr) => ({ ...acc, [curr.id]: true }), {})
    );

    const handleFilterChange = (event) => {
        const { name, checked } = event.target;
        setSelectedFilters(prev => ({ ...prev, [name]: checked }));
        // In a real app, you would refetch or filter data based on selectedFilters
        console.log("Filters updated:", { ...selectedFilters, [name]: checked });
    };

    const handleClearFilters = () => {
        setSelectedFilters(filterOptions.reduce((acc, curr) => ({ ...acc, [curr.id]: true }), {}));
    }

    const handleFilterSubmit = () => {
        // Logic to apply filters - often triggers data refetching
        console.log("Applying filters:", selectedFilters);
        alert("Filtering logic would run here.");
    }

    // Basic search filtering (can be expanded)
    const filteredAlerts = alerts.filter(alert =>
        alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-text-main">BloodLink Alerts</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Alerts List & Search */}
                <div className="lg:col-span-2 space-y-4">
                    <Input
                        id="search-alerts"
                        placeholder="Enter location or blood type..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mb-4"
                    />
                    <h2 className="text-xl font-semibold text-text-secondary">Urgent</h2>
                    {filteredAlerts.length > 0 ? (
                        filteredAlerts.map(alert => (
                            <Card key={alert.id} className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                                <div className="flex-shrink-0">
                                    {alert.avatar ? (
                                        <img src={alert.avatar} alt={alert.name} className="w-12 h-12 rounded-full" />
                                    ) : (
                                        <FaUserCircle className="w-12 h-12 text-text-secondary" />
                                    )}
                                </div>
                                <div className="flex-grow">
                                    <div className="flex justify-between items-baseline">
                                        <span className="font-semibold text-text-main">{alert.name}</span>
                                        <span className="text-xs text-text-secondary">{alert.time}</span>
                                    </div>
                                    <p className="text-sm text-text-secondary mt-1">
                                        <span className="font-medium text-primary">{alert.bloodType}</span> - {alert.message}
                                    </p>
                                    <div className="flex items-center space-x-4 mt-2 text-sm text-text-secondary">
                                        <button className="flex items-center hover:text-primary transition-colors">
                                            <FaThumbsUp className="mr-1" /> Like
                                        </button>
                                        <button className="flex items-center hover:text-primary transition-colors">
                                            <FaShare className="mr-1" /> Share
                                        </button>
                                        <span className="flex items-center">
                                            <FaMapMarkerAlt className="mr-1 text-primary" /> {alert.location}
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <p className="text-text-secondary">No matching alerts found.</p>
                    )}
                    {/* Simple Map Placeholder */}
                    <Card>
                        <h3 className="text-lg font-semibold text-text-main mb-3">Nearby Donation Centers</h3>
                        <img src={mapPlaceholder} alt="Map placeholder showing donation locations" className="w-full h-64 object-cover rounded-md border border-secondary" />
                        <p className="text-xs text-center text-text-secondary mt-2">Map functionality requires integration with a mapping service (e.g., Leaflet, Mapbox).</p>
                    </Card>
                </div>

                {/* Filters Section */}
                <div className="lg:col-span-1">
                    <Card>
                        <h3 className="text-lg font-semibold text-text-main mb-4">Notifications Filter</h3>
                        <div className="space-y-3 mb-5">
                            {filterOptions.map(filter => (
                                <div key={filter.id} className="flex items-center justify-between">
                                    <label htmlFor={filter.id} className="text-text-secondary">{filter.label}</label>
                                    <input
                                        type="checkbox"
                                        id={filter.id}
                                        name={filter.id}
                                        checked={selectedFilters[filter.id]}
                                        onChange={handleFilterChange}
                                        className="form-checkbox h-5 w-5 text-primary bg-secondary border-gray-500 rounded focus:ring-primary focus:ring-offset-0 focus:ring-offset-background"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex space-x-3">
                            <Button onClick={handleFilterSubmit} variant="primary" className="flex-1">Filter</Button>
                            <Button onClick={handleClearFilters} variant="secondary" className="flex-1">Clear</Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AlertsPage;