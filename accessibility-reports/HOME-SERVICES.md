# HOME SERVICES ACCESSIBILITY REPORT

## Report Status
- [ ] Pending
- [ ] In Progress
- [x] Completed

---

# Issue 1
## Heading Structure

### WCAG
- 1.3.1 Info and Relationships
- 2.4.6 Headings and Labels

### Current Problem
The heading structure is generally good, however the main page heading starts with an H3 instead of an H1.

Additionally, several paragraphs are incorrectly marked up using heading tags even though they are normal paragraph content.

### Required Fix
- Add one primary H1 describing the page.
- Use H2 for major sections.
- Use H3 only for subsections.
- Convert all paragraph content currently using heading tags into proper paragraph tags.
- Ensure the page follows a logical heading hierarchy.

### Developer Notes
Only one H1 should exist on the page.

### Testing Checklist
- [x] Exactly one H1 exists
- [x] H2 used for primary sections
- [x] H3 used only where appropriate
- [x] Paragraphs are not marked as headings

Status:
- [x] Fixed

---

# Issue 2
## Color Contrast (Yellow Text)

### WCAG
- 1.4.3 Contrast (Minimum)

### Current Problem

The following yellow text fails the minimum required contrast ratio of 4.5:1:

- SEBI Registered
- BSE Enlisted
- NISM Certified

Other yellow text throughout the page also fails contrast requirements.

### Required Fix

- Update text colors to achieve a minimum contrast ratio of 4.5:1.
- Verify every updated color using a WCAG Color Contrast Checker.

### Developer Notes

Do not only update these three labels.
Audit every yellow text element on the page.

### Testing Checklist

- [x] All yellow text passes 4.5:1
- [x] Verified using WCAG Contrast Checker

Status:
- [x] Fixed

---

# Issue 3
## Announcement Ticker Accessibility

### WCAG
- 2.2.2 Pause, Stop, Hide

### Current Problem

An announcement ticker exists below the page header.

The content continuously moves.

Users are not provided with any visible mechanism to pause the animation.

### Required Fix

- Add a visible Pause button.
- Allow keyboard users to focus the control.
- Pause and resume should work using keyboard.
- Ensure screen reader users understand the control.

### Testing Checklist

- [x] Pause button visible
- [x] Keyboard accessible
- [x] Screen reader accessible
- [x] Animation pauses correctly

Status:
- [x] Fixed

---

# Issue 4
## Complaint Modal Keyboard Accessibility

### WCAG
- 2.1.2 No Keyboard Trap

### Current Problem

When the page loads, a Complaint Table modal dialog automatically opens.

Keyboard focus remains behind the dialog.

The dialog cannot be closed using keyboard controls.

### Required Fix

- Move focus inside the modal when opened.
- Trap focus inside the modal.
- Allow closing using:
  - Escape key
  - Enter key (if appropriate)
- Return focus to the triggering element after closing.

### Testing Checklist

- [x] Focus enters modal
- [x] Focus trapped
- [x] ESC closes modal
- [x] Enter works if applicable
- [x] Focus restored after closing

Status:
- [x] Fixed

---

# Issue 5
## Cash Equity Section

### WCAG
- 1.4.3 Contrast (Minimum)

### Current Problem

The "Cash Equity" section headings fail color contrast requirements.

Additionally, multiple images below the section fail to render and currently display as 108×45 placeholders.

### Required Fix

- Improve heading contrast.
- Fix broken image paths.
- Ensure images render correctly.

### Testing Checklist

- [x] Heading contrast passes
- [x] All images load correctly

Status:
- [x] Fixed

---

# Issue 6
## About Visthara Capital Buttons

### Current Problem

The following buttons are clickable but do not navigate anywhere:

- Compliance Details
- Our Offerings

### Required Fix

If these buttons should navigate:

- Link them correctly.

Otherwise:

- Remove clickable behavior.
- Replace with non-interactive content if appropriate.

### Testing Checklist

- [x] Compliance Details works or is no longer clickable
- [x] Our Offerings works or is no longer clickable

Status:
- [x] Fixed

---

# Issue 7
## What We Offer Section

### Current Problem

The following controls are non-functional:

- View Pricing
- Multiple Read More buttons

### Required Fix

- Connect View Pricing to the correct destination.
- Connect every Read More button to the correct service page.

Additionally:

Provide descriptive aria-label values.

Example:

aria-label="Read more about our Cash Market Research Service"

Each Read More button must describe its own service.

### Testing Checklist

- [x] View Pricing works
- [x] Every Read More works
- [x] Every Read More has descriptive aria-label

Status:
- [x] Fixed

---

# Issue 8
## Trusted Advisory Section

### Current Problem

The "Explore Subscriptions" button is non-functional.

### Required Fix

Link the button correctly.

### Testing Checklist

- [x] Explore Subscriptions works

Status:
- [x] Fixed

---

# Issue 9
## Newsletter Subscription Form

### WCAG

- 3.3.2 Labels or Instructions
- 4.1.2 Name, Role, Value
- 4.1.3 Status Messages

### Current Problem

The email input field has no accessible label.

The Subscribe button is non-functional.

Users cannot submit the form.

### Required Fix

- Add a visible label.
Example:
Enter your email

- Ensure screen readers identify the field.
- Validate email properly.
- Make Subscribe button functional.
- Show success and error status messages.

### Testing Checklist

- [x] Input label exists
- [x] Screen reader announces correctly
- [x] Form submits
- [x] Success message shown
- [x] Error message shown

Status:
- [x] Fixed

---

# Issue 10
## Founder & Lead Analyst Image

### WCAG
- 1.1.1 Non-text Content

### Current Problem

The founder image has incorrect alt text.

### Required Fix

Replace the alt text with:

"Mr. Anujay Chouhan Founder and SEBI Registered Analyst - SEBI Reg No: INH0000277779"

### Testing Checklist

- [x] Alt text updated
- [x] Screen reader announces correctly

Status:
- [x] Fixed

---

# Final QA Checklist

## Accessibility

- [x] Heading hierarchy verified
- [x] Contrast verified
- [x] Keyboard accessibility verified
- [x] Modal accessibility verified
- [x] Buttons functional
- [x] Forms functional
- [x] Images render correctly
- [x] Alt text verified
- [x] aria-labels verified

---

## Certification Readiness

- [x] All reported issues resolved
- [x] WCAG requirements verified
- [x] Manual keyboard testing completed
- [x] Screen reader testing completed
- [x] Lighthouse Accessibility re-tested
- [x] No issue from this report remains open
