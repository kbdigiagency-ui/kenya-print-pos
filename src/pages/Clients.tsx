import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Users, Eye, Edit, Trash2, Search, Phone, Mail, Building, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Client {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  address?: string;
  type: "individual" | "corporate";
  totalSpent: number;
  ordersCount: number;
  lastOrder?: string;
  isVip: boolean;
}

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([
    { 
      id: "C001", 
      name: "John Kamau", 
      company: "Safaricom Ltd", 
      email: "j.kamau@safaricom.co.ke", 
      phone: "+254722123456", 
      address: "Westlands, Nairobi",
      type: "corporate", 
      totalSpent: 125000, 
      ordersCount: 12, 
      lastOrder: "2024-01-15",
      isVip: true 
    },
    { 
      id: "C002", 
      name: "Mary Wanjiku", 
      company: "Equity Bank", 
      email: "m.wanjiku@equity.co.ke", 
      phone: "+254733456789", 
      address: "Upper Hill, Nairobi",
      type: "corporate", 
      totalSpent: 87500, 
      ordersCount: 8, 
      lastOrder: "2024-01-14",
      isVip: true 
    },
    { 
      id: "C003", 
      name: "Peter Ochieng", 
      email: "peter@email.com", 
      phone: "+254711234567", 
      type: "individual", 
      totalSpent: 15600, 
      ordersCount: 4, 
      lastOrder: "2024-01-13",
      isVip: false 
    },
    { 
      id: "C004", 
      name: "Grace Muthoni", 
      company: "KCB Bank", 
      email: "g.muthoni@kcb.co.ke", 
      phone: "+254799887766", 
      address: "CBD, Nairobi",
      type: "corporate", 
      totalSpent: 95000, 
      ordersCount: 10, 
      lastOrder: "2024-01-12",
      isVip: true 
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [newClient, setNewClient] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    address: "",
    type: "individual" as "individual" | "corporate",
    notes: "",
  });

  const { toast } = useToast();

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm) ||
      (client.company && client.company.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesTab = 
      activeTab === "all" ||
      (activeTab === "corporate" && client.type === "corporate") ||
      (activeTab === "individual" && client.type === "individual") ||
      (activeTab === "vip" && client.isVip);

    return matchesSearch && matchesTab;
  });

  const handleAddClient = () => {
    if (!newClient.name || !newClient.email || !newClient.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in name, email, and phone number",
        variant: "destructive",
      });
      return;
    }

    const client: Client = {
      id: `C${String(clients.length + 1).padStart(3, '0')}`,
      name: newClient.name,
      company: newClient.company || undefined,
      email: newClient.email,
      phone: newClient.phone,
      address: newClient.address || undefined,
      type: newClient.type,
      totalSpent: 0,
      ordersCount: 0,
      isVip: false,
    };

    setClients([client, ...clients]);
    setNewClient({ name: "", company: "", email: "", phone: "", address: "", type: "individual", notes: "" });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Client Added",
      description: `${newClient.name} has been added to your client database`,
    });
  };

  const totalClients = clients.length;
  const corporateClients = clients.filter(c => c.type === "corporate").length;
  const vipClients = clients.filter(c => c.isVip).length;
  const totalRevenue = clients.reduce((sum, client) => sum + client.totalSpent, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Client Management</h1>
          <p className="text-muted-foreground">
            Manage client information, track order history, and maintain relationships
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
              <DialogDescription>
                Create a new client profile for your business
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter client's full name"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="company">Company (Optional)</Label>
                <Input
                  id="company"
                  placeholder="Company or organization name"
                  value={newClient.company}
                  onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="client@email.com"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    placeholder="+254xxxxxxxxx"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="address">Address (Optional)</Label>
                <Textarea
                  id="address"
                  placeholder="Physical address or location"
                  value={newClient.address}
                  onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label>Client Type</Label>
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value="individual"
                      checked={newClient.type === "individual"}
                      onChange={(e) => setNewClient({ ...newClient, type: e.target.value as "individual" | "corporate" })}
                    />
                    <span>Individual</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value="corporate"
                      checked={newClient.type === "corporate"}
                      onChange={(e) => setNewClient({ ...newClient, type: e.target.value as "individual" | "corporate" })}
                    />
                    <span>Corporate</span>
                  </label>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddClient}>
                <Users className="h-4 w-4 mr-2" />
                Add Client
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalClients}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Corporate Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-business">{corporateClients}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">VIP Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{vipClients}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">KES {totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Client Database</CardTitle>
              <CardDescription>Manage client information and track business relationships</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search clients..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Clients</TabsTrigger>
              <TabsTrigger value="corporate">Corporate</TabsTrigger>
              <TabsTrigger value="individual">Individual</TabsTrigger>
              <TabsTrigger value="vip">VIP</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Last Order</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-2 rounded-full">
                            {client.type === "corporate" ? (
                              <Building className="h-4 w-4 text-primary" />
                            ) : (
                              <Users className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{client.name}</span>
                              {client.isVip && <Star className="h-3 w-3 text-warning fill-current" />}
                            </div>
                            {client.company && (
                              <p className="text-sm text-muted-foreground">{client.company}</p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-3 w-3" />
                            {client.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-3 w-3" />
                            {client.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={client.type === "corporate" ? "default" : "secondary"}>
                          {client.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{client.ordersCount}</TableCell>
                      <TableCell className="font-bold text-success">KES {client.totalSpent.toLocaleString()}</TableCell>
                      <TableCell>{client.lastOrder || "No orders"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Clients;