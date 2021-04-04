const { Plugin } = require('powercord/entities');
const { getModule } = require('powercord/webpack');
const { inject, uninject } = require('powercord/injector');
const { findInReactTree, findInTree } = require('powercord/util');

/**
 * Shows how much time has passed since you joined a voice channel.
 * @link https://github.com/RazerMoon/vcTimer
 * @license MIT
 * @extends Plugin
 */
module.exports = class VCTimer extends Plugin {
  startPlugin () {
    // this.patchRTC();
  }

  async patchRTC () {
    const RTC = await getModule((m) => (m.__powercordOriginal_default || m.default)?.displayName === 'RTCConnectionStatus');

    // This be brokey
    inject('vcTimer-RTC-patch', RTC, 'default', (args, res) => {
      console.dir(args);
      const resp = (RTC.__powercordOriginal_default || RTC.default).prototype.constructor(args, res);
      const main = findInReactTree(resp.props, (elm) => elm.props && typeof elm.props.children === 'string');
      main.props.children = 'bruh';
      console.dir(resp);
      RTC.default.prototype.constructor = resp.constructor;
      // resp.props.children.props.children.props.children.props.children = 'bruh';
      // resp._reactInternalFiber.child.child.child.sibling.child.child.child.child.child.child.memoizedProps.children = 'bruh';
      // const msg = findInReactTree(resp._reactInternalFiber, (elm) => elm.memoizedProps && elm.memoizedProps.children === 'Voice Connected');


      return resp;
    }
    );
  }

  pluginWillUnload () {
    uninject('vcTimer-RTC-patch');
  }
};
