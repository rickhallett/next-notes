// Define the available event XP options
const EVENT_XP_OPTIONS = [10, 100, 1000, 10000];

// Simulation Parameters
const INITIAL_SCORE = 250000; // Starting at "Princess" level
const NUM_EVENTS = Math.floor(365);

// Formula Parameters
const FORMULA_TYPE = "logarithmic"; // Options: 'sublinear', 'logarithmic'
const FORMULA_PARAMS = {
  k: 1, // Scaling factor
  exponent: 0.9, // Only for sublinear
};

// Function to calculate actual gain based on the formula
function calculateActualGain(currentScore, eventXP, formulaType, params) {
  const { k, exponent } = params;

  if (formulaType === "sublinear") {
    const newScore = currentScore + eventXP;
    return (
      k * (Math.pow(newScore, exponent) - Math.pow(currentScore, exponent))
    );
  } else if (formulaType === "logarithmic") {
    return (
      k *
      (Math.log10(currentScore + eventXP + 1) - Math.log10(currentScore + 1))
    );
  } else {
    throw new Error("Unsupported formula type");
  }
}

// Function to simulate events
function simulateEvents(
  initialScore,
  numEvents,
  eventOptions,
  formulaType,
  formulaParams
) {
  let currentScore = initialScore;
  let totalActualGain = 0;

  console.log(`Starting Simulation with Initial Score: ${currentScore}`);
  console.log(
    `Formula: ${formulaType} (Parameters: ${JSON.stringify(formulaParams)})\n`
  );
  console.log(
    `| Event | Event XP | Actual Gain | Score Before | Score After |`
  );
  console.log(
    `|-------|----------|-------------|--------------|-------------|`
  );

  let eventXPTotal = 0;

  for (let i = 1; i <= numEvents; i++) {
    // Randomly select an event XP
    const eventXP = 1000;
    // eventOptions[Math.floor(Math.random() * eventOptions.length)];

    eventXPTotal += eventXP;

    // Calculate actual gain
    const actualGain = calculateActualGain(
      currentScore,
      eventXP,
      formulaType,
      formulaParams
    );

    // Update scores
    const scoreBefore = currentScore.toFixed(2);
    currentScore += actualGain;
    const scoreAfter = currentScore.toFixed(2);
    totalActualGain += actualGain;

    // Print event details
    console.log(
      `| ${i}     | ${eventXP}      | ${actualGain.toFixed(
        4
      )}       | ${scoreBefore}   | ${scoreAfter}   |`
    );
  }

  console.log(`\nEvent XP Allocated: ${eventXPTotal}`);
  console.log(`Total Actual Gain: ${totalActualGain.toFixed(4)}`);
  console.log(`Final Score: ${currentScore.toFixed(2)}`);
}

// Run the simulation
simulateEvents(
  INITIAL_SCORE,
  NUM_EVENTS,
  EVENT_XP_OPTIONS,
  FORMULA_TYPE,
  FORMULA_PARAMS
);
