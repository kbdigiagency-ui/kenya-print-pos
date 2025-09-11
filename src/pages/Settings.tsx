import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Settings as SettingsIcon, Building2, User, Database, Mail, Lock, Bell } from "lucide-react";

const Settings = () => {
  const [companySettings, setCompanySettings] = useState({
    name: "KB Digital Agency LTD",
    email: "kbdigiagency@gmail.com",
    phone: "+254722123456",
    address: "Nairobi, Kenya",
    website: "www.kbdigitalagency.co.ke",
    taxNumber: "KRA-PIN-123456789",
    currency: "KES",
    logo: "",
  });

  const [userSettings, setUserSettings] = useState({
    name: "Admin User",
    email: "kbdigiagency@gmail.com",
    phone: "+254722123456",
    role: "Administrator",
    notifications: {
      email: true,
      sms: false,
      dashboard: true,
      reports: true,
    }
  });

  const [systemSettings, setSystemSettings] = useState({
    autoBackup: true,
    backupFrequency: "daily",
    dataRetention: "12",
    defaultTax: "16",
    invoicePrefix: "INV",
    quotationPrefix: "Q",
    receiptPrefix: "REC",
  });

  const { toast } = useToast();

  const handleSaveCompany = () => {
    toast({
      title: "Company Settings Saved",
      description: "Your company information has been updated successfully.",
    });
  };

  const handleSaveUser = () => {
    toast({
      title: "User Settings Saved", 
      description: "Your profile settings have been updated successfully.",
    });
  };

  const handleSaveSystem = () => {
    toast({
      title: "System Settings Saved",
      description: "System configuration has been updated successfully.",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: "Your data export is being prepared. You'll receive an email when ready.",
    });
  };

  const handleBackupData = () => {
    toast({
      title: "Backup Created",
      description: "A full system backup has been created successfully.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">System Settings</h1>
        <p className="text-muted-foreground">
          Manage your business settings, user preferences, and system configuration
        </p>
      </div>

      <Tabs defaultValue="company" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="user">User Profile</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Company Information
              </CardTitle>
              <CardDescription>
                Update your business details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={companySettings.name}
                    onChange={(e) => setCompanySettings({ ...companySettings, name: e.target.value })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="taxNumber">KRA PIN</Label>
                  <Input
                    id="taxNumber"
                    value={companySettings.taxNumber}
                    onChange={(e) => setCompanySettings({ ...companySettings, taxNumber: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="companyEmail">Email Address</Label>
                  <Input
                    id="companyEmail"
                    type="email"
                    value={companySettings.email}
                    onChange={(e) => setCompanySettings({ ...companySettings, email: e.target.value })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="companyPhone">Phone Number</Label>
                  <Input
                    id="companyPhone"
                    value={companySettings.phone}
                    onChange={(e) => setCompanySettings({ ...companySettings, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="companyAddress">Business Address</Label>
                <Textarea
                  id="companyAddress"
                  value={companySettings.address}
                  onChange={(e) => setCompanySettings({ ...companySettings, address: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={companySettings.website}
                    onChange={(e) => setCompanySettings({ ...companySettings, website: e.target.value })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <Input
                    id="currency"
                    value={companySettings.currency}
                    onChange={(e) => setCompanySettings({ ...companySettings, currency: e.target.value })}
                    readOnly
                  />
                </div>
              </div>

              <Button onClick={handleSaveCompany} className="w-full">
                <Building2 className="h-4 w-4 mr-2" />
                Save Company Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                User Profile
              </CardTitle>
              <CardDescription>
                Manage your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="userName">Full Name</Label>
                  <Input
                    id="userName"
                    value={userSettings.name}
                    onChange={(e) => setUserSettings({ ...userSettings, name: e.target.value })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="userRole">Role</Label>
                  <Input
                    id="userRole"
                    value={userSettings.role}
                    readOnly
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="userEmail">Email Address</Label>
                  <Input
                    id="userEmail"
                    type="email"
                    value={userSettings.email}
                    onChange={(e) => setUserSettings({ ...userSettings, email: e.target.value })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="userPhone">Phone Number</Label>
                  <Input
                    id="userPhone"
                    value={userSettings.phone}
                    onChange={(e) => setUserSettings({ ...userSettings, phone: e.target.value })}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Preferences</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={userSettings.notifications.email}
                      onCheckedChange={(checked) => 
                        setUserSettings({
                          ...userSettings,
                          notifications: { ...userSettings.notifications, email: checked }
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                    </div>
                    <Switch
                      checked={userSettings.notifications.sms}
                      onCheckedChange={(checked) => 
                        setUserSettings({
                          ...userSettings,
                          notifications: { ...userSettings.notifications, sms: checked }
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Dashboard Alerts</Label>
                      <p className="text-sm text-muted-foreground">Show alerts on dashboard</p>
                    </div>
                    <Switch
                      checked={userSettings.notifications.dashboard}
                      onCheckedChange={(checked) => 
                        setUserSettings({
                          ...userSettings,
                          notifications: { ...userSettings.notifications, dashboard: checked }
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Report Notifications</Label>
                      <p className="text-sm text-muted-foreground">Automatic report generation alerts</p>
                    </div>
                    <Switch
                      checked={userSettings.notifications.reports}
                      onCheckedChange={(checked) => 
                        setUserSettings({
                          ...userSettings,
                          notifications: { ...userSettings.notifications, reports: checked }
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveUser} className="w-full">
                <User className="h-4 w-4 mr-2" />
                Save User Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                System Configuration
              </CardTitle>
              <CardDescription>
                Configure system defaults and business rules
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
                  <Input
                    id="invoicePrefix"
                    value={systemSettings.invoicePrefix}
                    onChange={(e) => setSystemSettings({ ...systemSettings, invoicePrefix: e.target.value })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="quotationPrefix">Quotation Prefix</Label>
                  <Input
                    id="quotationPrefix"
                    value={systemSettings.quotationPrefix}
                    onChange={(e) => setSystemSettings({ ...systemSettings, quotationPrefix: e.target.value })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="receiptPrefix">Receipt Prefix</Label>
                  <Input
                    id="receiptPrefix"
                    value={systemSettings.receiptPrefix}
                    onChange={(e) => setSystemSettings({ ...systemSettings, receiptPrefix: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="defaultTax">Default Tax Rate (%)</Label>
                  <Input
                    id="defaultTax"
                    type="number"
                    value={systemSettings.defaultTax}
                    onChange={(e) => setSystemSettings({ ...systemSettings, defaultTax: e.target.value })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="dataRetention">Data Retention (Months)</Label>
                  <Input
                    id="dataRetention"
                    type="number"
                    value={systemSettings.dataRetention}
                    onChange={(e) => setSystemSettings({ ...systemSettings, dataRetention: e.target.value })}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Backup & Data Management</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Automatic Backup</Label>
                    <p className="text-sm text-muted-foreground">Enable automatic data backups</p>
                  </div>
                  <Switch
                    checked={systemSettings.autoBackup}
                    onCheckedChange={(checked) => 
                      setSystemSettings({ ...systemSettings, autoBackup: checked })
                    }
                  />
                </div>

                <div className="grid gap-4">
                  <Button onClick={handleBackupData} variant="outline" className="w-full">
                    <Database className="h-4 w-4 mr-2" />
                    Create Manual Backup
                  </Button>
                  
                  <Button onClick={handleExportData} variant="outline" className="w-full">
                    <Database className="h-4 w-4 mr-2" />
                    Export All Data (CSV)
                  </Button>
                </div>
              </div>

              <Button onClick={handleSaveSystem} className="w-full">
                <SettingsIcon className="h-4 w-4 mr-2" />
                Save System Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Security & Access Control
              </CardTitle>
              <CardDescription>
                Manage security settings and user access permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Change Password</h3>
                  <div className="space-y-3">
                    <div className="grid gap-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                    <Button className="w-full">
                      <Lock className="h-4 w-4 mr-2" />
                      Update Password
                    </Button>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Session Management</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Auto-logout Time</p>
                        <p className="text-sm text-muted-foreground">Automatic logout after inactivity</p>
                      </div>
                      <div className="w-32">
                        <Input defaultValue="30" />
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      <Lock className="h-4 w-4 mr-2" />
                      End All Other Sessions
                    </Button>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Access Logs</h3>
                  <p className="text-sm text-muted-foreground mb-3">Recent login activities</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span>Login from Nairobi, Kenya</span>
                      <span className="text-muted-foreground">Today, 9:30 AM</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Login from Nairobi, Kenya</span>
                      <span className="text-muted-foreground">Yesterday, 2:15 PM</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Login from Nairobi, Kenya</span>
                      <span className="text-muted-foreground">Jan 14, 8:45 AM</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;