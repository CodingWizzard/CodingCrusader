class Chart3D {

    constructor(scene, data) {
        this.scene = scene;
        this.update(data);
    }

    update(dataAll) {
        let data = dataAll.data;
        let scene = this.scene;

        const material = new BABYLON.StandardMaterial("mat", scene);
        material.emissiveColor = BABYLON.Color3.Gray(); // Green();
        // material.wireframe = true;

        const size = 1;
        // const height = 0.1;
        let meshes = [];


        let createLabel = (xOffset, yOffset, zOffset, fontSize, text) => {
            const align_h = "center";
            const align_v = "center";
            // let fontSize = 12;

            const meshLabel = BABYLON.MeshBuilder.CreatePlane("", { height: 0.8 * size, width: 0.8 * size, sideOrientation: BABYLON.Mesh.DOUBLESIDE });
            meshLabel.position.x = xOffset;
            meshLabel.position.z = zOffset;
            meshLabel.position.y = yOffset;
            meshLabel.rotation.x = 0.5 * Math.PI;
            meshLabel.material = create_MultiLineText_Material(scene, meshLabel, text, align_h, align_v, fontSize);
            meshes.push(meshLabel);

            return meshLabel;
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
        let sum = sumValues(data);
        createLabel(-1, 0.1, -1, 14, sum.toFixed(0));

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
            meshes.push(mesh);

            createLabel(xOffset, boxHeight * heightFactor + 0.01, zOffset, 14, d.value.toFixed(0));
        })



        xValues.forEach((value, index) => {
            createLabel(index, 0.1, -1, 10, value);
        });

        zValues.forEach((value, index) => {
            createLabel(-1, 0.1, index, 10, value);
        })

        this.meshes = meshes;   // public
    }

    clear() {
        this.meshes.forEach((mesh) => mesh.dispose())
        this.meshes = [];
    }
}
