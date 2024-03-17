class PluginBase {
    constructor() {
        this.objects = [];
    }

    addObject(obj) {
        this.objects.push(obj);
    }

    deinstall() {
        this.objects.forEach((obj) => {
            if (typeof obj.dispose === 'function') {
                obj.dispose();
            }
            else {
                obj = null; // free the instance of a class
            }
        })

        this.objects.length = 0;
    }
}