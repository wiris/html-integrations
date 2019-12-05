import Core from '@wiris/mathtype-html-integration-devkit/src/core.src.js';
import Parser from '@wiris/mathtype-html-integration-devkit/src/parser.js';
import Util from '@wiris/mathtype-html-integration-devkit/src/util.js';
import Image from '@wiris/mathtype-html-integration-devkit/src/image.js';
import Configuration from '@wiris/mathtype-html-integration-devkit/src/configuration.js';
import Listeners from '@wiris/mathtype-html-integration-devkit/src/listeners';
import backwardsLib from '@wiris/mathtype-html-integration-devkit/src/backwardslib.js';
import polyfills from '@wiris/mathtype-html-integration-devkit/src/polyfills.js';
import IntegrationModel from '@wiris/mathtype-html-integration-devkit/src/integrationmodel.js';
import { CKEditor4Integration, instances, currentInstance } from './plugin.src.js';
import Latex from '@wiris/mathtype-html-integration-devkit/src/latex';
import Test from '@wiris/mathtype-html-integration-devkit/src/test';

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
    CKEditor4Integration: CKEditor4Integration,
    Latex: Latex,
    Test: Test
}