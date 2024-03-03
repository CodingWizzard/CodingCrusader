class Portal extends PluginBase {

    constructor(scene) {
        super();



        let createSceneUniverse = function (scene, camera, pos) {
            let diameter = 1;

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

            let sky = new BABYLON.HemisphericLight("sky", new BABYLON.Vector3(0, 1.0, 0), scene);
            sky.intensity = 0.5;

            let mat = new BABYLON.StandardMaterial("mat", scene);
            mat.alpha = 0.8;


            let mat2 = new BABYLON.StandardMaterial("")
            mat2.stencil.enabled = true
            mat2.stencil.funcRef = 1
            mat2.stencil.func = BABYLON.Engine.EQUAL
            mat2.emissiveColor = BABYLON.Color3.Yellow();


            let sphere = BABYLON.MeshBuilder.CreateSphere("", { diameter: diameter, sideOrientation: BABYLON.Mesh.DOUBLESIDE });
            sphere.material = mat2;
            sphere.position.addInPlace(pos);

            // let matDisco = new BABYLON.StandardMaterial("")
            // matDisco.stencil.enabled = true
            // matDisco.stencil.funcRef = 1
            // matDisco.stencil.func = BABYLON.Engine.EQUAL
            // matDisco.diffuseColor = BABYLON.Color3.Yellow();



            let discoSphere = new DiscoSphere(scene, 1);
            discoSphere.sphere.position.addInPlace(pos);
            discoSphere.customMesh.position.addInPlace(pos);

            return scene;
        };


        function createPlane(dir, ref) {
            let plane = BABYLON.MeshBuilder.CreatePlane(`${ref}`, { size: 2 })
            // plane.lookAt(dir.negate())
            plane.position.addInPlace(dir)


            let mat = new BABYLON.StandardMaterial(`${ref}`)
            plane.material = mat
            mat.stencil.enabled = true
            mat.stencil.funcRef = ref
            mat.disableDepthWrite = true
            mat.disableColorWrite = true

            return plane;
        }





        // let plane1 = createPlane(BABYLON.Vector3.Backward(), 1)
        let pos = new BABYLON.Vector3(0, 10, 0);
        let plane1 = createPlane(pos, 1)
        plane1.rotation.x = Math.PI;

        // let plane2 = createPlane(BABYLON.Vector3.Right(), 2)
        // let plane3 = createPlane(BABYLON.Vector3.Up(), 3)
        // let plane4 = createPlane(BABYLON.Vector3.Down(), 4)
        // let plane5 = createPlane(BABYLON.Vector3.Left(), 5)
        // let plane6 = createPlane(BABYLON.Vector3.Forward(), 6)


        let mat2 = new BABYLON.StandardMaterial("")
        mat2.stencil.enabled = true
        mat2.stencil.funcRef = 1
        mat2.stencil.func = BABYLON.Engine.EQUAL
        mat2.emissiveColor = BABYLON.Color3.Magenta();

        let box2 = BABYLON.MeshBuilder.CreateBox("", { size: 2, sideOrientation: 1 })
        //box2.scaling.set(5, 5, 5)
        box2.material = mat2
        box2.position.addInPlace(pos);

        createSceneUniverse(scene, scene.activeCamera, pos);

    }


    activate() {

    }

    deactivate() {
    }
}