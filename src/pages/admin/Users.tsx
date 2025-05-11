
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Grid3X3, List } from "lucide-react";

// Mock user data until connected to real data source
const mockUsers = [
  { 
    id: '1', 
    email: 'user1@aibet.asia', 
    role: 'user', 
    createdAt: '2025-04-01T00:00:00Z',
    phone: '+60123456789',
    status: 'active'
  },
  { 
    id: '2', 
    email: 'user2@aibet.asia', 
    role: 'user', 
    createdAt: '2025-04-15T00:00:00Z',
    phone: '+60198765432',
    status: 'inactive'
  },
  { 
    id: '3', 
    email: 'user3@aibet.asia', 
    role: 'user', 
    createdAt: '2025-05-01T00:00:00Z',
    phone: '+60187654321',
    status: 'active'
  },
];

export default function AdminUsers() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState(mockUsers);

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateDaysActive = (createdAt: string) => {
    const created = new Date(createdAt);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30">Admin</Badge>;
      case 'user':
        return <Badge className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30">User</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-300 hover:bg-gray-500/30">{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-300 hover:bg-green-500/30">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-red-500/20 text-red-300 hover:bg-red-500/30">Inactive</Badge>;
      default:
        return <Badge className="bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground">View and manage user accounts</p>
          </div>
          
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-primary/10' : ''}
            >
              <List size={18} />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-primary/10' : ''}
            >
              <Grid3X3 size={18} />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <Card className="glass-morphism">
            <CardContent className="pt-6">
              <div className="text-center py-6">
                <p>No users found.</p>
              </div>
            </CardContent>
          </Card>
        ) : viewMode === 'list' ? (
          <Card className="glass-morphism">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Days Active</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>{calculateDaysActive(user.createdAt)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="mr-2"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="glass-morphism">
                <CardHeader className="pb-2">
                  <CardTitle>{user.email}</CardTitle>
                  <CardDescription>{user.phone}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created:</span>
                      <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Days Active:</span>
                      <span>{calculateDaysActive(user.createdAt)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Status:</span>
                      <span>{getStatusBadge(user.status)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Role:</span>
                      <span>{getRoleBadge(user.role)}</span>
                    </div>
                    <div className="flex justify-between pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
