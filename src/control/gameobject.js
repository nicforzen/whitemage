export function GameObject(name){
    this.name = name;
    this.stationary = false;
    this.renderer = null;
    this.velocity = {x: 0.0, y: 0.0};
    this.x = 0;
    this.y = 0;
    this.scale = 1;
    this.angleInRadians = 0;
    this.scripts = [];
    this.colliders = [];
    this.controller = null;
    this.components = {};
    this.instance = null;
    this.parent = null;
    this.subObjects = [];
    this.localX = 0;
    this.localY = 0;
    this.localScale = 1;
    this.animator = null;
    this.p_initialized = false;
    this.id = 0;
}

GameObject.prototype = {
    addScript: function(script){
        script.gameObject = this;
        this.scripts.push(script);
    },
    removeScriptById(id){
        for (var i = 0; i < this.scripts.length; i++) {
            let script = this.scripts[i];
            if(script.id == id){
                this.scripts.splice(i, 1);
                i -= 1;
            }
        }
    },
    addCollider: function(collider){
        collider.gameObject = this;
        collider.x = this.x - collider.getWidth() * collider.offsetx;
        collider.y = this.y - collider.getHeight() * collider.offsety;
        this.colliders.push(collider);
    },
    setAnimator: function(animator){
        animator.gameObject = this;
        this.animator = animator;
    },
    addSubobject: function(obj){
        obj.parent = this;
        obj.instance = this.instance;
        obj.x = this.x + obj.localX*this.scale;
        obj.y = this.y + obj.localY*this.scale;
        obj.scale = this.scale;
        this.subObjects.push(obj);
    },
    setInstance(instance){
        this.instance = instance;
        for(var i = 0; i < this.subObjects.length; i++){
            this.subObjects[i].setInstance(instance);
        }
    },
    collidesAt: function(x, y){
        for(var i = 0; i < this.colliders.length; i++){
            let collider = this.colliders[i];
            // if(collider.type == "b"){
            //     if(boxColliderPointCollision(x, y, collider)) return true;
            // }
        }
        return false;
    },
    initialize(){
        if(!this.p_initialized){
            for(let a=0;a<this.colliders.length;a++){
                let collider = this.colliders[a];
                collider.x = this.x - collider.getWidth() * collider.offsetx;
                collider.y = this.y - collider.getHeight() * collider.offsety;
            }
            this.p_initialized = true;
        }
    }
}