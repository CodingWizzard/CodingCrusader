
class City extends PluginBase {

    constructor(scene) {
        super();

        class Mesh {
            constructor() {
                this.positions = [];
                this.indices = [];
                this.idx = 0;

                let customMesh = new BABYLON.Mesh("custom", scene);
                customMesh.material = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
                customMesh.material.backFaceCulling = false;

                let vertexData = new BABYLON.VertexData();
                this.customMesh = customMesh;
                this.vertexData = vertexData;
            }

            addTriangle(p1, p2, p3) {
                this.positions.push(p1.x);
                this.positions.push(p1.y);
                this.positions.push(p1.z);

                this.positions.push(p2.x);
                this.positions.push(p2.y);
                this.positions.push(p2.z);

                this.positions.push(p3.x);
                this.positions.push(p3.y);
                this.positions.push(p3.z);

                this.indices.push(this.idx++);
                this.indices.push(this.idx++);
                this.indices.push(this.idx++);
            }


            updateMesh() {
                this.vertexData.positions = this.positions;
                this.vertexData.indices = this.indices;
                this.vertexData.applyToMesh(this.customMesh);
            }

        }

        let a1 = 0.5;
        let a2 = 2 * a1;

        class Plane extends Mesh {
            constructor(drawMiddle) {
                super();

                let points = [];

                /*
                    4           7
    
                        5   6
    
                        1   2
    
                    0           3                    
                */

                // 0
                let x = -a2;
                let y = -a2;
                let p = new BABYLON.Vector3(x, 0, y)
                points.push(p);

                // 1
                x += a1;
                y += a1;
                p = new BABYLON.Vector3(x, 0, y)
                points.push(p);

                // 2
                x += a1;
                p = new BABYLON.Vector3(x, 0, y)
                points.push(p);

                // 3
                x += a1;
                y -= a1;
                p = new BABYLON.Vector3(x, 0, y)
                points.push(p);

                // 4
                x = -a2;
                y = a1;
                p = new BABYLON.Vector3(x, 0, y)
                points.push(p);

                // 5
                x += a1;
                y -= a1;
                p = new BABYLON.Vector3(x, 0, y)
                points.push(p);

                // 6
                x += a1;
                p = new BABYLON.Vector3(x, 0, y)
                points.push(p);

                // 7
                x += a1;
                y += a1;
                p = new BABYLON.Vector3(x, 0, y)
                points.push(p);

                this.points = points;
                this.drawMiddle = drawMiddle;
            }


            update() {
                this.positions = [];
                this.indices = [];
                this.idx = 0;

                let max = this.max;
                let points = this.points;

                let a = [
                    // links 
                    [0, 1, 4],
                    [1, 4, 5],

                    //  oben
                    [4, 5, 6],
                    [4, 6, 7],

                    // rechts
                    [2, 6, 7],
                    [2, 3, 7],

                    //  unten
                    [0, 1, 2],
                    [0, 2, 3]
                    // // Mitte
                    // [1, 2, 5],
                    // [2, 5, 6],
                ];


                if (this.drawMiddle) {
                    // Mitte
                    a.push([1, 2, 5]);
                    a.push([2, 5, 6]);
                }

                a.forEach((trio) => {
                    this.addTriangle(points[trio[0]], points[trio[1]], points[trio[2]]);
                })

                this.updateMesh();
            }
        }


        // let planeTop = new Plane(true);
        // planeTop.points[1].z =
        //     planeTop.points[2].y =
        //     planeTop.points[5].y =
        //     planeTop.points[6].y = 1;
        // planeTop.update();

        let planeTop = new Plane(true);
        planeTop.customMesh.position.y = a1 * 2; // -a1 * 4;
        planeTop.update();


        let planeBack = new Plane(false);
        planeBack.customMesh.rotation.x = 0.5 * Math.PI;
        planeBack.customMesh.position.y = 0; // 3 * -a1;
        planeBack.customMesh.position.z = -2 * a1;
        planeBack.update();


        let planeFront = new Plane(false);
        planeFront.customMesh.rotation.x = 0.5 * Math.PI;
        planeFront.customMesh.position.y = 0; // 3 * -a1;
        planeFront.customMesh.position.z = 1 * a1;
        planeFront.update();



        let planeLeft = new Plane(false);
        planeLeft.customMesh.rotation.z = 0.5 * Math.PI;
        planeLeft.customMesh.position.y = a1; // -a1 * 2;
        planeLeft.customMesh.position.x = -2 * a1;
        planeLeft.update();

        let planeRight = new Plane(false);
        planeRight.customMesh.rotation.z = 0.5 * Math.PI;
        planeRight.customMesh.position.y = a1; // -a1 * 2;
        planeRight.customMesh.position.x = 1 * a1;
        planeRight.update();

        let planeBottom = new Plane(true);
        planeBottom.customMesh.position.y = -a1; // -a1 * 4;
        planeBottom.update();

        // return;

        planeTop.customMesh.isVisible = false;
        planeBack.customMesh.isVisible = false;
        planeFront.customMesh.isVisible = false;
        planeLeft.customMesh.isVisible = false;
        planeRight.customMesh.isVisible = false;
        planeBottom.customMesh.isVisible = false;


        let max = 3;
        let max2 = max * max;
        let f = 2;

        let paths = [];
        for (let x = -max; x <= max; x += 1) {

            let path = [];
            for (let y = -max; y <= max; y += 1) {
                // for (let z = -max; z <= max; z += 1) {

                // let dx = 0; //1 * 3 * Math.cos(x + y * 2 * Math.PI / max)
                // let dz = 0; //1 * 3 * Math.sin(x + y * 2 * Math.PI / max)
                path.push(new BABYLON.Vector3(x * f * 1.5, -a1, y * f * 1.5));

                if (Math.random() > 0.5) continue;

                let zl = -a1; // a1 * 1; // -a1 * 2;

                let planeBottomInst = planeBottom.customMesh.createInstance("");
                planeBottomInst.position.set(x * f, zl, y * f); // -a1 * 3);
                // planeBottomInst.position.x += dx;
                // planeBottomInst.position.z += dz;

                let maxLevels = 1 + Math.floor(5 * Math.random());

                for (let i = 0; i < maxLevels; i++) {

                    zl += a1;

                    let planeBackInst = planeBack.customMesh.createInstance("");
                    planeBackInst.position.set(x * f, zl, y * f - 2 * a1);

                    let planeFrontInst = planeFront.customMesh.createInstance("");
                    planeFrontInst.position.set(x * f, zl, y * f + 1 * a1);


                    zl += a1;
                    let planeLeftInst = planeLeft.customMesh.createInstance("");
                    planeLeftInst.position.set(x * f - a1 * 2, zl - 0 * a1, y * f); // + a1 * 2);

                    let planeRightInst = planeRight.customMesh.createInstance("");
                    planeRightInst.position.set(x * f + a1, zl - 0 * a1, y * f); // + a1 * 2);


                    // planeBackInst.position.x += dx;
                    // planeFrontInst.position.x += dx;
                    // planeLeftInst.position.x += dx;
                    // planeRightInst.position.x += dx;

                    // planeBackInst.position.z += dz;
                    // planeFrontInst.position.z += dz;
                    // planeLeftInst.position.z += dz;
                    // planeRightInst.position.z += dz;

                    zl += a1;
                    let planeTopInst = planeTop.customMesh.createInstance("");
                    planeTopInst.position.set(x * f, zl, y * f);
                }

                // let planeTopInst = planeTop.customMesh.createInstance("");
                // planeTopInst.position.set(x * f, zl, y * f);

                // planeTopInst.position.x += dx;
                // planeTopInst.position.z += dz;
            }

            paths.push(path);
        }


        let ribbon = BABYLON.Mesh.CreateRibbon("ribbon", paths, false, false, 0, scene, true, BABYLON.Mesh.DOUBLESIDE);
        ribbon.material = new BABYLON.StandardMaterial("");

        // let t = 0;
        // scene.registerBeforeRender(() => {
        //     t += 0.05;

        //     planeTop.points[1].x = -a1 - 0.5 * a1 * Math.sin(t);
        //     planeTop.points[2].x = 0.5 * a1 * Math.sin(t);
        //     planeTop.points[5].x = planeTop.points[1].x
        //     planeTop.points[6].x = planeTop.points[2].x;


        //     planeTop.points[1].y = -a1 - 0.5 * a1 * Math.cos(t);
        //     planeTop.points[2].y = planeTop.points[1].y
        //     planeTop.points[5].y = 0.5 * a1 * Math.cos(t);
        //     planeTop.points[6].y = planeTop.points[5].y
        //     planeTop.update();
        // });

    }


    activate() {
    }

    deactivate() {
        // todo: registerBeforeRender wieder freigeben
    }
}