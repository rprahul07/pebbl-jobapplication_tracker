// backend/controllers/userController.js
import { User } from '../models/index.js';

// List all users (admin only)
export async function list(req, res) {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  const users = await User.findAll({ attributes: ['id', 'name', 'email', 'role', 'createdAt'] });
  res.json(users);
}

// Get user by id (admin or self)
export async function get(req, res) {
  if (req.user.role !== 'admin' && req.user.id !== req.params.id) return res.status(403).json({ message: 'Forbidden' });
  const user = await User.findByPk(req.params.id, { attributes: ['id', 'name', 'email', 'role', 'createdAt'] });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
}

// Update user profile (admin or self)
export async function update(req, res) {
  if (req.user.role !== 'admin' && req.user.id !== req.params.id) return res.status(403).json({ message: 'Forbidden' });
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const { name, email, role } = req.body;
  // Only admin can change role
  if (role && req.user.role !== 'admin') return res.status(403).json({ message: 'Only admin can change role' });
  await user.update({ name, email, ...(role ? { role } : {}) });
  res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
}

// Delete user (admin or self)
export async function remove(req, res) {
  if (req.user.role !== 'admin' && req.user.id !== req.params.id) return res.status(403).json({ message: 'Forbidden' });
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  await user.destroy();
  res.status(204).end();
} 