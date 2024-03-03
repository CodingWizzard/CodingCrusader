class Apollo extends PluginBase {

    constructor(scene, camera) {
        super();



        function mapRange(value, fromMin, fromMax, toMin, toMax) {
            const fromRange = fromMax - fromMin;
            const toRange = toMax - toMin;
            const scaledValue = (value - fromMin) / fromRange;
            return toMin + scaledValue * toRange;
        }

        const rocket = BABYLON.MeshBuilder.CreateCylinder("rocket", { height: 10, diameter: 2 }, scene);
        rocket.position.y = -20;
        rocket.position.z = 20;



        const rocketHead = BABYLON.MeshBuilder.CreateSphere("", { diameter: 2, segments: 9 });
        rocketHead.parent = rocket;
        rocketHead.position.y = 5;
        rocketHead.fixed = true;

        const rocketWing1 = BABYLON.MeshBuilder.CreateBox("", { width: 1, height: 3, depth: 0.1 });
        rocketWing1.parent = rocket;
        rocketWing1.position.y = -2.5;
        rocketWing1.position.x = 1.5;
        rocketWing1.fixed = true;

        const rocketWing2 = BABYLON.MeshBuilder.CreateBox("", { width: 1, height: 3, depth: 0.1 });
        rocketWing2.parent = rocket;
        rocketWing2.position.y = -2.5;
        rocketWing2.position.x = -1.5;
        rocketWing2.fixed = true;

        let rocketBottom = BABYLON.MeshBuilder.CreateSphere("", { diameter: 1 });
        rocketBottom.material = new BABYLON.StandardMaterial("bmat", scene);
        rocketBottom.material.diffuseColor = new BABYLON.Color3(0.0, 1.0, 0.0);
        rocketBottom.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
        rocketBottom.material.backFaceCulling = false;
        rocketBottom.scalingDeterminant *= 2;
        rocketBottom.rotation.y = Math.PI * 0.5;
        rocketBottom.protected = true;
        rocketBottom.parent = rocket;
        rocketBottom.position.y = -5;
        rocketBottom.fixed = true;


        let godrays = new BABYLON.VolumetricLightScatteringPostProcess('godrays', 1.0, camera, rocketBottom, 100, BABYLON.Texture.BILINEAR_SAMPLINGMODE, engine, false);
        godrays._volumetricLightScatteringRTT.renderParticles = false; // true;
        godrays.exposure = 0.1;
        godrays.decay = 0.96815;
        godrays.weight = 0.98767;
        godrays.density = 0.996;

        let texture = new BABYLON.Texture("https://playground.babylonjs.com/textures/cloud.png", scene);
        let p = new BABYLON.Vector3(0, 1, 0);
        class AnimaSmoke {
            constructor() {
                let meshes = [];

                let cust_velo_scale = 0.9;
                let cust_scale_scale = 1.01; // 0.95;
                let cust_scale_scale_min = 4;
                let cust_scale_scale_max = 5;
                let cust_alpha_scale = 0.99;

                let max = 50;
                for (let i = 0; i < max; i++) {
                    const mesh = BABYLON.MeshBuilder.CreatePlane("point", { width: 1, height: 1, updatable: true }, scene);
                    mesh.position.copyFrom(rocketBottom.position);
                    mesh.position.addInPlace(rocket.position);
                    mesh.rotation.set(0, 0, 2 * Math.PI * Math.random());
                    mesh.scaling = mesh.scaling.scale(2 * cust_scale_scale_max * Math.random());
                    mesh.material = new BABYLON.StandardMaterial("", scene);
                    mesh.material.diffuseTexture = texture;
                    mesh.material.opacityTexture = texture;
                    mesh.material.diffuseTexture.hasAlpha = true;
                    mesh.material.backFaceCulling = false;
                    mesh.cust_velo = p.subtract(mesh.position).normalize().scale(0.2);
                    mesh.cust_rot = new BABYLON.Vector3(0, 0, 0.025 * (0.5 - Math.random()));
                    meshes.push(mesh);
                }


                let desiredFps = 10;
                let interval = 1000 / (10 * desiredFps);
                let lastTime = performance.now();
                scene.registerAfterRender(() => {

                    let currentTime = performance.now();
                    const deltaTime = currentTime - lastTime;
                    if (deltaTime < interval) return;
                    lastTime = currentTime - (deltaTime % interval);

                    for (let i = 0; i < meshes.length; i++) {
                        let mesh = meshes[i];
                        if (mesh.cust_velo === undefined) continue;

                        mesh.cust_velo.y -= 0.02;
                        mesh.cust_velo = mesh.cust_velo.scale(cust_velo_scale);
                        mesh.position.addInPlace(mesh.cust_velo);

                        mesh.scaling = mesh.scaling.scale(cust_scale_scale);
                        mesh.rotation.addInPlace(mesh.cust_rot);
                        mesh.cust_rot = mesh.cust_rot.scale(0.993);
                        mesh.material.alpha *= 0.99;

                        if (mesh.scaling.x > 2 * cust_scale_scale_max) {
                            mesh.scaling.set(1, 1, 1);
                            mesh.scaling = mesh.scaling.scale(cust_scale_scale_max * Math.random());
                            mesh.position.copyFrom(rocketBottom.position);
                            mesh.position.addInPlace(rocket.position);
                            mesh.material.alpha = 1;
                        }

                        // 

                        let r = mapRange(i, 0, 0.25 * max, 0, 1);
                        let g = mapRange(i, 0, 0.25 * max, 0, 1);
                        let b = mapRange(i, 0, 0.25 * max, 0, 1);
                        mesh.material.diffuseColor = new BABYLON.Color3(r, g, b);
                    }
                });



                this.meshes = meshes; // publish
            }
        }


        let animaSmoke = new AnimaSmoke();



        let desiredFps = 20;
        let interval = 1000 / (10 * desiredFps);
        let lastTime = performance.now();
        scene.registerAfterRender(() => {
            let currentTime = performance.now();
            const deltaTime = currentTime - lastTime;
            if (deltaTime < interval) return;
            lastTime = currentTime - (deltaTime % interval);

            rocketBottom.material.diffuseColor.copyFrom(scene.clearColor);
            // lightHemi.intensity = 0.5 + Math.random() * 0.5;
            rocketBottom.scaling.set(1 + 0.25 * Math.random(), 1 + 0.25 * Math.random(), 1 + 0.25 * Math.random())
        })


        scene.registerBeforeRender(function () {
            for (let i = 0; i < animaSmoke.meshes.length; i++) {
                let mesh = animaSmoke.meshes[i];
                if (mesh.fixed !== undefined) continue;
                mesh.position.y += 0.1;
            }

            rocket.rotation.y += 0.01;
            rocket.position.y += 0.1;
        });


    }


    activate() {

    }

    deactivate() {
    }
}