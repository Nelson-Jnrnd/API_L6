var udp = require('dgram');
const { v4: uuidv4} = require('uuid');
const Instruments = require('./instruments.js');

/**
 * simulates someone who lplays an instrument in an orchestra. 
 * When the app is started, it is assigned an instrument. 
 * As long as it is running, every second it will emit a sound depending on the instrument
 */
class Musician {

    instrument;
    playing;
    musician_socket;
    id;
    address;
    port;
    intervalBetweenNotes;
    /**
     * @param  {string} address address where the udp packages will be sent
     * @param  {number} port port where the upd packages will be sent
     * @param  {number} intervalBetweenNotes interval at which the packages are sent
     * @param  {string} instrument name of the instrument to play
     */
    constructor(address, port, intervalBetweenNotes, instrument) {
        // Search for the instrument in the list of instrument we can play
        var chosenInstrument = Object.keys(Instruments).find(key => Instruments[key].name == instrument);
        if(!chosenInstrument){
            console.log("\nError the musician can't play " + instrument);
            process.exit(0);
        }

        this.instrument = Instruments[chosenInstrument];
        this.port = port;
        this.address = address;
        this.intervalBetweenNotes = intervalBetweenNotes;
        this.musician_socket = udp.createSocket('udp4');
        this.id = uuidv4();

        this.startPlaying();
    }
    /**
     * start playing music at the speed specified in this.intervalBetweenNotes
     */
    startPlaying() {
        this.playing = setInterval(() => {
            this.play()
        }, this.intervalBetweenNotes);
    }
    /**
     * stop playing music
     */
    stopPlaying() {
        clearInterval(this.playing);
    }
    /**
     * Send a UDP package at the multicast address in property
     */
    play() {
        console.log(this.instrument.sound);
        var data = JSON.stringify({
            id : this.id,
            sound : this.instrument.sound});
        this.musician_socket.send(data, 0, data.length, this.port, this.address, function(err, byte) {
            console.log("sending music");
        });
    }
}

module.exports = Musician;