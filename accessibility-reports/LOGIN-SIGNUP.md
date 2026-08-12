# LOGIN & SIGN UP ACCESSIBILITY REPORT

## Pages Covered

- Login
- Sign Up (New Registration)

---

## Report Status

- [ ] Pending
- [ ] In Progress
- [x] Completed

---

# Issue 1

## Registration Form Validation and Submission

### Applicable Pages

- Sign Up (New Registration)

### WCAG

- 3.3.1 Error Identification
- 3.3.3 Error Suggestion
- 3.3.4 Error Prevention (where applicable)
- 4.1.2 Name, Role, Value

### Current Problem

The New Registration form accepts invalid values for:

- Email Address
- Mobile Number

The form does not validate these inputs correctly before submission.

Additionally:

- No error suggestions are displayed when invalid values are entered.
- After checking the Terms & Conditions checkbox and clicking Submit, the page automatically redirects to the Terms & Conditions page instead of submitting the registration form.
- The registration form submission flow is therefore broken.

### Why this is a problem

- Users can enter invalid registration data.
- Users are not informed how to correct invalid input.
- The registration process cannot be completed successfully.
- Redirecting users to the Terms & Conditions page instead of submitting the form creates a broken user experience.

### Required Fix

Review the complete registration workflow and:

- Validate the Email Address field before submission.
- Validate the Mobile Number field before submission.
- Prevent invalid data from being submitted.
- Ensure the Submit button submits the registration form instead of redirecting to the Terms & Conditions page.
- Verify the Terms & Conditions checkbox is correctly linked to the registration workflow.
- Ensure users remain on the registration page when validation fails.
- Display clear validation messages beside the relevant fields.
- Display success or failure messages after form submission.

### Developer Notes

Review:

- Frontend validation
- Backend validation
- Form action
- Form submit handler
- Terms & Conditions checkbox behavior
- Routing configuration
- API integration
- Form state management

Ensure that accepting the Terms & Conditions is a prerequisite for submission, but checking the checkbox must not navigate away from the registration page.

### Testing Checklist

- [x] Invalid email cannot be submitted
- [x] Invalid mobile number cannot be submitted
- [x] Registration submits successfully
- [x] Submit button does not redirect to Terms & Conditions
- [x] Terms & Conditions checkbox functions correctly
- [x] Success message displayed
- [x] Failure message displayed
- [x] Form remains on the page when validation fails

Status:

- [x] Fixed

---

# Issue 2

## Email and Mobile Number Error Suggestions

### Applicable Pages

- Sign Up (New Registration)

### WCAG

- 3.3.1 Error Identification
- 3.3.3 Error Suggestion

### Current Problem

The Email Address and Mobile Number fields do not provide meaningful error suggestions when invalid data is entered.

The accessibility audit specifically recommends providing guidance to users on the expected input format.

### Why this is a problem

- Users are informed that input is invalid but are not told how to correct it.
- Screen reader users receive insufficient guidance.
- The form does not meet WCAG requirements for error suggestions.

### Required Fix

Provide meaningful validation messages and guidance.

Recommended examples from the accessibility audit:

For Email:

"Enter your email in the format name@example.com."

For Mobile Number:

"Enter your 10-digit mobile number."

Display these messages whenever validation fails.

Ensure they are associated with the corresponding input using accessible techniques such as:

- aria-describedby
- aria-invalid
- Accessible live error messages where appropriate

### Developer Notes

Validation should occur:

- On form submission
- On field blur (recommended)
- Optionally during typing

Ensure validation messages are readable by screen readers.

### Testing Checklist

- [x] Email error message displayed correctly
- [x] Mobile number error message displayed correctly
- [x] Error messages linked to corresponding fields
- [x] Screen reader announces validation errors
- [x] aria-invalid updates correctly
- [x] aria-describedby configured correctly

Status:

- [x] Fixed

---

# Final QA Checklist

## Accessibility

- [x] Email validation verified
- [x] Mobile validation verified
- [x] Error identification verified
- [x] Error suggestions verified
- [x] Screen reader testing completed
- [x] Semantic HTML validated

---

## Functional Testing

- [x] Registration flow completed successfully
- [x] Terms & Conditions checkbox verified
- [x] Submit button verified
- [x] Backend validation verified
- [x] API integration verified
- [x] Responsive testing completed

---

## Certification Readiness

- [x] All reported issues resolved
- [x] WCAG requirements verified
- [x] Manual accessibility testing completed
- [x] Lighthouse Accessibility re-tested
- [x] No issue from this report remains open
