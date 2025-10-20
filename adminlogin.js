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

    // For simplicity, use username as email (e.g., admin@admin.com)
    const email = u + '@admin.com';

    try {
      await signInWithEmailAndPassword(window.auth, email, p);
      // Redirect immediately
      window.location.href = 'admin.html';
    } catch (error) {
      console.error("Login error:", error);
      // Invalid credentials handling
      msg.style.color = '#b91c1c';
      msg.textContent = 'Invalid username or password.';
      // brief shake animation (CSS-less)
      form.style.transform = 'translateX(-6px)';
      setTimeout(() => form.style.transform = 'translateX(6px)', 80);
      setTimeout(() => form.style.transform = '', 160);

      // Optionally clear only password for security
      passInput.value = '';
      passInput.focus();
    }
  });

  // allow Enter to submit in fields (default behavior), so no extra code needed
});
