import { useState } from "react";
import { JobListings } from "./JobListings";
import { JobDetails } from "./JobDetails";
import { ApplicationModal } from "@/components/ApplicationModal";

const Index = () => {
  const [currentPage, setCurrentPage] = useState<'listings' | 'details'>('listings');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [applicationJobId, setApplicationJobId] = useState<string>("");

  const handleJobSelect = (jobId: string) => {
    setSelectedJobId(jobId);
    setCurrentPage('details');
  };

  const handleBackToListings = () => {
    setCurrentPage('listings');
    setSelectedJobId(null);
  };

  const handleApply = (jobId: string) => {
    setApplicationJobId(jobId);
    setIsApplicationModalOpen(true);
  };

  const handleCloseApplicationModal = () => {
    setIsApplicationModalOpen(false);
    setApplicationJobId("");
  };

  return (
    <>
      {currentPage === 'listings' && (
        <JobListings onJobSelect={handleJobSelect} />
      )}
      
      {currentPage === 'details' && selectedJobId && (
        <JobDetails 
          jobId={selectedJobId}
          onBack={handleBackToListings}
          onApply={handleApply}
        />
      )}

      <ApplicationModal
        isOpen={isApplicationModalOpen}
        onClose={handleCloseApplicationModal}
        jobId={applicationJobId}
      />
    </>
  );
};

export default Index;
