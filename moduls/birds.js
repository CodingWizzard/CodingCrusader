class Birds extends PluginBase {

    constructor(scene) {
        super();

        let matWall = new BABYLON.StandardMaterial("mat", scene);
        // matWall.emissiveColor = BABYLON.Color3.Green();
        matWall.alpha = 0.1 * 0;
        matWall.wireframe = true;

        let matBoid = new BABYLON.StandardMaterial("mat", scene);
        matBoid.emissiveColor = BABYLON.Color3.Black();
        matBoid.wireframe = true;
        // matBoid.diffuseColor = BABYLON.Color3.Green();

        // let matFalkon = new BABYLON.StandardMaterial("mat", scene);
        // matFalkon.emissiveColor = BABYLON.Color3.Red();

        let f = 10;
        let s = f * 2;  // 1.2
        let max = 50;
        let offset = s * 0.5;

        // let createBox = (size) => {
        //     let mesh = BABYLON.MeshBuilder.CreateBox("", { width: size, height: size, depth: size }, scene);
        //     mesh.material = matBox;
        //     mesh.position.set(
        //         f * (0.5 - Math.random()),
        //         f * (0.5 - Math.random()),
        //         f * (0.5 - Math.random()));
        //     mesh.agg = new BABYLON.PhysicsAggregate(
        //         mesh,
        //         BABYLON.PhysicsShapeType.BOX,
        //         { mass: 0, restitution: 0.5 },
        //         scene
        //     );
        // }

        // for (let i = 0; i < 5; i++) {
        //     createBox(5);
        // }


        let createWall = (width, height, depth, mat) => {
            let delta = 1;
            let mesh = undefined;

            mesh = BABYLON.MeshBuilder.CreateBox("", { width: width, height: height, depth: delta }, scene);
            mesh.material = mat;
            mesh.position.z = -0.5 * depth;
            mesh.position.y += offset;
            mesh.agg = new BABYLON.PhysicsAggregate(
                mesh,
                BABYLON.PhysicsShapeType.BOX,
                { mass: 0, restitution: 0.5 },
                scene
            );


            mesh = BABYLON.MeshBuilder.CreateBox("", { width: width, height: height, depth: delta }, scene);
            mesh.material = matWall;
            mesh.position.z = 0.5 * depth;
            mesh.position.y += offset;
            mesh.agg = new BABYLON.PhysicsAggregate(
                mesh,
                BABYLON.PhysicsShapeType.BOX,
                { mass: 0, restitution: 0.5 },
                scene
            );



            mesh = BABYLON.MeshBuilder.CreateBox("", { width: delta, height: height, depth: depth }, scene);
            mesh.material = matWall;
            mesh.position.x = width * 0.5;
            mesh.position.y += offset;
            // mesh.position.z += 0.25 * depth;
            mesh.agg = new BABYLON.PhysicsAggregate(
                mesh,
                BABYLON.PhysicsShapeType.BOX,
                { mass: 0, restitution: 0.5 },
                scene
            );


            mesh = BABYLON.MeshBuilder.CreateBox("", { width: delta, height: height, depth: depth }, scene);
            mesh.material = matWall;
            mesh.position.x = -width * 0.5;
            mesh.position.y += offset;
            mesh.agg = new BABYLON.PhysicsAggregate(
                mesh,
                BABYLON.PhysicsShapeType.BOX,
                { mass: 0, restitution: 0.5 },
                scene
            );



            mesh = BABYLON.MeshBuilder.CreateBox("", { width: width, height: delta, depth: depth }, scene);
            mesh.material = matWall;
            mesh.position.y = height * 0.5;
            mesh.position.y += offset;
            mesh.agg = new BABYLON.PhysicsAggregate(
                mesh,
                BABYLON.PhysicsShapeType.BOX,
                { mass: 0, restitution: 0.5 },
                scene
            );


            mesh = BABYLON.MeshBuilder.CreateBox("", { width: width, height: delta, depth: depth }, scene);
            mesh.material = matWall;
            mesh.position.y = -height * 0.5;
            mesh.position.y += offset;
            mesh.agg = new BABYLON.PhysicsAggregate(
                mesh,
                BABYLON.PhysicsShapeType.BOX,
                { mass: 0, restitution: 0.5 },
                scene
            );
        }

        let spheres = [];
        let createSphere = (diameter) => {
            let sphere = BABYLON.Mesh.CreateSphere("", 9, diameter, scene);
            sphere.position.set(
                f * (0.5 - Math.random()),
                offset + f * (0.5 - Math.random()),
                f * (0.5 - Math.random()));

            sphere.scaling.set(0.5 + Math.random(), 0.5 + Math.random(), 0.5 + Math.random())

            sphere.material = matBoid;
            sphere.agg = new BABYLON.PhysicsAggregate(
                sphere,
                BABYLON.PhysicsShapeType.SPHERE,
                { mass: 1, restitution: 0.5 },
                scene
            );

            spheres.push(sphere);
            return sphere;
        }


        createWall(s, s, s, matWall);

        // let falkon = createSphere(1);
        // falkon.material = matFalkon;
        // falkon.isVisible = false;
        // setInterval(() => {
        //     falkon.isVisible = !falkon.isVisible;
        // }, 10000)


        for (let i = 0; i < max; i++) {
            let sphere = createSphere(1);
            sphere.scaling.scaleInPlace(0.2);

            const dir = new BABYLON.Vector3(
                0.5 - Math.random(),
                0.5 - Math.random(),
                0.5 - Math.random());
            sphere.agg.body.applyImpulse(dir, new BABYLON.Vector3(0, 0, 0));
        }


        function groupmeshes(meshes, threshold) {
            const groupedmeshes = [];

            meshes.forEach((mesh) => {
                let foundGroup = false;

                for (const group of groupedmeshes) {
                    const representativeMesh = group[0];

                    let dist = BABYLON.Vector3.Distance(mesh.position, representativeMesh.position);
                    if (dist <= threshold) {
                        group.push(mesh);
                        foundGroup = true;
                        break;
                    }
                }

                if (!foundGroup) {
                    const newGroup = [mesh];
                    groupedmeshes.push(newGroup);
                }
            });

            return groupedmeshes;
        }


        let t = 0;
        scene.registerBeforeRender(function () {

            t += 0.005;
            // if (falkon.isVisible) {
            //     falkon.position.set(
            //         0.5 * f * Math.sin(t),
            //         0.5 * f * Math.cos(t),
            //         0.5 * f * Math.sin(2 * t));
            // }

            const groupedmeshes = groupmeshes(spheres, 4);
            const vel = new BABYLON.Vector3()
            let imp = new BABYLON.Vector3.Zero();
            let posdiff = new BABYLON.Vector3.Zero();

            groupedmeshes.forEach((meshes) => {
                let posavg = new BABYLON.Vector3.Zero();
                let velavg = new BABYLON.Vector3.Zero();
                meshes.forEach((m) => {
                    posavg.addInPlace(m.position);
                    m.agg.body.getLinearVelocityToRef(vel);
                    velavg.addInPlace(vel);

                    if (vel.length() > 3) {
                        m.agg.body.setLinearVelocity(vel.scale(0.9));
                    }
                })
                posavg.scaleInPlace(1 / meshes.length);
                velavg.scaleInPlace(0.051 / meshes.length);

                meshes.forEach((mesh) => {

                    mesh.scaling.x = 0.5 - mesh.scaling.x;
                    mesh.scaling.y = 0.1; // 0.5 - mesh.scaling.y;
                    mesh.scaling.z = 0.5 - mesh.scaling.z;

                    // mesh.rotation.x += 0.1;
                    // mesh.scaling.y = 0.1;
                    // mesh.rotation.z += 0.1;

                    imp.copyFrom(velavg);
                    posdiff = posavg.subtract(mesh.position).scale(0.01);
                    imp.addInPlace(posdiff);

                    // if (falkon.isVisible) {
                    //     posdiff = mesh.position.subtract(falkon.position);
                    //     if (posdiff.length() < 20) {
                    //         imp.addInPlace(posdiff.normalize().scale(0.3));
                    //     }
                    // }

                    mesh.agg.body.applyImpulse(imp, new BABYLON.Vector3(0, 0, 0));
                })
            });

        });
    }


    activate() {

    }

    deactivate() {
    }
}