class Tunnel extends PluginBase {

    constructor(scene) {
        super();

        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);

        function mapRange(value, fromMin, fromMax, toMin, toMax) {
            const fromRange = fromMax - fromMin;
            const toRange = toMax - toMin;
            const scaledValue = (value - fromMin) / fromRange;
            return toMin + scaledValue * toRange;
        }

        let dist = 1;
        let max = 300;
        let path = [];
        for (let i = 0; i < max; i++) {

            let point = new BABYLON.Vector3(
                10 * Math.sin(i * 2 * Math.PI / max),
                10 * Math.cos(i * 4 * Math.PI / max),
                i * dist
            );
            path.push(point);

            const mesh = BABYLON.MeshBuilder.CreateTorus("torus", { thickness: dist, diameter: 3 });
            mesh.rotation.x = Math.PI * 0.5;
            mesh.position.copyFrom(point);
            mesh.position.x += 0.5 * (0.5 - Math.random());
            mesh.position.y += 0.5 * (0.5 - Math.random());
            mesh.position.z += 0.5 * (0.5 - Math.random());
            mesh.material = new BABYLON.StandardMaterial("mat", scene);
            mesh.material.diffuseColor = new BABYLON.Color3(
                mapRange(point.x, -10, 10, 0, 1),
                mapRange(point.y, -10, 10, 0, 1),
                mapRange(point.z, 0, max, 0, 1));
            // mesh.material.alpha = 0.5;

            if (Math.random() > 0.8) {
                let meshSphere = BABYLON.MeshBuilder.CreateSphere("", { diameter: 0.1 + 0.25 * Math.random() });
                meshSphere.position.x = mesh.position.x + 1 * (0.5 - Math.random());
                meshSphere.position.y = mesh.position.y + 1 * (0.5 - Math.random());
                meshSphere.position.z = i * dist;
                meshSphere.material = new BABYLON.StandardMaterial("mat", scene);
                meshSphere.material.diffuseColor = new BABYLON.Color3(
                    Math.random(), Math.random(), Math.random());
            }
        }


        /**/
        let distanceThresholdMin = dist * 1;
        let distanceThresholdMax = dist * 4 * 10;

        let framesPerSecond = 60;
        let durationInSeconds = 30;
        let totalFrames = framesPerSecond * durationInSeconds;
        let frameIndex = 0;

        scene.registerBeforeRender(() => {
            scene.meshes.forEach(function (mesh, index) {
                let distance = BABYLON.Vector3.Distance(mesh.position, camera.position);
                mesh.setEnabled(distance >= distanceThresholdMin && distance <= distanceThresholdMax);
            });


            let t = frameIndex / totalFrames;
            let pointIndex = Math.floor(t * (path.length - 1));
            let startPoint = path[pointIndex];
            let endPoint = path[pointIndex + 1];
            let interpolatedPoint = BABYLON.Vector3.Lerp(startPoint, endPoint, (t * (path.length - 1)) % 1);

            camera.position = interpolatedPoint;
            camera.setTarget(interpolatedPoint.add(new BABYLON.Vector3(0, 0, 1)));

            frameIndex++;
            if (frameIndex > totalFrames) {
                frameIndex = 0;
            }
        });

    }


    activate() {

    }

    deactivate() {
    }
}