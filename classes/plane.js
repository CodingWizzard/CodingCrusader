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

        let points = [];

        // 3           0
        //     1   2  
        //     6   5
        // 7           4

        // this.OUT_TOP_LEFT = 3;
        // this.OUT_TOP_RIGHT = 0;
        // this.OUT_BOTTOM_LEFT = 7;
        // this.OUT_BOTTOM_RIGHT = 4;
        // this.IN_TOP_LEFT = 1;
        // this.IN_TOP_RIGHT = 2;
        // this.IN_BOTTOM_LEFT = 6;
        // this.IN_BOTTOM_RIGHT = 5;


        // 0        
        let p = new BABYLON.Vector3(1, 0, -1)
        points.push(p);

        // 1
        p = new BABYLON.Vector3(-0.5, 0, -0.5)
        points.push(p);

        // 2
        p = new BABYLON.Vector3(0.5, 0, -0.5)
        points.push(p);

        // 3
        p = new BABYLON.Vector3(-1, 0, -1)
        points.push(p);

        // 4        
        p = new BABYLON.Vector3(1, 0, 1)
        points.push(p);

        // 5        
        p = new BABYLON.Vector3(0.5, 0, 0.5)
        points.push(p);

        // 6        
        p = new BABYLON.Vector3(-0.5, 0, 0.5)
        points.push(p);

        // 7
        p = new BABYLON.Vector3(-1, 0, 1)
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


        // 3           0
        //     1   2  
        //     6   5
        // 7           4

        let a = [
            // left 
            [3, 1, 7],
            [1, 6, 7],

            //  top
            [0, 1, 3],
            [0, 1, 2],

            // right
            [0, 2, 4],
            [2, 4, 5],

            //  bottom
            [5, 6, 7],
            [4, 5, 7]

            // middle
            // 
        ];


        if (this.drawMiddle) {
            // middle
            a.push([1, 2, 6]);
            a.push([2, 5, 6]);
        }

        a.forEach((trio) => {
            this.addTriangle(points[trio[0]], points[trio[1]], points[trio[2]]);
        })

        this.updateMesh();
    }
}