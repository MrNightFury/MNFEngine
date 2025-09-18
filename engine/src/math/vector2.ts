export class vector2 {
    x: number;
    y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    add(v: vector2): vector2 {
        return new vector2(this.x + v.x, this.y + v.y);
    }
}