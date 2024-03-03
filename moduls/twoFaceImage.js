class TwoFaceImage extends PluginBase {

    constructor(scene) {
        super();

        let texture1 = new BABYLON.Texture("https://i.imgur.com/P95ke.jpeg", scene);
        let texture2 = new BABYLON.Texture("https://i.imgur.com/HMlfk4T.jpeg", scene);

        let max = 20;
        let r2 = Math.sqrt(2);

        class Cell {
            constructor(u, v, x, y, z, texture) {
                let uv = new BABYLON.Vector4(u, v, u + 1 / max, v + 1 / max);
                let mesh = BABYLON.MeshBuilder.CreatePlane("plane", {
                    size: 0.9,
                    sideOrientation: BABYLON.Mesh.DOUBLESIDE, frontUVs: uv, backUVs: uv
                }, scene);
                mesh.position.set(x, y, z);
                mesh.material = new BABYLON.StandardMaterial("", scene);
                mesh.material.diffuseTexture = texture;
                this.mesh = mesh;
            }
        }

        let render = (u, v, x, y) => {
            let cell1 = new Cell(u, v, x, y, 0, texture1);
            cell1.mesh.rotation.y = 0.25 * Math.PI;
            cell1.mesh.position.x += r2 * 0.25;

            let cell2 = new Cell(u, v, x, y, 0, texture2);
            cell2.mesh.rotation.y = -0.25 * Math.PI;
            cell2.mesh.position.x -= r2 * 0.25;
        }

        for (let x = 0; x < max; x++) {
            let u = x / max;
            for (let y = 0; y < max; y++) {
                let v = y / max;
                render(u, v, -max + x * r2, -0.5 * max + y);
            }
        }

    }


    activate() {

    }

    deactivate() {
    }
}