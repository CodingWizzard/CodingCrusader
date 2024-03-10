class Chart3D {

    constructor(scene, material, text3D, data) {
        this.scene = scene;
        this.material = material;
        this.text3D = text3D;
        this.update(data);
    }

    update(dataAll) {
        let data = dataAll.data;
        let scene = this.scene;
        let text3D = this.text3D;


        let material = this.material;
        if (material === null) {
            material = new BABYLON.StandardMaterial("mat", scene);
            material.emissiveColor = BABYLON.Color3.Black();
        }

        // let materialLabel = new BABYLON.StandardMaterial("mat", scene);
        // materialLabel.emissiveColor = BABYLON.Color3.White();


        const size = 1;
        let meshes = [];


        let createLabel = (xOffset, yOffset, zOffset, fontSize, text, rotate) => {
            let label = text3D.createText(text, 0.05, new BABYLON.Vector3(xOffset, yOffset + 0.1, zOffset));
            if (rotate)
                label.rotation.x = 0.5 * Math.PI;
        }


        let createNumber = (xOffset, yOffset, zOffset, fontSize, text, rotate) => {
            let label = text3D.createNumber(text, new BABYLON.Vector3(xOffset, yOffset + 0.1, zOffset));
            // if (rotate)
            //     label.rotation.x = 0.5 * Math.PI;
        }


        function mapRange(value, fromMin, fromMax, toMin, toMax) {
            const fromRange = fromMax - fromMin;
            const toRange = toMax - toMin;
            const scaledValue = (value - fromMin) / fromRange;
            return toMin + scaledValue * toRange;
        }

        function findMinMax(data) {
            if (data.length === 0) {
                return { min: null, max: null };
            }

            let min = data[0].value;
            let max = data[0].value;

            for (let i = 1; i < data.length; i++) {
                if (data[i].value < min) {
                    min = data[i].value;
                }
                if (data[i].value > max) {
                    max = data[i].value;
                }
            }

            return { min: min, max: max };
        }

        function sumValues(data) {
            let sum = 0;

            for (let i = 0; i < data.length; i++) {
                sum += data[i].value;
            }

            return sum;
        }

        let minMaxValues = findMinMax(data);
        let sum = Math.floor(sumValues(data));  // buggy
        sum = 314; // test
        createNumber(-2, 0.1, -1, 8, sum.toString(), true);


        let colorEdge = new BABYLON.Color4(0, 0, 1, 1);
        let xValues = [];
        let zValues = [];

        let getIndex = (values, value) => {
            const index = values.indexOf(value);
            if (index !== -1) {
                return index;
            } else {
                values.push(value);
                return values.length - 1;
            }
        }

        data.forEach((d, index) => {
            let xOffset = getIndex(xValues, d.xAxis);
            let zOffset = (d.xAxis === d.zAxis) ? 0 : getIndex(zValues, d.zAxis);

            let boxHeight = mapRange(d.value, minMaxValues.min, minMaxValues.max, 1, 30);

            let heightFactor = 0.1;
            const mesh = BABYLON.MeshBuilder.CreateBox("", {
                width: size * 0.8,
                height: boxHeight * heightFactor,
                depth: size * 0.8
            });
            mesh.position.x = xOffset;
            mesh.position.z = zOffset;
            mesh.position.y = boxHeight * 0.5 * heightFactor;

            mesh.material = material;
            mesh.enableEdgesRendering();
            mesh.edgesWidth = 1.0;
            mesh.edgesColor = colorEdge;

            mesh.receiveShadows = true;

            meshes.push(mesh);

            createNumber(xOffset, boxHeight * heightFactor + 0.01, zOffset, 8, d.value.toFixed(0), false);
        })



        xValues.forEach((value, index) => {
            createLabel(index, 0.1, -1, 8, value, true);
        });

        zValues.forEach((value, index) => {
            createLabel(-1, 0.1, index, 8, value, true);
        })

        this.meshes = meshes;   // public
    }

    clear() {
        this.meshes.forEach((mesh) => mesh.dispose())
        this.meshes = [];
    }
}
