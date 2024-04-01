class Controller_Track {
    constructor(params, model) {
        this.model = model;
        this.instruments = new Instruments(params);

        this.state = this.state_idle;

        this.startTime = undefined
        this.endTime = undefined
    }

    state_idle() {
    }

    state_start() {
        this.state = this.state_running;

        this.model.index = 0;
    }

    state_running() {
        console.log(this.model.melody[this.model.index].note, 12 * this.model.melody[this.model.index].pitch);

        let index = this.model.melody[this.model.index].note + 12 * this.model.melody[this.model.index].pitch;
        this.instruments.piano[index].play();

        this.startTime = Date.now();
        this.endTime = this.startTime + 3000 * this.model.melody[this.model.index].d1 / this.model.melody[this.model.index].d2

        this.state = this.state_waiting;

        if (this.model.melody[this.model.index].note === z)
            return;

        let end = 0;
        let start = -.125 * Math.PI;
    }

    state_waiting() {
        if (Date.now() >= this.endTime) {
            this.model.index++;
            if (this.model.index > this.model.melody.length - 1) {
                this.state = this.state_idle;
            }
            else {
                this.state = this.state_running;
            }
        }
    }

    update() {
        this.state();
    }
}
