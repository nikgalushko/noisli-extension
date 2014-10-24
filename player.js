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
