function Animation(frames, loop) {
    this.timer = 0;
    this.frames = frames;
    this.currentFrame = 0;
    this.loop = (loop !== undefined) ? loop : true;
}

Animation.prototype.advance = function(time){
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
};
Animation.prototype.getImageName = function(){
    return this.frames[this.currentFrame].sprite.imageName;
};
Animation.prototype.getSpriteName = function(){
    return this.frames[this.currentFrame].sprite.spriteName;
};
Animation.prototype.getIsFlippedX = function(){
    return this.frames[this.currentFrame].sprite.isFlippedX;
};
Animation.prototype.getIsFlippedY = function(){
    return this.frames[this.currentFrame].sprite.isFlippedY;
};
Animation.prototype.reset = function(){
    this.timer = 0;
    this.currentFrame = 0;
};