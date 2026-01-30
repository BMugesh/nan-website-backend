const Patient = require('../models/Patient');
const Provider = require('../models/Provider');
const { generateToken } = require('../middleware/auth');

// @desc    Register patient
// @route   POST /api/auth/register/patient
// @access  Public
exports.registerPatient = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            dateOfBirth,
            gender,
            phone,
            address,
        } = req.body;

        // Check if patient already exists
        const existingPatient = await Patient.findOne({ email });
        if (existingPatient) {
            return res.status(400).json({
                success: false,
                error: 'Patient with this email already exists',
            });
        }

        // Create patient
        const patient = await Patient.create({
            firstName,
            lastName,
            email,
            password,
            dateOfBirth,
            gender,
            phone,
            address,
        });

        // Generate token
        const token = generateToken(patient._id, 'patient');

        res.status(201).json({
            success: true,
            user: {
                id: patient._id,
                firstName: patient.firstName,
                lastName: patient.lastName,
                email: patient.email,
                dateOfBirth: patient.dateOfBirth,
                gender: patient.gender,
                phone: patient.phone,
                address: patient.address,
            },
            token,
        });
    } catch (error) {
        console.error('Patient registration error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Server error during registration',
        });
    }
};

// @desc    Register provider
// @route   POST /api/auth/register/provider
// @access  Public
exports.registerProvider = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Check if provider already exists
        const existingProvider = await Provider.findOne({ email });
        if (existingProvider) {
            return res.status(400).json({
                success: false,
                error: 'Provider with this email already exists',
            });
        }

        // Create provider with minimal data
        const provider = await Provider.create({
            firstName,
            lastName,
            email,
            password,
        });

        // Generate token
        const token = generateToken(provider._id, 'provider');

        res.status(201).json({
            success: true,
            user: {
                id: provider._id,
                firstName: provider.firstName,
                lastName: provider.lastName,
                email: provider.email,
            },
            token,
        });
    } catch (error) {
        console.error('Provider registration error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Server error during registration',
        });
    }
};

// @desc    Login user (patient or provider)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password, userType } = req.body;

        // Validate input
        if (!email || !password || !userType) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email, password, and user type',
            });
        }

        let user;
        let Model;

        // Determine which model to use
        if (userType === 'patient') {
            Model = Patient;
        } else if (userType === 'provider') {
            Model = Provider;
        } else {
            return res.status(400).json({
                success: false,
                message: 'Invalid user type',
            });
        }

        // Find user and include password
        user = await Model.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // Check password
        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // Generate token
        const token = generateToken(user._id, userType);

        // Prepare user data (exclude password)
        const userData = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        };

        // Add additional fields based on user type
        if (userType === 'patient') {
            userData.dateOfBirth = user.dateOfBirth;
            userData.gender = user.gender;
            userData.phone = user.phone;
            userData.address = user.address;
        } else if (userType === 'provider') {
            userData.specialization = user.specialization;
            userData.licenseNumber = user.licenseNumber;
            userData.yearsOfExperience = user.yearsOfExperience;
            userData.hospitalAffiliation = user.hospitalAffiliation;
            userData.bio = user.bio;
        }

        res.status(200).json({
            success: true,
            user: userData,
            token,
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login',
        });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = req.user;
        const userType = req.userType;

        const userData = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            userType,
        };

        // Add additional fields based on user type
        if (userType === 'patient') {
            userData.dateOfBirth = user.dateOfBirth;
            userData.gender = user.gender;
            userData.phone = user.phone;
            userData.address = user.address;
            userData.vitals = user.vitals;
            userData.medicalHistory = user.medicalHistory;
        } else if (userType === 'provider') {
            userData.specialization = user.specialization;
            userData.licenseNumber = user.licenseNumber;
            userData.yearsOfExperience = user.yearsOfExperience;
            userData.hospitalAffiliation = user.hospitalAffiliation;
            userData.bio = user.bio;
            userData.assignedPatients = user.assignedPatients;
        }

        res.status(200).json({
            success: true,
            user: userData,
        });
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};
