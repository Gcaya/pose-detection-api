const fs = require('fs');
require('@tensorflow/tfjs-node');
const posenet = require('@tensorflow-models/posenet');

global.XMLHttpRequest = require('xhr2');

class PoseNet {
    constructor() {
        this.net = null;
    };

    loadModel() {
        if(!this.net)
            this.net = await posenet.load();
    };

    processVideo(video) {
        
    };

    processFrame(frame) {

    };

};

module.exports = PoseNet;
