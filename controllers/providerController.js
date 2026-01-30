const Provider = require('../models/Provider');
const Patient = require('../models/Patient');

// @desc    Get provider by ID
// @route   GET /api/providers/:id
// @access  Private
exports.getProviderById = async (req, res) => {
    try {
        const provider = await Provider.findById(req.params.id)
            .select('-password')
            .populate('assignedPatients', 'firstName lastName email');

        if (!provider) {
            return res.status(404).json({
                success: false,
                message: 'Provider not found',
            });
        }

        res.status(200).json({
            success: true,
            data: provider,
        });
    } catch (error) {
        console.error('Get provider error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

// @desc    Update provider profile (complete profile after signup)
// @route   PUT /api/providers/:id/profile
// @access  Private
exports.updateProviderProfile = async (req, res) => {
    try {
        const {
            specialization,
            licenseNumber,
            yearsOfExperience,
            hospitalAffiliation,
            bio,
        } = req.body;

        const provider = await Provider.findById(req.params.id);

        if (!provider) {
            return res.status(404).json({
                success: false,
                message: 'Provider not found',
            });
        }

        // Update professional fields
        if (specialization) provider.specialization = specialization;
        if (licenseNumber) provider.licenseNumber = licenseNumber;
        if (yearsOfExperience !== undefined)
            provider.yearsOfExperience = yearsOfExperience;
        if (hospitalAffiliation) provider.hospitalAffiliation = hospitalAffiliation;
        if (bio) provider.bio = bio;

        await provider.save();

        res.status(200).json({
            success: true,
            data: provider,
        });
    } catch (error) {
        console.error('Update provider profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

// @desc    Get assigned patients for a provider
// @route   GET /api/providers/:id/patients
// @access  Private
exports.getAssignedPatients = async (req, res) => {
    try {
        const provider = await Provider.findById(req.params.id).populate(
            'assignedPatients',
            '-password'
        );

        if (!provider) {
            return res.status(404).json({
                success: false,
                message: 'Provider not found',
            });
        }

        res.status(200).json({
            success: true,
            count: provider.assignedPatients.length,
            data: provider.assignedPatients,
        });
    } catch (error) {
        console.error('Get assigned patients error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

// @desc    Assign patient to provider
// @route   POST /api/providers/:id/patients/:patientId
// @access  Private
exports.assignPatient = async (req, res) => {
    try {
        const { id, patientId } = req.params;

        const provider = await Provider.findById(id);
        const patient = await Patient.findById(patientId);

        if (!provider) {
            return res.status(404).json({
                success: false,
                message: 'Provider not found',
            });
        }

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found',
            });
        }

        // Check if patient is already assigned
        if (provider.assignedPatients.includes(patientId)) {
            return res.status(400).json({
                success: false,
                message: 'Patient already assigned to this provider',
            });
        }

        // Assign patient
        provider.assignedPatients.push(patientId);
        await provider.save();

        res.status(200).json({
            success: true,
            data: provider,
        });
    } catch (error) {
        console.error('Assign patient error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};
