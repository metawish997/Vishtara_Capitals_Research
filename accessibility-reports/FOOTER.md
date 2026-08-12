# FOOTER ACCESSIBILITY REPORT

## Report Status

- [ ] Pending
- [ ] In Progress
- [x] Completed

---

# Issue 1

## Email Address and Phone Number Are Not Clickable

### WCAG

- 2.4.4 Link Purpose (In Context)
- 2.1.1 Keyboard

### Current Problem

The email address and phone number displayed in the website footer are plain text and are not clickable.

### Why this is a problem

- Users cannot directly send an email by clicking the email address.
- Mobile users cannot directly initiate a phone call.
- Keyboard users expect contact information to function as interactive links.
- This negatively impacts usability and accessibility.

### Required Fix

Convert the contact information into proper hyperlinks:

Email:

- Use a `mailto:` link.

Phone Number:

- Use a `tel:` link.

Example:

- `mailto:info@example.com`
- `tel:+911234567890`

Ensure both links are keyboard accessible and visually identifiable.

### Developer Notes

Verify:

- Clicking the email opens the user's default email client.
- Clicking the phone number opens the device dialer on supported devices.
- Links remain accessible to keyboard and screen reader users.

### Testing Checklist

- [x] Email is clickable
- [x] mailto link works correctly
- [x] Phone number is clickable
- [x] tel link works correctly
- [x] Keyboard navigation verified
- [x] Screen reader announces links correctly

Status:

- [x] Fixed

---

# Issue 2

## Social Media Icons Missing Links and Accessible Names

### WCAG

- 1.1.1 Non-text Content
- 2.4.4 Link Purpose (In Context)
- 4.1.2 Name, Role, Value

### Current Problem

The footer contains social media icons that:

- Are not linked to their respective social media pages.
- Do not have accessible names.
- Cannot be identified correctly by screen reader users.

### Why this is a problem

- Screen reader users hear unlabeled icons or links with no meaningful purpose.
- Users cannot navigate to the organization's social media profiles.
- The icons fail WCAG accessibility requirements.

### Required Fix

For every social media icon:

- Add the correct destination URL.
- Add a meaningful `aria-label`.

Examples:

- `aria-label="Connect with us on Facebook"`
- `aria-label="Connect with us on Instagram"`
- `aria-label="Connect with us on LinkedIn"`
- `aria-label="Connect with us on X"`
- `aria-label="Connect with us on YouTube"`

Ensure every icon:

- Is keyboard accessible.
- Opens the correct social media page.
- Has a descriptive accessible name.

### Developer Notes

Verify every social media icon individually.

Check:

- Facebook
- Instagram
- LinkedIn
- X (Twitter)
- YouTube
- Any additional platforms used in the footer

Do not use empty links (`#`) or placeholder URLs.

### Testing Checklist

- [x] Every social media icon links correctly
- [x] Every icon has a descriptive aria-label
- [x] Keyboard navigation verified
- [x] Screen reader announces the correct accessible name
- [x] All links open the correct destination

Status:

- [x] Fixed

---

# Final QA Checklist

## Accessibility

- [x] Email link verified
- [x] Phone link verified
- [x] Social media links verified
- [x] Accessible names verified
- [x] Keyboard navigation verified
- [x] Screen reader testing completed

---

## Functional Testing

- [x] mailto link works
- [x] tel link works
- [x] Every social media link opens correctly
- [x] Responsive testing completed

---

## Certification Readiness

- [x] All reported issues resolved
- [x] WCAG requirements verified
- [x] Manual accessibility testing completed
- [x] Lighthouse Accessibility re-tested
- [x] No issue from this report remains open
