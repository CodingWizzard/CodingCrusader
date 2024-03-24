class CAD {
    constructor(scene) {
        // let p1 = new BABYLON.Vector3(1, 0, -1);
        // let p2 = new BABYLON.Vector3(-0.5, 0, -0.5);
        // let p3 = new BABYLON.Vector3(0.5, 0, -0.5);

        // let sphere = BABYLON.MeshBuilder.CreateSphere("", { diameter: 0.1 }, scene);
        // sphere.position.copyFrom(p1);

        // sphere = BABYLON.MeshBuilder.CreateSphere("", { diameter: 0.1 }, scene);
        // sphere.position.copyFrom(p2);

        // sphere = BABYLON.MeshBuilder.CreateSphere("", { diameter: 0.1 }, scene);
        // sphere.position.copyFrom(p3);

        // let linesystem = BABYLON.MeshBuilder.CreateLineSystem("", {
        //     lines: [[p1, p2], [p1, p3], [p2, p3]]}, scene);


        this.instanceId = 0;
        this.meshBase = BABYLON.MeshBuilder.CreateSphere("", { diameter: 0.05 });
        this.meshBase.isVisible = false;


        let positions = [];
        let indices = [];
        let idx = 0;
        let addTriangle = (p1, p2, p3) => {

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

        let createMesh = () => {
            let customMesh = new BABYLON.Mesh("custom", scene);
            customMesh.material = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
            customMesh.material.backFaceCulling = false;

            let vertexData = new BABYLON.VertexData();
            vertexData.positions = positions;
            vertexData.indices = indices;
            vertexData.applyToMesh(customMesh);

            return customMesh;
        }

        // class Line {
        //     constructor(p1, p2, color) {
        //         this.p1 = p1;
        //         this.p2 = p2;

        //         // let points = [p1, p2];
        //         // let lineSystem = BABYLON.MeshBuilder.CreateLines("", { points: points }, scene);
        //         // lineSystem.color = color === undefined ? BABYLON.Color3.Red() : color;
        //     }
        // }


        let createFacet = (a1, a2, b1, b2) => {
            addTriangle(a1, a2, b1);
            addTriangle(a2, b1, b2);
        }





        let points = [];

        // let p1 = new BABYLON.Vector3(1, 0, -1);
        // let p2 = new BABYLON.Vector3(-0.5, 0, -0.5);
        // let p3 = new BABYLON.Vector3(0.5, 0, -0.5);

        let max = 27;
        for (let i = 0; i < max; i++) {
            let x = Math.sin(i * 2 * Math.PI / max);
            let y = Math.cos(i * 2 * Math.PI / max);
            let z = 0;

            points.push(new BABYLON.Vector3(x, y, z))
        }

        this.render(points);

        let pointsEdgeSlide = this.edgeSlide(points, 0.5);
        this.render(pointsEdgeSlide);

        let pointsExtrude = this.extrude(pointsEdgeSlide, 1);
        this.render(pointsExtrude);


        let createFacetsFromPoints = (pointsA, pointsB) => {
            if (pointsA.length != pointsB.length)
                return;

            let max = pointsA.length;
            for (let i = 0; i < max - 1; i++) {
                createFacet(pointsA[i], pointsA[i + 1], pointsB[i], pointsB[i + 1])
            }
            createFacet(pointsA[0], pointsA[max - 1], pointsB[0], pointsB[max - 1])

        }

        createFacetsFromPoints(points, pointsEdgeSlide);
        createFacetsFromPoints(pointsEdgeSlide, pointsExtrude);


        let mesh = createMesh();

        // publish
        this.scene = scene;
    }




    getMiddlePoint(points) {
        let pm = new BABYLON.Vector3.Zero();
        for (let i = 0; i < points.length; i++) {
            pm.x += points[i].x;
            pm.y += points[i].y;
            pm.z += points[i].z;
        }

        pm.x /= points.length;
        pm.y /= points.length;
        pm.z /= points.length;

        return pm;
    }

    extrude(points, f) {
        let dir = new BABYLON.Vector3(0, 0, 1);
        let pointsNew = [];
        for (let i = 0; i < points.length; i++) {
            let p = new BABYLON.Vector3.Zero();
            p.copyFrom(points[i]);

            p.addInPlace(dir.scale(f));
            pointsNew.push(p);
        }

        return pointsNew;
    }

    edgeSlide(points, f) {
        let pm = this.getMiddlePoint(points);
        let pointsNew = [];
        for (let i = 0; i < points.length; i++) {
            let p = new BABYLON.Vector3.Zero();
            p.copyFrom(points[i]);
            let dir = p.subtract(pm).normalize();
            p.addInPlace(dir.scale(f));
            pointsNew.push(p);
        }

        return pointsNew;
    }


    render(points) {
        let scene = this.scene;
        let instanceId = this.instanceId;
        let meshBase = this.meshBase;

        for (let i = 0; i < points.length; i++) {
            // let sphere = BABYLON.MeshBuilder.CreateSphere("", { diameter: 0.1 }, scene);
            const sphere = this.meshBase.createInstance(instanceId++);
            sphere.position.copyFrom(points[i]);
        }



        // let line1 = new Line(lines[0].p1, lines[len - 1].p1);
        // let line2 = new Line(lines[0].p2, lines[len - 1].p2);
        // createFacet(line1, line2);



        // let linesystem = BABYLON.MeshBuilder.CreateLineSystem("", {
        //     lines: [[p1, p2], [p1, p3], [p2, p3]]}, scene);
    }
}
