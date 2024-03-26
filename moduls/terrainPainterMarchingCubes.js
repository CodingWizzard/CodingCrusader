class TerrainPainterMarchingCubes extends PluginBase {

    constructor(scene) {
        super();


        let chunk = new Chunk(scene);

        /**/

        let g = new BABYLON.Vector3(0, -9.8 * 0.001, 0);
        let meshBase = BABYLON.MeshBuilder.CreateSphere("", { diameter: 0.15, segments: 9 }, this.scene);
        meshBase.material = new BABYLON.StandardMaterial("mat", scene);
        // meshBase.material.backFaceCulling = false;
        meshBase.material.emissiveColor = BABYLON.Color3.FromHexString('#ffffff');

        meshBase.dir = new BABYLON.Vector3(0 * 0.02, 0 * 0.2, 0);
        meshBase.isVisible = false;

        let meshes = [];
        let max = 100;
        for (let i = 0; i < max; i++) {
            let meshInstance = meshBase.createInstance("");
            meshInstance.dir = new BABYLON.Vector3(0.02, 0.2, 0.02);
            meshInstance.position.x = 2 * i / max;
            meshInstance.isVisible = true;
            meshes.push(meshInstance);
        }


        let r = new BABYLON.Vector3.Zero();
        let f = .01;
        let rnd = (dir) => {
            r.set(
                Math.sign(dir.x) * f * Math.random(),
                Math.sign(dir.y) * f * Math.random(),
                Math.sign(dir.z) * f * Math.random())
            dir.addInPlace(r);
        }


        let desiredFps = 60;
        let interval = 1000 / (10 * desiredFps);
        let lastTime = performance.now();
        function loop() {
            window.requestAnimationFrame(loop)
            let currentTime = performance.now();
            const deltaTime = currentTime - lastTime;
            if (deltaTime > interval) {
                lastTime = currentTime - (deltaTime % interval);

                let mx = chunk.max - 1;

                for (let i = 0; i < meshes.length; i++) {
                    let mesh = meshes[i];

                    mesh.position.addInPlace(mesh.dir);
                    mesh.dir.addInPlace(g);

                    if (mesh.position.y > mx || mesh.position.y < -mx)
                        mesh.dir.y *= -1

                    if (mesh.position.x > mx || mesh.position.x < -mx)
                        mesh.dir.x *= -1

                    if (mesh.position.z > mx || mesh.position.z < -mx)
                        mesh.dir.z *= -1

                    if (Math.random() > 0.9) {
                        rnd(mesh.dir);
                    }

                    let x = Math.floor(mesh.position.x);
                    let y = Math.floor(mesh.position.y);
                    let z = Math.floor(mesh.position.z);

                    let root = Math.sqrt(x * x + y * y + z * z);
                    try {
                        if (root < mx - 3 || root > mx + 3)
                            chunk.cells[x][y][z] += 0.1;
                        else
                            chunk.cells[x][y][z] -= 0.1;
                    } catch (e) { }

                }



                chunk.generate(currentTime);
            }
        }
        loop();

    }


    activate() {

    }

    deactivate() {
    }
}