import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { NotificationDropdown } from "./NotificationDropdown";
import { SearchDropdown } from "./SearchDropdown";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Top Navigation */}
          <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center gap-4 px-6">
              <SidebarTrigger className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" />
              
              <div className="flex-1 flex items-center gap-4 max-w-2xl">
                <SearchDropdown />
              </div>

              <div className="flex items-center gap-2">
                <NotificationDropdown />
                {user && (
                  <div className="flex items-center gap-2 border-l pl-2 ml-2">
                    <span className="text-sm text-muted-foreground">
                      {user.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className="h-8 w-8 p-0"
                      title="Logout"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <div className="bg-primary/10 p-2 rounded-full">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground">
                    KB
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 bg-gradient-subtle">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}