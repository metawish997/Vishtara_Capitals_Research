# ABOUT US + SERVICES ACCESSIBILITY REPORT

## Report Status

- [ ] Pending
- [ ] In Progress
- [x] Completed

---

# Issue 1

## Broken Images and Missing Alt Text

### WCAG

- 1.1.1 Non-text Content

### Current Problem

Multiple images on the page are not rendering correctly and are currently displayed as placeholder dimensions such as:

- 491 × 560
- 362 × 440

Additionally, these images do not contain appropriate alternative (alt) text.

### Why this is a problem

- Broken images negatively impact the user experience.
- Screen reader users cannot understand image content without descriptive alt text.
- Missing alt text fails WCAG accessibility requirements.

### Required Fix

- Identify and repair all broken image paths or missing assets.
- Ensure every image renders correctly.
- Add meaningful and descriptive alt text to every informational image.
- Decorative images should use an empty alt attribute (`alt=""`) where appropriate.
- Verify that no broken image placeholders remain anywhere on the page.

### Developer Notes

Do not fix only the images listed in the report.

Audit the entire page for:

- Broken image URLs
- Missing assets
- Missing alt attributes
- Incorrect alt text

Every image must be reviewed.

### Testing Checklist

- [x] All images render correctly
- [x] No placeholder dimensions remain
- [x] Informational images have descriptive alt text
- [x] Decorative images use empty alt attributes where appropriate
- [x] Screen reader announces image descriptions correctly

Status:

- [x] Fixed

---

# Issue 2

## Heading Structure

### WCAG

- 1.3.1 Info and Relationships
- 2.4.6 Headings and Labels

### Current Problem

The overall heading structure is generally good.

However:

- The primary page heading begins with an H3 instead of an H1.
- Multiple paragraphs are incorrectly marked up using heading tags even though they contain normal paragraph content.

### Why this is a problem

- Screen reader users rely on heading hierarchy for navigation.
- Incorrect heading levels create an illogical document outline.
- Paragraphs marked as headings reduce accessibility and semantic correctness.

### Required Fix

- Add one primary H1 describing the page.
- Use H2 elements for major page sections.
- Use H3 elements only for subsections where appropriate.
- Convert all paragraph content currently using heading tags into proper paragraph (`<p>`) elements.
- Ensure the heading hierarchy is logical and sequential throughout the page.

### Developer Notes

There should be only one H1 on the page.

The heading structure should follow:

H1
→ H2
→ H3

Do not skip heading levels unnecessarily.

### Testing Checklist

- [x] Exactly one H1 exists
- [x] H2 used for major sections
- [x] H3 used only for subsections
- [x] Paragraphs are no longer marked as headings
- [x] Heading hierarchy validated using browser accessibility tools

Status:

- [x] Fixed

---

# Final QA Checklist

## Accessibility

- [x] All broken images repaired
- [x] All image alt text verified
- [x] Heading hierarchy verified
- [x] Semantic HTML validated
- [x] Screen reader testing completed

---

## Certification Readiness

- [x] All reported issues resolved
- [x] WCAG requirements verified
- [x] Manual accessibility testing completed
- [x] Lighthouse Accessibility re-tested
- [x] No issue from this report remains open
