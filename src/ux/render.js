import { RectangleRenderer } from "./renderer.js";
import { ArcRenderer } from "./renderer.js";
import { CircleRenderer } from "./renderer.js";
import { PolygonRenderer } from "./renderer.js";
import { TextRenderer } from "./renderer.js";
import { SpriteRenderer } from "./renderer";
import { Color } from "./color.js";
import { Camera } from "../control/camera.js";
import { Screen } from "../core/screen";

export function Render() {
    this.scaleFactor = 1;
    this.instance = null;
    this.wingColor = Color.BLACK;
    this._ctx = null;
    this._canvas = null;
    this._uiCamera = new Camera();

    this._wingWidthX = 0;
    this._wingWidthY = 0;
}

Render.prototype.setInstance = function(instance){
    this.instance = instance;
};
Render.prototype.useAntiAliasing = function(use){
    this._ctx.imageSmoothingEnabled = use;
};
Render.prototype.fillCanvas = function(color) {
    this._ctx.fillStyle = color.hexString;
    this._ctx.fillRect(0, 0, Screen.currentResolution.width, Screen.currentResolution.height);
};
Render.prototype._renderRect = function(x1, y1, x2, y2, alpha, anchorXPercent, anchorYPercent, angleInRadians, color,
    isFill, lineWidth, scale){
    if (alpha <= 0) return;

    let camera = this.instance.camera;
    if(!camera.enabled) return;

    let width = (x2 - x1) * scale * camera.scale;
    let height = (y2 - y1) * scale * camera.scale;

    if (alpha != 1) this._ctx.globalAlpha = alpha;

    let xAnchorFactor = this.scaleFactor * width * anchorXPercent;
    let yAnchorFactor = this.scaleFactor * height * anchorYPercent;

    this._safeTranslate(this._wingWidthX, this._wingWidthY);
    this._safeTranslate(this.scaleFactor * ((x1 - camera.transform.position.x)*camera.scale + camera.fovX),
        this.scaleFactor * ((y1 - camera.transform.position.y)*camera.scale + camera.fovY));
    this._safeTranslate(-xAnchorFactor, -yAnchorFactor);
    this._safeTranslate(xAnchorFactor, yAnchorFactor);
    this._ctx.rotate(angleInRadians);
    this._safeTranslate(-xAnchorFactor, -yAnchorFactor);

    if(isFill){
        this._ctx.fillStyle = color.hexString;
        this._ctx.fillRect(0, 0, width * this.scaleFactor,
            height * this.scaleFactor);
    }else{
        this._ctx.lineWidth = lineWidth * this.scaleFactor;
        this._ctx.strokeStyle = color.hexString;
        this._ctx.strokeRect(0, 0, width * this.scaleFactor,
            height * this.scaleFactor);
    }

    this._safeTranslate(xAnchorFactor, yAnchorFactor);
    this._ctx.rotate(-angleInRadians);
    this._safeTranslate(-xAnchorFactor, -yAnchorFactor);
    this._safeTranslate(xAnchorFactor, yAnchorFactor);
    this._safeTranslate(-this.scaleFactor * ((x1 - camera.transform.position.x)*camera.scale + camera.fovX),
        -this.scaleFactor * ((y1 - camera.transform.position.y)*camera.scale + camera.fovY));
    this._safeTranslate(-this._wingWidthX, -this._wingWidthY);
    
    if (alpha != 1) this._ctx.globalAlpha = 1;
};
Render.prototype._renderArc = function(x, y, r, alpha, color, isFill, lineWidth, radianStart, radianEnd){
    if (alpha <= 0) return;
    if (alpha != 1) this._ctx.globalAlpha = alpha;
    this._ctx.lineWidth = lineWidth * this.scaleFactor;
    let camera = this.instance.camera;
    if(!camera.enabled) return;
    this._ctx.beginPath();
    let dx = ((x-camera.transform.position.x)*camera.scale+camera.fovX) * this.scaleFactor + this._wingWidthX;
    let dy = ((y-camera.transform.position.y)*camera.scale+camera.fovY) * this.scaleFactor + this._wingWidthY;
    this._ctx.moveTo(dx, dy);
    this._ctx.arc(dx, dy, r * this.scaleFactor * camera.scale, radianStart, radianEnd);
    this._ctx.closePath();
    if(isFill){
        this._ctx.fillStyle = color.hexString;
        this._ctx.fill();
    }else{
        this._ctx.strokeStyle = color.hexString;
        this._ctx.stroke();
    }
    if (alpha != 1) this._ctx.globalAlpha = 1;
};
Render.prototype._renderPolygon = function(x, y, points, alpha, color, isFill, lineWidth){
    if (alpha <= 0) return;
    if (alpha != 1) this._ctx.globalAlpha = alpha;
    let camera = this.instance.camera;
    if(!camera.enabled) return;
    this._ctx.lineWidth = lineWidth * this.scaleFactor;
    this._ctx.beginPath();
    let dx = ((x-camera.transform.position.x)*camera.scale+camera.fovX) * this.scaleFactor + this._wingWidthX;
    let dy = ((y-camera.transform.position.y)*camera.scale+camera.fovY) * this.scaleFactor + this._wingWidthY;
    this._ctx.moveTo(dx, dy);
    for(var i = 0; i < points.length; i++){
        let p = points[i];
        let px = dx + p.x * this.scaleFactor * camera.scale;
        let py = dy + p.y * this.scaleFactor * camera.scale;
        if(i == 0){
            this._ctx.moveTo(px, py);
        }else{
            this._ctx.lineTo(px, py);
        }
    }
    this._ctx.closePath();
    if(isFill){
        this._ctx.fillStyle = color.hexString;
        this._ctx.fill();
    }else{
        this._ctx.strokeStyle = color.hexString;
        this._ctx.stroke();
    }
    if (alpha != 1) this._ctx.globalAlpha = 1;
};
Render.prototype.drawLine = function(x1, y1, x2, y2, lineWidth, color){
    this._renderLine(x1, y1, x2, y2, lineWidth, 1, color);
};
Render.prototype.drawLineAlpha = function(x1, y1, x2, y2, alpha, lineWidth, color) {
    this._renderLine(x1, y1, x2, y2, lineWidth, alpha, color);
};
Render.prototype._renderLine = function(x1, y1, x2, y2, lineWidth, alpha, color){
    if (alpha != 1) this._ctx.globalAlpha = alpha;
    this._ctx.beginPath();
    this._ctx.moveTo(x1 * this.scaleFactor + this._wingWidthX, 
        y1 * this.scaleFactor + this._wingWidthY);
    this._ctx.lineTo(x2 * this.scaleFactor + this._wingWidthX,
        y2 * this.scaleFactor + this._wingWidthY);
    this._ctx.lineWidth = lineWidth * this.scaleFactor;
    this._ctx.strokeStyle = color.hexString;
    this._ctx.stroke();
    if (alpha != 1) this._ctx.globalAlpha = 1;
};
Render.prototype.render = function(r){
    if(!r.isVisible) return;
    if(r instanceof RectangleRenderer) {
        this._renderRect(r.x, r.y, r.x+r.width, r.y+r.height, r.alpha, r.anchorXPercent, r.anchorYPercent,
            r.angleInRadians, r.color, r.isFill, r.lineWidth, r.scale);
    } else if(r instanceof CircleRenderer) {
        this._renderCircle(r.x, r.y, r.r, r.alpha, r.color, r.isFill, r.lineWidth);
    } else if(r instanceof ArcRenderer){
        this._renderArc(r.x, r.y, r.r, r.alpha, r.color, r.isFill, r.lineWidth, r.radianStart, r.radianEnd);
    } else if(r instanceof PolygonRenderer){
        this._renderPolygon(r.x, r.y, r.points, r.alpha, r.color, r.isFill, r.lineWidths);
    } else if(r instanceof TextRenderer){
        this.drawTextNeo(r.font, r.size, r.text, r.color, r.x, r.y, r.scale, r.alignment, r.baseline, r.alpha,
            r.anchorXPercent, r.anchorYPercent, r.angleInRadians);
    }
    else if(r instanceof SpriteRenderer){
        this._renderImage(r.sprite.texture, r.x, r.y, r.scale, r.alpha, r.anchorXPercent, r.anchorYPercent, r.angleInRadians, 
        (this.instance.assets.getMappingData(r.sprite.texture)) ? this.instance.assets.getMappingData(r.sprite.texture)[r.spriteName] : null, 
        r.drawSil, r.silColor, r.silAlpha, r.flipX, r.flipY, r.sprite._inversePixelsPerUnit);
    }else{
        this.instance.error("Unsupported Renderer type!");
    }
};
Render.prototype._renderImage = function(name, x, y, scale, alpha, anchorXPercent, anchorYPercent,
    angleInRadians, mappingData, drawSil, silColor, silAlpha, flipX, flipY, inversePpu){
    let SilSuffix = ":_SIL";
    inversePpu = inversePpu || 1;
    if(alpha <= 0) return;
    if(drawSil){
        let silName = name + SilSuffix;
        if(!this.instance.assets.containsImage(silName)){
            this.instance.assets._createSil(name, silColor);
        }
    }
    if(!this.instance.assets.containsImage(name)){
        this.instance.error("Image not loaded: " + name);
        return;
    }
    let img = this.instance.assets.getImage(name);

    let camera = this.instance.camera;
    if(!camera) return;
    if(!camera.enabled) return;

    var drawWidth = this.scaleFactor * img.width * scale * camera.scale * inversePpu;
    var drawHeight = this.scaleFactor * img.height * scale * camera.scale * inversePpu;
    var xAnchorFactor = anchorXPercent * drawWidth;
    var yAnchorFactor = anchorYPercent * drawHeight;
    var mapX = 0;
    var mapY = 0;
    var mapWidth = img.width;
    var mapHeight = img.height;
    var xOffsetFactor = 0.5 * drawWidth;
    var yOffsetFactor = 0.5 * drawHeight;
    if (mappingData != null) {
        mapX = mappingData.x;
        mapY = mappingData.y;
        mapWidth = mappingData.width;
        mapHeight = mappingData.height;
        drawWidth = mappingData.width * this.scaleFactor * scale * camera.scale;
        drawHeight = mappingData.height * this.scaleFactor * scale * camera.scale;
        xAnchorFactor = this.scaleFactor * mapWidth * anchorXPercent * scale * camera.scale;
        yAnchorFactor = this.scaleFactor * mapHeight * anchorYPercent * scale * camera.scale;
        xOffsetFactor = mappingData.xoffset * drawWidth;
        yOffsetFactor = mappingData.yoffset * drawHeight;
    }

    this._safeTranslate(this._wingWidthX, this._wingWidthY);
    this._safeTranslate(this.scaleFactor * ((x - camera.transform.position.x)*camera.scale + camera.fovX),
        this.scaleFactor * ((y - camera.transform.position.y)*camera.scale + camera.fovY));
    if(flipX) this._ctx.scale(-1, 1);
    if(flipY) this._ctx.scale(1, -1);
    this._safeTranslate(-xOffsetFactor, -yOffsetFactor);
    this._safeTranslate(xAnchorFactor, yAnchorFactor);
    this._ctx.rotate(angleInRadians);
    this._safeTranslate(-xAnchorFactor, -yAnchorFactor);

    if(alpha != 1) this._ctx.globalAlpha = alpha;
    if (!drawSil || silAlpha != 1) {
        this._ctx.drawImage(img.source,
            mapX,
            mapY,
            mapWidth,
            mapHeight,
            0,
            0,
            drawWidth,
            drawHeight);
    }
    if (drawSil && silAlpha >= 0) {
        if (silAlpha != 1) this._ctx.globalAlpha *= silAlpha;
        this._ctx.globalCompositeOperation = "source-atop";
        let silName = name + SilSuffix;
        if (!this.instance.assets.containsImage(silName)) {
            this.instance.error("Image silhouette not loaded: " + name);
            return;
        }
        let silImg = this.instance.assets.getImage(silName);
        this._ctx.drawImage(silImg.source,
            mapX,
            mapY,
            mapWidth,
            mapHeight,
            0,
            0,
            drawWidth,
            drawHeight);
        this._ctx.globalCompositeOperation = "source-over";
        this._ctx.globalAlpha = 1;
    }
    if(alpha != 1) this._ctx.globalAlpha = 1;

    this._safeTranslate(xAnchorFactor, yAnchorFactor);
    this._ctx.rotate(-angleInRadians);
    this._safeTranslate(-xAnchorFactor, -yAnchorFactor);
    this._safeTranslate(xOffsetFactor, yOffsetFactor);
    if(flipX) this._ctx.scale(-1, 1);
    if(flipY) this._ctx.scale(1, -1);
    this._safeTranslate(-this.scaleFactor * ((x - camera.transform.position.x)*camera.scale + camera.fovX),
        -this.scaleFactor * ((y - camera.transform.position.y)*camera.scale + camera.fovY));
    this._safeTranslate(-this._wingWidthX, -this._wingWidthY);
};
Render.prototype._render = function(){
    // Fill black and return if no camera
    if(!this.instance.camera){
        this.fillCanvas(Color.BLACK);
        return;
    }
    if(!this.instance.camera.enabled) return;

    // TODO only change when camera changes or height changes
    this._calculateScalars();

    // Fill background color
    if(this.instance.camera.backgroundColor) this.fillCanvas(this.instance.camera.backgroundColor);

    // Render scene's render function
    // TODO remove
    if(this.instance.scene.onRender) this.instance.scene.onRender();

    // Sort the game objects by sort order
    // TODO sort by layer also
    // TODO if this never changed, why keep sorting?
    this.instance._gameObjects.sort(
        function(a,b){
            let as = 0;
            if(a.renderer && a.renderer != null) as = a.renderer.sortingOrder;
            let bs = 0;
            if(b.renderer && b.renderer != null) bs = b.renderer.sortingOrder;
            return as-bs;});
    
    this._ctx.translate(0.5, 0.5); // Hack for smoother tiles

    // Render each object
    for(let i=0;i<this.instance._gameObjects.length;i++){
        let gameObj = this.instance._gameObjects[i];
        if(gameObj.activeSelf && gameObj.renderer) {
            if(!gameObj.renderer.enabled) continue;
            // TODO can't I just use gameObject values? Why duplicate values?
            gameObj.renderer.x = gameObj.transform._calculatedPosition.x;
            gameObj.renderer.y = gameObj.transform._calculatedPosition.y;
            gameObj.renderer.scale = gameObj.scale;
            gameObj.renderer.angleInRadians = gameObj.transform._calculatedRotation.radians;
            this.render(gameObj.renderer);
        }
    }

    this._ctx.translate(-0.5, -0.5); // Hack for smoother tiles

    // Render UI
    // UI needs to be rendered with no transformations, so use UI camera
    let oldCamera = this.instance.camera;
    this.instance.camera = this._uiCamera;
    this.instance._uiItems.sort(
        function(a,b){
            let as = 0;
            if(a.renderer && a.renderer != null) as = a.renderer.sortingOrder;
            let bs = 0;
            if(b.renderer && b.renderer != null) bs = b.renderer.sortingOrder;
            return as-bs;});
    for(let i=0;i<this.instance._uiItems.length;i++){
        let gameObj = this.instance._uiItems[i];
        if(gameObj.activeSelf && gameObj.renderer) {
            // TODO same as above, why duplicate values?
            gameObj.renderer.x = gameObj.transform._calculatedPosition.x;
            gameObj.renderer.y = gameObj.transform._calculatedPosition.y;
            gameObj.renderer.scale = gameObj.scale;
            gameObj.renderer.angleInRadians = gameObj.transform._calculatedRotation.radians;
            this.render(gameObj.renderer);
        }
    }
    this.instance.camera = oldCamera;

    // Render wings
    if (this._wingWidthX > 0) {
        this._ctx.fillStyle = this.wingColor.hexString;
        this._ctx.fillRect(0, 0, this._wingWidthX, Screen.currentResolution.height);
        this._ctx.fillRect(Screen.currentResolution.width - this._wingWidthX, 0, Screen.currentResolution.width,
            Screen.currentResolution.height);
    }
    if (this._wingWidthY > 0){
        this._ctx.fillStyle = this.wingColor.hexString;
        this._ctx.fillRect(0, 0, Screen.currentResolution.width, this._wingWidthY);
        this._ctx.fillRect(0, Screen.currentResolution.height - this._wingWidthY, Screen.currentResolution.width,
            Screen.currentResolution.height);
    }
};
Render.prototype._calculateScalars = function(){

    let camera = this.instance.camera;
    if(Screen.currentResolution.width > Screen.currentResolution.height){
        this.scaleFactor = Screen.currentResolution.height / (this.instance.camera.orthographicSize + this.instance.camera.orthographicSize);

        this._wingWidthX = (Screen.currentResolution.width - 
            (camera.orthographicSize + camera.orthographicSize) * camera.aspect * this.scaleFactor)/2;
    }else if(Screen.currentResolution.width < Screen.currentResolution.height){
        let expectedWidth = Screen.currentResolution.width;
        let expectedHeight = expectedWidth / camera.aspect; // TODO no div, store inverse?
        this._wingWidthY = (Screen.currentResolution.height - expectedHeight) / 2;
        this.scaleFactor = expectedHeight / (this.instance.camera.orthographicSize + this.instance.camera.orthographicSize);


        // this.scaleFactor = Screen.currentResolution.width / (this.instance.camera.orthographicSize + this.instance.camera.orthographicSize) * camera.aspect;

        // this._wingWidthY = (Screen.currentResolution.height - 
        //     (camera.orthographicSize + camera.orthographicSize) * this.scaleFactor)/2;
    }

};
Render.prototype.drawTextNeo = function(font, size, text, color, x, y, scale, alignment, baseline, alpha, anchorXPercent, anchorYPercent, angleInRadians){
    this._renderText(font, text, size, color, x, y, scale, alpha, anchorXPercent, anchorYPercent, angleInRadians, alignment, baseline, 1, 1);
};
Render.prototype._renderText = function(font, text, size, color, x, y, scale, alpha, anchorXPercent, anchorYPercent,
    angleInRadians, alignment, baseline, letterSpacing, lineSpacingDelta){
    if (alpha <= 0) return;
    if(text == null) return;
    text = text.toString();
    
    // Initial variables
    // TODO clean this
    // let img = this.instance.assets.getImage(font);
    // var xdelta = 0;
    // var ydelta = 0;
    // let lineHeight = this.instance.assets.getLineHeight(font);
    if (alpha != 1) this._ctx.globalAlpha = alpha;

    let camera = this.instance.camera;

    // Get measurements
    let fontSize = size * this.scaleFactor * scale * camera.scale;
    var measurement = this.measureText(font, text, size, letterSpacing);

    var xAnchorFactor = this.scaleFactor * measurement.width * anchorXPercent * scale * camera.scale;
    var yAnchorFactor = this.scaleFactor * measurement.height * anchorYPercent * scale * camera.scale;

    this._safeTranslate(this._wingWidthX, this._wingWidthY);
    this._safeTranslate(this.scaleFactor * ((x - camera.transform.position.x)*camera.scale + camera.fovX),
        this.scaleFactor * ((y - camera.transform.position.y)*camera.scale + camera.fovY));
    this._safeTranslate(xAnchorFactor, yAnchorFactor);
    this._ctx.rotate(angleInRadians);
    this._safeTranslate(-xAnchorFactor, -yAnchorFactor);

    this._ctx.textAlign = alignment;
    this._ctx.textBaseline = baseline;
    this._ctx.font = fontSize + "px " + font;
    this._ctx.fillStyle = color.hexString;

    let lines = text.split('\n');
    for (var i = 0; i<lines.length; i++)
        this._ctx.fillText(lines[i], 0, i*(measurement.height*lineSpacingDelta));

    this._safeTranslate(xAnchorFactor, yAnchorFactor);
    this._ctx.rotate(-angleInRadians);
    this._safeTranslate(-xAnchorFactor, -yAnchorFactor);
    this._safeTranslate(-this.scaleFactor * ((x - camera.transform.position.x)*camera.scale + camera.fovX),
        -this.scaleFactor * ((y - camera.transform.position.y)*camera.scale + camera.fovY));
    this._safeTranslate(-this._wingWidthX, -this._wingWidthY);

    if (alpha != 1) this._ctx.globalAlpha = 1;
};
Render.prototype.measureRenderedText = function(font, text, scale, letterSpacing){
    var totalWidth = 0;
    var totalHeight = 0;
    for (var i = 0; i < text.length; i++) {
        var ascii = text.charCodeAt(i).toString();
        var isSpace = ascii == "32";
        if (isSpace) ascii = "98"; // Replace space with b
        let name = font + "_" + ascii;
        let data = this.instance.assets.getFontData(name);
        totalWidth += data.width;
        if(i < text.length - 1) totalWidth += letterSpacing;
        if(data.height > totalHeight) totalHeight = data.height;
    }
    return {width: totalWidth * this.scaleFactor * scale,
            height: totalHeight * this.scaleFactor * scale};
};
Render.prototype.measureText = function(font, text, size, scale){
    // var totalWidth = 0;
    // var totalHeight = 0;
    // for (var i = 0; i < text.length; i++) {
    //     var ascii = text.charCodeAt(i).toString();
    //     var isSpace = ascii == "32";
    //     if (isSpace) ascii = "98"; // Replace space with b
    //     var isNewLine = ascii == "10";
    //     if(!isNewLine){
    //         let name = font + "_" + ascii;
    //         let data = this.instance.assets.getFontData(name);
    //         totalWidth += data.width;
    //         if (i < text.length - 1) totalWidth += letterSpacing;
    //         if (data.height > totalHeight) totalHeight = data.height;
    //     }
    // }
    // return {
    //     width: totalWidth * scale, height: totalHeight * scale
    // };
    let camera = this.instance.camera;
    let fontSize = size * this.scaleFactor * scale * camera.scale;
    this._ctx.font = fontSize + "px " + font;
    return {width: this._ctx.measureText(text).width, height: fontSize};
};
Render.prototype.measureUnscaledText = function(font, text, letterSpacing) {
    var totalWidth = 0;
    var totalHeight = 0;
    for (var i = 0; i < text.length; i++) {
        var ascii = text.charCodeAt(i).toString();
        var isSpace = ascii == "32";
        if (isSpace) ascii = "98"; // Replace space with b
        let name = font + "_" + ascii;
        let data = this.instance.assets.getFontData(name);
        totalWidth += data.width;
        if (i < text.length - 1) totalWidth += letterSpacing;
        if (data.height > totalHeight) totalHeight = data.height;
    }
    return {
        width: totalWidth, height: totalHeight
    };
};
Render.prototype.renderFrame = function(){
    requestAnimationFrame(this._render.bind(this));
};
Render.prototype._getCursorPosition = function(event) {
    const rect = this._canvas.getBoundingClientRect();
    let x = (((event.clientX - rect.left) - this._wingWidthX) / this.scaleFactor);
    let y = (((event.clientY - rect.top) - this._wingWidthY) / this.scaleFactor);
    if (x < 0 ||
        x > Screen.currentResolution.width ||
        y < 0 ||
        y > Screen.currentResolution.height)
        return {x: null, y: null};
    let camera = this.instance.camera;
    if(camera){
        return { x: (x + camera.transform.position.x - camera.fovX) / camera.scale,
            y: (y + camera.transform.position.y - camera.fovY) / camera.scale };
    }else return null;
};
Render.prototype._getRawCursorPosition = function(event){
    const rect = this._canvas.getBoundingClientRect();
    let x = (((event.clientX - rect.left) - this._wingWidthX) / this.scaleFactor);
    let y = (((event.clientY - rect.top) - this._wingWidthY) / this.scaleFactor);
    if (x < 0 ||
        x > Screen.currentResolution.width||
        y < 0 ||
        y > Screen.currentResolution.height)
        return {x: null, y: null};
    return { x: x, y: y };
};
Render.prototype._safeTranslate = function(x, y){
    this._ctx.translate(this._safeRound(x), this._safeRound(y));
};
Render.prototype._safeRound = function(v){
    return (v >= 0 || -1) * Math.round(Math.abs(v));
};