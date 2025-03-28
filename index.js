/**
 * Main JavaScript for LiquidVest Landing Page
 * Contains primary interactive functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeAll();
    
    // Header scroll effect
    function initializeHeader() {
        const header = document.querySelector('header');
        const mobileToggle = document.querySelector('.mobile-toggle');
        const nav = document.querySelector('nav');
        
        if (header) {
            window.addEventListener('scroll', function() {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });
        }
        
        // Mobile menu toggle
        if (mobileToggle && nav) {
            mobileToggle.addEventListener('click', function() {
                nav.classList.toggle('open');
                mobileToggle.setAttribute('aria-expanded', 
                    nav.classList.contains('open') ? 'true' : 'false');
            });
        }
    }
    
    // Initialize fade-in animations
    function initializeFadeInElements() {
        const fadeElements = document.querySelectorAll('.fade-in');
        
        if (fadeElements.length > 0) {
            // Create IntersectionObserver
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        // Unobserve element after it's visible
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            // Observe each element
            fadeElements.forEach(element => {
                observer.observe(element);
            });
        }
    }
    
    // Initialize staggered fade-in animations
    function initializeStaggeredFadeIn() {
        const staggerContainers = document.querySelectorAll('.stagger-fade-in');
        
        if (staggerContainers.length > 0) {
            // Create IntersectionObserver
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Add visible class to each child with a delay
                        const children = entry.target.children;
                        Array.from(children).forEach((child, index) => {
                            setTimeout(() => {
                                child.classList.add('visible');
                            }, index * 100);
                        });
                        // Unobserve container after children are visible
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            // Observe each container
            staggerContainers.forEach(container => {
                observer.observe(container);
            });
        }
    }
    
    // Smooth scroll for anchor links
    function initializeSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    const nav = document.querySelector('nav');
                    if (nav && nav.classList.contains('open')) {
                        nav.classList.remove('open');
                        document.querySelector('.mobile-toggle').setAttribute('aria-expanded', 'false');
                    }
                }
            });
        });
    }
    
    // Initialize liquid drops animation
    function initializeLiquidDrops() {
        // Find the hero section to contain drops
        const heroSection = document.querySelector('.hero');
        if (!heroSection) return;
        
        function addRandomDrops() {
            const numDrops = Math.floor(Math.random() * 3) + 1;
            
            for (let i = 0; i < numDrops; i++) {
                const drop = document.createElement('div');
                drop.classList.add('liquid-drop');
                
                // Random position within the hero section
                const posX = Math.random() * 80 + 10; // 10% to 90% of section width
                drop.style.left = `${posX}%`;
                
                // Random delay
                const delay = Math.random() * 2;
                drop.style.animationDelay = `${delay}s`;
                
                // Append to hero section instead of body
                heroSection.appendChild(drop);
                
                // Remove after animation completes
                setTimeout(() => {
                    if (heroSection.contains(drop)) {
                        heroSection.removeChild(drop);
                    }
                }, 5000);
            }
            
            // Schedule next drops
            setTimeout(addRandomDrops, Math.random() * 2000 + 1000);
        }
        
        // Start liquid drops animation
        addRandomDrops();
    }
    
    // Initialize canvas animations
    function initializeCanvasAnimations() {
        // Get canvas element
        const canvas = document.getElementById('liquidCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Set canvas dimensions to match the hero section
        function resizeCanvas() {
            const heroSection = canvas.closest('.hero');
            if (heroSection) {
                canvas.width = heroSection.offsetWidth;
                canvas.height = heroSection.offsetHeight;
                
                // Force redraw all elements after resize to prevent visual glitches
                initParticles();
                initDrops();
            }
        }
        
        // Liquid drops class
        class Drop {
            constructor() {
                this.reset();
            }
            
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = -50; // Start above the visible canvas
                this.size = Math.random() * 20 + 10;
                this.speed = Math.random() * 2 + 2;
                this.opacity = Math.random() * 0.7 + 0.3;
                this.hue = Math.random() * 40 + 200; // Blue to cyan range
            }
            
            update() {
                this.y += this.speed;
                this.opacity -= 0.002;
                
                // Reset if drop goes beyond canvas height or becomes invisible
                if (this.y > canvas.height || this.opacity <= 0) {
                    this.reset();
                }
            }
            
            draw() {
                ctx.beginPath();
                // Create gradient for drop
                const gradient = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, this.size
                );
                gradient.addColorStop(0, `hsla(${this.hue}, 100%, 70%, ${this.opacity})`);
                gradient.addColorStop(1, `hsla(${this.hue}, 100%, 50%, 0)`);
                
                ctx.fillStyle = gradient;
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Create drops
        let drops = [];
        const dropCount = 20;
        
        function initDrops() {
            drops = [];
            for (let i = 0; i < dropCount; i++) {
                drops.push(new Drop());
            }
        }
        
        // Floating particles class
        class Particle {
            constructor() {
                this.reset();
            }
            
            reset() {
                // Ensure particles stay within the canvas bounds
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.3;
                this.hue = Math.random() * 40 + 200; // Blue to cyan range
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                // Keep particles within canvas boundaries by bouncing them off edges
                // instead of wrapping around
                if (this.x < 0 || this.x > canvas.width) {
                    this.speedX *= -1; // Reverse direction
                    this.x = Math.max(0, Math.min(this.x, canvas.width));
                }
                if (this.y < 0 || this.y > canvas.height) {
                    this.speedY *= -1; // Reverse direction
                    this.y = Math.max(0, Math.min(this.y, canvas.height));
                }
            }
            
            draw() {
                ctx.beginPath();
                ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${this.opacity})`;
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Create particles
        let particles = [];
        const particleCount = 150;
        
        function initParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }
        
        // Draw water wave
        function drawWave(time) {
            ctx.beginPath();
            
            const height = 50;
            const amplitude = 20;
            const frequency = 0.02;
            const y = canvas.height - height;
            
            ctx.moveTo(0, y + Math.sin(time * 0.001) * amplitude);
            
            for (let x = 0; x < canvas.width; x++) {
                const wave1 = Math.sin(x * frequency + time * 0.001) * amplitude;
                const wave2 = Math.sin(x * frequency * 2 + time * 0.002) * amplitude / 2;
                ctx.lineTo(x, y + wave1 + wave2);
            }
            
            ctx.lineTo(canvas.width, canvas.height);
            ctx.lineTo(0, canvas.height);
            ctx.closePath();
            
            const gradient = ctx.createLinearGradient(0, y, 0, canvas.height);
            gradient.addColorStop(0, 'rgba(0, 112, 243, 0.2)');
            gradient.addColorStop(1, 'rgba(0, 200, 255, 0.05)');
            
            ctx.fillStyle = gradient;
            ctx.fill();
        }
        
        // Set initial size
        resizeCanvas();
        
        // Create initial particles and drops
        initParticles();
        initDrops();
        
        // Listen for window resize
        window.addEventListener('resize', resizeCanvas);
        
        // Animation loop
        function animate() {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw particles
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            // Draw drops
            drops.forEach(drop => {
                drop.update();
                drop.draw();
            });
            
            // Draw wave
            drawWave(performance.now());
            
            // Continue animation loop
            requestAnimationFrame(animate);
        }
        
        // Start animation
        animate();
        console.log('Canvas animations initialized');
    }
    
    // Initialize all page functionality
    function initializeAll() {
        initializeHeader();
        initializeFadeInElements();
        initializeStaggeredFadeIn();
        initializeSmoothScroll();
        initializeLiquidDrops();
        initializeCanvasAnimations();
        
        console.log('LiquidVest landing page initialized');
    }
});