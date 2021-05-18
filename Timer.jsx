const { React, FluxDispatcher } = require('powercord/webpack');

module.exports = class Timer extends React.Component {
  constructor (props) {
    super(props);
    // ? Idk why I can't access 'this' in 'show', thanks god bind exists
    this.handleDispatch = this.handleDispatch.bind(this);
    this.state = {
      startTime: 0,
      delta: 0
    };
  }

  handleDispatch (e) {
    if (
      e.state &&
      e.state === 'RTC_DISCONNECTED' &&
      !e.hasOwnProperty('streamKey')
    ) {
      this.setState((prev) => (prev.startTime = Date.now()));
    }
  }

  componentDidMount () {
    this.setState((prev) => (prev.startTime = Date.now()));

    // ? Handles channel switches
    FluxDispatcher.subscribe('RTC_CONNECTION_STATE', this.handleDispatch);

    this.interval = setInterval(() => {
      this.setState(
        (prev) =>
          (prev.delta = Math.round((Date.now() - prev.startTime) / 1000) * 1000)
      );
    }, 1000);
  }

  // Usually not needed but interval is being weird here ¯\_(ツ)_/¯
  componentWillUnmount () {
    FluxDispatcher.unsubscribe('RTC_CONNECTION_STATE', this.handleDispatch);
    clearInterval(this.interval);
  }

  // https://stackoverflow.com/questions/1322732/convert-seconds-to-hh-mm-ss-with-javascript
  render () {
    return (
      <>
        <br />
        <br />
        Time elapsed: {new Date(this.state.delta).toISOString().substr(11, 8)}
      </>
    );
  }
};
