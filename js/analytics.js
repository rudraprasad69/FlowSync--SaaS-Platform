/* d:\SaaS Platform\js\analytics.js */

// 1. GA4 event tracking mock
window.logGAEvent = function(eventName, parameters = {}) {
  const timestamp = new Date().toISOString();
  console.log(`%c[GA4 Event - ${timestamp}] %c${eventName}`, 'color: #818CF8; font-weight: bold;', 'color: #10B981; font-weight: bold;', parameters);
};

// Log initial page view
document.addEventListener('DOMContentLoaded', () => {
  const pagePath = window.location.pathname;
  const pageTitle = document.title;
  const pageLocation = window.location.href;

  window.logGAEvent('page_view', {
    page_title: pageTitle,
    page_location: pageLocation,
    page_path: pagePath
  });

  // Inject Schemas based on the current page
  injectJSONLDSchemas();
});

// 2. Dynamic JSON-LD Schema Injector
function injectJSONLDSchemas() {
  const head = document.head;
  const pathName = window.location.pathname;
  const pageFile = pathName.split('/').pop() || 'index.html';

  // Base Organization Schema (added to all pages)
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "FlowSync",
    "url": window.location.origin || "https://flowsync.com",
    "logo": (window.location.origin || "https://flowsync.com") + "/assets/images/logo.png",
    "sameAs": [
      "https://twitter.com/flowsync",
      "https://linkedin.com/company/flowsync"
    ]
  };
  injectScript(orgSchema);

  // Page-specific Schemas
  if (pageFile === 'index.html' || pageFile === '' || pageFile === 'features.html') {
    // SoftwareApplication Schema for product pages
    const appSchema = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "FlowSync",
      "operatingSystem": "All",
      "applicationCategory": "BusinessApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "1250"
      }
    };
    injectScript(appSchema);
  }

  if (pageFile === 'pricing.html') {
    // FAQPage Schema for the pricing accordion
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How does the 14-day free trial work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can sign up for FlowSync without a credit card. You get full access to all Pro features for 14 days. After the trial, you can choose to upgrade or you will automatically transition to our Free plan."
          }
        },
        {
          "@type": "Question",
          "name": "Can I change my plan later?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. You can upgrade, downgrade, or cancel your subscription at any time directly from your billing dashboard. Upgrades take effect immediately; downgrades or cancellations are applied at the end of the current billing cycle."
          }
        },
        {
          "@type": "Question",
          "name": "What is your refund policy?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We offer a 30-day money-back guarantee for all paid plans. If you are not satisfied with FlowSync, contact our support team within 30 days of your purchase for a full refund, no questions asked."
          }
        },
        {
          "@type": "Question",
          "name": "Do you offer custom integrations?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our Enterprise plan includes bespoke custom integration engineering. Our solutions team will work directly with your engineering department to build secure, custom connectors for your proprietary databases and tools."
          }
        }
      ]
    };
    injectScript(faqSchema);
  }
}

function injectScript(schemaObject) {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(schemaObject, null, 2);
  document.head.appendChild(script);
}
