import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Users, Briefcase, FileText, CheckCircle, XCircle, Clock, PieChart } from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import api from '@/utils/api';

interface JobApplication {
  id: string;
  status: string;
  appliedAt: string;
  job: {
    id: string;
    title: string;
    company: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    applied: 0,
    interviewing: 0,
    offered: 0,
    rejected: 0
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/applications');
      const applicationsData = Array.isArray(response.data) ? response.data : [];
      
      // Map the API response to the expected format
      const validatedApplications = applicationsData.map(app => ({
        id: app.id || '',
        status: app.status || 'Applied',
        appliedAt: app.dateApplied || app.createdAt || new Date().toISOString(),
        job: {
          id: app.Job?.id || '',
          title: app.Job?.title || 'Unknown Position',
          company: app.Job?.company || 'Unknown Company'
        },
        user: {
          id: app.User?.id || '',
          name: app.User?.name || 'Unknown User',
          email: app.User?.email || 'No email provided'
        }
      }));
      
      setApplications(validatedApplications);
      
      // Calculate stats
      const stats = {
        total: validatedApplications.length,
        applied: validatedApplications.filter(app => app.status === 'Applied').length,
        interviewing: validatedApplications.filter(app => app.status === 'Interviewing').length,
        offered: validatedApplications.filter(app => app.status === 'Offered').length,
        rejected: validatedApplications.filter(app => app.status === 'Rejected').length
      };
      
      setStats(stats);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: 'Error',
        description: 'Failed to load applications',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/applications/${id}`, { status });
      fetchApplications();
      toast({
        title: 'Success',
        description: 'Application status updated',
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update application status',
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (status: string = 'Applied') => {
    const statusMap: Record<string, { variant: string; icon: React.ReactNode }> = {
      'Applied': { variant: 'secondary', icon: <Clock className="h-3 w-3 mr-1" /> },
      'Interviewing': { variant: 'default', icon: <Users className="h-3 w-3 mr-1" /> },
      'Offered': { variant: 'success', icon: <CheckCircle className="h-3 w-3 mr-1" /> },
      'Rejected': { variant: 'destructive', icon: <XCircle className="h-3 w-3 mr-1" /> },
    };

    const { variant, icon } = statusMap[status] || { variant: 'default', icon: <FileText className="h-3 w-3 mr-1" /> };
    
    return (
      <Badge variant={variant as any} className="flex items-center">
        {icon}
        {status}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage job applications and users</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </div>

        {/* Stats Cards and Chart */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applied</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.applied}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Interviewing</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.interviewing}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Offered</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.offered}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.rejected}</div>
            </CardContent>
          </Card>
        </div>

        {/* Chart Section */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-semibold">Applications Status Distribution</CardTitle>
            <PieChart className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={[
                    { name: 'Applied', value: stats.applied, color: '#64748b' },
                    { name: 'Interviewing', value: stats.interviewing, color: '#3b82f6' },
                    { name: 'Offered', value: stats.offered, color: '#10b981' },
                    { name: 'Rejected', value: stats.rejected, color: '#ef4444' },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {[
                    { name: 'Applied', color: '#64748b' },
                    { name: 'Interviewing', color: '#3b82f6' },
                    { name: 'Offered', color: '#10b981' },
                    { name: 'Rejected', color: '#ef4444' },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [value, name]}
                />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applied On</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.length > 0 ? (
                    applications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span>{app.user.name}</span>
                            <span className="text-xs text-muted-foreground">{app.user.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>{app.job.title}</TableCell>
                        <TableCell>{app.job.company}</TableCell>
                        <TableCell>{getStatusBadge(app.status)}</TableCell>
                        <TableCell>{new Date(app.appliedAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right space-x-2">
                          {app.status !== 'Interviewing' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateStatus(app.id, 'Interviewing')}
                            >
                              Interview
                            </Button>
                          )}
                          {app.status !== 'Offered' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-green-100 text-green-700 hover:bg-green-200"
                              onClick={() => updateStatus(app.id, 'Offered')}
                            >
                              Offer
                            </Button>
                          )}
                          {app.status !== 'Rejected' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-red-100 text-red-700 hover:bg-red-200"
                              onClick={() => updateStatus(app.id, 'Rejected')}
                            >
                              Reject
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No applications found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
