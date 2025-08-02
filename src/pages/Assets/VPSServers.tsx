/**
 * VPS Server Monitoring Page
 * Author: VB Entreprise
 * 
 * Comprehensive VPS server monitoring with real-time metrics,
 * performance tracking, and server management capabilities
 */

import React, { useState, useEffect } from 'react';
import { Plus, Server, Activity, HardDrive, Cpu, Database, Wifi, AlertTriangle, CheckCircle, Clock, Settings, RefreshCw, Power, PowerOff, Eye, DollarSign } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import CreateVPSServerModal from '../../components/Modals/CreateVPSServerModal';

interface VPSServer {
  id: string;
  name: string;
  hostname: string;
  ipAddress: string;
  provider: string;
  location: string;
  plan: string;
  status: 'online' | 'offline' | 'maintenance' | 'suspended';
  uptime: number;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkIn: number;
  networkOut: number;
  lastBackup?: Date;
  nextBackup?: Date;
  monthlyCost: number;
  tags: string[];
  notes: string;
}

interface ServerMetrics {
  timestamp: Date;
  cpu: number;
  memory: number;
  disk: number;
  networkIn: number;
  networkOut: number;
}

const mockServers: VPSServer[] = [
  {
    id: '1',
    name: 'Web Server - Production',
    hostname: 'web-prod-01',
    ipAddress: '192.168.1.100',
    provider: 'DigitalOcean',
    location: 'Mumbai',
    plan: '4GB RAM, 2 vCPU, 80GB SSD',
    status: 'online',
    uptime: 99.8,
    cpuUsage: 45,
    memoryUsage: 78,
    diskUsage: 65,
    networkIn: 1250,
    networkOut: 890,
    lastBackup: new Date('2024-01-22T02:00:00'),
    nextBackup: new Date('2024-01-23T02:00:00'),
    monthlyCost: 2500,
    tags: ['production', 'web-server', 'critical'],
    notes: 'Main production web server'
  },
  {
    id: '2',
    name: 'Database Server',
    hostname: 'db-prod-01',
    ipAddress: '192.168.1.101',
    provider: 'AWS',
    location: 'Mumbai',
    plan: '8GB RAM, 4 vCPU, 160GB SSD',
    status: 'online',
    uptime: 99.9,
    cpuUsage: 32,
    memoryUsage: 85,
    diskUsage: 72,
    networkIn: 890,
    networkOut: 450,
    lastBackup: new Date('2024-01-22T03:00:00'),
    nextBackup: new Date('2024-01-23T03:00:00'),
    monthlyCost: 4500,
    tags: ['production', 'database', 'critical'],
    notes: 'Primary database server'
  },
  {
    id: '3',
    name: 'Development Server',
    hostname: 'dev-01',
    ipAddress: '192.168.1.102',
    provider: 'Linode',
    location: 'Bangalore',
    plan: '2GB RAM, 1 vCPU, 40GB SSD',
    status: 'maintenance',
    uptime: 95.2,
    cpuUsage: 28,
    memoryUsage: 65,
    diskUsage: 45,
    networkIn: 320,
    networkOut: 180,
    lastBackup: new Date('2024-01-21T04:00:00'),
    nextBackup: new Date('2024-01-22T04:00:00'),
    monthlyCost: 1200,
    tags: ['development', 'testing'],
    notes: 'Development and testing environment'
  },
  {
    id: '4',
    name: 'Staging Server',
    hostname: 'staging-01',
    ipAddress: '192.168.1.103',
    provider: 'Vultr',
    location: 'Mumbai',
    plan: '4GB RAM, 2 vCPU, 80GB SSD',
    status: 'offline',
    uptime: 0,
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 0,
    networkIn: 0,
    networkOut: 0,
    lastBackup: new Date('2024-01-20T02:00:00'),
    nextBackup: new Date('2024-01-21T02:00:00'),
    monthlyCost: 2000,
    tags: ['staging', 'pre-production'],
    notes: 'Staging environment for testing'
  }
];

// Mock metrics data for the last 24 hours
const generateMockMetrics = (serverId: string): ServerMetrics[] => {
  const metrics: ServerMetrics[] = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
    metrics.push({
      timestamp,
      cpu: Math.floor(Math.random() * 80) + 10,
      memory: Math.floor(Math.random() * 40) + 50,
      disk: Math.floor(Math.random() * 20) + 60,
      networkIn: Math.floor(Math.random() * 1000) + 200,
      networkOut: Math.floor(Math.random() * 800) + 100
    });
  }
  
  return metrics;
};

export default function VPSServers() {
  const [servers, setServers] = useState<VPSServer[]>(mockServers);
  const [selectedServer, setSelectedServer] = useState<VPSServer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [providerFilter, setProviderFilter] = useState<string>('all');
  const [metrics, setMetrics] = useState<Record<string, ServerMetrics[]>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    // Initialize metrics for all servers
    const initialMetrics: Record<string, ServerMetrics[]> = {};
    servers.forEach(server => {
      initialMetrics[server.id] = generateMockMetrics(server.id);
    });
    setMetrics(initialMetrics);
  }, [servers]);

  const getStatusColor = (status: string) => {
    const colors = {
      online: 'bg-green-100 text-green-800',
      offline: 'bg-red-100 text-red-800',
      maintenance: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="h-4 w-4" />;
      case 'offline':
        return <PowerOff className="h-4 w-4" />;
      case 'maintenance':
        return <Settings className="h-4 w-4" />;
      case 'suspended':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getUsageColor = (usage: number) => {
    if (usage >= 90) return 'text-red-600';
    if (usage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Simulate refresh by regenerating metrics
      const updatedMetrics: Record<string, ServerMetrics[]> = {};
      servers.forEach(server => {
        updatedMetrics[server.id] = generateMockMetrics(server.id);
      });
      setMetrics(updatedMetrics);
      setIsRefreshing(false);
    }, 1000);
  };

  const handleCreateServer = (serverData: any) => {
    const newServer: VPSServer = {
      ...serverData,
      id: serverData.id,
      status: 'online',
      uptime: 100,
      cpuUsage: 0,
      memoryUsage: 0,
      diskUsage: 0,
      networkIn: 0,
      networkOut: 0,
      lastBackup: new Date(),
      nextBackup: new Date(Date.now() + 24 * 60 * 60 * 1000), // Next day
      monthlyCost: serverData.monthlyCost,
      tags: serverData.tags,
      notes: serverData.notes
    };
    
    setServers(prev => [newServer, ...prev]);
    
    // Initialize metrics for the new server
    const newMetrics = generateMockMetrics(newServer.id);
    setMetrics(prev => ({
      ...prev,
      [newServer.id]: newMetrics
    }));
  };

  const filteredServers = servers.filter(server => {
    const matchesSearch = server.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         server.hostname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         server.ipAddress.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || server.status === statusFilter;
    const matchesProvider = providerFilter === 'all' || server.provider === providerFilter;
    
    return matchesSearch && matchesStatus && matchesProvider;
  });

  const totalServers = servers.length;
  const onlineServers = servers.filter(s => s.status === 'online').length;
  const totalMonthlyCost = servers.reduce((sum, server) => sum + server.monthlyCost, 0);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">VPS Server Monitoring</h1>
          <p className="mt-2 text-gray-600">
            Monitor your virtual private servers, track performance metrics, and manage server resources.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
                     <button 
             onClick={() => setIsCreateModalOpen(true)}
             className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
           >
             <Plus className="h-4 w-4" />
             Add Server
           </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Server className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Servers</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{totalServers}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Online Servers</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{onlineServers}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Avg Uptime</dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {servers.length > 0 ? (servers.reduce((sum, s) => sum + s.uptime, 0) / servers.length).toFixed(1) : 0}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-orange-600" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Monthly Cost</dt>
                  <dd className="text-2xl font-semibold text-gray-900">₹{totalMonthlyCost.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search servers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="maintenance">Maintenance</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
            <select
              value={providerFilter}
              onChange={(e) => setProviderFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Providers</option>
              <option value="DigitalOcean">DigitalOcean</option>
              <option value="AWS">AWS</option>
              <option value="Linode">Linode</option>
              <option value="Vultr">Vultr</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Servers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {filteredServers.map((server) => (
          <div key={server.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
              {/* Server Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Server className="h-6 w-6 text-blue-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{server.name}</h3>
                    <p className="text-sm text-gray-500">{server.hostname}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(server.status)}`}>
                    {getStatusIcon(server.status)}
                    <span className="ml-1">{server.status}</span>
                  </span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Server Details */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">IP Address</p>
                  <p className="text-sm font-medium text-gray-900">{server.ipAddress}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Provider</p>
                  <p className="text-sm font-medium text-gray-900">{server.provider}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-sm font-medium text-gray-900">{server.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Uptime</p>
                  <p className="text-sm font-medium text-gray-900">{server.uptime}%</p>
                </div>
              </div>

              {/* Resource Usage */}
              <div className="space-y-3 mb-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">CPU Usage</span>
                    <span className={`font-medium ${getUsageColor(server.cpuUsage)}`}>{server.cpuUsage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-blue-600" 
                      style={{ width: `${server.cpuUsage}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Memory Usage</span>
                    <span className={`font-medium ${getUsageColor(server.memoryUsage)}`}>{server.memoryUsage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-green-600" 
                      style={{ width: `${server.memoryUsage}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Disk Usage</span>
                    <span className={`font-medium ${getUsageColor(server.diskUsage)}`}>{server.diskUsage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-orange-600" 
                      style={{ width: `${server.diskUsage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Network Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Wifi className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">Network In</span>
                  </div>
                  <p className="text-sm text-gray-600">{formatBytes(server.networkIn)}/s</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Wifi className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-900">Network Out</span>
                  </div>
                  <p className="text-sm text-gray-600">{formatBytes(server.networkOut)}/s</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  ₹{server.monthlyCost.toLocaleString()}/month
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                    Details
                  </button>
                  <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                    Manage
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Charts */}
      {selectedServer && metrics[selectedServer.id] && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics - {selectedServer.name}</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">CPU & Memory Usage (24h)</h4>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={metrics[selectedServer.id]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleString()}
                    formatter={(value: any) => [`${value}%`, '']}
                  />
                  <Area type="monotone" dataKey="cpu" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} name="CPU" />
                  <Area type="monotone" dataKey="memory" stroke="#10B981" fill="#10B981" fillOpacity={0.3} name="Memory" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Network Traffic (24h)</h4>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={metrics[selectedServer.id]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleString()}
                    formatter={(value: any) => [formatBytes(value), '']}
                  />
                  <Line type="monotone" dataKey="networkIn" stroke="#3B82F6" strokeWidth={2} name="Network In" />
                  <Line type="monotone" dataKey="networkOut" stroke="#10B981" strokeWidth={2} name="Network Out" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
                 </div>
       )}

       {/* Create Server Modal */}
       <CreateVPSServerModal
         isOpen={isCreateModalOpen}
         onClose={() => setIsCreateModalOpen(false)}
         onSubmit={handleCreateServer}
       />
     </div>
   );
 } 