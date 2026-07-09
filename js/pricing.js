/* d:\SaaS Platform\js\pricing.js */

document.addEventListener('DOMContentLoaded', () => {
  initBillingToggle();
  initFAQAccordion();
});

// 1. Billing cycle toggle (monthly / annual)
function initBillingToggle() {
  const toggleBtn = document.querySelector('.toggle-switch');
  const proAmount = document.getElementById('pro-amount');
  const proPeriod = document.getElementById('pro-period');
  const toggleLabels = document.querySelectorAll('.toggle-label');

  if (!toggleBtn || !proAmount) return;

  toggleBtn.addEventListener('click', () => {
    const isAnnual = toggleBtn.classList.contains('annual');
    
    if (isAnnual) {
      // Switch to Monthly
      toggleBtn.classList.remove('annual');
      toggleBtn.setAttribute('aria-checked', 'false');
      proAmount.textContent = '29';
      proPeriod.textContent = '/mo';
      toggleLabels[0].classList.add('active');
      toggleLabels[1].classList.remove('active');
      
      // GA4 mock event
      window.logGAEvent('pricing_toggle', { billing_cycle: 'monthly' });
    } else {
      // Switch to Annual
      toggleBtn.classList.add('annual');
      toggleBtn.setAttribute('aria-checked', 'true');
      proAmount.textContent = '23';
      proPeriod.textContent = '/mo billed annually';
      toggleLabels[0].classList.remove('active');
      toggleLabels[1].classList.add('active');
      
      // GA4 mock event
      window.logGAEvent('pricing_toggle', { billing_cycle: 'annual' });
    }
  });
}

// 2. FAQ Accordion component logic
function initFAQAccordion() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      const content = item.querySelector('.accordion-content');
      const isActive = item.classList.contains('active');

      // Close all other accordion items
      document.querySelectorAll('.accordion-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.accordion-content').style.maxHeight = null;
          otherItem.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
        }
      });

      if (isActive) {
        item.classList.remove('active');
        content.style.maxHeight = null;
        header.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
        header.setAttribute('aria-expanded', 'true');

        // GA4 mock event
        const question = header.querySelector('span')?.textContent.trim() || 'FAQ Question';
        window.logGAEvent('faq_open', { faq_question: question });
      }
    });
  });
}
