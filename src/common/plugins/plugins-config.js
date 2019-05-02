//@flow
import {pluginConfig, templateRegex} from './plugins-config-store.js';
import evaluate from '../utils/evaluate';
import {getReferrer} from '../utils/vidiun-params';
import {Utils} from '@pakhshkit-js/pakhshkit-js';

/**
 * returns whether value is evaluated
 * @private
 * @param {*} value - the value to be checked
 * @returns {boolean} - value is evaluated
 */
const isValueEvaluated = (value: any): boolean =>
  (typeof value === 'number' || typeof value === 'function' || typeof value === 'string' || typeof value === 'boolean') &&
  !templateRegex.test(value.toString());

/**
 * remove unevaluated expressions form object
 * @private
 * @param {Object} obj - the object examine
 * @returns {Object} - the object without unevaluated strings
 */
const removeUnevaluatedExpression = (obj = {}): Object =>
  Object.entries(obj).reduce((product, [key, value]): Object => {
    if (typeof value !== 'function' && Utils.Object.isObject(value)) {
      product[key] = removeUnevaluatedExpression(value);
    } else if (isValueEvaluated(value)) {
      product[key] = value;
    }
    return product;
  }, {});

/**
 * returns the data model for evaluating evaluation tokens
 * @private
 * @param {VPOptionsObject} options - the vidiun player options object
 * @returns {Object} - data model
 */
const getModel = (options: VPOptionsObject): Object => {
  const dataModel: Object = {
    pVersion: __VERSION__,
    pName: __NAME__
  };
  if (options.targetId) {
    dataModel.domRootElementId = options.targetId;
  }
  if (options.provider && options.provider.env) {
    dataModel['serviceUrl'] = options.provider.env.serviceUrl;

    if (dataModel['serviceUrl']) {
      dataModel['embedBaseUrl'] = dataModel['serviceUrl'].replace('api_v3', '');
    }
  }
  const entryDataModel = {
    referrer: getReferrer()
  };
  if (options.provider) {
    Utils.Object.mergeDeep(entryDataModel, {
      vs: options.provider.vs,
      uiConfId: options.provider.uiConfId,
      partnerId: options.provider.partnerId
    });
  }
  if (options.session) {
    Utils.Object.mergeDeep(entryDataModel, {
      sessionId: options.session.id,
      vs: options.session.vs,
      isAnonymous: options.session.isAnonymous,
      uiConfId: options.session.uiConfId,
      partnerId: options.session.partnerId
    });
  }
  if (options.sources) {
    Utils.Object.mergeDeep(entryDataModel, {
      entryId: options.sources.id,
      entryName: options.sources.metadata && options.sources.metadata.name,
      entryType: options.sources.type
    });
  }
  if (options.playlist) {
    Utils.Object.mergeDeep(entryDataModel, {
      playlistId: options.playlist.id
    });
  }
  Object.keys(entryDataModel).forEach(key => {
    if (entryDataModel[key] === undefined) {
      delete entryDataModel[key];
    }
  });
  Utils.Object.mergeDeep(dataModel, entryDataModel);
  return dataModel;
};

/**
 * @param {PKPluginsConfigObject} options - plugins options
 * @param {VPOptionsObject} config - player config
 * @private
 * @return {void}
 */
function evaluatePluginsConfig(options: ?PKPluginsConfigObject, config: VPOptionsObject): void {
  if (options) {
    pluginConfig.set(options);
    const dataModel = getModel(config);
    const mergedConfig = Utils.Object.mergeDeep({}, pluginConfig.get(), options);
    const evaluatedConfig = _formatConfigString(evaluate(JSON.stringify(mergedConfig), dataModel));
    _mergeConfig(options, evaluatedConfig);
  }
}

/**
 * @param {UIOptionsObject} options - UI options
 * @param {VPOptionsObject} config - player config
 * @private
 * @return {void}
 */
function evaluateUIConfig(options: UIOptionsObject, config: VPOptionsObject): void {
  if (options) {
    const defaultUiConfig = {
      components: {
        share: {
          shareUrl: `{{embedBaseUrl}}/index.php/extwidget/preview/partner_id/{{partnerId}}/uiconf_id/{{uiConfId}}/entry_id/{{entryId}}/embed/dynamic`,
          embedUrl: `{{embedBaseUrl}}/p/{{partnerId}}/embedPakhshkitJs/uiconf_id/{{uiConfId}}?iframeembed=true&entry_id={{entryId}}`
        }
      }
    };
    const dataModel = getModel(config);
    const mergedConfig = Utils.Object.mergeDeep({}, defaultUiConfig, options);
    const evaluatedConfig = _formatConfigString(evaluate(JSON.stringify(mergedConfig), dataModel));
    _mergeConfig(options, evaluatedConfig);
  }
}

/**
 *
 * @param {string} config - the config string
 * @returns {Object} - the config object
 * @private
 */
function _formatConfigString(config: string): Object {
  let configObj;
  try {
    configObj = JSON.parse(config, function(key) {
      try {
        return JSON.parse(this[key]);
      } catch (e) {
        return this[key];
      }
    });
  } catch (e) {
    configObj = {};
  }
  return configObj;
}
/**
 * @param {Object} data - target config object
 * @param {Object} evaluatedConfig - the evaluated object
 * @private
 * @returns {void}
 */
function _mergeConfig(data: Object, evaluatedConfig: Object): void {
  const evaluatedCleanConfig = removeUnevaluatedExpression(evaluatedConfig);
  const cleanData = removeUnevaluatedExpression(data);

  if (cleanData && evaluatedCleanConfig) {
    Object.keys(data).forEach(pluginName => {
      if (data && data[pluginName]) {
        data[pluginName] = Utils.Object.mergeDeep({}, evaluatedCleanConfig[pluginName], cleanData[pluginName]);
      }
    });
  }
}

export {evaluatePluginsConfig, evaluateUIConfig};
