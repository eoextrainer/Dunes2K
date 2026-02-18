class Crowd {
    constructor(scene) {
        this.scene = scene;
        this.crowd = [];
        this.createCrowd();
    }
    
    createCrowd() {
        // Create simple crowd around the court
        const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
        
        for (let i = 0; i < 100; i++) {
            const group = new THREE.Group();
            
            // Body
            const bodyGeo = new THREE.BoxGeometry(0.3, 0.5, 0.2);
            const bodyMat = new THREE.MeshStandardMaterial({ 
                color: colors[Math.floor(Math.random() * colors.length)] 
            });
            const body = new THREE.Mesh(bodyGeo, bodyMat);
            body.position.y = 0.25;
            group.add(body);
            
            // Head
            const headGeo = new THREE.SphereGeometry(0.15);
            const headMat = new THREE.MeshStandardMaterial({ color: 0xffccaa });
            const head = new THREE.Mesh(headGeo, headMat);
            head.position.y = 0.6;
            group.add(head);
            
            // Position around court
            const side = Math.floor(Math.random() * 4);
            let x, z;
            
            switch(side) {
                case 0: // Top
                    x = (Math.random() - 0.5) * 20;
                    z = 15 + Math.random() * 2;
                    break;
                case 1: // Bottom
                    x = (Math.random() - 0.5) * 20;
                    z = -15 - Math.random() * 2;
                    break;
                case 2: // Left
                    x = -16 - Math.random() * 2;
                    z = (Math.random() - 0.5) * 20;
                    break;
                case 3: // Right
                    x = 16 + Math.random() * 2;
                    z = (Math.random() - 0.5) * 20;
                    break;
            }
            
            group.position.set(x, 0.3, z);
            group.rotation.y = Math.random() * Math.PI;
            
            this.scene.add(group);
            this.crowd.push(group);
        }
    }
    
    cheer() {
        // Simple animation - bounce slightly
        this.crowd.forEach(person => {
            person.position.y = 0.3 + Math.random() * 0.1;
        });
        
        setTimeout(() => {
            this.crowd.forEach(person => {
                person.position.y = 0.3;
            });
        }, 500);
    }
}
