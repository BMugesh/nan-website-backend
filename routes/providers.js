const express = require('express');
const {
    getProviderById,
    updateProviderProfile,
    getAssignedPatients,
    assignPatient,
} = require('../controllers/providerController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.get('/:id', protect, getProviderById);
router.put('/:id/profile', protect, updateProviderProfile);
router.get('/:id/patients', protect, getAssignedPatients);
router.post('/:id/patients/:patientId', protect, assignPatient);

module.exports = router;
