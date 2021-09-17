
export function PlayerPrefs () {
    this._prefs = null;
}

PlayerPrefs.prototype._setPrefs = function(localStorage){
    this._prefs = localStorage;
};
PlayerPrefs.prototype.set = function(name, value){
    this._prefs.setItem(name, value);
};
PlayerPrefs.prototype.get = function(name){
    return this._prefs.getItem(name);
};
PlayerPrefs.prototype.clear = function(name){
    this._prefs.removeItem(name);
};
PlayerPrefs.prototype.clearAll = function(){
    this._prefs.clear();
};