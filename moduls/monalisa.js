class MonaLisa extends PluginBase {

    constructor(scene) {
        super();

        let MAX = 50;
        let MAX2 = MAX * 2;

        // let camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 2.24, MAX2 * 2, new BABYLON.Vector3(0, 0, 0), scene);
        // // camera.attachControl(canvas, true);            
        // // let camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 0, -500), scene);
        // camera.attachControl(canvas, true);


        // let light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
        // light.position = new BABYLON.Vector3(20, 150, 70);
        // light.intensity = 0.7;

        let texture = new BABYLON.Texture("https://playground.babylonjs.com/textures/cloud.png", scene);

        let material = new BABYLON.StandardMaterial("name", scene);
        material.diffuseTexture = new BABYLON.Texture("https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/450px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg");

        const points = [];
        const colors = [];
        let ready = false;

        material.diffuseTexture.onLoadObservable.addOnce(function () {
            function texture2D(texture, uv) {
                let u = uv.x * texture.width;
                let v = (uv.y) * texture.height;

                let index = 4 * (Math.floor(v) * texture.width + Math.floor(u));
                return {
                    r: texture.data[index] / 255,
                    g: texture.data[index + 1] / 255,
                    b: texture.data[index + 2] / 255,
                    a: texture.data[index + 3] / 255
                }
            }

            let texture = {
                width: material.diffuseTexture.getSize().width,
                height: material.diffuseTexture.getSize().height,
                data: new Uint8Array(this.width * this.height * 4)
            };

            material.diffuseTexture.readPixels().then((result) => {
                texture.data = result;

                for (let x = -MAX * 0.25; x <= MAX * 0.25; x += 1) {
                    for (let y = -MAX; y <= MAX; y += 1) {
                        points.push(new BABYLON.Vector3(x, y, 0));

                        let uv = { x: (x + MAX) / MAX2, y: (y + MAX) / MAX2 };
                        let c = texture2D(texture, uv);
                        colors.push(new BABYLON.Color4(c.r, c.g, c.b, c.a));
                    }
                }

                ready = true;

                // let pcs = new BABYLON.PointsCloudSystem("pcs", 5, scene);
                // let initParticles = function (particle, i, s) {
                //     particle.position = points[i];
                //     particle.color = colors[i];
                // };
                // pcs.addPoints(points.length, initParticles);
                // pcs.buildMeshAsync();

            }).catch((error) => {
                console.error(error); // Handle any errors here
            });
        });


        // scene.registerBeforeRender(function () {
        //     if (!ready) return;

        //     let f = 3;
        //     for (let i = 0; i < points.length; i+=1) {
        //         const mesh = BABYLON.MeshBuilder.CreatePlane("point", { width: 1, height: 1 }, scene);
        //         mesh.position.set(points[i].x * f, points[i].y * f, i * 0.01);
        //         mesh.rotation.set(0, 0, 2 * Math.PI * Math.random());
        //         mesh.scaling = mesh.scaling.scale(f * f + f * Math.random());
        //         mesh.material = new BABYLON.StandardMaterial("", scene);
        //         mesh.material.diffuseTexture = texture;
        //         mesh.material.opacityTexture = texture;
        //         mesh.material.diffuseTexture.hasAlpha = true;
        //         mesh.material.backFaceCulling = false;
        //         mesh.material.diffuseColor = colors[i];
        //     }

        //     ready = false;
        // });

    }


    activate() {

    }

    deactivate() {
    }
}