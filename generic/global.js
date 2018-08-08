import Core from './core/src/core.src.js';
import Parser from './core/src/parser.js';
import Util from './core/src/util.js';
import Image from './core/src/image.js';
import Configuration from './core/src/configuration.js';
import Listeners from './core/src/listeners';
import backwardsLib from './core/src/backwardslib.js';
import polyfills from './core/src/polyfills.js';
import IntegrationModel from './core/src/integrationmodel.js';
import WirisPluginGeneric from './wirisplugin-generic.src.js';

module.exports = {
    Core: Core,
    Parser: Parser,
    Image: Image,
    Util: Util,
    Configuration: Configuration,
    Listeners: Listeners,
    IntegrationModel: IntegrationModel
}