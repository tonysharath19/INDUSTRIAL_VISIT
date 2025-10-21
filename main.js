// small interactions for index.html
document.addEventListener('DOMContentLoaded', () => {
    const ham = document.getElementById('hamburger');
    const sideMenu = document.getElementById('sideMenu');
    ham.addEventListener('click', () => {
      // Toggle side menu
      sideMenu.classList.toggle('open');
      // Update hamburger icon
      ham.classList.toggle('active');
      if (ham.classList.contains('active')) {
        ham.innerText = '✕';
        document.body.classList.add('menu-open');
      } else {
        ham.innerText = '☰';
        document.body.classList.remove('menu-open');
      }
    });

    // Close menu when clicking outside or close button
    document.addEventListener('click', (e) => {
      if (!sideMenu.contains(e.target) && !ham.contains(e.target)) {
        sideMenu.classList.remove('open');
        ham.classList.remove('active');
        ham.innerText = '☰';
        document.body.classList.remove('menu-open');
      }
    });

    // Close button functionality
    const closeBtn = document.getElementById('closeMenu');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        sideMenu.classList.remove('open');
        ham.classList.remove('active');
        ham.innerText = '☰';
        document.body.classList.remove('menu-open');
      });
    }

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
  