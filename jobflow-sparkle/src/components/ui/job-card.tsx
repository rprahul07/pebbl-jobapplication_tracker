import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Building2 } from "lucide-react";
import { Job } from "@/types/job";

interface JobCardProps {
  job: Job;
  onClick: (jobId: string) => void;
  variant?: 'grid' | 'list';  // Make it optional with default value
}

export const JobCard = ({ job, onClick, variant = 'grid' }: JobCardProps) => {
  const getJobTypeBadgeVariant = (type?: string | null) => {
    if (!type) return 'secondary';
    
    const normalizedType = type.toLowerCase().replace(/-/g, '');
    
    switch (normalizedType) {
      case 'fulltime':
      case 'full time':
        return 'default';
      case 'parttime':
      case 'part time':
        return 'secondary';
      case 'contract':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className="group bg-gradient-card hover:shadow-hover transition-all duration-300 transform hover:-translate-y-1 border-0 overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-heading font-bold text-xl text-foreground group-hover:text-primary transition-colors duration-300">
              {job.title}
            </h3>
            <div className="flex items-center gap-2 mt-2 text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span className="font-medium">{job.company}</span>
            </div>
          </div>
          {job.type && (
            <Badge 
              variant={getJobTypeBadgeVariant(job.type)} 
              className="ml-4 font-medium whitespace-nowrap"
            >
              {job.type}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{job.postedDate}</span>
          </div>
        </div>
        
        <p className="text-muted-foreground line-clamp-2 leading-relaxed">
          {job.description}
        </p>
        
        {job.salaryRange && (
          <div className="text-primary font-semibold text-lg">
            {job.salaryRange}
          </div>
        )}
        
        <Button 
          onClick={() => onClick(job.id)}
          className="w-full bg-gradient-primary hover:bg-gradient-primary hover:opacity-90 transition-all duration-300 font-medium shadow-elegant"
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};