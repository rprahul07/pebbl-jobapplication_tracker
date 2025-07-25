import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { MapPin, Briefcase, Building2, X } from "lucide-react";
import { JobFilters as Filters } from "@/types/job";

interface JobFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onClearFilters: () => void;
}

export const JobFilters = ({ filters, onFiltersChange, onClearFilters }: JobFiltersProps) => {
  const updateFilter = (key: keyof Filters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = filters.location || filters.type || filters.company;

  return (
    <Card className="bg-gradient-card shadow-elegant border-0">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Location Filter */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Location</span>
            </div>
            <Input
              placeholder="Any location"
              value={filters.location}
              onChange={(e) => updateFilter('location', e.target.value)}
              className="border-muted-foreground/20 focus:border-primary transition-colors duration-300"
            />
          </div>

          {/* Job Type Filter */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              <span>Job Type</span>
            </div>
            <Select value={filters.type || 'all'} onValueChange={(value) => updateFilter('type', value === 'all' ? '' : value)}>
              <SelectTrigger className="border-muted-foreground/20 focus:border-primary">
                <SelectValue placeholder="Any type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any type</SelectItem>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Company Filter */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span>Company</span>
            </div>
            <Input
              placeholder="Any company"
              value={filters.company}
              onChange={(e) => updateFilter('company', e.target.value)}
              className="border-muted-foreground/20 focus:border-primary transition-colors duration-300"
            />
          </div>

          {/* Clear Filters */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-transparent">
              Actions
            </div>
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={onClearFilters}
                className="w-full border-muted-foreground/20 hover:bg-destructive/10 hover:border-destructive/20 hover:text-destructive transition-all duration-300"
              >
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};