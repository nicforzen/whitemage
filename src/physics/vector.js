import { Mathf } from "../core/mathf";

export function Vector2(x, y) {
	this.x = x || 0;
	this.y = y || 0;
}

Vector2.prototype.negative = function() {
	this.x = -this.x;
	this.y = -this.y;
	return this;
};
Vector2.prototype.add = function(v) {
	if (v instanceof Vector2) {
		this.x += v.x;
		this.y += v.y;
	} else {
		this.x += v;
		this.y += v;
	}
	return this;
};
Vector2.prototype.subtract = function(v) {
	if (v instanceof Vector2) {
		this.x -= v.x;
		this.y -= v.y;
	} else {
		this.x -= v;
		this.y -= v;
	}
	return this;
};
Vector2.prototype.multiply = function(v) {
	if (v instanceof Vector2) {
		this.x *= v.x;
		this.y *= v.y;
	} else {
		this.x *= v;
		this.y *= v;
	}
	return this;
};
Vector2.prototype.divide = function(v) {
	if (v instanceof Vector2) {
		if(v.x != 0) this.x /= v.x;
		if(v.y != 0) this.y /= v.y;
	} else {
		if(v != 0) {
			this.x /= v;
			this.y /= v;
		}
	}
	return this;
};
Vector2.prototype.equals = function(v) {
	return this.x == v.x && this.y == v.y;
};
Vector2.prototype.dot = function(v) {
	return this.x * v.x + this.y * v.y;
};
Vector2.prototype.cross = function(v) {
	return this.x * v.y - this.y * v.x;
};
Vector2.prototype.length = function() {
	return Math.sqrt(this.dot(this));
};
Vector2.prototype.normalize = function() {
	return this.divide(this.length());
};
Vector2.prototype.min = function() {
	return Math.min(this.x, this.y);
};
Vector2.prototype.max = function() {
	return Math.max(this.x, this.y);
};
Vector2.prototype.toAngles = function() {
	return -Math.atan2(-this.y, this.x);
};
Vector2.prototype.angleTo = function(a) {
	return Math.acos(this.dot(a) / (this.length() * a.length()));
};
Vector2.prototype.toArray = function(n) {
	return [this.x, this.y].slice(0, n || 2);
};
Vector2.prototype.clone = function() {
	return new Vector2(this.x, this.y);
};
Vector2.prototype.set = function(x, y) {
	this.x = x; this.y = y;
	return this;
};

Vector2.negative = function(v) {
	return new Vector2(-v.x, -v.y);
};
Vector2.add = function(a, b) {
	if (b instanceof Vector2) return new Vector2(a.x + b.x, a.y + b.y);
	else return new Vector2(a.x + b, a.y + b);
};
Vector2.subtract = function(a, b) {
	if (b instanceof Vector2) return new Vector2(a.x - b.x, a.y - b.y);
	else return new Vector2(a.x - b, a.y - b);
};
Vector2.multiply = function(a, b) {
	if (b instanceof Vector2) return new Vector2(a.x * b.x, a.y * b.y);
	else return new Vector2(a.x * b, a.y * b);
};
Vector2.divide = function(a, b) {
	if (b instanceof Vector2) return new Vector2(a.x / b.x, a.y / b.y);
	else return new Vector2(a.x / b, a.y / b);
};
Vector2.equals = function(a, b) {
	return a.x == b.x && a.y == b.y;
};
Vector2.dot = function(a, b) {
	return a.x * b.x + a.y * b.y;
};
Vector2.cross = function(a, b) {
	return a.x * b.y - a.y * b.x;
};
Vector2.lerp = function(a, b, t) {
	return new Vector2( Mathf.lerp(a.x, b.x, t), Mathf.lerp(a.y, b.y, t) );
};