class HemisphereTubeSpaceShip extends PluginBase {

    constructor(scene) {
        super();

        let diameter = 1500;
        this.diameter = diameter;

        let light_r = new BABYLON.PointLight("light1", BABYLON.Vector3.Zero(), scene);
        light_r.intensity = 0.7;
        light_r.diffuse = BABYLON.Color3.FromHexString('#110000');
        light_r.position.z = diameter;

        let light_g = new BABYLON.PointLight("light1", BABYLON.Vector3.Zero(), scene);
        light_g.intensity = 0.7;
        light_g.diffuse = BABYLON.Color3.FromHexString('#001100');
        light_g.position.x = diameter;

        let light_b = new BABYLON.PointLight("light1", BABYLON.Vector3.Zero(), scene);
        light_b.intensity = 0.7;
        light_b.diffuse = BABYLON.Color3.FromHexString('#000011');
        light_b.position.y = diameter;

        let mat = new BABYLON.StandardMaterial("mat", scene);
        mat.alpha = 0.8;

        var gl = new BABYLON.GlowLayer("glow", scene);
        gl.intensity = 1;

        let sphere = BABYLON.MeshBuilder.CreateSphere("", { diameter: diameter, sideOrientation: BABYLON.Mesh.DOUBLESIDE });
        sphere.material = mat;


        class discoSphere {
            constructor(posRandom) {
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

                this.customMesh = customMesh;   // export

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

                    let offset = new BABYLON.Vector3(0, 0, 0);

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

                let desiredFps = 0.5;
                let interval = 1000 / (10 * desiredFps);
                let lastTime = performance.now();

                scene.registerBeforeRender(() => {
                    customMesh.rotation.x += 0.005;
                    customMesh.rotation.y += 0.005;
                    customMesh.rotation.z += 0.005;
                });
            }
        }


        let randomPos = () => {
            let f = 110;
            return new BABYLON.Vector3(
                0.5 * f - f * Math.random(),
                0.5 * f - f * Math.random(),
                0.5 * f - f * Math.random()
            );
        }
        let sun = new discoSphere(randomPos());
        // sun.customMesh.position.z = 10;
        // sun.customMesh.position.y = -250;


        // publish
        this.scene = scene;
        this.diameter = diameter;
        this.light_r = light_r;
        this.light_g = light_g;
        this.light_b = light_b;
        this.sun = sun;
    }


    activate() {

        const moveLights = () => {

            let scene = this.scene;
            let diameter = this.diameter;
            let light_r = this.light_r;
            let light_g = this.light_g;
            let light_b = this.light_b;
            let sun = this.sun;

            let t = 0;
            let orbit = diameter;
            let speed = 0.001;
            scene.registerBeforeRender(function () {
                t += speed;

                light_r.position.x = orbit * Math.sin(t);
                light_r.position.y = orbit * Math.sin(t);
                light_r.position.z = orbit * Math.cos(t);

                light_g.position.x = orbit * Math.sin(t * 2);
                light_g.position.y = orbit * Math.sin(t * 2);
                light_g.position.z = orbit * Math.cos(t * 2);

                light_b.position.x = orbit * Math.sin(t * 3);
                light_b.position.y = orbit * Math.sin(t * 3);
                light_b.position.z = orbit * Math.cos(t * 3);

                //sun.customMesh.position.y = -250 + 100 * Math.cos(t * 0.1);
                sun.customMesh.position.y = 10 + 10 * Math.cos(t * 0.1);
                sun.customMesh.position.z = 10 + 10 * Math.sin(t * 0.1);

            });

        }

        moveLights();
        // scene.onBeforeRenderObservable.add(moveLights)
    }

    deactivate() {
        // todo: registerBeforeRender wieder freigeben
    }
}