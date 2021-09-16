

import { Camera } from './camera.js';
import { PlayerPrefs } from './playerprefs.js';
import { CollisionUtil } from '../physics/collider.js';
import { Input } from "../input/input.js";
import { Assets } from "../ux/assets.js";
import { Sound } from "../ux/sound.js";
import { Render } from "../ux/render.js";

export function Instance(scene) {
    this._objId = 0;
    this.isServer = false;
    this.scene = scene;
    this.input = new Input();
    if(this.input) this.input.setInstance(this);
    this.render = new Render();
    if(this.render) this.render.setInstance(this);
    this.deltaTime = 0;
    this.lastTime = new Date().getTime();
    this.assets = new Assets();
    this.sound = new Sound();
    if(this.sound) this.sound.setInstance(this);
    this.camera = new Camera(0, 0, 1);
    this.prefs = null;

    this.p_gameObjects = [];
    this.p_uiItems = [];
    this.p_socket = null;

    this.hadError = false;
    this.initialized = false;
    this.bgm = null;

    if(this.scene){ 
        this.scene.setInstance(this);
    }
}

Instance.prototype.initialize = function(gameWidth, gameHeight, canvas, localStorage) {
    this.initialized = true;
    if(!this.isServer){
        this.prefs = new PlayerPrefs();
        this.prefs.p_setPrefs(localStorage);
        this.render._canvas = canvas;
        this.render._ctx = canvas.getContext('2d');
        this.render._ctx.imageSmoothingEnabled = false;
        this.render.gameWidth = gameWidth;
        this.render.gameHeight = gameHeight;
        this.camera.fovX = gameWidth/2;
        this.camera.fovY = gameHeight/2;
        //this.camera.fovX = 0;
        //this.camera.fovY = 0;
        this.render.screenWidth = canvas.width;
        this.render.screenHeight = canvas.height;
        // TODO Make this smarter so you can scale down and still have v wings
        // Calculate scale factor
        this.render.scaleFactor = canvas.height / gameHeight;

        // Calculate wing widths
        if(canvas.width > canvas.height){
            this.render.wingWidthX = (canvas.width - gameWidth * this.render.scaleFactor) / 2;
        }else if(canvas.height > canvas.width){
            this.render.scaleFactor = canvas.width / gameWidth;
            this.render.wingWidthY = (canvas.height - gameHeight * this.render.scaleFactor) / 2;
        }

        window.addEventListener('keydown', this.input.onKeyDown.bind(this.input), false);
        window.addEventListener('keyup', this.input.onKeyUp.bind(this.input), false);
        canvas.addEventListener('mousedown', this.input.mouseDown.bind(this.input));
        canvas.addEventListener('mouseup', this.input.mouseUp.bind(this.input));
        canvas.addEventListener('mousemove', this.input.mouseMove.bind(this.input));
        canvas.addEventListener('contextmenu', function (e) { e.preventDefault(); });
        canvas.addEventListener("wheel", function(e) {
            const delta = Math.sign(e.deltaY);
            this.input.scroll(delta);
        }.bind(this));
    }

    if(this.scene.loadAssets) this.scene.loadAssets();
};

Instance.prototype.getNewObjectId = function(){
    let id = this._objId;
    this._objId += 1;
    return id;
};
Instance.prototype.error = function(message){
    console.error("ERROR: " + message);
    this.hadError = true;
    this.onMouseMove = null;
    this.onMouseDown = null;
    this.onMouseUp = null;
};
Instance.prototype.addObject = function(gameObj){
    if(!gameObj) return;
    gameObj.setInstance(this);
    this.p_gameObjects.push(gameObj);
    for(var i = 0; i < gameObj.subObjects.length; i++){
        this.p_gameObjects.push(gameObj.subObjects[i]);
    }
    return gameObj;
};
Instance.prototype.addUiItem = function(gameObj){
    if(!gameObj) return;
    gameObj.setInstance(this);
    this.p_uiItems.push(gameObj);
    for(let i = 0; i < gameObj.subObjects.length; i++){
        this.p_uiItems.push(gameObj.subObjects[i]);
    }
    return gameObj;
};
Instance.prototype.destroyObject = function(gameObj){
    if(!gameObj) return;
    for(let i = 0; i < gameObj.subObjects.length; i++){
        this.destroyObject(gameObj.subObjects[i]);
    }
    for(let j=0;j<gameObj.scripts.length;j++){
        let script = gameObj.scripts[j];
        if(script.onDestroy) script.onDestroy();
    }
    _removeArray(gameObj, this.p_gameObjects);
};
Instance.prototype.destroyObjectByName = function(name){
    for (let i = 0; i < this.p_gameObjects.length; i++) {
        let gameObj = this.p_gameObjects[i];
        if(gameObj.name == name){
            for(let k = 0; k < gameObj.subObjects.length; k++){
                this.destroyObject(gameObj.subObjects[k]);
            }
            for(let j=0;j<gameObj.scripts.length;j++){
                let script = gameObj.scripts[j];
                if(script.onDestroy) script.onDestroy();
            }
            this.p_gameObjects.splice(i, 1);
            i -= 1;
        }
    }
};
Instance.prototype.destroyObjectById = function(id){
    for (let i = 0; i < this.p_gameObjects.length; i++) {
        let gameObj = this.p_gameObjects[i];
        if(gameObj.id == id){
            for(var k = 0; k < gameObj.subObjects.length; k++){
                this.destroyObject(gameObj.subObjects[k]);
            }
            for(let j=0;j<gameObj.scripts.length;j++){
                let script = gameObj.scripts[j];
                if(script.onDestroy) script.onDestroy();
            }
            this.p_gameObjects.splice(i, 1);
            i -= 1;
        }
    }
};
Instance.prototype.findObjectByName = function(name){
    for (let i = 0; i < this.p_gameObjects.length; i++) {
        if(this.p_gameObjects[i].name == name) return this.p_gameObjects[i];
    }
    return null;
};
Instance.prototype.destroyUiItem = function(gameObj){
    if(!gameObj) return;
    for(let i = 0; i < gameObj.subObjects.length; i++){
        this.destroyUiItem(gameObj.subObjects[i]);
    }
    for(let j=0;j<gameObj.scripts.length;j++){
        let script = gameObj.scripts[j];
        if(script.onDestroy) script.onDestroy();
    }
    _removeArray(gameObj, this.p_uiItems);
};
Instance.prototype.destroyUiItemByName = function(name){
    for (let i = 0; i < this.p_uiItems.length; i++) {
        let gameObj = this.p_uiItems[i];
        if(gameObj.name == name){
            for(let k = 0; k < gameObj.subObjects.length; k++){
                this.destroyUiItem(gameObj.subObjects[k]);
            }
            for(let j=0;j<gameObj.scripts.length;j++){
                let script = gameObj.scripts[j];
                if(script.onDestroy) script.onDestroy();
            }
            this.p_uiItems.splice(i, 1);
            i -= 1;
        }
    }
};
Instance.prototype.getGameObjects = function(){
    return this.p_gameObjects;
};
Instance.prototype.findUiItemByName = function(name){
    for (let i = 0; i < this.p_uiItems.length; i++) {
        if(this.p_uiItems[i].name == name) return this.p_uiItems[i];
    }
    return null;
};
Instance.prototype.setNetworkConnection = function(socket){
    socket.setInstance(this);
    this.p_socket = socket;
};
Instance.prototype.getNetworkConnection = function(){
    if(!this.p_socket) return OfflineConnection();
    return this.p_socket;
};
Instance.prototype.p_gameLoop = function() {
    if(this.hadError) return;

    // TODO do something with this type of annotation. Needed?
    // #DEBUG
    if(!this.initialized){
        this.error("Instance must be initialized before running");
    }
    // #END

    let time = new Date().getTime();
    this.deltaTime = (time - this.lastTime) / 1000;
    this.p_update();
    this.p_postUpdate();
    this.p_dispatchCollisions();
    this.p_processMovement(this.deltaTime);
    this.p_updateUi();
    this.p_postUpdateUi();
    if(this.camera.followTarget){
        this.camera.x = this.camera.followTarget.x;
        this.camera.y = this.camera.followTarget.y;
    }
    this.render.renderFrame();
    this.lastTime = time;
    if(this.input) this.input.p_clearUpKeys();
};
Instance.prototype.p_update = function() {
    for(let i=0;i<this.p_gameObjects.length;i++){
        let gameObj = this.p_gameObjects[i];
        gameObj.initialize();
        for(let j=0;j<gameObj.scripts.length;j++){
            let script = gameObj.scripts[j];
            script.initialize();
            if(script.update) script.update();
        }
    }
};
Instance.prototype.p_postUpdate = function() {
    for(let i=0;i<this.p_gameObjects.length;i++){
        let gameObj = this.p_gameObjects[i];
        gameObj.initialize();
        for(let j=0;j<gameObj.scripts.length;j++){
            let script = gameObj.scripts[j];
            script.initialize();
            if(script.lateupdate) script.lateupdate();
        }
        if(gameObj.animator) gameObj.animator.advance(this.deltaTime);
    }
};
Instance.prototype.p_updateUi = function() {
    for(let i=0;i<this.p_uiItems.length;i++){
        let gameObj = this.p_uiItems[i];
        gameObj.initialize();
        for(let j=0;j<gameObj.scripts.length;j++){
            let script = gameObj.scripts[j];
            script.initialize();
            if(script.update) script.update();
        }
    }
};
Instance.prototype.p_postUpdateUi = function() {
    for(let i=0;i<this.p_uiItems.length;i++){
        let gameObj = this.p_uiItems[i];
        gameObj.initialize();
        for(let j=0;j<gameObj.scripts.length;j++){
            let script = gameObj.scripts[j];
            script.initialize();
            if(script.lateupdate) script.lateupdate();
        }
        if(gameObj.animator) gameObj.animator.advance(this.deltaTime);
    }
};
Instance.prototype.p_processMovement = function(timeDilation) {
    // Reconfigure velocities based on collisions
    for(let i=0;i<this.p_gameObjects.length;i++){
        let gameObj = this.p_gameObjects[i];
        if(gameObj.stationary) continue;

        // Skip checking colliders if there aren't any on this object
        if(gameObj.colliders.length==0) continue;

        // Check against other objects
        for(let a=0;a<this.p_gameObjects.length;a++){
            // Skip same object
            if(i==a) continue;

            let otherObj = this.p_gameObjects[a];
            // Skip all but stationary
            if(!otherObj.stationary) continue;

            // Skip checking colliders if there aren't any
            if(otherObj.colliders.length==0) continue;

            // Iterate over colliders
            for(b=0;b<gameObj.colliders.length;b++){
                if(!gameObj.colliders[b].solid) continue;
                // ... and other object colliders
                for(c=0;c<otherObj.colliders.length;c++){

                    // Check collision
                    if(CollisionUtil.isCollision(gameObj.colliders[b], otherObj.colliders[c], timeDilation)){
                        // Resolve
                        if(gameObj.colliders[b].type == "b" && otherObj.colliders[c].type == "b"){
                            CollisionUtil.resolveBoxBoxCollision(gameObj, b, otherObj, c, timeDilation);
                        }else if(gameObj.colliders[b].type == "b" && otherObj.colliders[c].type == "c") {
                            CollisionUtil.resolveBoxCircleCollision(gameObj.colliders[b], otherObj.colliders[c], timeDilation);
                        }else if(gameObj.colliders[b].type == "c" && otherObj.colliders[c].type == "b") {
                            CollisionUtil.resolveBoxCircleCollision(otherObj.colliders[c], gameObj.colliders[b], timeDilation);
                        }else if(gameObj.colliders[b].type == "c" && otherObj.colliders[c].type == "c") {
                            CollisionUtil.resolveCircleCircleCollision(gameObj.colliders[b], otherObj.colliders[c], timeDilation);
                        }
                    }
                }
            }
        }
    }

    // Finally, move objects
    for(let i=0;i<this.p_gameObjects.length;i++){
        let gameObj = this.p_gameObjects[i];
        if(gameObj.parent) continue;
        if(gameObj.stationary) continue;

        gameObj.x += gameObj.velocity.x * timeDilation;
        gameObj.y += gameObj.velocity.y * timeDilation;
        for(let a=0;a<gameObj.colliders.length;a++){
            let collider = gameObj.colliders[a];
            collider.x = gameObj.x - collider.getWidth() * collider.offsetx;
            collider.y = gameObj.y - collider.getHeight() * collider.offsety;
        }
    }
    // Move subobjects
    for(let i=0;i<this.p_gameObjects.length;i++){
        let gameObj = this.p_gameObjects[i];
        if(!gameObj.parent) continue;
        if(gameObj.stationary) continue;
        
        gameObj.scale = gameObj.localScale * gameObj.parent.scale;
        gameObj.x = gameObj.parent.x + gameObj.localX*gameObj.parent.scale;
        gameObj.y = gameObj.parent.y + gameObj.localY*gameObj.parent.scale;
        for(let a=0;a<gameObj.colliders.length;a++){
            let collider = gameObj.colliders[a];
            collider.x = gameObj.x - collider.getWidth() * collider.offsetx;
            collider.y = gameObj.y - collider.getHeight() * collider.offsety;
        }
    }
};
Instance.prototype.p_dispatchCollisions = function() {
    for(let i=0;i<this.p_gameObjects.length;i++){
        let gameObj = this.p_gameObjects[i];
        if(gameObj.stationary) continue;

        // Skip checking colliders if there aren't any on this object
        if(gameObj.colliders.length==0) continue;

        // Check against other objects
        for(let a=0;a<this.p_gameObjects.length;a++){
            // Skip same object
            if(i==a) continue;

            let otherObj = this.p_gameObjects[a];
            // Skip checking colliders if there aren't any
            if(otherObj.colliders.length==0) continue;

            // Iterate over colliders
            for(b=0;b<gameObj.colliders.length;b++){
                // ... and other object colliders
                for(c=0;c<otherObj.colliders.length;c++){
                    // Check collision
                    if(CollisionUtil.isCollision(gameObj.colliders[b], otherObj.colliders[c], this.deltaTime)){
                        // Iterate over scripts and look for collision functions
                        for(let j=0;j<gameObj.scripts.length;j++){
                            let script = gameObj.scripts[j];
                            if(script.onCollisionDetected) script.onCollisionDetected(otherObj);
                        }
                    }
                }
            }
        }
    }
};
Instance.prototype.destroy = function(){
    canvas.outerHTML = canvas.outerHTML;
    window.outerHTML = window.outerHTML;
};