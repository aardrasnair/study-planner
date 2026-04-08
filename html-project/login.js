// Login page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const errorMessage = document.getElementById('errorMessage');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const name = document.getElementById('name').value.trim();
        const password = document.getElementById('password').value;
        
        // Clear previous error messages
        errorMessage.textContent = '';
        errorMessage.style.display = 'none';
        
        // Validate VIT email format
        if (!validateVITEmail(email)) {
            showError('Please enter a valid VIT student email (format: name@vitstudent.ac.in)');
            return;
        }
        
        // Validate other fields
        if (!name || name.length < 2) {
            showError('Please enter a valid name');
            return;
        }
        
        if (!password || password.length < 6) {
            showError('Password must be at least 6 characters long');
            return;
        }
        
        // Store user data in localStorage
        const userData = {
            email: email,
            name: name,
            loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        // Redirect to main page
        window.location.href = 'index.html';
    });
    
    // Real-time email validation feedback
    emailInput.addEventListener('input', function() {
        const email = this.value.trim();
        if (email && !validateVITEmail(email)) {
            this.style.borderColor = '#e74c3c';
        } else if (email && validateVITEmail(email)) {
            this.style.borderColor = '#27ae60';
        } else {
            this.style.borderColor = '#ddd';
        }
    });
});

function validateVITEmail(email) {
    // VIT email format: name@vitstudent.ac.in
    const vitEmailRegex = /^[a-zA-Z0-9._%+-]+@vitstudent\.ac\.in$/;
    return vitEmailRegex.test(email);
}

function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    
    // Auto-hide error after 5 seconds
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}

function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('toggleIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.textContent = '🙈';
    } else {
        passwordInput.type = 'password';
        toggleIcon.textContent = '👁️';
    }
}

// Check if user is already logged in
window.addEventListener('load', function() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        // User is already logged in, redirect to main page
        window.location.href = 'index.html';
    }
});
