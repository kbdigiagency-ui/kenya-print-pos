import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FileText, Eye, Download, Send, Search, Calculator, Receipt, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Document {
  id: string;
  type: "quotation" | "invoice" | "receipt";
  clientName: string;
  clientEmail: string;
  date: string;
  dueDate?: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  notes?: string;
}

const Invoices = () => {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "Q001",
      type: "quotation",
      clientName: "Safaricom Ltd",
      clientEmail: "procurement@safaricom.co.ke",
      date: "2024-01-15",
      items: [
        { description: "Business Card Design & Print (1000 pcs)", quantity: 1, rate: 8500, amount: 8500 },
        { description: "Letterhead Design & Print (500 pcs)", quantity: 1, rate: 4000, amount: 4000 }
      ],
      subtotal: 12500,
      tax: 2000,
      total: 14500,
      status: "sent",
      notes: "Premium business cards with embossing"
    },
    {
      id: "INV001",
      type: "invoice", 
      clientName: "Equity Bank",
      clientEmail: "finance@equity.co.ke",
      date: "2024-01-14",
      dueDate: "2024-01-28",
      items: [
        { description: "Complete Branding Package", quantity: 1, rate: 25000, amount: 25000 }
      ],
      subtotal: 25000,
      tax: 4000,
      total: 29000,
      status: "sent"
    },
    {
      id: "REC001",
      type: "receipt",
      clientName: "Kenya Power",
      clientEmail: "payments@kenyapower.co.ke", 
      date: "2024-01-13",
      items: [
        { description: "Banner Printing (5m x 2m)", quantity: 2, rate: 7600, amount: 15200 }
      ],
      subtotal: 15200,
      tax: 2432,
      total: 17632,
      status: "paid"
    }
  ]);

  const [activeTab, setActiveTab] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newDocument, setNewDocument] = useState({
    type: "quotation" as "quotation" | "invoice" | "receipt",
    clientName: "",
    clientEmail: "",
    items: [{ description: "", quantity: 1, rate: 0, amount: 0 }] as InvoiceItem[],
    notes: "",
  });

  const { toast } = useToast();

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.clientEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab = 
      activeTab === "all" ||
      (activeTab === "quotations" && doc.type === "quotation") ||
      (activeTab === "invoices" && doc.type === "invoice") ||
      (activeTab === "receipts" && doc.type === "receipt");

    return matchesSearch && matchesTab;
  });

  const calculateItemAmount = (quantity: number, rate: number) => quantity * rate;

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const updatedItems = [...newDocument.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    if (field === 'quantity' || field === 'rate') {
      updatedItems[index].amount = calculateItemAmount(
        updatedItems[index].quantity, 
        updatedItems[index].rate
      );
    }
    
    setNewDocument({ ...newDocument, items: updatedItems });
  };

  const addItem = () => {
    setNewDocument({
      ...newDocument,
      items: [...newDocument.items, { description: "", quantity: 1, rate: 0, amount: 0 }]
    });
  };

  const removeItem = (index: number) => {
    const updatedItems = newDocument.items.filter((_, i) => i !== index);
    setNewDocument({ ...newDocument, items: updatedItems });
  };

  const calculateTotals = () => {
    const subtotal = newDocument.items.reduce((sum, item) => sum + item.amount, 0);
    const tax = subtotal * 0.16; // 16% VAT
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const handleCreateDocument = () => {
    if (!newDocument.clientName || !newDocument.clientEmail || newDocument.items.some(item => !item.description || item.rate <= 0)) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const { subtotal, tax, total } = calculateTotals();
    const idPrefix = newDocument.type === "quotation" ? "Q" : newDocument.type === "invoice" ? "INV" : "REC";
    const nextId = documents.filter(d => d.type === newDocument.type).length + 1;

    const document: Document = {
      id: `${idPrefix}${String(nextId).padStart(3, '0')}`,
      type: newDocument.type,
      clientName: newDocument.clientName,
      clientEmail: newDocument.clientEmail,
      date: new Date().toISOString().split('T')[0],
      dueDate: newDocument.type === "invoice" ? 
        new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
      items: [...newDocument.items],
      subtotal,
      tax,
      total,
      status: "draft",
      notes: newDocument.notes
    };

    setDocuments([document, ...documents]);
    setNewDocument({
      type: "quotation",
      clientName: "",
      clientEmail: "",
      items: [{ description: "", quantity: 1, rate: 0, amount: 0 }],
      notes: "",
    });
    setIsCreateDialogOpen(false);
    
    toast({
      title: `${newDocument.type.charAt(0).toUpperCase() + newDocument.type.slice(1)} Created`,
      description: `${document.id} has been created successfully`,
    });
  };

  const convertDocument = (doc: Document, targetType: "invoice" | "receipt") => {
    const idPrefix = targetType === "invoice" ? "INV" : "REC";
    const nextId = documents.filter(d => d.type === targetType).length + 1;

    const newDoc: Document = {
      ...doc,
      id: `${idPrefix}${String(nextId).padStart(3, '0')}`,
      type: targetType,
      date: new Date().toISOString().split('T')[0],
      dueDate: targetType === "invoice" ? 
        new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
      status: targetType === "receipt" ? "paid" : "draft"
    };

    setDocuments([newDoc, ...documents]);
    
    toast({
      title: `Converted to ${targetType.charAt(0).toUpperCase() + targetType.slice(1)}`,
      description: `${newDoc.id} has been created from ${doc.id}`,
    });
  };

  const quotations = documents.filter(d => d.type === "quotation").length;
  const invoices = documents.filter(d => d.type === "invoice").length;
  const receipts = documents.filter(d => d.type === "receipt").length;
  const totalValue = documents.reduce((sum, doc) => sum + doc.total, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Invoices & Quotations</h1>
          <p className="text-muted-foreground">
            Create and manage quotations, invoices, and receipts for your clients
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Document
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Document</DialogTitle>
              <DialogDescription>
                Create a quotation, invoice, or receipt for your client
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-6 py-4">
              {/* Document Type & Client Info */}
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="type">Document Type</Label>
                  <Select value={newDocument.type} onValueChange={(value: "quotation" | "invoice" | "receipt") => setNewDocument({ ...newDocument, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quotation">Quotation</SelectItem>
                      <SelectItem value="invoice">Invoice</SelectItem>
                      <SelectItem value="receipt">Receipt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="clientName">Client Name *</Label>
                  <Input
                    id="clientName"
                    placeholder="Client or company name"
                    value={newDocument.clientName}
                    onChange={(e) => setNewDocument({ ...newDocument, clientName: e.target.value })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="clientEmail">Client Email *</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    placeholder="client@email.com"
                    value={newDocument.clientEmail}
                    onChange={(e) => setNewDocument({ ...newDocument, clientEmail: e.target.value })}
                  />
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Items/Services</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addItem}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-2/5">Description</TableHead>
                        <TableHead className="w-20">Qty</TableHead>
                        <TableHead className="w-32">Rate (KES)</TableHead>
                        <TableHead className="w-32">Amount (KES)</TableHead>
                        <TableHead className="w-20">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {newDocument.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Input
                              placeholder="Item description"
                              value={item.description}
                              onChange={(e) => updateItem(index, 'description', e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.rate}
                              onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">KES {item.amount.toLocaleString()}</div>
                          </TableCell>
                          <TableCell>
                            {newDocument.items.length > 1 && (
                              <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(index)}>
                                ✕
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Totals */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="space-y-2 max-w-sm ml-auto">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>KES {calculateTotals().subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>VAT (16%):</span>
                      <span>KES {calculateTotals().tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span>KES {calculateTotals().total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes or terms..."
                  value={newDocument.notes}
                  onChange={(e) => setNewDocument({ ...newDocument, notes: e.target.value })}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateDocument}>
                <FileText className="h-4 w-4 mr-2" />
                Create {newDocument.type.charAt(0).toUpperCase() + newDocument.type.slice(1)}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Quotations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{quotations}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{invoices}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Receipts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{receipts}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-business">KES {totalValue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Document Management</CardTitle>
              <CardDescription>View and manage all quotations, invoices, and receipts</CardDescription>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search documents..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Documents</TabsTrigger>
              <TabsTrigger value="quotations">Quotations</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
              <TabsTrigger value="receipts">Receipts</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-mono font-medium">{doc.id}</TableCell>
                      <TableCell>
                        <Badge variant={
                          doc.type === "quotation" ? "default" :
                          doc.type === "invoice" ? "secondary" : "outline"
                        }>
                          {doc.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{doc.clientName}</TableCell>
                      <TableCell>{doc.date}</TableCell>
                      <TableCell className="font-bold">KES {doc.total.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={
                          doc.status === "paid" ? "default" :
                          doc.status === "sent" ? "secondary" :
                          doc.status === "overdue" ? "destructive" : "outline"
                        }>
                          {doc.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Send className="h-4 w-4" />
                          </Button>
                          {doc.type === "quotation" && (
                            <Button variant="ghost" size="sm" onClick={() => convertDocument(doc, "invoice")}>
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          )}
                          {doc.type === "invoice" && (
                            <Button variant="ghost" size="sm" onClick={() => convertDocument(doc, "receipt")}>
                              <Receipt className="h-4 w-4" />
                            </Button>
                          )}
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

export default Invoices;