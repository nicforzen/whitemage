
export var Util = {
    httpGet: function (url, callback) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                callback(xmlhttp.responseText);
            }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    },    
    clamp: function (value, min, max) {
        return Math.min(Math.max(value, min), max);
    },
    indexOf: function (value, array){
        for (var i = 0; i < array.length; i++) {
            if (array[i] == value) return i;
        }
        return -1;
    },
    removeFromArray: function (value, array){
        let index = array.indexOf(value);
        while (index !== -1) {
            array.splice(index, 1);
            index = array.indexOf(value);
        }
    },
    distance: function(x1, y1, x2, y2){
        return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
    }
};