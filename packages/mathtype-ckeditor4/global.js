import Core from '@wiris/mathtype-html-integration-devkit/src/core.src';
import Parser from '@wiris/mathtype-html-integration-devkit/src/parser';
import Util from '@wiris/mathtype-html-integration-devkit/src/util';
import Image from '@wiris/mathtype-html-integration-devkit/src/image';
import Configuration from '@wiris/mathtype-html-integration-devkit/src/configuration';
import Listeners from '@wiris/mathtype-html-integration-devkit/src/listeners';
import '@wiris/mathtype-html-integration-devkit/src/backwardslib';
import '@wiris/mathtype-html-integration-devkit/src/polyfills';
import IntegrationModel from '@wiris/mathtype-html-integration-devkit/src/integrationmodel';
import Latex from '@wiris/mathtype-html-integration-devkit/src/latex';
import Test from '@wiris/mathtype-html-integration-devkit/src/test';
import { CKEditor4Integration, instances, currentInstance } from './plugin.src';

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
  CKEditor4Integration,
  Latex,
  Test,
};
