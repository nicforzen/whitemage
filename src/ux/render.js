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

Render.prototype = {
    setInstance(instance){
        this.instance = instance;
    },
    fillCanvas(color) {
        this._ctx.fillStyle = color.hexString;
        this._ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);
    },
    fillRect(x1, y1, x2, y2, color){
        this.p_renderRect(x1, y1, x2, y2, 1, 0, 0, 0, color, true, 1, 1);
    },
    fillRectAlpha(x1, y1, x2, y2, alpha, color) {
        this.p_renderRect(x1, y1, x2, y2, alpha, 0, 0, 0, color, true, 1, 1);
    },
    fillRectAlphaRotatedDegrees(x1, y1, x2, y2, alpha, anchorXPercent, anchorYPercent,
        angleInDegrees, color){
        this.p_renderRect(x1, y1, x2, y2, alpha, anchorXPercent, anchorYPercent,
            angleInDegrees * Math.PI / 180, color, true, 1, 1);
    },
    fillRectAlphaRotatedRadians(x1, y1, x2, y2, alpha, anchorXPercent, anchorYPercent,
        angleInRadians, color){
        this.p_renderRect(x1, y1, x2, y2, alpha, anchorXPercent, anchorYPercent,
            angleInRadians, color, true, 1, 1);
    },
    fillRectRotatedDegrees(x1, y1, x2, y2, anchorXPercent, anchorYPercent,
        angleInDegrees, color) {
        this.p_renderRect(x1, y1, x2, y2, 1, anchorXPercent, anchorYPercent,
            angleInDegrees * Math.PI / 180, color, true, 1, 1);
    },
    fillRectRotatedRadians(x1, y1, x2, y2, anchorXPercent, anchorYPercent,
        angleInRadians, color) {
        this.p_renderRect(x1, y1, x2, y2, 1, anchorXPercent, anchorYPercent,
            angleInRadians, color, true, 1, 1);
    },
    strokeRect(x1, y1, x2, y2, color, lineWidth) {
        this.p_renderRect(x1, y1, x2, y2, 1, 0, 0, 0, color, false, lineWidth, 1);
    },
    strokeRectAlpha(x1, y1, x2, y2, alpha, color, lineWidth) {
        this.p_renderRect(x1, y1, x2, y2, alpha, 0, 0, 0, color, false, lineWidth, 1);
    },
    strokeRectAlphaRotatedDegrees(x1, y1, x2, y2, alpha, anchorXPercent, anchorYPercent,
        angleInDegrees, color, lineWidth) {
        this.p_renderRect(x1, y1, x2, y2, alpha, anchorXPercent, anchorYPercent,
            angleInDegrees * Math.PI / 180, color, false, lineWidth, 1);
    },
    strokeRectAlphaRotatedRadians(x1, y1, x2, y2, alpha, anchorXPercent, anchorYPercent,
        angleInRadians, color, lineWidth) {
        this.p_renderRect(x1, y1, x2, y2, alpha, anchorXPercent, anchorYPercent,
            angleInRadians, color, false, lineWidth, 1);
    },
    strokeRectRotatedDegrees(x1, y1, x2, y2, anchorXPercent, anchorYPercent,
        angleInDegrees, color, lineWidth) {
        this.p_renderRect(x1, y1, x2, y2, 1, anchorXPercent, anchorYPercent,
            angleInDegrees * Math.PI / 180, color, false, lineWidth, 1);
    },
    strokeRectRotatedRadians(x1, y1, x2, y2, anchorXPercent, anchorYPercent,
        angleInRadians, color, lineWidth) {
        this.p_renderRect(x1, y1, x2, y2, 1, anchorXPercent, anchorYPercent,
            angleInRadians, color, false, lineWidth, 1);
    },
    p_renderRect(x1, y1, x2, y2, alpha, anchorXPercent, anchorYPercent, angleInRadians, color,
        isFill, lineWidth, scale){
        if (alpha <= 0) return;

        let camera = this.instance.camera;

        let width = (x2 - x1) * scale * camera.scale;
        let height = (y2 - y1) * scale * camera.scale;

        if (alpha != 1) this._ctx.globalAlpha = alpha;

        let xAnchorFactor = this.scaleFactor * width * anchorXPercent;
        let yAnchorFactor = this.scaleFactor * height * anchorYPercent;

        this._safeTranslate(this.wingWidthX, this.wingWidthY);
        this._safeTranslate(this.scaleFactor * ((x1 - camera.x)*camera.scale + camera.fovX),
            this.scaleFactor * ((y1 - camera.y)*camera.scale + camera.fovY));
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
        this._safeTranslate(-this.scaleFactor * ((x1 - camera.x)*camera.scale + camera.fovX),
            -this.scaleFactor * ((y1 - camera.y)*camera.scale + camera.fovY));
        this._safeTranslate(-this.wingWidthX, -this.wingWidthY);
        
        if (alpha != 1) this._ctx.globalAlpha = 1;
    },
    fillCircle(x, y, r, color){
        this.p_renderCircle(x, y, r, 1, color, true, 1);
    },
    fillCircleAlpha(x, y, r, alpha, color){
        this.p_renderCircle(x, y, r, alpha, color, true, 1);
    },
    strokeCircle(x, y, r, color, lineWidth){
        this.p_renderCircle(x, y, r, 1, color, false, lineWidth);
    },
    strokeCircleAlpha(x, y, r, alpha, color, lineWidth){
        this.p_renderCircle(x, y, r, alpha, color, false, lineWidth);
    },
    fillArc(x, y, r, radianStart, radianEnd, color){
        this.p_renderArc(x, y, r, 1, color, true, 1, radianStart, radianEnd);
    },
    fillArcAlpha(x, y, r, radianStart, radianEnd, alpha, color){
        this.p_renderArc(x, y, r, alpha, color, true, 1, radianStart, radianEnd);
    },
    strokeArc(x, y, r, radianStart, radianEnd, color, lineWidth){
        this.p_renderArc(x, y, r, 1, color, false, lineWidth, radianStart, radianEnd);
    },
    strokeArcAlpha(x, y, r, radianStart, radianEnd, alpha, color, lineWidth){
        this.p_renderArc(x, y, r, alpha, color, false, lineWidth, radianStart, radianEnd);
    },
    p_renderCircle(x, y, r, alpha, color, isFill, lineWidth){
        this.p_renderArc(x, y,
             r, alpha, color, isFill, lineWidth, 0, 2*Math.PI)
    },
    p_renderArc(x, y, r, alpha, color, isFill, lineWidth, radianStart, radianEnd){
        if (alpha <= 0) return;
        if (alpha != 1) this._ctx.globalAlpha = alpha;
        this._ctx.lineWidth = lineWidth * this.scaleFactor;
        this._ctx.beginPath();
        let camera = this.instance.camera;
        let dx = ((x-camera.x)*camera.scale+camera.fovX) * this.scaleFactor + this.wingWidthX;
        let dy = ((y-camera.y)*camera.scale+camera.fovY) * this.scaleFactor + this.wingWidthY;
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
    },
    p_renderPolygon(x, y, points, alpha, color, isFill, lineWidth){
        if (alpha <= 0) return;
        if (alpha != 1) this._ctx.globalAlpha = alpha;
        let camera = this.instance.camera;
        this._ctx.lineWidth = lineWidth * this.scaleFactor;
        this._ctx.beginPath();
        let dx = ((x-camera.x)*camera.scale+camera.fovX) * this.scaleFactor + this.wingWidthX;
        let dy = ((y-camera.y)*camera.scale+camera.fovY) * this.scaleFactor + this.wingWidthY;
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
    },
    drawLine(x1, y1, x2, y2, lineWidth, color){
        this.p_renderLine(x1, y1, x2, y2, lineWidth, 1, color);
    },
    drawLineAlpha(x1, y1, x2, y2, alpha, lineWidth, color) {
        this.p_renderLine(x1, y1, x2, y2, lineWidth, alpha, color);
    },
    p_renderLine(x1, y1, x2, y2, lineWidth, alpha, color){
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
    },
    drawImage(name, x, y) {
        this.p_renderImage(name, x, y, 1, 1, 0, 0, 0, null, false, null, 0, false, false);
    },
    drawImageFiltered(name, x, y, color, colorAlpha) {
        this.p_renderImage(name, x, y, 1, 1, 0, 0, 0, null, true, color, colorAlpha, false, false);
    },
    drawImageScaled(name, x, y, scale){
        this.p_renderImage(name, x, y, scale, 1, 0, 0, 0, null, false, null, 0, false, false);
    },
    drawImageScaledFiltered(name, x, y, scale, color, colorAlpha) {
        this.p_renderImage(name, x, y, scale, 1, 0, 0, 0, null, true, color, colorAlpha, false, false);
    },
    drawImageAlpha(name, x, y, alpha) {
        this.p_renderImage(name, x, y, 1, alpha, 0, 0, 0, null, false, null, 0, false, false);
    },
    drawImageAlphaFiltered(name, x, y, alpha, color, colorAlpha) {
        this.p_renderImage(name, x, y, 1, alpha, 0, 0, 0, null, true, color, colorAlpha, false, false);
    },
    drawImageScaledAlpha(name, x, y, scale, alpha) {
        this.p_renderImage(name, x, y, scale, alpha, 0, 0, 0, null, false, null, 0, false, false);
    },
    drawImageScaledAlphaFiltered(name, x, y, scale, alpha, color, colorAlpha) {
        this.p_renderImage(name, x, y, scale, alpha, 0, 0, 0, null, true, color, colorAlpha, false, false);
    },
    drawImageRotatedDegrees(name, x, y, anchorXPercent, anchorYPercent, angleInDegrees){
        this.p_renderImage(name, x, y, 1, 1, anchorXPercent,
            anchorYPercent, angleInDegrees * Math.PI / 180, null, false, null, 0, false, false);
    },
    drawImageRotatedDegreesFiltered(name, x, y, anchorXPercent, anchorYPercent, angleInDegrees,
        color, colorAlpha) {
        this.p_renderImage(name, x, y, 1, 1, anchorXPercent,
            anchorYPercent, angleInDegrees * Math.PI / 180, null, true, color, colorAlpha, false, false);
    },
    drawImageRotatedRadians(name, x, y, anchorXPercent, anchorYPercent, angleInRadians) {
        this.p_renderImage(name, x, y, 1, 1, anchorXPercent, anchorYPercent,
            angleInRadians, null, false, null, 0, false, false);
    },
    drawImageRotatedRadiansFiltered(name, x, y, anchorXPercent, anchorYPercent, angleInRadians,
        color, colorAlpha) {
        this.p_renderImage(name, x, y, 1, 1, anchorXPercent, anchorYPercent,
            angleInRadians, null, true, color, colorAlpha, false, false);
    },
    drawImageScaledRotatedDegrees(name, x, y, scale, anchorXPercent, anchorYPercent,
        angleInDegrees) {
        this.p_renderImage(name, x, y, scale, 1, anchorXPercent, anchorYPercent, 
            angleInDegrees * Math.PI / 180, null, false, null, 0, false, false);
    },
    drawImageScaledRotatedDegreesFiltered(name, x, y, scale, anchorXPercent, anchorYPercent,
        angleInDegrees, color, colorAlpha) {
        this.p_renderImage(name, x, y, scale, 1, anchorXPercent, anchorYPercent,
            angleInDegrees * Math.PI / 180, null, true, color, colorAlpha, false, false);
    },
    drawImageScaledRotatedRadians(name, x, y, scale, anchorXPercent, anchorYPercent,
        angleInRadians) {
        this.p_renderImage(name, x, y, scale, 1, anchorXPercent, anchorYPercent,
            angleInRadians, null, false, null, 0, false, false);
    },
    drawImageScaledRotatedRadiansFiltered(name, x, y, scale, anchorXPercent, anchorYPercent,
        angleInRadians, color, colorAlpha) {
        this.p_renderImage(name, x, y, scale, 1, anchorXPercent, anchorYPercent,
            angleInRadians, null, true, color, colorAlpha, false, false);
    },
    drawImageScaledAlphaRotatedDegrees(name, x, y, scale, alpha, anchorXPercent, anchorYPercent,
        angleInDegrees) {
        this.p_renderImage(name, x, y, scale, alpha, anchorXPercent,
            anchorYPercent, angleInDegrees * Math.PI / 180, null, false, null, 0, false, false);
    },
    drawImageScaledAlphaRotatedDegreesFiltered(name, x, y, scale, alpha, anchorXPercent, 
        anchorYPercent, angleInDegrees, color, colorAlpha) {
        this.p_renderImage(name, x, y, scale, alpha, anchorXPercent,
            anchorYPercent, angleInDegrees * Math.PI / 180, null, true, color, colorAlpha, false, false);
    },
    drawImageScaledAlphaRotatedRadians(name, x, y, scale, alpha, anchorXPercent, anchorYPercent,
        angleInRadians){
        this.p_renderImage(name, x, y, scale, alpha, anchorXPercent, anchorYPercent, 
            angleInRadians, null, null, false, null, 0, false, false);
    },
    drawImageScaledAlphaRotatedRadiansFiltered(name, x, y, scale, alpha, anchorXPercent,
        anchorYPercent, angleInRadians, color, colorAlpha) {
        this.p_renderImage(name, x, y, scale, alpha, anchorXPercent, anchorYPercent,
            angleInRadians, null, null, true, color, colorAlpha, false, false);
    },
    drawMappedImage(name, mappingData, x, y) {
        this.p_renderImage(name, x, y, 1, 1, 0, 0, 0, mappingData, false, null, 0, false, false);
    },
    drawMappedImageFiltered(name, mappingData, x, y, color, colorAlpha) {
        this.p_renderImage(name, x, y, 1, 1, 0, 0, 0, mappingData, true, color, colorAlpha, false, false);
    },
    drawMappedImageScaled(name, mappingData, x, y, scale) {
        this.p_renderImage(name, x, y, scale, 1, 0, 0, 0, mappingData, false, null, 0, false, false);
    },
    drawMappedImageScaledFiltered(name, mappingData, x, y, scale, color, colorAlpha) {
        this.p_renderImage(name, x, y, scale, 1, 0, 0, 0, mappingData, true, color, colorAlpha, false, false);
    },
    drawMappedImageAlpha(name, mappingData, x, y, alpha) {
        this.p_renderImage(name, x, y, 1, alpha, 0, 0, 0, mappingData, false, null, 0, false, false);
    },
    drawMappedImageAlphaFiltered(name, mappingData, x, y, alpha, color, colorAlpha) {
        this.p_renderImage(name, x, y, 1, alpha, 0, 0, 0, mappingData, true, color, colorAlpha, false, false);
    },
    drawMappedImageScaledAlpha(name, mappingData, x, y, scale, alpha) {
        this.p_renderImage(name, x, y, scale, alpha, 0, 0, 0, mappingData, false, null, 0, false, false);
    },
    drawMappedImageScaledAlphaFiltered(name, mappingData, x, y, scale, alpha, color, colorAlpha) {
        this.p_renderImage(name, x, y, scale, alpha, 0, 0, 0, mappingData, true, color,
            colorAlpha, false, false);
    },
    drawMappedImageRotatedDegrees(name, mappingData, x, y, anchorXPercent, anchorYPercent,
        angleInDegrees) {
        this.p_renderImage(name, x, y, 1, 1, anchorXPercent,
            anchorYPercent, angleInDegrees * Math.PI / 180, mappingData, false, null, 0, false, false);
    },
    drawMappedImageRotatedDegreesFiltered(name, mappingData, x, y, anchorXPercent, anchorYPercent,
        angleInDegrees, color, colorAlpha) {
        this.p_renderImage(name, x, y, 1, 1, anchorXPercent,
            anchorYPercent, angleInDegrees * Math.PI / 180, mappingData, true, color, colorAlpha, false, false);
    },
    drawMappedImageRotatedRadians(name, mappingData, x, y, anchorXPercent, anchorYPercent,
        angleInRadians) {
        this.p_renderImage(name, x, y, 1, 1, anchorXPercent, anchorYPercent,
            angleInRadians, mappingData, false, null, 0, false, false);
    },
    drawMappedImageRotatedRadiansFiltered(name, mappingData, x, y, anchorXPercent, anchorYPercent,
        angleInRadians, color, colorAlpha) {
        this.p_renderImage(name, x, y, 1, 1, anchorXPercent, anchorYPercent,
            angleInRadians, mappingData, true, color, colorAlpha, false, false);
    },
    drawMappedImageScaledRotatedDegrees(name, mappingData, x, y, scale, anchorXPercent,
        anchorYPercent, angleInDegrees) {
        this.p_renderImage(name, x, y, scale, 1, anchorXPercent, anchorYPercent,
            angleInDegrees * Math.PI / 180, mappingData, false, null, 0, false, false);
    },
    drawMappedImageScaledRotatedDegreesFiltered(name, mappingData, x, y, scale, anchorXPercent,
        anchorYPercent, angleInDegrees, color, colorAlpha) {
        this.p_renderImage(name, x, y, scale, 1, anchorXPercent, anchorYPercent,
            angleInDegrees * Math.PI / 180, mappingData, true, color, colorAlpha, false, false);
    },
    drawMappedImageScaledRotatedRadians(name, mappingData, x, y, scale, anchorXPercent,
        anchorYPercent, angleInRadians) {
        this.p_renderImage(name, x, y, scale, 1, anchorXPercent, anchorYPercent,
            angleInRadians, mappingData, false, null, 0, false, false);
    },
    drawMappedImageScaledRotatedRadiansFiltered(name, mappingData, x, y, scale, anchorXPercent,
        anchorYPercent, angleInRadians, color, colorAlpha) {
        this.p_renderImage(name, x, y, scale, 1, anchorXPercent, anchorYPercent,
            angleInRadians, mappingData, true, color, colorAlpha, false, false);
    },
    drawMappedImageScaledAlphaRotatedDegrees(name, mappingData, x, y, scale, alpha, anchorXPercent,
        anchorYPercent, angleInDegrees) {
        this.p_renderImage(name, x, y, scale, alpha, anchorXPercent,
            anchorYPercent, angleInDegrees * Math.PI / 180, mappingData, false, null, 0, false, false);
    },
    drawMappedImageScaledAlphaRotatedDegreesFiltered(name, mappingData, x, y, scale, alpha,
        anchorXPercent, anchorYPercent, angleInDegrees, color, colorAlpha) {
        this.p_renderImage(name, x, y, scale, alpha, anchorXPercent,
            anchorYPercent, angleInDegrees * Math.PI / 180, mappingData, true, color, colorAlpha, false, false);
    },
    drawMappedImageScaledAlphaRotatedRadians(name, mappingData, x, y, scale, alpha, anchorXPercent,
        anchorYPercent, angleInRadians) {
        this.p_renderImage(name, x, y, scale, alpha, anchorXPercent, anchorYPercent,
            angleInRadians, mappingData, false, null, 0, false, false);
    },
    drawMappedImageScaledAlphaRotatedRadiansFiltered(name, mappingData, x, y, scale, alpha,
        anchorXPercent, anchorYPercent, angleInRadians, color, colorAlpha) {
        this.p_renderImage(name, x, y, scale, alpha, anchorXPercent, anchorYPercent,
            angleInRadians, mappingData, true, color, colorAlpha, false, false);
    },
    render(r){
        if(!r.isVisible) return;
        if(r instanceof RectangleRenderer) {
            this.p_renderRect(r.x, r.y, r.x+r.width, r.y+r.height, r.alpha, r.anchorXPercent, r.anchorYPercent,
                r.angleInRadians, r.color, r.isFill, r.lineWidth, r.scale);
        } else if(r instanceof CircleRenderer) {
            this.p_renderCircle(r.x, r.y, r.r, r.alpha, r.color, r.isFill, r.lineWidth);
        } else if(r instanceof ArcRenderer){
            this.p_renderArc(r.x, r.y, r.r, r.alpha, r.color, r.isFill, r.lineWidth, r.radianStart, r.radianEnd);
        } else if(r instanceof PolygonRenderer){
            this.p_renderPolygon(r.x, r.y, r.points, r.alpha, r.color, r.isFill, r.lineWidths);
        } else if(r instanceof TextRenderer){
            this.drawTextNeo(r.font, r.size, r.text, r.color, r.x, r.y, r.scale, r.alignment, r.baseline, r.alpha,
                r.anchorXPercent, r.anchorYPercent, r.angleInRadians);
        }
        else{
            this.p_renderImage(r.imageName, r.x, r.y, r.scale, r.alpha, r.anchorXPercent, r.anchorYPercent, r.angleInRadians, 
            (this.instance.assets.getMappingData(r.imageName)) ? this.instance.assets.getMappingData(r.imageName)[r.spriteName] : null, 
            r.drawSil, r.silColor, r.silAlpha, r.flipX, r.flipY);
        }
    },
    p_renderImage(name, x, y, scale, alpha, anchorXPercent, anchorYPercent,
        angleInRadians, mappingData, drawSil, silColor, silAlpha, flipX, flipY){
        if(alpha <= 0) return;
        if(drawSil){
            let silName = name + SilSuffix;
            if(!this.instance.assets.containsImage(silName)){
                this.instance.assets.p_createSil(name, silColor)
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
        this._safeTranslate(this.scaleFactor * ((x - camera.x)*camera.scale + camera.fovX),
            this.scaleFactor * ((y - camera.y)*camera.scale + camera.fovY));
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
        this._safeTranslate(-this.scaleFactor * ((x - camera.x)*camera.scale + camera.fovX),
            -this.scaleFactor * ((y - camera.y)*camera.scale + camera.fovY));
        this._safeTranslate(-this.wingWidthX, -this.wingWidthY);
    },
    p_render(){
        if(this.instance.onRender) this.instance.onRender();
        this.instance.p_gameObjects.sort(
            function(a,b){return (!a.renderer || !b.renderer) ? 0 :
                a.renderer.zorder - b.renderer.zorder})
        for(let i=0;i<this.instance.p_gameObjects.length;i++){
            let gameObj = this.instance.p_gameObjects[i];
            if(gameObj.renderer) {
                gameObj.renderer.x = gameObj.x;
                gameObj.renderer.y = gameObj.y;
                gameObj.renderer.scale = gameObj.scale;
                gameObj.renderer.angleInRadians = gameObj.angleInRadians;
                this.render(gameObj.renderer);
            }
        }

        this.instance.camera.storeState();
        this.instance.camera.reset();
        this.instance.p_uiItems.sort(
            function(a,b){return a.renderer.zorder - b.renderer.zorder})
        for(let i=0;i<this.instance.p_uiItems.length;i++){
            let gameObj = this.instance.p_uiItems[i];
            if(gameObj.renderer) {
                gameObj.renderer.x = gameObj.x;
                gameObj.renderer.y = gameObj.y;
                gameObj.renderer.scale = gameObj.scale;
                gameObj.renderer.angleInRadians = gameObj.angleInRadians;
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
    },
    drawText(font, text, x, y){
        this.drawTextScaledAlphaRotatedRadians(font, text, x, y, 1, 1);
    },
    drawTextScaled(font, text, x, y, scale) {
        this.drawTextScaledAlphaRotatedRadians(font, text, x, y, scale, 1);
    },
    drawTextAlpha(font, text, x, y, alpha) {
        this.drawTextScaledAlphaRotatedRadians(font, text, x, y, 1, alpha);
    },
    drawTextScaledAlpha(font, text, x, y, scale, alpha) {
        this.drawTextScaledAlphaRotatedRadians(font, text, x, y, scale, alpha);
    },
    drawTextScaledAlphaRotatedDegrees(font, text, x, y, scale, alpha, anchorXPercent,
        anchorYPercent, angleInDegrees) {
        this.drawTextScaledAlphaRotatedRadians(font, text, x, y, scale, alpha,
            anchorXPercent, anchorYPercent, angleInDegrees * Math.PI / 180);
    },
    drawTextScaledAlphaRotatedRadians(font, text, x, y, scale, alpha, anchorXPercent,
        anchorYPercent, angleInRadians) {
        this.p_renderText(font, text, x, y, scale, alpha, anchorXPercent, anchorYPercent,
            angleInRadians, 5, -35);
    },
    drawTextNeo(font, size, text, color, x, y, scale, alignment, baseline, alpha, anchorXPercent, anchorYPercent, angleInRadians){
        this.p_renderText(font, text, size, color, x, y, scale, alpha, anchorXPercent, anchorYPercent, angleInRadians, alignment, baseline, 1, 1);
    },
    p_renderText(font, text, size, color, x, y, scale, alpha, anchorXPercent, anchorYPercent,
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
        this._safeTranslate(this.scaleFactor * ((x - camera.x)*camera.scale + camera.fovX),
            this.scaleFactor * ((y - camera.y)*camera.scale + camera.fovY));
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
        this._safeTranslate(-this.scaleFactor * ((x - camera.x)*camera.scale + camera.fovX),
            -this.scaleFactor * ((y - camera.y)*camera.scale + camera.fovY));
        this._safeTranslate(-this.wingWidthX, -this.wingWidthY);

        if (alpha != 1) this._ctx.globalAlpha = 1;
    },
    measureRenderedText(font, text, scale, letterSpacing){
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
    },
    measureText(font, text, size, scale){
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
    },
    measureUnscaledText(font, text, letterSpacing) {
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
    },
    renderFrame(){
        requestAnimationFrame(this.p_render.bind(this));
    },
    _getCursorPosition(event) {
        const rect = this._canvas.getBoundingClientRect()
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
        return { x: x + camera.x - camera.fovX, y: y + camera.y - camera.fovY };
    },
    _getRawCursorPosition(event){
        const rect = this._canvas.getBoundingClientRect()
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
    },
    _safeTranslate(x, y){
        this._ctx.translate(this._safeRound(x), this._safeRound(y));
    },
    _safeRound(v){
        return (v >= 0 || -1) * Math.round(Math.abs(v))
    }
};

export function NoOpRender(){

}

NoOpRender.prototype = {
    setInstance(instance){},
    fillCanvas(color) {},
    fillRect(x1, y1, x2, y2, color){},
    fillRectAlpha(x1, y1, x2, y2, alpha, color) {},
    fillRectAlphaRotatedDegrees(x1, y1, x2, y2, alpha, anchorXPercent, anchorYPercent,
        angleInDegrees, color){},
    fillRectAlphaRotatedRadians(x1, y1, x2, y2, alpha, anchorXPercent, anchorYPercent,
        angleInRadians, color){},
    fillRectRotatedDegrees(x1, y1, x2, y2, anchorXPercent, anchorYPercent,
        angleInDegrees, color) {},
    fillRectRotatedRadians(x1, y1, x2, y2, anchorXPercent, anchorYPercent,
        angleInRadians, color) {},
    strokeRect(x1, y1, x2, y2, color, lineWidth) {},
    strokeRectAlpha(x1, y1, x2, y2, alpha, color, lineWidth) {},
    strokeRectAlphaRotatedDegrees(x1, y1, x2, y2, alpha, anchorXPercent, anchorYPercent,
        angleInDegrees, color, lineWidth) {},
    strokeRectAlphaRotatedRadians(x1, y1, x2, y2, alpha, anchorXPercent, anchorYPercent,
        angleInRadians, color, lineWidth) {},
    strokeRectRotatedDegrees(x1, y1, x2, y2, anchorXPercent, anchorYPercent,
        angleInDegrees, color, lineWidth) {},
    strokeRectRotatedRadians(x1, y1, x2, y2, anchorXPercent, anchorYPercent,
        angleInRadians, color, lineWidth) {},
    p_renderRect(x1, y1, x2, y2, alpha, anchorXPercent, anchorYPercent, angleInRadians, color,
        isFill, lineWidth){},
    fillCircle(x, y, r, color){},
    fillCircleAlpha(x, y, r, alpha, color){},
    strokeCircle(x, y, r, color, lineWidth){},
    strokeCircleAlpha(x, y, r, alpha, color, lineWidth){},
    p_renderCircle(x, y, r, alpha, color, isFill, lineWidth){},
    drawLine(x1, y1, x2, y2, lineWidth, color){},
    drawLineAlpha(x1, y1, x2, y2, alpha, lineWidth, color) {},
    p_renderLine(x1, y1, x2, y2, lineWidth, alpha, color){},
    drawImage(name, x, y) {},
    drawImageFiltered(name, x, y, color, colorAlpha) {},
    drawImageScaled(name, x, y, scale){},
    drawImageScaledFiltered(name, x, y, scale, color, colorAlpha) {},
    drawImageAlpha(name, x, y, alpha) {},
    drawImageAlphaFiltered(name, x, y, alpha, color, colorAlpha) {},
    drawImageScaledAlpha(name, x, y, scale, alpha) {},
    drawImageScaledAlphaFiltered(name, x, y, scale, alpha, color, colorAlpha) {},
    drawImageRotatedDegrees(name, x, y, anchorXPercent, anchorYPercent, angleInDegrees){},
    drawImageRotatedDegreesFiltered(name, x, y, anchorXPercent, anchorYPercent, angleInDegrees,
        color, colorAlpha) {},
    drawImageRotatedRadians(name, x, y, anchorXPercent, anchorYPercent, angleInRadians) {},
    drawImageRotatedRadiansFiltered(name, x, y, anchorXPercent, anchorYPercent, angleInRadians,
        color, colorAlpha) {},
    drawImageScaledRotatedDegrees(name, x, y, scale, anchorXPercent, anchorYPercent,
        angleInDegrees) {},
    drawImageScaledRotatedDegreesFiltered(name, x, y, scale, anchorXPercent, anchorYPercent,
        angleInDegrees, color, colorAlpha) {},
    drawImageScaledRotatedRadians(name, x, y, scale, anchorXPercent, anchorYPercent,
        angleInRadians) {},
    drawImageScaledRotatedRadiansFiltered(name, x, y, scale, anchorXPercent, anchorYPercent,
        angleInRadians, color, colorAlpha) {},
    drawImageScaledAlphaRotatedDegrees(name, x, y, scale, alpha, anchorXPercent, anchorYPercent,
        angleInDegrees) {},
    drawImageScaledAlphaRotatedDegreesFiltered(name, x, y, scale, alpha, anchorXPercent, 
        anchorYPercent, angleInDegrees, color, colorAlpha) {},
    drawImageScaledAlphaRotatedRadians(name, x, y, scale, alpha, anchorXPercent, anchorYPercent,
        angleInRadians){},
    drawImageScaledAlphaRotatedRadiansFiltered(name, x, y, scale, alpha, anchorXPercent,
        anchorYPercent, angleInRadians, color, colorAlpha) {},
    drawMappedImage(name, mappingData, x, y) {},
    drawMappedImageFiltered(name, mappingData, x, y, color, colorAlpha) {},
    drawMappedImageScaled(name, mappingData, x, y, scale) {},
    drawMappedImageScaledFiltered(name, mappingData, x, y, scale, color, colorAlpha) {},
    drawMappedImageAlpha(name, mappingData, x, y, alpha) {},
    drawMappedImageAlphaFiltered(name, mappingData, x, y, alpha, color, colorAlpha) {},
    drawMappedImageScaledAlpha(name, mappingData, x, y, scale, alpha) {},
    drawMappedImageScaledAlphaFiltered(name, mappingData, x, y, scale, alpha, color, colorAlpha) {},
    drawMappedImageRotatedDegrees(name, mappingData, x, y, anchorXPercent, anchorYPercent,
        angleInDegrees) {},
    drawMappedImageRotatedDegreesFiltered(name, mappingData, x, y, anchorXPercent, anchorYPercent,
        angleInDegrees, color, colorAlpha) {},
    drawMappedImageRotatedRadians(name, mappingData, x, y, anchorXPercent, anchorYPercent,
        angleInRadians) {},
    drawMappedImageRotatedRadiansFiltered(name, mappingData, x, y, anchorXPercent, anchorYPercent,
        angleInRadians, color, colorAlpha) {},
    drawMappedImageScaledRotatedDegrees(name, mappingData, x, y, scale, anchorXPercent,
        anchorYPercent, angleInDegrees) {},
    drawMappedImageScaledRotatedDegreesFiltered(name, mappingData, x, y, scale, anchorXPercent,
        anchorYPercent, angleInDegrees, color, colorAlpha) {},
    drawMappedImageScaledRotatedRadians(name, mappingData, x, y, scale, anchorXPercent,
        anchorYPercent, angleInRadians) {},
    drawMappedImageScaledRotatedRadiansFiltered(name, mappingData, x, y, scale, anchorXPercent,
        anchorYPercent, angleInRadians, color, colorAlpha) {},
    drawMappedImageScaledAlphaRotatedDegrees(name, mappingData, x, y, scale, alpha, anchorXPercent,
        anchorYPercent, angleInDegrees) {},
    drawMappedImageScaledAlphaRotatedDegreesFiltered(name, mappingData, x, y, scale, alpha,
        anchorXPercent, anchorYPercent, angleInDegrees, color, colorAlpha) {},
    drawMappedImageScaledAlphaRotatedRadians(name, mappingData, x, y, scale, alpha, anchorXPercent,
        anchorYPercent, angleInRadians) {},
    drawMappedImageScaledAlphaRotatedRadiansFiltered(name, mappingData, x, y, scale, alpha,
        anchorXPercent, anchorYPercent, angleInRadians, color, colorAlpha) {},
    render(r){},
    p_renderImage(name, x, y, scale, alpha, anchorXPercent, anchorYPercent,
        angleInRadians, mappingData, drawSil, silColor, silAlpha){},
    p_render(){},
    drawText(font, text, x, y){},
    drawTextScaled(font, text, x, y, scale) {},
    drawTextAlpha(font, text, x, y, alpha) {},
    drawTextScaledAlpha(font, text, x, y, scale, alpha) {},
    drawTextScaledAlphaRotatedDegrees(font, text, x, y, scale, alpha, anchorXPercent,
        anchorYPercent, angleInDegrees) {},
    drawTextScaledAlphaRotatedRadians(font, text, x, y, scale, alpha, anchorXPercent,
        anchorYPercent, angleInRadians) {},
    p_renderText(font, text, x, y, scale, alpha, anchorXPercent, anchorYPercent,
        angleInRadians, letterSpacing, lineSpacingDelta){},
    measureRenderedText(font, text, scale, letterSpacing){},
    measureText(font, text, scale, letterSpacing){},
    measureUnscaledText(font, text, letterSpacing) {},
    renderFrame(){},
    _getCursorPosition(event) {},
    _getRawCursorPosition(event){},
    _safeTranslate(x, y){}
};