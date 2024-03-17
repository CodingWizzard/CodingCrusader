class Trailer {

    constructor(scene, text3D) {
        this.scene = scene;


        let data = [
            { text: "Coding Crusader's", size: 0.5, delay: 0 },

            { text: "", size: 0.1 },
            { text: "Music from Milkyway Symphonie Orchestra", size: 0.2, delay: 2000 },

            { text: "", size: 0.1 },
            { text: "Copyright 2024 Space Studios", size: 0.2, delay: 2000 },
        ];

        let position = new BABYLON.Vector3(0, 10, 0);

        data.forEach((item) => {
            if (item.text !== "") {
                text3D.createText(item.text, item.size, position);
            }
            position.y -= item.size * 12;
        })
    }
}
