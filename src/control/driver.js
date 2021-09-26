import { Application } from "../core/application";
import { Resolution } from "../core/resolution";
import { Screen } from "../core/screen";
import { SceneManager } from "./scenemanager";

export function Driver(instance, canvas, localStorage) {
    instance.setDriver(this);
    this.instance = instance;
    this._canvas = canvas;
    this._localStorage = localStorage;
    this._gameLoopInterval = null;
    this.gameWidth = canvas.width;
    this.gameHeight = canvas.height;

    Screen.currentResolution = new Resolution(canvas.width, canvas.height, 60); // TODO fix refresh
}

Driver.prototype.start = function() {
    if(!this.instance.initialized){
        this.instance.initialize(this._canvas, this._localStorage);
        setTimeout(function(){this.start();}.bind(this), 10);
    }else{
        if (this.instance.assets._stillLoading > 0) {
            setTimeout(function(){this.start();}.bind(this), 10);
        }else {
            SceneManager._instance = this.instance;
            SceneManager._canvas = this._canvas;
            SceneManager._localStorage = this._localStorage;
            this._start();
        }
    }
};
Driver.prototype._start = function() {
    if(this.instance.hadError) clearInterval(this._gameLoopInterval);
    else{
        this.instance._gameLoop();
        this._gameLoopInterval = setInterval(function(){this.instance._gameLoop();}.bind(this),
            1000 / Application.targetFrameRate);
    }
};