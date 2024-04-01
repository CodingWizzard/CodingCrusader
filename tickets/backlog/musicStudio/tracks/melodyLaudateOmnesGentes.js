let z = 7 * 12 + 0

const notes = [];
notes['c'] = 0;
notes['cs'] = 1;
notes['d'] = 2;
notes['ds'] = 3;
notes['e'] = 4;
notes['f'] = 5;
notes['fs'] = 6;
notes['g'] = 7;
notes['gs'] = 8;
notes['a'] = 9;
notes['as'] = 10;
notes['b'] = 11;
notes['z'] = z;


function loadMelodyFromFile(filename, dataArray) {

    fetch(filename)
        .then(response => response.text())
        .then(text => {
            const lines = text.split('\r\n');
            lines.forEach(line => {
                const values = line.split(';');
                dataArray.push({
                    note: notes[values[0]],
                    pitch: parseInt(values[1]),
                    d1: parseInt(values[2]),
                    d2: parseInt(values[3])
                })
            });

            console.log(filename);
            console.log(dataArray);
        })
        .catch(error => {
            console.error('Beim Laden der Datei ist ein Fehler aufgetreten:', error);
        });
}


// Laudate omnes gentes

// Sopran
class Model_Track1 {
    constructor() {

        this.index = -1;
        this.melody = [];

        loadMelodyFromFile("melodies/laudateOmnesGentes/track1.txt", this.melody);
    }
}

// Mezzosopran
class Model_Track2 {
    constructor() {

        this.index = -1;
        this.melody = [];

        loadMelodyFromFile("melodies/laudateOmnesGentes/track2.txt", this.melody);
    }
}

// Alt
class Model_Track3 {
    constructor() {

        this.index = -1;
        this.melody = [];

        loadMelodyFromFile("melodies/laudateOmnesGentes/track3.txt", this.melody);
    }
}