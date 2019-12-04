import Core from '@wiris/mathtype-html-integration-devkit/src/core.src.js';
import Parser from '@wiris/mathtype-html-integration-devkit/src/parser.js';
import Util from '@wiris/mathtype-html-integration-devkit/src/util.js';
import Image from '@wiris/mathtype-html-integration-devkit/src/image.js';
import Configuration from '@wiris/mathtype-html-integration-devkit/src/configuration.js';
import Listeners from '@wiris/mathtype-html-integration-devkit/src/listeners';
import IntegrationModel from '@wiris/mathtype-html-integration-devkit/src/integrationmodel.js';
import { TinyMceIntegration, currentInstance, instances } from './editor_plugin.src.js';
import Latex from '@wiris/mathtype-html-integration-devkit/src/latex';
import backwardsLib from '@wiris/mathtype-html-integration-devkit/src/backwardslib';
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
    TinyMceIntegration: TinyMceIntegration,
    Latex: Latex,
    Test : Test
}