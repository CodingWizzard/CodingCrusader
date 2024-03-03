class DecalImpression extends PluginBase {

    constructor(scene) {
        super();

        let mat1 = new BABYLON.StandardMaterial("mat", scene);
        mat1.alpha = 0.99;
        // mat1.wireframe = true;

        let mat2 = new BABYLON.StandardMaterial("mat", scene);
        // mat2.alpha = 0.5;
        mat2.wireframe = false;

        let sphere1radius = 1;
        let sphere1 = BABYLON.MeshBuilder.CreateSphere("", { diameter: sphere1radius * 2, segments: 9 }, scene);
        sphere1.material = mat1;
        sphere1.isVisible = false;


        let sphere2radius = 1.5;
        let sphere2 = BABYLON.MeshBuilder.CreateSphere("", { diameter: sphere2radius * 2, segments: 3 * 3 * 3 * 2, updatable: true }, scene);
        sphere2.material = mat2;


        let positionsSphere2 = sphere2.getVerticesData(BABYLON.VertexBuffer.PositionKind);

        let print = (outer) => {
            let poSphere1 = new BABYLON.Vector3.Zero();
            let poSphere2 = new BABYLON.Vector3.Zero();

            poSphere1.set(
                sphere1.position.x,
                sphere1.position.y,
                sphere1.position.z);

            for (let ipSphere2 = 0; ipSphere2 < positionsSphere2.length; ipSphere2 += 3) {
                poSphere2.set(
                    sphere2.position.x + positionsSphere2[ipSphere2],
                    sphere2.position.y + positionsSphere2[ipSphere2 + 1],
                    sphere2.position.z + positionsSphere2[ipSphere2 + 2]);

                let dx = poSphere1.x - poSphere2.x;
                let dy = poSphere1.y - poSphere2.y;
                let dz = poSphere1.z - poSphere2.z;
                let dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist <= sphere1radius) {

                    var origin = undefined
                    if (outer)
                        origin = poSphere2.subtract(sphere1.position).normalize().scale(sphere1radius).add(sphere1.position);
                    else
                        origin = poSphere2.add(sphere2.position).normalize().scale(sphere2radius).add(sphere1.position.scale(0.1));

                    // meshPoint = BABYLON.MeshBuilder.CreateSphere("point", { diameter: 0.1 }, scene);
                    // meshPoint.position.copyFrom(origin);

                    positionsSphere2[ipSphere2 + 0] = origin.x;
                    positionsSphere2[ipSphere2 + 1] = origin.y;
                    positionsSphere2[ipSphere2 + 2] = origin.z;
                }
            }

            sphere2.updateVerticesData(BABYLON.VertexBuffer.PositionKind, positionsSphere2, false, true);

        }

        // sphere1.position.set(1, 1, 1);
        // print(true);
        // print(false);

        // sphere1.position.set(-1, -1, -1);
        // print(true);

        // sphere1.position.set(-1, -1, 1);
        // print(false);

        // sphere1.position.set(1, -1, 1);
        // print(false);

        for (let x = -1; x <= 1; x++) {
            if (x == 0) continue;
            for (let y = -1; y <= 1; y++) {
                if (y == 0) continue;
                for (let z = -1; z <= 1; z++) {
                    if (z == 0) continue;
                    sphere1.position.set(x, y, z);
                    print(true);
                }
            }
        }

    }


    activate() {

    }

    deactivate() {
    }
}