
/**
 * A collection of Math utility functions
 */
export var Mathf = {
    /**
     * Linearly interpolate between two values by a percentage.
     * 
     * @param {Starting position} a 
     * @param {Destination} b 
     * @param {Interpolation percentage} t 
     * @returns The interpolated value between a and b at percentage t. t will be clamped in the range [0, 1].
     */
    lerp(a, b, t){
        t = Math.min(1, Math.max(0, t));
        return a + ( b - a ) * t;
    },

    /**
     * Clamp a value between a minimum and maximum value.
     * 
     * @param {The value to clamp} value 
     * @param {The minimum value to clamp to} min 
     * @param {The maximum value to clamp to} max 
     * @returns 
     */
    clamp(value, min, max){
        return Math.min(max, Math.max(min, value));
    }
};