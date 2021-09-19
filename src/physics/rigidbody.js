import { Vector2 } from "./vector.js"

import * as planck from 'planck';

export function Rigidbody(){
    this.gameObject = null;
    this.velocity = new Vector2();
    this.mass = 1; // TODO use this

    this._initialized = false;
    this._b2Body = null;
}

Rigidbody.prototype.initialize = function() {
    if(!this._initialized){
        let bodyDef = {
            type: 'dynamic',
            position: planck.Vec2(0.0, 0.0),
        }
        this._b2Body = this.gameObject.instance._b2World.createBody(bodyDef);

        this._initialized = true;
    }
};