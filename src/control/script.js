export function Script(){
    this.id = 0;
    this.enabled = true;
    this._initialized = false;
    this.gameObject = null;

    // Lifecycle methods
    this.start = null;
    this.fixedUpdate = null;
    this.update = null;
    this.onCollisionEnter = null;
    this.onCollisionExit = null;
    this.onCollisionStay = null;
    this.onTriggerEnter = null;
    this.onMouseOver = null;
    this.onMouseDown = null;
    this.onMouseUp = null;
    this.onMouseScroll = null;
    this.lateUpdate = null;
    this.onDestroy = null;
}

Script.prototype.initialize = function() {
    if(!this._initialized){
        if(this.start){
            this.start();
        }
        this._initialized = true;
    }
};