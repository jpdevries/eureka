import React from 'react';

import store from '../model/store';
import actions from '../model/actions';

import Icon from './Icon';

import classNames from 'classnames';

import { runPrefixMethod } from '../utility/utility';

import { FormattedMessage } from 'react-intl';
import definedMessages from '../i18n/definedMessages';

import FullScreenPureComponent from './FullScreenPureComponent';

import Masonry from 'react-masonry-component';

class ViewChooser extends FullScreenPureComponent {
  render() {
    //console.log('ViewChooser', this.props);
    const props = this.props,
    formatMessage = props.intl.formatMessage,
    tabularLayoutMessage = formatMessage(definedMessages.tabularLayoutDescription),
    thumbLayoutMessage = formatMessage(definedMessages.thumbnailLayoutDescription),
    gridLayoutMessage = formatMessage(definedMessages.gridLayoutDescription),
    masonryLayoutMessage = formatMessage(definedMessages.masonryLayoutMessage),
    listLayoutMessage = formatMessage(definedMessages.listLayoutDescription),
    masonryBtn = (Masonry && props.config.allowMasonry) ? (
      <div>
        <input type="radio" id="eureka__view-masonry" name="eureka__view" onChange={(event) => (
          store.dispatch(actions.updateView({
            mode: event.target.value
          }))
          )} checked={props.view.mode === 'masonry'} value="masonry" />&emsp;
        <label htmlFor="eureka__view-masonry" title={masonryLayoutMessage}>
          <Icon {...props} icon="masonry" />
          <span className="visually-hidden"><FormattedMessage id="layout.masonry" defaultMessage="Masonry Layout" /></span>
        </label>
      </div>
    ) : undefined,
    fullscreenToggle = (props.view.allowFullscreen && this.state.supportsFullscreen) ? (
      <div>
        <input type="checkbox" id="eureka__fullscreen-toggle" name="eureka__fullscreen-toggle" value="1" onChange={(event) => {
          const closestRoot = event.target.closest('.eureka-root');
          let isFullscreen = false;
          if(event.target.checked) {
              try {
                closestRoot.requestFullscreen();
              } catch(e) {
                runPrefixMethod(closestRoot, 'RequestFullscreen');
              }
              isFullscreen = true;
          } else {
            try {
              closestRoot.exitFullscreen();
            } catch (e) {
              runPrefixMethod(document, 'ExitFullscreen');
              runPrefixMethod(document, 'CancelFullscreen');
            }
          }
          this.setState({
            isFullscreen: isFullscreen
          });
        }} />
        <label className={classNames({
          'eureka__checked-active': this.state.isFullscreen
        })} htmlFor="eureka__fullscreen-toggle">
          <span className="visually-hidden"><FormattedMessage id="layout.fullscreenMode" defaultMessage="Fullscreen Mode" /></span>
          <Icon {...props} aria-hidden="true" icon={this.state.isFullscreen ? 'compress' : 'expand'} />
        </label>
      </div>
    ) : undefined;

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

            {masonryBtn}

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

            {fullscreenToggle}

          </div>

        </fieldset>
      </form>
    );
  }
}

export default ViewChooser;
