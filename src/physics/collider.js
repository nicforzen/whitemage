
// import { Vector2 } from './vector.js';
// import { Point } from './point.js';
// import { Util } from '../util/util.js';

// export function BoxCollider(offsetx, offsety, w, h, solid){
//     return {
//         x: 0,
//         y: 0,
//         offsetx: offsetx,
//         offsety: offsety,
//         width: w,
//         height: h,
//         solid: solid,
//         gameObject: null,
//         type: "b",
//         getWidth() {
//             return this.w;
//         },
//         getHeight() {
//             return this.h;
//         }
//     };
// }

// export function CircleCollider(offsetx, offsety, r, solid){
//     return {
//         x: 0,
//         y: 0,
//         offsetx: offsetx,
//         offsety: offsety,
//         r: r,
//         solid: solid,
//         gameObject: null,
//         type: "c",
//         getWidth() {
//             return this.r * 2;
//         },
//         getHeight() {
//             return this.r * 2;
//         }
//     };
// }

// export function ArcCollider(offsetx, offsety, r, radianStart, radianEnd, solid){
//     return {
//         x: 0,
//         y: 0,
//         offsetx: offsetx,
//         offsety: offsety,
//         r: r,
//         radianStart: radianStart,
//         radianEnd: (radianEnd > radianStart) ? radianEnd : radianEnd + Math.PI*2,
//         solid: solid,
//         gameObject: null,
//         type: "a",
//         getWidth() {
//             return this.r * 2;
//         },
//         getHeight() {
//             return this.r * 2;
//         }
//     };
// }

// export function PolygonCollider(offsetx, offsety, solid, points){
//     var p = (points) ? points : [];
//     return {
//         x: 0,
//         y: 0,
//         points: p,
//         offsetx: offsetx,
//         offsety: offsety,
//         solid: solid,
//         gameObject: null,
//         type: "p",
//         getWidth() {
//             return 0;
//         },
//         getHeight() {
//             return 0;
//         },
//         addPoint(point){
//             this.points.push(point);
//         }
//     };
// }

// export var CollisionUtil = {
//     resolveCircleCircleCollision: function(collider1, collider2, timeDilation){
//         var gameObj = collider1.gameObject;
//         var otherObj = collider2.gameObject;
//         var radius = collider1.r;
//         var otherRadius = collider2.r;
//         if(gameObj.stationary) {
//             gameObj = collider2.gameObject;
//             otherObj = collider1.gameObject;
//             otherRadius = collider1.r;
//             radius = collider2.r;
//         }
    
//         let vx = gameObj.transform.position.x - otherObj.transform.position.x;
//         let vy = gameObj.transform.position.y - otherObj.transform.position.y;
//         let mag = Math.sqrt(vx*vx + vy*vy);
//         let collision = new Vector2(otherObj.transform.position.x + vx / mag * otherRadius,
//             otherObj.y + vy / mag * otherRadius);
    
//         let px = gameObj.transform.position.x + gameObj.rigidbody.velocity.x * timeDilation;
//         let py = gameObj.transform.position.y + gameObj.rigidbody.velocity.y * timeDilation;
//         console.log("px: " + px);
//         if(Math.abs(px - collision.x) < radius) {
//             let distance =  Math.abs(collision.x - gameObj.transform.position.x) - radius;
//             console.log(gameObj.transform.position.x + " " + distance);
//             gameObj.rigidbody.velocity.x = distance / timeDilation;
//         }
    
//         if(Math.abs(py - collision.y) < radius) {
//             let distance =  Math.abs(collision.y - gameObj.y) - radius;
//             gameObj.rigidbody.velocity.y = distance / timeDilation;
//         }
    
//         return collision;
//     }, 
//     polygonPointCollision: function(polyx, polyy, points, px, py) {
//         var collision = false;
    
//         var next = 0;
//         for (var current = 0; current < points.length; current++){
//             next = current + 1;
//             if(next == points.length) next = 0;
    
//             let vc = points[current];
//             let vn = points[next];
    
//             let vcx = polyx + vc.x;
//             let vcy = polyy + vc.y;
//             let vnx = polyx + vn.x;
//             let vny = polyy + vn.y;
    
//             if (((vcy > py && vny < py) || (vcy < py && vny > py)) &&
//              (px < (vnx-vcx)*(py-vcy) / (vny-vcy)+vcx)) {
//                 collision = !collision;
//             }
//         }
//         return collision;
//     },
//     pointCircleCollision: function(px, py, cx, cy, r){
//         let distX = px - cx;
//         let distY = py - cy;
//         let distance = Math.sqrt( (distX*distX) + (distY*distY) );
    
//         if (distance <= r) {
//             return true;
//         }
//         return false;
//     },
//     linePointCollision: function(x1, y1, x2, y2, px, py){
//         let d1 = Util.distance(px,py, x1,y1);
//         let d2 = Util.distance(px,py, x2,y2);
    
//         let lineLen = Util.distance(x1,y1, x2,y2);
//         let buffer = 0.1;
    
//         if (d1+d2 >= lineLen-buffer && d1+d2 <= lineLen+buffer) {
//             return true;
//         }
//         return false;
//     },
//     lineCircleCollision: function(x1, y1, x2, y2, cx, cy, r){
//         let inside1 = pointCircleCollision(x1, y1, cx, cy, r);
//         let inside2 = pointCircleCollision(x2, y2, cx, cy, r);
//         if(inside1 || inside2) return true;
    
//         var distx = x1 - x2;
//         var disty = y1 - y2;
//         let len = Math.sqrt( (distx*distx) + (disty * disty));
    
//         let dot = ( ((cx-x1)*(x2-x1)) + ((cy-y1)*(y2-y1)) ) / Math.pow(len,2);
    
//         let closestX = x1 + (dot * (x2-x1));
//         let closestY = y1 + (dot * (y2-y1));
    
//         let onSegment = linePointCollision(x1,y1,x2,y2, closestX,closestY);
//         if (!onSegment) return false;
    
//         distX = closestX - cx;
//         distY = closestY - cy;
//         let distance = Math.sqrt( (distX*distX) + (distY*distY) );
    
//         if (distance <= r) {
//             return true;
//         }
//         return false;
//     },
//     isPolygonCircleCollision: function(c1, c2, timeDilation){
//         let points = c1.points;
//         let px = c1.x + c1.gameObject.rigidbody.velocity.x * timeDilation;
//         let py = c1.y + c1.gameObject.rigidbody.velocity.y * timeDilation;
//         let cx = c2.x + c2.gameObject.rigidbody.velocity.x * timeDilation;
//         let cy = c2.y + c2.gameObject.rigidbody.velocity.y * timeDilation;
//         let cr = c2.r;
    
//         var next = 0;
//         for(var current = 0; current<points.length; current++){
//             next = current+1;
//             if(next == points.length) next = 0;
    
//             let vc = points[current];
//             let vn = points[next];
    
//             let vcx = px + vc.x;
//             let vcy = py + vc.y;
//             let vnx = px + vn.x;
//             let vny = py + vn.y;
    
//             let collision = lineCircleCollision(vcx, vcy, vnx, vny, cx, cy, cr);
//             if(collision) return true;
    
//             let centerInside = polygonPointCollision(px, py, points, cx, cy);
//             if(centerInside) return true;
//         }
//         return false;
//     },
//     pointOnCircleFromAngle: function(cx, cy, cr, angle){
//         return new Point(cx + cr * Math.sin(angle), cy + cr * Math.cos(angle));
//     },
//     isArcCircleCollision: function(c1, c2, timeDilation){
//         let c1x = c1.x + c1.gameObject.rigidbody.velocity.x * timeDilation;
//         let c1y = c1.y + c1.gameObject.rigidbody.velocity.y * timeDilation;
//         let c2x = c2.x + c2.gameObject.rigidbody.velocity.x * timeDilation;
//         let c2y = c2.y + c2.gameObject.rigidbody.velocity.y * timeDilation;
//         let radianStart = c1.radianStart;
//         let radianEnd = c1.radianEnd;
//         let distance = (c2x-c1x)*(c2x-c1x) + (c2y-c1y)*(c2y-c1y);
//         if (distance <= (c1.r+c2.r)*(c1.r+c2.r)){
//             // Circles have collided, check arc values
//             // Short circuit if arc origin inside other circle
//             if(distance <= c2.r*c2.r){
//                 return true;
//             }
    
//             // Check line intersections
//             let p1 = pointOnCircleFromAngle(c1x, c1y, c1.r, radianStart);
//             let p2 = pointOnCircleFromAngle(c1x, c1y, c1.r, radianEnd);
//             let lineCollision1 = lineCircleCollision(c1x, c1y, p1.x, p1.y, c2x, c2y, c2.r);
//             let lineCollision2 = lineCircleCollision(c1x, c1y, p2.x, p2.y, c2x, c2y, c2.r);
//             if(lineCollision1 || lineCollision2) return true;
    
//             // Check arc angle range
//             var angle = Math.atan2(c1y - c2y, c1x - c2x);
//             if(angle < 0) angle += Math.PI * 2;
//             angle = (angle + Math.PI) % (Math.PI * 2);
//             return (angle >= radianStart && angle <= radianEnd);
//         }else return false;
//     },
//     isCircleCircleCollision: function(c1, c2, timeDilation){
//         let c1x = c1.x + c1.gameObject.rigidbody.velocity.x * timeDilation;
//         let c1y = c1.y + c1.gameObject.rigidbody.velocity.y * timeDilation;
//         let c2x = c2.x + c2.gameObject.rigidbody.velocity.x * timeDilation;
//         let c2y = c2.y + c2.gameObject.rigidbody.velocity.y * timeDilation;
//         return (c2x-c1x)*(c2x-c1x) + (c2y-c1y)*(c2y-c1y) <= (c1.r+c2.r)*(c1.r+c2.r);
//     },
//     // TODO Change to WILL collide, or do this somewhere else
//     isCircleBoxCollision: function(circle,rect,timeDilation){
//         let cx = circle.x + circle.gameObject.rigidbody.velocity.x * timeDilation;
//         let cy = circle.y + circle.gameObject.rigidbody.velocity.y * timeDilation;
//         let rx = rect.x + rect.gameObject.rigidbody.velocity.x * timeDilation;
//         let ry = rect.y + rect.gameObject.rigidbody.velocity.y * timeDilation;
//         var distX = Math.abs(cx - rx-rect.w/2);
//         var distY = Math.abs(cy - ry-rect.h/2);

//         if (distX > (rect.w/2 + circle.r)) { return false; }
//         if (distY > (rect.h/2 + circle.r)) { return false; }

//         if (distX <= (rect.w/2)) { return true; } 
//         if (distY <= (rect.h/2)) { return true; }

//         var dx=distX-rect.w/2;
//         var dy=distY-rect.h/2;
//         return (dx*dx+dy*dy<=(circle.r*circle.r));
//     },
//     resolveBoxCircleCollision: function(rectCollider, circleCollider, timeDilation){
//         var gameObj = rectCollider.gameObject;
//         if(gameObj.stationary) gameObj = circleCollider.gameObject;

//         var NearestX = Math.max(rectCollider.x, Math.min(circleCollider.x, rectCollider.x + rectCollider.w));
//         var NearestY = Math.max(rectCollider.y, Math.min(circleCollider.y, rectCollider.y + rectCollider.h));

//         var dist = new Vector2(circleCollider.x - NearestX, circleCollider.y - NearestY);
//         var penetrationDepth = circleCollider.r - dist.length();
//         var penetrationVector = dist.normalize().multiply(penetrationDepth);

//         if(Math.abs(penetrationVector.x) > 0){
//             gameObj.rigidbody.velocity.x = (penetrationVector.x + 
//                 (penetrationVector.x < 0) ? 0.00001 : -0.00001) / timeDilation;
//         }
//         if(Math.abs(penetrationVector.y) > 0){
//             gameObj.rigidbody.rigidbody.velocity.y = (penetrationVector.y +
//                 (penetrationVector.y < 0) ? 0.00001 : -0.00001) / timeDilation;
//         }
//     },
//     resolveBoxBoxCollision: function(gameObj, b, otherObj, c, timeDilation){
//         let distances = boxCollisionDistances(gameObj.colliders[b], otherObj.colliders[c]);
    
//         let xvel = gameObj.rigidbody.rigidbody.velocity.x;
//         let yvel = gameObj.rigidbody.velocity.y;
//         // TODO test this with the == 0 changes
//         let xsign = xvel==0?0:xvel<0?-1:1;
//         let ysign = yvel==0?0:yvel<0?-1:1;
//         let xtimecollide = xvel != 0 ? Math.abs(distances.x / xvel) : 0;
//         let ytimecollide = yvel != 0 ? Math.abs(distances.y / yvel) : 0;
    
//         var shortesttime = 0;
//         if(xvel != 0 && yvel == 0){
//             gameObj.rigidbody.rigidbody.velocity.x = Math.abs(distances.x / timeDilation) * xsign;
//         } else if (xvel == 0 && yvel != 0){
//             gameObj.rigidbody.rigidbody.velocity.y = Math.abs(distances.y / timeDilation) * ysign;
//         } else if(xtimecollide == 0){
//             gameObj.rigidbody.rigidbody.velocity.x = Math.abs(distances.x / timeDilation) * xsign;
//         } else if(ytimecollide == 0){
//             gameObj.rigidbody.rigidbody.velocity.y = Math.abs(distances.y / timeDilation) * ysign;
//         }else {
//             shortesttime = Math.min(xtimecollide, ytimecollide);
    
//             if(xtimecollide < ytimecollide){
//                 gameObj.rigidbody.rigidbody.velocity.x = Math.abs(distances.x / timeDilation) * xsign;
//                 gameObj.rigidbody.rigidbody.velocity.y = 0;
//             }else {
//                 gameObj.rigidbody.rigidbody.velocity.x = 0;
//                 gameObj.rigidbody.rigidbody.velocity.y = Math.abs(distances.y / timeDilation) * ysign;
//             }
//         }
//     },
//     boxCollisionDistances: function(c1, c2)
//     {
//         var dx = 0;
//         var dy = 0;

//         if (c1.x < c2.x)
//         {
//             dx = c2.x - (c1.x + c1.w);
//         }
//         else if (c1.x > c2.x)
//         {
//             dx = c1.x - (c2.x + c2.w);
//         }

//         if (c1.y < c2.y)
//         {
//             dy = c2.y - (c1.y + c1.h);
//         }
//         else if (c1.y > c2.y)
//         {
//             dy = c1.y - (c2.y + c2.h);
//         }

//         return {x: dx, y: dy};
//     },
//     isBoxCollision: function(c1, c2, timeDilation)
//     {
//         let x1 = c1.x + c1.gameObject.rigidbody.rigidbody.velocity.x * timeDilation;
//         let x2 = c2.x + c2.gameObject.rigidbody.rigidbody.velocity.x * timeDilation;
//         let y1 = c1.y + c1.gameObject.rigidbody.rigidbody.velocity.y * timeDilation;
//         let y2 = c2.y + c2.gameObject.rigidbody.rigidbody.velocity.y * timeDilation;
//         return x1 < x2 + c2.w &&
//             x1 + c1.w > x2 &&
//             y1 < y2 + c2.h &&
//             y1 + c1.h > y2;
//     },
//     isCollision: function(c1, c2, timeDilation){
//         if(c1.type == "b" && c2.type == "b") {
//             return isBoxCollision(c1, c2, timeDilation);
//         }else if(c1.type == "c" && c2.type == "b"){
//             return isCircleBoxCollision(c1, c2, timeDilation);
//         }else if(c2.type == "c" && c1.type == "b"){
//             return isCircleBoxCollision(c2, c1, timeDilation);
//         }else if(c1.type == "c" && c2.type == "c"){
//             return isCircleCircleCollision(c1, c2, timeDilation);
//         } else if(c1.type == "a" && c2.type == "c"){
//             return isArcCircleCollision(c1, c2, timeDilation);
//         } else if(c1.type == "c" && c2.type == "a"){
//             return isArcCircleCollision(c2, c1, timeDilation);
//         } else if(c1.type == "p" && c2.type == "c"){
//             return isPolygonCircleCollision(c1, c2, timeDilation);
//         } else if(c1.type == "c" && c2.type == "p"){
//             return isPolygonCircleCollision(c2, c1, timeDilation);
//         } 
//         else return false;
//     },
//     boxColliderPointCollision: function(x, y, boxCollider){
//         return x >= boxCollider.x
//         && y >= boxCollider.y
//         && x <= boxCollider.x + boxCollider.w
//         && y <= boxCollider.y + boxCollider.h;
//     }
// };