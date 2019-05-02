// @flow
import {Utils} from '@pakhshkit-js/pakhshkit-js';

/**
 * Sets the default analytics plugin for the ott player.
 * @param {VPOptionsObject} options - The player config.
 * @private
 * @returns {void}
 */
export function setDefaultAnalyticsPlugin(options: VPOptionsObject): void {
  const kavaPlugin = Utils.Object.getPropertyPath(options, 'plugins.kava');
  if (!kavaPlugin) {
    Utils.Object.mergeDeep(options, {
      plugins: {
        kava: {
          disable: true
        }
      }
    });
  }
  const ottAnalyticsPlugin = Utils.Object.getPropertyPath(options, 'plugins.ottAnalytics');
  if (!ottAnalyticsPlugin) {
    Utils.Object.mergeDeep(options, {
      plugins: {
        ottAnalytics: {}
      }
    });
  }
}
