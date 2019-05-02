import {addVidiunPoster} from '../../../src/ovp/poster';
import * as TestUtils from '../utils/test-utils';
import {setup} from '../../../src/setup';
import {Provider} from 'pakhshkit-js-providers';

const targetId = 'player-placeholder_ovp/poster.spec';

describe('addVidiunPoster', function() {
  it('should append width and height to vidiun poster', function() {
    const mediaSources = {poster: 'https//my/vidiun/poster'};
    const playerSources = {poster: 'https//my/vidiun/poster'};
    addVidiunPoster(playerSources, mediaSources, {width: 640, height: 360});
    playerSources.poster.should.equal('https//my/vidiun/poster/height/360/width/640');
  });

  it('should not append width and height to vidiun poster', function() {
    const mediaSources = {poster: 'https//my/vidiun/poster'};
    const playerSources = {poster: 'https//my/non/vidiun/poster'};
    addVidiunPoster(playerSources, mediaSources, {width: 640, height: 360});
    playerSources.poster.should.equal('https//my/non/vidiun/poster');
  });

  describe('Poster Integration', function() {
    let config, vidiunPlayer, sandbox, provider;
    const myCustomPosterUrl = 'https://www.elastic.co/assets/bltada7771f270d08f6/enhanced-buzz-1492-1379411828-15.jpg';
    const entryId = '0_wifqaipd';
    const alterEntryId = '0_4ktof5po';
    const partnerId = 1091;
    const env = {
      cdnUrl: 'http://qa-apache-php7.dev.vidiun.com/',
      serviceUrl: 'http://qa-apache-php7.dev.vidiun.com/api_v3'
    };

    before(function() {
      TestUtils.createElement('DIV', targetId);
    });

    beforeEach(function() {
      sandbox = sinon.sandbox.create();
      provider = new Provider({
        partnerId: partnerId,
        env: env
      });
      config = {
        targetId: targetId,
        provider: {
          partnerId: partnerId,
          env: env
        },
        sources: {}
      };
    });

    afterEach(function() {
      sandbox.restore();
      vidiunPlayer.destroy();
      provider = null;
      TestUtils.removeVideoElementsFromTestPage();
    });

    after(function() {
      TestUtils.removeElement(targetId);
    });

    it('should choose configured poster', function(done) {
      config.sources.poster = myCustomPosterUrl;
      vidiunPlayer = setup(config);
      vidiunPlayer.loadMedia({entryId: entryId}).then(() => {
        vidiunPlayer.config.sources.poster.should.equal(myCustomPosterUrl);
        done();
      });
    });

    it('should choose backend poster', function(done) {
      vidiunPlayer = setup(config);
      provider.getMediaConfig({entryId: entryId}).then(mediaConfig => {
        vidiunPlayer.loadMedia({entryId: entryId}).then(() => {
          vidiunPlayer.config.sources.poster.should.have.string(mediaConfig.sources.poster);
          done();
        });
      });
    });

    it('should choose backend poster on change media', function(done) {
      vidiunPlayer = setup(config);
      provider.getMediaConfig({entryId: entryId}).then(mediaConfig => {
        vidiunPlayer.loadMedia({entryId: entryId}).then(() => {
          vidiunPlayer.config.sources.poster.should.have.string(mediaConfig.sources.poster);
          provider.getMediaConfig({entryId: alterEntryId}).then(alterMediaConfig => {
            vidiunPlayer.loadMedia({entryId: alterEntryId}).then(() => {
              vidiunPlayer.config.sources.poster.should.have.string(alterMediaConfig.sources.poster);
              done();
            });
          });
        });
      });
    });

    it('should choose configured poster on change media', function(done) {
      vidiunPlayer = setup(config);
      provider.getMediaConfig({entryId: entryId}).then(mediaConfig => {
        vidiunPlayer.loadMedia({entryId: entryId}).then(() => {
          vidiunPlayer.config.sources.poster.should.have.string(mediaConfig.sources.poster);
          vidiunPlayer.reset();
          vidiunPlayer.configure({
            sources: {
              poster: myCustomPosterUrl
            }
          });
          vidiunPlayer.loadMedia({entryId: alterEntryId}).then(() => {
            vidiunPlayer.config.sources.poster.should.equal(myCustomPosterUrl);
            done();
          });
        });
      });
    });
  });
});
