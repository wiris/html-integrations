import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import MathML from './mathml';
import WirisEdition from './wirisedition';

export default class Wiris extends Plugin {
    
    static get requires() {
        return [ MathML, WirisEdition ];
    }

    static get pluginName() {
        return 'Wiris';
    }

}