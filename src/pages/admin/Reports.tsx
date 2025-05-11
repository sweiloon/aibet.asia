
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWebsites } from "@/context/WebsiteContext";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AdminReports() {
  const { getAllWebsites } = useWebsites();
  const websites = getAllWebsites();
  
  const [timeRange, setTimeRange] = useState("30d");
  
  // Generate some dummy data for charts
  const getTaskCompletionData = () => {
    const data = [];
    const now = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      data.unshift({
        date: dateStr,
        completed: Math.floor(Math.random() * 15) + 5,
        total: Math.floor(Math.random() * 10) + 20,
      });
    }
    
    return data;
  };
  
  const getWebsiteStatusData = () => {
    return [
      { name: 'Pending', value: websites.filter(site => site.status === 'pending').length },
      { name: 'Approved', value: websites.filter(site => site.status === 'approved').length },
      { name: 'Rejected', value: websites.filter(site => site.status === 'rejected').length },
    ];
  };
  
  const taskCompletionData = getTaskCompletionData();
  const websiteStatusData = getWebsiteStatusData();
  
  return (
    <DashboardLayout isAdmin>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Reports</h1>
            <p className="text-muted-foreground">Analysis and insights for website management</p>
          </div>
          
          <div className="flex items-center">
            <Select
              value={timeRange}
              onValueChange={setTimeRange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle>Task Completion Rate</CardTitle>
              <CardDescription>
                Daily tasks completed vs. total tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={taskCompletionData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="completed" stroke="#8884d8" name="Completed Tasks" />
                    <Line type="monotone" dataKey="total" stroke="#82ca9d" name="Total Tasks" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle>Website Status Distribution</CardTitle>
              <CardDescription>
                Number of websites by approval status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={websiteStatusData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" name="Websites" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="glass-morphism">
          <CardHeader>
            <CardTitle>Website Management Performance</CardTitle>
            <CardDescription>
              Overview of website management activity and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-primary/10 rounded-lg text-center">
                <div className="text-3xl font-bold">{websites.length}</div>
                <div className="text-sm text-muted-foreground">Total Websites</div>
              </div>
              
              <div className="p-4 bg-green-500/10 rounded-lg text-center">
                <div className="text-3xl font-bold text-green-400">
                  {Math.floor(Math.random() * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">Task Completion</div>
              </div>
              
              <div className="p-4 bg-blue-500/10 rounded-lg text-center">
                <div className="text-3xl font-bold text-blue-400">
                  {Math.floor(Math.random() * 10) + 1}
                </div>
                <div className="text-sm text-muted-foreground">Avg Response Time (h)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
