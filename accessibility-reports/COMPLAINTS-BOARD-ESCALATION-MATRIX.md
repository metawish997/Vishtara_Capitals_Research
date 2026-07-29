# COMPLAINTS BOARD & ESCALATION MATRIX ACCESSIBILITY REPORT

## Pages Covered

- Complaints Board
- Escalation Matrix

---

## Report Status

- [ ] Pending
- [ ] In Progress
- [x] Completed

---

# Issue 1

## Table Headers Missing `scope` Attributes

### Applicable Pages

- Complaints Board
- Escalation Matrix

### WCAG

- 1.3.1 Info and Relationships

### Current Problem

The data tables on the page do not include the required `scope` attributes on table header (`<th>`) elements.

A reference table template has been shared by the accessibility auditor, however the current implementation does not follow it.

### Why this is a problem

- Screen readers cannot correctly associate table headers with their corresponding data cells.
- Users navigating tables with assistive technologies may not understand the relationship between rows and columns.
- The table structure does not fully comply with WCAG requirements.

### Required Fix

Review every table on both pages and:

- Add `scope="col"` to all column header cells.
- Add `scope="row"` to all row header cells where applicable.
- Ensure all data tables use semantic HTML (`<table>`, `<thead>`, `<tbody>`, `<th>`, `<td>`).
- Follow the accessibility template provided by the auditor.
- Verify that screen readers correctly announce row and column headers.

### Developer Notes

Do not update only one table.

Audit every table on:

- Complaints Board
- Escalation Matrix

Ensure all header cells use the appropriate `scope` attribute.

If tables are dynamically generated, update the component so every generated table remains accessible.

### Testing Checklist

- [x] Every table uses semantic HTML
- [x] Column headers use `scope="col"`
- [x] Row headers use `scope="row"` where applicable
- [x] Screen reader correctly announces table headers
- [x] Table structure validated using accessibility inspection tools

Status:

- [x] Fixed

---

# Issue 2

## Escalation Matrix Table Color Contrast

### Applicable Pages

- Escalation Matrix

### WCAG

- 1.4.3 Contrast (Minimum)

### Current Problem

The entire table header and multiple table cells within the Escalation Matrix fail the minimum WCAG color contrast requirement of 4.5:1.

This affects readability of the table content.

### Why this is a problem

- Users with low vision or color vision deficiencies may have difficulty reading the table.
- Important escalation information becomes difficult to distinguish.
- The page fails WCAG minimum contrast requirements.

### Required Fix

- Review the complete Escalation Matrix table.
- Update the text and/or background colors to achieve a minimum contrast ratio of **4.5:1**.
- Verify all updated colors using a WCAG Color Contrast Checker.
- Ensure all table headers, body cells, links, and highlighted text meet the required contrast ratio.

### Developer Notes

Do not update only the header row.

Audit the entire table including:

- Header cells
- Body cells
- Links
- Highlighted text
- Status indicators
- Any colored badges or labels within the table

Every visible text element must satisfy the WCAG minimum contrast requirement.

### Testing Checklist

- [x] Table headers pass 4.5:1 contrast ratio
- [x] Table body cells pass 4.5:1 contrast ratio
- [x] Links pass contrast requirements
- [x] Colored badges or labels pass contrast requirements
- [x] Verified using WCAG Color Contrast Checker

Status:

- [x] Fixed

---

# Final QA Checklist

## Accessibility

- [x] Table semantics verified
- [x] `scope` attributes verified
- [x] Color contrast verified
- [x] Semantic HTML validated
- [x] Screen reader testing completed
- [x] Keyboard navigation through tables verified

---

## Pages Verified

- [x] Complaints Board
- [x] Escalation Matrix

---

## Certification Readiness

- [x] All reported issues resolved
- [x] WCAG requirements verified
- [x] Manual accessibility testing completed
- [x] Lighthouse Accessibility re-tested
- [x] No issue from this report remains open
