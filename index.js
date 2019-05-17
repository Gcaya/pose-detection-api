'use strict';

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const poseDetection = require('./lib/pose-detection')

const app = express();
let detector;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

detector = new poseDetection();

app.post('/api/', (req, res) => {

    detector.loadVideo(req.body.url).then((videoName) => {
        res.send(videoName);
    }).catch((err) => {
        res.send(err);
    });
});


app.listen(3003);