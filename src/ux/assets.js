import { Util } from "../util/util.js";

export function Assets() {
    this.sounds = {};
    this.images = {};
    this.fontData = {};
    this.mappingData = {};
    this._stillLoading = 0;
    this._sils = {};
}

Assets.prototype.loadAudio = function(name, url) {
    //console.log("START LOAD AUDIO: " + name);
    this._stillLoading += 1;
    var audio = new Audio(url);
    audio.addEventListener("canplaythrough", function() {
        // console.log("DONE LOAD AUDIO: " + name);
        this._stillLoading -= 1;
        this.sounds[name] = audio;
    }.bind(this));
    audio.load();
};
Assets.prototype.loadImage = function(name, url) {
    // console.log("START LOAD IMAGE: " + name);
    this._stillLoading += 1;
    return new Promise(r => {
        let i = new Image(); i.onload = (() => {
            // console.log("DONE LOAD IMAGE: " + name);
            this.images[name] = { source: i, width: i.width, height: i.height };
            this._stillLoading -= 1;
            r(i);
        }); i.src = url;
    });
};
Assets.prototype._createSil = function(name, color){
    let SilSuffix = ":_SIL";
    var sourceImg = this.getImage(name).source;
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext('2d');
    canvas.width = sourceImg.width;
    canvas.height = sourceImg.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(sourceImg, 0, 0);
    ctx.globalCompositeOperation = "source-in";
    ctx.fillStyle = color.hexString;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    this.images[name + SilSuffix] = { source: canvas, width: canvas.width,
            height: canvas.height };
};
Assets.prototype.loadFont = function(name, url, mappingUrl) {
    this._stillLoading += 1;
    this.loadImage(name, url);
    Util.httpGet(mappingUrl, function (s) {
        let lines = s.split("\n");
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith("common ")) {
                let chunks = lines[i].split(" ");
                let lineHeight = parseInt(chunks[1].substring(chunks[1].indexOf("=") + 1));
                this.fontData[name + "_LH"] = lineHeight;
            } else if (lines[i].startsWith("char ")) {
                let chunks = lines[i].split(" ");
                let ascii = chunks[1].substring(chunks[1].indexOf("=") + 1);
                let data = {
                    ascii: parseInt(ascii),
                    x: parseInt(chunks[2].substring(chunks[2].indexOf("=") + 1)),
                    y: parseInt(chunks[3].substring(chunks[3].indexOf("=") + 1)),
                    width: parseInt(chunks[4].substring(chunks[4].indexOf("=") + 1)),
                    height: parseInt(chunks[5].substring(chunks[5].indexOf("=") + 1)),
                    xOffset: parseInt(chunks[6].substring(chunks[6].indexOf("=") + 1)),
                    yOffset: parseInt(chunks[7].substring(chunks[7].indexOf("=") + 1))
                };
                this.fontData[name + "_" + ascii] = data;
            }
        }
        this._stillLoading -= 1;
    }.bind(this));
};
Assets.prototype.loadSpriteSheet = function(name, url, mappingUrl){
    this.loadImage(name, url);
    this.loadMapping(name, mappingUrl);
};
Assets.prototype.loadMapping = function(name, mappingUrl){
    this._stillLoading += 1;
    Util.httpGet(mappingUrl, function (s) {
        var lines = s.split("\n");
        var returnObject = {};
        for (var i = 0; i < lines.length; i++) {
            var data = [];
            var chunks = lines[i].split(" ");
            for(var a = 0; a < chunks.length; a++){
                let line = chunks[a];
                let equalIndex = line.indexOf("=");
                if(equalIndex >= 0){
                    let key = line.substring(0, equalIndex);
                    let value = line.substring(equalIndex+1);
                    data[key] = value;
                }else if(a == 0){
                    data["tag"] = line;
                }
            }
            if("id" in data){
                returnObject[data["id"]] = data;
            }
        }
        this.mappingData[name] = returnObject;
        this._stillLoading -= 1;
    }.bind(this));
};
Assets.prototype.getLineHeight = function(font) {
    return this.fontData[font + "_LH"];
};
Assets.prototype.getImage = function(name) {
    return this.images[name];
};
Assets.prototype.containsImage = function(name){
    return Util.indexOf(name, Object.keys(this.images)) >= 0;
};
Assets.prototype.getSound = function(name){
    return this.sounds[name];
};
Assets.prototype.containsSound = function(name) {
    return Util.indexOf(name, Object.keys(this.sounds)) >= 0;
};
Assets.prototype.getFontData = function(name){
    return this.fontData[name];
};
Assets.prototype.containsFontData = function(name) {
    return Util.indexOf(name, this.fontData) >= 0;
};
Assets.prototype.getMappingData = function(name){
    return this.mappingData[name];
};
Assets.prototype.containsMappingData = function(name) {
    return Util.indexOf(name, this.mappingData) >= 0;
};