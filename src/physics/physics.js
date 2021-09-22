import { Vector2 } from "./vector";

export var Physics = {
    _collisionMatrix: Array(5).fill().map(() => Array(5).fill(false)),
    gravity: new Vector2(0, 9.8),
    ignoreLayerCollision(layer1, layer2, ignore){
        let mIgnore = ignore === undefined ? true : ignore;
        if(layer1 === undefined || layer2 === undefined){
            throw "ignoreLayerCollision: Invalid arguments! (" + layer1 + ", " + layer2 + ")";
        }
        if(layer1 > 5 || layer2 > 5) throw "Layer value cannot be greater than 5!";
        this._collisionMatrix[layer1][layer2] = mIgnore;
        this._collisionMatrix[layer2][layer1] = mIgnore;
    },
    getIgnoreLayerCollision(layer1, layer2){
        return this._collisionMatrix[layer1][layer2];
    }
};