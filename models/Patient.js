const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const patientSchema = new mongoose.Schema(
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
        dateOfBirth: {
            type: Date,
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'other'],
        },
        phone: {
            type: String,
        },
        address: {
            type: String,
        },
        vitals: {
            heartRate: {
                type: Number,
                min: 0,
                max: 300,
            },
            bloodPressure: {
                type: String,
            },
            temperature: {
                type: Number,
                min: 0,
                max: 150,
            },
            oxygenLevel: {
                type: Number,
                min: 0,
                max: 100,
            },
        },
        vitalsHistory: [
            {
                heartRate: Number,
                timestamp: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        medicalHistory: [
            {
                condition: {
                    type: String,
                    required: true,
                },
                diagnosedDate: {
                    type: Date,
                },
                notes: {
                    type: String,
                },
                addedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
patientSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare password
patientSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Patient', patientSchema);
