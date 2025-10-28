import { test, expect } from '@playwright/test';

test.describe('MiDoc Patient Signup Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the signup page
    await page.goto('https://midoc-patientapp-dev.azurewebsites.net/login');
    // Assuming there's a signup link, click it to reach registration form
    await page.getByRole('link', { name: /sign up/i }).click();
  });

  test('successful user registration with valid data', async ({ page }) => {
    // Generate unique email to avoid conflicts
    const uniqueEmail = `test.user${Date.now()}@example.com`;

    // Fill in registration form
    await page.getByLabel('First Name').fill('Test');
    await page.getByLabel('Last Name').fill('User');
    await page.getByLabel('Email').fill(uniqueEmail);
    await page.getByLabel(/password/i).fill('Test@123456');
    await page.getByLabel(/confirm password/i).fill('Test@123456');

    // Accept terms if present
    const termsCheckbox = page.getByRole('checkbox', { name: /terms/i });
    if (await termsCheckbox.isVisible())
      await termsCheckbox.check();

    // Submit form
    await page.getByRole('button', { name: /sign up|register/i }).click();

    // Verify successful registration
    await expect(page.getByText(/registration successful|verification email/i)).toBeVisible();
  });

  test('email validation checks', async ({ page }) => {
    // Test invalid email formats
    const invalidEmails = [
      '',
      'invalid',
      'invalid@',
      'invalid@.com',
      '@domain.com'
    ];

    for (const email of invalidEmails) {
      await page.getByLabel('Email').fill(email);
      await page.getByRole('button', { name: /sign up|register/i }).click();
      await expect(page.getByText(/invalid email|email required/i)).toBeVisible();
    }
  });

  test('password validation checks', async ({ page }) => {
    // Fill other required fields first
    await page.getByLabel('First Name').fill('Test');
    await page.getByLabel('Last Name').fill('User');
    await page.getByLabel('Email').fill('test@example.com');

    // Test password validations
    const invalidPasswords = [
      '',                 // Empty password
      '12345',           // Too short
      'password123',     // Common password
      'nocapital123',    // Missing capital letter
      'NOCAPS123'        // Missing lowercase letter
    ];

    for (const password of invalidPasswords) {
      await page.getByLabel(/password/i).fill(password);
      await page.getByLabel(/confirm password/i).fill(password);
      await page.getByRole('button', { name: /sign up|register/i }).click();
      await expect(page.getByText(/password requirements|invalid password/i)).toBeVisible();
    }
  });

  test('password mismatch validation', async ({ page }) => {
    // Fill form with mismatched passwords
    await page.getByLabel('First Name').fill('Test');
    await page.getByLabel('Last Name').fill('User');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel(/password/i).fill('Test@123456');
    await page.getByLabel(/confirm password/i).fill('Test@123457');

    await page.getByRole('button', { name: /sign up|register/i }).click();
    await expect(page.getByText(/passwords do not match/i)).toBeVisible();
  });

  test('special characters in name fields', async ({ page }) => {
    const specialName = 'José María';
    
    await page.getByLabel('First Name').fill(specialName);
    await page.getByLabel('Last Name').fill('O\'Connor-Smith');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel(/password/i).fill('Test@123456');
    await page.getByLabel(/confirm password/i).fill('Test@123456');

    await page.getByRole('button', { name: /sign up|register/i }).click();
    
    // Verify form submission is allowed with special characters
    await expect(page.getByText(/invalid name/i)).not.toBeVisible();
  });

  test('duplicate email registration', async ({ page }) => {
    // Use a consistent email for duplicate test
    const email = 'existing@example.com';

    // First registration
    await page.getByLabel('First Name').fill('Test');
    await page.getByLabel('Last Name').fill('User');
    await page.getByLabel('Email').fill(email);
    await page.getByLabel(/password/i).fill('Test@123456');
    await page.getByLabel(/confirm password/i).fill('Test@123456');

    await page.getByRole('button', { name: /sign up|register/i }).click();

    // Navigate back to signup and try registering with same email
    await page.goto('https://midoc-patientapp-dev.azurewebsites.net/login');
    await page.getByRole('link', { name: /sign up/i }).click();

    // Attempt second registration
    await page.getByLabel('First Name').fill('Test');
    await page.getByLabel('Last Name').fill('User');
    await page.getByLabel('Email').fill(email);
    await page.getByLabel(/password/i).fill('Test@123456');
    await page.getByLabel(/confirm password/i).fill('Test@123456');

    await page.getByRole('button', { name: /sign up|register/i }).click();
    await expect(page.getByText(/email already registered|already exists/i)).toBeVisible();
  });

  test('form interaction tests', async ({ page }) => {
    // Fill form partially
    await page.getByLabel('First Name').fill('Test');
    await page.getByLabel('Last Name').fill('User');
    
    // Test page refresh
    await page.reload();
    
    // Verify form is cleared after refresh
    await expect(page.getByLabel('First Name')).toBeEmpty();
    
    // Test rapid form submissions
    await page.getByLabel('First Name').fill('Test');
    await page.getByLabel('Last Name').fill('User');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel(/password/i).fill('Test@123456');
    await page.getByLabel(/confirm password/i).fill('Test@123456');
    
    // Multiple rapid clicks on submit button
    await Promise.all([
      page.getByRole('button', { name: /sign up|register/i }).click(),
      page.getByRole('button', { name: /sign up|register/i }).click(),
      page.getByRole('button', { name: /sign up|register/i }).click()
    ]);
    
    // Verify no duplicate submissions
    await expect(page.getByText(/multiple submissions detected/i)).toBeVisible();
  });

  test('security validation', async ({ page }) => {
    // Test XSS attempt in input fields
    const xssScript = '<script>alert("xss")</script>';
    
    await page.getByLabel('First Name').fill(xssScript);
    await page.getByLabel('Last Name').fill(xssScript);
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel(/password/i).fill('Test@123456');
    await page.getByLabel(/confirm password/i).fill('Test@123456');
    
    await page.getByRole('button', { name: /sign up|register/i }).click();
    
    // Verify XSS content is properly sanitized
    await expect(page.getByText(xssScript)).not.toBeVisible();
    
    // Verify HTTPS connection
    expect(page.url()).toMatch(/^https:/);
  });
});