import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';

// Expose tinymce instance to the window
declare const require: any;
(window as any).tinymce = require('tinymce');

// import sincronous mathtype-tinymce5 package
require('@wiris/mathtype-tinymce5')

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    EditorModule
  ],
  providers: [ { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' } ],
  bootstrap: [AppComponent]
})
export class AppModule { }
