import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSliderModule } from '@angular/material';
import { SettingsComponent } from './settings/settings.component';
import { TextFieldModule } from '@angular/cdk/text-field';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSliderModule,
        MatIconModule,
        MatInputModule,
        MatCardModule,
        MatButtonModule,
        TextFieldModule
    ],
    declarations: [
        SettingsComponent
    ],
    exports: [
        SettingsComponent
    ]
})
export class SettingsModule {
}
