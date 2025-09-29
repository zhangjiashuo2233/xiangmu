// Initialize Three.js components
let scene, camera, renderer, earth, clouds, stars;
let earthGroup;

// Initialize controls
let controls;

// Day/night cycle variables
let sunLight, ambientLight;

function init() {
    // Create scene
    scene = new THREE.Scene();
    
    // Create camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 250;
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('earth-container').appendChild(renderer.domElement);
    
    // Create Earth group to hold Earth and clouds
    earthGroup = new THREE.Group();
    scene.add(earthGroup);
    
    // Create Earth
    createEarth();
    
    // Create stars background
    createStars();
    
    // Add ambient light
    ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);
    
    // Add directional light (sun)
    sunLight = new THREE.DirectionalLight(0xFFFFFF, 1);
    sunLight.position.set(300, 100, 200);
    scene.add(sunLight);
    
    // Add controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 150;
    controls.maxDistance = 500;
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
    
    // Start animation
    animate();
}

function createEarth() {
    // Earth geometry
    const earthGeometry = new THREE.SphereGeometry(100, 64, 64);
    
    // Earth material with texture
    const earthMaterial = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg'),
        specularMap: new THREE.TextureLoader().load('https://threejs.org/examples/textures/planets/earth_specular_2048.jpg'),
        specular: new THREE.Color(0x333333),
        shininess: 5
    });
    
    // Create Earth mesh
    earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earthGroup.add(earth);
    
    // Create clouds
    const cloudGeometry = new THREE.SphereGeometry(101, 64, 64);
    const cloudMaterial = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load('https://threejs.org/examples/textures/planets/earth_clouds_1024.png'),
        transparent: true,
        opacity: 0.8
    });
    
    clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    earthGroup.add(clouds);
}

function createStars() {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: 1.2,
        sizeAttenuation: true
    });
    
    const starVertices = [];
    for (let i = 0; i < 10000; i++) {
        const x = THREE.MathUtils.randFloatSpread(2000);
        const y = THREE.MathUtils.randFloatSpread(2000);
        const z = THREE.MathUtils.randFloatSpread(2000);
        starVertices.push(x, y, z);
    }
    
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    
    // Rotate Earth and clouds
    if (earth) earth.rotation.y += 0.001;
    if (clouds) clouds.rotation.y += 0.0015;
    
    // Update controls
    controls.update();
    
    // Update day/night cycle - rotate the sun around the Earth
    if (sunLight) {
        const time = Date.now() * 0.0001; // Slow down the rotation
        sunLight.position.x = Math.sin(time) * 300;
        sunLight.position.z = Math.cos(time) * 300;
    }
    
    // Render the scene
    renderer.render(scene, camera);
}

// Initialize the scene when the page loads
window.onload = init;