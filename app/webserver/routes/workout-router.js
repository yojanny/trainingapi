'user strict';

const express = require('express');

//modulo para subir archivos (imagenes)
const multer = require('multer');

const checkAccountSession = require('../controllers/account/check-account-session');

const createWorkout = require('../controllers/workout/create-workout-controller');

const deleteWorkout = require('../controllers/workout/delete-workout-controller')

const upload = multer();

const router = express.Router();

router.post('/workouts', checkAccountSession, upload.single('image'), createWorkout);

router.delete('/workouts/:workoutId', checkAccountSession,deleteWorkout);

module.exports = router;