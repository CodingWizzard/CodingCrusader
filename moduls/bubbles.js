class Bubbles extends PluginBase {

    constructor(scene) {
        super();

        var gl = new BABYLON.GlowLayer("glow", scene);
        gl.intensity = 3;

        let matWall = new BABYLON.StandardMaterial("mat", scene);
        matWall.emissiveColor = BABYLON.Color3.White(); // Teal();
        matWall.alpha = 0.05 * 1;
        matWall.wireframe = true;

        let matBall = new BABYLON.StandardMaterial("mat", scene);
        matBall.emissiveColor = BABYLON.Color3.Teal();
        matBall.alpha = 0.3;
        // matWall.wireframe = true;

        let createWall = (width, height, depth, mat) => {

            let delta = 1;
            let mesh = undefined;

            mesh = BABYLON.MeshBuilder.CreateBox("", { width: width, height: height, depth: delta }, scene);
            mesh.material = mat;
            mesh.position.z = -0.5 * depth;
            mesh.agg = new BABYLON.PhysicsAggregate(
                mesh,
                BABYLON.PhysicsShapeType.BOX,
                { mass: 0, restitution: 0.5 },
                scene
            );


            mesh = BABYLON.MeshBuilder.CreateBox("", { width: width, height: height, depth: delta }, scene);
            mesh.material = matWall;
            mesh.position.z = 0.5 * depth;
            mesh.agg = new BABYLON.PhysicsAggregate(
                mesh,
                BABYLON.PhysicsShapeType.BOX,
                { mass: 0, restitution: 0.5 },
                scene
            );



            mesh = BABYLON.MeshBuilder.CreateBox("", { width: delta, height: height, depth: depth }, scene);
            mesh.material = matWall;
            mesh.position.x = width * 0.5;
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
            mesh.agg = new BABYLON.PhysicsAggregate(
                mesh,
                BABYLON.PhysicsShapeType.BOX,
                { mass: 0, restitution: 0.5 },
                scene
            );



            mesh = BABYLON.MeshBuilder.CreateBox("", { width: width, height: delta, depth: depth }, scene);
            mesh.material = matWall;
            mesh.position.y = height * 0.5;
            mesh.agg = new BABYLON.PhysicsAggregate(
                mesh,
                BABYLON.PhysicsShapeType.BOX,
                { mass: 0, restitution: 0.5 },
                scene
            );


            mesh = BABYLON.MeshBuilder.CreateBox("", { width: width, height: delta, depth: depth }, scene);
            mesh.material = matWall;
            mesh.position.y = -height * 0.5;
            mesh.agg = new BABYLON.PhysicsAggregate(
                mesh,
                BABYLON.PhysicsShapeType.BOX,
                { mass: 0, restitution: 0.5 },
                scene
            );
        }

        let f = 10;
        let sf = f * 1.2
        createWall(sf, 5 * sf, sf, matWall);

        let max = 100;

        let diameter = 0.5;
        for (let i = 0; i < max; i++) {
            let sphere = BABYLON.Mesh.CreateSphere("", 9,
                diameter * 4 * Math.random(), scene);

            sphere.material = matBall;

            sphere.position.set(
                f * (0.5 - Math.random()),
                3 * f * (0.5 - Math.random()),
                f * (0.5 - Math.random()));

            sphere.agg = new BABYLON.PhysicsAggregate(
                sphere,
                BABYLON.PhysicsShapeType.SPHERE,
                { mass: 1, restitution: 0.5 },
                scene
            );

            // sphere.scaling.scaleInPlace(0.25);

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


        let factor = 0;
        setInterval(() => {
            factor = .5 - Math.random();
        }, 5000)


        let t = 0;
        scene.registerBeforeRender(function () {
            t += 0.01;

            matBall.emissiveColor.set(
                Math.abs(Math.sin(t)),
                Math.abs(Math.cos(t)),
                Math.abs(Math.sin(t))
            )


            const groupedmeshes = groupmeshes(scene.meshes, diameter * 5);

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

                    if (vel.length() > 2) {
                        m.agg.body.setLinearVelocity(vel.scale(0.9));
                    }
                })
                posavg.scaleInPlace(1 / meshes.length);
                velavg.normalize().scaleInPlace(1 / meshes.length);

                meshes.forEach((mesh) => {
                    imp.copyFrom(velavg);
                    posdiff = posavg.subtract(mesh.position).scale(factor); // 0.1);
                    imp.addInPlace(posdiff);
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