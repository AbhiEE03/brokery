import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./app/auth/Login";

import AdminDashboard from "./app/admin/Dashboard";
import AdminProperties from "./app/admin/Properties";

import BrokerDashboard from "./app/Broker/Dashboard";
import AdminClients from "./app/admin/Clients";
import AdminBrokers from "./app/admin/Brokers";
import AdminRequests from "./app/admin/Requests";
import AdminAddProperty from "./app/admin/AddProperty";
import AdminAddBroker from "./app/admin/AddBroker";
import AdminPropertyDetails from "./app/admin/PropertyDetails";
import AdminEditProperty from "./app/admin/EditProperty";
import AdminReports from "./app/admin/Reports";
import AdminClientChangeRequests from "./app/admin/ClientChangeRequests"
import AdminClientChangeForm from "./app/admin/ClientChangeForm"
import AdminClientDetails from "./app/admin/ClientDetails"
// AdminClientChangeRequests




import BrokerCRM from "./app/Broker/crm"
import BrokerProperties from "./app/Broker/Properties";
import BrokerPropertyDetails from "./app/Broker/PropertyDetails";
import Matches from "./app/Broker/Matches";

import BrokerAddClient from "./app/Broker/AddClient";
import BrokerClientDetails from "./app/Broker/ClientDetails";
import BrokerDocuments from "./app/Broker/Documents";
import BrokerRequestEditProperty from "./app/Broker/RequestEdit";
import BrokerReports from "./app/Broker/Reports";
import BrokerDealers from "./app/Broker/Dealers";
import BrokerInventory from "./app/Broker/Inventory";
import BrokerTasks from "./app/Broker/Inventory";
import BrokerMatchesSection from "./app/Broker/Matches";
import BrokerClientProfile from "./app/Broker/ClientProfile"
import BrokerClientProfileEdit from "./app/Broker/ClientProfileEdit"
import BrokerClientProfileRequestEdit from "./app/Broker/ClientProfileEditRequest"
// BrokerReports
// import AddClient from "../pages/broker/AddClient";
// import ClientDetails from "../pages/broker/ClientDetails";


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* AUTH */}
        <Route path="/login" element={<Login />} />

        {/* ADMIN */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/properties" element={<AdminProperties />} />
        <Route path="/admin/clients" element={<AdminClients />} />
        <Route path="/admin/client/:id" element={<AdminClientDetails />} />
        <Route path="/admin/brokers" element={<AdminBrokers />} />
        <Route path="/admin/requests" element={<AdminRequests />} />
        <Route path="/admin/add-property" element={<AdminAddProperty />} />
        <Route path="/admin/add-broker" element={<AdminAddBroker />} />
        <Route path="/admin/properties/:id" element={<AdminPropertyDetails />} />
        <Route path="/admin/property/:id/edit" element={<AdminEditProperty />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/ClientChangeRequests" element={<AdminClientChangeRequests />} />
        <Route path="/admin/client-change-requests/:id" element={<AdminClientChangeForm />} />



        {/* BROKER */}
        {/* DASHBOARD */}
        <Route path="/broker/dashboard" element={<BrokerDashboard />} />

        {/* CRM */}
        <Route path="/broker/crm" element={<BrokerCRM />} />
        <Route path="/broker/properties" element={<BrokerProperties />} />
        <Route path="/broker/properties/:id" element={<BrokerPropertyDetails />} />
        <Route path="/broker/add-client" element={<BrokerAddClient />} />
        <Route path="/broker/clients/:id" element={<BrokerClientDetails />} />
        <Route path="/broker/documents" element={<BrokerDocuments />} />
        <Route path="/broker/property/:id/request-edit" element={<BrokerRequestEditProperty />} />
        <Route path="/broker/reports" element={<BrokerReports />} />
        <Route path="/broker/dealers" element={<BrokerDealers />} />
        <Route path="/broker/inventory" element={<BrokerInventory />} />
        <Route path="/broker/tasks" element={<BrokerTasks />} />
        <Route path="/broker/matches" element={<BrokerMatchesSection />} />
        <Route path="/broker/clients/:id/profile" element={<BrokerClientProfile />} />
        <Route path="/broker/clients/:id/profile/edit" element={<BrokerClientProfileEdit />} />
        <Route path="/broker/clients/:id/profile/requestEdit" element={<BrokerClientProfileRequestEdit />} />


      </Routes>
    </BrowserRouter>
  );
}
