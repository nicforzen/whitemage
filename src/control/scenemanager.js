
export var SceneManager = {
    _instance: null,
    _canvas: null,
    _localStorage: null,
    // TODO change to name like Unity?
    loadScene(scene){
        this._instance.destroy();
        this._instance.setScene(scene);
        this._instance.driver.reset();
    }
};