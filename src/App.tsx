/**
 * Main App Component
 * Author: VB Entreprise
 * 
 * Root application component with routing and layout management
 * Provides the main structure for the ERP system with role-based access control
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import NotificationManager from './components/NotificationManager';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Login from './pages/Login';
import FirebaseTest from './pages/FirebaseTest';
import AuthDiagnostic from './components/Auth/AuthDiagnostic';
import AdminSetup from './pages/AdminSetup';
import Dashboard from './pages/Dashboard';
import Leads from './pages/CRM/Leads';
import Contacts from './pages/CRM/Contacts';
import Opportunities from './pages/CRM/Opportunities';
import Proposals from './pages/CRM/Proposals';
import AllProjects from './pages/Projects/AllProjects';
import TaskBoards from './pages/Projects/TaskBoards';
import GanttCharts from './pages/Projects/GanttCharts';
import ResourceAllocation from './pages/Projects/ResourceAllocation';
import Invoices from './pages/Finance/Invoices';
import Payments from './pages/Finance/Payments';
import Expenses from './pages/Finance/Expenses';
import TaxSettings from './pages/Finance/TaxSettings';
import Campaigns from './pages/Marketing/Campaigns';
import LeadScoring from './pages/Marketing/LeadScoring';
import LandingPages from './pages/Marketing/LandingPages';
import Analytics from './pages/Marketing/Analytics';
import Contracts from './pages/Documents/Contracts';
import ESignatures from './pages/Documents/ESignatures';
import VersionHistory from './pages/Documents/VersionHistory';
import HelpdeskTickets from './pages/Helpdesk/Tickets';
import KnowledgeBase from './pages/Helpdesk/KnowledgeBase';
import SLA from './pages/Helpdesk/SLA';
import ClientPortal from './pages/Helpdesk/ClientPortal';
import AssetInventory from './pages/Assets/Register';
import SoftwareLicenses from './pages/Assets/LicenseTracking';
import VPSServers from './pages/Assets/VPSServers';
import DomainManagement from './pages/Assets/PurchaseOrders';
import SSL from './pages/Assets/StockLevels';
import Reports from './pages/Reports';
import BI from './pages/BI/DashboardDesigner';
import DataVisualization from './pages/BI/DashboardDesigner';
import DataWarehouse from './pages/BI/DataWarehouse';
import PredictiveForecasts from './pages/BI/PredictiveForecasts';
import ChatComments from './pages/Collaboration/ChatComments';
import ActivityFeed from './pages/Collaboration/ActivityFeed';
import MeetingScheduler from './pages/Collaboration/MeetingScheduler';
import AuditLogs from './pages/Quality/AuditLogs';
import DocumentApprovals from './pages/Quality/DocumentApprovals';
import GDPRSettings from './pages/Quality/GDPRSettings';
import Marketing from './pages/Marketing';
import Documents from './pages/Documents';
import Settings from './pages/Settings';
import { useNotifications } from './store';

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isLoading } = useAuth();
  const { notifications, removeNotification } = useNotifications();

  // Show loading state only during auth loading
  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading..." />;
  }

  // If not authenticated, show login page
  if (!user) {
    return (
      <Routes>
        <Route path="/firebase-test" element={<FirebaseTest />} />
        <Route path="/auth-diagnostic" element={<AuthDiagnostic />} />
        <Route path="/admin-setup" element={<AdminSetup />} />
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div 
              className="fixed inset-0 bg-gray-600 bg-opacity-75" 
              onClick={() => setSidebarOpen(false)}
            />
          </div>
        )}

        {/* Main content */}
        <div className="lg:pl-64">
          <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          
          <main className="py-1">
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                
                {/* CRM Routes */}
                <Route path="/crm/leads" element={
                  <ProtectedRoute requiredPermission={{ resource: 'leads', action: 'read' }}>
                    <Leads />
                  </ProtectedRoute>
                } />
                <Route path="/crm/contacts" element={
                  <ProtectedRoute requiredPermission={{ resource: 'contacts', action: 'read' }}>
                    <Contacts />
                  </ProtectedRoute>
                } />
                <Route path="/crm/opportunities" element={
                  <ProtectedRoute requiredPermission={{ resource: 'opportunities', action: 'read' }}>
                    <Opportunities />
                  </ProtectedRoute>
                } />
                <Route path="/crm/proposals" element={
                  <ProtectedRoute requiredPermission={{ resource: 'proposals', action: 'read' }}>
                    <Proposals />
                  </ProtectedRoute>
                } />

                {/* Project Management Routes */}
                <Route path="/projects/all" element={
                  <ProtectedRoute requiredPermission={{ resource: 'projects', action: 'read' }}>
                    <AllProjects />
                  </ProtectedRoute>
                } />
                <Route path="/projects/task-boards" element={
                  <ProtectedRoute requiredPermission={{ resource: 'projects', action: 'read' }}>
                    <TaskBoards />
                  </ProtectedRoute>
                } />
                <Route path="/projects/gantt-charts" element={
                  <ProtectedRoute requiredPermission={{ resource: 'projects', action: 'read' }}>
                    <GanttCharts />
                  </ProtectedRoute>
                } />
                <Route path="/projects/resource-allocation" element={
                  <ProtectedRoute requiredPermission={{ resource: 'projects', action: 'read' }}>
                    <ResourceAllocation />
                  </ProtectedRoute>
                } />

                {/* Finance Routes */}
                <Route path="/finance/invoices" element={
                  <ProtectedRoute requiredPermission={{ resource: 'finance', action: 'read' }}>
                    <Invoices />
                  </ProtectedRoute>
                } />
                <Route path="/finance/payments" element={
                  <ProtectedRoute requiredPermission={{ resource: 'finance', action: 'read' }}>
                    <Payments />
                  </ProtectedRoute>
                } />
                <Route path="/finance/expenses" element={
                  <ProtectedRoute requiredPermission={{ resource: 'finance', action: 'read' }}>
                    <Expenses />
                  </ProtectedRoute>
                } />
                <Route path="/finance/tax-settings" element={
                  <ProtectedRoute requiredPermission={{ resource: 'finance', action: 'read' }}>
                    <TaxSettings />
                  </ProtectedRoute>
                } />

                {/* Marketing Routes */}
                <Route path="/marketing" element={
                  <ProtectedRoute requiredPermission={{ resource: 'marketing', action: 'read' }}>
                    <Marketing />
                  </ProtectedRoute>
                } />
                <Route path="/marketing/campaigns" element={
                  <ProtectedRoute requiredPermission={{ resource: 'marketing', action: 'read' }}>
                    <Campaigns />
                  </ProtectedRoute>
                } />
                <Route path="/marketing/lead-scoring" element={
                  <ProtectedRoute requiredPermission={{ resource: 'marketing', action: 'read' }}>
                    <LeadScoring />
                  </ProtectedRoute>
                } />
                <Route path="/marketing/landing-pages" element={
                  <ProtectedRoute requiredPermission={{ resource: 'marketing', action: 'read' }}>
                    <LandingPages />
                  </ProtectedRoute>
                } />
                <Route path="/marketing/analytics" element={
                  <ProtectedRoute requiredPermission={{ resource: 'marketing', action: 'read' }}>
                    <Analytics />
                  </ProtectedRoute>
                } />

                {/* Documents Routes */}
                <Route path="/documents" element={
                  <ProtectedRoute requiredPermission={{ resource: 'documents', action: 'read' }}>
                    <Documents />
                  </ProtectedRoute>
                } />
                <Route path="/documents/contracts" element={
                  <ProtectedRoute requiredPermission={{ resource: 'documents', action: 'read' }}>
                    <Contracts />
                  </ProtectedRoute>
                } />
                <Route path="/documents/e-signatures" element={
                  <ProtectedRoute requiredPermission={{ resource: 'documents', action: 'read' }}>
                    <ESignatures />
                  </ProtectedRoute>
                } />
                <Route path="/documents/version-history" element={
                  <ProtectedRoute requiredPermission={{ resource: 'documents', action: 'read' }}>
                    <VersionHistory />
                  </ProtectedRoute>
                } />


                {/* Helpdesk Routes */}
                <Route path="/helpdesk/tickets" element={
                  <ProtectedRoute requiredPermission={{ resource: 'helpdesk', action: 'read' }}>
                    <HelpdeskTickets />
                  </ProtectedRoute>
                } />
                <Route path="/helpdesk/knowledge-base" element={
                  <ProtectedRoute requiredPermission={{ resource: 'helpdesk', action: 'read' }}>
                    <KnowledgeBase />
                  </ProtectedRoute>
                } />
                <Route path="/helpdesk/sla" element={
                  <ProtectedRoute requiredPermission={{ resource: 'helpdesk', action: 'read' }}>
                    <SLA />
                  </ProtectedRoute>
                } />
                <Route path="/helpdesk/client-portal" element={
                  <ProtectedRoute requiredPermission={{ resource: 'helpdesk', action: 'read' }}>
                    <ClientPortal />
                  </ProtectedRoute>
                } />

                {/* Assets Routes */}
                <Route path="/assets/inventory" element={
                  <ProtectedRoute requiredPermission={{ resource: 'assets', action: 'read' }}>
                    <AssetInventory />
                  </ProtectedRoute>
                } />
                <Route path="/assets/software-licenses" element={
                  <ProtectedRoute requiredPermission={{ resource: 'assets', action: 'read' }}>
                    <SoftwareLicenses />
                  </ProtectedRoute>
                } />
                <Route path="/assets/vps-servers" element={
                  <ProtectedRoute requiredPermission={{ resource: 'assets', action: 'read' }}>
                    <VPSServers />
                  </ProtectedRoute>
                } />
                <Route path="/assets/domain-management" element={
                  <ProtectedRoute requiredPermission={{ resource: 'assets', action: 'read' }}>
                    <DomainManagement />
                  </ProtectedRoute>
                } />
                <Route path="/assets/ssl" element={
                  <ProtectedRoute requiredPermission={{ resource: 'assets', action: 'read' }}>
                    <SSL />
                  </ProtectedRoute>
                } />

                {/* Reports Routes */}
                <Route path="/reports" element={
                  <ProtectedRoute requiredPermission={{ resource: 'reports', action: 'read' }}>
                    <Reports />
                  </ProtectedRoute>
                } />

                {/* BI Routes */}
                <Route path="/bi" element={
                  <ProtectedRoute requiredPermission={{ resource: 'bi', action: 'read' }}>
                    <BI />
                  </ProtectedRoute>
                } />
                <Route path="/bi/data-visualization" element={
                  <ProtectedRoute requiredPermission={{ resource: 'bi', action: 'read' }}>
                    <DataVisualization />
                  </ProtectedRoute>
                } />
                <Route path="/bi/data-warehouse" element={
                  <ProtectedRoute requiredPermission={{ resource: 'bi', action: 'read' }}>
                    <DataWarehouse />
                  </ProtectedRoute>
                } />
                <Route path="/bi/predictive-forecasts" element={
                  <ProtectedRoute requiredPermission={{ resource: 'bi', action: 'read' }}>
                    <PredictiveForecasts />
                  </ProtectedRoute>
                } />

                {/* Collaboration Routes */}
                <Route path="/collaboration/chat-comments" element={
                  <ProtectedRoute requiredPermission={{ resource: 'collaboration', action: 'read' }}>
                    <ChatComments />
                  </ProtectedRoute>
                } />
                <Route path="/collaboration/activity-feed" element={
                  <ProtectedRoute requiredPermission={{ resource: 'collaboration', action: 'read' }}>
                    <ActivityFeed />
                  </ProtectedRoute>
                } />
                <Route path="/collaboration/meeting-scheduler" element={
                  <ProtectedRoute requiredPermission={{ resource: 'collaboration', action: 'read' }}>
                    <MeetingScheduler />
                  </ProtectedRoute>
                } />

                {/* Quality Routes */}
                <Route path="/quality/audit-logs" element={
                  <ProtectedRoute requiredPermission={{ resource: 'quality', action: 'read' }}>
                    <AuditLogs />
                  </ProtectedRoute>
                } />
                <Route path="/quality/document-approvals" element={
                  <ProtectedRoute requiredPermission={{ resource: 'quality', action: 'read' }}>
                    <DocumentApprovals />
                  </ProtectedRoute>
                } />
                <Route path="/quality/gdpr-settings" element={
                  <ProtectedRoute requiredPermission={{ resource: 'quality', action: 'read' }}>
                    <GDPRSettings />
                  </ProtectedRoute>
                } />

                {/* Settings Route */}
                <Route path="/settings" element={
                  <ProtectedRoute requiredPermission={{ resource: 'settings', action: 'read' }}>
                    <Settings />
                  </ProtectedRoute>
                } />

                {/* Catch-all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </ErrorBoundary>
          </main>
        </div>
      </div>

      {/* Notification Manager */}
      <NotificationManager 
        notifications={notifications} 
        onRemoveNotification={removeNotification} 
      />
    </ErrorBoundary>
  );
}

function App() {
  // Firebase error handlers are now set up in firebase.ts
  // No additional setup needed here

  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;