# LEGAL PAGES ACCESSIBILITY REPORT

## Pages Covered

- SEBI Disclosure
- Disclaimer
- Investor Charter
- Privacy Policy

---

## Report Status

- [ ] Pending
- [ ] In Progress
- [x] Completed

---

# Issue 1

## Text Color Contrast Under Regulatory Declarations

### Applicable Pages

- SEBI Disclosure
- Disclaimer
- Investor Charter
- Privacy Policy

### WCAG

- 1.4.3 Contrast (Minimum)

### Current Problem

Multiple text elements displayed under the **Regulatory Declarations** sections fail the minimum WCAG color contrast requirements.

The current foreground and background color combinations do not provide sufficient readability, especially for users with low vision or color vision deficiencies.

### Why this is a problem

- Text is difficult to read for many users.
- Users with visual impairments may not be able to distinguish the content.
- The page fails WCAG 2.2 minimum contrast requirements.
- Regulatory and legal information must remain easily readable and accessible.

### Required Fix

- Review every text element under the Regulatory Declarations sections.
- Update text colors to achieve a minimum contrast ratio of **4.5:1** for normal text.
- Verify all updated colors using a WCAG Color Contrast Checker.
- Ensure consistency across all legal pages.

### Developer Notes

Do not update only the text identified during testing.

Audit every text element within:

- SEBI Disclosure
- Disclaimer
- Investor Charter
- Privacy Policy

Verify that no paragraph, list item, heading, note, disclaimer, table text, or regulatory declaration fails the minimum contrast requirement.

### Testing Checklist

- [x] All regulatory declaration text passes 4.5:1 contrast ratio
- [x] Verified using WCAG Color Contrast Checker
- [x] Readability confirmed on desktop
- [x] Readability confirmed on mobile

Status:

- [x] Fixed

---

# Issue 2

## Heading Structure

### Applicable Pages

- SEBI Disclosure
- Disclaimer
- Investor Charter
- Privacy Policy

### WCAG

- 1.3.1 Info and Relationships
- 2.4.6 Headings and Labels

### Current Problem

The overall heading structure is generally good.

However:

- The primary page heading begins with an H3 instead of an H1.
- Multiple paragraphs are incorrectly marked up using heading elements even though they contain normal paragraph content.

### Why this is a problem

- Screen reader users rely on heading hierarchy for navigation.
- Incorrect heading levels create an illogical document outline.
- Paragraphs incorrectly marked as headings reduce semantic correctness and accessibility.
- Legal and regulatory documents require a clear document structure for all users.

### Required Fix

For each page:

- Add one primary H1 describing the page.
- Use H2 elements for major sections.
- Use H3 elements only for subsections where appropriate.
- Convert paragraph content currently using heading tags into proper `<p>` elements.
- Maintain a logical and sequential heading hierarchy.

### Developer Notes

Each page must contain:

- Exactly one H1
- Logical H2 sections
- H3 only where appropriate

Do not skip heading levels.

Audit every heading across all four legal pages.

### Testing Checklist

- [x] Exactly one H1 exists on every page
- [x] H2 used for primary sections
- [x] H3 used only for subsections
- [x] Paragraphs are no longer headings
- [x] Heading hierarchy validated using browser accessibility tools

Status:

- [x] Fixed

---

# Final QA Checklist

## Accessibility

- [x] Color contrast verified on all four pages
- [x] Heading hierarchy verified
- [x] Semantic HTML validated
- [x] Screen reader testing completed
- [x] Manual keyboard navigation completed

---

## Pages Verified

- [x] SEBI Disclosure
- [x] Disclaimer
- [x] Investor Charter
- [x] Privacy Policy

---

## Certification Readiness

- [x] All reported issues resolved
- [x] WCAG requirements verified
- [x] Manual accessibility testing completed
- [x] Lighthouse Accessibility re-tested
- [x] No issue from this report remains open
