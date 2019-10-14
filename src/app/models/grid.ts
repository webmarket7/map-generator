import { Canvas } from 'fabric/fabric-impl';
import { fabric } from 'fabric';

export class Grid {
    private _lineOptions = {
        stroke: 'black',
        strokeWidth: 1,
        selectable: false
    };

    canvas: Canvas;
    columns: number;
    rows: number;
    cellSize = 30;

    constructor(
        canvas: Canvas,
        columns: number,
        rows: number,
        cellSize: number
    ) {
        this.canvas = canvas;
        this.columns = columns;
        this.rows = rows;
        this.cellSize = cellSize;
    }

    draw() {
        for (let x = 1; x < this.columns; x++) {
            const offset = this.cellSize * x;
            this.canvas.add(new fabric.Line([offset, 0, offset, this.canvas.getHeight()], this._lineOptions));
        }

        for (let y = 1; y < this.rows; y++) {
            const offset = this.cellSize * y;
            this.canvas.add(new fabric.Line([0, offset, this.canvas.getWidth(), offset], this._lineOptions));
        }
    }
}
