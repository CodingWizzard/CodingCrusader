class Fish2 {
    constructor(scene) {
        // super();


        let posGround = (i1, i2) => { return 3 * (Math.sin(i1 * Math.PI / max2 + Math.sin(i2 * Math.PI / max2))); }

        let max = 12;
        let max2 = 2 * max;
        let waves = [];

        for (let i1 = -max; i1 <= max; i1 += 1) {
            for (let i2 = -max; i2 <= max; i2 += 1) {

                // Wave formation as a circle
                let radius = Math.sqrt(i1 * i1 + i2 * i2);
                if (radius > max) {
                    continue;
                }

                let zGround = posGround(i1, i2);

                let meshWave = BABYLON.MeshBuilder.CreateSphere("wave" + i1 + "-" + i2,
                    {
                        diameter: 0.5 * radius,
                        // diameterY: max - radius,
                        segments: 8
                    },
                    scene);
                // meshWave.position.set(i1, i2, zGround - 3);
                meshWave.position.set(i1, i2, 0);
                meshWave.material = new BABYLON.StandardMaterial("material", scene);
                // meshWave.material.alpha = 0.5;

                meshWave.material.emissiveColor = new BABYLON.Color3(
                    Math.abs(Math.sin(i1 / max2)),
                    Math.abs(Math.sin(i2 / max2)),
                    Math.abs(Math.sin((i1 + i2) / max2)));

                meshWave.i1 = i1;
                meshWave.i2 = i2;
                meshWave.acceleration = 0;

                waves.push(meshWave);
            }
        }

        let t = Math.random() * 100;
        scene.registerAfterRender(() => {

            waves.forEach((wave) => {
                // wave.position.x = wave.i1 + max2 * Math.sin(t + wave.i1 / max2);
                wave.position.x = wave.i1 + max2 * Math.sin(t);
                wave.position.y = wave.i2 + max2 * Math.cos(t);


                let zGround = posGround(wave.position.x, wave.position.y);
                wave.position.z -= wave.acceleration;
                wave.acceleration += (wave.position.z - zGround) / 100;
                wave.acceleration *= 0.99;
            })

            t += 0.01;
        });



    }

}
