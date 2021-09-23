
export function Driver(instance, canvas, localStorage) {
    instance.setDriver(this);
    this.instance = instance;
    this.fps = 60;
    this._canvas = canvas;
    this._localStorage = localStorage;
    this._gameLoopInterval = null;
    this.gameWidth = canvas.width;
    this.gameHeight = canvas.height;
}

Driver.prototype.start = function() {
    if(!this.instance.initialized){
        this.instance.initialize(this.gameWidth, this.gameHeight, this._canvas, this._localStorage);
        setTimeout(function(){this.start();}.bind(this), 10);
    }else{
        if (this.instance.assets._stillLoading > 0) {
            setTimeout(function(){this.start();}.bind(this), 10);
        } else if(!this.instance.scene.initialized){
            if(this.instance.scene.start) this.instance.scene.start();
            this.instance.scene.initialized = true;
            setTimeout(function(){this.start();}.bind(this), 10);
        }else {
            this._start();
        }
    }
};
Driver.prototype._start = function() {
    if(this.instance.hadError) clearInterval(this._gameLoopInterval);
    else{
        this.instance._gameLoop();
        this._gameLoopInterval = setInterval(function(){this.instance._gameLoop();}.bind(this),
            1000 / this.fps);
    }
};
// Driver.prototype.changeScene = function() {
//     if(!this.instance.isServer){
//         this.instance.destroy();
//         this.instance = new Instance(false, new TestScene(), new Input(), new Render(),
//             new Assets(), getClientSocket(true), new Sound());
//         clearInterval(this._gameLoopInterval);
//         this.start(document.getElementById('canvas'), window.localStorage);            
//     }
// };

///RESET method? To reinit instance? Reload? That makes it sound like it's going in fresh
// Reinitialize?