'user strict';

const express = require('express');

//modulo para subir archivos (imagenes)
const multer = require('multer');

const checkAccountSession = require('../controllers/account/check-account-session');

const createWorkout = require('../controllers/workout/create-workout-controller');

const deleteWorkout = require('../controllers/workout/delete-workout-controller');

const getWorkouts = require('../controllers/workout/get-workouts-controller');

const getWorkoutDetails = require('../controllers/workout/get-workout-details-controller');

const updateWorkout = require('../controllers/workout/update-workout-controller');

const upload = multer();

const router = express.Router();

router.post('/workouts', checkAccountSession, upload.single('image'), createWorkout);

router.delete('/workouts/:workoutId', checkAccountSession,deleteWorkout);

router.get('/workouts', checkAccountSession, getWorkouts);

router.get('/workouts/:workoutId', checkAccountSession, getWorkoutDetails);

router.put('/workouts/:workoutId', checkAccountSession, updateWorkout)

module.exports = router;