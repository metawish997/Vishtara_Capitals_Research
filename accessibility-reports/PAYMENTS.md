# PAYMENTS PAGE ACCESSIBILITY REPORT

## Report Status

- [ ] Pending
- [ ] In Progress
- [x] Completed

---

# Issue 1

## UPI QR Code Alt Text

### WCAG

- 1.1.1 Non-text Content

### Current Problem

The UPI QR code image includes an alt attribute, however the alternative text is not descriptive enough to convey the purpose of the image.

### Why this is a problem

- Screen reader users cannot understand what the QR code is used for.
- The current alt text does not provide sufficient information about the payment method.
- This fails WCAG requirements for meaningful alternative text.

### Required Fix

Replace the current alt text with the following descriptive text exactly as recommended in the accessibility audit:

**"UPI payment QR code for Vishtara Capital Research UPI ID: vishatracapital@hdfcbank."**

Ensure the alt text accurately describes the QR code and its purpose.

### Developer Notes

- Only informational QR codes should have descriptive alt text.
- Do not use generic alt values such as:
  - QR Code
  - Payment QR
  - Image
  - QR
- Preserve the exact wording recommended by the accessibility audit unless business requirements change.

### Testing Checklist

- [x] QR code has descriptive alt text
- [x] Screen reader announces the complete payment description
- [x] Alt text matches the accessibility recommendation

Status:

- [x] Fixed

---

# Issue 2

## Incorrect UPI QR Code Image

### Current Problem

The UPI QR code displayed on the Payments page is incorrect and does not represent the intended payment QR code.

### Why this is a problem

- Users may attempt payment using an incorrect QR code.
- This creates a poor user experience and may result in failed or misdirected payments.
- The payment page cannot be considered accurate until the correct QR code is displayed.

### Required Fix

- Replace the existing QR code image with the correct UPI QR code provided by the business.
- Verify that the QR code corresponds to the intended Vishtara Capital Research UPI account.
- Ensure the updated image renders correctly on all supported devices and screen sizes.
- Confirm the QR code is clear, high quality, and scannable.

### Developer Notes

Verify:

- Image source path
- Asset replacement
- Responsive rendering
- Image quality
- Successful scanning using a UPI application

### Testing Checklist

- [x] Correct QR code image uploaded
- [x] QR code scans successfully
- [x] Payment destination verified
- [x] Image renders correctly
- [x] Responsive layout verified

Status:

- [x] Fixed

---

# Final QA Checklist

## Accessibility

- [x] QR code alt text verified
- [x] QR code image verified
- [x] Screen reader testing completed
- [x] Image quality verified

---

## Functional Testing

- [x] QR code scans successfully
- [x] Payment destination verified
- [x] Correct UPI account opens
- [x] Responsive testing completed

---

## Certification Readiness

- [x] All reported issues resolved
- [x] WCAG requirements verified
- [x] Manual accessibility testing completed
- [x] Lighthouse Accessibility re-tested
- [x] No issue from this report remains open
