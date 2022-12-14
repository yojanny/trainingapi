'user strict';

const express = require('express');
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
const checkAccountPermissions = require('../controllers/account/check-account-permissions');
const getWorkoutsFav = require('../controllers/workout/get-workouts-fav-controller');

const upload = multer();

const router = express.Router();

router.post(
  '/workout',
  checkAccountSession,
  checkAccountPermissions,
  upload.single('image'),
  createWorkout
);
router.delete(
  '/workout/:workoutId',
  checkAccountSession,
  checkAccountPermissions,
  deleteWorkout
);
router.get('/workouts', checkAccountSession, getWorkouts);
router.get('/workouts/:workoutId', checkAccountSession, getWorkoutDetails);
router.get(
  '/workout/:workoutFilter/:workoutParam',
  checkAccountSession,
  getWorkoutFilter
);
router.post('/workout/like/:workoutId', checkAccountSession, postLike);
router.delete('/workout/like/:workoutId', checkAccountSession, deleteLike);
router.patch(
  '/workout/:workoutId',
  checkAccountSession,
  checkAccountPermissions,
  upload.single('image'),
  updateWorkout
);
router.get('/workoutsFav', checkAccountSession, getWorkoutsFav);

module.exports = router;
