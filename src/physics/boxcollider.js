import * as planck from 'planck';
import { RigidbodyType } from './rigidbodytype';

export function BoxCollider(width, height){
    this.gameObject = null;
    this.width = width;
    this.height = height;
    if(this.width === undefined) this.width = 1;
    if(this.height === undefined) this.height = 1;

    this.bounce = 0;
    this.friction = 0.2;
    this.isTrigger = false;

    this._initialized = false;
    this._b2Fixture = null;
}

BoxCollider.prototype.initialize = function(){
    if(!this._initialized){
        if(this.gameObject.rigidbody && this.gameObject.rigidbody._b2Body){
            var dynamicBox = planck.Box(this.width/2, this.height/2);
            let density = 1;
            if(this.gameObject.rigidbody.bodyType == RigidbodyType.STATIC) density = 0;
            var fixtureDef = {
                shape: dynamicBox,
                density: density,
                friction: this.friction,
                restitution: this.bounce,
                isSensor: this.isTrigger
            };
            this._b2Fixture = this.gameObject.rigidbody._b2Body.createFixture(fixtureDef);    
            this._initialized = true;
        }
    }
};
BoxCollider.prototype.overlapPoint = function(point){
    if(!this._initialized) return false;
    return this._b2Fixture.testPoint(new planck.Vec2(point.x, point.y));
};