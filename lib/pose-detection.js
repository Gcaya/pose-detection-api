const fs = require('fs');
const url = require('url');
const uuid = require('uuid/v1');
const youtubedl = require('youtube-dl');
const constants = require('./constants');
const instagramsave = require('instagram-save');
const ffmpeg = require('ffmpeg');
const path = require('path');

let videoName;

class PoseDetection {

    loadVideo(videoUrl) {
        return new Promise((resolve, reject) => {
            
            try { 
                if(videoUrl.includes('youtube')) {
                    videoName = `${uuid()}.mp4`;

                    let video = youtubedl(videoUrl, ['--format=18'], { cwd: constants.VIDEO_DIR });
                    video.pipe(fs.createWriteStream(videoName)).then(() => {
                        resolve(videoName);
                    });
                    
                } else if(videoUrl.includes('instagram')) {
                    const parsedUrl = url.parse(videoUrl);
                    videoName = parsedUrl.pathname.split('/')[2];
                    
                    instagramsave(videoName, constants.VIDEO_DIR).then((res) => {
                        resolve(videoName);
                    });

                } else {
                    reject('Website not supported.');
                }
            } catch(err) {
                reject(err);
            }
        });
    };

    processvideo(videoName) {
        return new Promise((resolve, reject) => {
            
            let process = new ffmpeg(path.join(constants.VIDEO_DIR, videoName) + '.mp4');
            process.then((video) => {
                video.fnExtractFrameToJPG(path.join(constants.POSE_DIR, videoName), {
                    frame_rate: 1,
                    file_name: 'frame'
                }, (error, files) => {
                    if(!error)
                        console.log(files);
                    else
                        console.log(error);
                });
            }).catch((err) => {
                console.log(err);
            });
        });
    };
}

module.exports = PoseDetection;