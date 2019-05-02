import '../../src/index';
import {setup} from '../../src/setup';
import * as TestUtils from './utils/test-utils';
import StorageWrapper from '../../src/common/storage/storage-wrapper';

const targetId = 'player-placeholder_setup.spec';

describe('setup', function() {
  let config, vidiunPlayer, sandbox;
  const entryId = '0_wifqaipd';
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
    config = {
      targetId: targetId,
      provider: {
        partnerId: partnerId,
        env: env
      }
    };
  });

  afterEach(function() {
    sandbox.restore();
    vidiunPlayer.destroy();
    vidiunPlayer = null;
    TestUtils.removeVideoElementsFromTestPage();
  });

  after(function() {
    TestUtils.removeElement(targetId);
  });

  it('should create a full player', function(done) {
    vidiunPlayer = setup(config);
    vidiunPlayer.loadMedia.should.exist;
    vidiunPlayer.loadMedia({entryId: entryId}).then(() => {
      vidiunPlayer.config.sources.id.should.equal(entryId);
      vidiunPlayer.config.session.partnerId.should.equal(partnerId);
      done();
    });
  });

  it('should create an empty player', function() {
    vidiunPlayer = setup(config);
    (!vidiunPlayer.config.id).should.be.true;
  });

  it('should decorate the selected source by session id', function(done) {
    vidiunPlayer = setup(config);
    vidiunPlayer.loadMedia.should.exist;
    vidiunPlayer.loadMedia({entryId: entryId}).then(() => {
      vidiunPlayer.ready().then(() => {
        let sessionIdRegex = /playSessionId=((?:[a-z0-9]|-|:)*)/i;
        sessionIdRegex.exec(vidiunPlayer.src)[1].should.equal(vidiunPlayer.config.session.id);
        done();
      });
      vidiunPlayer.load();
    });
  });

  it('should set text style from storage', function() {
    let textStyle = {
      fontSize: '20%',
      fontFamily: 'sans-serif',
      fontColor: [14, 15, 0],
      fontOpacity: 0,
      backgroundColor: [1, 2, 3],
      backgroundOpacity: 1,
      fontEdge: [],
      fontScale: 1
    };
    sandbox
      .stub(StorageWrapper, 'getItem')
      .withArgs('textStyle')
      .returns(textStyle);
    vidiunPlayer = setup(config);
    vidiunPlayer.textStyle.should.deep.equal(textStyle);
  });

  it('should configure sources', function(done) {
    const url = 'http://cfvod.vidiun.com/pd/p/2196781/sp/219678100/serveFlavor/entryId/1_afvj3z0u/v/1/flavorId/1_vpmhfzgl/name/a.mp4';
    config.sources = {
      progressive: [
        {
          id: 'id',
          mimetype: 'video/mp4',
          url
        }
      ]
    };
    vidiunPlayer = setup(config);
    vidiunPlayer.load();
    vidiunPlayer.ready().then(() => {
      vidiunPlayer.src.should.equal(url);
      done();
    });
  });
});
