const { Plugin } = require('powercord/entities');
const { React, getModule } = require('powercord/webpack');
const { inject, uninject } = require('powercord/injector');
const { findInReactTree } = require('powercord/util');

const Timer = require('./Timer.jsx');

/**
 * Shows how much time has passed since you joined a voice channel.
 * @link https://github.com/RazerMoon/vcTimer
 * @license MIT
 * @extends Plugin
 */
module.exports = class VCTimer extends Plugin {
  startPlugin () {
    this.patchPanel();
  }

  async patchPanel () {
    const PanelSubtext = await getModule((m) => (m.__powercordOriginal_default || m.default)?.displayName === 'PanelSubtext');

    inject('vcTimer-panel-patch', PanelSubtext, 'default', (args) => {
      const [ { className } ] = args;

      if (!className || !className.includes('channel')) {
        return args;
      }

      const hasTimer = findInReactTree(args[0].children, child => child.props && child.props.id === 'timer');

      if (!hasTimer) {
        const TimerItem = React.createElement(Timer, {
          id: 'timer'
        });

        if (!Array.isArray(args[0].children)) {
          args[0].children = [ args[0].children ];
        }

        args[0].children.push(TimerItem);
      }

      return args;
    }, true);

    PanelSubtext.default.displayName = 'PanelSubtext';
  }

  pluginWillUnload () {
    uninject('vcTimer-panel-patch');
  }
};
