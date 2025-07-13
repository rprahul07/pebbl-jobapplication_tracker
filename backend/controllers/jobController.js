// backend/controllers/jobController.js
import { Job, JobApplication, User, APPLICATION_STATUS } from '../models/index.js';

// Utility: Check admin
function isAdmin(req) {
  return req.user?.role === 'admin';
}

// ======================= JOB CATALOG (Admin only) =======================

export async function listJobs(req, res) {
  try {
    const jobs = await Job.findAll();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getJob(req, res) {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function createJob(req, res) {
  if (!isAdmin(req)) return res.status(403).json({ message: 'Admin only' });
  try {
    const { title, company, description } = req.body;
    const job = await Job.create({ title, company, description });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function updateJob(req, res) {
  if (!isAdmin(req)) return res.status(403).json({ message: 'Admin only' });
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    const { title, company, description } = req.body;
    await job.update({ title, company, description });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function deleteJob(req, res) {
  if (!isAdmin(req)) return res.status(403).json({ message: 'Admin only' });
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    await job.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// ======================= JOB APPLICATIONS =======================

// List applications (admin sees all, user sees own)
export async function listApplications(req, res) {
  try {
    const where = isAdmin(req) ? {} : { userId: req.user.id };
    const apps = await JobApplication.findAll({
      where,
      include: [
        { model: Job },
        { model: User, attributes: ['id', 'name', 'email'] }
      ],
    });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Filter by status
export async function listApplicationsByStatus(req, res) {
  try {
    const { status } = req.params;
    if (!APPLICATION_STATUS.includes(status)) return res.status(400).json({ message: 'Invalid status' });

    const where = { status };
    if (!isAdmin(req)) where.userId = req.user.id;

    const apps = await JobApplication.findAll({ where, include: [Job] });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getApplication(req, res) {
  try {
    const app = await JobApplication.findByPk(req.params.id, {
      include: [Job, { model: User, attributes: ['id', 'email', 'name'] }],
    });
    if (!app) return res.status(404).json({ message: 'Not found' });
    if (!isAdmin(req) && app.userId !== req.user.id)
      return res.status(403).json({ message: 'Forbidden' });
    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function createApplication(req, res) {
  try {
    const { jobId, status, dateApplied, notes } = req.body;
    const application = await JobApplication.create({
      jobId,
      status,
      dateApplied,
      notes,
      userId: req.user.id,
    });
    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function updateApplication(req, res) {
  try {
    const app = await JobApplication.findByPk(req.params.id);
    if (!app) return res.status(404).json({ message: 'Not found' });
    if (!isAdmin(req) && app.userId !== req.user.id)
      return res.status(403).json({ message: 'Forbidden' });

    const { status, notes, dateApplied } = req.body;
    await app.update({ status, notes, dateApplied });
    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function deleteApplication(req, res) {
  try {
    const app = await JobApplication.findByPk(req.params.id);
    if (!app) return res.status(404).json({ message: 'Not found' });
    if (!isAdmin(req) && app.userId !== req.user.id)
      return res.status(403).json({ message: 'Forbidden' });
    await app.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
