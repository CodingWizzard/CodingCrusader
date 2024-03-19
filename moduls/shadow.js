class Shadow extends PluginBase {
    constructor(scene) {
        super();

        let lightSphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 0.1, scene);
        let lightSphereMat = new BABYLON.StandardMaterial("mat", scene);
        lightSphere.material = lightSphereMat;
        lightSphereMat.emissiveColor = BABYLON.Color3.Yellow();
        lightSphereMat.linkEmissiveWithDiffuse = true;
        lightSphere.position.y = 6.0;

        let light = new BABYLON.PointLight("light1", BABYLON.Vector3.Zero(), scene);
        light.intensity = 0.3;


        let shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
        shadowGenerator.setDarkness(0.2);
        shadowGenerator.usePoissonSampling = true;
        shadowGenerator.useBlurVarianceShadowMap = true;
        shadowGenerator.blurBoxOffset = 1.0;
        shadowGenerator.blurScale = 150.0;
        shadowGenerator.bias = 0.00001;


        for (let i = 0; i < scene.meshes.length; i++) {
            // if (i > 200) break;
            scene.meshes[i].receiveShadows = true;
            shadowGenerator.getShadowMap().renderList.push(scene.meshes[i]);
        }



        // publish
        this.scene = scene;
        this.lightSphere = lightSphere;
        this.light = light;


        // this.activate();
    }


    activate() {

        // https://forum.babylonjs.com/t/how-to-unregisterbeforerender/47813/3


        // this.observer = scene.onBeforeRenderObservable.add((a,b) => {
        //     if(1 === 1){
        //         observer.unregisterOnNextCall = true;
        //         // Method 2;
        //         // if callback is NOT bound ( function(){}.bind(variable) )
        //         // this === observer, so this.unregisterOnNextCall = true; does the same
        //     }
        //     console.log(observer, this)
        // });


        // let ts = 0;
        //  scene.registerBeforeRender(() => {
        //      ts += 0.01;

        //      lightSphere.position.x = 5 * Math.sin(ts);
        //      lightSphere.position.y = 5 * Math.sin(ts);
        //      lightSphere.position.z = 3 + 0 * Math.cos(ts);
        //      light.position = lightSphere.getAbsolutePosition();
        //  })

        const moveLights = () => {

            let scene = this.scene;
            let lightSphere = this.lightSphere;
            let light = this.light;

            let ts = 0;
            scene.registerBeforeRender(() => {
                ts += 0.001;

                lightSphere.position.x = 100 * Math.sin(ts);
                lightSphere.position.y = 100 * Math.sin(ts);
                lightSphere.position.z = 100 * Math.cos(ts);
                light.position = lightSphere.getAbsolutePosition();
            })
        }

        moveLights();

        // scene.onBeforeRenderObservable.add(moveLights)
    }
    deactivate() {
        // todo: registerBeforeRender wieder freigeben
    }
}
