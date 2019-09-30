'use strict';

const express = require('express')
const bodyParser = require('body-parser')
const poseDetection = require('./lib/pose-detection')

const app = express();
let detector;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

detector = new poseDetection();

app.post('/api/', (req, res) => {

    detector.loadVideo(req.body.url).then((videoName) => {
        console.log(`Video load done ${videoName}`);
        detector.extractFrames(videoName).then((name) =>{
            console.log(`Frame extraction complete ${videoName}`);
            res.send('Video extraction successful');
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