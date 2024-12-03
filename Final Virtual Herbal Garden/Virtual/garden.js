class Garden {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.plants = [];
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        this.prevTime = performance.now();

        this.init();
    }

    init() {
        // Setup renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.getElementById('garden-container').appendChild(this.renderer.domElement);

        // Setup camera
        this.camera.position.set(0, 1.6, 5);

        // Add Skybox
        const skyboxLoader = new THREE.CubeTextureLoader();
        const skybox = skyboxLoader.load([
            'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/cube/skybox/px.jpg',
            'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/cube/skybox/nx.jpg',
            'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/cube/skybox/py.jpg',
            'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/cube/skybox/ny.jpg',
            'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/cube/skybox/pz.jpg',
            'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/cube/skybox/nz.jpg'
        ]);
        this.scene.background = skybox;

        // Setup controls
        this.controls = new THREE.PointerLockControls(this.camera, document.body);

        // Click to start
        document.addEventListener('click', () => {
            if (!this.controls.isLocked) {
                this.controls.lock();
            }
        });

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const sunLight = new THREE.DirectionalLight(0xffffff, 1);
        sunLight.position.set(50, 50, 50);
        sunLight.castShadow = true;
        this.scene.add(sunLight);

        // Ground
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x558833,
            roughness: 0.8,
            metalness: 0.2
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // Add Mountains
        this.addMountains();

        // Add some sample plants (in a real implementation, these would be loaded models)
        this.addPlant(2, 0, -2, 'Lavender');
        this.addPlant(-2, 0, -3, 'Mint');
        this.addPlant(3, 0, -4, 'Basil');
        this.addPlant(-1, 0, -5, 'Rosemary');

        // Setup event listeners
        window.addEventListener('resize', () => this.onWindowResize(), false);
        document.addEventListener('keydown', (event) => this.onKeyDown(event));
        document.addEventListener('keyup', (event) => this.onKeyUp(event));

        // Start animation loop
        this.animate();
    }

    addPlant(x, y, z, name) {
        // Create a simple plant representation (in production, use detailed 3D models)
        const plantGeometry = new THREE.ConeGeometry(0.5, 1, 8);
        const plantMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x33aa33,
            roughness: 0.7,
            metalness: 0.1
        });
        const plant = new THREE.Mesh(plantGeometry, plantMaterial);
        plant.position.set(x, y + 0.5, z);
        plant.castShadow = true;
        plant.receiveShadow = true;
        plant.userData.name = name;
        plant.userData.isInteractive = true;
        this.plants.push(plant);
        this.scene.add(plant);
    }

    addMountains() {
        // Create mountain range
        for (let i = 0; i < 8; i++) {
            const mountainGeometry = new THREE.ConeGeometry(
                15 + Math.random() * 10, // random base size
                20 + Math.random() * 30,  // random height
                4 + Math.floor(Math.random() * 3) // random number of segments
            );
            
            const mountainMaterial = new THREE.MeshStandardMaterial({
                color: 0x607060,
                roughness: 0.9,
                metalness: 0.1,
                flatShading: true
            });

            const mountain = new THREE.Mesh(mountainGeometry, mountainMaterial);
            
            // Position mountains in a circular pattern around the garden
            const angle = (i / 8) * Math.PI * 2;
            const radius = 40 + Math.random() * 10;
            mountain.position.x = Math.cos(angle) * radius;
            mountain.position.z = Math.sin(angle) * radius;
            mountain.position.y = -5; // Partially bury the mountains
            
            // Random rotation for variety
            mountain.rotation.y = Math.random() * Math.PI;
            
            // Add some random tilt
            mountain.rotation.x = (Math.random() - 0.5) * 0.2;
            mountain.rotation.z = (Math.random() - 0.5) * 0.2;
            
            mountain.castShadow = true;
            mountain.receiveShadow = true;
            
            this.scene.add(mountain);
        }

        // Add fog for depth
        this.scene.fog = new THREE.FogExp2(0xcccccc, 0.01);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onKeyDown(event) {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                this.moveForward = true;
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.moveBackward = true;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                this.moveLeft = true;
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.moveRight = true;
                break;
        }
    }

    onKeyUp(event) {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                this.moveForward = false;
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.moveBackward = false;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                this.moveLeft = false;
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.moveRight = false;
                break;
        }
    }

    updateMovement() {
        const time = performance.now();
        const delta = (time - this.prevTime) / 1000;

        this.velocity.x -= this.velocity.x * 10.0 * delta;
        this.velocity.z -= this.velocity.z * 10.0 * delta;

        this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
        this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
        this.direction.normalize();

        if (this.moveForward || this.moveBackward) {
            this.velocity.z -= this.direction.z * 400.0 * delta;
        }
        if (this.moveLeft || this.moveRight) {
            this.velocity.x -= this.direction.x * 400.0 * delta;
        }

        this.controls.moveRight(-this.velocity.x * delta);
        this.controls.moveForward(-this.velocity.z * delta);

        this.prevTime = time;
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (this.controls.isLocked) {
            this.updateMovement();
        }

        // Animate plants (simple swaying motion)
        this.plants.forEach((plant, index) => {
            plant.rotation.y = Math.sin(Date.now() * 0.001 + index) * 0.1;
        });

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the garden when the page loads
window.addEventListener('load', () => {
    const garden = new Garden();
});
