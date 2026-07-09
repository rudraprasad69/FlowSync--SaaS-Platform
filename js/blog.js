/* d:\SaaS Platform\js\blog.js */

document.addEventListener('DOMContentLoaded', () => {
  initBlogFilters();
  initNewsletterForm();
  initArticleClicks();
});

// 1. Category Bar Filter
function initBlogFilters() {
  const filterPills = document.querySelectorAll('.filter-pill');
  const blogCards = document.querySelectorAll('.blog-card-item');

  if (filterPills.length === 0 || blogCards.length === 0) return;

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const category = pill.getAttribute('data-category');

      // Update active pill state
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      // Filter cards with animations
      blogCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');

        if (category === 'all' || cardCategory === category) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300); // match normal transition speed
        }
      });

      // GA4 mock event
      window.logGAEvent('category_filter', { category: category });
    });
  });
}

// 2. Newsletter form mock submit
function initNewsletterForm() {
  const form = document.getElementById('newsletter-form');
  const input = document.getElementById('newsletter-email');
  
  if (!form || !input) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailVal = input.value.trim();

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailVal)) {
      alert('Please enter a valid email address.');
      return;
    }

    // Success state
    const formParent = form.parentNode;
    form.style.display = 'none';
    
    const successMsg = document.createElement('div');
    successMsg.className = 'text-center mt-4 text-emerald';
    successMsg.setAttribute('role', 'alert');
    successMsg.innerHTML = `<i class="ph ph-check-circle" style="font-size: 32px; display: block; margin-bottom: 8px;"></i> Thank you! You've subscribed to the FlowSync Newsletter.`;
    formParent.appendChild(successMsg);

    // GA4 mock event
    window.logGAEvent('newsletter_subscribe', { email: emailVal });
  });
}

// 3. Track reading of individual articles
function initArticleClicks() {
  const articles = document.querySelectorAll('.blog-card, .featured-blog-card');
  articles.forEach(article => {
    const titleElement = article.querySelector('h3');
    const link = article.querySelector('a');

    if (titleElement && link) {
      link.addEventListener('click', (e) => {
        // Since we are mocking navigation, prevent default if it's a dead link
        const href = link.getAttribute('href');
        if (href === '#' || href === '') {
          e.preventDefault();
        }
        
        const title = titleElement.textContent.trim();
        const category = article.closest('.blog-card-item')?.getAttribute('data-category') || 'Product';
        
        // GA4 mock event
        window.logGAEvent('read_article', {
          article_title: title,
          category: category
        });
      });
    }
  });
}
