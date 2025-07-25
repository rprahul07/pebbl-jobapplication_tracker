import { useState, useMemo, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { JobFilters } from "@/components/JobFilters";
import { JobCard } from "@/components/ui/job-card";
import { Button } from "@/components/ui/button";
import { JobFilters as Filters } from "@/types/job";
import heroImage from "@/assets/job-hero.jpg";
import { ArrowRight, TrendingUp, Users, MapPin, Loader2, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import api from "@/utils/api";
import { useToast } from "@/hooks/use-toast";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  salaryRange?: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  postedDate: string;
  applicationDeadline: string;
  isActive: boolean;
}

interface JobListingsProps {
  onJobSelect: (jobId: string) => void;
}

export const JobListings = ({ onJobSelect }: JobListingsProps) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    location: "",
    type: "",
    company: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await api.get('/jobs');
        setJobs(response.data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load jobs. Please try again later.');
        toast({
          title: "Error",
          description: "Failed to load jobs. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [toast]);

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = !filters.search || 
        job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.company.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.description.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesLocation = !filters.location || 
        job.location.toLowerCase().includes(filters.location.toLowerCase());
      
      const matchesType = !filters.type || 
        (job.type && job.type.toLowerCase() === filters.type.toLowerCase());
      
      const matchesCompany = !filters.company || 
        job.company.toLowerCase().includes(filters.company.toLowerCase());

      return matchesSearch && matchesLocation && matchesType && matchesCompany;
    });
  }, [jobs, filters]);

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, search: query }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      location: "",
      type: "",
      company: ""
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation onSearch={handleSearch} />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-6 animate-fade-in">
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-primary-glow">Dream Job</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto animate-slide-up">
            Discover thousands of opportunities from top companies worldwide. Your perfect career awaits.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
            <Link to="/explore">
              <Button 
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-4 text-lg shadow-glow transform hover:scale-105 transition-all duration-300"
              >
                Explore Jobs
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/post-job">
              <Button 
                variant="outline"
                size="lg"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm px-8 py-4 text-lg transition-all duration-300"
              >
                Post a Job
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-primary mr-2" />
                <span className="text-4xl font-bold text-primary">500+</span>
              </div>
              <p className="text-muted-foreground font-medium">Active Job Listings</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center">
                <Users className="h-8 w-8 text-primary mr-2" />
                <span className="text-4xl font-bold text-primary">50K+</span>
              </div>
              <p className="text-muted-foreground font-medium">Job Seekers</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center">
                <MapPin className="h-8 w-8 text-primary mr-2" />
                <span className="text-4xl font-bold text-primary">100+</span>
              </div>
              <p className="text-muted-foreground font-medium">Cities Worldwide</p>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Latest Opportunities
            </h2>
            <p className="text-lg text-muted-foreground">
              {filteredJobs.length} jobs found {filters.search && `for "${filters.search}"`}
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <JobFilters 
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={clearFilters}
            />
          </div>

          {/* Job Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading jobs...</span>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
              <h3 className="text-2xl font-semibold text-foreground mb-2">Error loading jobs</h3>
              <p className="text-muted-foreground mb-6">
                {error}
              </p>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
              >
                Retry
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map((job, index) => (
                  <div 
                    key={job.id} 
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <JobCard 
                      job={job}
                      onClick={onJobSelect}
                    />
                  </div>
                ))}
              </div>

              {filteredJobs.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-semibold text-foreground mb-2">No jobs found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your search criteria or clearing the filters
                  </p>
                  <Button onClick={clearFilters} variant="outline">
                    Clear All Filters
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};