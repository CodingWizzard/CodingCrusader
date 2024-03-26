class Hemisphere extends PluginBase {

    constructor(scene) {
        super();

        let diameter = 10;
        this.diameter = diameter;

        let mat = new BABYLON.StandardMaterial("mat", scene);
        mat.alpha = 0.8;

        var gl = new BABYLON.GlowLayer("glow", scene);
        gl.intensity = 0.2;

        let sky = new BABYLON.HemisphericLight("sky", new BABYLON.Vector3(0, 1.0, 0), scene);
        sky.intensity = 0.5;

        let sphere = BABYLON.MeshBuilder.CreateSphere("", { diameter: diameter, sideOrientation: BABYLON.Mesh.DOUBLESIDE });
        sphere.material = mat;

        // publish
        this.scene = scene;
        this.sphere = sphere;
        this.mat = mat;
    }

    deinstall() {
        this.sphere.dispose();
        this.mat.dispose();
    }
}