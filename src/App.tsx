
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLayout from "./components/layout/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Organizers from "./pages/admin/Organizers";
import CreateOrganizer from "./pages/admin/CreateOrganizer";
import EditOrganizer from "./pages/admin/EditOrganizer";
import Agreements from "./pages/admin/Agreements";
import CreateAgreement from "./pages/admin/CreateAgreement";
import ViewAgreement from "./pages/admin/ViewAgreement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="organizers" element={<Organizers />} />
            <Route path="organizers/create" element={<CreateOrganizer />} />
            <Route path="organizers/:id/edit" element={<EditOrganizer />} />
            <Route path="agreements" element={<Agreements />} />
            <Route path="agreements/create" element={<CreateAgreement />} />
            <Route path="agreements/:id" element={<ViewAgreement />} />
          </Route>
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
