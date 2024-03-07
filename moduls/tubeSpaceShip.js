class TubeSpaceShip extends PluginBase {

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


        // let createFacet = (line1, line2) => {
        //     addTriangle(line1.p1, line1.p2, line2.p1);
        //     addTriangle(line1.p2, line2.p1, line2.p2);
        // }

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
                p0.set(0, 0, 0); // = BABYLON.Vector3.Zero();
                p0.addInPlace(normal.scale(p1.x))
                p0.addInPlace(binormal.scale(p1.y))
                p0.addInPlace(tangent.scale(p1.z))
                p1.copyFrom(p0);

                p0.set(0, 0, 0); //  = BABYLON.Vector3.Zero();
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

            // let len = lines.length;
            // for (let i = 0; i < len - 1; i++) {
            //     // let line1 = new Line(lines[i].p1, lines[i + 1].p1);
            //     // let line2 = new Line(lines[i].p2, lines[i + 1].p2);
            //     // createFacet(line1, line2);
            // }
            // let line1 = new Line(lines[0].p1, lines[len - 1].p1);
            // let line2 = new Line(lines[0].p2, lines[len - 1].p2);
            ////createFacet(line1, line2);

            return lines;
        }

        let max = 7;
        var points = [];
        for (let i = -max; i <= max; i++) {
            let x = 0 * 2 * 30 * Math.sin(Math.PI + i * 1 * Math.PI / max);
            let z = i * 40 * 2; // 2 * 30 * Math.cos(Math.PI + i * 0.5 * Math.PI / max);
            let y = i * 0.5 * 0;

            let p = new BABYLON.Vector3(x, y, z);
            points.push(p);
        }

        // let i = 0;
        // let x = 30 * Math.sin(Math.PI + i * 0.5 * Math.PI / max);
        // let z = 30 * Math.cos(Math.PI + i * 0.5 * Math.PI / max);
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
        let lenPoints = points.length;
        for (let i = 0; i < lenPoints; i++) {
            let p = points[i];
            let r1 = 50; // + Math.abs(5 * Math.sin(i * 0.5 * Math.PI / lenPoints));
            let r2 = 50 + Math.abs(10 * Math.sin(i * 2 * Math.PI / lenPoints));
            lines.push(drawTube(24, 0, r1, r2, p, tangents[i], normals[i], binormals[i]));
        }


        let len = lines.length;
        for (let i1 = 0; i1 < len - 1; i1++) {
            for (let i2 = 0; i2 < lines[i1].length - 1; i2++) {
                // let line1 = new Line(lines[i1][i2].p1, lines[i1 + 1][i2 + 1].p1);
                // let line2 = new Line(lines[i1][i2].p2, lines[i1 + 1][i2 + 1].p2);
                // createFacet(line1, line2);

                let line1 = new Line(lines[i1][i2].p1, lines[i1 + 1][i2].p2);
                let line2 = new Line(lines[i1][i2].p1, lines[i1 + 1][i2].p1);
                // createFacet(line1, line2);

                // if (Math.random() > 0.3) {
                if (!false) {
                    addTriangle(lines[i1][i2].p2, lines[i1][i2 + 1].p2, lines[i1 + 1][i2].p2);
                    addTriangle(lines[i1][i2 + 1].p2, lines[i1 + 1][i2].p2, lines[i1 + 1][i2 + 1].p2);

                    addTriangle(lines[i1][i2].p1, lines[i1][i2 + 1].p1, lines[i1 + 1][i2].p1);
                    addTriangle(lines[i1][i2 + 1].p1, lines[i1 + 1][i2].p1, lines[i1 + 1][i2 + 1].p1);
                }

                //  line1 = new Line(lines[i1][i2].p1, lines[i1 + 0][i2 + 1].p1);
                //  line2 = new Line(lines[i1][i2].p2, lines[i1 + 1][i2 + 0].p2);
                // createFacet(line1, line2);


                // if (Math.random() > 0.5) {
                //     const offset = new BABYLON.Vector3(0, 0, 25);
                //     let plane = new Plane(scene, true);
                //     // for (let i = 0; i < 8; i++) {
                //     //     plane.points[i].x += 2 * lines[i1][i2].p1.x;
                //     //     plane.points[i].y += 2 * lines[i1][i2].p1.y;
                //     //     plane.points[i].z += 2 * lines[i1][i2].p1.z;
                //     // }
                //     plane.points[4] = lines[i1][i2].p1;
                //     plane.points[0] = lines[i1][i2].p2;
                //     plane.points[3] = lines[i1][i2 + 1].p1;
                //     plane.points[7] = lines[i1][i2 + 1].p2;

                //     // plane.points[5] = plane.points[4].scale(0.5);
                //     // plane.points[1] = plane.points[0].scale(0.5);
                //     // plane.points[2] = plane.points[3].scale(0.5);
                //     // plane.points[6] = plane.points[7].scale(0.5);

                //     plane.points[5] = plane.points[4].add(offset.scale(Math.random())); // .scale(0.5);
                //     plane.points[1] = plane.points[0].add(offset.scale(Math.random())); // .scale(0.5);
                //     plane.points[2] = plane.points[3].add(offset.scale(Math.random())); // .scale(0.5);
                //     plane.points[6] = plane.points[7].add(offset.scale(Math.random())); // .scale(0.5);

                //     plane.points[5].x += 2 * (0.5 - Math.random());
                //     plane.points[1].x += 2 * (0.5 - Math.random());
                //     plane.points[2].x += 2 * (0.5 - Math.random());
                //     plane.points[6].x += 2 * (0.5 - Math.random());

                //     plane.points[5].y += 2 * (0.5 - Math.random());
                //     plane.points[1].y += 2 * (0.5 - Math.random());
                //     plane.points[2].y += 2 * (0.5 - Math.random());
                //     plane.points[6].y += 2 * (0.5 - Math.random());

                //     plane.update();
                // }

            }

            let i2 = lines[i1].length - 1;

            // let s = BABYLON.MeshBuilder.CreateSphere("", { diameter: 1, sideOrientation: BABYLON.Mesh.DOUBLESIDE });
            // s.position.copyFrom(lines[i1][i2].p2);

            if (!false) {
                addTriangle(lines[i1][i2].p2, lines[i1][0].p2, lines[i1 + 1][i2].p2);
                addTriangle(lines[i1][0].p2, lines[i1 + 1][i2].p2, lines[i1 + 1][0].p2);

                addTriangle(lines[i1][i2].p1, lines[i1][0].p1, lines[i1 + 1][i2].p1);
                addTriangle(lines[i1][0].p1, lines[i1 + 1][i2].p1, lines[i1 + 1][0].p1);
            }


            // let plane = new Plane(scene, true);
            // // for (let i = 0; i < 8; i++) {
            // //     plane.points[i].x += 2 * lines[i1][i2].p1.x;
            // //     plane.points[i].y += 2 * lines[i1][i2].p1.y;
            // //     plane.points[i].z += 2 * lines[i1][i2].p1.z;
            // // }
            // plane.points[1].x += lines[i1][i2].p1.x;
            // plane.points[2].x += lines[i1][i2].p2.x;
            // plane.points[5].x += lines[i1 + 1][i2].p1.x;
            // plane.points[6].x += lines[i1 + 1][i2].p2.x;

            // plane.points[1].y += lines[i1][i2].p1.y;
            // plane.points[2].y += lines[i1][i2].p2.y;
            // plane.points[5].y += lines[i1 + 1][i2].p1.y;
            // plane.points[6].y += lines[i1 + 1][i2].p2.y;

            // plane.points[1].z += lines[i1][i2].p1.z;
            // plane.points[2].z += lines[i1][i2].p2.z;
            // plane.points[5].z += lines[i1 + 1][i2].p1.z;
            // plane.points[6].z += lines[i1 + 1][i2].p2.z;
            // plane.update();

        }

        // let i1 = 0;
        // let i2 = 0;
        // let line1 = new Line(lines[i1][i2].p1, lines[i1 + 1][i2].p1);
        // let line2 = new Line(lines[i1][i2].p1, lines[i1 + 1][i2].p2);

        // let s1 = BABYLON.MeshBuilder.CreateSphere("", { diameter: 1, sideOrientation: BABYLON.Mesh.DOUBLESIDE });
        // s1.position.copyFrom(lines[i1][i2].p2);

        // let s2 = BABYLON.MeshBuilder.CreateSphere("", { diameter: 1, sideOrientation: BABYLON.Mesh.DOUBLESIDE });
        // s2.position.copyFrom(lines[i1][i2 + 1].p2);

        // let s3 = BABYLON.MeshBuilder.CreateSphere("", { diameter: 1, sideOrientation: BABYLON.Mesh.DOUBLESIDE });
        // s3.position.copyFrom(lines[i1 + 1][i2].p2);

        // let s4 = BABYLON.MeshBuilder.CreateSphere("", { diameter: 1, sideOrientation: BABYLON.Mesh.DOUBLESIDE });
        // s4.position.copyFrom(lines[i1 + 1][i2 + 1].p2);

        // // createFacet(line1, line2);

        // addTriangle(lines[i1][i2].p2, lines[i1][i2 + 1].p2, lines[i1 + 1][i2].p2);

        // addTriangle(lines[i1][i2 + 1].p2, lines[i1 + 1][i2].p2, lines[i1 + 1][i2 + 1].p2);
        // // addTriangle(lines[i1][i2].p2, lines[i1 + 1][i2].p2, lines[i1 + 1][i2 + 1].p2);


        /**/

        let mesh = createMesh();
        // mesh.position.z -= 20;
        // mesh.position.x += 8;
        // mesh.position.y += 2;


        let materialUrl = "media/tubeSpaceShip/tubeSpaceShipMaterial.png";
        let normalUrl = "media/tubeSpaceShip/tubeSpaceShipNormal.png";

        // let materialUrl = "media/tubeSpaceShip/wall.png";
        // let normalUrl = "media/tubeSpaceShip/wallNormal.png";

        // let materialUrl = "http://i.imgur.com/Rkh1uFK.png";
        // let normalUrl = "http://i.imgur.com/GtIUsWW.png";


        let materialTexture = new BABYLON.Texture(materialUrl, scene);
        let normalTexture = new BABYLON.Texture(normalUrl, scene);

        let material = new BABYLON.StandardMaterial("", scene);
        material.diffuseTexture = materialTexture;
        material.bumpTexture = normalTexture;
        material.useParallax = true;
        material.useParallaxOcclusion = true;
        material.parallaxScaleBias = 0.5;
        material.specularPower = 10; // 1000.0;
        // material.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        //material.backFaceCulling = false;

        // mesh.material = material;
        mesh.isVisible = false;


        // https://playground.babylonjs.com/#165IV6#74

        // let radius = 80;
        // let radiusFunction = function (i, distance) {
        //     return radius + 2 * Math.sin(i / 2 + k);
        // };

        // let updateFixedRadius = function (radius, k) {
        //     return (radius + 2 * Math.sin(k));
        // };


        // let k = 12;
        // let rad = updateFixedRadius(radius, k);
        // let tube = mesh = BABYLON.Mesh.CreateTube(null, points, rad, null, radiusFunction, null, null, null, null); // , mesh);
        // tube.material = material;

        let tube = BABYLON.MeshBuilder.CreateTube("tube", { path: points, radius: 80, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene);
        tube.material = material;

        // let sphere = BABYLON.MeshBuilder.CreateSphere("", { diameter: 80 }, scene);
        // sphere.position.z = 300;
        // sphere.material = material;



        this.mesh = mesh;

    }

    update() {
        // this.mesh.rotation.x += 0.01;
        // this.mesh.rotation.y += 0.01;
        // this.mesh.rotation.z += 0.01;
    }

    activate() {

    }

    deactivate() {
    }
}