export function Script(){
    this.id = 0;
    this.p_initialized = false;
    this.gameObject = null;
    this.onUpdate = null;
    this.onStart = null;
    this.onMouseMove = null;
    this.onMouseDown = null;
    this.onMouseUp = null;
    this.onCollisionDetected = null;
    this.onPostUpdate = null;
    this.onDestroy = null;
    this.onScroll = null;
}

Script.prototype = {
    initialize() {
        if(!this.p_initialized){
                if(this.onStart){
                        this.onStart();
                }
                this.p_initialized = true;
        }
    }
}