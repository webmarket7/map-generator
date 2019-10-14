import { Coord } from './coord';

export interface Coords {
    topLeft: Coord;
    topRight: Coord;
    bottomRight: Coord;
    bottomLeft: Coord;
}

export type CellType = 0 | 1 | 2 | 3;

export class Cell {
    /*
     0 - full cell
     1 - empty cell
     2 - border cell
    */
    private _type: CellType;

    private _colorMap = {
        '0': '#000',
        '1': '#fff',
        '2': '#000',
        '3': '#000'
    };

    x: number;
    y: number;
    cellSize: number;

    constructor(
        x: number,
        y: number,
        cellSize: number,
        type: CellType
    ) {
        this.x = x;
        this.y = y;
        this.cellSize = cellSize;
        this.type = type;
    }

    get top() {
        return this.y * this.cellSize;
    }

    get bottom() {
        return this.top + this.cellSize;
    }

    get left() {
        return this.x * this.cellSize;
    }

    get right() {
        return this.left + this.cellSize;
    }

    get topLeft(): Coord {
        return new Coord(this.left, this.top);
    }

    get topRight(): Coord {
        return new Coord(this.right, this.top);
    }

    get bottomRight(): Coord {
        return new Coord(this.right, this.bottom);
    }

    get bottomLeft(): Coord {
        return new Coord(this.left, this.bottom);
    }

    get coords(): Coord[] {
        return [this.topLeft, this.topRight, this.bottomRight, this.bottomLeft];
    }

    get center() {
        return new Coord((this.topLeft.x + this.bottomRight.x) / 2, (this.topLeft.y + this.bottomRight.y) / 2);
    }

    get stringCoords(): string[] {
        return this.coords.map((coord: Coord) => coord.stringify());
    }

    get width(): number {
        return this.cellSize;
    }

    get height(): number {
        return this.cellSize;
    }

    get fill(): string {
        return this._colorMap[this.type];
    }

    get type(): CellType {
        return this._type;
    }

    set type(type: CellType) {
        this._type = type;
    }
}
