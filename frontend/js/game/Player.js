class BasketballPlayer {
    constructor(scene, position, color, isUserControlled = false) {
        this.scene = scene;
        this.position = position.clone();
        this.color = color;
        this.isUserControlled = isUserControlled;
        this.speed = 0.15;
        this.sprintSpeed = 0.25;
        this.rotationSpeed = 0.1;
        this.hasBall = false;
        this.isSprinting = false;
        this.stamina = 100;
        
        this.mesh = this.createPlayerMesh();
        this.mesh.position.copy(position);
        this.scene.add(this.mesh);
        
        // Bounding box for collision
        this.boundingBox = new THREE.Box3().setFromObject(this.mesh);
    }
    
    createPlayerMesh() {
        const group = new THREE.Group();
        
        // Body
        const bodyGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.5);
        const bodyMat = new THREE.MeshStandardMaterial({ color: this.color });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = 0.75;
        body.castShadow = true;
        body.receiveShadow = true;
        group.add(body);
        
        // Head
        const headGeo = new THREE.SphereGeometry(0.2);
        const headMat = new THREE.MeshStandardMaterial({ color: 0xffccaa });
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.y = 1.6;
        head.castShadow = true;
        head.receiveShadow = true;
        group.add(head);
        
        // Arms
        const armGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.8);
        const armMat = new THREE.MeshStandardMaterial({ color: this.color });
        
        // Left arm
        const leftArm = new THREE.Mesh(armGeo, armMat);
        leftArm.position.set(-0.4, 1.1, 0);
        leftArm.rotation.z = 0.2;
        leftArm.castShadow = true;
        leftArm.receiveShadow = true;
        group.add(leftArm);
        
        // Right arm
        const rightArm = new THREE.Mesh(armGeo, armMat);
        rightArm.position.set(0.4, 1.1, 0);
        rightArm.rotation.z = -0.2;
        rightArm.castShadow = true;
        rightArm.receiveShadow = true;
        group.add(rightArm);
        
        // Legs
        const legGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.8);
        const legMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
        
        // Left leg
        const leftLeg = new THREE.Mesh(legGeo, legMat);
        leftLeg.position.set(-0.2, 0.4, 0);
        leftLeg.castShadow = true;
        leftLeg.receiveShadow = true;
        group.add(leftLeg);
        
        // Right leg
        const rightLeg = new THREE.Mesh(legGeo, legMat);
        rightLeg.position.set(0.2, 0.4, 0);
        rightLeg.castShadow = true;
        rightLeg.receiveShadow = true;
        group.add(rightLeg);
        
        // Jersey number (simple text)
        if (this.isUserControlled) {
            // Add a star or marker for user-controlled player
            const starGeo = new THREE.SphereGeometry(0.1);
            const starMat = new THREE.MeshStandardMaterial({ color: 0xffdd44 });
            const star = new THREE.Mesh(starGeo, starMat);
            star.position.y = 1.9;
            star.position.z = 0.2;
            group.add(star);
        }
        
        return group;
    }
    
    move(direction, deltaTime) {
        const currentSpeed = this.isSprinting ? this.sprintSpeed : this.speed;
        const movement = direction.multiplyScalar(currentSpeed * deltaTime);
        
        // Check court boundaries (±14 in x, ±13 in z)
        const newX = this.mesh.position.x + movement.x;
        const newZ = this.mesh.position.z + movement.z;
        
        if (Math.abs(newX) < 14.5 && Math.abs(newZ) < 13.5) {
            this.mesh.position.x = newX;
            this.mesh.position.z = newZ;
            
            // Rotate player to face movement direction
            if (movement.length() > 0) {
                const angle = Math.atan2(movement.x, movement.z);
                this.mesh.rotation.y = angle;
            }
        }
        
        // Reduce stamina when sprinting
        if (this.isSprinting) {
            this.stamina = Math.max(0, this.stamina - 0.5);
        } else {
            this.stamina = Math.min(100, this.stamina + 0.2);
        }
    }
    
    shoot() {
        if (!this.hasBall) return null;
        
        // Create a shooting animation
        this.mesh.rotation.x = -0.5;
        setTimeout(() => {
            this.mesh.rotation.x = 0;
        }, 200);
        
        this.hasBall = false;
        
        // Return ball trajectory data
        return {
            position: this.mesh.position.clone(),
            direction: new THREE.Vector3(0, 1, 1).normalize(),
            speed: 0.3
        };
    }
    
    pass(targetPosition) {
        if (!this.hasBall) return null;
        
        this.hasBall = false;
        
        // Return pass trajectory
        const direction = targetPosition.clone().sub(this.mesh.position).normalize();
        return {
            position: this.mesh.position.clone(),
            direction: direction,
            speed: 0.5
        };
    }
    
    receiveBall() {
        this.hasBall = true;
    }
    
    update() {
        // Update bounding box
        this.boundingBox.setFromObject(this.mesh);
    }
}
