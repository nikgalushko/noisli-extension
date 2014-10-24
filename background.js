"use strict";
/*    "wind": ,
    "forest": ,
    "leaves": ,
    "waterstream": ,
    "seaside": ,
    "water": ,
    "bonfire": ,
    "summernight": ,
    "coffeshop": ,
    "trainnight": ,
    "fanshop": */
var sounds = {
    "rain": "https://ec-media.soundcloud.com/MAmhowtI39FC.128.mp3?f10880d39085a94a0418a7ef69b03d522cd6dfee9399eeb9a522009f67f8ba3b68cb079f18aa8051224009267663545094b50d8e23bd468050c92f56ec0f3fb58d4b59122b&AWSAccessKeyId=AKIAJNIGGLK7XA7YZSNQ&Expires=1413804740&Signature=M%2B2DDT1K61zhDe%2Fsd9ecljqCeBQ%3D",
    "tunderstorm": "https://ec-media.soundcloud.com/bwkh7FoYBvBL.128.mp3?f10880d39085a94a0418a7ef69b03d522cd6dfee9399eeb9a522009f66f9bf34e7e18c54aa4b03246cc0b85aa6802493c1548eb033d66fde0a5b4abc91a12c597ed322ec65&AWSAccessKeyId=AKIAJNIGGLK7XA7YZSNQ&Expires=1413911858&Signature=S4Q0a32g7b6F%2Fn7ulxYV8bdLtqI%3D"
};

function Player(sound) {
    this.sound = sound;
    this.player = new Audio(sounds[this.sound]);
    this.player.volume = 0;
}

Player.prototype.play = function () {
    this.player.play();
};

Player.prototype.stop = function () {
    this.player.pause();
    this.player.currentTime = 0;
};

Player.prototype.pause = function () {
    this.player.pause();
};

Player.prototype.mute = function () {
    this.player.volume = 0;
};

Player.prototype.changeVolume = function (newVolume) {
    console.log(newVolume);
    this.player.volume = newVolume;
};

Player.prototype.getCurrentVolume = function () {
    return this.player.volume;
}


function getCurrentVolumeForSound(forSound) {
    if (currentSounds[forSound]) {
        console.log("Current: " + currentSounds[forSound].getCurrentVolume());
        return {currentVolume: currentSounds[forSound].getCurrentVolume() * 100, forSound: forSound};
    } else {
        return {currentVolume: 0, forSound: forSound};
    }
}

function init (sound, sendResponse) {
    console.log(sound);
    currentSounds[sound] = new Player(sound);
    currentSounds[sound].play();
    currentSounds[sound].changeVolume(defaultVolume / 100);
    sendResponse({volume: currentSounds[sound].getCurrentVolume() * 100});
}

function destroy(sound, sendResponse) {
    //TODO может удалять объект Audio ?!
    currentSounds[sound].stop();
    sendResponse({});
}

function changeVolumeForSound(sound, value) {
    currentSounds[sound].changeVolume(value / 100);
}

var currentSounds = {};
var defaultVolume = 20;

chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(request.directive);
        switch (request.directive) {
        case "play":
            init(request.sound, sendResponse);
            break;    
        case "stop":
            destroy(request.sound, sendResponse);
            break;
        case "range":
            changeVolumeForSound(request.sound, request.value);
            break;
        case "getCurrentVolume":
            sendResponse(getCurrentVolumeForSound(request.forSound));
            break;                
        }
    }
);