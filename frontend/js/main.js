// Main game class
class Dunes2K {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.court = null;
        this.player = null;
        this.opponents = [];
        this.ball = null;
        this.controls = null;
        this.crowd = null;
        this.clock = new THREE.Clock();
        
        this.init();
    }
    
    init() {
        // Setup scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Sky blue
        
        // Setup camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 15, 20);
        this.camera.lookAt(0, 0, 0);
        
        // Setup renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.getElementById('game-container').appendChild(this.renderer.domElement);
        
        // Create game objects
        this.court = new BasketballCourt(this.scene);
        this.crowd = new Crowd(this.scene);
        
        // Create player (user-controlled)
        this.player = new BasketballPlayer(
            this.scene, 
            new THREE.Vector3(0, 0, 0), 
            0xff6600, // Orange for home team
            true
        );
        
        // Create opponents
        for (let i = 0; i < 5; i++) {
            const x = -5 + i * 2;
            const z = 3;
            const opponent = new BasketballPlayer(
                this.scene,
                new THREE.Vector3(x, 0, z),
                0x3366ff, // Blue for away team
                false
            );
            this.opponents.push(opponent);
        }
        
        // Create ball
        this.ball = new Basketball(this.scene);
        this.ball.mesh.position.set(0, 0.3, 2);
        
        // Setup controls
        this.controls = new GameControls(this.player, this.ball, this.scene);
        this.opponents.forEach(opp => this.controls.addOtherPlayer(opp));
        
        // Hide loading screen
        document.getElementById('loading-screen').style.display = 'none';
        
        // Start animation loop
        this.animate();
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize(), false);
    }
    
    startQuickGame() {
        document.getElementById('menu-overlay').classList.remove('menu-active');
        document.getElementById('hud').style.display = 'block';
        
        // Reset game state
        this.ball.mesh.position.set(0, 0.3, 2);
        this.player.mesh.position.set(0, 0, 0);
        
        // Set camera to follow player
        this.cameraFollow = true;
    }
    
    showCareerMode() {
        alert('Career Mode - Coming Soon!');
    }
    
    showTeams() {
        alert('Team Selection - Coming Soon!');
    }
    
    showSettings() {
        alert('Settings - Coming Soon!');
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const deltaTime = this.clock.getDelta();
        
        // Update game objects
        if (this.player) this.player.update();
        this.opponents.forEach(opp => opp.update());
        if (this.ball) this.ball.update();
        if (this.controls) this.controls.update(deltaTime * 60); // Normalize to ~60fps
        
        // Update camera to follow player
        if (this.player && this.cameraFollow) {
            const playerPos = this.player.mesh.position;
            this.camera.position.x = playerPos.x;
            this.camera.position.y = 15;
            this.camera.position.z = playerPos.z + 15;
            this.camera.lookAt(playerPos);
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Initialize game when page loads
let game;
window.onload = () => {
    game = new Dunes2K();
    window.game = game; // Make globally accessible for menu buttons
};
