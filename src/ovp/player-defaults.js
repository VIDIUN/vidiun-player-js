// @flow
import {Utils} from '@pakhshkit-js/pakhshkit-js';

/**
 * Sets the default analytics plugin for the ovp player.
 * @param {VPOptionsObject} options - The player config.
 * @private
 * @returns {void}
 */
export function setDefaultAnalyticsPlugin(options: VPOptionsObject): void {
  let kavaPlugin = Utils.Object.getPropertyPath(options, 'plugins.kava');
  if (!kavaPlugin) {
    kavaPlugin = Utils.Object.mergeDeep(options, {
      plugins: {
        kava: {}
      }
    });
  }
  let vanalyticsPlugin = Utils.Object.getPropertyPath(options, 'plugins.vanalytics');
  if (!vanalyticsPlugin) {
    vanalyticsPlugin = Utils.Object.mergeDeep(options, {
      plugins: {
        vanalytics: {}
      }
    });
  }
  if (options.plugins && !kavaPlugin.disable && !vanalyticsPlugin.disable) {
    Object.assign(options.plugins.vanalytics, {hasVanalony: true});
  }
}
