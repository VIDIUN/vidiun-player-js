// @flow
import {VidiunPlayer} from './vidiun-player';
import {getPlayerProxy} from './proxy';
import {evaluatePluginsConfig} from './common/plugins/plugins-config';
import {
  applyCastSupport,
  applyStorageSupport,
  attachToFirstClick,
  getDefaultOptions,
  printSetupMessages,
  setLogLevel,
  setStorageConfig,
  setStorageTextStyle,
  supportLegacyOptions,
  validateConfig
} from './common/utils/setup-helpers';

/**
 * Setup the Vidiun Player.
 * @param {PartialVPOptionsObject|LegacyPartialVPOptionsObject} options - partial vidiun player options
 * @private
 * @returns {VidiunPlayer} - The Vidiun Player.
 */
function setup(options: PartialVPOptionsObject | LegacyPartialVPOptionsObject): VidiunPlayer {
  options = supportLegacyOptions(options);
  validateConfig(options);
  const defaultOptions = getDefaultOptions(options);
  setLogLevel(defaultOptions);
  printSetupMessages();
  evaluatePluginsConfig(defaultOptions.plugins, defaultOptions);
  setStorageConfig(defaultOptions);
  const player = getPlayerProxy(defaultOptions);
  setStorageTextStyle(player);
  applyStorageSupport(player);
  applyCastSupport(defaultOptions, player);
  attachToFirstClick(player);
  return player;
}

export {setup};
