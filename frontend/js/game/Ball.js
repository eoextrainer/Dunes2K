class Basketball {
    constructor(scene) {
        this.scene = scene;
        this.mesh = this.createBall();
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.inAir = false;
        this.gravity = 0.005;
        this.bounceFactor = 0.7;
        this.radius = 0.3;
        
        this.scene.add(this.mesh);
    }
    
    createBall() {
        const group = new THREE.Group();
        
        // Main sphere
        const geometry = new THREE.SphereGeometry(0.3, 32, 32);
        
        // Create canvas texture for ball
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        // Base orange color
        ctx.fillStyle = '#ff6600';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Black ribs
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 20;
        
        // Vertical ribs
        for (let i = 0; i < 8; i++) {
            ctx.beginPath();
            ctx.moveTo(canvas.width * i / 8, 0);
            ctx.lineTo(canvas.width * i / 8 + 100, canvas.height);
            ctx.stroke();
        }
        
        // Horizontal ribs
        ctx.beginPath();
        ctx.moveTo(0, canvas.height/2);
        ctx.lineTo(canvas.width, canvas.height/2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, canvas.height/3);
        ctx.lineTo(canvas.width, canvas.height/3);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, canvas.height * 2/3);
        ctx.lineTo(canvas.width, canvas.height * 2/3);
        ctx.stroke();
        
        // NBA logo replacement - create a simple Dunes logo
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 60px Arial';
        ctx.fillText('D2K', canvas.width/2 - 80, canvas.height/2 + 20);
        
        const texture = new THREE.CanvasTexture(canvas);
        
        const material = new THREE.MeshStandardMaterial({ 
            map: texture,
            roughness: 0.4,
            metalness: 0.1
        });
        
        const ball = new THREE.Mesh(geometry, material);
        ball.castShadow = true;
        ball.receiveShadow = true;
        group.add(ball);
        
        return group;
    }
    
    shoot(origin, direction, power = 1.0) {
        this.mesh.position.copy(origin);
        this.mesh.position.y += 0.8; // Hold position
        this.velocity = direction.multiplyScalar(0.2 * power);
        this.velocity.y += 0.15; // Arc
        this.inAir = true;
    }
    
    pass(origin, direction) {
        this.mesh.position.copy(origin);
        this.mesh.position.y += 0.8;
        this.velocity = direction.multiplyScalar(0.3);
        this.inAir = true;
    }
    
    update() {
        if (!this.inAir) return;
        
        // Apply gravity
        this.velocity.y -= this.gravity;
        
        // Update position
        this.mesh.position.x += this.velocity.x;
        this.mesh.position.y += this.velocity.y;
        this.mesh.position.z += this.velocity.z;
        
        // Rotate ball
        this.mesh.rotation.x += this.velocity.length() * 0.1;
        this.mesh.rotation.z += this.velocity.length() * 0.05;
        
        // Bounce off floor
        if (this.mesh.position.y < this.radius) {
            this.mesh.position.y = this.radius;
            this.velocity.y = -this.velocity.y * this.bounceFactor;
            this.velocity.x *= 0.8;
            this.velocity.z *= 0.8;
            
            // Stop if barely moving
            if (Math.abs(this.velocity.y) < 0.01 && 
                Math.abs(this.velocity.x) < 0.01 && 
                Math.abs(this.velocity.z) < 0.01) {
                this.inAir = false;
                this.velocity.set(0, 0, 0);
            }
        }
        
        // Check boundaries - bounce off walls
        if (Math.abs(this.mesh.position.x) > 14) {
            this.velocity.x = -this.velocity.x * 0.5;
            this.mesh.position.x = Math.sign(this.mesh.position.x) * 14;
        }
        
        if (Math.abs(this.mesh.position.z) > 13) {
            this.velocity.z = -this.velocity.z * 0.5;
            this.mesh.position.z = Math.sign(this.mesh.position.z) * 13;
        }
    }
    
    isMoving() {
        return this.inAir || this.velocity.length() > 0.01;
    }
}
