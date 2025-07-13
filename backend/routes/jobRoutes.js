import express from 'express';
import {
  // Job routes
  listJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,

  // JobApplication routes
  listApplications,
  listApplicationsByStatus,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication
} from '../controllers/jobController.js';

import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// 🔒 All routes below require authentication (user or admin)
router.use(requireAuth);

// ==================== 📁 JOB ROUTES ====================

// ✅ Public for authenticated users (admin or user)
router.get('/jobs', listJobs);                     // Get all jobs (viewable by users)

// ✅ Public for authenticated users (admin or user)
router.get('/jobs/:id', getJob);                   // Get job details

// 🔐 Admin only
router.post('/jobs', createJob);                   // Create new job posting

// 🔐 Admin only
router.patch('/jobs/:id', updateJob);              // Update job posting

// 🔐 Admin only
router.delete('/jobs/:id', deleteJob);             // Delete job posting

// ==================== 📝 APPLICATION ROUTES ====================

// ✅ Admin sees all, user sees only own
router.get('/applications', listApplications);     // View applications list

// ✅ Admin sees all by status, user sees own by status
router.get('/applications/status/:status', listApplicationsByStatus); // Filter applications

// ✅ Admin sees all, user sees own
router.get('/applications/:id', getApplication);   // View single application

// 👤 User only (apply to a job)
router.post('/applications', createApplication);   // Create application for job

// 👤 User only (can update own), 🔐 Admin can update any
router.patch('/applications/:id', updateApplication); // Update status or notes

// 👤 User only (can delete own), 🔐 Admin can delete any
router.delete('/applications/:id', deleteApplication); // Delete application

export default router;
