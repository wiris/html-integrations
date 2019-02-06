import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import MathML from '@wiris/ckeditor5-mathml/src/mathml';
import MathType from './mathtype';

import Core from '../core/src/core.src.js';
import Parser from '../core/src/parser.js';
import Util from '../core/src/util.js';
import Image from '../core/src/image.js';
import Configuration from '../core/src/configuration.js';
import Listeners from '../core/src/listeners';
import IntegrationModel from '../core/src/integrationmodel.js';
import CoreMathML from '../core/src/mathml.js';
import Latex from '../core/src/latex';

// Expose WirisPlugin variable to the window.
window.WirisPlugin = {
    Core: Core,
    Parser: Parser,
    Image: Image,
    MathML: CoreMathML,
    Util: Util,
    Configuration: Configuration,
    Listeners: Listeners,
    IntegrationModel: IntegrationModel,
    Latex: Latex
}

export default class Wiris extends Plugin {
    
    static get requires() {
        return [ MathML, MathType ];
    }

    static get pluginName() {
        return 'Wiris';
    }

}