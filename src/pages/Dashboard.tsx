import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, Package, Receipt, DollarSign } from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "Today's Sales",
      value: "KES 45,320",
      change: "+12.5%",
      trend: "up" as const,
      icon: DollarSign,
      description: "vs yesterday"
    },
    {
      title: "Monthly Revenue", 
      value: "KES 890,450",
      change: "+8.2%",
      trend: "up" as const,
      icon: TrendingUp,
      description: "vs last month"
    },
    {
      title: "Active Clients",
      value: "156",
      change: "+5.1%",
      trend: "up" as const,
      icon: Users,
      description: "this month"
    },
    {
      title: "Pending Orders",
      value: "23",
      change: "-2.3%",
      trend: "down" as const,
      icon: Package,
      description: "orders pending"
    }
  ];

  const recentTransactions = [
    { id: "1", client: "Safaricom Ltd", amount: "KES 12,500", type: "Business Cards", status: "completed" },
    { id: "2", client: "Equity Bank", amount: "KES 8,750", type: "Branding Package", status: "pending" },
    { id: "3", client: "Kenya Power", amount: "KES 15,200", type: "Banner Printing", status: "completed" },
    { id: "4", client: "Nakumatt Holdings", amount: "KES 6,800", type: "Flyer Design", status: "in-progress" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to KB Digital Agency POS System - Monitor your business performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="shadow-card hover:shadow-hover transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs flex items-center ${
                  stat.trend === 'up' ? 'text-success' : 'text-destructive'
                }`}>
                  {stat.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {stat.change} {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Transactions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest sales and orders from your clients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{transaction.client}</p>
                    <p className="text-sm text-muted-foreground">{transaction.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{transaction.amount}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      transaction.status === 'completed' ? 'bg-success/20 text-success' :
                      transaction.status === 'pending' ? 'bg-warning/20 text-warning' :
                      'bg-primary/20 text-primary'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used actions for daily operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-primary/10 rounded-lg text-center hover:bg-primary/20 transition-colors cursor-pointer">
                <Receipt className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">New Sale</p>
              </div>
              <div className="p-4 bg-primary/10 rounded-lg text-center hover:bg-primary/20 transition-colors cursor-pointer">
                <Users className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">Add Client</p>
              </div>
              <div className="p-4 bg-primary/10 rounded-lg text-center hover:bg-primary/20 transition-colors cursor-pointer">
                <Package className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">New Quotation</p>
              </div>
              <div className="p-4 bg-primary/10 rounded-lg text-center hover:bg-primary/20 transition-colors cursor-pointer">
                <DollarSign className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">Add Expense</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;