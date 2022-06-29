// Import variables needed to expose to the window
import Core from '@wiris/mathtype-html-integration-devkit/src/core.src';
import Parser from '@wiris/mathtype-html-integration-devkit/src/parser';
import Util from '@wiris/mathtype-html-integration-devkit/src/util';
import Image from '@wiris/mathtype-html-integration-devkit/src/image';
import Configuration from '@wiris/mathtype-html-integration-devkit/src/configuration';
import Listeners from '@wiris/mathtype-html-integration-devkit/src/listeners';
import IntegrationModel from '@wiris/mathtype-html-integration-devkit/src/integrationmodel';
import Latex from '@wiris/mathtype-html-integration-devkit/src/latex';
import Test from '@wiris/mathtype-html-integration-devkit/src/test';
import { FroalaIntegration, instances, currentInstance } from './wiris.src';

// Import files needed for the plugin in order to work propertly
import '@wiris/mathtype-html-integration-devkit/src/backwardslib';
import '@wiris/mathtype-html-integration-devkit/src/polyfills';
import './icons/css/wirisplugin.css';

// Expose WirisPlugin variable to the window.
window.WirisPlugin = {
  Core,
  Parser,
  Image,
  Util,
  Configuration,
  Listeners,
  IntegrationModel,
  currentInstance,
  instances,
  FroalaIntegration,
  Latex,
  Test,
};
