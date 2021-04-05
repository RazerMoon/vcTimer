const { React, FluxDispatcher } = require('powercord/webpack');

module.exports = class Timer extends React.Component {
  constructor (props) {
    super(props);
    // ? Idk why I can't access 'this' in 'show', thanks god bind exists
    this.show = this.show.bind(this);
    this.state = {
      seconds: 0
    };
  }

  show (e) {
    if (e.channelId) {
      this.setState((state) => (state.seconds = 0));
    }
  }

  componentDidMount () {
    // ? Handles channel switches
    FluxDispatcher.subscribe('VOICE_CHANNEL_SELECT', this.show);

    this.interval = setInterval(() => {
      this.setState((state) => (state.seconds += 1));
    }, 1000);
  }

  // Usually not needed but interval is being weird here ¯\_(ツ)_/¯
  componentWillUnmount () {
    FluxDispatcher.unsubscribe('VOICE_CHANNEL_SELECT', this.show);
    clearInterval(this.interval);
  }

  // https://stackoverflow.com/questions/1322732/convert-seconds-to-hh-mm-ss-with-javascript
  render () {
    return <p>Time elapsed: {new Date(this.state.seconds * 1000).toISOString().substr(11, 8)}</p>;
  }
};
