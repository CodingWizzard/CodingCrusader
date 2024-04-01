class Controller_Tracks {
    constructor(params) {
        this.controller_tracks = [];

        this.controller_tracks.push(new Controller_Track(params, new Model_Track1()));
        this.controller_tracks.push(new Controller_Track(params, new Model_Track2()));
        this.controller_tracks.push(new Controller_Track(params, new Model_Track3()));

        this.state = this.state_idle;
    }

    state_idle() {
    }

    state_start() {
        this.controller_tracks.forEach((track, idx) => {
            track.state = track.state_start;
        });

        this.state = this.state_running;
    }

    state_running() {
        this.controller_tracks.forEach((track, idx) => {
            track.update();
        });
    }

    update() {
        this.state();
    }
}
