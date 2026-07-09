/* d:\SaaS Platform\js\contact.js */

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
  initCalendarWidget();
  initReviewsCarousel();
});

// 1. Form Validation and Mock Submit
function initContactForm() {
  const form = document.getElementById('demo-form');
  const successScreen = document.getElementById('contact-success');
  const formBox = document.querySelector('.contact-form-box');

  const fullName = document.getElementById('full-name');
  const workEmail = document.getElementById('work-email');
  const companyName = document.getElementById('company-name');
  const companySize = document.getElementById('company-size');
  const industry = document.getElementById('industry');
  const message = document.getElementById('message');
  
  const charCounter = document.getElementById('char-count');

  if (!form || !fullName || !workEmail) return;

  // Track first input edit for GA4 demo_form_start
  let formStarted = false;
  const triggerFormStart = () => {
    if (!formStarted) {
      formStarted = true;
      window.logGAEvent('demo_form_start', { contact_source: 'website' });
    }
  };

  [fullName, workEmail, companyName, message].forEach(el => {
    el.addEventListener('focus', triggerFormStart);
  });

  // Message character counter
  message.addEventListener('input', () => {
    const len = message.value.length;
    charCounter.textContent = `${len}/500`;
    if (len > 500) {
      message.value = message.value.substring(0, 500);
      charCounter.textContent = '500/500';
    }
  });

  // Blur validation
  fullName.addEventListener('blur', () => validateField(fullName, /^[a-zA-Z\s]{2,50}$/, 'Letters only, minimum 2 characters.'));
  workEmail.addEventListener('blur', () => validateEmailField(workEmail));
  companyName.addEventListener('blur', () => validateField(companyName, /^.{2,100}$/, 'Company name must be at least 2 characters.'));

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid = validateField(fullName, /^[a-zA-Z\s]{2,50}$/, 'Letters only, minimum 2 characters.');
    const isEmailValid = validateEmailField(workEmail);
    const isCompanyValid = validateField(companyName, /^.{2,100}$/, 'Company name must be at least 2 characters.');
    const isSizeValid = companySize.value !== '';
    const isIndustryValid = industry.value !== '';

    // Handle select dropdown errors manually
    toggleDropdownError(companySize, isSizeValid, 'Please select a company size.');
    toggleDropdownError(industry, isIndustryValid, 'Please select an industry.');

    if (isNameValid && isEmailValid && isCompanyValid && isSizeValid && isIndustryValid) {
      // Mock AJAX Submit
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="ph ph-circle-notch" style="animation: spin 1s linear infinite;"></i> Booking...';

      // Inject spinner animation if not present
      if (!document.getElementById('spin-style')) {
        const style = document.createElement('style');
        style.id = 'spin-style';
        style.innerHTML = '@keyframes spin { 100% { transform: rotate(360deg); } }';
        document.head.appendChild(style);
      }

      setTimeout(() => {
        // Swap UI panels
        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        
        form.style.display = 'none';
        successScreen.style.display = 'block';
        successScreen.focus(); // for accessibility reader focus

        // GA4 mock event
        window.logGAEvent('demo_form_submit', {
          company_size: companySize.value,
          industry: industry.value
        });
      }, 1500);
    } else {
      // Focus first error for screen accessibility
      const firstInvalid = form.querySelector('.form-input:invalid, select:invalid, textarea:invalid, [style*="border-color: red"]');
      if (firstInvalid) firstInvalid.focus();
    }
  });
}

function validateField(input, regex, errorMsg) {
  const errDiv = input.parentNode.querySelector('.form-error');
  const isValid = regex.test(input.value.trim());

  if (isValid) {
    input.style.borderColor = 'var(--c-border)';
    if (errDiv) errDiv.style.display = 'none';
    return true;
  } else {
    input.style.borderColor = '#EF4444';
    if (errDiv) {
      errDiv.textContent = errorMsg;
      errDiv.style.display = 'block';
    }
    return false;
  }
}

function validateEmailField(input) {
  const errDiv = input.parentNode.querySelector('.form-error');
  const emailVal = input.value.trim().toLowerCase();

  // Basic email pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailVal)) {
    input.style.borderColor = '#EF4444';
    if (errDiv) {
      errDiv.textContent = 'Please enter a valid work email address.';
      errDiv.style.display = 'block';
    }
    return false;
  }

  // Personal/Consumer domains check (forbidden)
  const personalDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'live.com', 'aol.com', 'msn.com'];
  const domain = emailVal.split('@')[1];

  if (personalDomains.includes(domain)) {
    input.style.borderColor = '#EF4444';
    if (errDiv) {
      errDiv.textContent = 'Please enter a business email. Consumer accounts (like Gmail or Yahoo) are not allowed.';
      errDiv.style.display = 'block';
    }
    return false;
  }

  // Valid business email
  input.style.borderColor = 'var(--c-border)';
  if (errDiv) errDiv.style.display = 'none';
  return true;
}

function toggleDropdownError(select, isValid, errorMsg) {
  const errDiv = select.parentNode.querySelector('.form-error');
  if (isValid) {
    select.style.borderColor = 'var(--c-border)';
    if (errDiv) errDiv.style.display = 'none';
  } else {
    select.style.borderColor = '#EF4444';
    if (errDiv) {
      errDiv.textContent = errorMsg;
      errDiv.style.display = 'block';
    }
  }
}


// 2. Interactive calendar widget selection
function initCalendarWidget() {
  const days = document.querySelectorAll('.cal-day:not(.disabled)');
  const selectLabel = document.getElementById('selected-date-label');

  if (days.length === 0 || !selectLabel) return;

  days.forEach(day => {
    day.addEventListener('click', () => {
      // Remove other active states
      days.forEach(d => d.classList.remove('active'));
      // Set active
      day.classList.add('active');

      const dateNum = day.textContent.trim();
      selectLabel.innerHTML = `<i class="ph ph-calendar-check text-indigo"></i> Selected slot: July ${dateNum}, 2026 at 10:00 AM`;

      // Log event
      window.logGAEvent('calendar_select', { selected_date: `2026-07-${dateNum.padStart(2, '0')}` });
    });
  });
}


// 3. Right panel Peer Reviews carousel
function initReviewsCarousel() {
  const reviews = Array.from(document.querySelectorAll('.review-slide-item'));
  if (reviews.length === 0) return;

  let currentIndex = 0;

  // Simple auto cross-fade every 4 seconds
  setInterval(() => {
    reviews[currentIndex].style.opacity = '0';
    setTimeout(() => {
      reviews[currentIndex].style.display = 'none';
      
      currentIndex = (currentIndex + 1) % reviews.length;
      
      reviews[currentIndex].style.display = 'block';
      setTimeout(() => {
        reviews[currentIndex].style.opacity = '1';
      }, 50);
    }, 300);
  }, 4000);
}
