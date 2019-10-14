import { intersection, random, concat } from 'lodash';
import { Canvas } from 'fabric/fabric-impl';
import { fabric } from 'fabric';
import { Cell } from './cell';
import { Matrix } from './matrix';
import { Coord } from './coord';

export class Cave {
    canvas: Canvas;
    columns: number;
    rows: number;
    density: number;
    iterations: number;

    cellSize: number;
    neighbours = 4;

    constructor(
        canvas: Canvas,
        columns: number,
        rows: number,
        cellSize: number,
        density: number,
        iterations: number,
    ) {
        this.canvas = canvas;
        this.columns = columns;
        this.rows = rows;
        this.cellSize = cellSize;
        this.density = density;
        this.iterations = iterations;
    }

    static getNeighboursByType(matrix: Matrix<Cell>, cell: Cell, type): Array<Cell> {
        return matrix
            .getNeighbourCells(cell.x, cell.y)
            .filter((neighbourCell) => neighbourCell.type === type);
    }

    generateMatrix(): Matrix<Cell> {
        const matrix: Matrix<Cell> = new Matrix(this.rows, this.columns);

        matrix.populate((cell, x, y) => {
            const randomNumber = random(0, 100);
            const empty = randomNumber < this.density;

            return new Cell(x, y, this.cellSize, empty ? 1 : 0);
        });

        for (let i = 0; i < this.iterations; i++) {
            const randomCell = matrix.getRandomCell();
            const emptyNeighbours = Cave.getNeighboursByType(matrix, randomCell, 1);
            randomCell.type = emptyNeighbours.length > this.neighbours ? 1 : 0;
        }

        return matrix;
    }

    markWalls(matrix: Matrix<Cell>): void {
        matrix.forEachCell((cell: Cell) => {
            const emptyNeighbours = Cave.getNeighboursByType(matrix, cell, 1);

            if (cell.type === 0 && emptyNeighbours.length >= 2) {
                cell.type = 2;
            }
        });
    }

    getSemiWalls(matrix: Matrix<Cell>) {
        const semiWalls = [];

        matrix.forEachCell((cell: Cell) => {
            const wallNeighbours = Cave.getNeighboursByType(matrix, cell, 2);

            if (cell.type === 1 && wallNeighbours.length >= 2) {
                const wallsWithCommonSide = [];

                wallNeighbours.forEach((wallNeighbour: Cell) => {
                    const commonPoints = intersection(cell.stringCoords, wallNeighbour.stringCoords);

                    if (commonPoints.length === 2) {
                        wallsWithCommonSide.push({wall: wallNeighbour, commonPoints});
                    }
                });

                if (wallsWithCommonSide.length === 2) {
                    semiWalls.push({cell, wallsWithCommonSide});
                }
            }
        });

        return semiWalls.map(({cell, wallsWithCommonSide }) => {
            const commonPoints = wallsWithCommonSide.map(_ => _.commonPoints);
            const rightAngleVertex = intersection(...commonPoints)[0];
            const otherVertexes = concat(...commonPoints).filter((coords) => coords !== rightAngleVertex);
            const triangle = [otherVertexes[0], rightAngleVertex, otherVertexes[1]];

            return {cell, triangle};
        });
    }

    moveTo(coords: string): string {
        return `M ${coords}`;
    }

    lineTo(coords: string): string {
        return `L ${coords}`;
    }

    quadraticCurveTo(controlPoint, endPoint): string {
        return `Q ${controlPoint} ${endPoint}`;
    }

    cubicCurveTo(firstControlPoint, secondControlPoint, endPoint): string {
        return `C ${firstControlPoint} ${secondControlPoint} ${endPoint}`;
    }

    getRandomPointInTriangle(pt1: Coord, pt2: Coord, pt3: Coord): Coord {
        const [ s, t ] = [Math.random(), Math.random()].sort((a, b) => a - b);

        return new Coord(
            Math.floor(s * pt1.x + (t - s) * pt2.x + (1 - t) * pt3.x),
            Math.floor(s * pt1.y + (t - s) * pt2.y + (1 - t) * pt3.y)
        );
    }

    getRandomOffset() {
        return random(0, this.cellSize / 3) * [1, -1][Math.round(Math.random())];
    }

    randomizeControlPoints(start: string, end: string): Array<Coord> {
        const offset = this.cellSize / 6;
        const startCoord = Coord.parseString(start);
        const endCoord = Coord.parseString(end);
        const [ xSmaller, xBigger ] = [startCoord.x, endCoord.x].sort((a, b) => a - b);
        const [ ySmaller, yBigger ] = [startCoord.y, endCoord.y].sort((a, b) => a - b);

        const one = new Coord(xSmaller + offset,  ySmaller + offset);
        const two = new Coord(xBigger - offset, yBigger - offset);
        const three = new Coord(xSmaller + offset, yBigger - offset);
        const four = new Coord(xSmaller - offset, yBigger + offset);

        const firstControlPoint = this.getRandomPointInTriangle(one, three, four);
        const secondControlPoint = this.getRandomPointInTriangle(two, three, four);

        return [firstControlPoint, secondControlPoint];
    }

    generateCurvedTrianglePath({cell, triangle: [ start, middle, end ]}: {cell: Cell, triangle: Array<string>}) {
        const center = cell.center;

        if (start && middle && end) {
            const [ firstControlPoint, secondControlPoint ] = this.randomizeControlPoints(start, end);

            return [
                this.moveTo(start),
                this.lineTo(middle),
                this.lineTo(end),
                // this.cubicCurveTo(firstControlPoint.stringify(), secondControlPoint.stringify(), start)
            ].join(' ') + 'z';
        }

        return '';
    }

    draw() {
        const matrix = this.generateMatrix();
        this.markWalls(matrix);
        const semiWalls = this.getSemiWalls(matrix);
        const paths = semiWalls.map((semiWall) => this.generateCurvedTrianglePath(semiWall));

        matrix.forEachCell((cell: Cell) => {
            this.canvas.add(new fabric.Rect({
                width: cell.width,
                height: cell.height,
                top: cell.top,
                left: cell.left,
                fill: cell.fill,
                selectable: false,
                strokeWidth: 0
            }));
        });

        paths.forEach((path) => {
            if (path) {
                this.canvas.add(new fabric.Path(path, {
                    fill: '#000',
                    stroke: '#000',
                    strokeWidth: 0,
                    selectable: false
                }));
            }
        });
    }
}
