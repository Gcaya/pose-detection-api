const fs = require('fs');
const url = require('url');
const path = require('path');
const uuid = require('uuid/v1');
const ffmpeg = require('ffmpeg');
const youtubedl = require('youtube-dl');
const constants = require('./constants');
const instagramsave = require('instagram-save');
global.XMLHttpRequest = require('xhr2');

class PoseDetection {

    constructor() {
    };

    loadVideo(videoUrl) {
        return new Promise((resolve, reject) => {
            try { 
                let videoName;
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

    extractFrames(videoName) {
        return new Promise((resolve, reject) => {
            let filePath = path.join(constants.VIDEO_DIR, videoName) + '.mp4';

            let process = new ffmpeg(filePath);
            process.then((video) => {
                video.fnExtractFrameToJPG(path.join(constants.POSE_DIR, videoName), {
                    frame_rate: 1,
                    file_name: 'frame'
                }, (error, files) => {
                    if(!error) {
                        fs.unlink(filePath, (err) => {
                            if(err)
                                console.log(err);
                        });

                        resolve(videoName);
                    }
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