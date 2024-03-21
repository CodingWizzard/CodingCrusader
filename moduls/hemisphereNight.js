class Hemisphere extends PluginBase {

    constructor(scene) {
        super();

        let diameter = 500;
        this.diameter = diameter;


        var gl = new BABYLON.GlowLayer("glow", scene);
        gl.intensity = 1;


        let mat = new BABYLON.StandardMaterial("mat", scene);
        mat.alpha = 0.8

        let sphere = BABYLON.MeshBuilder.CreateSphere("", { diameter: diameter, sideOrientation: BABYLON.Mesh.DOUBLESIDE });
        sphere.material = mat;



        let maxStars = 10;
        for (let i = 0; i < maxStars; i++) {
            let randomPos = () => {
                let f = 150;
                return new BABYLON.Vector3(
                    0.5 * f - f * Math.random(),
                    10 + 10 * Math.random(),
                    0.5 * f - f * Math.random()
                );
            }
            // let star = new DiscoSphere(randomPos(), null);
            // sun.customMesh.position.z = 10;
            // sun.customMesh.position.y = -250;
        }

        // publish
        this.scene = scene;
    }


    activate() {

        // const moveLights = () => {

        //     let scene = this.scene;
        //     let diameter = this.diameter;
        //     let light_r = this.light_r;
        //     let light_g = this.light_g;
        //     let light_b = this.light_b;
        //     let sun = this.sun;

        //     let t = 0;
        //     let orbit = diameter;
        //     let speed = 0.001;
        //     scene.registerBeforeRender(function () {
        //         t += speed;

        //         light_r.position.x = orbit * Math.sin(t);
        //         light_r.position.y = orbit * Math.sin(t);
        //         light_r.position.z = orbit * Math.cos(t);

        //         light_g.position.x = orbit * Math.sin(t * 2);
        //         light_g.position.y = orbit * Math.sin(t * 2);
        //         light_g.position.z = orbit * Math.cos(t * 2);

        //         light_b.position.x = orbit * Math.sin(t * 3);
        //         light_b.position.y = orbit * Math.sin(t * 3);
        //         light_b.position.z = orbit * Math.cos(t * 3);

        //         //sun.customMesh.position.y = -250 + 100 * Math.cos(t * 0.1);
        //         sun.customMesh.position.y = 10 + 10 * Math.cos(t * 0.1);
        //         sun.customMesh.position.z = 10 + 10 * Math.sin(t * 0.1);

        //     });

        // }

        // moveLights();
        // scene.onBeforeRenderObservable.add(moveLights)
    }

    deactivate() {
        // todo: registerBeforeRender wieder freigeben
    }
}