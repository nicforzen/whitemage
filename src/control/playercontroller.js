import { Vector } from '../physics/vector.js'

function PlayerController(x, y){
    this.moveTarget = null;
}

PlayerController.prototype = {
    setMoveTarget(x, y){
        if(this.moveTarget == null) this.moveTarget = {x: Math.floor(x), y: Math.floor(y)};
        else{
            this.moveTarget.x = Math.floor(x);
            this.moveTarget.y = Math.floor(y);
        }
    },
    clearMoveTarget(){
        this.moveTarget = null;
    },
    getTargetDirectionVector(x, y){
        let direction = new Vector(0,0);
        if(this.moveTarget){
            direction.x = this.moveTarget.x - x;
            direction.y = this.moveTarget.y - y;

            // Check if close enough
            if(Math.abs(direction.x) < 0.5 && Math.abs(direction.y) < 0.5) {
                direction.x = 0;
                direction.y = 0;
                this.clearMoveTarget();
            }
        }
        return direction;
    },
    toJson(){
        return JSON.stringify(this.moveTarget);
    }
};