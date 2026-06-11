const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Task = require('./models/Task');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://taskmanagement:task%40123@cluster0.qnfncci.mongodb.net/?appName=Cluster0');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Task.deleteMany({});
    console.log('Cleared existing data');

    // Create Manager
    const manager = new User({
      username: 'manager',
      email: 'manager@example.com',
      password: 'password123',
      role: 'Manager',
    });
    await manager.save();
    console.log('Created Manager user');

    // Create Team Leads
    const teamLead1 = new User({
      username: 'teamlead1',
      email: 'teamlead1@example.com',
      password: 'password123',
      role: 'Team Lead',
      reportingTo: manager._id,
    });
    await teamLead1.save();
    console.log('Created Team Lead 1');

    const teamLead2 = new User({
      username: 'teamlead2',
      email: 'teamlead2@example.com',
      password: 'password123',
      role: 'Team Lead',
      reportingTo: manager._id,
    });
    await teamLead2.save();
    console.log('Created Team Lead 2');

    // Create Employees
    const employee1 = new User({
      username: 'employee1',
      email: 'employee1@example.com',
      password: 'password123',
      role: 'Employee',
      reportingTo: teamLead1._id,
    });
    await employee1.save();
    console.log('Created Employee 1');

    const employee2 = new User({
      username: 'employee2',
      email: 'employee2@example.com',
      password: 'password123',
      role: 'Employee',
      reportingTo: teamLead1._id,
    });
    await employee2.save();
    console.log('Created Employee 2');

    const employee3 = new User({
      username: 'employee3',
      email: 'employee3@example.com',
      password: 'password123',
      role: 'Employee',
      reportingTo: teamLead2._id,
    });
    await employee3.save();
    console.log('Created Employee 3');

    // Update team members
    teamLead1.teamMembers = [employee1._id, employee2._id];
    await teamLead1.save();

    teamLead2.teamMembers = [employee3._id];
    await teamLead2.save();

    manager.teamMembers = [teamLead1._id, teamLead2._id];
    await manager.save();
    console.log('Updated team relationships');

    // Create sample tasks
    const tasks = [
      {
        title: 'Design new dashboard',
        description: 'Create mockups and design for the new dashboard interface',
        status: 'in-progress',
        priority: 'high',
        createdBy: manager._id,
        assignedTo: employee1._id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Fix login bug',
        description: 'Fix authentication issue on login page',
        status: 'pending',
        priority: 'high',
        createdBy: teamLead1._id,
        assignedTo: employee2._id,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Write API documentation',
        description: 'Document all API endpoints and parameters',
        status: 'completed',
        priority: 'medium',
        createdBy: teamLead1._id,
        assignedTo: employee1._id,
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Optimize database queries',
        description: 'Improve performance of slow queries',
        status: 'pending',
        priority: 'medium',
        createdBy: manager._id,
        assignedTo: teamLead1._id,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Update frontend dependencies',
        description: 'Update Angular and other npm packages to latest versions',
        status: 'pending',
        priority: 'low',
        createdBy: teamLead2._id,
        assignedTo: employee3._id,
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Setup CI/CD pipeline',
        description: 'Configure GitHub Actions for automated testing and deployment',
        status: 'pending',
        priority: 'high',
        createdBy: manager._id,
        assignedTo: manager._id,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      },
    ];

    await Task.insertMany(tasks);
    console.log('Created sample tasks');

    console.log('✅ Database seeding completed successfully!');
    console.log('\nDemo Accounts:');
    console.log('Manager: manager@example.com / password123');
    console.log('Team Lead: teamlead1@example.com / password123');
    console.log('Employee: employee1@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeding
connectDB().then(() => seedDatabase());
