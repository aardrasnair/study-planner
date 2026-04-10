document.addEventListener('DOMContentLoaded', function() 
{
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const errorMessage = document.getElementById('errorMessage');
    loginForm.addEventListener('submit', function(e) 
    {
        e.preventDefault();
        const email = emailInput.value.trim();
        const name = document.getElementById('name').value.trim();
        const password = document.getElementById('password').value;
        errorMessage.textContent = '';
        errorMessage.style.display = 'none';
        if (!validateVITEmail(email)) 
            {
            showError('Please enter a valid VIT student email (format: name@vitstudent.ac.in)');
            return;
        }
        if (!name || name.length < 2) {
            showError('Please enter a valid name');
            return;
        }
        if (!password || password.length < 6) {
            showError('Password must be at least 6 characters long');
            return;
        }
        const userData = {
            email: email,
            name: name,
            loginTime: new Date().toISOString()
        };
        localStorage.setItem('currentUser', JSON.stringify(userData));
        window.location.href = 'index.html';
    });
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
function validateVITEmail(email) 
{
    const vitEmailRegex = /^[a-zA-Z0-9._%+-]+@vitstudent\.ac\.in$/;
    return vitEmailRegex.test(email);
}
function showError(message) 
{
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}
function togglePassword() 
{
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
window.addEventListener('load', function() 
{
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        window.location.href = 'index.html';
    }
});
