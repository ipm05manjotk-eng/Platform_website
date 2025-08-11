// ToolsShare Application JavaScript
// Single JS file with deferred loading for optimal performance

class ToolsShareApp {
  constructor() {
    this.initializeApp();
  }

  initializeApp() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupApp());
    } else {
      this.setupApp();
    }
  }

  setupApp() {
    this.setupBackToTop();
    this.setupMobileNav();
    this.setupTabs();
    this.setupModals();
    this.setupForms();
    this.setupCart();
    this.setupFilters();
    this.setupCheckout();
    this.setupFacultyPage();
    this.setupAnimations();
    this.setupAccessibility();
  }

  // Back to top functionality
  setupBackToTop() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'ts-back-to-top';
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTopBtn);

    const showBackToTop = () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('ts-visible');
      } else {
        backToTopBtn.classList.remove('ts-visible');
      }
    };

    const scrollToTop = () => {
      const preferReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      if (preferReducedMotion) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    };

    window.addEventListener('scroll', showBackToTop);
    backToTopBtn.addEventListener('click', scrollToTop);
  }

  // Mobile navigation
  setupMobileNav() {
    // Create mobile menu button for smaller screens if needed
    const nav = document.querySelector('.ts-header__nav');
    if (nav && window.innerWidth < 768) {
      // Mobile nav functionality would go here
      // For now, we rely on CSS flexbox wrapping
    }
  }

  // Tab functionality
  setupTabs() {
    const tabGroups = document.querySelectorAll('.ts-tabs');
    
    tabGroups.forEach(tabGroup => {
      const tabs = tabGroup.querySelectorAll('.ts-tabs__tab');
      const panels = tabGroup.querySelectorAll('.ts-tabs__panel');

      tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
          // Remove active state from all tabs and panels
          tabs.forEach(t => t.setAttribute('aria-selected', 'false'));
          panels.forEach(p => p.hidden = true);

          // Add active state to clicked tab and corresponding panel
          tab.setAttribute('aria-selected', 'true');
          panels[index].hidden = false;
        });

        // Keyboard navigation
        tab.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault();
            const currentIndex = Array.from(tabs).indexOf(tab);
            let nextIndex;

            if (e.key === 'ArrowLeft') {
              nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
            } else {
              nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
            }

            tabs[nextIndex].focus();
            tabs[nextIndex].click();
          }
        });
      });
    });
  }

  // Modal functionality
  setupModals() {
    const modalTriggers = document.querySelectorAll('[data-modal-trigger]');
    const modals = document.querySelectorAll('.ts-modal');
    const closeButtons = document.querySelectorAll('.ts-modal__close');

    modalTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const modalId = trigger.getAttribute('data-modal-trigger');
        const modal = document.getElementById(modalId);
        if (modal) {
          this.openModal(modal);
        }
      });
    });

    closeButtons.forEach(button => {
      button.addEventListener('click', () => {
        const modal = button.closest('.ts-modal');
        this.closeModal(modal);
      });
    });

    modals.forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeModal(modal);
        }
      });

      modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeModal(modal);
        }
      });
    });
  }

  openModal(modal) {
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) {
      firstFocusable.focus();
    }
    document.body.style.overflow = 'hidden';
  }

  closeModal(modal) {
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Form validation and handling
  setupForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        if (!this.validateForm(form)) {
          e.preventDefault();
        }
      });

      // Real-time validation
      const inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        input.addEventListener('blur', () => this.validateField(input));
        input.addEventListener('input', () => {
          if (input.hasAttribute('aria-invalid')) {
            this.validateField(input);
          }
        });
      });
    });
  }

  validateForm(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    let isValid = true;

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    let isValid = true;
    let errorMessage = '';

    // Required field validation
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'This field is required';
    }

    // Email validation
    if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }
    }

    // Password validation
    if (type === 'password' && value && field.name === 'password') {
      if (value.length < 8) {
        isValid = false;
        errorMessage = 'Password must be at least 8 characters long';
      }
    }

    // Confirm password validation
    if (field.name === 'confirmPassword') {
      const passwordField = document.querySelector('input[name="password"]');
      if (passwordField && value !== passwordField.value) {
        isValid = false;
        errorMessage = 'Passwords do not match';
      }
    }

    this.setFieldValidation(field, isValid, errorMessage);
    return isValid;
  }

  setFieldValidation(field, isValid, errorMessage) {
    const errorElement = field.parentNode.querySelector('.ts-error-message');
    
    if (isValid) {
      field.setAttribute('aria-invalid', 'false');
      if (errorElement) {
        errorElement.remove();
      }
    } else {
      field.setAttribute('aria-invalid', 'true');
      
      if (errorElement) {
        errorElement.textContent = errorMessage;
      } else {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'ts-error-message';
        errorDiv.textContent = errorMessage;
        errorDiv.setAttribute('aria-live', 'polite');
        field.parentNode.appendChild(errorDiv);
      }
    }
  }

  // Shopping cart functionality
  setupCart() {
    const cartButtons = document.querySelectorAll('[data-action="add-to-cart"]');
    const wishlistButtons = document.querySelectorAll('[data-action="add-to-wishlist"]');
    const removeButtons = document.querySelectorAll('[data-action="remove-from-cart"]');
    const qtyInputs = document.querySelectorAll('.ts-qty-input');

    cartButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.addToCart(button.dataset.productId);
        this.showNotification('Item added to cart!', 'success');
      });
    });

    wishlistButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleWishlist(button.dataset.productId);
        const isWishlisted = button.classList.contains('ts-wishlisted');
        this.showNotification(
          isWishlisted ? 'Removed from wishlist' : 'Added to wishlist!',
          'success'
        );
        button.classList.toggle('ts-wishlisted');
      });
    });

    removeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.removeFromCart(button.dataset.productId);
        button.closest('.ts-cart-item').remove();
        this.updateCartTotals();
      });
    });

    qtyInputs.forEach(input => {
      input.addEventListener('change', () => {
        this.updateQuantity(input.dataset.productId, input.value);
        this.updateCartTotals();
      });
    });
  }

  addToCart(productId) {
    // Simulate adding to cart
    const cart = this.getCart();
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ id: productId, quantity: 1 });
    }
    
    this.saveCart(cart);
    this.updateCartCount();
  }

  removeFromCart(productId) {
    const cart = this.getCart();
    const filteredCart = cart.filter(item => item.id !== productId);
    this.saveCart(filteredCart);
    this.updateCartCount();
  }

  updateQuantity(productId, quantity) {
    const cart = this.getCart();
    const item = cart.find(item => item.id === productId);
    if (item) {
      item.quantity = parseInt(quantity);
    }
    this.saveCart(cart);
    this.updateCartCount();
  }

  toggleWishlist(productId) {
    const wishlist = this.getWishlist();
    const index = wishlist.indexOf(productId);
    
    if (index > -1) {
      wishlist.splice(index, 1);
    } else {
      wishlist.push(productId);
    }
    
    this.saveWishlist(wishlist);
  }

  getCart() {
    return JSON.parse(localStorage.getItem('toolsshare-cart') || '[]');
  }

  saveCart(cart) {
    localStorage.setItem('toolsshare-cart', JSON.stringify(cart));
  }

  getWishlist() {
    return JSON.parse(localStorage.getItem('toolsshare-wishlist') || '[]');
  }

  saveWishlist(wishlist) {
    localStorage.setItem('toolsshare-wishlist', JSON.stringify(wishlist));
  }

  updateCartCount() {
    const cart = this.getCart();
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartBadges = document.querySelectorAll('.ts-cart-count');
    cartBadges.forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'inline' : 'none';
    });
  }

  updateCartTotals() {
    // Simulate cart total calculation
    const subtotalElement = document.getElementById('cart-subtotal');
    const totalElement = document.getElementById('cart-total');
    
    if (subtotalElement && totalElement) {
      // Mock calculation - would be based on actual cart data
      const subtotal = 150.00;
      const shipping = 15.00;
      const total = subtotal + shipping;
      
      subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
      totalElement.textContent = `$${total.toFixed(2)}`;
    }
  }

  // Filter functionality for categories page
  setupFilters() {
    const filterForm = document.getElementById('filter-form');
    const productGrid = document.getElementById('product-grid');
    const emptyState = document.getElementById('empty-state');
    
    if (filterForm && productGrid) {
      const filters = filterForm.querySelectorAll('input, select');
      
      filters.forEach(filter => {
        filter.addEventListener('change', () => {
          this.applyFilters();
        });
      });
    }
  }

  applyFilters() {
    const filterForm = document.getElementById('filter-form');
    const productGrid = document.getElementById('product-grid');
    const emptyState = document.getElementById('empty-state');
    
    if (!filterForm || !productGrid) return;

    const formData = new FormData(filterForm);
    const filters = Object.fromEntries(formData);
    
    const products = productGrid.querySelectorAll('.ts-product-card');
    let visibleCount = 0;

    products.forEach(product => {
      let shouldShow = true;

      // Apply category filter
      if (filters.category && filters.category !== 'all') {
        const productCategory = product.dataset.category;
        if (productCategory !== filters.category) {
          shouldShow = false;
        }
      }

      // Apply price range filter
      if (filters.priceRange) {
        const productPrice = parseFloat(product.dataset.price);
        const [min, max] = filters.priceRange.split('-').map(Number);
        if (productPrice < min || productPrice > max) {
          shouldShow = false;
        }
      }

      // Apply condition filter
      if (filters.condition && filters.condition !== 'all') {
        const productCondition = product.dataset.condition;
        if (productCondition !== filters.condition) {
          shouldShow = false;
        }
      }

      product.style.display = shouldShow ? 'block' : 'none';
      if (shouldShow) visibleCount++;
    });

    // Show/hide empty state
    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  // Checkout functionality
  setupCheckout() {
    const stepperSteps = document.querySelectorAll('.ts-stepper__step');
    const checkoutSections = document.querySelectorAll('.ts-checkout-section');
    const nextButtons = document.querySelectorAll('.ts-next-step');
    const prevButtons = document.querySelectorAll('.ts-prev-step');
    const placeOrderBtn = document.getElementById('place-order-btn');

    let currentStep = 0;

    nextButtons.forEach(button => {
      button.addEventListener('click', () => {
        if (currentStep < stepperSteps.length - 1) {
          currentStep++;
          this.updateCheckoutStep(currentStep, stepperSteps, checkoutSections);
        }
      });
    });

    prevButtons.forEach(button => {
      button.addEventListener('click', () => {
        if (currentStep > 0) {
          currentStep--;
          this.updateCheckoutStep(currentStep, stepperSteps, checkoutSections);
        }
      });
    });

    if (placeOrderBtn) {
      placeOrderBtn.addEventListener('click', () => {
        this.simulateEscrowTransaction();
      });
    }

    // Payment method toggle
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    paymentMethods.forEach(method => {
      method.addEventListener('change', () => {
        this.togglePaymentFields(method.value);
      });
    });
  }

  updateCheckoutStep(step, stepperSteps, checkoutSections) {
    // Update stepper
    stepperSteps.forEach((stepElement, index) => {
      stepElement.classList.remove('ts-stepper__step--active', 'ts-stepper__step--completed');
      if (index < step) {
        stepElement.classList.add('ts-stepper__step--completed');
      } else if (index === step) {
        stepElement.classList.add('ts-stepper__step--active');
      }
    });

    // Update sections
    checkoutSections.forEach((section, index) => {
      section.style.display = index === step ? 'block' : 'none';
    });

    // Focus management
    const activeSection = checkoutSections[step];
    if (activeSection) {
      const firstFocusable = activeSection.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }
  }

  togglePaymentFields(paymentMethod) {
    const cardFields = document.getElementById('card-fields');
    const upiFields = document.getElementById('upi-fields');
    const netBankingFields = document.getElementById('net-banking-fields');

    // Hide all payment fields
    [cardFields, upiFields, netBankingFields].forEach(field => {
      if (field) field.style.display = 'none';
    });

    // Show selected payment fields
    switch (paymentMethod) {
      case 'card':
        if (cardFields) cardFields.style.display = 'block';
        break;
      case 'upi':
        if (upiFields) upiFields.style.display = 'block';
        break;
      case 'netbanking':
        if (netBankingFields) netBankingFields.style.display = 'block';
        break;
    }
  }

  simulateEscrowTransaction() {
    const escrowModal = document.getElementById('escrow-modal');
    if (escrowModal) {
      this.openModal(escrowModal);
      
      // Simulate processing time
      setTimeout(() => {
        const processingMsg = escrowModal.querySelector('.ts-processing');
        const successMsg = escrowModal.querySelector('.ts-success');
        
        if (processingMsg) processingMsg.style.display = 'none';
        if (successMsg) successMsg.style.display = 'block';
      }, 3000);
    }
  }

  // Faculty page password gate
  setupFacultyPage() {
    if (window.location.pathname.includes('/hidden/faculty.html')) {
      const content = document.getElementById('faculty-content');
      const passwordModal = document.getElementById('password-modal');
      const passwordForm = document.getElementById('password-form');

      if (content && passwordModal && passwordForm) {
        // Hide content and show password modal
        content.style.display = 'none';
        this.openModal(passwordModal);

        passwordForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const password = passwordForm.querySelector('input[type="password"]').value;
          
          if (password === 'faculty2025') {
            this.closeModal(passwordModal);
            content.style.display = 'block';
            this.showNotification('Access granted!', 'success');
          } else {
            this.showNotification('Incorrect password. Try again.', 'error');
          }
        });
      }
    }
  }

  // Accessibility enhancements
  setupAccessibility() {
    // Add keyboard navigation for dropdowns
    const dropdowns = document.querySelectorAll('.ts-dropdown');
    dropdowns.forEach(dropdown => {
      const trigger = dropdown.querySelector('.ts-dropdown__trigger');
      const menu = dropdown.querySelector('.ts-dropdown__menu');

      if (trigger && menu) {
        trigger.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            menu.hidden = !menu.hidden;
          }
        });
      }
    });

    // Improve focus visibility
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-nav');
    });

    // Live region for dynamic content updates
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'live-region';
    document.body.appendChild(liveRegion);
  }

  // Animation helpers
  setupAnimations() {
    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      document.documentElement.style.setProperty('--animation-duration', '0s');
      document.documentElement.style.setProperty('--transition-duration', '0s');
    }

    // Intersection Observer for scroll animations
    if ('IntersectionObserver' in window) {
      const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('ts-animate-in');
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      const animateElements = document.querySelectorAll('.ts-animate-on-scroll');
      animateElements.forEach(element => observer.observe(element));
    }
  }

  // Notification system
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `ts-notification ts-notification--${type}`;
    notification.innerHTML = `
      <div class="ts-notification__content">
        <i class="fas fa-${this.getNotificationIcon(type)}"></i>
        <span>${message}</span>
      </div>
      <button class="ts-notification__close" aria-label="Close notification">
        <i class="fas fa-times"></i>
      </button>
    `;

    const container = this.getOrCreateNotificationContainer();
    container.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 5000);

    // Close button
    const closeBtn = notification.querySelector('.ts-notification__close');
    closeBtn.addEventListener('click', () => {
      notification.remove();
    });

    // Announce to screen readers
    const liveRegion = document.getElementById('live-region');
    if (liveRegion) {
      liveRegion.textContent = message;
    }
  }

  getNotificationIcon(type) {
    const icons = {
      success: 'check-circle',
      error: 'exclamation-triangle',
      warning: 'exclamation-circle',
      info: 'info-circle'
    };
    return icons[type] || 'info-circle';
  }

  getOrCreateNotificationContainer() {
    let container = document.getElementById('notification-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'notification-container';
      container.className = 'ts-notification-container';
      container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1001;
        display: flex;
        flex-direction: column;
        gap: 10px;
      `;
      document.body.appendChild(container);
    }
    return container;
  }

  // Utility methods
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }
}

// Initialize the application
const app = new ToolsShareApp();

// CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
  .ts-notification {
    background: var(--ts-dark);
    color: var(--ts-text-primary);
    padding: var(--ts-space-4);
    border-radius: var(--ts-radius-lg);
    box-shadow: var(--ts-shadow-lg);
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 300px;
    max-width: 400px;
    margin-bottom: var(--ts-space-2);
    animation: slideIn 0.3s ease-out;
  }

  .ts-notification--success {
    border-left: 4px solid var(--ts-success);
  }

  .ts-notification--error {
    border-left: 4px solid var(--ts-danger);
  }

  .ts-notification--warning {
    border-left: 4px solid var(--ts-warning);
  }

  .ts-notification--info {
    border-left: 4px solid var(--ts-accent-hover);
  }

  .ts-notification__content {
    display: flex;
    align-items: center;
    gap: var(--ts-space-3);
  }

  .ts-notification__close {
    background: transparent;
    border: none;
    color: var(--ts-text-primary);
    cursor: pointer;
    padding: var(--ts-space-2);
    border-radius: var(--ts-radius);
  }

  .ts-notification__close:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .ts-notification {
      animation: none;
    }
  }
`;
document.head.appendChild(notificationStyles);