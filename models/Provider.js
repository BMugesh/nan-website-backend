const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const providerSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, 'Please provide first name'],
            trim: true,
        },
        lastName: {
            type: String,
            required: [true, 'Please provide last name'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Please provide email'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email',
            ],
        },
        password: {
            type: String,
            required: [true, 'Please provide password'],
            minlength: 6,
            select: false, // Don't return password by default
        },
        specialization: {
            type: String,
        },
        licenseNumber: {
            type: String,
        },
        yearsOfExperience: {
            type: Number,
            min: 0,
        },
        hospitalAffiliation: {
            type: String,
        },
        bio: {
            type: String,
        },
        assignedPatients: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Patient',
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
providerSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare password
providerSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Provider', providerSchema);
