class Balloons extends PluginBase {

    constructor(scene) {
        super();


        class Liner {
            constructor(scene, box1, box2) {
                this.scene = scene;
                this.box1 = box1;
                this.box2 = box2;
                this.bankLine = null;
            }

            update() {
                if (this.bankLine)
                    this.bankLine.dispose();


                let max = 1;
                let dx = (this.box2.position.x - this.box1.position.x) / max;
                let dy = (this.box2.position.y - this.box1.position.y) / max;
                let dz = (this.box2.position.z - this.box1.position.z) / max;
                let bankPath = [];
                for (let i = 0; i <= max; i++) {
                    bankPath.push(new BABYLON.Vector3(this.box1.position.x + i * dx, this.box1.position.y + i * dy, this.box1.position.z + i * dz));
                }

                this.bankLine = BABYLON.MeshBuilder.CreateLines('', { points: bankPath }, this.scene);
            }
        }


        let attachDragBehavior = (mesh) => {
            let pointerDragBehavior = new BABYLON.PointerDragBehavior({});
            pointerDragBehavior.useObjectOrientationForDragging = false;
            mesh.addBehavior(pointerDragBehavior);
        }

        function createMesh(x, y, z, size, mass) {
            let mesh = BABYLON.MeshBuilder.CreateSphere("ballon", { diameter: size * 2, segments: 12 }, scene);
            mesh.position.set(x, y, z);

            mesh.material = new BABYLON.StandardMaterial("", scene);
            mesh.material.alpha = 0.7;
            mesh.material.emissiveColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());

            mesh.physicsImpostor = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.SphereImpostor, { mass: mass, friction: 2, restitution: 0 }, scene);
            attachDragBehavior(mesh);
            return mesh;
        }


        let max = 30;

        function connectMesh(mesh1, mesh2, dist, joint) {
            mesh1.physicsImpostor.addJoint(mesh2.physicsImpostor, joint);
            let oLiner = new Liner(scene, mesh1, mesh2);
            oLiners.push(oLiner);
        }


        let m0 = createMesh(0, 0, 0, .3, 0);

        let meshesOut = [];
        let oLiners = [];

        for (let i = 0; i < max; i++) {
            let x = Math.sin(Math.PI * 2 * i / max);
            let y = 4;
            let z = Math.cos(Math.PI * 2 * i / max);

            let m1 = createMesh(x * 3, y, 0 + z * 3, 1, 1);
            meshesOut.push(m1);
        }

        for (let i = 0; i < max; i++) {
            let joint0 = new BABYLON.DistanceJoint({ maxDistance: 6 + 4 * Math.random() });
            connectMesh(m0, meshesOut[i], 3 * Math.PI / max, joint0)
        }


        scene.registerBeforeRender(function () {
            for (let i = 0; i < oLiners.length; i++) {
                oLiners[i].update();
            }
        });

    }


    activate() {

    }

    deactivate() {
    }
}