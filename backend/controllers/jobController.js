// backend/controllers/jobController.js
import { Job, JobApplication, User, APPLICATION_STATUS } from '../models/index.js';

// Utility: Admin check
function isAdmin(req) {
  return req.user?.role === 'admin';
}

// ======================= JOB CATALOG (Admin only) =======================

export async function listJobs(req, res) {
  try {
    const jobs = await Job.findAll();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch jobs', error: err.message });
  }
}

export async function getJob(req, res) {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching job', error: err.message });
  }
}

export async function createJob(req, res) {
 console.log("here")

  try {
    const {
      title,
      company,
      description,
      location,
      jobType,
      salaryRange,
      requirements,
      postedDate,
      applicationDeadline,
      isActive,
    } = req.body;

    const job = await Job.create({
      title,
      company,
      description,
      location,
      jobType,
      salaryRange,
      requirements,
      postedDate,
      applicationDeadline,
      isActive,
    });

    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: 'Error creating job', error: err.message });
  }
}

export async function updateJob(req, res) {
  if (!isAdmin(req)) return res.status(403).json({ message: 'Admin access required' });

  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const {
      title,
      company,
      description,
      location,
      jobType,
      salaryRange,
      requirements,
      postedDate,
      applicationDeadline,
      isActive,
    } = req.body;

    await job.update({
      title,
      company,
      description,
      location,
      jobType,
      salaryRange,
      requirements,
      postedDate,
      applicationDeadline,
      isActive,
    });

    res.json(job);
  } catch (err) {
    res.status(500).json({ message: 'Error updating job', error: err.message });
  }
}

export async function deleteJob(req, res) {
  if (!isAdmin(req)) return res.status(403).json({ message: 'Admin access required' });

  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    await job.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting job', error: err.message });
  }
}

// ======================= JOB APPLICATIONS =======================

export async function listApplications(req, res) {
  try {
    const where = isAdmin(req) ? {} : { userId: req.user.id };
    const apps = await JobApplication.findAll({
      where,
      include: [
        { model: Job },
        { model: User, attributes: ['id', 'name', 'email'] },
      ],
    });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching applications', error: err.message });
  }
}

export async function listApplicationsByStatus(req, res) {
  try {
    const { status } = req.params;
    if (!APPLICATION_STATUS.includes(status)) {
      return res.status(400).json({ message: 'Invalid application status' });
    }

    const where = isAdmin(req)
      ? { status }
      : { status, userId: req.user.id };

    const apps = await JobApplication.findAll({
      where,
      include: [{ model: Job }],
    });

    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: 'Error filtering applications', error: err.message });
  }
}

export async function getApplication(req, res) {
  try {
    const app = await JobApplication.findByPk(req.params.id, {
      include: [Job, { model: User, attributes: ['id', 'email', 'name'] }],
    });

    if (!app) return res.status(404).json({ message: 'Application not found' });

    if (!isAdmin(req) && app.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(app);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching application', error: err.message });
  }
}

export async function createApplication(req, res) {
  try {
    const { jobId, status, dateApplied, notes } = req.body;

    const job = await Job.findByPk(jobId);
    if (!job) return res.status(400).json({ message: 'Job not found' });

    const application = await JobApplication.create({
      jobId,
      status: status || 'Applied',
      dateApplied,
      notes,
      userId: req.user.id,
    });

    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: 'Error submitting application', error: err.message });
  }
}

export async function updateApplication(req, res) {
  try {
    const app = await JobApplication.findByPk(req.params.id);
    if (!app) return res.status(404).json({ message: 'Application not found' });

    if (!isAdmin(req) && app.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { status, notes, dateApplied } = req.body;
    await app.update({ status, notes, dateApplied });

    res.json(app);
  } catch (err) {
    res.status(500).json({ message: 'Error updating application', error: err.message });
  }
}

export async function deleteApplication(req, res) {
  try {
    const app = await JobApplication.findByPk(req.params.id);
    if (!app) return res.status(404).json({ message: 'Application not found' });

    if (!isAdmin(req) && app.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await app.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting application', error: err.message });
  }
}
