import { AfterViewInit, Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fabric } from 'fabric';
import { Canvas } from 'fabric/fabric-impl';

import { Cave } from '../../../models/cave';
import { Grid } from '../../../models/grid';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements AfterViewInit {
    form: FormGroup;
    cellSize = 70;
    canvas: Canvas;

    get fieldWidthControl(): AbstractControl {
        return this.form.get('columns');
    }

    get fieldHeightControl(): AbstractControl {
        return this.form.get('rows');
    }

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            columns: [50, [Validators.required]],
            rows: [50, [Validators.required]],
            density: [55, [Validators.required]],
            iterations: [25000, [Validators.required]],
            svg: ['']
        });
    }

    formatNumber = (value) => value;
    formatPercentage = (value) => `${value}%`;
    formatIterations = (value) => value > 1000 ? `${Math.floor(value / 1000)}k` : value;

    ngAfterViewInit(): void {
        this.canvas = new fabric.Canvas('canvas');
        this.canvas.setDimensions({height: 700, width: 700});
    }

    onSubmit(form: FormGroup): void {
        const {columns, rows, density, neighbours, iterations} = form.value;
        const canvasHeight = rows * this.cellSize;
        const canvasWidth = columns * this.cellSize;

        this.canvas.clear();
        this.canvas.setDimensions({width: canvasWidth, height: canvasHeight});

        const cave = new Cave(this.canvas, columns, rows, this.cellSize, density, iterations);
        const grid = new Grid(this.canvas, columns, rows, this.cellSize);

        cave.draw();
        grid.draw();
    }

    onSerializeToSVG(event: MouseEvent): void {
        event.stopPropagation();
        this.form.get('svg').patchValue(this.canvas.toSVG());
    }
}
