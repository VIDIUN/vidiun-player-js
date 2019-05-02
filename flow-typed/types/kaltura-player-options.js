// @flow
import {VPPlaylistObject} from './playlist';

declare type VPOptionsObject = {
  targetId: string,
  logLevel?: string,
  disableUserCache?: boolean,
  playback?: PKPlaybackConfigObject,
  sources?: PKSourcesConfigObject,
  plugins?: PKPluginsConfigObject,
  session?: PKSessionConfigObject,
  provider: ProviderOptionsObject,
  playlist?: VPPlaylistObject,
  ui: UIOptionsObject,
  cast?: { [key: string]: any }
};

declare type PartialVPOptionsObject = {
  targetId: string,
  logLevel?: string,
  disableUserCache?: boolean,
  playback?: PKPlaybackConfigObject,
  sources?: PKSourcesConfigObject,
  plugins?: PKPluginsConfigObject,
  session?: PKSessionConfigObject,
  provider: ProviderOptionsObject,
  ui?: UIOptionsObject,
  cast?: { [key: string]: any }
};

declare type LegacyPartialVPOptionsObject = {
  targetId: string,
  logLevel?: string,
  disableUserCache?: boolean,
  player?: PKPlayerOptionsObject,
  provider: ProviderOptionsObject,
  ui?: UIOptionsObject
};
