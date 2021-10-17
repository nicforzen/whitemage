import { Vector2 } from "../physics/vector.js";
import { Rigidbody } from "../physics/rigidbody.js";

export function GameObject(name){
    this.name = name;
    this.renderer = null;
    this.scale = 1;
    this.components = [];
    this.colliders = [];
    this.controller = null;
    this.metadata = {};
    this.instance = null;
    this.parent = null;
    this.subObjects = [];
    this.localScale = 1;
    this.animator = null;
    this._initialized = false;
    this.id = 0;
    this.layer = 0;
    this.isUiItem = false;
    this._isDestroyed = false;
    this.activeSelf = true;

    this.rigidbody = null;
    this.transform = {
        position: new Vector2(),
        localPosition: new Vector2(),
        _calculatedPosition: new Vector2(),
        _calculatedRotation: {
            radians: 0
        },
        rotation: {
            radians: 0
        },
        localRotation: {
            radians: 0
        }
    };
}

GameObject.prototype.addComponent = function(component){
    component.gameObject = this;
    if(component instanceof Rigidbody) {
        if(this.rigidbody){
            throw 'Object already has a Rigidbody!';
        }
        this.rigidbody = component;
    }
    this.components.push(component);
};
GameObject.prototype.removeComponentById = function(id){
    for (var i = 0; i < this.components.length; i++) {
        let component = this.components[i];
        if(component.id == id){
            if(component instanceof Rigidbody){
                this.rigidbody = null;
            }

            this.components.splice(i, 1);
            i -= 1;
        }
    }
};
// GameObject.prototype.addCollider = function(collider){
//     collider.gameObject = this;
//     collider.x = this.transform.position.x - collider.getWidth() * collider.offsetx;
//     collider.y = this.transform.position.y - collider.getHeight() * collider.offsety;
//     this.colliders.push(collider);
// };
GameObject.prototype.setAnimator = function(animator){
    animator.gameObject = this;
    this.animator = animator;
};
GameObject.prototype.addSubobject = function(obj){
    obj.parent = this;
    obj.instance = this.instance;
    obj.scale = this.scale;
    this.subObjects.push(obj);
    if(this.instance != null){
        if(this.isUiItem){
            this.instance.addUiItem(obj);
        }else{
            this.instance.addObject(obj);
        }
    }
};
GameObject.prototype.setInstance = function(instance){
    this.instance = instance;
    for(var i = 0; i < this.subObjects.length; i++){
        this.subObjects[i].setInstance(instance);
    }
};
GameObject.prototype.setActive = function(value){
    this.activeSelf = value;
};
// GameObject.prototype.collidesAt = function(x, y){
//     for(var i = 0; i < this.colliders.length; i++){
//         let collider = this.colliders[i];
//         console.log(x+" "+y+collider.toString());
//         // TODO fix
//         // if(collider.type == "b"){
//         //     if(boxColliderPointCollision(x, y, collider)) return true;
//         // }
//     }
//     return false;
// };
GameObject.prototype.initialize = function(){
    // TODO MAKE COMPONENTS HAVE OWN INITIALIZATION, USE DIRTY VARIABLE FOR LESS LOOP CHECKS
    if(!this._initialized){
        for (var i = 0; i < this.components.length; i++) {
            let component = this.components[i];
            if(component.initialize) component.initialize();
        }

        this._initialized = true;
    }
};