
import { GameObject } from "../control/gameobject.js";
import { RectangleRenderer } from "../ux/renderer.js";
import { BoxCollider } from "../physics/boxcollider";
import { TextRenderer } from "../ux/renderer.js";
import { Script } from "../control/script.js";
import { Rigidbody } from "../physics/rigidbody.js";

export function Button(text, x, y, width, height, color, font, textColor, textSize, onClick){
    let go = new GameObject("_b");
    go.transform.position.x = x;
    go.transform.position.y = y;
    go.renderer = new RectangleRenderer(width, height, color);
    if(onClick){
        let rb = new Rigidbody();
        rb.gravityScale = 0;
        go.addComponent(rb);
        go.addComponent(new BoxCollider(width, height));
        let script = new Script();
        script.onMouseUp = function() {
            if(onClick){ 
                onClick.call(this);
            }
        };
        go.addComponent(script);
    }

    if(text){
        let unamePlate = new GameObject("_t");
        unamePlate.renderer = new TextRenderer(font, textSize, textColor, text.toString(), 1, "center", "middle");
        go.addSubobject(unamePlate);
    }

    return go;
}

export function Label(text, x, y, font, textColor, textSize, alignment, baseline){
    let go = new GameObject("_l");
    go.transform.position.x = x;
    go.transform.position.y = y;
    go.renderer = new TextRenderer(font, textSize, textColor, text.toString(), 1, alignment, baseline);
    return go;
}