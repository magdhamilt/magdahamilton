// Intersection Observer for fade-in effect
const cards = document.querySelectorAll('.card');

const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

cards.forEach(card => {
    observer.observe(card);
});

// Physics system
const container = document.getElementById('techStack');
const width = container.offsetWidth;
const height = container.offsetHeight;

const techs = [
    { name: 'Swift', color: '#F05138', lines: 1 },
    { name: 'SwiftUI', color: '#0066FF', lines: 2 },
    { name: 'Metal', color: '#888888', lines: 1 },
    { name: 'Three.js', color: '#049EF4', lines: 1 },
    { name: 'GLSL', color: '#5586A4', lines: 1 },
    { name: 'WebGL', color: '#990000', lines: 1 },
    { name: 'C++', color: '#00599C', lines: 1 },
    { name: 'JavaScript', color: '#F7DF1E', lines: 2 },
    { name: 'Combine', color: '#FF6B35', lines: 1 },
    { name: 'ARKit', color: '#FF9500', lines: 1 }
];

class Particle {
    constructor(tech, index) {
        this.tech = tech;
        this.size = Math.random() * 25 + 45;
        this.x = Math.random() * (width - this.size);
        this.y = Math.random() * (height - this.size);
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.mass = this.size / 10;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 0.5;
        
        this.element = document.createElement('div');
        this.element.className = 'tech-icon';
        this.element.style.width = this.size + 'px';
        this.element.style.height = this.size + 'px';
        
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.setAttribute('fill', tech.color);
        
        if (tech.lines === 1) {
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', '50');
            text.setAttribute('y', '55');
            text.setAttribute('font-size', '22');
            text.setAttribute('font-weight', 'bold');
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('font-family', 'Arial');
            text.textContent = tech.name;
            svg.appendChild(text);
        } else {
            if (tech.name === 'SwiftUI') {
                const text1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text1.setAttribute('x', '50');
                text1.setAttribute('y', '50');
                text1.setAttribute('font-size', '18');
                text1.setAttribute('font-weight', 'bold');
                text1.setAttribute('text-anchor', 'middle');
                text1.setAttribute('font-family', 'Arial');
                text1.textContent = 'Swift';
                svg.appendChild(text1);
                
                const text2 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text2.setAttribute('x', '50');
                text2.setAttribute('y', '65');
                text2.setAttribute('font-size', '18');
                text2.setAttribute('font-weight', 'bold');
                text2.setAttribute('text-anchor', 'middle');
                text2.setAttribute('font-family', 'Arial');
                text2.textContent = 'UI';
                svg.appendChild(text2);
            } else if (tech.name === 'JavaScript') {
                const text1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text1.setAttribute('x', '50');
                text1.setAttribute('y', '50');
                text1.setAttribute('font-size', '16');
                text1.setAttribute('font-weight', 'bold');
                text1.setAttribute('text-anchor', 'middle');
                text1.setAttribute('font-family', 'Arial');
                text1.textContent = 'Java';
                svg.appendChild(text1);
                
                const text2 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text2.setAttribute('x', '50');
                text2.setAttribute('y', '65');
                text2.setAttribute('font-size', '16');
                text2.setAttribute('font-weight', 'bold');
                text2.setAttribute('text-anchor', 'middle');
                text2.setAttribute('font-family', 'Arial');
                text2.textContent = 'Script';
                svg.appendChild(text2);
            }
        }
        
        this.element.appendChild(svg);
        container.appendChild(this.element);
        
        this.element.addEventListener('click', () => {
            const angle = Math.random() * Math.PI * 2;
            const force = 5;
            this.vx += Math.cos(angle) * force;
            this.vy += Math.sin(angle) * force;
        });
    }

    update(particles, mouseX, mouseY, mouseDown) {
        if (mouseX !== null && mouseY !== null) {
            const dx = mouseX - (this.x + this.size / 2);
            const dy = mouseY - (this.y + this.size / 2);
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 150) {
                const force = mouseDown ? 0.5 : -0.3;
                const angle = Math.atan2(dy, dx);
                const strength = (1 - dist / 150) * force;
                this.vx += Math.cos(angle) * strength;
                this.vy += Math.sin(angle) * strength;
            }
        }

        particles.forEach(other => {
            if (other === this) return;
            
            const dx = other.x - this.x;
            const dy = other.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 100 && dist > 0) {
                const force = (100 - dist) * 0.0008;
                const angle = Math.atan2(dy, dx);
                this.vx -= Math.cos(angle) * force;
                this.vy -= Math.sin(angle) * force;
            }
            
            if (dist > 100 && dist < 200) {
                const force = 0.0001;
                const angle = Math.atan2(dy, dx);
                this.vx += Math.cos(angle) * force;
                this.vy += Math.sin(angle) * force;
            }
        });

        this.vx *= 0.98;
        this.vy *= 0.98;

        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) {
            this.x = 0;
            this.vx *= -0.7;
        }
        if (this.x > width - this.size) {
            this.x = width - this.size;
            this.vx *= -0.7;
        }
        if (this.y < 0) {
            this.y = 0;
            this.vy *= -0.7;
        }
        if (this.y > height - this.size) {
            this.y = height - this.size;
            this.vy *= -0.7;
        }

        this.rotation += this.rotationSpeed;

        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
        this.element.style.transform = `rotate(${this.rotation}deg)`;
    }
}

const particles = techs.map((tech, i) => new Particle(tech, i));

let mouseX = null;
let mouseY = null;
let mouseDown = false;

// Mouse events
container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});

container.addEventListener('mouseleave', () => {
    mouseX = null;
    mouseY = null;
});

container.addEventListener('mousedown', () => {
    mouseDown = true;
});

container.addEventListener('mouseup', () => {
    mouseDown = false;
});

// Touch events
container.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const rect = container.getBoundingClientRect();
    const touch = e.touches[0];
    mouseX = touch.clientX - rect.left;
    mouseY = touch.clientY - rect.top;
});

container.addEventListener('touchstart', (e) => {
    const rect = container.getBoundingClientRect();
    const touch = e.touches[0];
    mouseX = touch.clientX - rect.left;
    mouseY = touch.clientY - rect.top;
    mouseDown = true;
});

container.addEventListener('touchend', () => {
    mouseX = null;
    mouseY = null;
    mouseDown = false;
});

function animate() {
    particles.forEach(p => p.update(particles, mouseX, mouseY, mouseDown));
    requestAnimationFrame(animate);
}

animate();
