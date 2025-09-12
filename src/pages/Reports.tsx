import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { TrendingUp, TrendingDown, Download, Calendar, DollarSign, Users, Package, FileText, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { exportToCSV, exportToPDF, generateReportPDF } from "@/utils/fileExport";

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const { toast } = useToast();

  // Sample data for charts
  const salesData = [
    { month: "Jan", sales: 45000, expenses: 32000, profit: 13000 },
    { month: "Feb", sales: 52000, expenses: 35000, profit: 17000 },
    { month: "Mar", sales: 48000, expenses: 30000, profit: 18000 },
    { month: "Apr", sales: 61000, expenses: 40000, profit: 21000 },
    { month: "May", sales: 55000, expenses: 38000, profit: 17000 },
    { month: "Jun", sales: 67000, expenses: 42000, profit: 25000 },
  ];

  const expenseCategories = [
    { name: "Printing Materials", value: 125000, color: "#3B82F6" },
    { name: "Salaries & Wages", value: 95000, color: "#10B981" },
    { name: "Rent & Utilities", value: 65000, color: "#F59E0B" },
    { name: "Equipment", value: 45000, color: "#EF4444" },
    { name: "Marketing", value: 25000, color: "#8B5CF6" },
    { name: "Other", value: 15000, color: "#6B7280" },
  ];

  const clientPerformance = [
    { client: "Safaricom Ltd", orders: 12, revenue: 125000, growth: "+15%" },
    { client: "Equity Bank", orders: 8, revenue: 87500, growth: "+8%" },
    { client: "KCB Bank", orders: 10, revenue: 95000, growth: "+12%" },
    { client: "Kenya Power", orders: 6, revenue: 68000, growth: "-3%" },
    { client: "Co-op Bank", orders: 5, revenue: 45000, growth: "+22%" },
  ];

  const productPerformance = [
    { product: "Business Cards", sales: 45, revenue: 180000, margin: "65%" },
    { product: "Branding Packages", sales: 23, revenue: 345000, margin: "70%" },
    { product: "Banner Printing", sales: 38, revenue: 228000, margin: "60%" },
    { product: "Flyer Design", sales: 52, revenue: 156000, margin: "75%" },
    { product: "Roll-up Banners", sales: 28, revenue: 168000, margin: "68%" },
  ];

  const dailySales = [
    { day: "Mon", amount: 8500 },
    { day: "Tue", amount: 12300 },
    { day: "Wed", amount: 9800 },
    { day: "Thu", amount: 15600 },
    { day: "Fri", amount: 18200 },
    { day: "Sat", amount: 22100 },
    { day: "Sun", amount: 7400 },
  ];

  const totalSales = salesData.reduce((sum, item) => sum + item.sales, 0);
  const totalExpenses = salesData.reduce((sum, item) => sum + item.expenses, 0);
  const totalProfit = salesData.reduce((sum, item) => sum + item.profit, 0);
  const profitMargin = ((totalProfit / totalSales) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive business insights and financial analytics for KB Digital Agency
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={() => {
            try {
              const reportData = {
                stats: [
                  { title: "Total Revenue", value: `KES ${totalSales.toLocaleString()}`, change: "+12.5%", description: "vs last period", trend: "up" },
                  { title: "Total Expenses", value: `KES ${totalExpenses.toLocaleString()}`, change: "+8.2%", description: "vs last period", trend: "up" },
                  { title: "Net Profit", value: `KES ${totalProfit.toLocaleString()}`, change: "+18.3%", description: "vs last period", trend: "up" },
                  { title: "Profit Margin", value: `${profitMargin}%`, change: "+2.1%", description: "vs last period", trend: "up" }
                ],
                period: selectedPeriod
              };
              
              const pdfContent = generateReportPDF(reportData, "Financial");
              exportToPDF(pdfContent, `KB-Digital-Report-${selectedPeriod}-${new Date().toISOString().split('T')[0]}`);
              
              toast({
                title: "Report Export Complete",
                description: `${selectedPeriod} report has been generated and downloaded.`,
              });
            } catch (error) {
              toast({
                title: "Export Failed",
                description: "Failed to generate report. Please try again.",
                variant: "destructive",
              });
            }
          }}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">KES {totalSales.toLocaleString()}</div>
            <p className="text-xs text-success flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.5% vs last period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-expense">KES {totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-expense flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8.2% vs last period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Net Profit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-profit">KES {totalProfit.toLocaleString()}</div>
            <p className="text-xs text-success flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +18.3% vs last period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Profit Margin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{profitMargin}%</div>
            <p className="text-xs text-success flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +2.1% vs last period
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="financial" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="financial">Financial Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales Analysis</TabsTrigger>
          <TabsTrigger value="clients">Client Performance</TabsTrigger>
          <TabsTrigger value="products">Product Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Sales vs Expenses Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Sales vs Expenses Trend</CardTitle>
                <CardDescription>Monthly comparison of revenue and costs</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `KES ${Number(value).toLocaleString()}`} />
                    <Bar dataKey="sales" fill="#10B981" name="Sales" />
                    <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Profit Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Profit Trend</CardTitle>
                <CardDescription>Monthly profit progression</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `KES ${Number(value).toLocaleString()}`} />
                    <Line type="monotone" dataKey="profit" stroke="#3B82F6" strokeWidth={3} name="Profit" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Expense Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Expense Categories</CardTitle>
                <CardDescription>Breakdown of business expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={expenseCategories}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={(entry) => entry.name}
                    >
                      {expenseCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `KES ${Number(value).toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Financial Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
                <CardDescription>Key financial metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-success/10 rounded-lg">
                    <span className="font-medium">Gross Revenue</span>
                    <span className="font-bold text-success">KES {totalSales.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-expense/10 rounded-lg">
                    <span className="font-medium">Total Expenses</span>
                    <span className="font-bold text-expense">KES {totalExpenses.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                    <span className="font-medium">Net Profit</span>
                    <span className="font-bold text-primary">KES {totalProfit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="font-medium">Profit Margin</span>
                    <span className="font-bold">{profitMargin}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Daily Sales */}
            <Card>
              <CardHeader>
                <CardTitle>Daily Sales Pattern</CardTitle>
                <CardDescription>Sales performance by day of week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dailySales}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip formatter={(value) => `KES ${Number(value).toLocaleString()}`} />
                    <Bar dataKey="amount" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Sales Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Sales Metrics</CardTitle>
                <CardDescription>Key sales performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <DollarSign className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Average Order Value</p>
                        <p className="text-sm text-muted-foreground">Per transaction</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">KES 12,850</p>
                      <p className="text-xs text-success">+8.2%</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-success/10 p-2 rounded-full">
                        <Package className="h-4 w-4 text-success" />
                      </div>
                      <div>
                        <p className="font-medium">Total Orders</p>
                        <p className="text-sm text-muted-foreground">This month</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">156</p>
                      <p className="text-xs text-success">+12.5%</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-warning/10 p-2 rounded-full">
                        <Users className="h-4 w-4 text-warning" />
                      </div>
                      <div>
                        <p className="font-medium">Active Clients</p>
                        <p className="text-sm text-muted-foreground">This month</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">89</p>
                      <p className="text-xs text-success">+15.3%</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-business/10 p-2 rounded-full">
                        <Printer className="h-4 w-4 text-business" />
                      </div>
                      <div>
                        <p className="font-medium">Repeat Clients</p>
                        <p className="text-sm text-muted-foreground">Percentage</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">67%</p>
                      <p className="text-xs text-success">+5.1%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clients" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Clients</CardTitle>
              <CardDescription>Client performance and growth metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clientPerformance.map((client, index) => (
                  <div key={client.client} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <span className="text-sm font-bold text-primary">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{client.client}</p>
                        <p className="text-sm text-muted-foreground">{client.orders} orders</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">KES {client.revenue.toLocaleString()}</p>
                      <Badge variant={client.growth.startsWith('+') ? 'default' : 'destructive'} className="text-xs">
                        {client.growth}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Performance</CardTitle>
              <CardDescription>Sales and profitability by service type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productPerformance.map((product, index) => (
                  <div key={product.product} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="bg-business/10 p-2 rounded-full">
                        <Package className="h-4 w-4 text-business" />
                      </div>
                      <div>
                        <p className="font-medium">{product.product}</p>
                        <p className="text-sm text-muted-foreground">{product.sales} sales</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">KES {product.revenue.toLocaleString()}</p>
                      <Badge variant="secondary" className="text-xs">
                        {product.margin} margin
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;