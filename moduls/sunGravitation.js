class SunGravitation extends PluginBase {

    constructor(scene) {
        super();


        let attachDragBehavior = (mesh) => {
            let pointerDragBehavior = new BABYLON.PointerDragBehavior({});
            // Use drag plane in world space
            pointerDragBehavior.useObjectOrientationForDragging = false;
            mesh.addBehavior(pointerDragBehavior);
        }

        function createMesh(x, y, z, size, mass) {
            let mesh = BABYLON.MeshBuilder.CreateSphere("ballon", { diameter: size, segments: 12 }, scene);
            mesh.position.set(x, y, z);

            mesh.material = new BABYLON.StandardMaterial("", scene);
            mesh.material.alpha = 0.7;
            mesh.material.emissiveColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());

            mesh.physicsImpostor = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.SphereImpostor, { mass: mass, friction: 2, restitution: 0 }, scene);
            attachDragBehavior(mesh);
            return mesh;
        }


        let max = 100;
        let m0 = createMesh(0, 5, 0, 5, 0);

        let mList = []
        for (let i1 = 0; i1 < 30; i1++) {
            for (let i2 = 0; i2 < max; i2++) {
                let x = m0.position.x + i1 * 10 - i1 * 20 * Math.random();
                let y = m0.position.y + i1 * 10 - i1 * 20 * Math.random();
                let z = m0.position.z + i1 * 10 - i1 * 20 * Math.random();

                let m1 = createMesh(x, y, z, 1, 1);
                mList.push(m1)
            }
        }


        let positions = m0.getVerticesData(BABYLON.VertexBuffer.PositionKind);

        scene.registerBeforeRender(function () {
            let i = Math.floor(Math.random() * positions.length);
            var startPoint = new BABYLON.Vector3(
                m0.position.x + positions[i],
                m0.position.y + positions[i + 1],
                m0.position.z + positions[i + 2]
            );
            var endPoint = new BABYLON.Vector3(m0.position.x, m0.position.y, m0.position.z);

            let v = endPoint.subtract(startPoint);
            mList.forEach(m1 => {
                let v = endPoint.subtract(m1.position).normalize().scale(1)
                m1.physicsImpostor.applyImpulse(v, m1.position)  // applyForce
            })

        });


    }


    activate() {

    }

    deactivate() {
    }
}