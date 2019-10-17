import { random } from 'lodash';

export class Matrix<T> {
    private _data: Array<Array<T>>;

    get data(): Array<Array<T>> {
        return this._data;
    }

    get rows(): number {
        return this._data.length;
    }

    get columns(): number {
        return this.rows ? this._data[0].length : 0;
    }

    constructor(rows: number, columns: number) {
        this._data = (new Array(rows)).fill(null).map(() => new Array(columns).fill(null));
    }

    checkIsCoordLegal(x: number, y: number): boolean {
        return (x >= 0 && x < this.columns && y >= 0 && y < this.rows);
    }

    getCell(y: number, x: number): T {
        return this.data[y][x];
    }

    getNeighbourCells(xVal: number, yVal: number): Array<T> {
        const neighbours = [];

        for (let x = -1; x < 2; x++) {
            for (let y = -1; y < 2; y++) {
                const yCoord = yVal + y;
                const xCoord = xVal + x;

                if (this.checkIsCoordLegal(xCoord, yCoord)) {
                    neighbours.push(this.getCell(yCoord, xCoord));
                }
            }
        }

        return neighbours;
    }

    getRandomCell(): T {
        const randomX = random(0, this.columns - 1);
        const randomY = random(0, this.rows - 1);

        return this.getCell(randomY, randomX);
    }

    forEachCell(callback: Function): void {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.columns; x++) {
                callback(this.data[y][x], y, x);
            }
        }
    }

    populateCell(y: number, x: number, value: T): void {
        this._data[y][x] = value;
    }

    populate(callback: Function): void {
        this.forEachCell((cell, y, x) => {
            this.populateCell(y, x, callback(cell, y, x));
        });
    }
}
