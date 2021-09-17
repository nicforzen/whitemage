export var Debug = {
    isDebugBuild: false,
    stopLogsInRelease: false,
    log: function(message){
        _log(message);
    }
};

function _log(message){
    if(Debug.isDebugBuild
        || (!Debug.isDebugBuild && !Debug.stopLogsInRelease)) console.log(message);
}