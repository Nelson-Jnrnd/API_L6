var udp = require('dgram');
var Instruments = require('./instruments');
const timeCheckForInactiveMusician = 1000;

/**
 * Simulates someone who listens to the orchestra. 
 * Keep tracks of active musician (if it played a sound during the last 5 seconds) and provides a list of those musicican via a JSON payload sent after a TCP connection on port 2205
 */
class Auditor {
    /**
     * List of musicians we remember hearing
     */
    musicians_heard = {};
    udpServer;
    forgetMusicians;
    timeBeforeForgetting;
    /**
     * @param  {string} adress multicast address were we listen to the musicians
     * @param  {number} port port were we listen to the musicians
     * @param  {number} timeBeforeForgetting time it takes before a musician is considered inactive
     */
    constructor(adress, port, timeBeforeForgetting){
        this.timeBeforeForgetting = timeBeforeForgetting;
        this.udpServer = udp.createSocket('udp4');

        // Create udp server...
        this.udpServer.bind(port, () => {
            this.udpServer.addMembership(adress);
        });
        this.udpServer.on('listening', () => {
            const addr = this.udpServer.address();
            console.log('Listening for UDP Datagrams on ' + addr.address + ' with port ' + addr.port);
        })
        this.udpServer.on('message', (msg) => {
            const message = JSON.parse(msg);
            this.addMusician(message.id, message.sound);
        })

        this.forgetMusicians = setInterval(() => {
            this.removeInactiveMusicians()
        }, timeCheckForInactiveMusician);
    }
    /**
     * Adds or update a musician in the list of musician we heard recently
     * @param  {string} id id of the musician to add/update
     * @param  {string} sound sound the musician made when we heard him
     */
    addMusician(id, sound){
        var timeOfAddition = Date.now();
        var instrumentHeard = Object.keys(Instruments).find(key => Instruments[key].sound == sound);
        
        if(!instrumentHeard)
            instrumentHeard = 'unknown';

        if(this.musicians_heard[id]){
            // Update
            this.musicians_heard[id].activeLast = timeOfAddition;
            this.instrument = instrumentHeard;
        } else{
            // Add
            this.musicians_heard[id] = {
                "uuid" : id,
                "instrument" : instrumentHeard,
                "activeSince" : timeOfAddition,
                "activeLast" : timeOfAddition
            }
        }
        
    }

    /**
     * Remove inactive musicians from the list of musicians we heard recently
     */
    removeInactiveMusicians(){
        console.log(this.musicians_heard);
        Object.keys(this.musicians_heard).forEach(key =>{
            var musician = this.musicians_heard[key];
            if(Date.now() - musician.activeLast > this.timeBeforeForgetting){
                delete this.musicians_heard[musician.uuid];
            }
        });
    }

}

module.exports = Auditor;