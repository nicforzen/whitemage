import { Vector2 } from "../physics/vector.js";

import * as planck from 'planck';

export function GameObject(name){
    this.name = name;
    this.stationary = false;
    this.renderer = null;
    this.scale = 1;
    this.scripts = [];
    this.colliders = [];
    this.controller = null;
    this.components = {};
    this.instance = null;
    this.parent = null;
    this.subObjects = [];
    this.localScale = 1;
    this.animator = null;
    this._initialized = false;
    this.id = 0;

    this.rigidbody = {
        velocity: new Vector2(),
        mass: 1,
        _b2Body: null
    };
    this.transform = {
        position: new Vector2(),
        localPosition: new Vector2(),
        rotation: {
            radians: 0
        },
        localRotation: {
            radians: 0
        }
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
    obj.transform.position.x = this.transform.position.x + obj.transform.localPosition.x*this.scale;
    obj.transform.position.y = this.transform.position.y + obj.transform.localPosition.y*this.scale;
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
        console.log(x+" "+y+collider.toString());
        // TODO fix
        // if(collider.type == "b"){
        //     if(boxColliderPointCollision(x, y, collider)) return true;
        // }
    }
    return false;
};
GameObject.prototype.initialize = function(){
    // MAKE COMPONENTS HAVE OWN INITIALIZATION, USE DIRTY VARIABLE FOR LESS LOOP CHECKS
    if(!this._initialized){
        for(let a=0;a<this.colliders.length;a++){
            let collider = this.colliders[a];
            collider.x = this.transform.position.x - collider.getWidth() * collider.offsetx;
            collider.y = this.transform.position.y - collider.getHeight() * collider.offsety;
        }

        let bodyDef = {
            type: 'dynamic',
            position: planck.Vec2(0.0, 0.0),
        }
        this.rigidbody._b2Body = this.instance._b2World.createBody(bodyDef);

        // Define another box shape for our dynamic body.
        var dynamicBox = planck.Box(0.5, 0.5);

        // Define the dynamic body fixture.
        var fixtureDef = {
            shape: dynamicBox,
            // Set the box density to be non-zero, so it will be dynamic.
            density: 1.0,
            // Override the default friction.
            friction: 0.3,
            restitution: 0.5
        };
        this.rigidbody._b2Body.createFixture(fixtureDef);

        this._initialized = true;
    }
};