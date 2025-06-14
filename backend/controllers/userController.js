const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getUsers = async (req, res) => {
  console.log("get users called")
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (page - 1) * limit;

    const where = {
      ownerId: req.user.id,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          following: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          followers: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: parseInt(skip),
        take: parseInt(limit)
      }),
      prisma.user.count({ where })
    ]);

    res.json(
      users
    );
    console.log(users)
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findFirst({
      where: {
        id: parseInt(id),
        ownerId: req.user.id
      },
      include: {
        following: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        followers: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createUser = async (req, res) => {
  console.log("create user is called")
  try {
    const { name, email, phone, dateOfBirth } = req.body;
    console.log(email)
    // Check if user already exists with this email in the organization
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        ownerId: req.user.id
      }
    });

    if (existingUser) {
      console.log("email already there")
      return res.status(400).json({ error: 'User with this email already exists in your organization' });
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        dateOfBirth: new Date(dateOfBirth),
        ownerId: req.user.id
      },
      include: {
        following: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        followers: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(201).json(user);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateUser = async (req, res) => { 
  try {
    const { id } = req.params;
    const { name, email, phone, dateOfBirth } = req.body;

    // Check if user exists and belongs to the owner
    const existingUser = await prisma.user.findFirst({
      where: {
        id: parseInt(id),
        ownerId: req.user.id
      }
    });

    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if email is being changed and if it conflicts with another user
    if (email && email !== existingUser.email) {
      const emailConflict = await prisma.user.findFirst({
        where: {
          email,
          ownerId: req.user.id,
          id: {
            not: parseInt(id)
          }
        }
      });

      if (emailConflict) {
        return res.status(400).json({ error: 'User with this email already exists in your organization' });
      }
    }

    // Prepare update data
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (dateOfBirth) updateData.dateOfBirth = new Date(dateOfBirth);

    // Update user
    const updatedUser = await prisma.user.update({
      where: {
        id: parseInt(id)
      },
      data: updateData,
      include: {
        following: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        followers: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteUser = async (req, res) => {
  console.log("delete user is called")
  console.log(req.params)
  try {
    const { id } = req.params;

    // Check if user exists and belongs to the owner
    const existingUser = await prisma.user.findFirst({
      where: {
        id: parseInt(id),
        ownerId: req.user.id
      }
    });
    console.log("mamala set")

    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Delete user (cascade will handle relationships)
    await prisma.user.delete({
      where: {
        id: parseInt(id)
      }
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const followUser = async (req, res) => {
  try {
    console.log("FOllow user is called")
    const { id } = req.params;
    const { followerId } = req.body;

    // Validate that both users exist and belong to the owner
    const [userToFollow, followerUser] = await Promise.all([
      prisma.user.findFirst({
        where: { id: parseInt(id), ownerId: req.user.id }
      }),
      prisma.user.findFirst({
        where: { id: parseInt(followerId), ownerId: req.user.id }
      })
    ]);

    if (!userToFollow || !followerUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (parseInt(id) === parseInt(followerId)) {
      return res.status(400).json({ error: 'User cannot follow themselves' });
    }

    // Check if already following
    const existingRelation = await prisma.user.findFirst({
      where: {
        id: parseInt(followerId),
        following: {
          some: {
            id: parseInt(id)
          }
        }
      }
    });

    if (existingRelation) {
      return res.status(400).json({ error: 'User is already following this person' });
    }

    // Update the relationship
    await prisma.user.update({
      where: { id: parseInt(followerId) },
      data: {
        following: {
          connect: { id: parseInt(id) }
        }
      }
    });

    res.json({ message: 'Successfully followed user' });
  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const unfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { followerId } = req.body;

    // Validate that both users exist and belong to the owner
    const [userToUnfollow, followerUser] = await Promise.all([
      prisma.user.findFirst({
        where: { id: parseInt(id), ownerId: req.user.id }
      }),
      prisma.user.findFirst({
        where: { id: parseInt(followerId), ownerId: req.user.id }
      })
    ]);

    if (!userToUnfollow || !followerUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the relationship
    await prisma.user.update({
      where: { id: parseInt(followerId) },
      data: {
        following: {
          disconnect: { id: parseInt(id) }
        }
      }
    });

    res.json({ message: 'Successfully unfollowed user' });
  } catch (error) {
    console.error('Unfollow user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserStats = async (req, res) => {
  try {
    const stats = await prisma.user.aggregate({
      where: {
        ownerId: req.user.id
      },
      _count: {
        id: true
      }
    });

    const totalFollowConnections = await prisma.user.findMany({
      where: {
        ownerId: req.user.id
      },
      select: {
        _count: {
          select: {
            following: true,
            followers: true
          }
        }
      }
    });

    const totalFollowing = totalFollowConnections.reduce((sum, user) => sum + user._count.following, 0);
    const totalFollowers = totalFollowConnections.reduce((sum, user) => sum + user._count.followers, 0);

    res.json({
      totalUsers: stats._count.id,
      totalFollowingConnections: totalFollowing,
      totalFollowerConnections: totalFollowers,
      averageFollowingPerUser: stats._count.id > 0 ? (totalFollowing / stats._count.id).toFixed(2) : 0,
      averageFollowersPerUser: stats._count.id > 0 ? (totalFollowers / stats._count.id).toFixed(2) : 0
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  followUser,
  unfollowUser,
  getUserStats
};