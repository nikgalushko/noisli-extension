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
    "rain": "https://ec-media.soundcloud.com/MAmhowtI39FC.128.mp3?f10880d39085a94a0418a7ef69b03d522cd6dfee9399eeb9a522009867fab738f8a6b556ed69fc026b1fb9f5cc483081620e1a7a848ed12505d03d80d2b38fc3a609cc67c8&AWSAccessKeyId=AKIAJNIGGLK7XA7YZSNQ&Expires=1414829442&Signature=n0%2B4UKw6BtXbdhDntdqUH6ihJRs%3D",
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

function init (sound, sendResponse, volume) {
    console.log(sound);
    if (currentSounds[sound])
        return;
    var vol = volume || defaultVolume;
    currentSounds[sound] = new Player(sound);
    currentSounds[sound].play();
    currentSounds[sound].changeVolume(vol / 100);
    sendResponse({volume: currentSounds[sound].getCurrentVolume() * 100, for: sound});
}

function destroy(sound, sendResponse) {
    //TODO может удалять объект Audio ?!
    currentSounds[sound].stop();
    delete currentSounds[sound];
    sendResponse({});
}

function changeVolumeForSound(sound, value) {
    currentSounds[sound].changeVolume(value / 100);
}

function getContext(sendResponse) {
    var items = {};
    for (var key in sounds) {
        if (currentSounds[key]) {
            items[key] = currentSounds[key].getCurrentVolume() * 100;
            console.log("key: " + key + " value: " + items[key]);
        }
    }
    sendResponse({status: true, context: items});
}


function load(sendResponse) {
    chrome.storage.sync.get(null, function(items) {
        var status = false;
        console.log(items);
        var currSounds = {};
        for (var key in items) {
            status = true;
            console.log("Get key:" + key + " value:" + items[key]);
            currSounds[key] = items[key];
        }
        console.log("Status:" + status);
    });
            sendResponse({stat: true, currentSounds: {rain: 100}});
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
        case "save_context":
            getContext(sendResponse);
            break;
        case "load_play":
            load(sendResponse);
            break;
        }
    }
);