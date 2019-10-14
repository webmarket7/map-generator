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

    getCell(x, y): T {
        return this.data[x][y];
    }

    getNeighbourCells(xVal: number, yVal: number): Array<T> {
        const neighbours = [];

        for (let x = -1; x < 2; x++) {
            for (let y = -1; y < 2; y++) {
                const xCoord = xVal + x;
                const yCoord = yVal + y;

                if (this.checkIsCoordLegal(xCoord, yCoord)) {
                    neighbours.push(this.getCell(xCoord, yCoord));
                }
            }
        }

        return neighbours;
    }

    getRandomCell(): T {
        const randomX = random(0, this.columns - 1);
        const randomY = random(0, this.rows - 1);

        return this.getCell(randomX, randomY);
    }

    forEachCell(callback: Function): void {
        for (let x = 0; x < this.columns; x++) {
            for (let y = 0; y < this.rows; y++) {
                callback(this.data[x][y], x, y);
            }
        }
    }

    populateCell(x: number, y: number, value: T): void {
        this._data[x][y] = value;
    }

    populate(callback: Function): void {
        this.forEachCell((cell, x, y) => {
            this.populateCell(x, y, callback(cell, x, y));
        });
    }
}
