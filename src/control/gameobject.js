import { Vector2 } from "../physics/vector.js";

export function GameObject(name){
    this.name = name;
    this.stationary = false;
    this.renderer = null;
    this.scale = 1;
    this.angleInRadians = 0;
    this.scripts = [];
    this.colliders = [];
    this.controller = null;
    this.components = {};
    this.instance = null;
    this.parent = null;
    this.subObjects = [];
    this.localX = 0;
    this.localY = 0;
    this.localScale = 1;
    this.animator = null;
    this._initialized = false;
    this.id = 0;

    this.rigidbody = {
        velocity: new Vector2(),
        mass: 1
    };
    this.transform = {
        position: new Vector2()
    };
}

GameObject.prototype.addScript = function(script){
    script.gameObject = this;
    this.scripts.push(script);
};
GameObject.prototype.removeScriptById = function(id){
    for (var i = 0; i < this.scripts.length; i++) {
        let script = this.scripts[i];
        if(script.id == id){
            this.scripts.splice(i, 1);
            i -= 1;
        }
    }
};
GameObject.prototype.addCollider = function(collider){
    collider.gameObject = this;
    collider.x = this.transform.position.x - collider.getWidth() * collider.offsetx;
    collider.y = this.transform.position.y - collider.getHeight() * collider.offsety;
    this.colliders.push(collider);
};
GameObject.prototype.setAnimator = function(animator){
    animator.gameObject = this;
    this.animator = animator;
};
GameObject.prototype.addSubobject = function(obj){
    obj.parent = this;
    obj.instance = this.instance;
    obj.transform.position.x = this.transform.position.x + obj.localX*this.scale;
    obj.transform.position.y = this.transform.position.y + obj.localY*this.scale;
    obj.scale = this.scale;
    this.subObjects.push(obj);
};
GameObject.prototype.setInstance = function(instance){
    this.instance = instance;
    for(var i = 0; i < this.subObjects.length; i++){
        this.subObjects[i].setInstance(instance);
    }
};
GameObject.prototype.collidesAt = function(x, y){
    for(var i = 0; i < this.colliders.length; i++){
        let collider = this.colliders[i];
        // TODO fix
        // if(collider.type == "b"){
        //     if(boxColliderPointCollision(x, y, collider)) return true;
        // }
    }
    return false;
};
GameObject.prototype.initialize = function(){
    if(!this._initialized){
        for(let a=0;a<this.colliders.length;a++){
            let collider = this.colliders[a];
            collider.x = this.transform.position.x - collider.getWidth() * collider.offsetx;
            collider.y = this.transform.position.y - collider.getHeight() * collider.offsety;
        }
        this._initialized = true;
    }
};