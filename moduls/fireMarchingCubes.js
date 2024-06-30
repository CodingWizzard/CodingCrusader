class FireMarchingCubes extends PluginBase {

    constructor(scene) {
        super();


        let chunk = new Chunk(scene);
        // chunk.customMesh.material.wireframe = false;
        // chunk.customMesh.material.emissiveColor = null;
        // chunk.customMesh.material.diffuseTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/sand.jpg", scene);
        chunk.customMesh.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
        chunk.customMesh.material.alpha = 0.2;

        let min = -chunk.max + 0; // + 1;
        let max = chunk.max - 0; //  - 1;
        for (let x = min; x < max; x++) {
            for (let y = min; y < max; y++) {
                for (let z = min; z < max; z++) {

                    // chunk.cells[x][y][z] = Math.random();

                    // chunk.cells[x][y][z] = 0;
                    // if (y == min)
                    //     chunk.cells[x][y][z] = 1;

                    // if (y >= min && y <= 0.25 * max)
                    //     if (Math.random() > 0.4)
                    //         chunk.cells[x][y][z] = 1; //  Math.random();

                    if (x >= -1 && x <= 1 &&
                        y >= -1 && y <= 1 &&
                        z >= -1 && z <= 1)
                        chunk.cells[x][y][z] = 1;// * Math.random();
                }
            }
        }

        let nextGeneration = (currentTime) => {
            for (let y = min; y < max; y++) {
                // for (let y = max; y >= min; y--) {
                for (let x = min; x < max; x++) {

                    for (let z = min; z < max; z++) {

                        // if (chunk.cells[x][y][z] <= 0) continue;

                        for (let dx = -1; dx <= 1; dx++) {
                            for (let dy = -1; dy <= 1; dy++) {
                                for (let dz = -1; dz <= 1; dz++) {

                                    // if (x + dx < min || x + dx > max) continue;
                                    // if (y + dy < min || y + dy > max) continue;
                                    // if (z + dz < min || z + dz > max) continue;

                                    if (Math.random() > 0.8) continue;

                                    try {

                                        if (chunk.cells[x][y][z] > chunk.cells[x + dx][y + dy][z + dz]) {
                                            let delta = chunk.cells[x][y][z] * 0.01; // * Math.random();
                                            // let delta = chunk.cells[x][y][z] * 0.1 * Math.random();
                                            chunk.cells[x + dx][y + dy][z + dz] += delta;
                                            chunk.cells[x][y][z] -= delta * 0.05;

                                            // if (chunk.cells[x][y][z] < 0)
                                            //     chunk.cells[x][y][z] = 0;

                                            // if (y >= min && y <= 0.25 * max)
                                            //     chunk.cells[x][y][z] = 1;
                                        }
                                    } catch (e) { }

                                }
                            }
                        }


                        // if (x >= -1 && x <= 1 &&
                        //     y >= -1 && y <= 1 &&
                        //     z >= -1 && z <= 1)
                        //     chunk.cells[x][y][z] = 1;

                        if (chunk.cells[x][y][z] > 0)
                            chunk.cells[x][y][z] -= 0.05;  // cool down
                    }
                }
            }

            chunk.generate(currentTime);
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

                nextGeneration(currentTime);

            }
        }
        loop();

    }


    activate() {

    }

    deactivate() {
    }
}