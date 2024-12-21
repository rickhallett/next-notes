#!/usr/bin/env node

import inquirer from 'inquirer';
import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:3000/api'; // Adjust this to your API URL

async function mainMenu() {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'Create points entry',
        'Get points for user',
        'List all points',
        'Update points',
        'Increment points',
        'Delete points entry',
        'Exit'
      ]
    }
  ]);

  switch (action) {
    case 'Create points entry':
      await createPoints();
      break;
    case 'Get points for user':
      await getPoints();
      break;
    case 'List all points':
      await listPoints();
      break;
    case 'Update points':
      await updatePoints();
      break;
    case 'Increment points':
      await incrementPoints();
      break;
    case 'Delete points entry':
      await deletePoints();
      break;
    case 'Exit':
      process.exit(0);
  }

  // Return to main menu after action completes
  await mainMenu();
}

async function createPoints() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'userId',
      message: 'Enter user ID:',
      validate: (input) => input.length > 0
    },
    {
      type: 'number',
      name: 'points',
      message: 'Enter initial points:',
      default: 0
    }
  ]);

  const response = await fetch(`${API_BASE_URL}/points`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: answers.userId,
      points: answers.points
    })
  });
  const result = await response.json();
  console.log(result);
}

async function getPoints() {
  const { userId } = await inquirer.prompt([
    {
      type: 'input',
      name: 'userId',
      message: 'Enter user ID:',
      validate: (input) => input.length > 0
    }
  ]);

  const response = await fetch(`${API_BASE_URL}/points/${userId}`);
  const result = await response.json();
  console.log(result);
}

async function listPoints() {
  const response = await fetch(`${API_BASE_URL}/points`);
  const result = await response.json();
  console.log(result);
}

async function updatePoints() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'userId',
      message: 'Enter user ID:',
      validate: (input) => input.length > 0
    },
    {
      type: 'number',
      name: 'points',
      message: 'Enter new points value:',
      validate: (input) => !isNaN(input)
    }
  ]);

  const response = await fetch(`${API_BASE_URL}/points/${answers.userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      points: answers.points
    })
  });
  const result = await response.json();
  console.log(result);
}

async function incrementPoints() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'userId',
      message: 'Enter user ID:',
      validate: (input) => input.length > 0
    },
    {
      type: 'number',
      name: 'amount',
      message: 'Enter amount to increment:',
      validate: (input) => input !== undefined && !isNaN(input) && input > 0
    }
  ]);

  const response = await fetch(`${API_BASE_URL}/points/${answers.userId}/increment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: answers.amount
    })
  });
  const result = await response.json();
  console.log(result);
}

async function deletePoints() {
  const { userId } = await inquirer.prompt([
    {
      type: 'input',
      name: 'userId',
      message: 'Enter user ID:',
      validate: (input) => input.length > 0
    }
  ]);

  const response = await fetch(`${API_BASE_URL}/points/${userId}`, {
    method: 'DELETE'
  });
  const result = await response.json();
  console.log(result);
}

// Start the CLI
mainMenu().catch(console.error);