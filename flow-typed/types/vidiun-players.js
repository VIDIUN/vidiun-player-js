import {VidiunPlayer} from '../../src/vidiun-player';

/**
 * @type {Object.<string, VidiunPlayer>}
 * @name VidiunPlayers
 * @description a map of player instances by player ids
*/
type _VidiunPlayers = {[id: string]: VidiunPlayer};
declare type VidiunPlayers = _VidiunPlayers;
