class Clouds extends PluginBase {

    constructor(scene) {
        super();

        const meshBackGroundHeaven = BABYLON.MeshBuilder.CreatePlane("point", { width: 200, height: 50 }, scene);
        meshBackGroundHeaven.position.z = 1;
        meshBackGroundHeaven.position.y = 25;
        meshBackGroundHeaven.material = new BABYLON.StandardMaterial("", scene);
        meshBackGroundHeaven.material.diffuseColor = new BABYLON.Color3(0.1, 0.2, 0.8);
        meshBackGroundHeaven.isFixed = true;

        const meshBackGroundEarth = BABYLON.MeshBuilder.CreatePlane("point", { width: 200, height: 50 }, scene);
        meshBackGroundEarth.position.z = 1;
        meshBackGroundEarth.position.y = -25;
        meshBackGroundEarth.material = new BABYLON.StandardMaterial("", scene);
        meshBackGroundEarth.material.diffuseColor = new BABYLON.Color3(0, 1, 0);
        meshBackGroundEarth.isFixed = true;

        function mapRange(value, fromMin, fromMax, toMin, toMax) {
            const fromRange = fromMax - fromMin;
            const toRange = toMax - toMin;
            const scaledValue = (value - fromMin) / fromRange;
            return toMin + scaledValue * toRange;
        }


        let max = 20;
        let renderClouds = () => {
            let cust_scale_scale_min = 9;
            let cust_scale_scale_max = 30;

            let texture = new BABYLON.Texture("https://playground.babylonjs.com/textures/cloud.png", scene);

            let f = 100;
            for (let i = 0; i < max; i++) {
                const mesh = BABYLON.MeshBuilder.CreatePlane("point", { width: 1, height: 1 }, scene);
                mesh.position.set(
                    0.5 * f - f * Math.random(),
                    25,
                    -i);
                mesh.rotation.set(0, 0, 2 * Math.PI * Math.random());
                mesh.scaling = mesh.scaling.scale(cust_scale_scale_min + cust_scale_scale_max * Math.random());

                let material = new BABYLON.StandardMaterial("", scene);
                material.diffuseTexture = texture;
                material.opacityTexture = texture;
                material.diffuseTexture.hasAlpha = true;
                material.backFaceCulling = false;

                let r = mapRange(i, 0, 0.25 * max, 0, 1);
                let g = mapRange(i, 0, 0.25 * max, 0, 1);
                let b = mapRange(i, 0, 0.25 * max, 0, 1);
                material.diffuseColor = new BABYLON.Color3(r, g, b);

                mesh.material = material;
            }
        }

        renderClouds();

        scene.registerBeforeRender(function () {
            for (let i = 0; i < scene.meshes.length; i++) {
                let mesh = scene.meshes[i];

                if (mesh.isFixed !== undefined)
                    continue;

                mesh.position.x -= 0.05;
                mesh.rotation.z -= 0.0005;
                if (mesh.position.x < -max * 4)
                    mesh.position.x = max * 4;
            }
        });

    }


    activate() {

    }

    deactivate() {
    }
}