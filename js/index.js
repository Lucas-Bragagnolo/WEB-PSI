document.addEventListener('DOMContentLoaded', function() {
    const logoStrip = document.querySelector('.logo-strip');
    const logos = logoStrip.querySelectorAll('.logo');
    
    // Clone logos to create a seamless loop
    logos.forEach(logo => {
        const clone = logo.cloneNode(true);
        logoStrip.appendChild(clone);
    });

    // Adjust animation duration based on the number of logos
    const totalLogos = logoStrip.querySelectorAll('.logo').length;
    const animationDuration = totalLogos * 2; // 5 seconds per logo
    logoStrip.style.animationDuration = `${animationDuration}s`;
});