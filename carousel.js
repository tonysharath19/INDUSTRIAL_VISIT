document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.dot');
  let currentSlide = 0;
  const totalSlides = slides.length;

  // Function to show slide
  function showSlide(index) {
    // Hide all slides
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    // Show current slide
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    currentSlide = index;
  }

  // Function to next slide
  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
  }

  // Auto advance every 3 seconds
  setInterval(nextSlide, 3000);

  // Dot click handlers
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
    });
  });

  // Initialize first slide
  showSlide(0);
});
