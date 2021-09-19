
import * as planck from 'planck';

export function BoxCollider(width, height){
    this.gameObject = null;
    this.width = width || 1;
    this.height = height || 1;

    this.bounce = 0;
    this.friction = 0;

    this._initialized = false;
    this._b2Fixture = null;
}

BoxCollider.prototype.initialize = function(){
    if(!this._initialized){
        if(this.gameObject.rigidbody && this.gameObject.rigidbody._b2Body){
            var dynamicBox = planck.Box(this.width/2, this.height/2);
            var fixtureDef = {
                shape: dynamicBox,
                density: 1.0,
                friction: this.friction,
                restitution: this.bounce
            };
            this._b2Fixture = this.gameObject.rigidbody._b2Body.createFixture(fixtureDef);    
            this._initialized = true;
        }
    }
}