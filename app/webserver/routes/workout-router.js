'user strict';

const express = require('express');

//modulo para subir archivos (imagenes)
const multer = require('multer');

const checkAccountSession = require('../controllers/account/check-account-session');

const createWorkout = require('../controllers/workout/create-workout-controller');

const deleteWorkout = require('../controllers/workout/delete-workout-controller');

const getWorkouts = require('../controllers/workout/get-workouts-controller');

const getWorkoutDetails = require('../controllers/workout/get-workout-details-controller');

const getWorkoutFilter = require('../controllers/workout/get-workout-filter-controller');

const postLike = require('../controllers/workout/post-like-controller');

const deleteLike = require('../controllers/workout/delete-like-controller');

const updateWorkout = require('../controllers/workout/update-workout-controller');

const upload = multer();

const router = express.Router();

router.post('/workouts', checkAccountSession, upload.single('image'), createWorkout);

router.delete('/workouts/:workoutId', checkAccountSession,deleteWorkout);

router.get('/workouts', checkAccountSession, getWorkouts);

router.get('/workouts/:workoutId', checkAccountSession, getWorkoutDetails);

router.get('/workout/:workoutParam', checkAccountSession, getWorkoutFilter);

router.post('/workout/:workoutId/like', checkAccountSession, postLike);

router.delete('/workout/:workoutId/like', checkAccountSession, deleteLike);

router.patch('/workout/:workoutId', checkAccountSession, updateWorkout);

module.exports = router;