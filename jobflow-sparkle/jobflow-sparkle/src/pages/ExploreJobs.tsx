import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { JobFilters } from "@/components/JobFilters";
import { JobCard } from "@/components/ui/job-card";
import { Badge } from "@/components/ui/badge";
import { Job, JobFilters as Filters } from "@/types/job";
import { Search, SlidersHorizontal, Grid3X3, List, ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import api from "@/utils/api";

interface ExploreJobsProps {
  onJobSelect: (jobId: string) => void;
}

interface ApiJob extends Omit<Job, 'type' | 'requirements' | 'responsibilities'> {
  jobType: string | null;
  requirements: string;
}

export const ExploreJobs = ({ onJobSelect }: ExploreJobsProps) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    location: "",
    type: "",
    company: ""
  });
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await api.get<ApiJob[]>('/jobs');
        
        // Transform API response to match our Job type
        const transformedJobs: Job[] = response.data.map(job => ({
          ...job,
          type: job.jobType as Job['type'] || 'Full-time',
          requirements: job.requirements.split(',').map(r => r.trim()),
          responsibilities: [], // Not provided in API response
          isActive: true
        }));
        
        setJobs(transformedJobs);
        setError(null);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = !filters.search || 
        job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.company.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.description.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesLocation = !filters.location || 
        job.location.toLowerCase().includes(filters.location.toLowerCase());
      
      const matchesType = !filters.type || job.type === filters.type;
      
      const matchesCompany = !filters.company || 
        job.company.toLowerCase().includes(filters.company.toLowerCase());

      return matchesSearch && matchesLocation && matchesType && matchesCompany;
    });
  }, [jobs, filters]);

  const clearFilters = () => {
    setFilters({
      search: "",
      location: "",
      type: "",
      company: ""
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading jobs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-gradient-hero shadow-elegant">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-4 animate-fade-in">
              Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-primary-glow">Opportunities</span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto animate-slide-up">
              Discover your next career move from thousands of curated job listings
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search jobs, companies, skills, or locations..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-12 pr-20 h-14 text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-white/40"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
              <Button 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-primary hover:bg-white/90 font-semibold"
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters and View Toggle */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
            
            {Object.values(filters).some(Boolean) && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear filters
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-lg p-1">
            <Button 
              variant={viewMode === 'grid' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setViewMode('grid')}
              className="rounded-md"
            >
              <Grid3X3 className="h-4 w-4 mr-2" />
              Grid
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setViewMode('list')}
              className="rounded-md"
            >
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="mb-8 bg-white/50 backdrop-blur-sm rounded-lg p-6 shadow-sm">
            <JobFilters 
              filters={filters} 
              onFiltersChange={setFilters}
              onClearFilters={() => setFilters({ search: '', location: '', type: '', company: '' })}
            />
          </div>
        )}

        {/* Job Listings */}
        {filteredJobs.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
            {filteredJobs.map((job) => (
              <JobCard 
                key={job.id} 
                job={job} 
                onClick={onJobSelect}
                variant={viewMode === 'grid' ? 'grid' : 'list'}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-muted-foreground">No jobs found</h3>
            <p className="text-muted-foreground mt-2">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};