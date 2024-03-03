class ChineseDisciplin extends PluginBase {

    constructor(scene) {
        super();

        let material = new BABYLON.StandardMaterial("", scene);


        let max = 9 * 2;
        let meshes = [];
        for (let x = -max; x <= max; x += 1) {
            meshes[x] = [];
            let y = 0;
            for (let z = -max; z <= max; z += 1) {
                if (Math.sqrt(x * x + z * z) > max) continue;

                let mesh = BABYLON.MeshBuilder.CreateSphere("", { diameter: .25, diameterY: 3, segments: 9 }, scene);
                let mesh2 = BABYLON.MeshBuilder.CreateSphere("", { diameter: 2, diameterY: 0.1, segments: 9 }, scene);
                mesh2.parent = mesh;
                mesh2.position.y = 1.25;
                mesh.position.set(2 * x, y, 2 * z);
                mesh.pos = new BABYLON.Vector3.Zero();
                mesh.pos.copyFrom(mesh.position);
                mesh.posOld = new BABYLON.Vector3.Zero();
                mesh.posOld.copyFrom(mesh.position);
                mesh.material = new BABYLON.StandardMaterial("material", scene);

                mesh.acceleration = new BABYLON.Vector3(0, 0, 0);
                meshes[x][z] = mesh;
            }
        }


        let flagWind = true;
        let wind = new BABYLON.Vector3(0, 0, 0);
        let windRot = new BABYLON.Vector3(0.2, 0.2, 0.2);
        let meshWind = BABYLON.MeshBuilder.CreateSphere("", { diameter: 1, segments: 9 }, scene);
        meshWind.material = new BABYLON.StandardMaterial("material", scene);
        meshWind.material.emissiveColor = new BABYLON.Color3(1, 0, 0);
        meshWind.isVisible = false;


        scene.onKeyboardObservable.add((kbInfo) => {
            switch (kbInfo.type) {
                case BABYLON.KeyboardEventTypes.KEYDOWN:
                    switch (kbInfo.event.key) {
                        case "s": // stop/start wind
                            flagWind = !flagWind;
                            break;
                    }
                    break;
            }
        });

        let offset = new BABYLON.Vector3.Zero();
        scene.registerAfterRender(() => {
            for (let x = -max; x <= max; x += 1) {
                for (let z = -max; z <= max; z += 1) {
                    if (Math.sqrt(x * x + z * z) > max) continue;

                    let mesh = meshes[x][z];
                    mesh.position.subtractInPlace(mesh.acceleration);

                    if (flagWind) {
                        let dist = 1 / (1 + BABYLON.Vector3.Distance(wind, mesh.position)) * 0.001;
                        offset = mesh.position.subtract(mesh.pos).add(wind).scale(dist);
                    }
                    else {
                        offset = mesh.position.subtract(mesh.pos).scale(0.001);
                        mesh.acceleration.scaleInPlace(0.99);
                    }
                    mesh.acceleration.addInPlace(offset);

                    let dx = mesh.posOld.x - mesh.position.x;
                    let dy = mesh.posOld.y - mesh.position.y;
                    let dz = mesh.posOld.z - mesh.position.z;

                    mesh.rotation.x = 0.5 * Math.PI + Math.atan(dx / dy);
                    mesh.rotation.z = 0.5 * Math.PI + Math.atan(dx / dy);
                    mesh.posOld.copyFrom(mesh.position);


                    if (flagWind) {
                        let t = performance.now() * 0.0005;
                        wind.x = 0.5 * max * Math.sin(t);
                        wind.z = 0.5 * max * Math.cos(t);
                        wind.y = 3 + 3 * Math.sin(t);
                    }
                    else {
                        wind.set(0, 0, 0);
                    }

                    meshWind.position.copyFrom(wind);
                }
            }
        });

    }


    activate() {

    }

    deactivate() {
    }
}