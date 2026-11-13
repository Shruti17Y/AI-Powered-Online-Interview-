import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import pkg from 'pg';
const { Pool } = pkg;
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Removed /api/signup and /api/login endpoints that used the old users table.

// Example middleware for admin routes
function requireAdmin(req, res, next) {
  // Assume user info is attached to req.user (e.g., via session or JWT)
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ error: 'Admin access required.' });
}

// Schedule interview endpoint

// Company notification endpoint (for Django integration)
app.post('/api/send-company-notification', async (req, res) => {
  console.log('Received notification email request:', req.body);

  const { email, subject, message } = req.body;
  if (!email || !subject || !message) {
    return res.status(400).json({ error: 'Missing email, subject, or message.' });
  }
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sp6145947@gmail.com',
      pass: 'hpad bvej fuii cyjt'
    }
  });
  const mailOptions = {
    from: 'sp6145947@gmail.com',
    to: email,
    subject,
    text: message
  };
  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: 'Notification email sent successfully!' });
  } catch (error) {
    console.error('Error sending notification email:', error);
    res.status(500).json({ error: 'Failed to send notification email', details: error.toString() });
  }
});

app.post('/api/schedule-interview', async (req, res) => {
  const { email, name } = req.body;
  console.log('Received email to send:', email);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sp6145947@gmail.com',
      pass: 'hpad bvej fuii cyjt'
    }
  });

  const mailOptions = {
    from: 'sp6145947@gmail.com',
    to: email,
    subject: 'Thank You for Scheduling an Interview',
    text: `Dear ${name || 'User'},\n\nThank you for scheduling an interview with us!\n\nBest regards,\nYour Company`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email', details: error.toString() });
  }
});
console.log('DATABASE_URL:', process.env.DATABASE_URL);
// Login endpoint
app.post('/api/login', async (req, res) => {
  const { emailOrUsername, password } = req.body;

  if (!emailOrUsername || !password) {
    return res.status(400).json({ error: 'Email/Username and password are required.' });
  }

  try {
    // Find user by email or username
    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR username = $1',
      [emailOrUsername]
    );
    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }
    const user = userResult.rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    // Return user info (not password)
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      is_admin: user.is_admin,
      created_at: user.created_at
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});
// Health check
app.get('/', (req, res) => res.send('API running!'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));