class BasketballCourt {
    constructor(scene) {
        this.scene = scene;
        this.createCourt();
        this.createHoops();
        this.createLights();
    }
    
    createCourt() {
        // Main floor
        const floorGeometry = new THREE.PlaneGeometry(30, 28);
        const floorMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xd2b48c,
            roughness: 0.7,
            metalness: 0.1
        });
        
        // Create court lines texture
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');
        
        // Wood floor pattern
        ctx.fillStyle = '#d2b48c';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Wood grain lines
        ctx.strokeStyle = '#8b5a2b';
        ctx.lineWidth = 2;
        for(let i = 0; i < 20; i++) {
            ctx.beginPath();
            ctx.moveTo(i * 50, 0);
            ctx.lineTo(i * 50 + 200, canvas.height);
            ctx.stroke();
        }
        
        // Court lines
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 8;
        
        // Center circle
        ctx.beginPath();
        ctx.arc(canvas.width/2, canvas.height/2, 150, 0, Math.PI * 2);
        ctx.stroke();
        
        // Half court line
        ctx.beginPath();
        ctx.moveTo(canvas.width/2, 0);
        ctx.lineTo(canvas.width/2, canvas.height);
        ctx.stroke();
        
        // Three point lines (simplified)
        ctx.beginPath();
        ctx.arc(200, canvas.height/2, 180, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(canvas.width - 200, canvas.height/2, 180, 0, Math.PI * 2);
        ctx.stroke();
        
        const texture = new THREE.CanvasTexture(canvas);
        
        const courtMaterial = new THREE.MeshStandardMaterial({ 
            map: texture,
            roughness: 0.6,
            metalness: 0.1
        });
        
        const court = new THREE.Mesh(floorGeometry, courtMaterial);
        court.rotation.x = -Math.PI / 2;
        court.position.y = 0;
        court.receiveShadow = true;
        this.scene.add(court);
        
        // Add boundary lines
        const boundaryMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        
        // Court boundaries
        const points = [];
        points.push(new THREE.Vector3(-15, 0.01, -14));
        points.push(new THREE.Vector3(15, 0.01, -14));
        points.push(new THREE.Vector3(15, 0.01, 14));
        points.push(new THREE.Vector3(-15, 0.01, 14));
        points.push(new THREE.Vector3(-15, 0.01, -14));
        
        const boundaryGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const boundaryLine = new THREE.Line(boundaryGeometry, boundaryMaterial);
        this.scene.add(boundaryLine);
    }
    
    createHoops() {
        // Create two hoops
        this.createHoop(0, 7.5, 14.5); // One end
        this.createHoop(0, 7.5, -14.5); // Other end
    }
    
    createHoop(x, y, z) {
        const hoopGroup = new THREE.Group();
        
        // Backboard
        const backboardGeo = new THREE.BoxGeometry(2, 1.5, 0.1);
        const backboardMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
        const backboard = new THREE.Mesh(backboardGeo, backboardMat);
        backboard.position.set(0, 1.5, 0);
        backboard.castShadow = true;
        backboard.receiveShadow = true;
        hoopGroup.add(backboard);
        
        // Rim
        const rimGeo = new THREE.TorusGeometry(0.3, 0.05, 16, 32);
        const rimMat = new THREE.MeshStandardMaterial({ color: 0xff6600 });
        const rim = new THREE.Mesh(rimGeo, rimMat);
        rim.rotation.x = Math.PI / 2;
        rim.position.set(0, 0.5, -0.2);
        rim.castShadow = true;
        rim.receiveShadow = true;
        hoopGroup.add(rim);
        
        // Net (simplified - transparent cylinder)
        const netGeo = new THREE.CylinderGeometry(0.35, 0.4, 0.5, 8);
        const netMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 });
        const net = new THREE.Mesh(netGeo, netMat);
        net.position.set(0, 0.1, -0.2);
        net.castShadow = true;
        net.receiveShadow = true;
        hoopGroup.add(net);
        
        // Support pole
        const poleGeo = new THREE.CylinderGeometry(0.2, 0.2, 5);
        const poleMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
        const pole = new THREE.Mesh(poleGeo, poleMat);
        pole.position.set(0, -2, 0.5);
        pole.castShadow = true;
        pole.receiveShadow = true;
        hoopGroup.add(pole);
        
        hoopGroup.position.set(x, y, z);
        this.scene.add(hoopGroup);
    }
    
    createLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404060);
        this.scene.add(ambientLight);
        
        // Main arena lights
        const light1 = new THREE.PointLight(0xffffff, 1);
        light1.position.set(0, 20, 0);
        light1.castShadow = true;
        this.scene.add(light1);
        
        // Fill lights
        const light2 = new THREE.PointLight(0xffaa88, 0.5);
        light2.position.set(10, 15, 10);
        this.scene.add(light2);
        
        const light3 = new THREE.PointLight(0x88aaff, 0.5);
        light3.position.set(-10, 15, -10);
        this.scene.add(light3);
    }
}
