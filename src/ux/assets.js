export function Assets() {
    this.sounds = {};
    this.images = {};
    this.fontData = {};
    this.mappingData = {};
    this._stillLoading = 0;
    this._sils = {};
}

Assets.prototype = {
    loadAudio(name, url) {
        this._stillLoading += 1;
        var audio = new Audio(url);
        audio.addEventListener("canplaythrough", function(e) {
            this._stillLoading -= 1;
            this.sounds[name] = audio;
        }.bind(this));
    },
    loadImage(name, url) {
        this._stillLoading += 1;
        return new Promise(r => {
            let i = new Image(); i.onload = (() => {
                this.images[name] = { source: i, width: i.width, height: i.height };
                this._stillLoading -= 1;
                r(i);
            }); i.src = url;
        });
    },
    p_createSil(name, color){
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
    },
    loadFont(name, url, mappingUrl) {
        this._stillLoading += 1;
        this.loadImage(name, url);
        _httpGet(mappingUrl, function (s) {
            var lines = s.split("\n");
            for (var i = 0; i < lines.length; i++) {
                if (lines[i].startsWith("common ")) {
                    var chunks = lines[i].split(" ");
                    let lineHeight = parseInt(chunks[1].substring(chunks[1].indexOf("=") + 1));
                    this.fontData[name + "_LH"] = lineHeight;
                } else if (lines[i].startsWith("char ")) {
                    var chunks = lines[i].split(" ");
                    let ascii = chunks[1].substring(chunks[1].indexOf("=") + 1);
                    var data = {
                        ascii: parseInt(ascii),
                        x: parseInt(chunks[2].substring(chunks[2].indexOf("=") + 1)),
                        y: parseInt(chunks[3].substring(chunks[3].indexOf("=") + 1)),
                        width: parseInt(chunks[4].substring(chunks[4].indexOf("=") + 1)),
                        height: parseInt(chunks[5].substring(chunks[5].indexOf("=") + 1)),
                        xOffset: parseInt(chunks[6].substring(chunks[6].indexOf("=") + 1)),
                        yOffset: parseInt(chunks[7].substring(chunks[7].indexOf("=") + 1))
                    }
                    this.fontData[name + "_" + ascii] = data;
                }
            }
            this._stillLoading -= 1;
        }.bind(this));
    },
    loadSpriteSheet(name, url, mappingUrl){
        this.loadImage(name, url);
        this.loadMapping(name, mappingUrl);
    },
    loadMapping(name, mappingUrl){
        this._stillLoading += 1;
        _httpGet(mappingUrl, function (s) {
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
    },
    getLineHeight(font) {
        return this.fontData[font + "_LH"];
    },
    getImage(name) {
        return this.images[name];
    },
    containsImage(name){
        return _indexOf(name, Object.keys(this.images)) >= 0;
    },
    getSound(name){
        return this.sounds[name];
    },
    containsSound(name) {
        return _indexOf(name, Object.keys(this.sounds)) >= 0;
    },
    getFontData(name){
        return this.fontData[name];
    },
    containsFontData(name) {
        return _indexOf(name, this.fontData) >= 0;
    },
    getMappingData(name){
        return this.mappingData[name];
    },
    containsMappingData(name) {
        return _indexOf(name, this.mappingData) >= 0;
    },
};

export function NoOpAssets() {
    this.sounds = {};
    this.images = {};
    this.fontData = {};
    this.mappingData = {};
    this._stillLoading = 0;
    this._sils = {};
}

NoOpAssets.prototype = {
    loadAudio(name, url) {},
    loadImage(name, url) {},
    p_createSil(name, color){},
    loadFont(name, url, mappingUrl) {},
    loadSpriteSheet(name, url, mappingUrl){},
    loadMapping(name, mappingUrl){},
    getLineHeight(font) {},
    getImage(name) {},
    containsImage(name){},
    getSound(name){},
    containsSound(name) {},
    getFontData(name){},
    containsFontData(name) {},
    getMappingData(name){},
    containsMappingData(name) {},
};