class Sun {
    constructor(scene, posRandom) {
        let material = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
        material.backFaceCulling = false;
        material.emissiveColor = BABYLON.Color3.White();
        material.alpha = 0.1;

        let sphere = BABYLON.MeshBuilder.CreateSphere("", { diameter: 3, segments: 9 * 3 }, scene);
        sphere.isVisible = false;
        sphere.position.copyFrom(posRandom);
        let sphere_positions = sphere.getVerticesData(BABYLON.VertexBuffer.PositionKind);
        let sphere_indices = sphere.getIndices();

        let customMesh = new BABYLON.Mesh("custom", scene);
        customMesh.material = material;

        let vertexData = new BABYLON.VertexData();

        let render = (delta) => {
            vertexData.positions = [];
            vertexData.indices = [];

            let idx = 0;
            let addPoses = (p1, p2, p3) => {
                vertexData.positions.push(p1.x);
                vertexData.positions.push(p1.y);
                vertexData.positions.push(p1.z);

                vertexData.positions.push(p2.x);
                vertexData.positions.push(p2.y);
                vertexData.positions.push(p2.z);

                vertexData.positions.push(p3.x);
                vertexData.positions.push(p3.y);
                vertexData.positions.push(p3.z);

                vertexData.indices.push(idx++);
                vertexData.indices.push(idx++);
                vertexData.indices.push(idx++);
            };


            let p0 = new BABYLON.Vector3.Zero();
            p0.copyFrom(posRandom);
            let p1 = new BABYLON.Vector3.Zero();
            let p2 = new BABYLON.Vector3.Zero();
            let p3 = new BABYLON.Vector3.Zero();
            let p4 = new BABYLON.Vector3.Zero();

            for (let i = 0; i < sphere_indices.length; i += 3 * delta) {
                let v1 = sphere_indices[i] * 3;
                let v2 = sphere_indices[i + 1] * 3;
                let v3 = sphere_indices[i + 2] * 3;

                p1.set(sphere_positions[v1 + 0], sphere_positions[v1 + 1], sphere_positions[v1 + 2]);
                p2.set(sphere_positions[v2 + 0], sphere_positions[v2 + 1], sphere_positions[v2 + 2]);
                p3.set(sphere_positions[v3 + 0], sphere_positions[v3 + 1], sphere_positions[v3 + 2]);


                p1.addInPlace(posRandom);
                p2.addInPlace(posRandom);
                p3.addInPlace(posRandom);

                // Middle Point of p1,p2,p3
                p4.x = (p1.x + p2.x + p3.x) / 3;
                p4.y = (p1.y + p2.y + p3.y) / 3;
                p4.z = (p1.z + p2.z + p3.z) / 3;

                let direction = p4.subtract(p0);
                direction.normalize();
                direction = direction.scale(5 + 20 * Math.random());
                p4.addInPlace(direction);

                // p1.addInPlace(direction.scale(0.5));
                // p2.addInPlace(direction.scale(0.5));
                // p3.addInPlace(direction.scale(0.5));
                p4.addInPlace(direction);

                addPoses(p1, p2, p3);
                addPoses(p1, p2, p4);
                addPoses(p1, p4, p3);
                addPoses(p4, p2, p3);
            }

            vertexData.applyToMesh(customMesh);
        }

        render(3 * 3);

        // publish
        this.customMesh = customMesh;
        this.material = material;
        this.sphere = sphere;
        this.vertexData = vertexData;
    }

    deinstall() {
        this.customMesh.dispose();
        this.material.dispose();
        this.sphere.dispose();
        this.vertexData.dispose();
    }
}