import React, { Component } from 'react';
import Icon from './Icon';

export class Notification extends Component {
  constructor(props) {
    console.log('Notification');
    super(props);
    this.state = {hidden: true};
  }

  show = () => {
    this.setState({hidden: false})
  }

  componentDidMount() {
    setTimeout(this.show, 60);
  }

  render() {
    const props = this.props;

    console.log('render Notification', this.state);
    return (
      <div className="eureka__notification-wrapper" aria-live="polite" aria-atomic="true" aria-hidden={this.state.hidden}>
        <div>
        <p aria-live="polite">Something happened  </p>
        <button aria-label="Dismiss Notification" onClick={(event) => {
          this.setState({
            hidden: true
          })
        }}>
          <Icon {...props} icon="times" aria-label="Dismiss Notification" ariaHidden={false} />
        </button>
        </div>
      </div>
    );
  }
}

export default Notification;
