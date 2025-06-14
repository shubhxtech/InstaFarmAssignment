const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const signup = async (req, res) => {
  try {
    const { name, email, password, organizationName } = req.body;

    // Check if owner already exists
    const existingOwner = await prisma.owner.findUnique({
      where: { email }
    });

    if (existingOwner) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create owner
    const owner = await prisma.owner.create({
      data: {
        name,
        email,
        password: hashedPassword,
        organizationName
      }
    });

    // Generate JWT token
    const token = jwt.sign({ id: owner.id, email: owner.email }, JWT_SECRET, {
      expiresIn: '24h'
    });

    // Return owner data without password
    const { password: _, ...ownerData } = owner;
    res.status(201).json({ 
      owner: ownerData, 
      token 
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const login = async (req, res) => {
  console.log("came here login ")
  try {
    const { email, password } = req.body;

    // Find owner by email
    const owner = await prisma.owner.findUnique({
      where: { email }
    });

    if (!owner) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, owner.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: owner.id, email: owner.email }, JWT_SECRET, {
      expiresIn: '24h'
    });

    // Return owner data without password
    const { password: _, ...ownerData } = owner;
    res.json({ 
      owner: ownerData, 
      token 
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getProfile = async (req, res) => {
  try {
    const owner = await prisma.owner.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        organizationName: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!owner) {
      return res.status(404).json({ error: 'Owner not found' });
    }

    res.json(owner);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  signup,
  login,
  getProfile
};