class Hemisphere extends PluginBase {

    constructor(scene) {
        super();

        let diameter = 500;
        this.diameter = diameter;

        let light_r = new BABYLON.PointLight("light1", BABYLON.Vector3.Zero(), scene);
        light_r.intensity = 0.7;
        light_r.diffuse = BABYLON.Color3.FromHexString('#ff0000');
        light_r.position.z = diameter;

        let light_g = new BABYLON.PointLight("light1", BABYLON.Vector3.Zero(), scene);
        light_g.intensity = 0.7;
        light_g.diffuse = BABYLON.Color3.FromHexString('#00ff00');
        light_g.position.x = diameter;

        let light_b = new BABYLON.PointLight("light1", BABYLON.Vector3.Zero(), scene);
        light_b.intensity = 0.7;
        light_b.diffuse = BABYLON.Color3.FromHexString('#0000ff');
        light_b.position.y = diameter;

        let mat = new BABYLON.StandardMaterial("mat", scene);
        mat.alpha = 0.8;

        var gl = new BABYLON.GlowLayer("glow", scene);
        gl.intensity = 1;

        let sphere = BABYLON.MeshBuilder.CreateSphere("", { diameter: diameter, sideOrientation: BABYLON.Mesh.DOUBLESIDE });
        sphere.material = mat;

        let randomPos = () => {
            let f = 110;
            return new BABYLON.Vector3(
                0.5 * f - f * Math.random(),
                0.5 * f - f * Math.random(),
                0.5 * f - f * Math.random()
            );
        }
        let sun = new Sun(scene, randomPos());

        // publish
        this.scene = scene;
        this.light_r = light_r;
        this.light_g = light_g;
        this.light_b = light_b;
        this.sphere = sphere;
        this.sun = sun;
        this.mat = mat;
        this.gl = gl;
    }


    activate() {
        let scene = this.scene;
        let diameter = this.diameter;
        let light_r = this.light_r;
        let light_g = this.light_g;
        let light_b = this.light_b;
        let sun = this.sun;

        let t = 0;
        let orbit = diameter;
        let speed = 0.01;

        // this.observer = scene.onBeforeRenderObservable.add(() => {

        //     t += speed;

        //     light_r.position.x = orbit * Math.sin(t);
        //     light_r.position.y = orbit * Math.sin(t);
        //     light_r.position.z = orbit * Math.cos(t);

        //     light_g.position.x = orbit * Math.sin(t * 2);
        //     light_g.position.y = orbit * Math.sin(t * 2);
        //     light_g.position.z = orbit * Math.cos(t * 2);

        //     light_b.position.x = orbit * Math.sin(t * 3);
        //     light_b.position.y = orbit * Math.sin(t * 3);
        //     light_b.position.z = orbit * Math.cos(t * 3);

        //     sun.customMesh.position.y = 10 + 10 * Math.cos(t * 0.1);
        //     sun.customMesh.position.z = 10 + 10 * Math.sin(t * 0.1);
        // });


        this.registerBeforeRender = new RegisterBeforeRender(scene, 30, () => {
            t += speed;

            light_r.position.x = orbit * Math.sin(t);
            light_r.position.y = orbit * Math.sin(t);
            light_r.position.z = orbit * Math.cos(t);

            light_g.position.x = orbit * Math.sin(t * 2);
            light_g.position.y = orbit * Math.sin(t * 2);
            light_g.position.z = orbit * Math.cos(t * 2);

            light_b.position.x = orbit * Math.sin(t * 3);
            light_b.position.y = orbit * Math.sin(t * 3);
            light_b.position.z = orbit * Math.cos(t * 3);

            sun.customMesh.position.y = 10 + 10 * Math.cos(t * 0.1);
            sun.customMesh.position.z = 10 + 10 * Math.sin(t * 0.1);
        });

    }

    deinstall() {
        // this.scene.onBeforeRenderObservable.remove(this.observer);
        this.registerBeforeRender.deinstall();

        this.light_r.dispose();
        this.light_g.dispose();
        this.light_b.dispose();
        this.sphere.dispose();
        this.mat.dispose();
        this.gl.dispose();

        this.sun.deinstall();
        this.sun = null; // dispose class instance
    }
}