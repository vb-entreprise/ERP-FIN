/**
 * BI Dashboard Designer Page
 * Author: VB Entreprise
 * 
 * Custom dashboard builder with drag-and-drop widgets
 */

import React, { useState } from 'react';
import { Plus, BarChart3, PieChart, LineChart, Grid, Layout, Settings, Eye, X } from 'lucide-react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import CreateDashboardModal from '../../components/Modals/CreateDashboardModal';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface Widget {
  id: string;
  type: 'chart' | 'metric' | 'table' | 'text';
  title: string;
  dataSource: string;
  config: any;
  position: { x: number; y: number; w: number; h: number };
}

interface Dashboard {
  id: string;
  name: string;
  description: string;
  widgets: Widget[];
  isPublic: boolean;
  createdBy: string;
  lastModified: Date;
}

const mockDashboards: Dashboard[] = [
  {
    id: '1',
    name: 'Executive Overview',
    description: 'High-level KPIs for leadership team',
    widgets: [],
    isPublic: true,
    createdBy: 'Admin User',
    lastModified: new Date('2024-01-22')
  },
  {
    id: '2',
    name: 'Sales Performance',
    description: 'Sales metrics and pipeline analysis',
    widgets: [],
    isPublic: false,
    createdBy: 'Sales Manager',
    lastModified: new Date('2024-01-20')
  }
];

const widgetTypes = [
  { type: 'chart', name: 'Bar Chart', icon: BarChart3, description: 'Compare values across categories' },
  { type: 'chart', name: 'Line Chart', icon: LineChart, description: 'Show trends over time' },
  { type: 'chart', name: 'Pie Chart', icon: PieChart, description: 'Show proportions and percentages' },
  { type: 'metric', name: 'KPI Metric', icon: Grid, description: 'Display key performance indicators' }
];

export default function DashboardDesigner() {
  const [dashboards, setDashboards] = useState<Dashboard[]>(mockDashboards);
  const [selectedDashboard, setSelectedDashboard] = useState<Dashboard | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'designer'>('list');
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Convert widgets to grid layout format
  const layout = widgets.map(widget => ({
    i: widget.id,
    x: widget.position.x,
    y: widget.position.y,
    w: widget.position.w,
    h: widget.position.h,
    minW: 2,
    minH: 2
  }));

  const handleAddWidget = (widgetType: typeof widgetTypes[0]) => {
    const newWidget: Widget = {
      id: `widget-${Date.now()}`,
      type: widgetType.type as 'chart' | 'metric',
      title: widgetType.name,
      dataSource: 'Sample Data',
      config: {},
      position: { x: 0, y: 0, w: 4, h: 3 }
    };
    setWidgets([...widgets, newWidget]);
  };

  const handleLayoutChange = (newLayout: any[]) => {
    const updatedWidgets = widgets.map(widget => {
      const layoutItem = newLayout.find(item => item.i === widget.id);
      if (layoutItem) {
        return {
          ...widget,
          position: {
            x: layoutItem.x,
            y: layoutItem.y,
            w: layoutItem.w,
            h: layoutItem.h
          }
        };
      }
      return widget;
    });
    setWidgets(updatedWidgets);
  };

  const handleRemoveWidget = (widgetId: string) => {
    setWidgets(widgets.filter(widget => widget.id !== widgetId));
  };

  const handleCreateDashboard = (dashboardData: any) => {
    const newDashboard: Dashboard = {
      id: dashboardData.id,
      name: dashboardData.name,
      description: dashboardData.description,
      widgets: dashboardData.widgets,
      isPublic: dashboardData.isPublic,
      createdBy: dashboardData.createdBy,
      lastModified: dashboardData.lastModified
    };
    
    setDashboards(prev => [...prev, newDashboard]);
    setIsCreateModalOpen(false);
  };

  const renderWidget = (widget: Widget) => {
    return (
      <div key={widget.id} className="bg-white border border-gray-200 rounded-lg p-4 h-full">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-900">{widget.title}</h4>
          <button
            onClick={() => handleRemoveWidget(widget.id)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center justify-center h-32 bg-gray-50 rounded border-2 border-dashed border-gray-300">
          {widget.type === 'chart' && (
            <div className="text-center">
              <BarChart3 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-xs text-gray-500">Chart Widget</p>
            </div>
          )}
          {widget.type === 'metric' && (
            <div className="text-center">
              <Grid className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-xs text-gray-500">KPI Widget</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Designer</h1>
          <p className="mt-2 text-gray-600">
            Create custom dashboards with drag-and-drop widgets.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none flex gap-3">
          <div className="flex rounded-lg border border-gray-300 overflow-hidden">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'list' 
                  ? 'bg-blue-50 text-blue-700 border-r border-gray-300' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Dashboard List
            </button>
            <button
              onClick={() => setActiveTab('designer')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'designer' 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Designer
            </button>
          </div>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            <Plus className="h-4 w-4" />
            New Dashboard
          </button>
        </div>
      </div>

      {activeTab === 'list' ? (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dashboard</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Widgets</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visibility</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Modified</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboards.map((dashboard) => (
                  <tr key={dashboard.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{dashboard.name}</div>
                        <div className="text-sm text-gray-500">{dashboard.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {dashboard.widgets.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        dashboard.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {dashboard.isPublic ? 'Public' : 'Private'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {dashboard.createdBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {dashboard.lastModified.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 p-1 rounded">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900 p-1 rounded">
                          <Settings className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Widget Library */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Widget Library</h3>
                <p className="text-sm text-gray-500 mt-1">Drag widgets to the canvas</p>
              </div>
              <div className="p-4 space-y-3">
                {widgetTypes.map((widget, index) => (
                  <div
                    key={index}
                    className="flex items-start p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleAddWidget(widget)}
                    draggable
                    onDragStart={(e) => {
                      setIsDragging(true);
                      e.dataTransfer.setData('text/plain', JSON.stringify(widget));
                    }}
                    onDragEnd={() => setIsDragging(false)}
                  >
                    <widget.icon className="h-5 w-5 mr-3 text-gray-600 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{widget.name}</div>
                      <div className="text-xs text-gray-500">{widget.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dashboard Canvas */}
          <div className="lg:col-span-3">
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Dashboard Canvas</h3>
                  <div className="text-sm text-gray-500">
                    {widgets.length} widget{widgets.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
              <div className="p-6">
                {widgets.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center min-h-96">
                    <Layout className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Design Your Dashboard</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Click on widgets from the library or drag them here to create custom dashboards.
                    </p>
                  </div>
                ) : (
                  <div className="min-h-96">
                    <ResponsiveGridLayout
                      className="layout"
                      layouts={{ lg: layout }}
                      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                      rowHeight={100}
                      onLayoutChange={handleLayoutChange}
                      isDraggable={true}
                      isResizable={true}
                      margin={[16, 16]}
                    >
                      {widgets.map(widget => (
                        <div key={widget.id}>
                          {renderWidget(widget)}
                        </div>
                      ))}
                    </ResponsiveGridLayout>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Dashboard Modal */}
      <CreateDashboardModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateDashboard}
      />
    </div>
  );
}