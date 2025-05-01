
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <header className="border-b bg-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-800">ShowMates Admin</h1>
          <Button onClick={() => navigate("/admin")}>
            Enter Admin Panel
          </Button>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-2xl px-4">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 text-blue-900">
            Organizer Management System
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Efficiently manage organizers, create service agreements, and track commissions through a centralized admin dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/admin")}>
              Go to Admin Dashboard
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/admin/organizers/create")}>
              Create New Organizer
            </Button>
          </div>
        </div>
      </main>
      
      <footer className="border-t bg-white p-4 text-sm text-center text-gray-500">
        <div className="container mx-auto">
          © {new Date().getFullYear()} ShowMates Admin. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
