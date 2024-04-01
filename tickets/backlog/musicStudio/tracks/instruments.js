class Instruments {
    constructor(params) {
        this.params = { ...params };

        this.piano = [];

        for (let i = 0; i <= 6; i++) {
            this.piano.push(new BABYLON.Sound("c" + i, "media/C" + i + ".mp3", params.scene, null, { loop: false, autoplay: false }));
            this.piano.push(new BABYLON.Sound("cs" + i, "media/Cs" + i + ".mp3", params.scene, null, { loop: false, autoplay: false }));
            this.piano.push(new BABYLON.Sound("d" + i, "media/D" + i + ".mp3", params.scene, null, { loop: false, autoplay: false }));
            this.piano.push(new BABYLON.Sound("ds" + i, "media/Ds" + i + ".mp3", params.scene, null, { loop: false, autoplay: false }));
            this.piano.push(new BABYLON.Sound("e" + i, "media/E" + i + ".mp3", params.scene, null, { loop: false, autoplay: false }));
            this.piano.push(new BABYLON.Sound("f" + i, "media/F" + i + ".mp3", params.scene, null, { loop: false, autoplay: false }));
            this.piano.push(new BABYLON.Sound("fs" + i, "media/Fs" + i + ".mp3", params.scene, null, { loop: false, autoplay: false }));
            this.piano.push(new BABYLON.Sound("g" + i, "media/G" + i + ".mp3", params.scene, null, { loop: false, autoplay: false }));
            this.piano.push(new BABYLON.Sound("gs" + i, "media/Gs" + i + ".mp3", params.scene, null, { loop: false, autoplay: false }));
            this.piano.push(new BABYLON.Sound("a" + i, "media/A" + i + ".mp3", params.scene, null, { loop: false, autoplay: false }));
            this.piano.push(new BABYLON.Sound("as" + i, "media/As" + i + ".mp3", params.scene, null, { loop: false, autoplay: false }));
            this.piano.push(new BABYLON.Sound("b" + i, "media/B" + i + ".mp3", params.scene, null, { loop: false, autoplay: false }));
        }

        this.piano.push(new BABYLON.Sound("z0", "", params.scene, null, { loop: false, autoplay: false }));
    }
}
