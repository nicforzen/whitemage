export function Animator(onCalculateAnimation) {
    this.gameObject = null;
    this.onCalculateAnimation = onCalculateAnimation;
    this.currentAnimation = null;
    this.animations = {};
}

Animator.prototype = {
    addAnimation(name, animation){
        this.animations[name] = animation;
        this.calculateNewAnimation();
    },
    advance(time){
        if(this.currentAnimation) this.animations[this.currentAnimation].advance(time);
        this.calculateNewAnimation();
    },
    calculateNewAnimation(){
        if(this.onCalculateAnimation){
            let newAnimation = this.onCalculateAnimation(this.currentAnimation);
            if(this.currentAnimation != newAnimation){
                if(this.currentAnimation){
                    this.animations[this.currentAnimation].reset();
                }
                this.currentAnimation = newAnimation;
            }
        }
        let renderer = this.gameObject.renderer;
        if(renderer instanceof ImageRenderer){
            if(this.animations[this.currentAnimation]){
                renderer.imageName = this.animations[this.currentAnimation].getImageName();
                renderer.spriteName = this.animations[this.currentAnimation].getSpriteName();
                renderer.flipX = this.animations[this.currentAnimation].getIsFlippedX();
            }
        }
    }
};