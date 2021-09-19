
import * as planck from 'planck';

export function CircleCollider(radius){
    this.gameObject = null;
    this.radius = radius || 1;

    this.bounce = 0;
    this.friction = 0;

    this._initialized = false;
    this._b2Fixture = null;
}

CircleCollider.prototype.initialize = function(){
    if(!this._initialized){
        if(this.gameObject.rigidbody && this.gameObject.rigidbody._b2Body){
            var dynamic = planck.Circle(this.radius);
            var fixtureDef = {
                shape: dynamic,
                density: 1.0,
                friction: this.friction,
                restitution: this.bounce
            };
            this._b2Fixture = this.gameObject.rigidbody._b2Body.createFixture(fixtureDef);    
            this._initialized = true;
        }
    }
}