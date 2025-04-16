// P5.js sketch for material design background animation
// Creating an instance mode sketch to avoid conflicts with global variables
const sketch = (p) => {
  // Material Design colors with much higher opacity
  const colors = [
    [33, 150, 243, 40],    // Blue 500 (much higher opacity)
    [3, 169, 244, 40],     // Light Blue 500
    [0, 188, 212, 40],     // Cyan 500
    [0, 150, 136, 40],     // Teal 500
    [76, 175, 80, 40]      // Green 500
  ];
  
  // For dark mode colors
  const darkColors = [
    [66, 165, 245, 60],    // Blue 400 (much higher opacity)
    [41, 182, 246, 60],    // Light Blue 400
    [38, 198, 218, 60],    // Cyan 400
    [38, 166, 154, 60],    // Teal 400
    [102, 187, 106, 60]    // Green 400
  ];

  // Array to store particles
  let particles = [];
  let currentColors = colors;
  
  // Number of particles (adjustable)
  const particleCount = 100;  // Even more particles
  
  p.setup = function() {
    // Create canvas inside the container
    const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
    canvas.parent('canvas-container');
    
    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }
    
    // Check initial dark mode state
    updateColorScheme();
  };

  p.draw = function() {
    p.clear(); // Clear with transparency
    
    // Update and display particles
    for (let i = 0; i < particles.length; i++) {
      updateParticle(particles[i]);
      displayParticle(particles[i]);
      
      // Replace particles that move off-screen
      if (isOffScreen(particles[i])) {
        particles[i] = createParticle();
      }
    }
  };
  
  // Create a new particle with random properties
  function createParticle() {
    const colorIndex = Math.floor(p.random(currentColors.length));
    
    return {
      x: p.random(p.width),
      y: p.random(p.height),
      size: p.random(100, 250),  // Even larger sizes
      speedX: p.random(-0.4, 0.4),  // Faster movement
      speedY: p.random(-0.3, 0.3),
      color: currentColors[colorIndex],
      rotation: p.random(0, 360),
      shape: Math.floor(p.random(3))  // 0: rectangle, 1: circle, 2: triangle
    };
  }
  
  // Update particle position
  function updateParticle(particle) {
    particle.x += particle.speedX;
    particle.y += particle.speedY;
    particle.rotation += 0.05; // Very slow rotation
  }
  
  // Display particle - updated to be more visible
  function displayParticle(particle) {
    // Add a very subtle stroke for better visibility
    p.stroke(particle.color[0], particle.color[1], particle.color[2], particle.color[3] + 20);
    p.strokeWeight(1);
    p.fill(particle.color[0], particle.color[1], particle.color[2], particle.color[3]);
    
    p.push();
    p.translate(particle.x, particle.y);
    p.rotate(particle.rotation);
    
    // Use different shapes based on particle.shape value
    switch(particle.shape) {
      case 0:
        // Rectangle
        p.rect(0, 0, particle.size, particle.size, 12);
        break;
      case 1:
        // Circle
        p.ellipse(0, 0, particle.size, particle.size);
        break;
      case 2:
        // Triangle
        const s = particle.size/2;
        p.triangle(-s, s/2, 0, -s, s, s/2);
        break;
    }
    
    p.pop();
  }
  
  // Check if particle is off-screen
  function isOffScreen(particle) {
    const buffer = particle.size;
    return (
      particle.x < -buffer ||
      particle.x > p.width + buffer ||
      particle.y < -buffer ||
      particle.y > p.height + buffer
    );
  }
  
  // Handle window resize
  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
  
  // Function to update colors based on dark mode
  function updateColorScheme() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    currentColors = isDarkMode ? darkColors : colors;
    
    // Update existing particles
    for (let i = 0; i < particles.length; i++) {
      const colorIndex = Math.floor(p.random(currentColors.length));
      particles[i].color = currentColors[colorIndex];
    }
  }
  
  // Listen for dark mode changes from main script
  document.addEventListener('darkModeChanged', updateColorScheme);
  
  // Initial color scheme
  updateColorScheme();
};

// Create a new p5 instance with the sketch
new p5(sketch); 