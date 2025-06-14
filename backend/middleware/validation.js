// Validation middleware functions

const validateSignup = (req, res, next) => {
  const { name, email, password, organizationName } = req.body;

  if (!name || !email || !password || !organizationName) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address' });
  }

  next();
};

const validateLogin = (req, res, next) => {
  console.log("val login");
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  next();
};

const validateCreateUser = (req, res, next) => {
  console.log("user is validated")
  const { name, email, phone, dateOfBirth } = req.body;

  // if (!name || !email || !phone || !dateOfBirth) {
  //   return res.status(400).json({ error: 'All fields are required' });
  // }


  // const dob = new Date(dateOfBirth);
  // if (isNaN(dob.getTime())) {
  //   return res.status(400).json({ error: 'Please provide a valid date of birth' });
  // }
    console.log("user is validated success")


  next();
};

const validateUpdateUser = (req, res, next) => {
  const { name, email, phone, dateOfBirth } = req.body;

  // At least one field should be provided for update
  if (!name && !email && !phone && !dateOfBirth) {
    return res.status(400).json({ error: 'At least one field is required for update' });
  }

  // Validate date of birth if provided
  if (dateOfBirth) {
    const dob = new Date(dateOfBirth);
    if (isNaN(dob.getTime())) {
      return res.status(400).json({ error: 'Please provide a valid date of birth' });
    }

    if (dob > new Date()) {
      return res.status(400).json({ error: 'Date of birth cannot be in the future' });
    }
  }

  next();
};

const validateUserId = (req, res, next) => {
  const { id } = req.params;

  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ error: 'Valid user ID is required' });
  }

  next();
};

const validateFollowRequest = (req, res, next) => {
  const { followerId } = req.body;

  if (!followerId || isNaN(parseInt(followerId))) {
    return res.status(400).json({ error: 'Valid follower ID is required' });
  }

  next();
};

module.exports = {
  validateSignup,
  validateLogin,
  validateCreateUser,
  validateUpdateUser,
  validateUserId,
  validateFollowRequest
};