# BLOG PAGE ACCESSIBILITY REPORT

## Report Status

- [ ] Pending
- [ ] In Progress
- [ ] Completed

---

# Issue 1

## Heading Structure

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
- Paragraphs marked as headings reduce semantic correctness and accessibility.

### Required Fix

- Add one primary H1 describing the Blog page.
- Use H2 elements for major sections.
- Use H3 elements only for subsections where appropriate.
- Convert paragraph content currently using heading tags into proper `<p>` elements.
- Ensure a logical and sequential heading hierarchy across the page.

### Developer Notes

Only one H1 should exist on the page.

Recommended structure:

H1
→ H2
→ H3

Do not skip heading levels.

### Testing Checklist

- [ ] Exactly one H1 exists
- [ ] H2 used for major sections
- [ ] H3 used only for subsections
- [ ] Paragraphs are no longer headings
- [ ] Heading hierarchy verified using accessibility tools

Status:

- [ ] Fixed

---

# Issue 2

## Duplicate Blog Entries

### Current Problem

The same blog posts are displayed twice on the page.

### Why this is a problem

- Creates duplicate content for users.
- Confuses screen reader users.
- Poor user experience.
- May negatively impact SEO.

### Required Fix

- Identify duplicate blog entries.
- Ensure each blog post appears only once unless intentional.
- Remove duplicated rendering logic if present.
- Verify that pagination or API responses are not causing duplicate records.

### Developer Notes

Check:

- Frontend rendering logic
- API response
- Database query
- Pagination logic
- State management

### Testing Checklist

- [ ] No duplicate blog cards exist
- [ ] Each blog appears only once
- [ ] Pagination works correctly (if applicable)

Status:

- [ ] Fixed

---

# Issue 3

## "Read More" Links Return 404

### Current Problem

Multiple blog cards contain a "Read More" link.

Clicking these links results in a 404 (Page Not Found) error.

### Why this is a problem

- Users cannot access the full blog content.
- Broken navigation negatively impacts usability.
- Search engines may detect broken internal links.
- Accessibility and functionality are affected.

### Required Fix

- Link every Read More button to the correct blog detail page.
- Ensure all blog detail routes exist.
- Remove or disable links if corresponding pages are unavailable.
- Verify there are no broken internal links.

### Developer Notes

Check:

- Route configuration
- Slug generation
- Dynamic routes
- Blog detail pages
- Backend API response

### Testing Checklist

- [ ] Every Read More opens the correct blog
- [ ] No 404 errors occur
- [ ] Internal routing verified
- [ ] Dynamic blog pages load correctly

Status:

- [ ] Fixed

---

# Issue 4

## Read More ARIA Labels

### WCAG

- 2.4.4 Link Purpose (In Context)
- 4.1.2 Name, Role, Value

### Current Problem

Multiple "Read More" links use identical link text without providing descriptive context for assistive technology users.

Example from the audit:

Read more about whether you are a startup or scaling to a multi-million-rand enterprise.

### Why this is a problem

Screen reader users hear multiple links announced only as:

"Read More"

without knowing which blog each link belongs to.

### Required Fix

Provide a unique and descriptive `aria-label` for every Read More link.

Examples:

aria-label="Read more about Whether You Are a Startup or Scaling to a Multi-Million-Rand Enterprise"

aria-label="Read more about Investment Planning Strategies"

aria-label="Read more about Market Research Tips"

Each aria-label must clearly identify the associated blog article.

### Developer Notes

Every Read More link must have a unique aria-label generated dynamically using the corresponding blog title.

Avoid generic labels.

### Testing Checklist

- [ ] Every Read More has a unique aria-label
- [ ] Screen reader announces meaningful link descriptions
- [ ] Accessibility inspection confirms correct aria-label values

Status:

- [ ] Fixed

---

# Final QA Checklist

## Accessibility

- [ ] Heading hierarchy verified
- [ ] Duplicate blogs removed
- [ ] All Read More links functional
- [ ] No 404 pages
- [ ] ARIA labels verified
- [ ] Semantic HTML validated
- [ ] Screen reader testing completed

---

## Certification Readiness

- [ ] All reported issues resolved
- [ ] WCAG requirements verified
- [ ] Manual accessibility testing completed
- [ ] Lighthouse Accessibility re-tested
- [ ] No issue from this report remains open
