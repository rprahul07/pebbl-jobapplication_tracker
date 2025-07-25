import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Building2, 
  DollarSign,
  Clock,
  Heart,
  Share2,
  CheckCircle2,
  Loader2,
  AlertCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { Job } from "@/types/job";
import api from "@/utils/api";

interface JobDetailsProps {
  jobId: string;
  onBack: () => void;
  onApply: (jobId: string) => void;
  isApplying?: boolean;
  hasApplied?: boolean;
}

interface ApiJob extends Omit<Job, 'type' | 'requirements' | 'responsibilities'> {
  jobType: string | null;
  requirements: string;
}

export const JobDetails = ({ jobId, onBack, onApply: onApplyProp, isApplying: isApplyingProp, hasApplied: hasAppliedProp }: JobDetailsProps) => {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(hasAppliedProp || false);
  const [applicationError, setApplicationError] = useState<string | null>(null);

  const handleApply = async () => {
    try {
      setIsApplying(true);
      setApplicationError(null);
      
      // Make the API call to apply for the job
      await api.post('/applications', {
        jobId,
        dateApplied: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
      });
      
      // Update local state and call the parent's onApply if provided
      setHasApplied(true);
      if (onApplyProp) {
        onApplyProp(jobId);
      }
    } catch (error) {
      console.error('Error applying to job:', error);
      setApplicationError('Failed to submit application. Please try again.');
    } finally {
      setIsApplying(false);
    }
  };

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const response = await api.get<ApiJob>(`/jobs/${jobId}`);
        
        // Transform API response to match our Job type
        const transformedJob: Job = {
          ...response.data,
          type: response.data.jobType as Job['type'] || 'Full-time', // Default to Full-time if null
          requirements: response.data.requirements.split(',').map(r => r.trim()),
          responsibilities: [], // Not provided in API response
          isActive: response.data.isActive ?? true
        };
        
        setJob(transformedJob);
        setError(null);
      } catch (err) {
        console.error('Error fetching job:', err);
        setError('Failed to load job details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-10 w-10 mx-auto mb-4 text-destructive" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Job Not Found</h2>
          <p className="text-muted-foreground mb-6">
            {error || 'The job you are looking for does not exist or has been removed.'}
          </p>
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-gradient-hero shadow-elegant">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button 
            onClick={onBack}
            variant="ghost"
            className="text-white hover:bg-white/10 mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Button>
          
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
                {job.title}
              </h1>
              
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-5 w-5 text-white/80" />
                <span className="text-xl text-white font-medium">{job.company}</span>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-white/90 mb-6">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Posted {job.postedDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Apply by {new Date(job.applicationDeadline).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-white/20 text-white border-white/30 px-3 py-1">
                  {job.type}
                </Badge>
                {job.salaryRange && (
                  <Badge className="bg-success/20 text-white border-success/30 px-3 py-1">
                    <DollarSign className="h-3 w-3 mr-1" />
                    {job.salaryRange}
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:w-48">
              <Button 
                onClick={() => onApplyProp(job.id)}
                size="lg"
                disabled={isApplying || hasApplied}
                className={`bg-white text-primary hover:bg-white/90 font-semibold shadow-glow transform transition-all duration-300 ${
                  isApplying || hasApplied ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'
                }`}
              >
                {isApplying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Applying...
                  </>
                ) : hasApplied ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Applied
                  </>
                ) : (
                  'Apply Now'
                )}
              </Button>
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Description */}
            <Card className="bg-gradient-card shadow-elegant border-0">
              <CardHeader>
                <h2 className="text-2xl font-heading font-bold text-foreground">Job Description</h2>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {job.description}
                </p>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card className="bg-gradient-card shadow-elegant border-0">
              <CardHeader>
                <h2 className="text-2xl font-heading font-bold text-foreground">Requirements</h2>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {job.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Responsibilities */}
            <Card className="bg-gradient-card shadow-elegant border-0">
              <CardHeader>
                <h2 className="text-2xl font-heading font-bold text-foreground">Responsibilities</h2>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {job.responsibilities.map((responsibility, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Apply */}
            <Card className="bg-gradient-primary shadow-glow border-0">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold text-white mb-4">Ready to apply?</h3>
                <Button 
                  onClick={handleApply}
                  disabled={isApplying || hasApplied}
                  className={`w-full font-semibold ${
                    hasApplied 
                      ? 'bg-green-100 text-green-700 cursor-not-allowed' 
                      : 'bg-white text-primary hover:bg-white/90'
                  }`}
                >
                  {isApplying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Applying...
                    </>
                  ) : hasApplied ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Applied
                    </>
                  ) : (
                    'Apply Now'
                  )}
                </Button>
                <p className="text-white/80 text-sm mt-3">
                  {hasApplied ? 'Application submitted successfully!' : 'Application takes 2-3 minutes'}
                </p>
                {applicationError && (
                  <p className="text-red-300 text-sm mt-2">{applicationError}</p>
                )}
              </CardContent>
            </Card>

            {/* Job Summary */}
            <Card className="bg-gradient-card shadow-elegant border-0">
              <CardHeader>
                <h3 className="text-lg font-semibold text-foreground">Job Summary</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Job Type</span>
                  <Badge variant="secondary">{job.type}</Badge>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-medium">{job.location}</span>
                </div>
                <Separator />
                {job.salaryRange && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Salary</span>
                      <span className="font-medium text-success">{job.salaryRange}</span>
                    </div>
                    <Separator />
                  </>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Posted</span>
                  <span className="font-medium">{job.postedDate}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deadline</span>
                  <span className="font-medium text-destructive">
                    {new Date(job.applicationDeadline).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};