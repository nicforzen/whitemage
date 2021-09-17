
export function Button(text, x, y, width, height, color, font, textColor, textSize, onClick){
    let go = new GameObject("_b");
    go.transform.position.x = x;
    go.transform.position.y = y;
    go.renderer = new RectangleRenderer(width, height, color);
    if(onClick){
        go.addCollider(new BoxCollider(0.5, 0.5, width, height, false));
        let script = new Script();
        script.onMouseDown = function(e) {
            return go.collidesAt(e.x, e.y);
        };
        script.onMouseUp = function(e) {
            if(go.collidesAt(e.x, e.y)){
                if(onClick){ 
                    onClick(go);
                    return true;
                }
            }
            return false;
        };
        go.addScript(script);
    }

    if(text){
        let unamePlate = new GameObject("_t");
        unamePlate.renderer = new TextRenderer(font, textSize, textColor, text, 1, "center", "middle");
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