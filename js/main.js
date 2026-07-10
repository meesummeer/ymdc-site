document.getElementById('year').textContent = new Date().getFullYear();

// Subtle shadow on nav after scroll
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    nav.style.boxShadow = '0 4px 20px rgba(26,10,110,0.08)';
  } else {
    nav.style.boxShadow = 'none';
  }
});
