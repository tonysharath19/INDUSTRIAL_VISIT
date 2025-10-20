import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('adminLogin');
  const userInput = document.getElementById('adminUser');
  const passInput = document.getElementById('adminPass');
  const msg = document.getElementById('msg');
  const toggle = document.getElementById('togglePw');

  // Toggle password visibility
  toggle.addEventListener('click', () => {
    const t = passInput.type === 'password' ? 'text' : 'password';
    passInput.type = t;
    toggle.textContent = (t === 'text') ? '🙈' : '👁️';
  });

  // Submit handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.textContent = '';

    const u = userInput.value.trim();
    const p = passInput.value;

    // Fixed credentials for simplicity
    const FIXED_ADMIN = { username: 'admin', password: 'Visit2025!' };
    if (u === FIXED_ADMIN.username && p === FIXED_ADMIN.password) {
      // Mark admin as logged in (used by admin.html)
      localStorage.setItem('adminLoggedIn', 'true');

      // Show success message then redirect
      msg.style.color = 'green';
      msg.textContent = 'Login successful — redirecting...';

      // Redirect after a brief delay
      setTimeout(() => {
        window.location.href = 'admin.html';
      }, 1000);
      return;
    } else {
      // Invalid credentials handling
      msg.style.color = '#b91c1c';
      msg.textContent = 'Invalid username or password.';
      // brief shake animation
      form.style.transform = 'translateX(-6px)';
      setTimeout(() => form.style.transform = 'translateX(6px)', 80);
      setTimeout(() => form.style.transform = '', 160);
      // Clear password
      passInput.value = '';
      passInput.focus();
      return;
    }
  });

  // allow Enter to submit in fields (default behavior), so no extra code needed
});
