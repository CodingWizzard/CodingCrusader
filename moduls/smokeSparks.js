class SmokeSparks extends PluginBase {

    constructor(scene) {
        super();

        class AnimaSmoke {
            constructor() {

                let cust_velo_scale = 0.9;
                let cust_scale_scale = 1.01; // 0.95;

                let cust_scale_scale_min = 1;
                let cust_scale_scale_max = 5;
                let cust_alpha_scale = 0.99;

                let texture = new BABYLON.Texture("https://playground.babylonjs.com/textures/cloud.png", scene);

                let max = 30;
                for (let i = 0; i < max; i++) {
                    const mesh = BABYLON.MeshBuilder.CreatePlane("point", { width: 1, height: 1, updatable: true }, scene);
                    mesh.custType = 0;  // smoke
                    mesh.position.set(0.1 * Math.sin(i * 2 * Math.PI / max), 0.1 * Math.cos(i * 2 * Math.PI / max), 0); // 0.5 * max - max * Math.random()
                    mesh.rotation.set(0, 0, 2 * Math.PI * Math.random());
                    // mesh.scaling = mesh.scaling.scale(cust_scale_scale_min);
                    // mesh.scaling = mesh.scaling.scale(0.5 * cust_scale_scale_max * Math.random());
                    mesh.scaling = mesh.scaling.scale(cust_scale_scale_max * Math.random());
                    mesh.material = new BABYLON.StandardMaterial("", scene);
                    mesh.material.diffuseTexture = texture;
                    mesh.material.opacityTexture = texture;
                    mesh.material.diffuseTexture.hasAlpha = true;
                    mesh.material.backFaceCulling = false;

                    let p = new BABYLON.Vector3(5 * Math.sin(i * 2 * Math.PI / max), 5 * Math.cos(i * 2 * Math.PI / max), 0);
                    mesh.cust_velo = p.subtract(mesh.position).normalize().scale(0.2);

                    mesh.cust_rot = new BABYLON.Vector3(0, 0, 0.025 * (0.5 - Math.random()));
                }


                let desiredFps = 10;
                let interval = 1000 / (10 * desiredFps);
                let lastTime = performance.now();
                scene.registerAfterRender(() => {
                    let currentTime = performance.now();
                    const deltaTime = currentTime - lastTime;
                    if (deltaTime < interval) return;
                    lastTime = currentTime - (deltaTime % interval);

                    for (let i = 0; i < scene.meshes.length; i++) {
                        let mesh = scene.meshes[i];
                        if (mesh.custType != 0) continue;
                        if (mesh.cust_velo === undefined) continue;
                        mesh.position.addInPlace(mesh.cust_velo);

                        mesh.cust_velo = mesh.cust_velo.scale(cust_velo_scale);
                        mesh.cust_velo.y += 0.01;

                        // if (mesh.scaling.x < cust_scale_scale_max)
                        mesh.scaling = mesh.scaling.scale(cust_scale_scale);

                        mesh.rotation.addInPlace(mesh.cust_rot);

                        mesh.cust_rot = mesh.cust_rot.scale(0.993);
                        mesh.material.alpha *= 0.99;

                        if (mesh.scaling.x > 2 * cust_scale_scale_max) {
                            let index = max * Math.random();
                            mesh.position.set(
                                Math.random() * Math.sin(index * 2 * Math.PI / max),
                                Math.random() * Math.cos(index * 2 * Math.PI / max), 0);
                            mesh.scaling.set(1, 1, 1); // mesh.scaling.scale(0.5 * cust_scale_scale_max * Math.random());
                            mesh.scaling = mesh.scaling.scale(cust_scale_scale_max * Math.random());
                            let p = new BABYLON.Vector3(5 * Math.sin(index * 2 * Math.PI / max), 5 * Math.cos(index * 2 * Math.PI / max), 0);
                            mesh.cust_velo = p.subtract(mesh.position).normalize().scale(0.2);
                            mesh.material.alpha = 1;
                        }
                    }
                });

            }
        }


        class AnimaSpark {
            constructor() {

                let cust_velo_scale = 0.9;
                let cust_scale_scale = 1.01; // 0.95;

                let cust_scale_scale_min = 1;
                let cust_scale_scale_max = 1;
                let cust_alpha_scale = 0.99;

                let texture = new BABYLON.Texture("https://playground.babylonjs.com/textures/Spark.png", scene);

                let max = 100;
                for (let i = 0; i < max; i++) {
                    const mesh = BABYLON.MeshBuilder.CreatePlane("point", { width: 2, height: 2, updatable: true }, scene);
                    mesh.custType = 1;  // spark
                    let index = max * Math.random();
                    mesh.position.set(
                        Math.random() * Math.sin(index * 2 * Math.PI / max),
                        Math.random() * Math.cos(index * 2 * Math.PI / max), 0); // 0.5 * max - max * Math.random()
                    mesh.rotation.set(0, 0, 2 * Math.PI * Math.random());
                    // mesh.scaling = mesh.scaling.scale(cust_scale_scale_min);
                    mesh.scaling = mesh.scaling.scale(cust_scale_scale_max); //  * Math.random());
                    mesh.material = new BABYLON.StandardMaterial("", scene);
                    mesh.material.diffuseTexture = texture;
                    mesh.material.opacityTexture = texture;
                    mesh.material.diffuseTexture.hasAlpha = true;
                    mesh.material.backFaceCulling = false;

                    let p = new BABYLON.Vector3(5 * Math.sin(index * 2 * Math.PI / max), 5 * Math.cos(index * 2 * Math.PI / max), 0);
                    mesh.cust_velo = p.subtract(mesh.position).normalize();

                    mesh.cust_rot = new BABYLON.Vector3(0, 0, 0.025 * (0.5 - Math.random()));

                    mesh.posold = new BABYLON.Vector3.Zero();
                    mesh.posold.copyFrom(mesh.position);
                    mesh.lineSystem = null;
                }


                let desiredFps = 20;
                let interval = 1000 / (10 * desiredFps);
                let lastTime = performance.now();
                scene.registerAfterRender(() => {
                    let currentTime = performance.now();
                    const deltaTime = currentTime - lastTime;
                    if (deltaTime < interval) return;
                    lastTime = currentTime - (deltaTime % interval);

                    for (let i = 0; i < scene.meshes.length; i++) {
                        let mesh = scene.meshes[i];
                        if (mesh.custType != 1) continue;
                        if (mesh.cust_velo === undefined) continue;


                        let dist = Math.sqrt(mesh.position.x * mesh.position.x + mesh.position.y * mesh.position.y);
                        if (dist > 7 + 10 * Math.random()) {
                            let index = max * Math.random();

                            mesh.position.set(
                                Math.random() * Math.sin(index * 2 * Math.PI / max),
                                Math.random() * Math.cos(index * 2 * Math.PI / max), 0);
                            mesh.posold.copyFrom(mesh.position);

                            let p = new BABYLON.Vector3(5 * Math.sin(index * 2 * Math.PI / max), 5 * Math.cos(index * 2 * Math.PI / max), 0);
                            mesh.cust_velo = p.subtract(mesh.position).normalize();
                            mesh.material.alpha = 1;
                        }


                        if (mesh.lineSystem) mesh.lineSystem.dispose();
                        let points = [mesh.position, mesh.posold];
                        mesh.lineSystem = BABYLON.MeshBuilder.CreateLines("", { points: points }, scene);
                        mesh.posold.copyFrom(mesh.position);

                        mesh.position.addInPlace(mesh.cust_velo);
                        mesh.cust_velo = mesh.cust_velo.scale(cust_velo_scale);
                        mesh.cust_velo.y += 0.03;
                        mesh.material.alpha *= 0.99;
                    }
                });

            }
        }



        new AnimaSpark();
        new AnimaSmoke();




        let rad1 = BABYLON.MeshBuilder.CreateSphere("", { diameter: 1 });
        rad1.material = new BABYLON.StandardMaterial("bmat", scene);
        rad1.material.diffuseColor = new BABYLON.Color3(0.0, 1.0, 0.0);
        rad1.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
        rad1.material.backFaceCulling = false;
        rad1.scalingDeterminant *= 2;
        rad1.rotation.y = Math.PI * 0.5;
        rad1.protected = true;

        let godrays = new BABYLON.VolumetricLightScatteringPostProcess('godrays', 1.0, camera, rad1, 100, BABYLON.Texture.BILINEAR_SAMPLINGMODE, engine, false);
        godrays._volumetricLightScatteringRTT.renderParticles = false; // true;
        godrays.exposure = 0.1;
        godrays.decay = 0.96815;
        godrays.weight = 0.98767;
        godrays.density = 0.996;


        let desiredFps = 20;
        let interval = 1000 / (10 * desiredFps);
        let lastTime = performance.now();
        scene.registerAfterRender(() => {
            let currentTime = performance.now();
            const deltaTime = currentTime - lastTime;
            if (deltaTime < interval) return;
            lastTime = currentTime - (deltaTime % interval);

            scene.clearColor.set(0.05 * Math.random(), 0.05 * Math.random(), 0.05 * Math.random());
            rad1.material.diffuseColor.copyFrom(scene.clearColor);

            lightHemi.intensity = 0.5 + Math.random() * 0.5;
            rad1.scaling.set(1 + 0.25 * Math.random(), 1 + 0.25 * Math.random(), 1 + 0.25 * Math.random())
        })


    }


    activate() {

    }

    deactivate() {
    }
}