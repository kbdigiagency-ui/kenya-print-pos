import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Truck, Eye, Edit, Trash2, Search, Phone, Mail, Package, AlertCircle, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { exportToCSV } from "@/utils/fileExport";

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  paymentTerms: string;
  totalPaid: number;
  outstanding: number;
  lastPayment?: string;
  status: "active" | "inactive";
}

const supplierCategories = [
  "Printing Materials",
  "Ink & Toner Suppliers",
  "Paper & Media",
  "Equipment Suppliers",
  "Art & Design Materials",
  "Packaging Materials",
  "Office Supplies",
  "Software & Licenses",
  "Other"
];

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    try {
      const stored = localStorage.getItem('app_suppliers');
      if (stored) return JSON.parse(stored) as Supplier[];
    } catch {}
    return [
      {
        id: "SUP001",
        name: "Art Supplies Kenya Ltd",
        contactPerson: "David Maina",
        email: "david@artsupplies.co.ke",
        phone: "+254722555666",
        address: "Industrial Area, Nairobi",
        category: "Ink & Toner Suppliers",
        paymentTerms: "Net 30",
        totalPaid: 125000,
        outstanding: 15000,
        lastPayment: "2024-01-10",
        status: "active"
      },
      {
        id: "SUP002", 
        name: "Nairobi Stationers Ltd",
        contactPerson: "Jane Wambui",
        email: "j.wambui@stationers.co.ke",
        phone: "+254733444555",
        address: "CBD, Nairobi",
        category: "Paper & Media",
        paymentTerms: "Net 15",
        totalPaid: 87500,
        outstanding: 8750,
        lastPayment: "2024-01-12",
        status: "active"
      },
      {
        id: "SUP003",
        name: "Digital Print Solutions",
        contactPerson: "Michael Ochieng",
        email: "m.ochieng@digitalsolutions.co.ke", 
        phone: "+254711222333",
        address: "Westlands, Nairobi",
        category: "Equipment Suppliers",
        paymentTerms: "Net 45",
        totalPaid: 350000,
        outstanding: 25000,
        lastPayment: "2024-01-08",
        status: "active"
      },
      {
        id: "SUP004",
        name: "Creative Arts Suppliers",
        contactPerson: "Sarah Njeri",
        email: "sarah@creative-arts.co.ke",
        phone: "+254799111222", 
        address: "Kilimani, Nairobi",
        category: "Art & Design Materials",
        paymentTerms: "Net 30",
        totalPaid: 45600,
        outstanding: 0,
        lastPayment: "2024-01-15",
        status: "active"
      }
    ];
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    category: "",
    paymentTerms: "",
    notes: "",
  });

  const { toast } = useToast();

  // Persist suppliers to localStorage
  useEffect(() => {
    localStorage.setItem('app_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSupplier = () => {
    if (!newSupplier.name || !newSupplier.contactPerson || !newSupplier.email || !newSupplier.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const supplier: Supplier = {
      id: `SUP${String(suppliers.length + 1).padStart(3, '0')}`,
      name: newSupplier.name,
      contactPerson: newSupplier.contactPerson,
      email: newSupplier.email,
      phone: newSupplier.phone,
      address: newSupplier.address,
      category: newSupplier.category,
      paymentTerms: newSupplier.paymentTerms,
      totalPaid: 0,
      outstanding: 0,
      status: "active",
    };

    setSuppliers([supplier, ...suppliers]);
    setNewSupplier({ name: "", contactPerson: "", email: "", phone: "", address: "", category: "", paymentTerms: "", notes: "" });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Supplier Added",
      description: `${newSupplier.name} has been added to your supplier database`,
    });
  };

  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter(s => s.status === "active").length;
  const totalOutstanding = suppliers.reduce((sum, supplier) => sum + supplier.outstanding, 0);
  const totalPaid = suppliers.reduce((sum, supplier) => sum + supplier.totalPaid, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Supplier Management</h1>
          <p className="text-muted-foreground">
            Manage art suppliers, track payments, and maintain supplier relationships
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Supplier
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Add New Supplier</DialogTitle>
              <DialogDescription>
                Create a new supplier profile for art materials and printing supplies
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Company Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter supplier company name"
                  value={newSupplier.name}
                  onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="contactPerson">Contact Person *</Label>
                  <Input
                    id="contactPerson"
                    placeholder="Primary contact name"
                    value={newSupplier.contactPerson}
                    onChange={(e) => setNewSupplier({ ...newSupplier, contactPerson: e.target.value })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={newSupplier.category} onValueChange={(value) => setNewSupplier({ ...newSupplier, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {supplierCategories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="supplier@email.com"
                    value={newSupplier.email}
                    onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    placeholder="+254xxxxxxxxx"
                    value={newSupplier.phone}
                    onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  placeholder="Physical address or location"
                  value={newSupplier.address}
                  onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="paymentTerms">Payment Terms</Label>
                <Select value={newSupplier.paymentTerms} onValueChange={(value) => setNewSupplier({ ...newSupplier, paymentTerms: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment terms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash on Delivery">Cash on Delivery</SelectItem>
                    <SelectItem value="Net 15">Net 15 Days</SelectItem>
                    <SelectItem value="Net 30">Net 30 Days</SelectItem>
                    <SelectItem value="Net 45">Net 45 Days</SelectItem>
                    <SelectItem value="Net 60">Net 60 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddSupplier}>
                <Truck className="h-4 w-4 mr-2" />
                Add Supplier
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Suppliers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalSuppliers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Suppliers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{activeSuppliers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Outstanding Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">KES {totalOutstanding.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-expense">KES {totalPaid.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Suppliers Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Supplier Database</CardTitle>
              <CardDescription>Manage supplier information and track payment history</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search suppliers..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  try {
                    const csvData = suppliers.map((s) => ({
                      ID: s.id,
                      Name: s.name,
                      Contact: s.contactPerson,
                      Email: s.email,
                      Phone: s.phone,
                      Address: s.address,
                      Category: s.category,
                      PaymentTerms: s.paymentTerms,
                      TotalPaid: s.totalPaid,
                      Outstanding: s.outstanding,
                      Status: s.status,
                    }));
                    exportToCSV(csvData, `suppliers-${new Date().toISOString().split('T')[0]}`);
                    toast({
                      title: "Export Complete",
                      description: `Exported ${suppliers.length} suppliers to CSV`,
                    });
                  } catch (error) {
                    toast({
                      title: "Export Failed",
                      description: "Failed to export suppliers.",
                      variant: "destructive",
                    });
                  }
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Payment Terms</TableHead>
                <TableHead>Total Paid</TableHead>
                <TableHead>Outstanding</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Truck className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{supplier.name}</div>
                        <p className="text-sm text-muted-foreground">{supplier.contactPerson}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3 w-3" />
                        {supplier.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3 w-3" />
                        {supplier.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {supplier.category}
                    </Badge>
                  </TableCell>
                  <TableCell>{supplier.paymentTerms}</TableCell>
                  <TableCell className="font-medium">KES {supplier.totalPaid.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {supplier.outstanding > 0 && (
                        <AlertCircle className="h-4 w-4 text-warning" />
                      )}
                      <span className={supplier.outstanding > 0 ? "text-warning font-medium" : "text-muted-foreground"}>
                        KES {supplier.outstanding.toLocaleString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={supplier.status === "active" ? "default" : "secondary"}>
                      {supplier.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "Supplier Details",
                            description: `Viewing full profile for ${supplier.name}`,
                          });
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "Edit Supplier",
                            description: `Edit functionality for ${supplier.name} - Feature coming soon`,
                          });
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          setSuppliers(suppliers.filter(s => s.id !== supplier.id));
                          toast({
                            title: "Supplier Deleted",
                            description: `${supplier.name} has been removed from your supplier database`,
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

export default Suppliers;