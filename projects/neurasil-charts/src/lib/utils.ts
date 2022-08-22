export class Utils {
    static hexToRgba(hex, alpha = 1) {
        const [r, g, b] = 
            hex.match(hex.length <= 4 ? /\w/g : /\w\w/g)
                .map(x => parseInt(x.length < 2 ? `${x}${x}` : x, 16));
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    //takes opacity param, convert rgb to rgba OR set opacity for rgba
    static rgbToRgba(rgb, opacity = 1) {
        const [r, g, b] = rgb.match(/\d+/g);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    //checks string to determine if is hex
    static colorIsHex(str) {
        return str.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);
    }
}