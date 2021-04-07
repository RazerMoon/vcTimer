const { React, FluxDispatcher } = require('powercord/webpack');

module.exports = class Timer extends React.Component {
  constructor (props) {
    super(props);
    // ? Idk why I can't access 'this' in 'show', thanks god bind exists
    this.handleChangeChannel = this.handleChangeChannel.bind(this);
    this.state = {
      startTime: 0,
      delta: 0
    };
  }

  handleChangeChannel (e) {
    if (e.channelId) {
      this.setState((prev) => (
        prev.startTime = Date.now()));
    }
  }

  componentDidMount () {
    this.setState((prev) => (
      prev.startTime = Date.now()));

    // ? Handles channel switches
    FluxDispatcher.subscribe('VOICE_CHANNEL_SELECT', this.handleChangeChannel);

    this.interval = setInterval(() => {
      this.setState((prev) => (prev.delta = Math.round((Date.now() - prev.startTime) / 1000) * 1000));
    }, 1000);
  }

  // Usually not needed but interval is being weird here ¯\_(ツ)_/¯
  componentWillUnmount () {
    FluxDispatcher.unsubscribe('VOICE_CHANNEL_SELECT', this.handleChangeChannel);
    clearInterval(this.interval);
  }

  // https://stackoverflow.com/questions/1322732/convert-seconds-to-hh-mm-ss-with-javascript
  render () {
    return <p>Time elapsed: {new Date(this.state.delta).toISOString().substr(11, 8)}</p>;
  }
};
