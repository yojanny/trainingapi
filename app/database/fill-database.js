'use strict';

async function main() {
  let workoutsData = require('./workouts-data.json');

  workoutsData.map((workout) => {
    console.log(workout);
  });
}

main();
