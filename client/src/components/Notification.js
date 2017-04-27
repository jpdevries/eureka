import React, { Component } from 'react';
import Icon from './Icon';

import { IntlProvider, addLocaleData } from 'react-intl';

import { FormattedMessage, FormattedPlural, FormattedNumber, FormattedRelative, injectIntl } from 'react-intl';

export class Notification extends Component {
  constructor(props) {
    console.log('Notification created!!!', props);
    super(props);
    this.state = {hidden: true, dismissed:false};
  }

  show = () => {
    this.setState({hidden: false})
  }

  slideInOut() {
    setTimeout(this.show, 60);
    if(this.props.dismissAfter) setTimeout(this.dismiss, this.props.dismissAfter);
  }

  componentDidMount() {
    this.slideInOut();
  }

  componentWillUpdate(nextProps, nextState) { // incase they aren't using a unique key in user land
    if(this.props.id !== nextProps.id) {
      this.setState({hidden: true, dismissed:false});
      this.slideInOut();
    }
  }

  dismiss = () => {
    const props = this.props;

    this.setState({
      dismissed: true,
      hidden: true
    });
    if(props.onDismiss) {
      setTimeout(() => {
        props.onDismiss(props.id)
      }, 420)
    }
  }

  render() {
    const props = this.props;
    let className = `eureka__notification-wrapper `;
    let notificationClass = '';
    const lb = (props.learnMore) ? (<br />) : undefined;
    const learnMore = (props.learnMore) ? (
      <a href={props.learnMore} target="_blank">
        <FormattedMessage id="welcome.learnMore" defaultMessage="Learn more" />
      </a>
    ) : undefined;

    const icon = (() => {
      switch (props.type) {
        case 'dangerous':
        notificationClass = 'eureka__dangerous';
        return <Icon {...props} aria-hidden="true" icon="exclamation-triangle" />;
        break;

        default:
        return <Icon {...props} aria-hidden="true" icon="info-circle" />;
      }
    })();

    return (
      <div className={className} aria-hidden={this.state.hidden}>
        <div className={notificationClass}>
        <p>{icon}&ensp;{props.message}{lb}{learnMore}</p>
        <button aria-hidden="true" aria-label="Dismiss Notification" onClick={(this.state.dismissed ? undefined : (event) => { // hiding because it isn't very necessary for screen readers given notifications auto-dismiss after ~3 seconds
          this.dismiss();
        })}>
          <Icon {...props} icon="times" />
        </button>
        </div>
      </div>
    );
  }
}

Notification.defaultProps = {
  dismissAfter: 4200
}

export default Notification;
