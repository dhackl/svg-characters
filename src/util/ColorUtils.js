export default class ColorUtils {

    static shade(color, percent) {
        var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
        return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
    }

    static blend(c0, c1, p) {
        var f=parseInt(c0.slice(1),16),t=parseInt(c1.slice(1),16),R1=f>>16,G1=f>>8&0x00FF,B1=f&0x0000FF,R2=t>>16,G2=t>>8&0x00FF,B2=t&0x0000FF;
        return "#"+(0x1000000+(Math.round((R2-R1)*p)+R1)*0x10000+(Math.round((G2-G1)*p)+G1)*0x100+(Math.round((B2-B1)*p)+B1)).toString(16).slice(1);
    }

    static getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    static getRandomSkinTone() {
        var skinTones = ['#ff9d6d', '#b76e4a', '#eba36f', '#f9bcae'];
        var randomTone = skinTones[Math.floor(Math.random() * skinTones.length)];
        return ColorUtils.blend(randomTone, '#ffffff', Math.random() * 0.5);
    }

    static componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    
    static rgbToHex(r, g, b) {
        return "#" + ColorUtils.componentToHex(r) + ColorUtils.componentToHex(g) + ColorUtils.componentToHex(b);
    }
}