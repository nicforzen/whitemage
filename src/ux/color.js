
export const Color = {
    fromHexString(hexColor) { return _fromHexString(hexColor); },
    WHITE: _fromHexString("#FFFFFF"),
    BLACK: _fromHexString("#000000"),
    RED: _fromHexString("#FF0000"),
    GREEN: _fromHexString("#00FF00"),
    BLUE: _fromHexString("#0000FF"),
    GREY: _fromHexString("#808080"),
    GRAY: _fromHexString("#808080"),
    DARKGREY: _fromHexString("#333333"),
    LIGHTGREY: _fromHexString("#666666"),
    DARKGRAY: _fromHexString("#333333"),
    LIGHTGRAY: _fromHexString("#666666"),
    MAGENTA: _fromHexString("#FF00FF"),
    ORANGE: _fromHexString("#FFA500"),
    TRANSPARENT: _fromHexString("#FF000000")
};

function _fromHexString(hexColor) {
    return {
        hexString: hexColor
    };
}