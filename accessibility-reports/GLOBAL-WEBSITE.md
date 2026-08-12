# GLOBAL WEBSITE ACCESSIBILITY REPORT

## Scope

This report applies to every page of the website.

---

## Report Status

- [ ] Pending
- [ ] In Progress
- [x] Completed

---

# Issue 1

## Skip to Main Content Link Missing

### Applicable Scope

Entire Website

### WCAG

- 2.4.1 Bypass Blocks

### Current Problem

The website does not provide a visible and functional **"Skip to Main Content"** link.

Keyboard users must tab through the entire header and navigation before reaching the page content.

### Why this is a problem

- Keyboard users must repeatedly navigate through repetitive content.
- Screen reader users take longer to reach the main content.
- The website fails WCAG 2.4.1.

### Required Fix

Add a **Skip to Main Content** link as the first focusable element on every page.

Requirements:

- Visible when focused.
- Hidden visually until keyboard focus.
- Keyboard accessible.
- Moves focus directly to the `<main>` element.
- The `<main>` element should have a unique `id` (e.g. `id="main-content"`).

Example:

```html
<a href="#main-content" class="skip-link">
  Skip to Main Content
</a>

<main id="main-content">
```

### Developer Notes

Implement this globally in the shared layout so every page automatically includes the skip link.

### Testing Checklist

- [x] Skip link appears on keyboard focus
- [x] Skip link moves focus to main content
- [x] Works on every page
- [x] Screen reader announces correctly

Status:

- [x] Fixed

---

# Issue 2

## Incorrect HTML Language Attribute

### Applicable Scope

Entire Website

### WCAG

- 3.1.1 Language of Page

### Current Problem

The HTML document currently uses:

```html
<html lang="zxx">
```

The value `zxx` indicates that the page contains **no linguistic content**, which is incorrect because the website contains English content.

### Why this is a problem

- Screen readers may pronounce content incorrectly.
- Browsers cannot determine the correct language.
- Translation tools may not work correctly.
- The website fails WCAG 3.1.1.

### Required Fix

Update the HTML language attribute to the correct language.

Example:

```html
<html lang="en">
```

If multilingual pages are introduced in the future, use the appropriate language codes for those pages.

### Developer Notes

Update the shared HTML template or layout so all pages inherit the correct language.

### Testing Checklist

- [x] HTML lang attribute updated
- [x] All pages use lang="en"
- [x] Screen reader pronunciation verified

Status:

- [x] Fixed

---

# Issue 3

## Focus Indicator Not Clearly Visible

### Applicable Scope

Entire Website

### WCAG

- 2.4.7 Focus Visible

### Current Problem

Keyboard focus indicators are missing or not clearly visible throughout the website.

### Why this is a problem

- Keyboard users cannot determine which element currently has focus.
- Navigation becomes difficult.
- The website fails WCAG 2.4.7.

### Required Fix

Provide a clear, highly visible focus indicator for all interactive elements, including:

- Buttons
- Links
- Form fields
- Navigation items
- Cards
- Menus
- Modal controls
- Tabs
- Pagination
- Dropdowns

Do not remove browser focus outlines unless replacing them with an equally visible custom focus style.

### Developer Notes

Verify focus styles across:

- Desktop
- Tablet
- Mobile (with keyboard support)
- Dark Mode
- Light Mode

### Testing Checklist

- [x] Focus visible on all interactive elements
- [x] Focus contrast verified
- [x] Keyboard navigation tested
- [x] No focus loss

Status:

- [x] Fixed

---

# Issue 4

## Non-Semantic Heading Structure Across Website

### Applicable Scope

Entire Website

### WCAG

- 1.3.1 Info and Relationships

### Current Problem

Heading elements across the website are not consistently semantic.

Examples include:

- Incorrect heading hierarchy.
- Paragraphs marked as headings.
- Skipped heading levels.
- Multiple inappropriate heading elements.

### Why this is a problem

- Screen reader users rely on headings for navigation.
- Poor document structure reduces accessibility.
- Search engines also benefit from semantic heading hierarchy.

### Required Fix

Audit every page and ensure:

- Exactly one H1 per page.
- H2 for major sections.
- H3 for subsections.
- Paragraphs use `<p>` instead of heading tags.
- Heading levels are not skipped.

### Developer Notes

This audit must include every page of the website.

### Testing Checklist

- [x] Heading hierarchy verified
- [x] One H1 per page
- [x] Semantic HTML validated
- [x] Screen reader heading navigation verified

Status:

- [x] Fixed

---

# Issue 5

## Duplicate Page Titles Across Website

### Applicable Scope

Entire Website

### WCAG

- 2.4.2 Page Titled

### Current Problem

Every page currently uses the same page title:

```
Vishtara Capital Research
```

This does not accurately describe the content of individual pages.

### Why this is a problem

- Users cannot distinguish pages in browser tabs.
- Screen reader users cannot identify the current page.
- Search engine optimization is negatively affected.
- The website fails WCAG 2.4.2.

### Required Fix

Provide a unique and descriptive `<title>` for every page.

Examples:

- Home – Vishtara Capital Research
- About Us – Vishtara Capital Research
- Services – Vishtara Capital Research
- Blog – Vishtara Capital Research
- Contact Us – Vishtara Capital Research
- Login – Vishtara Capital Research
- Sign Up – Vishtara Capital Research
- Privacy Policy – Vishtara Capital Research
- Investor Charter – Vishtara Capital Research
- Disclaimer – Vishtara Capital Research
- SEBI Disclosure – Vishtara Capital Research
- Complaints Board – Vishtara Capital Research
- Escalation Matrix – Vishtara Capital Research
- Payments – Vishtara Capital Research

Ensure every page title accurately reflects its content.

### Developer Notes

Update the shared SEO/meta component so page titles are dynamically generated based on the current route or page.

### Testing Checklist

- [x] Every page has a unique title
- [x] Browser tabs display correct titles
- [x] Screen reader announces correct page title
- [x] SEO metadata verified

Status:

- [x] Fixed

---

# Final QA Checklist

## Accessibility

- [x] Skip to Main Content verified
- [x] HTML lang attribute verified
- [x] Focus indicators verified
- [x] Heading hierarchy verified
- [x] Unique page titles verified
- [x] Screen reader testing completed
- [x] Keyboard navigation completed
- [x] Semantic HTML validated

---

## Global Verification

- [x] Home
- [x] About Us
- [x] Services
- [x] Blog
- [x] Contact
- [x] Login
- [x] Sign Up
- [x] Payments
- [x] SEBI Disclosure
- [x] Disclaimer
- [x] Investor Charter
- [x] Privacy Policy
- [x] Complaints Board
- [x] Escalation Matrix
- [x] Footer
- [x] Header

---

## Certification Readiness

- [x] All reported issues resolved
- [x] WCAG requirements verified
- [x] Manual accessibility testing completed
- [x] Lighthouse Accessibility re-tested
- [x] Axe DevTools audit passed
- [x] No issue from this report remains open
