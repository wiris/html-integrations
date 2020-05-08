import { Component } from '@angular/core';

import * as ClassicEditor from '../ckeditor';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {



  public Editor = ClassicEditor;
  
  public options: Object = {
     toolbar: [ 'heading', '|', 'bold', 'italic', 'MathType', 'ChemType' ],
     htmlAllowedTags:  ['.*'],
     htmlAllowedAttrs: ['.*'],
    }
  
  title = 'ckeditor5';
}
