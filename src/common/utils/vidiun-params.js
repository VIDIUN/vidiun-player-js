//@flow
import {StreamType, Utils} from '@pakhshkit-js/pakhshkit-js';

const PLAY_MANIFEST = 'playmanifest/';
const PLAY_SESSION_ID = 'playSessionId=';
const REFERRER = 'referrer=';
const CLIENT_TAG = 'clientTag=html5:v';

/**
 * @param {Player} player - player
 * @param {PartialVPOptionsObject} playerConfig - player config
 * @return {void}
 * @private
 */
function handleSessionId(player: Player, playerConfig: PartialVPOptionsObject): void {
  if (player.config.session && player.config.session.id) {
    // on change media
    updateSessionId(player, playerConfig);
  } else {
    // on first playback
    addSessionId(playerConfig);
  }
}

/**
 * @param {PartialVPOptionsObject} playerConfig - player config
 * @return {void}
 * @private
 */
function addSessionId(playerConfig: PartialVPOptionsObject): void {
  let primaryGUID = Utils.Generator.guid();
  let secondGUID = Utils.Generator.guid();
  setSessionId(playerConfig, primaryGUID + ':' + secondGUID);
}

/**
 * @param {Player} player - player
 * @param {PartialVPOptionsObject} playerConfig - player config
 * @return {void}
 * @private
 */
function updateSessionId(player: Player, playerConfig: PartialVPOptionsObject): void {
  let secondGuidInSessionIdRegex = /:((?:[a-z0-9]|-)*)/i;
  let secondGuidInSessionId = secondGuidInSessionIdRegex.exec(player.config.session.id);
  if (secondGuidInSessionId && secondGuidInSessionId[1]) {
    setSessionId(playerConfig, player.config.session.id.replace(secondGuidInSessionId[1], Utils.Generator.guid()));
  }
}

/**
 * @param {PartialVPOptionsObject} playerConfig - player config
 * @param {string} sessionId - the session id
 * @return {void}
 * @private
 */
function setSessionId(playerConfig: PartialVPOptionsObject, sessionId: string): void {
  playerConfig.session = playerConfig.session || {};
  playerConfig.session.id = sessionId;
}

/**
 * @param {PKMediaSourceObject} source - PKMediaSourceObject
 * @param {string} sessionId - session id
 * @return {void}
 * @private
 */
function updateSessionIdInUrl(source: Object = {}, sessionId: ?string): void {
  if (sessionId) {
    let sessionIdInUrlRegex = new RegExp(PLAY_SESSION_ID + '((?:[a-z0-9]|-)*:(?:[a-z0-9]|-)*)', 'i');
    let sessionIdInUrl = sessionIdInUrlRegex.exec(source.url);
    if (sessionIdInUrl && sessionIdInUrl[1]) {
      // this url has session id (has already been played)
      source.url = source.url.replace(sessionIdInUrl[1], sessionId);
    } else {
      let delimiter = source.url.indexOf('?') === -1 ? '?' : '&';
      source.url += delimiter + PLAY_SESSION_ID + sessionId;
    }
  }
}

/**
 * @return {string} - The referrer
 * @private
 */
function getReferrer(): string {
  let referrer;
  try {
    referrer = window.parent.document.URL;
  } catch (e) {
    // unfriendly iframe
    referrer = document.referrer;
  }
  return referrer;
}

/**
 * @param {PKMediaSourceObject} source - source
 * @return {void}
 * @private
 */
function addReferrer(source: PKMediaSourceObject): void {
  if (source.url.indexOf(REFERRER) === -1) {
    let delimiter = source.url.indexOf('?') === -1 ? '?' : '&';
    let referrer = btoa(getReferrer().substr(0, 1000));
    source.url += delimiter + REFERRER + referrer;
  }
}

/**
 * @param {PKMediaSourceObject} source - source
 * @return {void}
 * @private
 */
function addClientTag(source: PKMediaSourceObject): void {
  if (source.url.indexOf(CLIENT_TAG) === -1) {
    let delimiter = source.url.indexOf('?') === -1 ? '?' : '&';
    source.url += delimiter + CLIENT_TAG + __VERSION__;
  }
}

/**
 * Adding Vidiun specific params to player config and player sources.
 * @param {Player} player - player
 * @param {PartialVPOptionsObject} playerConfig - player config
 * @return {void}
 * @private
 */
function addVidiunParams(player: Player, playerConfig: PartialVPOptionsObject): void {
  handleSessionId(player, playerConfig);
  const sources = playerConfig.sources;
  Object.values(StreamType).forEach(key => {
    // $FlowFixMe
    if (sources[key]) {
      sources[key].forEach(source => {
        if (typeof source.url === 'string' && source.url.toLowerCase().indexOf(PLAY_MANIFEST) > -1 && !source.localSource) {
          updateSessionIdInUrl(source, playerConfig.session && playerConfig.session.id);
          addReferrer(source);
          addClientTag(source);
        }
      });
    }
  });
}

export {addVidiunParams, handleSessionId, updateSessionIdInUrl, getReferrer, addReferrer, addClientTag};
