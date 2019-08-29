import Core from './integration-js/src/core.src.js';
import Parser from './integration-js/src/parser.js';
import Util from './integration-js/src/util.js';
import Image from './integration-js/src/image.js';
import Configuration from './integration-js/src/configuration.js';
import Listeners from './integration-js/src/listeners';
import IntegrationModel from './integration-js/src/integrationmodel.js';
import { TinyMceIntegration, currentInstance, instances } from './editor_plugin.src.js';
import Latex from './integration-js/src/latex';
import backwardsLib from './integration-js/src/backwardslib';
import Test from './integration-js/src/test';

// Expose WirisPlugin variable to the window.
window.WirisPlugin = {
    Core: Core,
    Parser: Parser,
    Image: Image,
    Util: Util,
    Configuration: Configuration,
    Listeners: Listeners,
    IntegrationModel: IntegrationModel,
    currentInstance: currentInstance,
    instances: instances,
    TinyMceIntegration: TinyMceIntegration,
    Latex: Latex,
    Test : Test
}