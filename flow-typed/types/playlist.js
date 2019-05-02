// @flow
import {PlaylistItem} from '../../src/common/playlist/playlist-item';

/**
 * @typedef {Object} VPPlaylistOptions
 * @property {boolean} [autoContinue=true] - Determines whether to continue to the next item automatically.
 * @property {boolean} [loop=false] - Determines whether to play the playlist in a loop. When selected, the playlist will play automatically even if autoContinue is set to false.
 */
type _VPPlaylistOptions = {
  autoContinue: boolean,
  loop: boolean
};
declare type VPPlaylistOptions = _VPPlaylistOptions;

/**
 * @typedef {Object} VPPlaylistCountdownOptions
 * @property {number} [timeToShow] - Shows when the countdown is scheduled to appear (by default, this is towards the end).
 * @property {number} [duration=10] - Shows for how long the countdown will appear.
 * @property {boolean} [showing=true] - Determines whether to show the countdown.
 */
type _VPPlaylistCountdownOptions = {
  timeToShow?: number,
  duration: number,
  showing: boolean
};
declare type VPPlaylistCountdownOptions = _VPPlaylistCountdownOptions;

/**
 * @typedef {Object} VPPlaylistConfigObject
 * @property {VPPlaylistOptions} options - Sets the playlist options.
 * @property {VPPlaylistCountdownOptions} countdown - Configures the playlist countdown.
 * @property {Array<PlaylistItem>} items - Lists the available playlist items.
 */
type _VPPlaylistConfigObject = {
  options: VPPlaylistOptions,
  countdown: VPPlaylistCountdownOptions,
  items: Array<PlaylistItem>
};
declare type VPPlaylistConfigObject = _VPPlaylistConfigObject;

/**
 * @typedef {Object} VPPlaylistObject
 * @property {string} id - This is playlist's ID.
 * @property {ProviderPlaylistMetadataObject} metadata - This is the playlist metadata.
 * @property {VPPlaylistOptions} options - These are the playlist options.
 * @property {VPPlaylistCountdownOptions} countdown - This is the playlist countdown configuration.
 * @property {Array<PlaylistItem>} items - These are the playlist items.
 */
type _VPPlaylistObject = {
  id: string,
  metadata: ProviderPlaylistMetadataObject,
  poster?: string,
  options: VPPlaylistOptions,
  countdown: VPPlaylistCountdownOptions,
  items: Array<PlaylistItem>
};
declare type VPPlaylistObject = _VPPlaylistObject;

/**
 * @typedef {Object} VPPlaylistItemConfigObject
 * @property {VPPlaylistCountdownOptions} [countdown] - Countdown options
 */
type _VPPlaylistItemConfigObject = {
  countdown?: VPPlaylistCountdownOptions;
};
declare type VPPlaylistItemConfigObject = _VPPlaylistItemConfigObject;
