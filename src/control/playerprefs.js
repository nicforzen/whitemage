
export function PlayerPrefs () {
    this.p_prefs = null;
}

PlayerPrefs.prototype.p_setPrefs = function(localStorage){
    this.p_prefs = localStorage;
};
PlayerPrefs.prototype.set = function(name, value){
    this.p_prefs.setItem(name, value);
};
PlayerPrefs.prototype.get = function(name){
    return this.p_prefs.getItem(name);
};
PlayerPrefs.prototype.clear = function(name){
    this.p_prefs.removeItem(name);
};
PlayerPrefs.prototype.clearAll = function(){
    this.p_prefs.clear();
};