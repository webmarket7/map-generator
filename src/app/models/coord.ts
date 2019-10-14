export class Coord {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static parseString(stringifiedCoords: string): {x: number, y: number} {
        const coords = stringifiedCoords.split(',');

        return {x: +coords[0], y: +coords[1]};
    }

    stringify() {
        return `${this.x},${this.y}`;
    }

}
