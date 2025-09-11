import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Receipt, Eye, Edit, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Sale {
  id: string;
  date: string;
  client: string;
  items: string;
  amount: number;
  status: "completed" | "pending" | "cancelled";
}

const Sales = () => {
  const [sales, setSales] = useState<Sale[]>([
    { id: "S001", date: "2024-01-15", client: "Safaricom Ltd", items: "Business Cards, Letterheads", amount: 12500, status: "completed" },
    { id: "S002", date: "2024-01-15", client: "Equity Bank", items: "Branding Package", amount: 8750, status: "pending" },
    { id: "S003", date: "2024-01-14", client: "Kenya Power", items: "Banner Printing", amount: 15200, status: "completed" },
    { id: "S004", date: "2024-01-14", client: "Co-op Bank", items: "Flyer Design & Print", amount: 6800, status: "completed" },
    { id: "S005", date: "2024-01-13", client: "KCB Bank", items: "Roll-up Banners", amount: 9500, status: "pending" },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newSale, setNewSale] = useState<{
    client: string;
    items: string;
    amount: string;
    description: string;
    status: "pending" | "completed" | "cancelled";
  }>({
    client: "",
    items: "",
    amount: "",
    description: "",
    status: "pending",
  });

  const { toast } = useToast();

  const filteredSales = sales.filter(sale =>
    sale.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.items.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSale = () => {
    if (!newSale.client || !newSale.items || !newSale.amount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const sale: Sale = {
      id: `S${String(sales.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      client: newSale.client,
      items: newSale.items,
      amount: parseFloat(newSale.amount),
      status: newSale.status,
    };

    setSales([sale, ...sales]);
    setNewSale({ client: "", items: "", amount: "", description: "", status: "pending" });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Sale Added",
      description: `New sale record created for ${newSale.client}`,
    });
  };

  const totalSales = sales.reduce((sum, sale) => sum + (sale.status === "completed" ? sale.amount : 0), 0);
  const pendingSales = sales.filter(sale => sale.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Sales Management</h1>
          <p className="text-muted-foreground">
            Record and track daily sales for branding and printing services
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Sale
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Record New Sale</DialogTitle>
              <DialogDescription>
                Add a new sale transaction for branding or printing services
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="client">Client Name *</Label>
                <Input
                  id="client"
                  placeholder="Enter client name or company"
                  value={newSale.client}
                  onChange={(e) => setNewSale({ ...newSale, client: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="items">Items/Services *</Label>
                <Input
                  id="items"
                  placeholder="e.g., Business Cards, Banner Printing, Branding Package"
                  value={newSale.items}
                  onChange={(e) => setNewSale({ ...newSale, items: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount (KES) *</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={newSale.amount}
                  onChange={(e) => setNewSale({ ...newSale, amount: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={newSale.status} onValueChange={(value) => setNewSale({ ...newSale, status: value as "pending" | "completed" | "cancelled" })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Additional Notes</Label>
                <Textarea
                  id="description"
                  placeholder="Any additional details about this sale..."
                  value={newSale.description}
                  onChange={(e) => setNewSale({ ...newSale, description: e.target.value })}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddSale}>
                <Receipt className="h-4 w-4 mr-2" />
                Add Sale
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Sales (Completed)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">KES {totalSales.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{pendingSales}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{sales.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Sales Records</CardTitle>
              <CardDescription>View and manage all sales transactions</CardDescription>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search sales..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sale ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Items/Services</TableHead>
                <TableHead>Amount (KES)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-mono">{sale.id}</TableCell>
                  <TableCell>{sale.date}</TableCell>
                  <TableCell className="font-medium">{sale.client}</TableCell>
                  <TableCell>{sale.items}</TableCell>
                  <TableCell className="font-bold">KES {sale.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      sale.status === 'completed' ? 'bg-success/20 text-success' :
                      sale.status === 'pending' ? 'bg-warning/20 text-warning' :
                      'bg-destructive/20 text-destructive'
                    }`}>
                      {sale.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "Sale Details",
                            description: `Viewing details for sale ${sale.id}`,
                          });
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {sale.status === "pending" && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            const updatedSales = sales.map(s => 
                              s.id === sale.id ? { ...s, status: "completed" as const } : s
                            );
                            setSales(updatedSales);
                            toast({
                              title: "Sale Completed",
                              description: `Sale ${sale.id} marked as completed`,
                            });
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          setSales(sales.filter(s => s.id !== sale.id));
                          toast({
                            title: "Sale Deleted",
                            description: `Sale ${sale.id} has been deleted successfully`,
                          });
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sales;