import { Vector2 } from "./vector.js";
import { RigidbodyType } from "./rigidbodytype.js";
import * as planck from 'planck';
import { ForceMode } from "./forcemode.js";

export function Rigidbody(){
    this.gameObject = null;
    this.velocity = new Vector2();
    this.mass = 1; // TODO use this

    this.bodyType = RigidbodyType.DYNAMIC;
    this.gravityScale = 1;

    this._initialized = false;
    this._b2Body = null;
}

Rigidbody.prototype.initialize = function() {
    if(!this._initialized){
        let type = 'static';
        if(this.bodyType == RigidbodyType.DYNAMIC) type = 'dynamic';
        if(this.bodyType == RigidbodyType.KINEMATIC) type = 'kinematic';
        let bodyDef = {
            type: type,
            position: planck.Vec2(0.0, 0.0),
            gravityScale: this.gravityScale
        };
        this._b2Body = this.gameObject.instance._b2World.createBody(bodyDef);
        this._b2Body.setUserData(this.gameObject);

        this._initialized = true;
    }
};
Rigidbody.prototype.addForce = function(v, mode){
    if(v === undefined) throw "Invalid force vector: " + v;
    let mMode = mode === undefined ? ForceMode.FORCE : mode;
    if(this._initialized){
        if(mMode == ForceMode.FORCE){
            this._b2Body.applyForceToCenter(v, true);
        }else if(mMode == ForceMode.IMPULSE){
            this._b2Body.applyLinearImpulse(v, this._b2Body.getWorldCenter(), true);
        }else {
            throw "Unsupported ForceMode: " + mode;
        }

        let newVelocity = this._b2Body.getLinearVelocity();
        this.velocity = new Vector2(newVelocity.x, newVelocity.y);
    }
};