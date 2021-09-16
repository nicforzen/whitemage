function Animation(frames, loop) {
    this.timer = 0;
    this.frames = frames;
    this.currentFrame = 0;
    this.loop = (loop !== undefined) ? loop : true;
}

Animation.prototype = {
    advance(time){
        if(this.frames.length <= 1) return;
        
        this.timer += time;
        while(this.timer >= this.frames[this.currentFrame].duration){
            this.timer -= this.frames[this.currentFrame].duration;
            this.currentFrame += 1;
            if(this.currentFrame >= this.frames.length){
                if(this.loop){
                    this.currentFrame = 0;
                }else {
                    this.currentFrame = this.frames.length - 1;
                }
            }
        }
    },
    getImageName(){
        return this.frames[this.currentFrame].sprite.imageName;
    },
    getSpriteName(){
        return this.frames[this.currentFrame].sprite.spriteName;
    },
    getIsFlippedX(){
        return this.frames[this.currentFrame].sprite.isFlippedX;
    },
    getIsFlippedY(){
        return this.frames[this.currentFrame].sprite.isFlippedY;
    },
    reset(){
        this.timer = 0;
        this.currentFrame = 0;
    }
};