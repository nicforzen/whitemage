
export var PlayerPrefs = {
    _tempPrefs: {},
    _prefs: null,
    _setPrefs(localStorage){
        this._prefs = localStorage;
        for ( let i = 0, len = localStorage.length; i < len; i++ ) {
            let key = localStorage.key(i);
            this._tempPrefs[key] = localStorage[key];
        }
    },
    set(name, value){
        this._tempPrefs[name] = value;
    },
    get(name){
        return this._tempPrefs[name];
    },
    deleteAll(){
        this._tempPrefs = {};
    },
    deleteKey(name){
        delete this._tempPrefs[name];
    },
    hasKey(name){
        return this._tempPrefs[name] != null;
    },
    save(){
        let keys = Object.keys(this._tempPrefs);
        this._prefs.clear();
        for(let i = 0; i < keys.length; i++){
            let key = keys[i];
            this._prefs.setItem(key, this._tempPrefs[key]);
        }
    }
};