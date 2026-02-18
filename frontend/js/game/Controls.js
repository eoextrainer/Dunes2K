class GameControls {
    constructor(player, ball, scene) {
        this.player = player;
        this.ball = ball;
        this.scene = scene;
        this.keys = {};
        this.otherPlayers = [];
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('keyup', (e) => this.onKeyUp(e));
    }
    
    onKeyDown(event) {
        this.keys[event.code] = true;
        
        // Handle shooting
        if (event.code === 'Space' && this.player.hasBall) {
            event.preventDefault();
            this.shoot();
        }
        
        // Handle passing
        if (event.code === 'KeyP' && this.player.hasBall) {
            event.preventDefault();
            this.pass();
        }
        
        // Sprint
        if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
            this.player.isSprinting = true;
        }
    }
    
    onKeyUp(event) {
        this.keys[event.code] = false;
        
        if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
            this.player.isSprinting = false;
        }
    }
    
    update(deltaTime) {
        const direction = new THREE.Vector3(0, 0, 0);
        
        // WASD movement
        if (this.keys['KeyW']) direction.z -= 1;
        if (this.keys['KeyS']) direction.z += 1;
        if (this.keys['KeyA']) direction.x -= 1;
        if (this.keys['KeyD']) direction.x += 1;
        
        // Arrow keys alternative
        if (this.keys['ArrowUp']) direction.z -= 1;
        if (this.keys['ArrowDown']) direction.z += 1;
        if (this.keys['ArrowLeft']) direction.x -= 1;
        if (this.keys['ArrowRight']) direction.x += 1;
        
        if (direction.length() > 0) {
            direction.normalize();
            this.player.move(direction, deltaTime);
        }
        
        // Update ball if player has it
        if (this.player.hasBall) {
            this.ball.mesh.position.copy(this.player.mesh.position);
            this.ball.mesh.position.y += 0.8;
        }
        
        // Check for ball pickup
        this.checkBallPickup();
    }
    
    shoot() {
        const shotData = this.player.shoot();
        if (shotData) {
            this.ball.shoot(shotData.position, shotData.direction);
        }
    }
    
    pass() {
        // Find nearest teammate (simplified - just pick first other player)
        if (this.otherPlayers.length > 0) {
            const target = this.otherPlayers[0].mesh.position;
            const passData = this.player.pass(target);
            if (passData) {
                this.ball.pass(passData.position, passData.direction);
            }
        }
    }
    
    checkBallPickup() {
        if (!this.player.hasBall && !this.ball.isMoving()) {
            const distance = this.player.mesh.position.distanceTo(this.ball.mesh.position);
            if (distance < 1.0) {
                this.player.receiveBall();
            }
        }
    }
    
    addOtherPlayer(player) {
        this.otherPlayers.push(player);
    }
}
