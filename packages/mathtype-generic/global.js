import Core from './integration-js/src/core.src.js';
import Parser from './integration-js/src/parser.js';
import Util from './integration-js/src/util.js';
import Image from './integration-js/src/image.js';
import Configuration from './integration-js/src/configuration.js';
import Listeners from './integration-js/src/listeners';
import IntegrationModel from './integration-js/src/integrationmodel.js';
import Latex from './integration-js/src/latex';
import GenericIntegration from './wirisplugin-generic.src.js';
import Test from './integration-js/src/test';
/** Don't delete this - non used - imports. */
import backwardsLib from './integration-js/src/backwardslib.js';
import polyfills from './integration-js/src/polyfills.js';

// Expose WirisPlugin variable to the window.
window.WirisPlugin = {
    Core: Core,
    Parser: Parser,
    Image: Image,
    Util: Util,
    Configuration: Configuration,
    Listeners: Listeners,
    IntegrationModel: IntegrationModel,
    Latex: Latex,
    GenericIntegration: GenericIntegration,
    Test: Test,
}