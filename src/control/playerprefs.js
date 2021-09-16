
export function PlayerPrefs () {
    this.p_prefs = null;
}

PlayerPrefs.prototype = {
    p_setPrefs(localStorage){
        this.p_prefs = localStorage;
    },
    set(name, value){
        this.p_prefs.setItem(name, value);
    },
    get(name){
        return this.p_prefs.getItem(name);
    },
    clear(name){
        this.p_prefs.removeItem(name);
    },
    clearAll(){
        this.p_prefs.clear()
    }
}