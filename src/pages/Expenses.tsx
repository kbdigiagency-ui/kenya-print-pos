import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus, CreditCard, Search, TrendingDown, Calendar, Eye, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Expense {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  supplier?: string;
  paymentMethod: string;
}

const expenseCategories = [
  "Printing Materials",
  "Ink & Toner", 
  "Paper & Substrates",
  "Equipment Maintenance",
  "Rent & Utilities",
  "Salaries & Wages",
  "Marketing & Advertising",
  "Transport & Delivery",
  "Office Supplies",
  "Professional Services",
  "Other"
];

const Expenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: "E001", date: "2024-01-15", category: "Ink & Toner", description: "Canon ink cartridges", amount: 4500, supplier: "Art Supplies Kenya", paymentMethod: "M-Pesa" },
    { id: "E002", date: "2024-01-15", category: "Paper & Substrates", description: "A4 paper (10 reams)", amount: 2800, supplier: "Stationers Ltd", paymentMethod: "Cash" },
    { id: "E003", date: "2024-01-14", category: "Rent & Utilities", description: "Office rent - January", amount: 35000, paymentMethod: "Bank Transfer" },
    { id: "E004", date: "2024-01-14", category: "Equipment Maintenance", description: "Printer servicing", amount: 6000, supplier: "Tech Solutions", paymentMethod: "Cash" },
    { id: "E005", date: "2024-01-13", category: "Transport & Delivery", description: "Client delivery - Westlands", amount: 800, paymentMethod: "Cash" },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newExpense, setNewExpense] = useState({
    category: "",
    description: "",
    amount: "",
    supplier: "",
    paymentMethod: "",
  });

  const { toast } = useToast();

  const filteredExpenses = expenses.filter(expense =>
    expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.supplier?.toLowerCase().includes(searchTerm.toLowerCase() || "")
  );

  const handleAddExpense = () => {
    if (!newExpense.category || !newExpense.description || !newExpense.amount || !newExpense.paymentMethod) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const expense: Expense = {
      id: `E${String(expenses.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      category: newExpense.category,
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      supplier: newExpense.supplier || undefined,
      paymentMethod: newExpense.paymentMethod,
    };

    setExpenses([expense, ...expenses]);
    setNewExpense({ category: "", description: "", amount: "", supplier: "", paymentMethod: "" });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Expense Added",
      description: `New expense recorded: ${newExpense.description}`,
    });
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const todayExpenses = expenses.filter(expense => expense.date === new Date().toISOString().split('T')[0])
    .reduce((sum, expense) => sum + expense.amount, 0);

  // Group expenses by category for summary
  const expensesByCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Expenses Management</h1>
          <p className="text-muted-foreground">
            Track operational expenses, supplier payments, and business costs
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Record New Expense</DialogTitle>
              <DialogDescription>
                Add a new business expense or supplier payment
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={newExpense.category} onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select expense category" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description *</Label>
                <Input
                  id="description"
                  placeholder="e.g., Canon ink cartridges, Office rent, Equipment repair"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount (KES) *</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="supplier">Supplier (Optional)</Label>
                <Input
                  id="supplier"
                  placeholder="e.g., Art Supplies Kenya, Stationers Ltd"
                  value={newExpense.supplier}
                  onChange={(e) => setNewExpense({ ...newExpense, supplier: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="paymentMethod">Payment Method *</Label>
                <Select value={newExpense.paymentMethod} onValueChange={(value) => setNewExpense({ ...newExpense, paymentMethod: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="M-Pesa">M-Pesa</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="Cheque">Cheque</SelectItem>
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddExpense}>
                <CreditCard className="h-4 w-4 mr-2" />
                Record Expense
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-expense">KES {totalExpenses.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Today's Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">KES {todayExpenses.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{expenses.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Category Summary & Expenses Table */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Category Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Categories</CardTitle>
            <CardDescription>Breakdown by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(expensesByCategory)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 6)
                .map(([category, amount]) => (
                  <div key={category} className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{category}</span>
                    <span className="font-medium">KES {amount.toLocaleString()}</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Expenses Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Expense Records</CardTitle>
                <CardDescription>View and manage all business expenses</CardDescription>
              </div>
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search expenses..."
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
                   <TableHead>Date</TableHead>
                   <TableHead>Category</TableHead>
                   <TableHead>Description</TableHead>
                   <TableHead>Supplier</TableHead>
                   <TableHead>Amount (KES)</TableHead>
                   <TableHead>Payment</TableHead>
                   <TableHead>Actions</TableHead>
                 </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{expense.date}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-muted rounded-full text-xs">
                        {expense.category}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">{expense.description}</TableCell>
                    <TableCell>{expense.supplier || "-"}</TableCell>
                    <TableCell className="font-bold text-expense">KES {expense.amount.toLocaleString()}</TableCell>
                   <TableCell>
                     <span className="text-sm text-muted-foreground">{expense.paymentMethod}</span>
                   </TableCell>
                   <TableCell>
                     <div className="flex items-center gap-2">
                       <Button 
                         variant="ghost" 
                         size="sm"
                         onClick={() => {
                           toast({
                             title: "Expense Details",
                             description: `Viewing details for expense ${expense.id}`,
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
                             title: "Edit Expense",
                             description: `Edit functionality for expense ${expense.id} - Feature coming soon`,
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
                           setExpenses(expenses.filter(e => e.id !== expense.id));
                           toast({
                             title: "Expense Deleted",
                             description: `Expense ${expense.id} has been deleted successfully`,
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
    </div>
  );
};

export default Expenses;