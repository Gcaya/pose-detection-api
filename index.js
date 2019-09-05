'use strict';

const express = require('express')
const bodyParser = require('body-parser')
const poseDetection = require('./lib/pose-detection')
const constants = require('./lib/constants');


const app = express();
let detector;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

detector = new poseDetection();

app.post('/api/', (req, res) => {
    console.log(constants.VIDEO_DIR)
    detector.loadVideo(req.body.url).then((videoName) => {
        detector.processvideo(videoName).then(() =>{

        }).catch((err) => {
            console.log(err);
            res.send(err);
        })
    }).catch((err) => {
            console.log(err);
            res.send(err);
    });
});


app.listen(3003);