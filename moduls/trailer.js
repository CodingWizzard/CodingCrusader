class Trailer {

    constructor(scene, text3D) {
        this.scene = scene;


        let data = [
            { text: "Coding Crusader's", size: 0.5 },

            // { text: "", size: 0.2 },
            // { text: "A production of Space Studios and Galactic Pictures", size: 0.3 },

            { text: "", size: 0.1 },
            { text: "Music from Milkyway Symphonie Orchestra", size: 0.2 },

            // { text: "", size: 0.2 },
            // { text: "Production date and location: 2024, Mars", size: 0.2 },
            // { text: "", size: 0.2 },

            { text: "", size: 0.1 },
            { text: "Copyright 2024 Space Studios. All rights reserved.", size: 0.2 },

            { text: "", size: 0.1 },
            { text: "Special thanks to all members of the Babylon.js forum", size: 0.2 },
        ];


        let position = new BABYLON.Vector3(0, 10, 0);

        data.forEach((item) => {
            if (item.text !== "") {
                text3D.createText(item.text, item.size, position);
            }

            position.y -= item.size * 12;
        })

        /* * /
        // let labelTitle = 
        // text3D.createText("", 0.5, new BABYLON.Vector3(0, 0, 0));

        let desiredFps = 10;
        let interval = 1000 / (10 * desiredFps);
        let lastTime = performance.now();

        let i = 0;
        scene.registerAfterRender(() => {
            let currentTime = performance.now();
            const deltaTime = currentTime - lastTime;
            if (deltaTime > interval) {
                lastTime = currentTime - (deltaTime % interval);

                // labelTitle.position.x += 0.1;
                labelTitle.position.x = 10 * Math.sin(i);
                i += 0.01;

            }
        });
        /* */
    }

}
