class Text3D {
    constructor(scene, fontData, material) {
        this.fontData = fontData;
        this.material = material;

        this.numbers = [];
        for (let i = 0; i <= 9; i++) {
            this.numbers[i] = BABYLON.MeshBuilder.CreateText("mesh", i.toString(), this.fontData, { size: 8, resolution: 64, depth: 1 });
            this.numbers[i].position.x = i;
            this.numbers[i].position.y = 5;
            this.numbers[i].isVisible = false;
            this.numbers[i].scaling.scaleInPlace(0.05);
            this.numbers[i].material = material;
        }
    }

    createText(text, scaleFactor, pos) {
        let mesh = BABYLON.MeshBuilder.CreateText("mesh", text, this.fontData, { size: 8, resolution: 64, depth: 1 });
        mesh.scaling.scaleInPlace(scaleFactor);
        mesh.position.copyFrom(pos);
        mesh.material = this.material;
        return mesh;
    }


    createNumber(value, pos) {
        const numberString = value.toString();

        let instanceId = 0;
        for (let i = 0; i < numberString.length; i++) {
            const number = parseInt(numberString[i], 10);
            let mesh = this.numbers[number].createInstance(instanceId++);
            mesh.position.copyFrom(pos);
            mesh.position.x += i * 0.25;
        }
    }
}