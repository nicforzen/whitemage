export function Point(x, y){
    this.x = x;
    this.y = y;
}

Point.prototype = {};

// if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') module.exports = Point;