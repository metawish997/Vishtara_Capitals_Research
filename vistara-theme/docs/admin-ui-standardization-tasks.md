# Admin UI Standardization

## Design Reference
- Dashboard ✅ (source of truth)
- Customers List ✅ (source of truth)
- Customer Details ✅ (source of truth)

---

## Completed — Session 1

- [x] Admin Layout Sidebar (AdminSidebar.jsx) — complete redesign matching design system
- [x] Admin Header (AdminHeader.jsx) — upgraded to match design system
- [x] Admin Layout (AdminLayout.jsx) — layout wrapper updated

## Completed — Session 2

- [x] ReviewList.jsx — standardized with header stats, tab filters, search, table
- [x] AnnouncementList.jsx — standardized with header, search, table
- [x] AnnouncementCreate.jsx — standardized form with white card
- [x] AnnouncementEdit.jsx — standardized form with white card
- [x] RefundList.jsx — standardized with header stats, search, table
- [x] RoleList.jsx — standardized with white cards, permission badges, modal
- [x] RoleEdit.jsx — standardized permission grid with search/filter
- [x] CampaignList.jsx — standardized with card grid, toggle, search
- [x] ComplaintList.jsx — standardized with tab filters, inline resolve form
- [x] InquiryList.jsx — standardized with tab filters, detail modal
- [x] NotificationCenter.jsx — standardized with tab filters, card grid
- [x] DesignationList.jsx — standardized with drag-drop table, modal form
- [x] EmployeeList.jsx — CSS variables replaced with hard white/slate values, header standardized

## Completed — Session 3 (Batch Update)

- [x] SupportChat.jsx
- [x] Leads list/create/edit pages
- [x] Employees create/edit pages
- [x] Tickets list/create/edit pages
- [x] Certificates list/create/edit pages
- [x] Offer Banners list/create/edit pages
- [x] Coupons list/create/edit pages
- [x] Marquees list/create/edit pages
- [x] Policies list/create/edit pages
- [x] FAQ list/create/edit pages
- [x] Campaigns create/edit pages
- [x] Popups list/create/edit pages
- [x] Complaint Data pages
- [x] Contact Details pages
- [x] Company Bank Details pages
- [x] Digio Credentials pages
- [x] Angel Credentials pages
- [x] System Health pages
- [x] Home Settings sub-pages (Download App, How It Works, Counters, Key Features, Why Choose Us)
- [x] About Us sub-pages (Mission, Core Values, Why Platform)
- [x] Demo Subscriptions pages
- [x] Header Builder pages
- [x] Footer Builder pages
- [x] Service Plans list/create/edit pages
- [x] Blogs list/create/edit pages
- [x] News list/create/edit pages

---

## Final Review

All `var(--*)` CSS variables (e.g. `var(--card)`, `var(--bg)`, `var(--border)`, `var(--text-primary)`, `var(--text-secondary)`, `var(--accent)`) have been globally replaced across the entire `src/pages/admin` directory via an automated script (`update-styles.cjs`). The entire admin dashboard now strictly follows the `#ffffff` white card, `slate-50` background, and `slate-200` border standardized design system.
