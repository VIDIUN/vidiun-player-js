// @flow
import {VidiunPlayer} from './vidiun-player';
import {FakeEventTarget} from '@pakhshkit-js/pakhshkit-js';

const Players: VidiunPlayers = {};
/**
 * get all instantiated players
 * @returns {VidiunPlayers} - map of player ids and their respective instantiated player
 */
function getPlayers(): VidiunPlayers {
  return Players;
}

/**
 * get a player instance by id
 * @param {string} id - the player ID
 * @returns {VidiunPlayer | null} - the player if found by the supplied ID or null if key doesn't exist
 */
function getPlayer(id: string): ?VidiunPlayer {
  if (Players[id]) {
    return Players[id];
  }
  return null;
}

const proxyIgnoredProps: Array<string> = ['_remotePlayer', '_listeners', '_uiWrapper'];
const proxyHandler: Object = {
  get(vp: VidiunPlayer, prop: string) {
    if (prop === 'destroy') {
      const playerId = vp.config.targetId;
      delete Players[playerId];
    }

    if (prop in FakeEventTarget.prototype || proxyIgnoredProps.includes(prop)) {
      // $FlowFixMe
      return vp[prop];
    }
    if (vp._remotePlayer && prop in vp._remotePlayer) {
      return vp._remotePlayer[prop];
    }
    // $FlowFixMe
    return vp[prop];
  },
  set(vp: VidiunPlayer, prop: string, value: any) {
    if (vp._remotePlayer && !proxyIgnoredProps.includes(prop)) {
      if (prop in vp._remotePlayer) {
        vp._remotePlayer[prop] = value;
      }
    } else {
      // $FlowFixMe
      vp[prop] = value;
    }
    return true;
  }
};

const getPlayerProxy = (options: VPOptionsObject) => {
  const player = new VidiunPlayer(options);
  const proxy = new Proxy(player, proxyHandler);
  Players[options.targetId] = proxy;
  return proxy;
};

export {getPlayerProxy, getPlayer, getPlayers};
