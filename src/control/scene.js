
export function Scene(instance, onStart, onRender) {
    this.instance = instance;
    this.onStart = onStart;
    this.onRender = onRender;
}

Scene.prototype = {
    setInstance(instance){
        this.instance = instance;
    }
};