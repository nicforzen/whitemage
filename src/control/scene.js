
export function Scene(instance, start, onRender) {
    this.instance = instance;
    this.start = start;
    this.onRender = onRender;

    this.isServer = false;
    this.initialized = false;
}

Scene.prototype.setInstance = function(instance){
    this.isServer = instance.isServer;
    this.instance = instance;
};