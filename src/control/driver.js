
export function Driver(instance, fps, gameWidth, gameHeight) {
    this.instance = instance;
    this.fps = fps;
    this._gameLoopInterval = null;
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
}

Driver.prototype.start = function(canvas, localStorage) {
    if(!this.instance.initialized){
        this.instance.initialize(this.gameWidth, this.gameHeight, canvas, localStorage);
        setTimeout(function(){this.start(canvas, localStorage);}.bind(this), 10);
    }else{
        if (this.instance.assets._stillLoading > 0) {
            setTimeout(function(){this.start(canvas, localStorage);}.bind(this), 10);
        } else if(!this.instance.scene.initialized){
            this.instance.scene.onStart();
            this.instance.scene.initialized = true;
            setTimeout(function(){this.start(canvas, localStorage);}.bind(this), 10);
        }else {
            this.p_start();
        }
    }
};
Driver.prototype.p_start = function() {
    if(this.instance.hadError) clearInterval(this._gameLoopInterval);
    else{
        this.instance.p_gameLoop();
        this._gameLoopInterval = setInterval(function(){this.instance.p_gameLoop();}.bind(this),
            1000 / this.fps);
    }
};
Driver.prototype.changeScene = function() {
    if(!this.instance.isServer){
        this.instance.destroy();
        this.instance = new Instance(false, new TestScene(), new Input(), new Render(),
            new Assets(), getClientSocket(true), new Sound());
        clearInterval(this._gameLoopInterval);
        this.start(document.getElementById('canvas'), window.localStorage);            
    }
};