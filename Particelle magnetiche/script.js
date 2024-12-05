const canvas = document.getElementById("particlesCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

// Creazione delle particelle
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 1;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = Math.random() * 30 + 1;
        this.color = "rgba(255, 255, 255, 0.7)";
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update(mouse) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
            this.x -= dx / this.density;
            this.y -= dy / this.density;
            this.color = "rgba(255, 100, 200, 1)";
        } else {
            this.x += (this.baseX - this.x) / 10;
            this.y += (this.baseY - this.y) / 10;
            this.color = "rgba(255, 255, 255, 0.7)";
        }
    }
}

// Inizializzazione delle particelle
function init() {
    particles = [];
    const numParticles = 150;
    for (let i = 0; i < numParticles; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particles.push(new Particle(x, y));
    }
}

// Animazione e connessioni tra particelle
function animate(mouse) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((particle) => {
        particle.update(mouse);
        particle.draw();
    });

    connectParticles();
    requestAnimationFrame(() => animate(mouse));
}

// Connessioni tra particelle vicine
function connectParticles() {
    let opacity = 1;
    for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
            let dx = particles[a].x - particles[b].x;
            let dy = particles[a].y - particles[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                opacity = 1 - distance / 100;
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }
}

// Mouse interattivo
const mouse = {
    x: null,
    y: null,
};

canvas.addEventListener("mousemove", (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

canvas.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
});

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

// Avvio
init();
animate(mouse);
