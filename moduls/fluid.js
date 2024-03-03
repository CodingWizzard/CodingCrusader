class Fluid extends PluginBase {

    constructor(scene) {
        super();

        let mat1 = new BABYLON.StandardMaterial("mat", scene);
        mat1.diffuseColor = new BABYLON.Color3(1, 0, 0);
        mat1.alpha = 0.125;
        let mat2 = new BABYLON.StandardMaterial("mat", scene);
        mat2.alpha = 0.125;
        mat2.diffuseColor = new BABYLON.Color3(1, 1, 0);
        mat2.emissiveColor = BABYLON.Color3.Teal();

        let sphereMesh = BABYLON.MeshBuilder.CreateSphere("", { diameter: 10, segments: 9 * 2 }, scene);
        sphereMesh.computeWorldMatrix(true);

        sphereMesh.material = new BABYLON.StandardMaterial("mat", scene);
        sphereMesh.material.alpha = 0.;

        let sphereWorldMatrix = sphereMesh.getWorldMatrix();
        let spherePositions = sphereMesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);

        let positions = [];
        for (let i = 0; i < spherePositions.length; i += 3) {
            let localVertex = BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(spherePositions[i], spherePositions[i + 1], spherePositions[i + 2]), sphereWorldMatrix);
            positions.push(localVertex);
        }

        let distance = 10; // 5;
        let distanceJoint = new BABYLON.DistanceConstraint(distance, scene);


        let meshesFix = [];
        let meshesDyn = [];

        let dir = new BABYLON.Vector3.Zero();
        for (let i = 0; i < positions.length; i++) {
            let x = positions[i].x;
            let y = positions[i].y;
            let z = positions[i].z;

            let sphere1 = BABYLON.MeshBuilder.CreateSphere("", { diameter: 0.1, segments: 3 }, scene);
            sphere1.material = mat1;
            sphere1.isVisible = false;
            sphere1.position.set(x, y, z);
            sphere1.agg = new BABYLON.PhysicsAggregate(
                sphere1,
                BABYLON.PhysicsShapeType.SPHERE,
                { mass: 0, restitution: 0.5 },
                scene
            );
            sphere1.agg.body.disablePreStep = false;
            meshesFix.push(sphere1);


            dir = sphere1.position.normalize().scale(distance);
            let sphere2 = BABYLON.MeshBuilder.CreateSphere("", { diameter: 0.5, segments: 9 }, scene);
            sphere2.material = mat2;
            sphere2.position.set(x, y, z);
            sphere2.position.addInPlace(dir);
            sphere2.agg = new BABYLON.PhysicsAggregate(
                sphere2,
                BABYLON.PhysicsShapeType.SPHERE,
                { mass: 1, restitution: 0.5 },
                scene
            );
            meshesDyn.push(sphere2);

            sphere1.agg.body.addConstraint(sphere2.agg.body, distanceJoint);
        }


        // let step = 0;
        // setTimeout(() => {
        //     step = 1;
        // }, 10000)

        let t = 0;
        let maxFix = meshesFix.length;
        let p0 = new BABYLON.Vector3(0, 0, 0);
        scene.registerBeforeRender(function () {
            t += 0.01;

            // if (step == 1) {
            //     meshesFix.forEach(function (mesh, index) {
            //         mesh.position.x = 10 * Math.sin(t + (index * 2 * Math.PI / maxFix));
            //         mesh.position.y = 10 * Math.cos(t + (index * 2 * Math.PI / maxFix));
            //         mesh.position.z = 10 //  + 3 * Math.sin(t + (index * 3 * Math.PI / maxFix));
            //     })
            // }


            meshesDyn.forEach(function (mesh) {
                let dir = mesh.position.subtract(p0).normalize();
                mesh.agg.body.applyImpulse(dir.scale(3), new BABYLON.Vector3(0, 0, 0));
            })
        })

    }


    activate() {

    }

    deactivate() {
    }
}