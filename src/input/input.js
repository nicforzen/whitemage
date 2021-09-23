import { Script } from "../control/script";
import { BoxCollider } from "../physics/boxcollider";
import { CircleCollider } from "../physics/circlecollider";
import { Vec2 } from "planck";

// export function Input() {
//     this.keysDown = [];
//     this.keysUp = [];
//     this.instance = null;
// }

export var Input = {
    _keysDown: [],
    _keysUp: [],
    _miceDown: [false, false, false],
    _miceHeld: [false, false, false],
    _miceUp: [false, false, false],
    _mouseDownBuffer: [],
    _mouseUpBuffer: [],
    _mouseLeftBuffer: false,
    getMouseButtonDown(button){
        return this._miceDown[button];
    },
    getMouseButton(button){
        return this._miceHeld[button];
    },
    getMouseButtonUp(button){
        return this._miceUp[button];
    },
    getKeyDown(button){
        return this._keysDown.indexOf(button) >= 0;
    },
    getKey(button){

    },
    getKeyUp(button){
        return this.keysUp.indexOf(button) >= 0;
    },
    getAxis(){

    },
    getAxisRaw(){

    },
    getTouch(){

    },
    _onKeyDown(e){
        var key = String.fromCharCode(e.keyCode);
        if(this._keysDown.indexOf(key) < 0){
            this._keysDown.push(key);
        }
    },
    _onKeyUp(e){
        var key = String.fromCharCode(e.keyCode);
        let index = this._keysDown.indexOf(key);
        if(index > -1) this._keysDown.splice(index, 1);
        if (this._keysUp.indexOf(key) < 0) {
            this._keysUp.push(key);
        }
    },
    _clearUpKeys(){
        this._miceDown = [false, false, false];
        this._miceUp = [false, false, false];
        this._keysUp = [];
        this._keysDown = [];
    },
    _onMouseLeave(){
        console.log("ON MOUSE LEAVE");
        this._mouseLeftBuffer = true;
    },
    _processMouseLeftBuffer(){
        if(this._mouseLeftBuffer){
            this._miceHeld = [false, false, false];
        }
    },
    _onMouseDown(e){
        this._mouseDownBuffer.push(e);
    },
    _processOnMouseDown(e, instance){
        e.preventDefault();
        this._miceDown[e.which-1] = true;
        this._miceHeld[e.which-1] = true;
        let handled = false;

        // TODO SORT AND HANDLE

        // Look through UI items and try to match the click point to their colliders
        // if they have a script attached with onMouseDown
        var local = instance.render._getRawCursorPosition(e);
        var point = { x: local.x, y: local.y, button: e.which};
        if(point.x != null && point.y != null){
            for(let i=0;i<instance._uiItems.length;i++){
                let gameObj = instance._uiItems[i];
                let colliders = [];
                let hasMouseDown = false;
                for(let j=0;j<gameObj.components.length;j++){
                    if(gameObj.components[j] instanceof Script && gameObj.components[j].onMouseDown)
                        hasMouseDown = true;
                    if(gameObj.components[j] instanceof BoxCollider ||
                        gameObj.components[j] instanceof CircleCollider)
                        colliders.push(gameObj.components[j]);
                }
                if(!hasMouseDown) continue;
                for(let j=0;j<gameObj.components.length;j++){
                    let script = gameObj.components[j];
                    if(!(script instanceof Script) || !script.onMouseDown) continue;
                    for(let k = 0; k < colliders.length; k++){
                        if(colliders[k]._b2Fixture.testPoint(Vec2(point.x, point.y))){
                            handled = true;
                            script.onMouseDown(point);
                        }
                    }
                }
            }
        }

        if(handled) return;

        // Look through GameObjects and try to match the click point to their colliders
        // if they have a script attached with onMouseDown
        local = instance.render._getCursorPosition(e);
        point = { x: local.x, y: local.y, button: e.which};
        if(point.x != null && point.y != null){
            for(let i=0;i<instance._gameObjects.length;i++){
                let gameObj = instance._gameObjects[i];
                let colliders = [];
                let hasMouseDown = false;
                for(let j=0;j<gameObj.components.length;j++){
                    if(gameObj.components[j] instanceof Script && gameObj.components[j].onMouseDown)
                        hasMouseDown = true;
                    if(gameObj.components[j] instanceof BoxCollider ||
                        gameObj.components[j] instanceof CircleCollider)
                        colliders.push(gameObj.components[j]);
                }
                if(!hasMouseDown) continue;
                for(let j=0;j<gameObj.components.length;j++){
                    let script = gameObj.components[j];
                    if(!(script instanceof Script) || !script.onMouseDown) continue;
                    for(let k = 0; k < colliders.length; k++){
                        if(colliders[k]._b2Fixture.testPoint(Vec2(point.x, point.y))) script.onMouseDown(point);
                    }
                }
            }
        }
    },
    _onMouseUp(e){
        this._mouseUpBuffer.push(e);
    },
    _processOnMouseUp(e, instance){
        e.preventDefault();
        this._miceUp[e.which-1] = true;
        this._miceDown[e.which-1] = false;
        this._miceHeld[e.which-1] = false;
        let handled = false;

        // TODO SORT AND HANDLE
        // TODO ONLY ADD TO INPUT OBJECT IF IN BOUNDS

        // Look through UI items and try to match the click point to their colliders
        // if they have a script attached with onMouseUp
        var local = instance.render._getRawCursorPosition(e);
        var point = { x: local.x, y: local.y, button: e.which};
        if(point.x != null && point.y != null){
            for(let i=0;i<instance._uiItems.length;i++){
                let gameObj = instance._uiItems[i];
                let colliders = [];
                let hasMouseDown = false;
                for(let j=0;j<gameObj.components.length;j++){
                    if(gameObj.components[j] instanceof Script && gameObj.components[j].onMouseUp)
                        hasMouseDown = true;
                    if(gameObj.components[j] instanceof BoxCollider ||
                        gameObj.components[j] instanceof CircleCollider)
                        colliders.push(gameObj.components[j]);
                }
                if(!hasMouseDown) continue;
                for(let j=0;j<gameObj.components.length;j++){
                    let script = gameObj.components[j];
                    if(!(script instanceof Script) || !script.onMouseUp) continue;
                    for(let k = 0; k < colliders.length; k++){
                        if(colliders[k]._b2Fixture.testPoint(Vec2(point.x, point.y))){
                            handled = true;
                            script.onMouseUp(point);
                        }
                    }
                }
            }
        }

        if(handled) return;

        // Look through GameObjects and try to match the click point to their colliders
        // if they have a script attached with onMouseUp
        local = instance.render._getCursorPosition(e);
        point = { x: local.x, y: local.y, button: e.which};
        if(point.x != null && point.y != null){
            for(let i=0;i<instance._gameObjects.length;i++){
                let gameObj = instance._gameObjects[i];
                let colliders = [];
                let hasMouseDown = false;
                for(let j=0;j<gameObj.components.length;j++){
                    if(gameObj.components[j] instanceof Script && gameObj.components[j].onMouseUp)
                        hasMouseDown = true;
                    if(gameObj.components[j] instanceof BoxCollider ||
                        gameObj.components[j] instanceof CircleCollider)
                        colliders.push(gameObj.components[j]);
                }
                if(!hasMouseDown) continue;
                for(let j=0;j<gameObj.components.length;j++){
                    let script = gameObj.components[j];
                    if(!(script instanceof Script) || !script.onMouseUp) continue;
                    for(let k = 0; k < colliders.length; k++){
                        if(colliders[k]._b2Fixture.testPoint(Vec2(point.x, point.y))) script.onMouseUp(point);
                    }
                }
            }
        }
    },
    _processEvents(instance){
        this._processMouseLeftBuffer();
        for(let i = 0; i < this._mouseDownBuffer.length; i++){
            this._processOnMouseDown(this._mouseDownBuffer[i], instance);
        }
        for(let i = 0; i < this._mouseUpBuffer.length; i++){
            this._processOnMouseUp(this._mouseUpBuffer[i], instance);
        }

        this._mouseLeftBuffer = false;
        this._mouseDownBuffer = [];
        this._mouseUpBuffer = [];
    }
};

// Input.prototype.setInstance = function(instance){
//     this.instance = instance;
// };
// Input.prototype.onKeyDown = function(e){
//     var key = String.fromCharCode(e.keyCode);
//     if(this.keysDown.indexOf(key) < 0){
//         this.keysDown.push(key);
//     }
// };
// Input.prototype.onKeyUp = function(e){
//     var key = String.fromCharCode(e.keyCode);
//     let index = this.keysDown.indexOf(key);
//     if(index > -1) this.keysDown.splice(index, 1);
//     if (this.keysUp.indexOf(key) < 0) {
//         this.keysUp.push(key);
//     }
// };
// Input.prototype.touchStart = function(te){
//     te.preventDefault();
//     let touch = te.touches[0];
//     let obj = {
//         which: 1,
//         preventDefault(){},
//         clientX: touch.clientX,
//         clientY: touch.clientY
//     }
//     this.mouseDown(obj);
// };
// Input.prototype.mouseDown = function(e){
//     e.preventDefault();
//     var local = this.instance.render._getRawCursorPosition(e);
//     var point = { x: local.x, y: local.y, button: e.which};
//     // for(let i=0;i<this.instance._uiItems.length;i++){
//     //     let gameObj = this.instance._uiItems[i];
//     //     for(let j=0;j<gameObj.components.length;j++){
//     //         let script = gameObj.components[j];
//     //         if(!(script instanceof Script)) continue;
//     //         if(script.onMouseDown
//     //             && point.x != null && point.y != null){
//     //                 let handled = script.onMouseDown(point);
//     //                 if(handled) return;
//     //             }
//     //     }
//     // }
//     local = this.instance.render._getCursorPosition(e);
//     point = { x: local.x, y: local.y, button: e.which};
//     if(point.x != null && point.y != null){
//         for(let i=0;i<this.instance._gameObjects.length;i++){
//             let gameObj = this.instance._gameObjects[i];
//             let colliders = [];
//             for(let j=0;j<gameObj.components.length;j++){
//                 if(gameObj.components[i] instanceof BoxCollider ||
//                     gameObj.components[i] instanceof CircleCollider)
//                     colliders.push(gameObj.components[i]);
//             }
//             for(let j=0;j<gameObj.components.length;j++){
//                 let script = gameObj.components[j];
//                 if(!(script instanceof Script || !script.mouseDown)) continue;
//                 for(let k = 0; k < colliders.length; k++){
//                     if(colliders[k].overlapPoint(point.x, point.y)) script.onMouseDown(point);
//                 }
//             }
//         }
//     }
// };
// Input.prototype.touchEnd = function(te){
//     te.preventDefault();
//     // TODO fix up location
//     //let touch = te.touches[0];
//     let obj = {
//         which: 1,
//         preventDefault(){},
//         clientX: 0,
//         clientY: 0
//     }
//     this.mouseUp(obj);
// };
// Input.prototype.mouseUp = function(e){
//     e.preventDefault();
//     var local = this.instance.render._getRawCursorPosition(e);
//     var point = { x: local.x, y: local.y, button: e.which };
//     for(let i=0;i<this.instance._uiItems.length;i++){
//         let gameObj = this.instance._uiItems[i];
//         for(let j=0;j<gameObj.components.length;j++){
//             let script = gameObj.components[j];
//             if(!(script instanceof Script)) continue;
//             if(script.onMouseUp
//                 && point.x != null && point.y != null) {
//                     let handled = script.onMouseUp(point);
//                     if(handled) return;
//                 }
//         }
//     }
//     local = this.instance.render._getCursorPosition(e);
//     point = { x: local.x, y: local.y, button: e.which};
//     for(let i=0;i<this.instance._gameObjects.length;i++){
//         let gameObj = this.instance._gameObjects[i];
//         for(let j=0;j<gameObj.components.length;j++){
//             let script = gameObj.components[j];
//             if(!(script instanceof Script)) continue;
//             if(script.onMouseUp
//                 && point.x != null && point.y != null) script.onMouseUp(point);
//         }
//     }
// };
// Input.prototype.touchMove = function(te){
//     te.preventDefault();
//     let touch = te.touches[0];
//     let obj = {
//         which: 1,
//         preventDefault(){},
//         clientX: touch.clientX,
//         clientY: touch.clientY
//     }
//     this.mouseMove(obj);
// };
// Input.prototype.mouseMove = function(e){
//     e.preventDefault();
//     var local = this.instance.render._getRawCursorPosition(e);
//     if(local.x < 0 || local.y < 0) return;
//     var point = { x: local.x, y: local.y, button: e.which };
//     for(let i=0;i<this.instance._uiItems.length;i++){
//         let gameObj = this.instance._uiItems[i];
//         for(let j=0;j<gameObj.components.length;j++){
//             let script = gameObj.components[j];
//             if(!(script instanceof Script)) continue;
//             if(script.onMouseMove
//                 && point.x != null && point.y != null) script.onMouseMove(point);
//         }
//     }
//     local = this.instance.render._getCursorPosition(e);
//     point = { x: local.x, y: local.y, button: e.which};
//     for(let i=0;i<this.instance._gameObjects.length;i++){
//         let gameObj = this.instance._gameObjects[i];
//         for(let j=0;j<gameObj.components.length;j++){
//             let script = gameObj.components[j];
//             if(!(script instanceof Script)) continue;
//             if(script.onMouseMove
//                 && point.x != null && point.y != null) script.onMouseMove(point);
//         }
//     }
// };
// Input.prototype.scroll = function(delta){
//     for(let i=0;i<this.instance._gameObjects.length;i++){
//         let gameObj = this.instance._gameObjects[i];
//         for(let j=0;j<gameObj.components.length;j++){
//             let script = gameObj.components[j];
//             if(!(script instanceof Script)) continue;
//             if(script.onMouseScroll) script.onMouseScroll(delta);
//         }
//     }
// };
// Input.prototype.isDown = function(name){
//     return this.keysDown.indexOf(name) >= 0;
// };
// Input.prototype.isUp = function(name){
//     return this.keysUp.indexOf(name) >= 0;
// };
// Input.prototype._clearUpKeys = function(){
//     this.keysUp = [];
// };