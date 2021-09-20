
import * as planck from 'planck';
import { RigidbodyType } from './rigidbodytype';

export function CircleCollider(radius){
    this.gameObject = null;
    this.radius = radius || 1;

    this.bounce = 0;
    this.friction = 0.2;

    this._initialized = false;
    this._b2Fixture = null;
}

CircleCollider.prototype.initialize = function(){
    if(!this._initialized){
        if(this.gameObject.rigidbody && this.gameObject.rigidbody._b2Body){
            var dynamic = planck.Circle(this.radius);
            let density = 1;
            if(this.gameObject.rigidbody.bodyType == RigidbodyType.STATIC) density = 0;
            var fixtureDef = {
                shape: dynamic,
                density: density,
                friction: this.friction,
                restitution: this.bounce
            };
            this._b2Fixture = this.gameObject.rigidbody._b2Body.createFixture(fixtureDef);    
            this._initialized = true;
        }
    }
}