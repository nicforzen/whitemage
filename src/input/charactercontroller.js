export function CharacterController(isPlayerControlled, speed) {
    let script = new Script();
    script.onUpdate = function() {
        this.gameObject.velocity.x = 0;
        this.gameObject.velocity.y = 0;

        var direction = new Vector(0,0);

        let instance = this.gameObject.instance;
        let input = instance.input;
        let controller = this.gameObject.controller;

        let isInputting = !instance.isServer &&
            (input.isDown("W") || input.isDown("A") || input.isDown("S") || input.isDown("D"))
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
                direction = controller.getTargetDirectionVector(this.gameObject.x, this.gameObject.y);
            }
        }

        direction = direction.normalize();
        this.gameObject.velocity.x = direction.x * speed;
        this.gameObject.velocity.y = direction.y * speed;

        // Don't overshoot target
        if(controller && isInputting){
            let target = controller.moveTarget;
            if(target){
                if(this.gameObject.x < target.x && this.gameObject.x +
                    this.gameObject.velocity.x * instance.deltaTime > target.x
                    || this.gameObject.x > target.x && this.gameObject.x +
                    this.gameObject.velocity.x * instance.deltaTime < target.x){
                        this.gameObject.velocity.x = (target.x - this.gameObject.x) / instance.deltaTime;
                }
                if(this.gameObject.y < target.y && this.gameObject.y +
                    this.gameObject.velocity.y * instance.deltaTime > target.y
                    || this.gameObject.y > target.y && this.gameObject.y +
                    this.gameObject.velocity.y * instance.deltaTime < target.y){
                    this.gameObject.velocity.y = (target.y - this.gameObject.y) / instance.deltaTime;
                }
            }

            let nextX = this.gameObject.x + this.gameObject.velocity.x * instance.deltaTime;
            let nextY = this.gameObject.y + this.gameObject.velocity.y * instance.deltaTime;
            controller.setMoveTarget(nextX, nextY);
        }
    }
    return script;
}