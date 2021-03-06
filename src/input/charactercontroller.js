import { Vector2 } from "../physics/vector.js";
import { Script } from "../control/script.js";
import { Time } from "../util/time.js";

export function CharacterController(isPlayerControlled, speed) {
    let script = new Script();
    script.update = function() {
        this.gameObject.rigidbody.velocity.x = 0;
        this.gameObject.rigidbody.velocity.y = 0;

        var direction = new Vector2();

        let instance = this.gameObject.instance;
        // TODO this is broken
        let input = instance.input;
        let controller = this.gameObject.controller;

        let isInputting = !instance.isServer &&
            (input.isDown("W") || input.isDown("A") || input.isDown("S") || input.isDown("D"));
        if(input && isPlayerControlled && isInputting){
            direction.x = 0;
            direction.y = 0;
            if(input.isDown("W")){
                direction.y = -1;
            }
            if(input.isDown("A")){
                direction.x = -1;
            }
            if(input.isDown("S")){
                direction.y = 1;
            }
            if(input.isDown("D")){
                direction.x = 1;
            }
            if(controller){
                controller.clearMoveTarget();
            }
        } else {
            if(controller){
                direction = controller.getTargetDirectionVector(this.gameObject.transform.position.x,
                    this.gameObject.transform.position.y);
            }
        }

        direction = direction.normalize();
        this.gameObject.rigidbody.velocity.x = direction.x * speed;
        this.gameObject.rigidbody.velocity.y = direction.y * speed;

        // Don't overshoot target
        if(controller && isInputting){
            let target = controller.moveTarget;
            if(target){
                if(this.gameObject.transform.position.x < target.x && this.gameObject.transform.position.x +
                    this.gameObject.rigidbody.velocity.x * Time.deltaTime > target.x
                    || this.gameObject.transform.position.x > target.x && this.gameObject.transform.position.x +
                    this.gameObject.rigidbody.velocity.x * Time.deltaTime < target.x){
                        this.gameObject.rigidbody.velocity.x = (target.x - this.gameObject.transform.position.x) / Time.deltaTime;
                }
                if(this.gameObject.transform.position.y < target.y && this.gameObject.transform.position.y +
                    this.gameObject.rigidbody.velocity.y * Time.deltaTime > target.y
                    || this.gameObject.transform.position.y > target.y && this.gameObject.transform.position.y +
                    this.gameObject.rigidbody.velocity.y * Time.deltaTime < target.y){
                    this.gameObject.rigidbody.velocity.y = (target.y - this.gameObject.transform.position.y) / Time.deltaTime;
                }
            }

            let nextX = this.gameObject.transform.position.x + this.gameObject.rigidbody.velocity.x * Time.deltaTime;
            let nextY = this.gameObject.transform.position.y + this.gameObject.rigidbody.velocity.y * Time.deltaTime;
            controller.setMoveTarget(nextX, nextY);
        }
    };
    return script;
}