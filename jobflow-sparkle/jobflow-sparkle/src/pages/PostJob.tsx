import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Building2, MapPin, DollarSign, Calendar, Briefcase, Save } from "lucide-react";
import { Link } from "react-router-dom";

export const PostJob = () => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "",
    salaryMin: "",
    salaryMax: "",
    description: "",
    requirements: "",
    responsibilities: "",
    applicationDeadline: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.company || !formData.location || !formData.type || !formData.description) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const jobData = {
        title: formData.title,
        company: formData.company,
        location: formData.location,
        type: formData.type,
        description: formData.description,
        requirements: formData.requirements,
        salary: formData.salaryMin && formData.salaryMax 
          ? `${formData.salaryMin}-${formData.salaryMax} LPA` 
          : 'Not specified',
        postedDate: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
        applicationDeadline: formData.applicationDeadline || ''
      };
      const token= localStorage.getItem('token');
      if(!token){
        throw new Error('No authentication token found. Please log in.');
      }

      const response = await fetch('http://localhost:5000/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      toast({
        title: "Job Posted Successfully!",
        description: `The job ${formData.title} at ${formData.company} has been posted.`,
        variant: "default"
      });

      setIsSubmitting(false);
      
      // Reset form
      setFormData({
        title: "",
        company: "",
        location: "",
        type: "",
        salaryMin: "",
        salaryMax: "",
        description: "",
        requirements: "",
        responsibilities: "",
        applicationDeadline: ""
      });
    } catch (error) {
      console.error('Error posting job:', error);
      toast({
        title: "Error",
        description: "Failed to post the job. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-gradient-hero shadow-elegant">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-4 animate-fade-in">
              Post a <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-primary-glow">Job</span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto animate-slide-up">
              Find the perfect candidates for your team. Create a compelling job listing that attracts top talent.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card className="bg-gradient-card shadow-elegant border-0 animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl font-heading">
                <Briefcase className="h-6 w-6 text-primary" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                    Job Title *
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g. Senior Frontend Developer"
                    className="border-muted-foreground/20 focus:border-primary"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-sm font-medium">
                    Company Name *
                  </Label>
                  <Input
                    id="company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    placeholder="e.g. TechCorp Solutions"
                    className="border-muted-foreground/20 focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-medium">
                    Location *
                  </Label>
                  <Input
                    id="location"
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g. San Francisco, CA or Remote"
                    className="border-muted-foreground/20 focus:border-primary"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-sm font-medium">
                    Job Type *
                  </Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger className="border-muted-foreground/20 focus:border-primary">
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compensation */}
          <Card className="bg-gradient-card shadow-elegant border-0 animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl font-heading">
                <DollarSign className="h-6 w-6 text-primary" />
                Compensation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="salaryMin" className="text-sm font-medium">
                    Minimum Salary
                  </Label>
                  <Input
                    id="salaryMin"
                    type="number"
                    value={formData.salaryMin}
                    onChange={(e) => handleInputChange('salaryMin', e.target.value)}
                    placeholder="80000"
                    className="border-muted-foreground/20 focus:border-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="salaryMax" className="text-sm font-medium">
                    Maximum Salary
                  </Label>
                  <Input
                    id="salaryMax"
                    type="number"
                    value={formData.salaryMax}
                    onChange={(e) => handleInputChange('salaryMax', e.target.value)}
                    placeholder="120000"
                    className="border-muted-foreground/20 focus:border-primary"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="applicationDeadline" className="text-sm font-medium">
                  Application Deadline
                </Label>
                <Input
                  id="applicationDeadline"
                  type="date"
                  value={formData.applicationDeadline}
                  onChange={(e) => handleInputChange('applicationDeadline', e.target.value)}
                  className="border-muted-foreground/20 focus:border-primary"
                />
              </div>
            </CardContent>
          </Card>

          {/* Job Details */}
          <Card className="bg-gradient-card shadow-elegant border-0 animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl font-heading">
                <Building2 className="h-6 w-6 text-primary" />
                Job Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Job Description *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the role, company culture, and what makes this opportunity exciting..."
                  rows={6}
                  className="border-muted-foreground/20 focus:border-primary resize-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements" className="text-sm font-medium">
                  Requirements
                </Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => handleInputChange('requirements', e.target.value)}
                  placeholder="List the required skills, experience, and qualifications (one per line)"
                  rows={5}
                  className="border-muted-foreground/20 focus:border-primary resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsibilities" className="text-sm font-medium">
                  Responsibilities
                </Label>
                <Textarea
                  id="responsibilities"
                  value={formData.responsibilities}
                  onChange={(e) => handleInputChange('responsibilities', e.target.value)}
                  placeholder="Outline the key responsibilities and day-to-day tasks (one per line)"
                  rows={5}
                  className="border-muted-foreground/20 focus:border-primary resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Actions */}
          <Card className="bg-gradient-primary shadow-glow border-0 animate-slide-up">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-semibold text-white mb-2">Ready to find great talent?</h3>
                  <p className="text-white/80">Your job listing will be reviewed and published within 24 hours.</p>
                </div>
                
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Draft
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-white text-primary hover:bg-white/90 font-semibold px-8"
                  >
                    {isSubmitting ? "Publishing..." : "Post Job"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};