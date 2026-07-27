import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function PageMetaTracker() {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top on every route change for accessibility/usability
    window.scrollTo(0, 0);

    const baseTitle = "Vishtara Capital Research";
    let pageTitle = "";

    switch (location.pathname) {
      case "/":
        pageTitle = `Home | ${baseTitle}`;
        break;
      case "/about":
        pageTitle = `About Us | ${baseTitle}`;
        break;
      case "/services":
        pageTitle = `Services | ${baseTitle}`;
        break;
      case "/blog":
        pageTitle = `Market Insights | ${baseTitle}`;
        break;
      case "/payments":
        pageTitle = `Secure Payments | ${baseTitle}`;
        break;
      case "/contact":
        pageTitle = `Contact Us | ${baseTitle}`;
        break;
      case "/complaints":
        pageTitle = `Complaint Board | ${baseTitle}`;
        break;
      case "/sebi-disclosures":
        pageTitle = `SEBI Disclosures | ${baseTitle}`;
        break;
      case "/disclaimers":
        pageTitle = `Disclaimers | ${baseTitle}`;
        break;
      case "/privacy-policy":
        pageTitle = `Privacy Policy | ${baseTitle}`;
        break;
      case "/refund-policy":
        pageTitle = `Refund Policy | ${baseTitle}`;
        break;
      case "/investor-charter":
        pageTitle = `Investor Charter | ${baseTitle}`;
        break;
      case "/terms-and-conditions":
        pageTitle = `Terms & Conditions | ${baseTitle}`;
        break;
      case "/grievance-escalation-matrix":
        pageTitle = `Grievance Escalation Matrix | ${baseTitle}`;
        break;
      case "/certificates":
        pageTitle = `Certificates | ${baseTitle}`;
        break;
      case "/login":
        pageTitle = `Login | ${baseTitle}`;
        break;
      default:
        // Handle dynamic paths like /blog-details or admin routes
        if (location.pathname.startsWith('/admin')) {
          pageTitle = `Admin Dashboard | ${baseTitle}`;
        } else if (location.pathname.startsWith('/portal')) {
          pageTitle = `User Portal | ${baseTitle}`;
        } else {
          pageTitle = baseTitle;
        }
    }

    document.title = pageTitle;
  }, [location]);

  return null;
}
