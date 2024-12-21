#!/usr/bin/env node

import inquirer from 'inquirer';
import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:3000/api';

async function mainMenu() {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'Create profile',
        'Get profile for user',
        'List all profiles',
        'Update profile',
        'Update profile by Stripe ID',
        'Delete profile',
        'Exit'
      ]
    }
  ]);

  switch (action) {
    case 'Create profile':
      await createProfile();
      break;
    case 'Get profile for user':
      await getProfile();
      break;
    case 'List all profiles':
      await listProfiles();
      break;
    case 'Update profile':
      await updateProfile();
      break;
    case 'Update profile by Stripe ID':
      await updateProfileByStripeId();
      break;
    case 'Delete profile':
      await deleteProfile();
      break;
    case 'Exit':
      process.exit(0);
  }

  // Return to main menu after action completes
  await mainMenu();
}

async function createProfile() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'userId',
      message: 'Enter user ID:',
      validate: (input) => input.length > 0
    },
    {
      type: 'input',
      name: 'email',
      message: 'Enter email:',
      validate: (input) => input.includes('@')
    },
    {
      type: 'list',
      name: 'membership',
      message: 'Select membership type:',
      choices: ['free', 'pro', 'enterprise']
    },
    {
      type: 'input',
      name: 'stripeCustomerId',
      message: 'Enter Stripe customer ID (optional):',
    }
  ]);

  const response = await fetch(`${API_BASE_URL}/profiles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: answers.userId,
      email: answers.email,
      membership: answers.membership,
      stripeCustomerId: answers.stripeCustomerId || null
    })
  });
  const result = await response.json();
  console.log(result);
}

async function getProfile() {
  const { userId } = await inquirer.prompt([
    {
      type: 'input',
      name: 'userId',
      message: 'Enter user ID:',
      validate: (input) => input.length > 0
    }
  ]);

  const response = await fetch(`${API_BASE_URL}/profiles/${userId}`);
  const result = await response.json();
  console.log(result);
}

async function listProfiles() {
  const response = await fetch(`${API_BASE_URL}/profiles`);
  const result = await response.json();
  console.log(result);
}

async function updateProfile() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'userId',
      message: 'Enter user ID:',
      validate: (input) => input.length > 0
    },
    {
      type: 'checkbox',
      name: 'fieldsToUpdate',
      message: 'Select fields to update:',
      choices: ['email', 'membership', 'stripeCustomerId']
    }
  ]);

  const updateData = {};

  for (const field of answers.fieldsToUpdate) {
    if (field === 'membership') {
      const { membership } = await inquirer.prompt({
        type: 'list',
        name: 'membership',
        message: 'Select new membership type:',
        choices: ['free', 'pro', 'enterprise']
      });
      updateData.membership = membership;
    } else {
      const { value } = await inquirer.prompt({
        type: 'input',
        name: 'value',
        message: `Enter new ${field}:`,
        validate: (input) => {
          if (field === 'email') return input.includes('@');
          return input.length > 0;
        }
      });
      updateData[field] = value;
    }
  }

  const response = await fetch(`${API_BASE_URL}/profiles/${answers.userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData)
  });
  const result = await response.json();
  console.log(result);
}

async function updateProfileByStripeId() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'stripeCustomerId',
      message: 'Enter Stripe customer ID:',
      validate: (input) => input.length > 0
    },
    {
      type: 'checkbox',
      name: 'fieldsToUpdate',
      message: 'Select fields to update:',
      choices: ['email', 'membership']
    }
  ]);

  const updateData = {
    stripeCustomerId: answers.stripeCustomerId
  };

  for (const field of answers.fieldsToUpdate) {
    if (field === 'membership') {
      const { membership } = await inquirer.prompt({
        type: 'list',
        name: 'membership',
        message: 'Select new membership type:',
        choices: ['free', 'pro', 'enterprise']
      });
      updateData.membership = membership;
    } else {
      const { value } = await inquirer.prompt({
        type: 'input',
        name: 'value',
        message: `Enter new ${field}:`,
        validate: (input) => {
          if (field === 'email') return input.includes('@');
          return input.length > 0;
        }
      });
      updateData[field] = value;
    }
  }

  const response = await fetch(`${API_BASE_URL}/profiles/${answers.stripeCustomerId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData)
  });
  const result = await response.json();
  console.log(result);
}

async function deleteProfile() {
  const { userId } = await inquirer.prompt([
    {
      type: 'input',
      name: 'userId',
      message: 'Enter user ID:',
      validate: (input) => input.length > 0
    }
  ]);

  const response = await fetch(`${API_BASE_URL}/profiles/${userId}`, {
    method: 'DELETE'
  });
  const result = await response.json();
  console.log(result);
}

// Start the CLI
mainMenu().catch(console.error); 