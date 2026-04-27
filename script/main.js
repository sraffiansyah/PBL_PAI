/* ============================================= */
/* 1. DOM REFERENCES                            */
/* ============================================= */

// Navbar elements
const navbar = document.getElementById('navbar');
const dropdownToggle = document.getElementById('dropdown-toggle');
const dropdownPanel = document.getElementById('dropdown-panel');
const hamburger = document.getElementById('hamburger');

// Mobile menu elements
const mobileOverlay = document.getElementById('mobile-overlay');
const mobileDropdownToggle = document.getElementById('mobile-dropdown-toggle');
const mobileDropdownPanel = document.getElementById('mobile-dropdown-panel');

// Hero elements
const heroBg = document.getElementById('hero-bg');
const heroShapes = document.getElementById('hero-shapes');
const heroTitle = document.getElementById('hero-title');
const heroHighlight = document.getElementById('hero-highlight');
const heroSubtitle = document.getElementById('hero-subtitle');
const heroActions = document.getElementById('hero-actions');
const scrollIndicator = document.getElementById('scroll-indicator');

// Magnetic buttons
const magneticButtons = document.querySelectorAll('[data-magnetic]');

// All navbar links
const navbarLinks = document.querySelectorAll('.navbar__link');

/* ============================================= */
/* 2. NAVBAR SCROLL EFFECT (CAPSULE TRANSFORM)  */
/* ============================================= */

let lastScrollY = 0;
let ticking = false;

function handleNavbarScroll() {
  const scrollY = window.scrollY || window.pageYOffset;

  if (scrollY > 60) {
    navbar.classList.add('navbar--scrolled');
  } else {
    navbar.classList.remove('navbar--scrolled');
  }

  lastScrollY = scrollY;
  ticking = false;
}

window.addEventListener('scroll', function() {
  if (!ticking) {
    window.requestAnimationFrame(handleNavbarScroll);
    ticking = true;
  }
}, { passive: true });

handleNavbarScroll();

/* ============================================= */
/* 3. DROPDOWN INTERACTION (DESKTOP)            */
/* ============================================= */

let dropdownVisible = false;

function toggleDropdown(event) {
  event.preventDefault();
  dropdownVisible = !dropdownVisible;

  dropdownPanel.classList.toggle('navbar__dropdown--visible', dropdownVisible);

  const arrowIcon = dropdownToggle.querySelector('.navbar__dropdown-icon');
  arrowIcon.classList.toggle('navbar__dropdown-icon--active', dropdownVisible);
}

dropdownToggle.addEventListener('click', toggleDropdown);

document.addEventListener('click', function(event) {
  if (dropdownVisible &&
      !dropdownPanel.contains(event.target) &&
      !dropdownToggle.contains(event.target)) {
    dropdownVisible = false;
    dropdownPanel.classList.remove('navbar__dropdown--visible');
    dropdownToggle.querySelector('.navbar__dropdown-icon')
      .classList.remove('navbar__dropdown-icon--active');
  }
});

document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape' && dropdownVisible) {
    dropdownVisible = false;
    dropdownPanel.classList.remove('navbar__dropdown--visible');
    dropdownToggle.querySelector('.navbar__dropdown-icon')
      .classList.remove('navbar__dropdown-icon--active');
  }
});

/* ============================================= */
/* 4. MOBILE MENU TOGGLE                        */
/* ============================================= */

let mobileMenuOpen = false;

function toggleMobileMenu() {
  mobileMenuOpen = !mobileMenuOpen;
  mobileOverlay.classList.toggle('navbar__mobile-overlay--visible', mobileMenuOpen);
  hamburger.classList.toggle('navbar__hamburger--active', mobileMenuOpen);

  if (mobileMenuOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

hamburger.addEventListener('click', toggleMobileMenu);

mobileOverlay.addEventListener('click', function(event) {
  if (event.target === mobileOverlay) {
    toggleMobileMenu();
  }
});

document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape' && mobileMenuOpen) {
    toggleMobileMenu();
  }
});

const mobileLinks = mobileOverlay.querySelectorAll('.navbar__mobile-link, .navbar__mobile-dropdown-link');
mobileLinks.forEach(function(link) {
  link.addEventListener('click', function() {
    if (mobileMenuOpen) {
      toggleMobileMenu();
    }
  });
});

/* ============================================= */
/* 5. MOBILE DROPDOWN TOGGLE                    */
/* ============================================= */

let mobileDropdownOpen = false;

function toggleMobileDropdown(event) {
  event.preventDefault();
  mobileDropdownOpen = !mobileDropdownOpen;
  mobileDropdownPanel.classList.toggle('navbar__mobile-dropdown--visible', mobileDropdownOpen);

  const arrowIcon = mobileDropdownToggle.querySelector('.navbar__dropdown-icon');
  if (mobileDropdownOpen) {
    arrowIcon.style.transform = 'rotate(180deg)';
  } else {
    arrowIcon.style.transform = 'rotate(0deg)';
  }
}

mobileDropdownToggle.addEventListener('click', toggleMobileDropdown);

/* ============================================= */
/* 6. MAGNETIC BUTTON EFFECT                    */
/* ============================================= */

function initMagneticButton(button, strength = 0.3, radius = 80) {
  button.addEventListener('mousemove', function(event) {
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const deltaX = mouseX - centerX;
    const deltaY = mouseY - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance < radius) {
      const pullX = deltaX * strength * (1 - distance / radius);
      const pullY = deltaY * strength * (1 - distance / radius);
      button.style.transform = `translate(${pullX}px, ${pullY}px)`;
    }
  });

  button.addEventListener('mouseleave', function() {
    button.style.transform = 'translate(0px, 0px)';
  });
}

if (window.matchMedia('(min-width: 48rem)').matches) {
  magneticButtons.forEach(function(btn) {
    initMagneticButton(btn);
  });
}

/* ============================================= */
/* 7. PARALLAX SCROLL EFFECT                    */
/* ============================================= */

function handleParallax() {
  const scrollY = window.scrollY || window.pageYOffset;
  const heroHeight = document.querySelector('.hero').offsetHeight;

  if (scrollY < heroHeight) {
    const parallaxFactor = scrollY * 0.3;

    if (heroBg) {
      const bgImage = heroBg.querySelector('.hero__bg-image');
      if (bgImage) {
        bgImage.style.transform = `translateY(${parallaxFactor * 0.5}px) scale(1.05)`;
      }
    }

    if (heroShapes) {
      const shapes = heroShapes.querySelectorAll('.hero__shape');
      shapes.forEach(function(shape, index) {
        const speed = 0.15 + (index * 0.05);
        shape.style.transform = `translateY(${scrollY * speed}px)`;
      });
    }
  }
}

window.addEventListener('scroll', function() {
  if (!ticking) {
    window.requestAnimationFrame(handleParallax);
  }
}, { passive: true });

/* ============================================= */
/* 8. HERO SCROLL INDICATOR VISIBILITY          */
/* ============================================= */

function initScrollIndicator() {
  setTimeout(function() {
    if (scrollIndicator) {
      scrollIndicator.classList.add('hero__scroll-indicator--visible');
    }
  }, 1200);

  let scrollTimeout;
  window.addEventListener('scroll', function() {
    if (scrollIndicator && scrollIndicator.classList.contains('hero__scroll-indicator--visible')) {
      scrollIndicator.classList.remove('hero__scroll-indicator--visible');

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(function() {
        if (window.scrollY < 100) {
          scrollIndicator.classList.add('hero__scroll-indicator--visible');
        }
      }, 500);
    }
  }, { passive: true });
}

initScrollIndicator();

/* ============================================= */
/* 9. INTERSECTION OBSERVER - SCROLL ANIMATIONS */
/* ============================================= */

function initScrollAnimations() {
  const heroElements = [
    heroTitle,
    heroSubtitle,
    heroActions
  ];

  const heroObserver = new IntersectionObserver(
    function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add(entry.target.classList[0].replace('title', 'title--visible')
            .replace('subtitle', 'subtitle--visible')
            .replace('actions', 'actions--visible'));

          heroObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  heroElements.forEach(function(element) {
    if (element) {
      heroObserver.observe(element);
    }
  });

  const sectionObserver = new IntersectionObserver(
    function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          sectionObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -80px 0px'
    }
  );

  document.querySelectorAll('.placeholder-section').forEach(function(section) {
    section.style.opacity = '0';
    section.style.transform = 'translateY(40px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    sectionObserver.observe(section);
  });
}

initScrollAnimations();

/* ============================================= */
/* 10. ACTIVE NAV LINK ON SCROLL                */
/* ============================================= */

function initActiveNavLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar__link');
  const mobileNavLinks = document.querySelectorAll('.navbar__mobile-link');

  const navObserver = new IntersectionObserver(
    function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('id');

          navLinks.forEach(function(link) {
            link.classList.remove('navbar__link--active');
          });
          const activeLink = document.querySelector('.navbar__link[href="#' + sectionId + '"]');
          if (activeLink) {
            activeLink.classList.add('navbar__link--active');
          }

          mobileNavLinks.forEach(function(link) {
            link.classList.remove('navbar__mobile-link--active');
          });
          const activeMobileLink = document.querySelector('.navbar__mobile-link[href="#' + sectionId + '"]');
          if (activeMobileLink) {
            activeMobileLink.classList.add('navbar__mobile-link--active');
          }
        }
      });
    },
    {
      threshold: 0.3,
      rootMargin: '-72px 0px 0px 0px'
    }
  );

  sections.forEach(function(section) {
    navObserver.observe(section);
  });
}

initActiveNavLinks();

/* ============================================= */
/* 11. SMOOTH SCROLL FOR NAV LINKS              */
/* ============================================= */

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function(link) {
    link.addEventListener('click', function(event) {
      const targetId = this.getAttribute('href');

      if (targetId === '#') {
        event.preventDefault();
        return;
      }

      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        event.preventDefault();

        const navbarHeight = navbar.querySelector('.navbar__inner').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight - 16;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        if (dropdownVisible) {
          dropdownVisible = false;
          dropdownPanel.classList.remove('navbar__dropdown--visible');
          dropdownToggle.querySelector('.navbar__dropdown-icon').classList.remove('navbar__dropdown-icon--active');
        }
      }
    });
  });
}

initSmoothScroll();

/* ============================================= */
/* 12. HERO TITLE HOVER TILT EFFECT             */
/* ============================================= */

if (heroHighlight) {
  heroHighlight.addEventListener('mousemove', function(event) {
    const rect = heroHighlight.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const deltaX = (mouseX - centerX) / (rect.width / 2);
    const deltaY = (mouseY - centerY) / (rect.height / 2);

    const rotateX = deltaY * -5;
    const rotateY = deltaX * 5;

    heroHighlight.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  });

  heroHighlight.addEventListener('mouseleave', function() {
    heroHighlight.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)';
  });
}

/* ============================================= */
/* 13. WINDOW RESIZE HANDLER                    */
/* ============================================= */

let resizeTimeout;
window.addEventListener('resize', function() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(function() {
    if (window.matchMedia('(min-width: 48rem)').matches && mobileMenuOpen) {
      toggleMobileMenu();
    }

    if (window.matchMedia('(min-width: 48rem)').matches) {
      magneticButtons.forEach(function(btn) {
        initMagneticButton(btn);
      });
    }
  }, 250);
});

/* ============================================= */
/* 14. CONSOLE WELCOME MESSAGE                  */
/* ============================================= */
console.log(
  '%c Kelompok 2 - Pengabdian Masyarakat ',
  'background: #948979; color: #222831; font-size: 14px; font-weight: bold; padding: 8px 16px; border-radius: 4px;'
);
console.log('Website loaded successfully! ');
