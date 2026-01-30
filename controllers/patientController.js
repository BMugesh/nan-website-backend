const Patient = require('../models/Patient');

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private (Provider only)
exports.getAllPatients = async (req, res) => {
    try {
        const patients = await Patient.find().select('-password');

        res.status(200).json({
            success: true,
            count: patients.length,
            data: patients,
        });
    } catch (error) {
        console.error('Get all patients error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

// @desc    Get patient by ID
// @route   GET /api/patients/:id
// @access  Private
exports.getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id).select('-password');

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found',
            });
        }

        res.status(200).json({
            success: true,
            data: patient,
        });
    } catch (error) {
        console.error('Get patient error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

// @desc    Update patient profile
// @route   PUT /api/patients/:id
// @access  Private
exports.updatePatient = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, address, dateOfBirth, gender } =
            req.body;

        const patient = await Patient.findById(req.params.id);

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found',
            });
        }

        // Update fields
        if (firstName) patient.firstName = firstName;
        if (lastName) patient.lastName = lastName;
        if (email) patient.email = email;
        if (phone) patient.phone = phone;
        if (address) patient.address = address;
        if (dateOfBirth) patient.dateOfBirth = dateOfBirth;
        if (gender) patient.gender = gender;

        await patient.save();

        res.status(200).json({
            success: true,
            data: patient,
        });
    } catch (error) {
        console.error('Update patient error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

// @desc    Update patient vitals
// @route   PUT /api/patients/:id/vitals
// @access  Private
exports.updateVitals = async (req, res) => {
    try {
        const { heartRate, bloodPressure, temperature, oxygenLevel } = req.body;

        const patient = await Patient.findById(req.params.id);

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found',
            });
        }

        // Update vitals
        patient.vitals = {
            heartRate: heartRate || patient.vitals?.heartRate,
            bloodPressure: bloodPressure || patient.vitals?.bloodPressure,
            temperature: temperature || patient.vitals?.temperature,
            oxygenLevel: oxygenLevel || patient.vitals?.oxygenLevel,
        };

        // Add to history if heart rate is updated
        if (heartRate) {
            patient.vitalsHistory.push({
                heartRate,
                timestamp: new Date(),
            });
        }

        await patient.save();

        res.status(200).json({
            success: true,
            data: patient,
        });
    } catch (error) {
        console.error('Update vitals error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

// @desc    Add medical history entry
// @route   POST /api/patients/:id/medical-history
// @access  Private
exports.addMedicalHistory = async (req, res) => {
    try {
        const { condition, diagnosedDate, notes } = req.body;

        if (!condition) {
            return res.status(400).json({
                success: false,
                message: 'Please provide condition',
            });
        }

        const patient = await Patient.findById(req.params.id);

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found',
            });
        }

        // Add medical history entry
        patient.medicalHistory.push({
            condition,
            diagnosedDate,
            notes,
        });

        await patient.save();

        res.status(200).json({
            success: true,
            data: patient,
        });
    } catch (error) {
        console.error('Add medical history error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};
