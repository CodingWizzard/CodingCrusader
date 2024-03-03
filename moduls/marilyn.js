class Marilyn extends PluginBase {

    constructor(scene) {
        super();


        let mass = 0.1;
        let max = 40;
        let maxY = 20;

        let matBlue = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
        matBlue.emissiveColor = BABYLON.Color3.Teal();
        matBlue.backFaceCulling = false;

        let matRed = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
        matRed.emissiveColor = BABYLON.Color3.Red();
        matRed.backFaceCulling = false;


        let maxSpace = 40;
        let minSpace = -maxSpace;
        // let mGround = BABYLON.MeshBuilder.CreateBox("", { width: 2 * maxSpace + 3, height: 1, depth: 2 * maxSpace + 3 }, scene);
        // mGround.position.y = -1;
        // mGround.material = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
        // mGround.material.alpha = 0.1;
        // mGround.agg = new BABYLON.PhysicsAggregate(
        //     mGround,
        //     BABYLON.PhysicsShapeType.BOX,
        //     { mass: 0, restitution: 0.5 },
        //     scene
        // );
        // mGround.agg.body.disablePreStep = false;



        let mBody = BABYLON.MeshBuilder.CreateSphere("", { diameter: 3, segments: 9 }, scene);
        mBody.position.y = maxY;
        mBody.material = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
        mBody.material.alpha = 0.75;
        mBody.scaling.y = 10;
        mBody.scaling.scaleInPlace(0.3);
        mBody.position.scaleInPlace(0.3);
        // mBody.agg = new BABYLON.PhysicsAggregate(
        //     mBody,
        //     BABYLON.PhysicsShapeType.SPHERE,
        //     { mass: 0, restitution: 0.5 },
        //     scene
        // );
        // mBody.agg.body.disablePreStep = false;





        let createPoint = (p, mass, diameter) => {
            let mesh = BABYLON.MeshBuilder.CreateSphere("", { diameter: diameter, segments: 3 }, scene);
            mesh.position.copyFrom(p);
            mesh.isVisible = false;
            mesh.material = mass == 0 ? matRed : matBlue;
            // mesh.isVisible = mass == 0;

            mesh.agg = new BABYLON.PhysicsAggregate(
                mesh,
                BABYLON.PhysicsShapeType.SPHERE,
                { mass: mass, restitution: 0.1 },
                scene
            );
            mesh.agg.body.disablePreStep = false;

            mesh.acceleration = new BABYLON.Vector3.Zero();
            return mesh;
        }

        let connect = (p1, p2, dist) => {
            let joint = new BABYLON.DistanceConstraint(dist, scene);
            p1.mesh.agg.body.addConstraint(p2.mesh.agg.body, joint);

            // let lines = [
            //     [p1, p2]
            // ];
            // BABYLON.MeshBuilder.CreateLineSystem("normalLines", { lines: lines }, scene);
        }


        class Modul {
            constructor() {
                let facetes = [];
                let connections = [];
                let points = [];

                let factor = 4;

                let getX = (i) => {
                    return factor * Math.cos(i * 2 * Math.PI / max);
                }
                let getZ = (i) => {
                    return factor * Math.sin(i * 2 * Math.PI / max);
                }


                let paths = [];

                let ring = (y) => {

                    let path = [];
                    for (let i = 0; i < max; i++) {
                        factor = 1 + 0.75 * (maxY - y + 1);
                        let p = new BABYLON.Vector3(getX(i), y, getZ(i) + 0. * (0.5 - Math.random()));
                        p.mesh = createPoint(p, y == maxY - 1 ? 0 : mass, 0.5);
                        path.push(p)
                    }

                    let con = (path, i1, i2) => {
                        let pa = path[i1];
                        let pb = path[i2];
                        let dx = pa.x - pb.x;
                        let dz = pa.z - pb.z;
                        connect(pa, pb, Math.sqrt(dx * dx + dz * dz));
                    }

                    for (let i = 0; i < max - 1; i++) {
                        con(path, i, i + 1);
                    }
                    con(path, 0, max - 1);


                    let dt = Math.floor(max / 2);
                    for (let i = 0; i < max - dt; i += 2) {
                        con(path, i, i + dt);
                    }

                    return path;
                }


                let conUp = (i1, i2) => {
                    for (let i = 0; i < max; i++) {
                        let pa = paths[i1][i];
                        let pb = paths[i2][i];

                        let dx = pa.x - pb.x;
                        let dy = pa.y - pb.y;
                        connect(pa, pb, Math.sqrt(dx * dx + dy * dy));
                    }
                }


                for (let y = 0; y < maxY; y++) {
                    paths.push(ring(y));

                    if (y > 0) {
                        conUp(y - 1, y);
                    }
                }

                for (let i = 0; i < max - 1; i++) {
                    let pa = paths[0][i];
                    let pb = paths[maxY - 1][i + 1];

                    let dx = pa.x - pb.x;
                    let dy = pa.y - pb.y;
                    connect(pa, pb, Math.sqrt(dx * dx + dy * dy));
                }

                for (let i = 1; i < max; i++) {
                    let pa = paths[0][i];
                    let pb = paths[maxY - 1][i - 1];

                    let dx = pa.x - pb.x;
                    let dy = pa.y - pb.y;
                    connect(pa, pb, Math.sqrt(dx * dx + dy * dy));
                }

                let pa = paths[0][0];
                let pb = paths[maxY - 1][max - 1];
                let dx = pa.x - pb.x;
                let dy = pa.y - pb.y;
                connect(pa, pb, Math.sqrt(dx * dx + dy * dy));

                pa = paths[0][max - 1];
                pb = paths[maxY - 1][0];
                dx = pa.x - pb.x;
                dy = pa.y - pb.y;
                connect(pa, pb, Math.sqrt(dx * dx + dy * dy));


                for (let y = 0; y < maxY - 1; y++) {
                    for (let i = 0; i < max - 1; i++) {
                        let pa = paths[y][i];
                        let pb = paths[y + 1][i];
                        let pc = paths[y][i + 1];
                        facetes.push([pa, pb, pc]);

                        pa = paths[y + 1][i + 1];
                        facetes.push([pa, pb, pc]);
                    }

                    let pa = paths[y][0];
                    let pb = paths[y + 1][0];
                    let pc = paths[y][max - 1];
                    facetes.push([pa, pb, pc]);

                    pa = paths[y + 1][max - 1];
                    facetes.push([pa, pb, pc]);
                }

                let positions = [];
                let indices = [];
                let idx = 0;
                let addPoses = (p1, p2, p3) => {
                    positions.push(p1.x);
                    positions.push(p1.y);
                    positions.push(p1.z);

                    positions.push(p2.x);
                    positions.push(p2.y);
                    positions.push(p2.z);

                    positions.push(p3.x);
                    positions.push(p3.y);
                    positions.push(p3.z);

                    indices.push(idx++);
                    indices.push(idx++);
                    indices.push(idx++);
                }
                let customMesh = new BABYLON.Mesh("custom", scene);
                customMesh.material = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
                customMesh.material.backFaceCulling = false;
                customMesh.scaling.scaleInPlace(0.3);

                let vertexData = new BABYLON.VertexData();

                let render = () => {
                    positions = [];
                    indices = [];
                    idx = 0;

                    for (let i1 = 0; i1 < facetes.length; i1++) {
                        addPoses(
                            facetes[i1][0].mesh.position,
                            facetes[i1][1].mesh.position,
                            facetes[i1][2].mesh.position);
                    }

                    vertexData.positions = positions;
                    vertexData.indices = indices;
                    vertexData.applyToMesh(customMesh);
                };

                let time = 0;
                scene.registerBeforeRender(function () {

                    for (let i = 0; i < max; i++) {
                        let p1 = paths[maxY - 1][i];
                        let x = factor * Math.sin(-time - i * 2 * Math.PI / max);
                        let y = maxY; // - (maxY * 0.25) * Math.sin(10 * time * Math.PI / max);
                        let z = factor * Math.cos(-time - i * 2 * Math.PI / max);

                        p1.mesh.position.x = x;
                        p1.mesh.position.y = y;
                        p1.mesh.position.z = z;
                    }
                    time += 0.02;

                    render();
                });

            }
        }


        new Modul();


    }


    activate() {

    }

    deactivate() {
    }
}