const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full Name is required'],
      minlength: [2, 'Full Name must be at least 2 characters'],
      maxlength: [100, 'Full Name must be at most 100 characters'],
      trim: true,
    },
    memberId: {
      type: Number,
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    phone: {
      type: Number,
      required: [true, 'Phone Number is required'],
      validate: {
        validator: function(v) {
          return /^\d{10}$/.test(v.toString());
        },
        message: 'Phone Number must be exactly 10 digits'
      }
    },
    membershipType: {
      type: String,
      required: [true, 'Membership Type is required'],
      enum: {
        values: ['Student', 'Faculty', 'Public'],
        message: 'Membership Type must be one of: Student, Faculty, Public',
      },
    },
  },
  { timestamps: true }
);

// Auto-generate memberId before saving
memberSchema.pre('save', async function () {
  if (!this.memberId) {
    const lastMember = await mongoose.model('Member').findOne().sort({ memberId: -1 });
    this.memberId = lastMember ? lastMember.memberId + 1 : 1001;
  }
});

module.exports = mongoose.model('Member', memberSchema);
