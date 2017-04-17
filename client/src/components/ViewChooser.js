import React, { PureComponent } from 'react';

import store from '../model/store';
import actions from '../model/actions';

import Icon from './Icon';

import classNames from 'classnames';

import { runPrefixMethod } from '../utility/utility';

import { FormattedMessage } from 'react-intl';
import definedMessages from '../i18n/definedMessages';

class ViewChooser extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      ifFullscreen: false
    };

    // isn't this fun? why are you crying?
    document.onfullscreenchange = document.onwebkitfullscreenchange = document.onmozfullscreenchange = document.onmsfullscreenchange = document.onwebkitfullscreenchange = this.handleFullScreenChange.bind(this);
  }

  handleFullScreenChange(event) {
    this.setState({
      isFullscreen: this.getFullScreenElement() !== undefined
    });
  }

  getFullScreenElement() {
    return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || undefined;
  }

  render() {
    const props = this.props,
    formatMessage = props.intl.formatMessage,
    tabularLayoutMessage = formatMessage(definedMessages.tabularLayoutDescription),
    thumbLayoutMessage = formatMessage(definedMessages.thumbnailLayoutDescription),
    gridLayoutMessage = formatMessage(definedMessages.gridLayoutDescription),
    listLayoutMessage = formatMessage(definedMessages.listLayoutDescription);

    return (
      <form className="eureka__layout-chooser">
        <fieldset>
          <legend>Choose a Layout Mode</legend>

          <div className="eureka__icon-radio-btns">
            <div>
              <input type="radio" id="eureka__view-table" name="eureka__view" onChange={(event) => (
                store.dispatch(actions.updateView({
                  mode: event.target.value
                }))
                )} checked={props.view.mode === 'table'} value="table" />&emsp;
              <label htmlFor="eureka__view-table" title={tabularLayoutMessage}>
                <Icon {...props} icon="th-list" />
                <span className="visually-hidden"><FormattedMessage id="layout.table" defaultMessage="Table Layout" /></span>
              </label>
            </div>

            <div>
              <input type="radio" id="eureka__view-thumb" name="eureka__view" onChange={(event) => (
                store.dispatch(actions.updateView({
                  mode: event.target.value
                }))
                )} checked={props.view.mode === 'thumb'} value="thumb" />&emsp;
              <label htmlFor="eureka__view-thumb" title={thumbLayoutMessage}>
                <Icon {...props} icon="th-large" />
                <span className="visually-hidden"><FormattedMessage id="layout.thumb" defaultMessage="Thumbnail Layout" /></span>
              </label>
            </div>

            <div>
              <input type="radio" id="eureka__view-grid" name="eureka__view" onChange={(event) => (
                store.dispatch(actions.updateView({
                  mode: event.target.value
                }))
                )} checked={props.view.mode === 'grid'} value="grid" />&emsp;
              <label htmlFor="eureka__view-grid" title={gridLayoutMessage}>
                <Icon {...props} icon="square" />
                <span className="visually-hidden"><FormattedMessage id="layout.grid" defaultMessage="Grid Layout" /></span>
              </label>
            </div>

            <div>
              <input type="radio" id="eureka__view-list" name="eureka__view" onChange={(event) => (
                store.dispatch(actions.updateView({
                  mode: event.target.value
                }))
                )} checked={props.view.mode === 'list'} value="list" />&emsp;
              <label htmlFor="eureka__view-list" title={listLayoutMessage}>
                <Icon {...props} icon="list" />
                <span className="visually-hidden"><FormattedMessage id="layout.list" defaultMessage="List Layout" /></span>
              </label>
            </div>

            <div>
              <input type="checkbox" id="eureka__fullscreen-toggle" name="eureka__fullscreen-toggle" checked={this.state.isFullscreen} onChange={(event) => {
                const closestRoot = event.target.closest('.eureka-root');
                if(event.target.checked) {
                    try {
                      closestRoot.requestFullscreen();
                    } catch(e) {
                      runPrefixMethod(closestRoot, 'RequestFullscreen');
                    }
                    this.setState({
                      isFullscreen: true
                    });
                } else {
                  try {
                    closestRoot.exitFullscreen();
                  } catch (e) {
                    runPrefixMethod(document, 'ExitFullscreen');
                    runPrefixMethod(document, 'CancelFullscreen');
                  }
                  this.setState({
                    isFullscreen: false
                  });
                }
              }} />
              <label className={classNames({
                'eureka__checked-active': this.state.isFullscreen
              })} htmlFor="eureka__fullscreen-toggle">
                <span className="visually-hidden"><FormattedMessage id="layout.fullscreenMode" defaultMessage="Fullscreen Mode" /></span>
                <Icon {...props} aria-hidden="true" icon={this.state.isFullscreen ? 'compress' : 'expand'} />
              </label>
            </div>

          </div>

        </fieldset>
      </form>
    );
  }
}

export default ViewChooser;
