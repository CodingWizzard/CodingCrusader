class TerrainPainterMarchingCubes extends PluginBase {

    constructor(scene) {
        super();


        let chunk = new Chunk(scene);

        let meshBox = BABYLON.MeshBuilder.CreateSphere("box", { diameter: 1, segments: 12 }, scene);
        meshBox.material = new BABYLON.StandardMaterial("mat", scene);
        meshBox.material.alpha = 0.5;

        let speed = 0.0003;
        let factor = 0.5;

        scene.onKeyboardObservable.add((kbInfo) => {
            switch (kbInfo.type) {
                case BABYLON.KeyboardEventTypes.KEYDOWN:
                    switch (kbInfo.event.key) {
                        case "x": // ArrowUp":
                            factor *= -1;
                            break;
                    }
                    break;
            }
        });


        let desiredFps = 60;
        let interval = 1000 / (10 * desiredFps);
        let lastTime = performance.now();
        function loop() {
            window.requestAnimationFrame(loop)
            let currentTime = performance.now();
            const deltaTime = currentTime - lastTime;
            if (deltaTime > interval) {
                lastTime = currentTime - (deltaTime % interval);


                // meshBox.position.x = chunk.max * Math.sin(0.5 * lastTime * speed);
                // meshBox.position.y = chunk.max * Math.sin(1 * lastTime * speed);
                // meshBox.position.z = chunk.max * Math.sin(2.5 * lastTime * speed);

                // meshBox.position.x = chunk.max * Math.sin(3 * lastTime * speed);
                // meshBox.position.y = chunk.max * Math.cos(4 * lastTime * speed);
                // meshBox.position.z = chunk.max * Math.sin(5 * lastTime * speed);

                meshBox.position.x = 1 * (0.5 * chunk.max - chunk.max * Math.random());
                meshBox.position.y = 1 * (0.5 * chunk.max - chunk.max * Math.random());
                meshBox.position.z = 1 * (0.5 * chunk.max - chunk.max * Math.random());

                let x = Math.floor(meshBox.position.x);
                let y = Math.floor(meshBox.position.y);
                let z = Math.floor(meshBox.position.z);
                chunk.cells[x][y][z] += factor;

                // if (chunk.cells[x][y][z] < 0)
                //     chunk.cells[x][y][z] = 0;
                // else if (chunk.cells[x][y][z] > 2)
                //     chunk.cells[x][y][z] = 2 + 8 * Math.random();


                chunk.cells[x][y][z] += 1 * (0.5 - Math.random()); // 2 + 8 * Math.random();


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