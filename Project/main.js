// Particle.js Configuration
particlesJS('particles-js', {
    particles: {
        number: {
            value: 80,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: '#2ecc71'
        },
        shape: {
            type: 'circle'
        },
        opacity: {
            value: 0.5,
            random: true,
            animation: {
                enable: true,
                speed: 1,
                opacity_min: 0.1,
                sync: false
            }
        },
        size: {
            value: 3,
            random: true,
            animation: {
                enable: true,
                speed: 2,
                size_min: 0.1,
                sync: false
            }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#2ecc71',
            opacity: 0.2,
            width: 1
        },
        move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: {
                enable: true,
                rotateX: 600,
                rotateY: 1200
            }
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: {
                enable: true,
                mode: 'repulse'
            },
            onclick: {
                enable: true,
                mode: 'push'
            },
            resize: true
        },
        modes: {
            repulse: {
                distance: 100,
                duration: 0.4
            },
            push: {
                particles_nb: 4
            }
        }
    },
    retina_detect: true
});

// Three.js scene setup
let scene, camera, renderer, plant;
const container = document.getElementById('three-container');

// Initialize the 3D scene
function init() {
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Set background to transparent
    renderer.setClearColor(0x000000, 0);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x2ecc71, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Add point lights for glow effect
    const pointLight1 = new THREE.PointLight(0x2ecc71, 1, 100);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x27ae60, 1, 100);
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);

    // Position camera
    camera.position.z = 5;

    // Create plant
    createPlant();

    // Add event listeners
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', onMouseMove, false);

    // Start animation loop
    animate();
}

// Create a more detailed plant model
function createPlant() {
    const plantGroup = new THREE.Group();

    // Create stem
    const stemGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2, 32);
    const stemMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x2ecc71,
        shininess: 100,
        specular: 0x27ae60
    });
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    plantGroup.add(stem);

    // Create leaves
    const leafCount = 6;
    for (let i = 0; i < leafCount; i++) {
        const leafGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const leafMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x27ae60,
            shininess: 100,
            specular: 0x2ecc71
        });
        const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
        
        leaf.scale.set(1, 0.2, 1);
        leaf.position.y = (i / leafCount) * 2 - 1;
        leaf.position.x = Math.cos(i * Math.PI / 3) * 0.5;
        leaf.position.z = Math.sin(i * Math.PI / 3) * 0.5;
        leaf.rotation.x = Math.PI / 4;
        leaf.rotation.y = i * Math.PI / 3;
        
        plantGroup.add(leaf);
    }

    // Add glow effect
    const glowGeometry = new THREE.SphereGeometry(1.2, 32, 32);
    const glowMaterial = new THREE.MeshPhongMaterial({
        color: 0x2ecc71,
        transparent: true,
        opacity: 0.1,
        side: THREE.DoubleSide
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    plantGroup.add(glow);

    plant = plantGroup;
    scene.add(plant);
}

// Handle window resizing
function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

// Handle mouse movement
function onMouseMove(event) {
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    if (plant) {
        gsap.to(plant.rotation, {
            x: mouseY * 0.1,
            y: mouseX * 0.1,
            duration: 1,
            ease: "power2.out"
        });
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    if (plant) {
        // Add subtle floating animation
        plant.position.y = Math.sin(Date.now() * 0.001) * 0.1;
        
        // Rotate the plant slowly
        plant.rotation.y += 0.002;
    }
    
    renderer.render(scene, camera);
}

// Initialize when the page loads
window.addEventListener('load', init);

// Add smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
