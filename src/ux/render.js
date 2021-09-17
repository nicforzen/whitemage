import { RectangleRenderer } from "./renderer.js";
import { ArcRenderer } from "./renderer.js";
import { CircleRenderer } from "./renderer.js";
import { PolygonRenderer } from "./renderer.js";
import { TextRenderer } from "./renderer.js";

export function Render() {
    this.scaleFactor = 1;
    this.aspectRatio = 0;
    this.gameWidth = 0;
    this.gameHeight = 0;
    this.screenWidth = 0;
    this.screenHeight = 0;
    this.wingWidthX = 0;
    this.wingWidthY = 0;
    this.instance = null;
    this._ctx = null;
    this._canvas = null;
}

Render.prototype.setInstance = function(instance){
    this.instance = instance;
};
Render.prototype.fillCanvas = function(color) {
    this._ctx.fillStyle = color.hexString;
    this._ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);
};
Render.prototype.fillRect = function(x1, y1, x2, y2, color){
    this._renderRect(x1, y1, x2, y2, 1, 0, 0, 0, color, true, 1, 1);
};
Render.prototype.fillRectAlpha = function(x1, y1, x2, y2, alpha, color) {
    this._renderRect(x1, y1, x2, y2, alpha, 0, 0, 0, color, true, 1, 1);
};
Render.prototype.fillRectAlphaRotatedDegrees = function(x1, y1, x2, y2, alpha, anchorXPercent, anchorYPercent,
    angleInDegrees, color){
    this._renderRect(x1, y1, x2, y2, alpha, anchorXPercent, anchorYPercent,
        angleInDegrees * Math.PI / 180, color, true, 1, 1);
};
Render.prototype.fillRectAlphaRotatedRadians = function(x1, y1, x2, y2, alpha, anchorXPercent, anchorYPercent,
    angleInRadians, color){
    this._renderRect(x1, y1, x2, y2, alpha, anchorXPercent, anchorYPercent,
        angleInRadians, color, true, 1, 1);
};
Render.prototype.fillRectRotatedDegrees = function(x1, y1, x2, y2, anchorXPercent, anchorYPercent,
    angleInDegrees, color) {
    this._renderRect(x1, y1, x2, y2, 1, anchorXPercent, anchorYPercent,
        angleInDegrees * Math.PI / 180, color, true, 1, 1);
};
Render.prototype.fillRectRotatedRadians = function(x1, y1, x2, y2, anchorXPercent, anchorYPercent,
    angleInRadians, color) {
    this._renderRect(x1, y1, x2, y2, 1, anchorXPercent, anchorYPercent,
        angleInRadians, color, true, 1, 1);
};
Render.prototype.strokeRect = function(x1, y1, x2, y2, color, lineWidth) {
    this._renderRect(x1, y1, x2, y2, 1, 0, 0, 0, color, false, lineWidth, 1);
};
Render.prototype.strokeRectAlpha = function(x1, y1, x2, y2, alpha, color, lineWidth) {
    this._renderRect(x1, y1, x2, y2, alpha, 0, 0, 0, color, false, lineWidth, 1);
};
Render.prototype.strokeRectAlphaRotatedDegrees = function(x1, y1, x2, y2, alpha, anchorXPercent, anchorYPercent,
    angleInDegrees, color, lineWidth) {
    this._renderRect(x1, y1, x2, y2, alpha, anchorXPercent, anchorYPercent,
        angleInDegrees * Math.PI / 180, color, false, lineWidth, 1);
};
Render.prototype.strokeRectAlphaRotatedRadians = function(x1, y1, x2, y2, alpha, anchorXPercent, anchorYPercent,
    angleInRadians, color, lineWidth) {
    this._renderRect(x1, y1, x2, y2, alpha, anchorXPercent, anchorYPercent,
        angleInRadians, color, false, lineWidth, 1);
};
Render.prototype.strokeRectRotatedDegrees = function(x1, y1, x2, y2, anchorXPercent, anchorYPercent,
    angleInDegrees, color, lineWidth) {
    this._renderRect(x1, y1, x2, y2, 1, anchorXPercent, anchorYPercent,
        angleInDegrees * Math.PI / 180, color, false, lineWidth, 1);
};
Render.prototype.strokeRectRotatedRadians = function(x1, y1, x2, y2, anchorXPercent, anchorYPercent,
    angleInRadians, color, lineWidth) {
    this._renderRect(x1, y1, x2, y2, 1, anchorXPercent, anchorYPercent,
        angleInRadians, color, false, lineWidth, 1);
};
Render.prototype._renderRect = function(x1, y1, x2, y2, alpha, anchorXPercent, anchorYPercent, angleInRadians, color,
    isFill, lineWidth, scale){
    if (alpha <= 0) return;

    let camera = this.instance.camera;

    let width = (x2 - x1) * scale * camera.scale;
    let height = (y2 - y1) * scale * camera.scale;

    if (alpha != 1) this._ctx.globalAlpha = alpha;

    let xAnchorFactor = this.scaleFactor * width * anchorXPercent;
    let yAnchorFactor = this.scaleFactor * height * anchorYPercent;

    this._safeTranslate(this.wingWidthX, this.wingWidthY);
    this._safeTranslate(this.scaleFactor * ((x1 - camera.transform.position.x)*camera.scale + camera.fovX),
        this.scaleFactor * ((y1 - camera.transform.position.y)*camera.scale + camera.fovY));
    this._safeTranslate(xAnchorFactor, yAnchorFactor);
    this._ctx.rotate(angleInRadians);
    this._safeTranslate(-xAnchorFactor, -yAnchorFactor);

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

    this._safeTranslate(xAnchorFactor, yAnchorFactor);
    this._ctx.rotate(-angleInRadians);
    this._safeTranslate(-xAnchorFactor, -yAnchorFactor);
    this._safeTranslate(-this.scaleFactor * ((x1 - camera.transform.position.x)*camera.scale + camera.fovX),
        -this.scaleFactor * ((y1 - camera.transform.position.y)*camera.scale + camera.fovY));
    this._safeTranslate(-this.wingWidthX, -this.wingWidthY);
    
    if (alpha != 1) this._ctx.globalAlpha = 1;
};
Render.prototype.fillCircle = function(x, y, r, color){
    this._renderCircle(x, y, r, 1, color, true, 1);
};
Render.prototype.fillCircleAlpha = function(x, y, r, alpha, color){
    this._renderCircle(x, y, r, alpha, color, true, 1);
};
Render.prototype.strokeCircle = function(x, y, r, color, lineWidth){
    this._renderCircle(x, y, r, 1, color, false, lineWidth);
};
Render.prototype.strokeCircleAlpha = function(x, y, r, alpha, color, lineWidth){
    this._renderCircle(x, y, r, alpha, color, false, lineWidth);
};
Render.prototype.fillArc = function(x, y, r, radianStart, radianEnd, color){
    this._renderArc(x, y, r, 1, color, true, 1, radianStart, radianEnd);
};
Render.prototype.fillArcAlpha = function(x, y, r, radianStart, radianEnd, alpha, color){
    this._renderArc(x, y, r, alpha, color, true, 1, radianStart, radianEnd);
};
Render.prototype.strokeArc = function(x, y, r, radianStart, radianEnd, color, lineWidth){
    this._renderArc(x, y, r, 1, color, false, lineWidth, radianStart, radianEnd);
};
Render.prototype.strokeArcAlpha = function(x, y, r, radianStart, radianEnd, alpha, color, lineWidth){
    this._renderArc(x, y, r, alpha, color, false, lineWidth, radianStart, radianEnd);
};
Render.prototype._renderCircle = function(x, y, r, alpha, color, isFill, lineWidth){
    this._renderArc(x, y,
            r, alpha, color, isFill, lineWidth, 0, 2*Math.PI);
};
Render.prototype._renderArc = function(x, y, r, alpha, color, isFill, lineWidth, radianStart, radianEnd){
    if (alpha <= 0) return;
    if (alpha != 1) this._ctx.globalAlpha = alpha;
    this._ctx.lineWidth = lineWidth * this.scaleFactor;
    this._ctx.beginPath();
    let camera = this.instance.camera;
    let dx = ((x-camera.transform.position.x)*camera.scale+camera.fovX) * this.scaleFactor + this.wingWidthX;
    let dy = ((y-camera.transform.position.y)*camera.scale+camera.fovY) * this.scaleFactor + this.wingWidthY;
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
    this._ctx.lineWidth = lineWidth * this.scaleFactor;
    this._ctx.beginPath();
    let dx = ((x-camera.transform.position.x)*camera.scale+camera.fovX) * this.scaleFactor + this.wingWidthX;
    let dy = ((y-camera.transform.position.y)*camera.scale+camera.fovY) * this.scaleFactor + this.wingWidthY;
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
    this._ctx.moveTo(x1 * this.scaleFactor + this.wingWidthX, 
        y1 * this.scaleFactor + this.wingWidthY);
    this._ctx.lineTo(x2 * this.scaleFactor + this.wingWidthX,
        y2 * this.scaleFactor + this.wingWidthY);
    this._ctx.lineWidth = lineWidth * this.scaleFactor;
    this._ctx.strokeStyle = color.hexString;
    this._ctx.stroke();
    if (alpha != 1) this._ctx.globalAlpha = 1;
};
Render.prototype.drawImage = function(name, x, y) {
    this._renderImage(name, x, y, 1, 1, 0, 0, 0, null, false, null, 0, false, false);
};
Render.prototype.drawImageFiltered = function(name, x, y, color, colorAlpha) {
    this._renderImage(name, x, y, 1, 1, 0, 0, 0, null, true, color, colorAlpha, false, false);
};
Render.prototype.drawImageScaled = function(name, x, y, scale){
    this._renderImage(name, x, y, scale, 1, 0, 0, 0, null, false, null, 0, false, false);
};
Render.prototype.drawImageScaledFiltered = function(name, x, y, scale, color, colorAlpha) {
    this._renderImage(name, x, y, scale, 1, 0, 0, 0, null, true, color, colorAlpha, false, false);
};
Render.prototype.drawImageAlpha = function(name, x, y, alpha) {
    this._renderImage(name, x, y, 1, alpha, 0, 0, 0, null, false, null, 0, false, false);
};
Render.prototype.drawImageAlphaFiltered = function(name, x, y, alpha, color, colorAlpha) {
    this._renderImage(name, x, y, 1, alpha, 0, 0, 0, null, true, color, colorAlpha, false, false);
};
Render.prototype.drawImageScaledAlpha = function(name, x, y, scale, alpha) {
    this._renderImage(name, x, y, scale, alpha, 0, 0, 0, null, false, null, 0, false, false);
};
Render.prototype.drawImageScaledAlphaFiltered = function(name, x, y, scale, alpha, color, colorAlpha) {
    this._renderImage(name, x, y, scale, alpha, 0, 0, 0, null, true, color, colorAlpha, false, false);
};
Render.prototype.drawImageRotatedDegrees = function(name, x, y, anchorXPercent, anchorYPercent, angleInDegrees){
    this._renderImage(name, x, y, 1, 1, anchorXPercent,
        anchorYPercent, angleInDegrees * Math.PI / 180, null, false, null, 0, false, false);
};
Render.prototype.drawImageRotatedDegreesFiltered = function(name, x, y, anchorXPercent, anchorYPercent, angleInDegrees,
    color, colorAlpha) {
    this._renderImage(name, x, y, 1, 1, anchorXPercent,
        anchorYPercent, angleInDegrees * Math.PI / 180, null, true, color, colorAlpha, false, false);
};
Render.prototype.drawImageRotatedRadians = function(name, x, y, anchorXPercent, anchorYPercent, angleInRadians) {
    this._renderImage(name, x, y, 1, 1, anchorXPercent, anchorYPercent,
        angleInRadians, null, false, null, 0, false, false);
};
Render.prototype.drawImageRotatedRadiansFiltered = function(name, x, y, anchorXPercent, anchorYPercent, angleInRadians,
    color, colorAlpha) {
    this._renderImage(name, x, y, 1, 1, anchorXPercent, anchorYPercent,
        angleInRadians, null, true, color, colorAlpha, false, false);
};
Render.prototype.drawImageScaledRotatedDegrees = function(name, x, y, scale, anchorXPercent, anchorYPercent,
    angleInDegrees) {
    this._renderImage(name, x, y, scale, 1, anchorXPercent, anchorYPercent, 
        angleInDegrees * Math.PI / 180, null, false, null, 0, false, false);
};
Render.prototype.drawImageScaledRotatedDegreesFiltered = function(name, x, y, scale, anchorXPercent, anchorYPercent,
    angleInDegrees, color, colorAlpha) {
    this._renderImage(name, x, y, scale, 1, anchorXPercent, anchorYPercent,
        angleInDegrees * Math.PI / 180, null, true, color, colorAlpha, false, false);
};
Render.prototype.drawImageScaledRotatedRadians = function(name, x, y, scale, anchorXPercent, anchorYPercent,
    angleInRadians) {
    this._renderImage(name, x, y, scale, 1, anchorXPercent, anchorYPercent,
        angleInRadians, null, false, null, 0, false, false);
};
Render.prototype.drawImageScaledRotatedRadiansFiltered = function(name, x, y, scale, anchorXPercent, anchorYPercent,
    angleInRadians, color, colorAlpha) {
    this._renderImage(name, x, y, scale, 1, anchorXPercent, anchorYPercent,
        angleInRadians, null, true, color, colorAlpha, false, false);
};
Render.prototype.drawImageScaledAlphaRotatedDegrees = function(name, x, y, scale, alpha, anchorXPercent, anchorYPercent,
    angleInDegrees) {
    this._renderImage(name, x, y, scale, alpha, anchorXPercent,
        anchorYPercent, angleInDegrees * Math.PI / 180, null, false, null, 0, false, false);
};
Render.prototype.drawImageScaledAlphaRotatedDegreesFiltered = function(name, x, y, scale, alpha, anchorXPercent, 
    anchorYPercent, angleInDegrees, color, colorAlpha) {
    this._renderImage(name, x, y, scale, alpha, anchorXPercent,
        anchorYPercent, angleInDegrees * Math.PI / 180, null, true, color, colorAlpha, false, false);
};
Render.prototype.drawImageScaledAlphaRotatedRadians = function(name, x, y, scale, alpha, anchorXPercent, anchorYPercent,
    angleInRadians){
    this._renderImage(name, x, y, scale, alpha, anchorXPercent, anchorYPercent, 
        angleInRadians, null, null, false, null, 0, false, false);
};
Render.prototype.drawImageScaledAlphaRotatedRadiansFiltered = function(name, x, y, scale, alpha, anchorXPercent,
    anchorYPercent, angleInRadians, color, colorAlpha) {
    this._renderImage(name, x, y, scale, alpha, anchorXPercent, anchorYPercent,
        angleInRadians, null, null, true, color, colorAlpha, false, false);
};
Render.prototype.drawMappedImage = function(name, mappingData, x, y) {
    this._renderImage(name, x, y, 1, 1, 0, 0, 0, mappingData, false, null, 0, false, false);
};
Render.prototype.drawMappedImageFiltered = function(name, mappingData, x, y, color, colorAlpha) {
    this._renderImage(name, x, y, 1, 1, 0, 0, 0, mappingData, true, color, colorAlpha, false, false);
};
Render.prototype.drawMappedImageScaled = function(name, mappingData, x, y, scale) {
    this._renderImage(name, x, y, scale, 1, 0, 0, 0, mappingData, false, null, 0, false, false);
};
Render.prototype.drawMappedImageScaledFiltered = function(name, mappingData, x, y, scale, color, colorAlpha) {
    this._renderImage(name, x, y, scale, 1, 0, 0, 0, mappingData, true, color, colorAlpha, false, false);
};
Render.prototype.drawMappedImageAlpha = function(name, mappingData, x, y, alpha) {
    this._renderImage(name, x, y, 1, alpha, 0, 0, 0, mappingData, false, null, 0, false, false);
};
Render.prototype.drawMappedImageAlphaFiltered = function(name, mappingData, x, y, alpha, color, colorAlpha) {
    this._renderImage(name, x, y, 1, alpha, 0, 0, 0, mappingData, true, color, colorAlpha, false, false);
};
Render.prototype.drawMappedImageScaledAlpha = function(name, mappingData, x, y, scale, alpha) {
    this._renderImage(name, x, y, scale, alpha, 0, 0, 0, mappingData, false, null, 0, false, false);
};
Render.prototype.drawMappedImageScaledAlphaFiltered = function(name, mappingData, x, y, scale, alpha, color, colorAlpha) {
    this._renderImage(name, x, y, scale, alpha, 0, 0, 0, mappingData, true, color,
        colorAlpha, false, false);
};
Render.prototype.drawMappedImageRotatedDegrees = function(name, mappingData, x, y, anchorXPercent, anchorYPercent,
    angleInDegrees) {
    this._renderImage(name, x, y, 1, 1, anchorXPercent,
        anchorYPercent, angleInDegrees * Math.PI / 180, mappingData, false, null, 0, false, false);
};
Render.prototype.drawMappedImageRotatedDegreesFiltered = function(name, mappingData, x, y, anchorXPercent, anchorYPercent,
    angleInDegrees, color, colorAlpha) {
    this._renderImage(name, x, y, 1, 1, anchorXPercent,
        anchorYPercent, angleInDegrees * Math.PI / 180, mappingData, true, color, colorAlpha, false, false);
};
Render.prototype.drawMappedImageRotatedRadians = function(name, mappingData, x, y, anchorXPercent, anchorYPercent,
    angleInRadians) {
    this._renderImage(name, x, y, 1, 1, anchorXPercent, anchorYPercent,
        angleInRadians, mappingData, false, null, 0, false, false);
};
Render.prototype.drawMappedImageRotatedRadiansFiltered = function(name, mappingData, x, y, anchorXPercent, anchorYPercent,
    angleInRadians, color, colorAlpha) {
    this._renderImage(name, x, y, 1, 1, anchorXPercent, anchorYPercent,
        angleInRadians, mappingData, true, color, colorAlpha, false, false);
};
Render.prototype.drawMappedImageScaledRotatedDegrees = function(name, mappingData, x, y, scale, anchorXPercent,
    anchorYPercent, angleInDegrees) {
    this._renderImage(name, x, y, scale, 1, anchorXPercent, anchorYPercent,
        angleInDegrees * Math.PI / 180, mappingData, false, null, 0, false, false);
};
Render.prototype.drawMappedImageScaledRotatedDegreesFiltered = function(name, mappingData, x, y, scale, anchorXPercent,
    anchorYPercent, angleInDegrees, color, colorAlpha) {
    this._renderImage(name, x, y, scale, 1, anchorXPercent, anchorYPercent,
        angleInDegrees * Math.PI / 180, mappingData, true, color, colorAlpha, false, false);
};
Render.prototype.drawMappedImageScaledRotatedRadians = function(name, mappingData, x, y, scale, anchorXPercent,
    anchorYPercent, angleInRadians) {
    this._renderImage(name, x, y, scale, 1, anchorXPercent, anchorYPercent,
        angleInRadians, mappingData, false, null, 0, false, false);
};
Render.prototype.drawMappedImageScaledRotatedRadiansFiltered = function(name, mappingData, x, y, scale, anchorXPercent,
    anchorYPercent, angleInRadians, color, colorAlpha) {
    this._renderImage(name, x, y, scale, 1, anchorXPercent, anchorYPercent,
        angleInRadians, mappingData, true, color, colorAlpha, false, false);
};
Render.prototype.drawMappedImageScaledAlphaRotatedDegrees = function(name, mappingData, x, y, scale, alpha, anchorXPercent,
    anchorYPercent, angleInDegrees) {
    this._renderImage(name, x, y, scale, alpha, anchorXPercent,
        anchorYPercent, angleInDegrees * Math.PI / 180, mappingData, false, null, 0, false, false);
};
Render.prototype.drawMappedImageScaledAlphaRotatedDegreesFiltered = function(name, mappingData, x, y, scale, alpha,
    anchorXPercent, anchorYPercent, angleInDegrees, color, colorAlpha) {
    this._renderImage(name, x, y, scale, alpha, anchorXPercent,
        anchorYPercent, angleInDegrees * Math.PI / 180, mappingData, true, color, colorAlpha, false, false);
};
Render.prototype.drawMappedImageScaledAlphaRotatedRadians = function(name, mappingData, x, y, scale, alpha, anchorXPercent,
    anchorYPercent, angleInRadians) {
    this._renderImage(name, x, y, scale, alpha, anchorXPercent, anchorYPercent,
        angleInRadians, mappingData, false, null, 0, false, false);
};
Render.prototype.drawMappedImageScaledAlphaRotatedRadiansFiltered = function(name, mappingData, x, y, scale, alpha,
    anchorXPercent, anchorYPercent, angleInRadians, color, colorAlpha) {
    this._renderImage(name, x, y, scale, alpha, anchorXPercent, anchorYPercent,
        angleInRadians, mappingData, true, color, colorAlpha, false, false);
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
    else{
        this._renderImage(r.imageName, r.x, r.y, r.scale, r.alpha, r.anchorXPercent, r.anchorYPercent, r.angleInRadians, 
        (this.instance.assets.getMappingData(r.imageName)) ? this.instance.assets.getMappingData(r.imageName)[r.spriteName] : null, 
        r.drawSil, r.silColor, r.silAlpha, r.flipX, r.flipY);
    }
};
Render.prototype._renderImage = function(name, x, y, scale, alpha, anchorXPercent, anchorYPercent,
    angleInRadians, mappingData, drawSil, silColor, silAlpha, flipX, flipY){
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

    var xAnchorFactor = this.scaleFactor * img.width * anchorXPercent * scale * camera.scale;
    var yAnchorFactor = this.scaleFactor * img.height * anchorYPercent * scale * camera.scale;
    var mapX = 0;
    var mapY = 0;
    var mapWidth = img.width;
    var mapHeight = img.height;
    var drawWidth = this.scaleFactor * img.width * scale * camera.scale;
    var drawHeight = this.scaleFactor * img.height * scale * camera.scale;
    var xOffsetFactor = 0.5 * drawWidth;
    var yOffsetFactor = 0 * drawHeight;
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

    this._safeTranslate(this.wingWidthX, this.wingWidthY);
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
    this._safeTranslate(-this.wingWidthX, -this.wingWidthY);
};
Render.prototype._render = function(){
    if(this.instance.scene.onRender) this.instance.scene.onRender();
    this.instance._gameObjects.sort(
        function(a,b){return (!a.renderer || !b.renderer) ? 0 :
            a.renderer.zorder - b.renderer.zorder;});
    for(let i=0;i<this.instance._gameObjects.length;i++){
        let gameObj = this.instance._gameObjects[i];
        if(gameObj.renderer) {
            gameObj.renderer.x = gameObj.transform.position.x;
            gameObj.renderer.y = gameObj.transform.position.y;
            gameObj.renderer.scale = gameObj.scale;
            gameObj.renderer.angleInRadians = gameObj.transform.rotation.radians;
            this.render(gameObj.renderer);
        }
    }

    this.instance.camera.storeState();
    this.instance.camera.reset();
    this.instance._uiItems.sort(
        function(a,b){return a.renderer.zorder - b.renderer.zorder;});
    for(let i=0;i<this.instance._uiItems.length;i++){
        let gameObj = this.instance._uiItems[i];
        if(gameObj.renderer) {
            gameObj.renderer.x = gameObj.transform.position.x;
            gameObj.renderer.y = gameObj.transform.position.y;
            gameObj.renderer.scale = gameObj.scale;
            gameObj.renderer.angleInRadians = gameObj.transform.rotation.radians;
            this.render(gameObj.renderer);
        }
    }
    this.instance.camera.loadState();

    if (this.wingWidthX > 0) {
        this._ctx.fillStyle = "#000000";
        this._ctx.fillRect(0, 0, this.wingWidthX, this.screenHeight);
        this._ctx.fillRect(this.screenWidth - this.wingWidthX, 0, this.screenWidth,
            this.screenHeight);
    }
    if (this.wingWidthY > 0){
        this._ctx.fillStyle = "#000000";
        this._ctx.fillRect(0, 0, this.screenWidth, this.wingWidthY);
        this._ctx.fillRect(0, this.screenHeight - this.wingWidthY, this.screenWidth,
            this.screenHeight);
    }
};
Render.prototype.drawText = function(font, text, x, y){
    this.drawTextScaledAlphaRotatedRadians(font, text, x, y, 1, 1);
};
Render.prototype.drawTextScaled = function(font, text, x, y, scale) {
    this.drawTextScaledAlphaRotatedRadians(font, text, x, y, scale, 1);
};
Render.prototype.drawTextAlpha = function(font, text, x, y, alpha) {
    this.drawTextScaledAlphaRotatedRadians(font, text, x, y, 1, alpha);
};
Render.prototype.drawTextScaledAlpha = function(font, text, x, y, scale, alpha) {
    this.drawTextScaledAlphaRotatedRadians(font, text, x, y, scale, alpha);
};
Render.prototype.drawTextScaledAlphaRotatedDegrees = function(font, text, x, y, scale, alpha, anchorXPercent,
    anchorYPercent, angleInDegrees) {
    this.drawTextScaledAlphaRotatedRadians(font, text, x, y, scale, alpha,
        anchorXPercent, anchorYPercent, angleInDegrees * Math.PI / 180);
};
Render.prototype.drawTextScaledAlphaRotatedRadians = function(font, text, x, y, scale, alpha, anchorXPercent,
    anchorYPercent, angleInRadians) {
    this._renderText(font, text, x, y, scale, alpha, anchorXPercent, anchorYPercent,
        angleInRadians, 5, -35);
};
Render.prototype.drawTextNeo = function(font, size, text, color, x, y, scale, alignment, baseline, alpha, anchorXPercent, anchorYPercent, angleInRadians){
    this._renderText(font, text, size, color, x, y, scale, alpha, anchorXPercent, anchorYPercent, angleInRadians, alignment, baseline, 1, 1);
};
Render.prototype._renderText = function(font, text, size, color, x, y, scale, alpha, anchorXPercent, anchorYPercent,
    angleInRadians, alignment, baseline, letterSpacing, lineSpacingDelta){
    if (alpha <= 0) return;
    if(text == null) return;
    
    // Initial variables
    let img = this.instance.assets.getImage(font);
    var xdelta = 0;
    var ydelta = 0;
    let lineHeight = this.instance.assets.getLineHeight(font);
    if (alpha != 1) this._ctx.globalAlpha = alpha;

    let camera = this.instance.camera;

    // Get measurements
    let fontSize = size * this.scaleFactor * scale * camera.scale;
    var measurement = this.measureText(font, text, size, letterSpacing);

    var xAnchorFactor = this.scaleFactor * measurement.width * anchorXPercent * scale * camera.scale;
    var yAnchorFactor = this.scaleFactor * measurement.height * anchorYPercent * scale * camera.scale;

    this._safeTranslate(this.wingWidthX, this.wingWidthY);
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
    this._safeTranslate(-this.wingWidthX, -this.wingWidthY);

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
    let x = parseInt(((event.clientX - rect.left) - this.wingWidthX) / this.scaleFactor);
    //x = _clamp(x, 0, this.gameWidth);
    let y = parseInt(((event.clientY - rect.top) - this.wingWidthY) / this.scaleFactor);
    //y = _clamp(y, 0, this.gameHeight);
    if (x < 0 ||
        x > this.gameWidth ||
        y < 0 ||
        y > this.gameHeight)
        return {x: null, y: null};
    let camera = this.instance.camera;
    return { x: x + camera.transform.position.x - camera.fovX, y: y + camera.transform.position.y - camera.fovY };
};
Render.prototype._getRawCursorPosition = function(event){
    const rect = this._canvas.getBoundingClientRect();
    let x = parseInt(((event.clientX - rect.left) - this.wingWidthX) / this.scaleFactor);
    //x = _clamp(x, 0, this.gameWidth);
    let y = parseInt(((event.clientY - rect.top) - this.wingWidthY) / this.scaleFactor);
    //y = _clamp(y, 0, this.gameHeight);
    if (x < 0 ||
        x > this.gameWidth ||
        y < 0 ||
        y > this.gameHeight)
        return {x: null, y: null};
    return { x: x, y: y };
};
Render.prototype._safeTranslate = function(x, y){
    this._ctx.translate(this._safeRound(x), this._safeRound(y));
};
Render.prototype._safeRound = function(v){
    return (v >= 0 || -1) * Math.round(Math.abs(v));
};