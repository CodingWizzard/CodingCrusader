class Tube extends PluginBase {

    constructor(scene) {
        super();

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

        class Line {
            constructor(p1, p2, color) {
                this.p1 = p1;
                this.p2 = p2;

                // let points = [p1, p2];
                // let lineSystem = BABYLON.MeshBuilder.CreateLines("", { points: points }, scene);
                // lineSystem.color = color === undefined ? BABYLON.Color3.Red() : color;
            }
        }


        let createFacet = (line1, line2) => {
            addTriangle(line1.p1, line1.p2, line2.p1);
            addTriangle(line1.p2, line2.p1, line2.p2);
        }

        let p0 = new BABYLON.Vector3.Zero();
        let t = new BABYLON.Vector3.Zero();
        let drawTube = (max, offset, radiusInner, radiusOuter, pos, tangent, normal, binormal) => {
            let lines = [];

            for (let i = 0; i < max; i++) {
                let x1 = radiusInner * Math.sin(offset + i * 2 * Math.PI / max);
                let y1 = radiusInner * Math.cos(offset + i * 2 * Math.PI / max);
                let z1 = 0;

                let x2 = radiusOuter * Math.sin(offset + i * 2 * Math.PI / max);
                let y2 = radiusOuter * Math.cos(offset + i * 2 * Math.PI / max);
                let z2 = 0;

                let p1 = new BABYLON.Vector3(x1, y1, z1);
                let p2 = new BABYLON.Vector3(x2, y2, z2);

                // Rotation
                p0 = BABYLON.Vector3.Zero();
                p0.addInPlace(normal.scale(p1.x))
                p0.addInPlace(binormal.scale(p1.y))
                p0.addInPlace(tangent.scale(p1.z))
                p1.copyFrom(p0);

                p0 = BABYLON.Vector3.Zero();
                p0.addInPlace(normal.scale(p2.x))
                p0.addInPlace(binormal.scale(p2.y))
                p0.addInPlace(tangent.scale(p2.z))
                p2.copyFrom(p0);


                // Position
                p1.addInPlace(pos);
                p2.addInPlace(pos);

                let line1 = new Line(p1, p2);
                lines.push(line1);
            }

            let len = lines.length;
            for (let i = 0; i < len - 1; i++) {
                let line1 = new Line(lines[i].p1, lines[i + 1].p1);
                let line2 = new Line(lines[i].p2, lines[i + 1].p2);
                createFacet(line1, line2);
            }
            let line1 = new Line(lines[0].p1, lines[len - 1].p1);
            let line2 = new Line(lines[0].p2, lines[len - 1].p2);
            createFacet(line1, line2);

            return lines;
        }

        let max = 7 * 3;
        var points = [];
        for (var i = 0; i < max; i++) {
            let x = 5 * 10 * Math.sin(i * 1 * Math.PI / max);
            let z = 5 * 10 * Math.cos(i * 1 * Math.PI / max);
            let y = i * 0.5 * 0;

            let p = new BABYLON.Vector3(x, y, z);
            points.push(p);
        }
        // let x = 5 * 10 * Math.sin(0 * 2 * Math.PI / max);
        // let z = 5 * 10 * Math.cos(0 * 2 * Math.PI / max);
        // let y = i * 0.5 * 0;
        // let p = new BABYLON.Vector3(x, y, z);
        // points.push(p);


        var path3d = new BABYLON.Path3D(points);
        var tangents = path3d.getTangents();
        var normals = path3d.getNormals();
        var binormals = path3d.getBinormals();
        var curve = path3d.getCurve();

        // var li = BABYLON.MeshBuilder.CreateLines('li', { points: curve, updatable: true }, scene);
        // var tg = [];
        // var no = [];
        // var bi = [];
        // for (var p = 0; p < curve.length; p++) {
        //     tg[p] = BABYLON.MeshBuilder.CreateLines('tg', { points: [curve[p], curve[p].add(tangents[p])], updatable: true }, scene);
        //     tg[p].color = BABYLON.Color3.Red();
        //     no[p] = BABYLON.MeshBuilder.CreateLines('no', { points: [curve[p], curve[p].add(normals[p])], updatable: true }, scene);
        //     no[p].color = BABYLON.Color3.Blue();
        //     bi[p] = BABYLON.MeshBuilder.CreateLines('bi', { points: [curve[p], curve[p].add(binormals[p])], updatable: true }, scene);
        //     bi[p].color = BABYLON.Color3.Green();
        // }

        let lines = [];
        for (let i = 0; i < points.length; i++) {
            let p = points[i];
            lines.push(drawTube(12, Math.PI * 0.5 * 0, 2, 3, p, tangents[i], normals[i], binormals[i]));
        }


        let len = lines.length;
        for (let i1 = 0; i1 < len - 1; i1++) {
            for (let i2 = 0; i2 < lines[i1].length - 1; i2++) {
                let line1 = new Line(lines[i1][i2].p1, lines[i1 + 1][i2 + 1].p1);
                let line2 = new Line(lines[i1][i2].p2, lines[i1 + 1][i2 + 1].p2);
                createFacet(line1, line2);
            }
        }
        /**/

        let mesh = createMesh();
        // mesh.position.z -= 20;
        // mesh.position.x += 8;
        // mesh.position.y += 2;

        this.mesh = mesh;
    }

    update() {
        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.01;
        this.mesh.rotation.z += 0.01;
    }

    activate() {

    }

    deactivate() {
    }
}