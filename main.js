// small interactions for index.html
document.addEventListener('DOMContentLoaded', () => {
    const ham = document.getElementById('hamburger');
    ham.addEventListener('click', () => {
      // simple feedback - brief toggle effect
      ham.classList.toggle('active');
      if (ham.classList.contains('active')) {
        ham.innerText = '✕';
      } else {
        ham.innerText = '☰';
      }
    });
  
    // optional quick keyboard shortcut: press "S" to go to Student page
    document.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 's' && !e.metaKey && !e.ctrlKey) {
        const el = document.getElementById('studentBtn');
        if (el) window.location.href = el.href;
      }
      if (e.key.toLowerCase() === 'a' ) {
        const el = document.getElementById('adminBtn');
        if (el) window.location.href = el.href;
      }
    });
  });
  