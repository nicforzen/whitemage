export function ImageRenderer(name) {
        this.imageName = name,
        this.x = 0;
        this.y = 0;
        this.scale = 1;
        this.alpha = 1;
        this.anchorXPercent = 0.5;
        this.anchorYPercent = 0.5;
        this.angleInRadians = 0;
        this.spriteName = null;
        this.drawSil = false;
        this.silColor = null;
        this.silAlpha = 0;
        this.flipX = false;
        this.flipY = false;
        this.isVisible = true;
        this.sortingOrder = 0;
}

export function RectangleRenderer(width, height, color) {
    this.width = width;
    this.height = height;
    this.color = color;
    this.x = 0;
    this.y = 0;
    this.scale = 1;
    this.alpha = 1;
    this.anchorXPercent = 0.5;
    this.anchorYPercent = 0.5;
    this.angleInRadians = 0;
    this.isFill = true;
    this.lineWidth = 1;
    this.flipX = false;
    this.flipY = false;
    this.isVisible = true;
    this.sortingOrder = 0;
}

export function CircleRenderer(r, color){
    this.r = r;
    this.color = color;
    this.x = 0;
    this.y = 0;
    this.scale = 1;
    this.alpha = 1;
    this.anchorXPercent = 0.5;
    this.anchorYPercent = 0.5;
    this.isFill = true;
    this.lineWidth = 1;
    this.flipX = false;
    this.flipY = false;
    this.isVisible = true;
    this.sortingOrder = 0;
}

export function ArcRenderer(r, radianStart, radianEnd, color){
    this.r = r;
    this.radianStart = radianStart;
    this.radianEnd = radianEnd;
    this.color = color;
    this.x = 0;
    this.y = 0;
    this.scale = 1;
    this.alpha = 1;
    this.anchorXPercent = 0.5;
    this.anchorYPercent = 0.5;
    this.isFill = true;
    this.lineWidth = 1;
    this.flipX = false;
    this.flipY = false;
    this.isVisible = true;
    this.sortingOrder = 0;
}

export function PolygonRenderer(points, color) {
    this.points = points;
    this.x = 0;
    this.y = 0;
    this.scale = 1;
    this.alpha = 1;
    this.anchorXPercent = 0.5;
    this.anchorYPercent = 0.5;
    this.isFill = true;
    this.lineWidth = 1;
    this.color = color;
    this.flipX = false;
    this.flipY = false;
    this.isVisible = true;
    this.sortingOrder = 0;
}

export function BitmapTextRenderer(font, text, scale) {
    this.font = font;
    this.text = text;
    this.x = 0;
    this.y = 0;
    this.textScale = scale;
    this.anchorXPercent = 0.5;
    this.anchorYPercent = 0.5;
    this.isVisible = true;
    this.sortingOrder = 0;
}

export function TextRenderer(font, size, color, text, scale, alignment, baseline) {
    this.font = font;
    this.text = text;
    this.x = 0;
    this.y = 0;
    this.size = size;
    this.color = color;
    this.textScale = scale;
    this.anchorXPercent = 0.5;
    this.anchorYPercent = 0.5;
    this.angleInRadians = 0;
    this.alignment = alignment;
    this.baseline = baseline;
    this.isVisible = true;
    this.sortingOrder = 0;
}