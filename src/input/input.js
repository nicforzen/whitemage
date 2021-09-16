export function Input() {
    this.keysDown = [];
    this.keysUp = [];
    this.instance = null;
}

Input.prototype = {
    setInstance(instance){
        this.instance = instance;
    },
    onKeyDown(e){
        var key = String.fromCharCode(e.keyCode);
        if(this.keysDown.indexOf(key) < 0){
            this.keysDown.push(key);
        }
    },
    onKeyUp(e){
        var key = String.fromCharCode(e.keyCode);
        let index = this.keysDown.indexOf(key);
        if(index > -1) this.keysDown.splice(index, 1);
        if (this.keysUp.indexOf(key) < 0) {
            this.keysUp.push(key);
        }
    },
    mouseDown(e){
        var local = this.instance.render._getRawCursorPosition(e);
        var point = { x: local.x, y: local.y, button: e.which};
        for(let i=0;i<this.instance.p_uiItems.length;i++){
            let gameObj = this.instance.p_uiItems[i];
            for(let j=0;j<gameObj.scripts.length;j++){
                let script = gameObj.scripts[j];
                if(script.onMouseDown
                    && point.x != null && point.y != null){
                        let handled = script.onMouseDown(point);
                        if(handled) return;
                    }
            }
        }
        local = this.instance.render._getCursorPosition(e);
        point = { x: local.x, y: local.y, button: e.which};
        for(let i=0;i<this.instance.p_gameObjects.length;i++){
            let gameObj = this.instance.p_gameObjects[i];
            for(let j=0;j<gameObj.scripts.length;j++){
                let script = gameObj.scripts[j];
                if(script.onMouseDown
                    && point.x != null && point.y != null) script.onMouseDown(point);
            }
        }
    },
    mouseUp(e){
        e.preventDefault();
        var local = this.instance.render._getRawCursorPosition(e);
        var point = { x: local.x, y: local.y, button: e.which };
        for(let i=0;i<this.instance.p_uiItems.length;i++){
            let gameObj = this.instance.p_uiItems[i];
            for(let j=0;j<gameObj.scripts.length;j++){
                let script = gameObj.scripts[j];
                if(script.onMouseUp
                    && point.x != null && point.y != null) {
                        let handled = script.onMouseUp(point);
                        if(handled) return;
                    }
            }
        }
        local = this.instance.render._getCursorPosition(e);
        point = { x: local.x, y: local.y, button: e.which};
        for(let i=0;i<this.instance.p_gameObjects.length;i++){
            let gameObj = this.instance.p_gameObjects[i];
            for(let j=0;j<gameObj.scripts.length;j++){
                let script = gameObj.scripts[j];
                if(script.onMouseUp
                    && point.x != null && point.y != null) script.onMouseUp(point);
            }
        }
    },
    mouseMove(e){
        var local = this.instance.render._getRawCursorPosition(e);
        if(local.x < 0 || local.y < 0) return;
        var point = { x: local.x, y: local.y, button: e.which };
        for(let i=0;i<this.instance.p_uiItems.length;i++){
            let gameObj = this.instance.p_uiItems[i];
            for(let j=0;j<gameObj.scripts.length;j++){
                let script = gameObj.scripts[j];
                if(script.onMouseMove
                    && point.x != null && point.y != null) script.onMouseMove(point);
            }
        }
        local = this.instance.render._getCursorPosition(e);
        point = { x: local.x, y: local.y, button: e.which};
        for(let i=0;i<this.instance.p_gameObjects.length;i++){
            let gameObj = this.instance.p_gameObjects[i];
            for(let j=0;j<gameObj.scripts.length;j++){
                let script = gameObj.scripts[j];
                if(script.onMouseMove
                    && point.x != null && point.y != null) script.onMouseMove(point);
            }
        }
    },
    scroll(delta){
        for(let i=0;i<this.instance.p_gameObjects.length;i++){
            let gameObj = this.instance.p_gameObjects[i];
            for(let j=0;j<gameObj.scripts.length;j++){
                let script = gameObj.scripts[j];
                if(script.onScroll) script.onScroll(delta);
            }
        }
    },
    isDown(name){
        return this.keysDown.indexOf(name) >= 0;
    },
    isUp(name){
        return this.keysUp.indexOf(name) >= 0;
    },
    p_clearUpKeys(){
        this.keysUp = [];
    }
};