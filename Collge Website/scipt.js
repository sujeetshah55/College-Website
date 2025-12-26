// Initialize Lucide Icons (must be called after DOMContentLoaded if loaded in the head, 
// but since the script is loaded at the end of the body, we can just call it)
lucide.createIcons();

// -----------------------------------------------------------
// 1. Utility Functions (Message Box)
// -----------------------------------------------------------
const messageBox = document.getElementById('message-box');

/**
 * Displays a temporary message to the user instead of using alert().
 * @param {string} message - The message content.
 * @param {string} type - 'success' or 'error'.
 */
function showMessage(message, type) {
    messageBox.textContent = message;
    // Remove previous classes and add the new one based on type
    messageBox.classList.remove('hidden', 'bg-green-500', 'bg-red-500');
    messageBox.classList.add('opacity-100', type === 'success' ? 'bg-green-500' : 'bg-red-500');

    // Hide the message after 3 seconds
    setTimeout(() => {
        messageBox.classList.remove('opacity-100');
        messageBox.classList.add('opacity-0');
        setTimeout(() => {
            messageBox.classList.add('hidden');
        }, 300); // Wait for fade-out transition
    }, 3000);
}

// -----------------------------------------------------------
// 2. Navigation & Smooth Scrolling
// -----------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    // Set the current year in the footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Mobile Menu Toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Smooth Scrolling and Active Link Highlighting
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (!mobileMenu.classList.contains('hidden')) {
                 mobileMenu.classList.add('hidden');
            }

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                // Scroll smoothly to the target element
                // Subtract header height (64px from h-16 + any padding/margin if present)
                window.scrollTo({
                    top: targetElement.offsetTop - 64, 
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for active link highlighting
    const sections = document.querySelectorAll('section');
    const observerOptions = {
        root: null,
        // When the section reaches 30% from the top of the viewport, it's considered 'in view'
        rootMargin: '0px 0px -70% 0px', 
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const sectionId = entry.target.id;
            const correspondingLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);

            if (correspondingLink) {
                if (entry.isIntersecting) {
                    // Highlight the active link
                    correspondingLink.classList.add('text-secondary', 'font-bold');
                    correspondingLink.classList.remove('text-primary');
                } else {
                    // Un-highlight non-active link
                    correspondingLink.classList.remove('text-secondary', 'font-bold');
                    correspondingLink.classList.add('text-primary');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
});

// -----------------------------------------------------------
// 3. Form Validation Logic
// -----------------------------------------------------------

/**
 * Validates a single input field.
 * @param {HTMLElement} input - The input element to validate.
 * @returns {boolean} True if validation passed, false otherwise.
 */
function validateInput(input) {
    const errorElement = document.getElementById(input.id + '_error');
    let isValid = true;
    let errorMessage = '';

    // Check for required field
    if (input.hasAttribute('required') && input.value.trim() === '') {
        isValid = false;
        errorMessage = input.id.includes('name') ? 'Name is required.' : 
                       input.id.includes('email') ? 'Email is required.' : 
                       input.id.includes('message') ? 'Message cannot be empty.' :
                       'This field is required.';
    } 
    
    // Basic email format check
    else if (input.type === 'email' && input.value.trim() !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value.trim())) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        }
    }

    // Check for select/dropdown (program/event)
    else if (input.tagName === 'SELECT' && input.value === '') {
        isValid = false;
        errorMessage = 'Selection is required.';
    }


    // Display or hide error message
    if (errorElement) {
        if (!isValid) {
            errorElement.textContent = errorMessage;
            errorElement.classList.remove('hidden');
            input.classList.add('border-red-500');
        } else {
            errorElement.classList.add('hidden');
            input.classList.remove('border-red-500');
        }
    }
    return isValid;
}

/**
 * Validates an entire form.
 * @param {HTMLFormElement} form - The form element to validate.
 * @returns {boolean} True if all fields are valid, false otherwise.
 */
function validateForm(form) {
    let formIsValid = true;
    // Query all required inputs/textareas/selects within the form
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');

    inputs.forEach(input => {
        // Run validation and update form validity flag
        if (!validateInput(input)) {
            formIsValid = false;
        }
    });

    return formIsValid;
}


// -----------------------------------------------------------
// 4. Attach Validation to Forms
// -----------------------------------------------------------

// Admissions Form Submission Handler
const admissionsForm = document.getElementById('admissions-form');
if (admissionsForm) {
    admissionsForm.addEventListener('submit', function(e) {
        e.preventDefault();

        if (validateForm(this)) {
            // Simulation of a successful form submission
            showMessage('Application Submitted Successfully! We will review your submission shortly.', 'success');
            this.reset();
        } else {
            showMessage('Please correct the errors in the application form.', 'error');
        }
    });
}

// Event Registration Form Submission Handler
const eventRegistrationForm = document.getElementById('event-registration-form');
if (eventRegistrationForm) {
    eventRegistrationForm.addEventListener('submit', function(e) {
        e.preventDefault();

        if (validateForm(this)) {
            // Simulation of a successful form submission
            showMessage('Event Registration Successful! Check your email for details.', 'success');
            this.reset();
        } else {
            showMessage('Please correct the errors in the event registration form.', 'error');
        }
    });
}

// Contact Form Submission Handler
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        if (validateForm(this)) {
            // Simulation of a successful form submission
            showMessage('Message Sent! We will get back to you within 48 hours.', 'success');
            this.reset();
        } else {
            showMessage('Please correct the errors in the contact form.', 'error');
        }
    });
}

// Add real-time input validation (on blur) to all relevant fields
document.querySelectorAll('input, textarea, select').forEach(input => {
    input.addEventListener('blur', function() {
        validateInput(this);
    });
});