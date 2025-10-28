# MiDoc Patient Website - Signup Flow Test Plan

## Application Overview

The MiDoc Patient Website provides a healthcare platform for patient registration and management. This test plan focuses on the signup flow, ensuring new patients can successfully create accounts and access the system.

## Test Environment
- Application URL: https://midoc-patientapp-dev.azurewebsites.net/login
- Browser: Chrome (latest version)
- Test Environment: Development

## Test Scenarios

### 1. Basic Signup Flow

#### 1.1 Navigate to Signup Page
**Steps:**
1. Open the MiDoc Patient website
2. Click on the "Sign Up" or registration link
3. Verify the signup form is displayed

**Expected Results:**
- Registration form should be visible
- All required fields should be clearly marked
- Form should be properly formatted and readable

#### 1.2 Valid User Registration
**Steps:**
1. Enter valid information in all required fields:
   - First Name
   - Last Name
   - Email Address
   - Password (following password requirements)
   - Confirm Password
2. Accept terms and conditions if present
3. Click "Sign Up" or "Register" button

**Expected Results:**
- Form submission successful
- User receives confirmation message
- User is redirected to appropriate page (dashboard/verification page)
- Confirmation email is sent to registered email address

### 2. Validation Testing

#### 2.1 Email Validation
**Steps:**
1. Attempt registration with:
   - Empty email field
   - Invalid email format (no @)
   - Invalid email format (no domain)
   - Already registered email

**Expected Results:**
- Appropriate error messages for each case
- Form doesn't submit with invalid data
- Clear instructions for correction

#### 2.2 Password Validation
**Steps:**
1. Test password requirements:
   - Too short password
   - Missing required characters (if specified)
   - Password/confirm password mismatch
   - Common passwords (if restricted)

**Expected Results:**
- Clear error messages indicating password requirements
- Password strength indicator (if present)
- Mismatch notification for confirm password

### 3. Edge Cases

#### 3.1 Special Characters Handling
**Steps:**
1. Test name fields with:
   - Special characters (é, ñ, etc.)
   - Numbers
   - Symbols
2. Submit form

**Expected Results:**
- System properly handles or restricts special characters
- Clear feedback on allowed characters
- Consistent display of entered data

#### 3.2 Form Interaction
**Steps:**
1. Test form behavior:
   - Refresh page during form fill
   - Use browser back/forward buttons
   - Multiple rapid form submissions
   - Session timeout scenarios

**Expected Results:**
- Data persistence as appropriate
- No duplicate submissions
- Clear error handling
- User-friendly timeout messages

### 4. Security Testing

#### 4.1 Basic Security Checks
**Steps:**
1. Test for:
   - SQL injection in input fields
   - XSS vulnerability
   - Session handling
2. Verify secure connection (HTTPS)

**Expected Results:**
- Input sanitization
- Secure data transmission
- Protected against common security threats

## Success Criteria
1. All test cases pass successfully
2. No critical security vulnerabilities
3. Clear error messages for all validation failures
4. Consistent behavior across supported browsers
5. Successful account creation and email verification

## Notes
- All tests should be performed in a clean browser session
- Test data should be cleaned up after testing
- Document any deviations from expected behavior
- Record specific browser/OS combinations where issues occur

## Assumptions
1. Test environment is stable and accessible
2. Test data can be cleaned up after testing
3. Email service is configured and functional
4. Basic security measures are in place

## Reporting
- Document all test results
- Include screenshots of errors
- Note any inconsistencies or unexpected behavior
- Track test execution time and date