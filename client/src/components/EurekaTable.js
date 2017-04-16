import React, { Component } from 'react';

import store from '../model/store';
import actions from '../model/actions';

import EurekaTableTbody from './EurekaTableTbody';

import classNames from 'classnames';

import Dropzone from 'react-dropzone';

import Icon from './Icon';

import utility from '../utility/utility';

import { FormattedMessage } from 'react-intl';
import definedMessages from '../i18n/definedMessages';

class EurekaTable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sort: {
        by: 'filename',
        dir: utility.ASCENDING,
        renamingItem: undefined
      }
    };
    this.decoratedActions = props.decoratedActions ? Object.assign({}, actions, props.decoratedActions) : actions;
  }

  onDrop(files) {
    const props = this.props;
    //console.log('Received files: ', files);

    const formData = new FormData();

    const decoratedActions = this.decoratedActions;

    files.forEach((file) => {
      formData.append('eureka__uploadFiles', file, file.name);
    });

    store.dispatch(decoratedActions.uploadFiles(props.source.currentSource, props.content.cd, formData, props.config.headers));
  }

  render () {
    const props = this.props,
    state = this.state,
    formatMessage = props.intl.formatMessage;

    const decoratedActions = this.decoratedActions;

    const html5ContextMenus = (props.content.contents.length) ? props.content.contents.map((item, index) => (
      <menu key={index} hidden="true" type="context" id={`context_menu__tbody-${index}`}>
          <menuitem label={formatMessage(definedMessages.expandItem, {
            filename: item.filename
          })}></menuitem>
          <menuitem label={formatMessage(definedMessages.chooseItem, {
            filename: item.filename
          })}></menuitem>
          <menuitem label={formatMessage(definedMessages.renameItem, {
            item: item.filename
          })}></menuitem>
          <menuitem label={formatMessage(definedMessages.deleteItem, {
            filename: item.filename
          })} onClick={(event) => {
              store.dispatch(decoratedActions.deleteMediaItem(props.source.currentSource, item.path, props.config.headers));
            }}></menuitem>
      </menu>
    )) : undefined;

    const selectHead = utility.serverSideRendering ? <th scope="col" role="columnheader">Select</th> : undefined;

    const table = (
      <table className="eureka__table" cellSpacing="0" cellPadding="0" role="grid">
        <thead hidden={!props.content.contents.length} className={classNames((store.getState().view.isTableScrolling) ? 'eureka__tbody-scrolling' : undefined)}>
          <tr>
            {selectHead}
            <th role="rowheader" scope="col" role="columnheader"><FormattedMessage id="media" defaultMessage="Media" /></th>
            <th role="rowheader" scope="col" role="columnheader" onClick={(event) => {
              let dir = this.state.sort.dir;
              if(this.state.sort.by === 'filename') {
                dir = (dir === utility.ASCENDING) ? utility.DESCENDING : utility.ASCENDING
              }
              this.setState({
                sort:{
                  by:'filename',
                  dir:dir
                }
              });
            }}><FormattedMessage id="name" defaultMessage="Name" />&ensp;{(!utility.serverSideRendering) ? <Icon {...props}  icon="sort" /> : undefined}</th>
            <th role="rowheader" scope="col" role="columnheader" className="visually-hidden">Actions</th>
            <th role="rowheader" scope="col" role="columnheader" onClick={(event) => {
              let dir = this.state.sort.dir;
              if(this.state.sort.by === 'dimensions') {
                dir = (dir === utility.ASCENDING) ? utility.DESCENDING : utility.ASCENDING
              }
              this.setState({
                sort:{
                  by:'dimensions',
                  dir:dir
                }
              });
            }}><FormattedMessage id="dimensions" defaultMessage="Dimensions" />&ensp;{(!utility.serverSideRendering) ? <Icon {...props} icon="sort" /> : undefined}</th>
            <th role="rowheader" scope="col" role="columnheader" onClick={(event) => {
              let dir = this.state.sort.dir;
              if(this.state.sort.by === 'fileSize') {
                dir = (dir === utility.ASCENDING) ? utility.DESCENDING : utility.ASCENDING
              }
              this.setState({
                sort:{
                  by:'fileSize',
                  dir:dir
                }
              });
            }}><FormattedMessage id="fileSize" defaultMessage="File Size" />&ensp;{(!utility.serverSideRendering) ? <Icon {...props} icon="sort" /> : undefined}</th>
            <th role="rowheader" scope="col" role="columnheader" onClick={(event) => {
                let dir = this.state.sort.dir;
                if(this.state.sort.by === 'editedOn') {
                  dir = (dir === utility.ASCENDING) ? utility.DESCENDING : utility.ASCENDING
                }
                this.setState({
                  sort:{
                    by:'editedOn',
                    dir:dir
                  }
                });
              }}><FormattedMessage id="editedOn" defaultMessage="Edited On" />&ensp;{(!utility.serverSideRendering) ? <Icon {...props} icon="sort" /> : undefined}</th>
          </tr>
        </thead>
        <EurekaTableTbody {...props} intl={props.intl} filter={props.view.filter} content={props.content} sort={this.state.sort} />
      </table>
    );

    return props.config.allowUploads && !utility.serverSideRendering ? (
      <Dropzone onDrop={this.onDrop.bind(this)} disableClick={true} style={{}}>
        {table}
        {html5ContextMenus}
      </Dropzone>
    ) : (
      <div>
        {table}
        {html5ContextMenus}
      </div>
    );
  }
}

export default EurekaTable;
