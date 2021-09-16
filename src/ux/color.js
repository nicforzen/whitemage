
export const Color = {
    fromHexString(hexColor) { return _fromHexString(hexColor);},
    WHITE: _fromHexString("#FFFFFF"),
    BLACK: _fromHexString("#000000"),
    RED: _fromHexString("#FF0000"),
    GREEN: _fromHexString("#00FF00"),
    BLUE: _fromHexString("#0000FF"),
    DARKGREY: _fromHexString("#333333"),
    LIGHTGREY: _fromHexString("#666666"),
    MAGENTA: _fromHexString("#FF00FF"),
    ORANGE: _fromHexString("#FFA500"),
};

function _fromHexString(hexColor) {
    return {
        hexString: hexColor
    };
}