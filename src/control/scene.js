
export function Scene(instance, onStart, onRender) {
    this.instance = instance;
    this.onStart = onStart;
    this.onRender = onRender;

    this.isServer = false;
    this.initialized = false;
}

Scene.prototype.setInstance = function(instance){
    this.isServer = instance.isServer;
    this.instance = instance;
};