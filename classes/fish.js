class Fish {
    constructor(scene) {

        // let posGround = (i1, i2) => { return 3 * (Math.sin(i1 * Math.PI / max2 + Math.sin(i2 * Math.PI / max2))); }

        let fg = 2; // + 2 * Math.random();
        let posGround = (i1, i2) => {
            return fg * (Math.sin(i1 * Math.PI / max2 + Math.sin(i2 * Math.PI / max2)));
        }

        // let max = 8;
        let max = Math.floor(2 + 10 * Math.random());
        let max2 = 2 * max;
        let waves = [];

        for (let i1 = -max; i1 <= max; i1 += 1) {
            for (let i2 = -max; i2 <= max; i2 += 1) {

                // Wave formation as a circle


                // let radius = Math.sqrt(Math.pow(i1, 5 * Math.random()) + Math.pow(i2, 5 * Math.random()));
                let radius = Math.sqrt(Math.pow(i1, 2) + Math.pow(i2, 2));
                if (radius > 2 * max) {
                    continue;
                }

                let zGround = posGround(i1, i2);

                // Math.random() * max -
                let dia = 0.2 * (max - radius);
                let meshWave = BABYLON.MeshBuilder.CreateSphere("wave" + i1 + "-" + i2,
                    {
                        diameter: dia, // max - radius,
                        // diameterY: max - radius,
                        segments: 18 // + 16
                    },
                    scene);
                // meshWave.position.set(i1, i2, zGround - 3);
                meshWave.position.set(i1, i2, 0);
                meshWave.material = new BABYLON.StandardMaterial("material", scene);
                // meshWave.material.alpha = 0.5;

                meshWave.material.emissiveColor = new BABYLON.Color3(
                    // 0.5 * Math.random(), 0.5 * Math.random(), 0.5 * Math.random()
                    Math.abs(Math.sin(i1 / max2)),
                    Math.abs(Math.sin(i2 / max2)),
                    Math.abs(Math.sin((i1 + i2) / max2))
                );

                meshWave.i1 = i1;
                meshWave.i2 = i2;
                meshWave.acceleration = 0;

                waves.push(meshWave);
            }
        }

        let t = Math.random() * 100;
        let tf = 0.5 - Math.random();
        scene.registerAfterRender(() => {

            waves.forEach((wave) => {
                // wave.position.x = wave.i1 + max2 * Math.sin(t + wave.i1 / max2);
                wave.position.x = wave.i1 + max2 * Math.sin(t);
                wave.position.y = wave.i2 + max2 * Math.cos(t);
                wave.position.z = (wave.i1 + wave.i2) + max2 * Math.sin(t);


                let zGround = posGround(wave.position.x, wave.position.y);
                wave.position.z -= wave.acceleration;
                wave.acceleration += (wave.position.z - zGround) / 100;
                wave.acceleration *= 0.99;
            })

            t += tf * 0.05;
        });


    }

}
