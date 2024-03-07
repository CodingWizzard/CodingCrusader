class Mesh {
    constructor(scene) {
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


class Plane extends Mesh {
    constructor(scene, drawMiddle) {
        super(scene);

        let a1 = 0.5;
        let a2 = 2 * a1;

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
            // left 
            [0, 1, 4],
            [1, 4, 5],

            //  top
            [4, 5, 6],
            [4, 6, 7],

            // right
            [2, 6, 7],
            [2, 3, 7],

            //  bottom
            [0, 1, 2],
            [0, 2, 3]

            // // middle
            // [1, 2, 5],
            // [2, 5, 6],
        ];


        if (this.drawMiddle) {
            // middle
            a.push([1, 2, 5]);
            a.push([2, 5, 6]);
        }

        a.forEach((trio) => {
            this.addTriangle(points[trio[0]], points[trio[1]], points[trio[2]]);
        })

        this.updateMesh();
    }
}