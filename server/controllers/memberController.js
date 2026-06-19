const Member = require('../models/Member');

// Fetch all active library members, newest first
const getMembers = async (req, res, next) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (error) {
    next(error);
  }
};

// Register a new member with strict validations on phone/email
const createMember = async (req, res, next) => {
  try {
    const { fullName, email, phone, membershipType } = req.body;

    // Validate required fields
    if (!fullName || !email || phone === undefined || phone === null || phone === '' || !membershipType) {
      res.status(400);
      throw new Error('Please provide all required fields: fullName, email, phone, membershipType');
    }

    // Validate fullName
    if (typeof fullName !== 'string' || fullName.length < 2 || fullName.length > 100) {
      res.status(400);
      throw new Error('Full Name must be between 2 and 100 characters');
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      res.status(400);
      throw new Error('Please provide a valid email address');
    }

    // Check email uniqueness
    const existingMember = await Member.findOne({ email });
    if (existingMember) {
      res.status(400);
      throw new Error('A member with this email already exists');
    }

    // Validate phone (exactly 10 digits, numeric only)
    const phoneNum = Number(phone);
    if (!Number.isInteger(phoneNum) || phoneNum < 1000000000 || phoneNum > 9999999999) {
      res.status(400);
      throw new Error('Phone Number must be exactly 10 digits');
    }

    // Validate membershipType
    const validTypes = ['Student', 'Faculty', 'Public'];
    if (!validTypes.includes(membershipType)) {
      res.status(400);
      throw new Error('Membership Type must be one of: Student, Faculty, Public');
    }

    const member = await Member.create({ fullName, email, phone: phoneNum, membershipType });

    res.status(201).json(member);
  } catch (error) {
    next(error);
  }
};

// Update an existing member's info
const updateMember = async (req, res, next) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      res.status(404);
      throw new Error('Member not found');
    }

    const { fullName, email, phone, membershipType } = req.body;

    // Validate fullName if provided
    if (fullName !== undefined) {
      if (typeof fullName !== 'string' || fullName.length < 2 || fullName.length > 100) {
        res.status(400);
        throw new Error('Full Name must be between 2 and 100 characters');
      }
    }

    // Validate email if provided
    if (email !== undefined) {
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) {
        res.status(400);
        throw new Error('Please provide a valid email address');
      }

      // Check email uniqueness if changed
      if (email !== member.email) {
        const existingMember = await Member.findOne({ email });
        if (existingMember) {
          res.status(400);
          throw new Error('A member with this email already exists');
        }
      }
    }

    // Validate phone if provided (exactly 10 digits, numeric only)
    let phoneNum;
    if (phone !== undefined) {
      phoneNum = Number(phone);
      if (!Number.isInteger(phoneNum) || phoneNum < 1000000000 || phoneNum > 9999999999) {
        res.status(400);
        throw new Error('Phone Number must be exactly 10 digits');
      }
    }

    // Validate membershipType if provided
    if (membershipType !== undefined) {
      const validTypes = ['Student', 'Faculty', 'Public'];
      if (!validTypes.includes(membershipType)) {
        res.status(400);
        throw new Error('Membership Type must be one of: Student, Faculty, Public');
      }
    }

    const updatedMember = await Member.findByIdAndUpdate(
      req.params.id,
      {
        fullName,
        email,
        phone: phoneNum !== undefined ? phoneNum : undefined,
        membershipType,
      },
      { new: true, runValidators: true }
    );

    res.json(updatedMember);
  } catch (error) {
    next(error);
  }
};

// Delete a member record from the DB
const deleteMember = async (req, res, next) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      res.status(404);
      throw new Error('Member not found');
    }

    await Member.findByIdAndDelete(req.params.id);

    res.json({ message: 'Member removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMembers, createMember, updateMember, deleteMember };
