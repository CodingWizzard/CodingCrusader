class Fire extends PluginBase {

    constructor(scene) {
        super();

        let cells = [];
        let min = -12;
        let max = -min;
        let yd = 3;
        for (let x = min; x < max; x++) {
            cells[x] = [];


            // for (let y = min; y < max; y++) 
            for (let y = min - yd; y <= min + yd; y++)
            // let y = min;
            {
                cells[x][y] = [];
                for (let z = min; z < max; z++) {
                    // const meshCell = BABYLON.MeshBuilder.CreateBox("", { size: 0.5 });
                    const meshCell = BABYLON.MeshBuilder.CreateSphere("", { diameter: 1, segments: 3 });
                    meshCell.position.set(
                        x * (0.5 - Math.random()) * 0.5,
                        y * (0.5 - Math.random()) * 0.5,
                        z * (0.5 - Math.random()) * 0.5);
                    meshCell.material = new BABYLON.StandardMaterial("m", scene);
                    meshCell.material.emissiveColor = BABYLON.Color3.White();
                    meshCell.material.alpha = 1;
                    meshCell.material.wireframe = true;
                    meshCell.energy = 0;

                    cells[x][y][z] = meshCell;

                    if (x == 0 && y == min && z == 0)
                        meshCell.energy = 1; // Math.random();
                }
            }
        }

        let limit = (cell) => {
            if (cell.energy < 0) cell.energy = 0;
            if (cell.energy > 1) cell.energy = 1;
        }

        let exchangeEnergy = (x0, y0, z0, x1, y1, z1, x2, y2, z2) => {

            try {
                let cell0 = cells[x0][y0][z0];
                // if (cell0.energy < 0) return;

                let cell1 = cells[x1][y1][z1];
                let cell2 = cells[x2][y2][z2];

                let de = (cell2.energy - cell1.energy) * 0.1;
                // if (de < 0) 
                { // } && Math.random() > 0.5) {
                    cell0.energy -= 2 * de;
                    cell1.energy += de;
                    cell2.energy += de;

                    limit(cell0);
                    limit(cell1);
                    limit(cell2);
                }

            } catch (e) {

                // let cell0 = cells[x0][y0][z0];
                // cell0.energy -= 0.1;
            }
        }


        let nextGeneration = (currentTime) => {
            for (let x = min; x < max; x++) {
                // for (let y = min; y < max; y++)
                for (let y = min - yd; y <= min + yd; y++)
                // let y = min;
                {
                    for (let z = min; z < max; z++) {

                        // let dist = Math.sqrt(x * x + z * z)
                        // if (dist > max)
                        //     continue;


                        exchangeEnergy(
                            x, y, z,
                            x - 1, y, z,
                            x + 1, y, z);

                        exchangeEnergy(
                            x, y, z,
                            x + 1, y, z,
                            x - 1, y, z);




                        exchangeEnergy(
                            x, y, z,
                            x, y, z - 1,
                            x, y, z + 1);


                        exchangeEnergy(
                            x, y, z,
                            x, y, z + 1,
                            x, y, z - 1);


                        exchangeEnergy(
                            x, y, z,
                            x - 1, y, z - 1,
                            x + 1, y, z + 1);


                        exchangeEnergy(
                            x, y, z,
                            x + 1, y, z - 1,
                            x - 1, y, z + 1);


                        exchangeEnergy(
                            x, y, z,
                            x - 1, y, z + 1,
                            x + 1, y, z - 1);


                        //

                        exchangeEnergy(
                            x, y, z,
                            x, y - 1, z,
                            x, y + 1, z);

                        exchangeEnergy(
                            x, y, z,
                            x, y + 1, z,
                            x, y - 1, z);


                        // exchangeEnergy(
                        //     x, y, z,
                        //     x + 1, y - 1, z - 1,
                        //     x - 1, y + 1, z + 1);

                        // exchangeEnergy(
                        //     x, y, z,
                        //     x - 1, y + 1, z - 1,
                        //     x + 1, y - 1, z + 1);

                        // exchangeEnergy(
                        //     x, y, z,
                        //     x + 1, y + 1, z - 1,
                        //     x - 1, y - 1, z + 1);


                        let e = cells[x][y][z].energy;
                        let es = 1 * e * e;
                        cells[x][y][z].scaling.set(es, es, es); // Math.pow(2 * e, 2), e);
                        cells[x][y][z].material.emissiveColor.set(
                            (0.0 * x + 0.5 * max) * e,
                            e * 0.5, // 0.5 * y * e,
                            (0.0 * z + 0.5 * max) * e);

                        // if (Math.random() > 0.5)
                        //     cells[x][y][z].material.emissiveColor.r = e;
                        // // else if (Math.random() > 0.5)
                        //     cells[x][y][z].material.emissiveColor.g = e;
                        // else if (Math.random() > 0.5)
                        //     cells[x][y][z].material.emissiveColor.b = e;

                        // cells[x][y][z].material.alpha = 1;//e;

                        // cells[x][y][z].position.y += e * 0.2;
                        // if (cells[x][y][z].position.y > max * 2)
                        //     cells[x][y][z].position.y = -max;



                    }
                }
            }


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