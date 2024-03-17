
class RegisterBeforeRender {
    constructor(scene, desiredFps, callback) {

        // let desiredFps = 10;
        let interval = 1000 / (10 * desiredFps);
        let lastTime = performance.now();

        this.observer = scene.onBeforeRenderObservable.add(() => {
            let currentTime = performance.now();
            const deltaTime = currentTime - lastTime;
            if (deltaTime > interval) {
                lastTime = currentTime - (deltaTime % interval);

                callback();
            }
        });


        // publish
        this.scene = scene;
    }

    deinstall() {
        this.scene.onBeforeRenderObservable.remove(this.observer);
        this.observer = null;
    }
}

