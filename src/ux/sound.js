export function Sound() {
    this.instance = null;
}

Sound.prototype.setInstance = function(instance){
    this.instance = instance;
};
Sound.prototype.getAudio = function(name){
    return this.p_getAudioObject(name, false);
};
Sound.prototype.getAudioInstance = function(name){
    return this.p_getAudioObject(name, true);
};
Sound.prototype.p_getAudioObject = function(name, isInstance){
    var source = this.instance.assets.getSound(name);
    if(isInstance) source = source.cloneNode();
    return {
        _src: source,
        repeat: false,
        stopped: true,
        play(){
            this.stopped = false;
            var stopped = this.stopped;
            var repeat = this.repeat;
            this._src.addEventListener('ended', function () {
                if (repeat == true && stopped == false) {
                    this.currentTime = 0;
                    this.play();
                }
            }, false);
            this._src.play();
        },
        pause(){
            this._stopped = true;
            this._src.pause();
        },
        stop(){
            this.stopped = true;
            this._src.pause();
            this._src.currentTime = 0;
        },
        setVolume(v){
            this._src.volume = v;
            return this;
        },
        getVolume(){
            return this._src.volume;
        },
        setRepeat(v){
            this.repeat = v;
            this._src.loop = v;
        }
    };
};