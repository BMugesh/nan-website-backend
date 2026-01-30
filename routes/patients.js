const express = require('express');
const {
    getAllPatients,
    getPatientById,
    updatePatient,
    updateVitals,
    addMedicalHistory,
} = require('../controllers/patientController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.get('/', protect, getAllPatients);
router.get('/:id', protect, getPatientById);
router.put('/:id', protect, updatePatient);
router.put('/:id/vitals', protect, updateVitals);
router.post('/:id/medical-history', protect, addMedicalHistory);

module.exports = router;
