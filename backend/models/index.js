// backend/models/index.js
import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(process.env.DATABASE_URL, {
  logging: false,
});

export const APPLICATION_STATUS = [
  'Applied',
  'Interviewing',
  'Offered',
  'Rejected',
];

export const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'user'),
      allowNull: false,
      defaultValue: 'user',
    },
  },
  {
    tableName: 'users',
    timestamps: true,
    underscored: true,
  }
);

export const Job = sequelize.define(
  'Job',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    company: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'jobs',
    timestamps: true,
    underscored: true,
  }
);

export const JobApplication = sequelize.define(
  'JobApplication',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    status: {
      type: DataTypes.ENUM(...APPLICATION_STATUS),
      allowNull: false,
      defaultValue: 'Applied',
    },
    dateApplied: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'job_applications',
    timestamps: true,
    underscored: true,
  }
);

// Relationships
User.hasMany(JobApplication, { foreignKey: { name: 'userId', allowNull: false }, onDelete: 'CASCADE' });
JobApplication.belongsTo(User, { foreignKey: { name: 'userId', allowNull: false } });

Job.hasMany(JobApplication, { foreignKey: { name: 'jobId', allowNull: false }, onDelete: 'CASCADE' });
JobApplication.belongsTo(Job, { foreignKey: { name: 'jobId', allowNull: false } });

export async function syncSchema(force = false) {
  try {
    await sequelize.sync({ force });
    console.log(`✅ Database synced successfully. (force: ${force})`);
  } catch (error) {
    console.error('❌ Error syncing database:', error);
  }
}
