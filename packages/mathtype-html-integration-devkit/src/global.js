import Core from './core.src.js';
import Parser from './parser.js';
import Util from './util.js';
import Image from './image.js';
import Configuration from './configuration.js';
import Listeners from './listeners';
import backwardsLib from './backwardslib.js';
import polyfills from './polyfills.js';
import IntegrationModel from './integrationmodel.js';
import MathML from './mathml.js';

// Expose WirisPlugin variable to the window.
window.WirisPlugin = {
    Core: Core,
    Parser: Parser,
    Image: Image,
    MathML: MathML,
    Util: Util,
    Configuration: Configuration,
    Listeners: Listeners,
    IntegrationModel: IntegrationModel
}