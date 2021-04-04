const { React } = require('powercord/webpack');

module.exports = class Timer extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      seconds: 0
    };
  }

  componentDidMount () {
    this.interval = setInterval(() => {
      this.setState((state) => (state.seconds += 1));
    }, 1000);
  }

  // Usually not needed but interval is being weird here ¯\_(ツ)_/¯
  componentWillUnmount () {
    clearInterval(this.interval);
  }

  // https://stackoverflow.com/questions/1322732/convert-seconds-to-hh-mm-ss-with-javascript
  render () {
    return <p>Time elapsed: {new Date(this.state.seconds * 1000).toISOString().substr(11, 8)}</p>;
  }
};
