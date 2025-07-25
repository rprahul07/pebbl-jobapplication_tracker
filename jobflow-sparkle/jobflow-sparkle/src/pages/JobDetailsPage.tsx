import { useParams } from "react-router-dom";
import { useState } from "react";
import { JobDetails } from "./JobDetails";
import { ApplicationModal } from "@/components/ApplicationModal";

export const JobDetailsPage = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  
  const handleBack = () => {
    window.history.back();
  };

  const handleApply = (jobId: string) => {
    setIsApplicationModalOpen(true);
  };

  const handleCloseApplicationModal = () => {
    setIsApplicationModalOpen(false);
  };

  return (
    <>
      <JobDetails
        jobId={jobId || ""}
        onBack={handleBack}
        onApply={handleApply}
      />
      
      <ApplicationModal
        isOpen={isApplicationModalOpen}
        onClose={handleCloseApplicationModal}
        jobId={jobId || ""}
      />
    </>
  );
};