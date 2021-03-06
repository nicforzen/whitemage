

import { PlayerPrefs } from './playerprefs.js';
import { Input } from "../input/input.js";
import { Assets } from "../ux/assets.js";
import { Sound } from "../ux/sound.js";
import { Render } from "../ux/render.js";
import { Util } from '../util/util.js';
import { Script } from './script.js';

import * as planck from 'planck';
import { Time } from '../util/time.js';
import { Physics } from '../physics/physics.js';

export function Instance(scene) {
    this._objId = 0;
    this.driver = null;
    this.isServer = false;
    this.scene = scene;
    this.render = new Render();
    if(this.render) this.render.setInstance(this);
    this.lastTime = new Date().getTime();
    this.assets = new Assets();
    this.sound = new Sound();
    if(this.sound) this.sound.setInstance(this);
    this.camera = null;

    this._gameObjects = [];
    this._gameObjectsAddBuffer = [];
    this._cullCount = 0;
    this._uiItems = [];
    this._socket = null;

    this.hadError = false;
    this.initialized = false;
    this.bgm = null;

    this._positionIterations = 2;
    this._velocityIterations = 5;
    this._eventsInitialized = false;
    this.setScene(scene);
}

Instance.prototype.setScene = function(scene){
    delete this._b2World;

    // TODO clean from constructor

    this.scene = scene;
    this.camera = null;

    // TODO clear assets and sound
    this.hadError = false;
    this.initialized = false;

    if(this.scene){ 
        this.scene.setInstance(this);
    }

    this._b2World = planck.World(planck.Vec2(Physics.gravity.x, Physics.gravity.y));
};
Instance.prototype.initialize = function(canvas, localStorage) {
    this.initialized = true;
    if(!this.isServer){
        PlayerPrefs._setPrefs(localStorage);
        this.render._canvas = canvas;
        this.render._ctx = canvas.getContext('2d');

        if(!this._eventsInitialized){
            this._eventsInitialized = true;
            window.addEventListener('keydown', Input._onKeyDown.bind(Input), false);
            window.addEventListener('keyup', Input._onKeyUp.bind(Input), false);
            window.addEventListener('blur', Input._onLostFocus.bind(Input), false);
            canvas.addEventListener('touchstart', Input._touchStart.bind(Input), false);
            canvas.addEventListener('touchend', Input._touchEnd.bind(Input), false);
            canvas.addEventListener('touchmove', Input._touchMove.bind(Input), false);
            canvas.addEventListener('mousedown', Input._onMouseDown.bind(Input), false);
            canvas.addEventListener('mouseup', Input._onMouseUp.bind(Input), false);
            canvas.addEventListener('mousemove', Input._onMouseMove.bind(Input), false);
            canvas.addEventListener('mouseout', Input._onMouseLeave.bind(Input), false);
            canvas.addEventListener('mouseleave', Input._onMouseLeave.bind(Input), false);
            canvas.addEventListener('contextmenu', function (e) { e.preventDefault(); }, false);
        }
        canvas.focus();
        // canvas.addEventListener("wheel", function(e) {
        //     const delta = Math.sign(e.deltaY);
        //     this.input.scroll(delta);
        // }.bind(this));
        this._b2World.on('pre-solve', function(contact) {
            let obj1 = contact.getFixtureA().getBody().getUserData();
            let obj2 = contact.getFixtureB().getBody().getUserData();
            if(obj1.isUiItem || obj2.isUiItem || obj1._isDestroyed || obj2._isDestroyed ||
                Physics.getIgnoreLayerCollision(obj1.layer, obj2.layer)){
                contact.setEnabled(false);
                return;
            }
        }.bind(this));
        this._b2World.on('begin-contact', function(contact) {
            let obj1 = contact.getFixtureA().getBody().getUserData();
            let obj2 = contact.getFixtureB().getBody().getUserData();
            if(obj1._isDestroyed || obj2._isDestroyed) return;

            // Add to stay bodies
            if(obj1.rigidbody) obj1.rigidbody._collisionStayBodies.push(obj2);
            if(obj2.rigidbody) obj2.rigidbody._collisionStayBodies.push(obj1);

            for (let i = 0; i < this._gameObjects.length; i++) {
                let gameObj = this._gameObjects[i];
                if(!gameObj.activeSelf) continue;
                if(gameObj === obj1){
                    for(let j=0;j<gameObj.components.length;j++){
                        let component = gameObj.components[j];
                        if(component instanceof Script && component.enabled && component.onCollisionEnter) component.onCollisionEnter(obj2);
                    }
                }
                if(gameObj === obj2){
                    for(let j=0;j<gameObj.components.length;j++){
                        let component = gameObj.components[j];
                        if(component instanceof Script && component.enabled && component.onCollisionEnter) component.onCollisionEnter(obj1);
                    }
                }
            }
        }.bind(this));
        this._b2World.on('end-contact', function(contact) {
            let obj1 = contact.getFixtureA().getBody().getUserData();
            let obj2 = contact.getFixtureB().getBody().getUserData();
            if(obj1._isDestroyed || obj2._isDestroyed) return;

            // Remove from stay bodies
            if(obj1.rigidbody) Util.removeFromArray(obj2, obj1.rigidbody._collisionStayBodies);
            if(obj2.rigidbody) Util.removeFromArray(obj1, obj2.rigidbody._collisionStayBodies);

            for (let i = 0; i < this._gameObjects.length; i++) {
                let gameObj = this._gameObjects[i];
                if(!gameObj.activeSelf) continue;
                if(gameObj === obj1){
                    for(let j=0;j<gameObj.components.length;j++){
                        let component = gameObj.components[j];
                        if(component instanceof Script && component.enabled && component.onCollisionExit) component.onCollisionExit(obj2);
                    }
                }
                if(gameObj === obj2){
                    for(let j=0;j<gameObj.components.length;j++){
                        let component = gameObj.components[j];
                        if(component instanceof Script && component.enabled && component.onCollisionExit) component.onCollisionExit(obj1);
                    }
                }
            }
        }.bind(this));
    }

    if(this.scene.loadAssets) this.scene.loadAssets();
};
Instance.prototype.useAntiAliasing = function(use){
    this.render.useAntiAliasing(use);
};
Instance.prototype.setDriver = function(driver){
    this.driver = driver;
};
Instance.prototype.getNewObjectId = function(){
    let id = this._objId;
    this._objId += 1;
    return id;
};
Instance.prototype.error = function(message){
    console.error("ERROR: " + message);
    console.error(message.stack);
    this.hadError = true;
};
Instance.prototype.addObject = function(gameObj){
    if(!gameObj) return;
    gameObj.setInstance(this);
    this._gameObjectsAddBuffer.push(gameObj);
    for(var i = 0; i < gameObj.subObjects.length; i++){
        this.addObject(gameObj.subObjects[i]);
    }
    return gameObj;
};
Instance.prototype.addUiItem = function(gameObj){
    if(!gameObj) return;
    gameObj.setInstance(this);
    gameObj.isUiItem = true;
    this._uiItems.push(gameObj);
    for(let i = 0; i < gameObj.subObjects.length; i++){
        this.addUiItem(gameObj.subObjects[i]);
    }
    return gameObj;
};
Instance.prototype._cullDestroyedObjects = function(){
    if(this._cullCount == 0) return;
    this._cullCount = 0;
    for(let i = 0; i < this._gameObjects.length; i++){
        if(this._gameObjects[i]._isDestroyed){
            this._gameObjects.splice(i, 1);
            i -= 1;
        }
    }
};
Instance.prototype.destroyObject = function(gameObj){
    if(!gameObj) return;
    gameObj._isDestroyed = true;
    this._cullCount += 1;
    for(let i = 0; i < gameObj.subObjects.length; i++){
        this.destroyObject(gameObj.subObjects[i]);
    }
    if(gameObj.rigidbody){
        this._b2World.destroyBody(gameObj.rigidbody._b2Body);
    }
    if(gameObj.activeSelf){
        for(let j=0;j<gameObj.components.length;j++){
            let component = gameObj.components[j];
            if(component instanceof Script && component.enabled && component.onDestroy) component.onDestroy();
        }
    }
};
Instance.prototype.destroyObjectByName = function(name){
    for (let i = 0; i < this._gameObjects.length; i++) {
        let gameObj = this._gameObjects[i];
        if(gameObj.name == name){
            this.destroyObject(gameObj);
        }
    }
};
Instance.prototype.destroyObjectById = function(id){
    for (let i = 0; i < this._gameObjects.length; i++) {
        let gameObj = this._gameObjects[i];
        if(gameObj.id == id){
            this.destroyObject(gameObj);
        }
    }
};
Instance.prototype.findObjectByName = function(name){
    for (let i = 0; i < this._gameObjects.length; i++) {
        if(this._gameObjects[i].name == name) return this._gameObjects[i];
    }
    return null;
};
Instance.prototype.destroyUiItem = function(gameObj){
    if(!gameObj) return;
    for(let i = 0; i < gameObj.subObjects.length; i++){
        this.destroyUiItem(gameObj.subObjects[i]);
    }
    if(gameObj.activeSelf){
        for(let j=0;j<gameObj.components.length;j++){
            let component = gameObj.components[j];
            if(component instanceof Script && component.enabled && component.onDestroy) component.onDestroy();
        }
    }
    Util.removeFromArray(gameObj, this._uiItems);
};
Instance.prototype.destroyUiItemByName = function(name){
    for (let i = 0; i < this._uiItems.length; i++) {
        let gameObj = this._uiItems[i];
        if(gameObj.name == name){
            this.destroyUiItem(gameObj);
            i -= 1;
        }
    }
};
Instance.prototype.getGameObjects = function(){
    return this._gameObjects;
};
Instance.prototype.findUiItemByName = function(name){
    for (let i = 0; i < this._uiItems.length; i++) {
        if(this._uiItems[i].name == name) return this._uiItems[i];
    }
    return null;
};
Instance.prototype.setNetworkConnection = function(socket){
    socket.setInstance(this);
    this._socket = socket;
};
Instance.prototype.getNetworkConnection = function(){
    if(!this._socket) return null;
    return this._socket;
};
Instance.prototype._gameLoop = function() {
    if(this.hadError) return;

    if(!this.initialized){
        this.error("Instance must be initialized before running");
    }

    if(!this.scene.initialized){
        if(this.scene.start) this.scene.start();
        this.scene.initialized = true;
        return;
    }

    try{
        // Get the times since last frame
        let time = new Date().getTime();
        let deltaTime = (time - this.lastTime) / 1000;
        let countdownTime = deltaTime + Time._lastPhysicsLeftover;
        Time.deltaTime = Time.fixedDeltaTime;
        Time.deltaTime *= Time.timeScale;
        
        // Physics loop
        if(Time.deltaTime > 0){
            while(countdownTime >= Time.fixedDeltaTime){
                countdownTime -= Time.fixedDeltaTime;
                this._fixedUpdate();
                this._cullDestroyedObjects();
                this._fixedUpdateUi();
                this._updatePhysics();
                this._dispatchCollisionStayEvents();
            }
            Time._lastPhysicsLeftover = countdownTime;
            Time.deltaTime = deltaTime * Time.timeScale;
        }

        // Process mouse and keyboard/controller events
        Input._processEvents(this);

        // Update objects
        this._update();
        this._cullDestroyedObjects();
        this._updateUi();

        // Animation updates should go here, see lifecycle

        // Late Update objects
        this._postUpdate();
        this._cullDestroyedObjects();
        this._postUpdateUi();

        // Process objects that were added or destroyed and clean up
        this._processObjectBuffers();
        Input._clearUpKeys();
        this.lastTime = time;

        // Sync transforms
        this._syncCalculatedTransforms();

        // Render the frame on the screen
        this.render.renderFrame();
    }catch(err){
        this.error(err);
    }
};
Instance.prototype._syncCalculatedTransforms = function() {
    // TODO SYNC SCALE
    // TODO SYNC RADIANS

    for(let i = 0; i < this._gameObjects.length; i++){
        let o = this._gameObjects[i];
        // TODO aren't pos and localPos the same in Unity if not parented?
        o.transform._calculatedPosition.x = o.transform.position.x + o.transform.localPosition.x;
        o.transform._calculatedPosition.y = o.transform.position.y + o.transform.localPosition.y;
        o.transform._calculatedRotation.radians = o.transform.rotation.radians + o.transform.localRotation.radians;
        // TODO fix parent positioning
        if(o.parent){
            o.transform._calculatedPosition.x += o.parent.transform._calculatedPosition.x;
            o.transform._calculatedPosition.y += o.parent.transform._calculatedPosition.y;

            // TODO don't do this, way too expensive
            if(o.parent.transform._calculatedRotation.radians != 0){
                //Temporary
                o.transform._calculatedRotation.radians += o.parent.transform._calculatedRotation.radians;
            }
        }
    }

    // Sync UI items
    for(let i = 0; i < this._uiItems.length; i++){
        let o = this._uiItems[i];
        // TODO aren't pos and localPos the same in Unity if not parented?
        o.transform._calculatedPosition.x = o.transform.position.x + o.transform.localPosition.x;
        o.transform._calculatedPosition.y = o.transform.position.y + o.transform.localPosition.y;
        o.transform._calculatedRotation.radians = o.transform.rotation.radians + o.transform.localRotation.radians;
        // TODO fix parent positioning
        if(o.parent){
            o.transform._calculatedPosition.x += o.parent.transform._calculatedPosition.x;
            o.transform._calculatedPosition.y += o.parent.transform._calculatedPosition.y;

            // TODO don't do this, way too expensive
            if(o.parent.transform._calculatedRotation.radians != 0){
                //Temporary
                o.transform._calculatedRotation.radians += o.parent.transform._calculatedRotation.radians;
            }
        }
    }
};
Instance.prototype._processObjectBuffers = function(){
    for(let i = 0; i < this._gameObjectsAddBuffer.length; i++){
        this._gameObjects.push(this._gameObjectsAddBuffer[i]);
    }

    this._gameObjectsAddBuffer = [];
};
Instance.prototype._dispatchCollisionStayEvents = function(){
    for(let i = 0; i < this._gameObjects.length; i++){
        let o = this._gameObjects[i];
        if(!o.rigidbody) continue;
        if(o.rigidbody._collisionStayBodies.length == 0) continue;
        let sBuffer = [];
        // Find all scripts in this object with onCollisionStay
        for(let j = 0; j < o.components.length; j++){
            let script = o.components[j];
            if(!(script instanceof Script)) continue;
            if(script.onCollisionStay && script.enabled) sBuffer.push(script);
        }
        // Execute script on all stay bodies
        for(let j = 0; j < o.rigidbody._collisionStayBodies.length; j++){
            for(let k = 0; k < sBuffer.length; k++){
                sBuffer[k].onCollisionStay(o.rigidbody._collisionStayBodies[j]);
            }
        }
    }
};
Instance.prototype._updatePhysics = function(){
    let allObjects = this._gameObjects.concat(this._uiItems);
    for(let i=0;i<allObjects.length;i++){
        let gameObj = allObjects[i];
        gameObj.initialize();
        if(!gameObj.rigidbody) continue;
        gameObj.rigidbody._b2Body.setPosition(planck.Vec2(gameObj.transform.position.x, gameObj.transform.position.y));
        gameObj.rigidbody._b2Body.setLinearVelocity(planck.Vec2(gameObj.rigidbody.velocity.x, gameObj.rigidbody.velocity.y));
        gameObj.rigidbody._b2Body.setAngle(gameObj.transform.rotation.radians);
    }
    this._b2World.step(Time.deltaTime, this._velocityIterations, this._positionIterations);
    for(let i=0;i<allObjects.length;i++){
        let gameObj = allObjects[i];
        if(!gameObj.rigidbody) continue;
        let position = gameObj.rigidbody._b2Body.getPosition();
        gameObj.transform.position.x = position.x;
        gameObj.transform.position.y = position.y;
        let velocity = gameObj.rigidbody._b2Body.getLinearVelocity();
        gameObj.rigidbody.velocity.x = velocity.x;
        gameObj.rigidbody.velocity.y = velocity.y;
        gameObj.transform.rotation.radians = gameObj.rigidbody._b2Body.getAngle();
    }
};
Instance.prototype._fixedUpdate = function() {
    for(let i=0;i<this._gameObjects.length;i++){
        let gameObj = this._gameObjects[i];
        if(!gameObj.activeSelf) continue;
        gameObj.initialize();
        for(let j=0;j<gameObj.components.length;j++){
            let script = gameObj.components[j];
            if(!(script instanceof Script)) continue;
            if(script.fixedUpdate && script.enabled) script.fixedUpdate();
        }
    }
};
Instance.prototype._update = function() {
    for(let i=0;i<this._gameObjects.length;i++){
        let gameObj = this._gameObjects[i];
        if(!gameObj.activeSelf) continue;
        gameObj.initialize();
        for(let j=0;j<gameObj.components.length;j++){
            let script = gameObj.components[j];
            if(!(script instanceof Script)) continue;
            if(script.update && script.enabled) script.update();
        }
    }
};
Instance.prototype._postUpdate = function() {
    for(let i=0;i<this._gameObjects.length;i++){
        let gameObj = this._gameObjects[i];
        if(!gameObj.activeSelf) continue;
        gameObj.initialize();
        for(let j=0;j<gameObj.components.length;j++){
            let script = gameObj.components[j];
            if(!(script instanceof Script)) continue;
            if(script.lateUpdate && script.enabled) script.lateUpdate();
        }
        if(gameObj.animator) gameObj.animator.advance(Time.deltaTime);
    }
};
Instance.prototype._fixedUpdateUi = function() {
    for(let i=0;i<this._uiItems.length;i++){
        let gameObj = this._uiItems[i];
        if(!gameObj.activeSelf) continue;
        gameObj.initialize();
        for(let j=0;j<gameObj.components.length;j++){
            let script = gameObj.components[j];
            if(!(script instanceof Script)) continue;
            if(script.fixedUpdate && script.enabled) script.fixedUpdate();
        }
    }
};
Instance.prototype._updateUi = function() {
    for(let i=0;i<this._uiItems.length;i++){
        let gameObj = this._uiItems[i];
        if(!gameObj.activeSelf) continue;
        gameObj.initialize();
        for(let j=0;j<gameObj.components.length;j++){
            let script = gameObj.components[j];
            if(!(script instanceof Script)) continue;
            if(script.update && script.enabled) script.update();
        }
    }
};
Instance.prototype._postUpdateUi = function() {
    for(let i=0;i<this._uiItems.length;i++){
        let gameObj = this._uiItems[i];
        if(!gameObj.activeSelf) continue;
        gameObj.initialize();
        for(let j=0;j<gameObj.components.length;j++){
            let script = gameObj.components[j];
            if(!(script instanceof Script)) continue;
            if(script.lateUpdate && script.enabled) script.lateUpdate();
        }
        if(gameObj.animator) gameObj.animator.advance(Time.deltaTime);
    }
};
Instance.prototype.destroy = function(){
    this.initialized = false;
    this._gameObjects = [];
    this._uiItems = [];
};