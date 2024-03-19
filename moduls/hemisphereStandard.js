class Hemisphere extends PluginBase {

    constructor(scene) {
        super();

        let diameter = 10;
        this.diameter = diameter;

        // let light_r = new BABYLON.PointLight("light1", BABYLON.Vector3.Zero(), scene);
        // light_r.intensity = 0.7;
        // light_r.diffuse = BABYLON.Color3.FromHexString('#ff0000');
        // light_r.position.z = diameter;

        // let light_g = new BABYLON.PointLight("light1", BABYLON.Vector3.Zero(), scene);
        // light_g.intensity = 0.7;
        // light_g.diffuse = BABYLON.Color3.FromHexString('#00ff00');
        // light_g.position.x = diameter;

        // let light_b = new BABYLON.PointLight("light1", BABYLON.Vector3.Zero(), scene);
        // light_b.intensity = 0.7;
        // light_b.diffuse = BABYLON.Color3.FromHexString('#0000ff');
        // light_b.position.y = diameter;

        let mat = new BABYLON.StandardMaterial("mat", scene);
        mat.alpha = 0.8;

        // var gl = new BABYLON.GlowLayer("glow", scene);
        // gl.intensity = 1;

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