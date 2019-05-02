// @flow
import PolyfillManager from './common/polyfills/polyfill-manager';
import './common/polyfills/all';
import getLogger, {getLogLevel, LogLevel, setLogLevel} from './common/utils/logger';
// Import core
import * as core from '@pakhshkit-js/pakhshkit-js';
// Import ui
import * as ui from '@pakhshkit-js/pakhshkit-js-ui';
// Import provider
import * as providers from 'pakhshkit-js-providers';
// Import media source adapters
import '@pakhshkit-js/pakhshkit-js-hls';
import '@pakhshkit-js/pakhshkit-js-dash';
// Import analytics plugin
import 'pakhshkit-js-analytics';
import '@pakhshkit-js/pakhshkit-js-kava';
// Import shaka-player
import * as shaka from 'shaka-player';
// Import setup method
import {setup} from './setup';
import {getPlayers, getPlayer} from './proxy';
// Import cast framework
import {cast} from './common/cast';
// Import playlist
import {playlist} from './common/playlist';

declare var __VERSION__: string;
declare var __NAME__: string;
declare var __PACKAGE_URL__: string;
declare var __PLAYER_TYPE__: string;

const currentLogLevel = getLogLevel();
setLogLevel(LogLevel.INFO);
getLogger().log(`%c ${__NAME__} ${__VERSION__}`, 'color: #ff98f9;  font-size: large');
getLogger().log(`%c For more details see ${__PACKAGE_URL__}`, 'color: #ff98f9;');
setLogLevel(currentLogLevel);

PolyfillManager.installAll();

export {
  getPlayers,
  getPlayer,
  core,
  ui,
  providers,
  setup,
  shaka,
  cast,
  playlist,
  __PLAYER_TYPE__ as PLAYER_TYPE,
  __VERSION__ as VERSION,
  __NAME__ as PLAYER_NAME
};
