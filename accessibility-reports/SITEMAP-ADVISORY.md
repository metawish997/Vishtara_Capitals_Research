# SITEMAP ADVISORY REPORT

## Report Status

- [ ] Pending
- [ ] In Progress
- [x] Completed

---

# Advisory

## HTML Sitemap Page

### Current Observation

The website does not contain an HTML Sitemap page.

The accessibility audit recommends creating one and adding its link to the website footer.

This is an advisory recommendation and not a WCAG failure.

---

## Purpose

An HTML Sitemap helps:

- Users quickly locate important pages.
- Keyboard users navigate the website more easily.
- Screen reader users understand the overall website structure.
- Improve usability and navigation.
- Improve SEO.

---

## Required Implementation

### 1. Create a new page

Create a public page such as:

/sitemap

or

/sitemap.html

depending on the project's routing.

---

### 2. Add a page title

The page should contain one H1:

Sitemap

---

### 3. List all important pages

Include links to every major public page, including but not limited to:

Home

About Us

Services

Blog

Contact

Login

Sign Up

Payments

Privacy Policy

Disclaimer

Investor Charter

SEBI Disclosure

Complaints Board

Escalation Matrix

Any additional public pages available on the website.

---

### 4. Use semantic HTML

Structure the page using semantic HTML.

Example:

- H1
- H2 sections (if grouping links)
- Unordered lists
- Standard anchor links

Do not use buttons for navigation links.

---

### 5. Add the Sitemap link to the Footer

Add a new footer link:

Sitemap

that navigates to:

/sitemap

Place it within the existing Quick Links or Useful Links section.

---

### 6. Accessibility Requirements

Ensure:

- One H1 on the page.
- Proper heading hierarchy.
- Keyboard accessibility.
- Visible focus indicators.
- Meaningful link text.
- Semantic HTML.
- Responsive layout.

---

## Developer Notes

The Sitemap page should update automatically when new public routes are added if a centralized routing configuration exists.

Otherwise, maintain the page manually whenever a new public page is introduced.

Do not include:

- Admin pages
- Dashboard routes
- Authentication callback URLs
- API endpoints
- Internal system pages

Only list publicly accessible website pages.

---

## Testing Checklist

- [x] Sitemap page created
- [x] One H1 exists
- [x] All important public pages listed
- [x] Every link opens correctly
- [x] Footer contains Sitemap link
- [x] Keyboard navigation verified
- [x] Screen reader navigation verified
- [x] Responsive layout verified
- [x] No broken links
- [x] Lighthouse Accessibility passes

---

## Advisory Completion

- [x] Sitemap page implemented
- [x] Footer updated
- [x] Internal links verified
- [x] Ready for accessibility certification review
