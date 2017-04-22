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
      contents: [],
      sort: {
        by: 'filename',
        dir: utility.ASCENDING,
        renamingItem: undefined
      }
    };
    this.decoratedActions = props.decoratedActions ? Object.assign({}, actions, props.decoratedActions) : actions;
  }

  /*componentShouldUpdate(nextProps, nextState) {
    if(this.state !== nextState) return true;
    if(this.props !== nextProps) return true;
    //console.log('EurekaTable should not update');
    return false;
  }*/

  sortContents(contents = this.state.contents, state = this.state) {
    //console.log('sorting contents', state.sort);
    return contents.sort((a,b) => {
      if(a[state.sort.by] === b[state.sort.by]) return 0;

      let n;

      //console.log('props.sort.by',props.sort.by,a,b);

      switch(state.sort.by) {
        case 'dimensions':
        n = a.dimensions[0] * a.dimensions[1] > b.dimensions[0] * b.dimensions[1] ? 1 : -1;
        break;

        case 'editedOn':
        n = new Date(a.editedOn).getTime() > new Date(b.editedOn).getTime() ? 1 : -1;
        break;

        default:
        n = (a[state.sort.by] > b[state.sort.by]) ? 1 : -1;
        break;
      }

      return (state.sort.dir === utility.ASCENDING) ? n : 0-n;
    });
  }

  componentDidMount() {
    //console.log('EurekaTable componentDidMount');
    this.setState({
      contents: this.sortContents(this.props.content.contents)
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps.view.filter) return true;
    if(this.state.sort !== nextState.sort) return true;
    if(nextProps.content.contents !== this.state.contents) return true;
    if((this.state.contents.length !== nextState.contents.length) || (this.state.contents !== nextState.contents)) return true;

    return false;
  }

  componentWillUpdate(nextProps, nextState) {
    //console.log(this.props, this.state);
    if(this.state.sort !== nextState.sort) {
      this.setState({
        contents: this.sortContents(nextProps.content.contents, nextState)
      })
    } else if(nextProps.content.contents !== this.state.contents) this.setState({
      contents: nextProps.content.contents
    })
  }

  onDrop(files) {
    const props = this.props;
    //console.log('Received files: ', files);

    const formData = new FormData();

    const decoratedActions = this.decoratedActions;

    files.forEach((file) => {
      formData.append('eureka__uploadFiles', file, file.name);
    });

    store.dispatch(actions.updateView({
      isUploading: true
    }));

    store.dispatch(decoratedActions.uploadFiles(props.source.currentSource, props.content.cd, formData, props.config.headers));
  }

  render () {
    const props = this.props,
    state = this.state,
    formatMessage = props.intl.formatMessage;

    const decoratedActions = this.decoratedActions;

    const html5ContextMenus = (props.content.contents.length) ? props.content.contents.map((item, index) => {
      const chooseMenuItem = (props.config.allowChoose) ? (
        <menuitem label={formatMessage(definedMessages.chooseItem, {
          filename: item.filename
        })} onClick={(event) => { // #janky
            document.getElementById(`choose__${utility.cssSafe(item.filename)}`).click();
          }}></menuitem>
      ) : undefined,
      downloadMenuItem = (props.config.allowDownload) ? (
        <menuitem label={formatMessage(definedMessages.downloadItem, {
          filename: item.filename
        })} onClick={(event) => { // #janky
            const a = document.createElement('a');
            a.setAttribute('download', item.filename);
            a.href = item.absoluteURL;
            a.classList.add('visually-hidden');
            document.body.appendChild(a);
            a.click();
            a.remove();
          }}></menuitem>
      ) : undefined;
      return (
        <menu key={index} hidden="true" type="context" id={`context_menu__tbody-${index}`}>
            <menuitem label={formatMessage(definedMessages.expandItem, {
              filename: item.filename
            })} onClick={(event) => {
                document.getElementById(`expand__${utility.cssSafe(item.filename)}`).click();
              }}></menuitem>
            {chooseMenuItem}
            <menuitem label={formatMessage(definedMessages.renameItem, {
              item: item.filename
            })} onClick={(event) => {
                document.getElementById(`${props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__' }rename__${utility.cssSafe(item.filename)}`).click()
              }}></menuitem>
            <menuitem label={formatMessage(definedMessages.deleteItem, {
              filename: item.filename
            })} onClick={(event) => {
                store.dispatch(decoratedActions.deleteMediaItem(props.source.currentSource, item.path, props.config.headers));
              }}></menuitem>
            {downloadMenuItem}
        </menu>
      )
    }) : undefined;

    const selectHead = utility.serverSideRendering ? <th scope="col" role="columnheader">Select</th> : undefined;

    const table = (
      <table className="eureka__table" cellSpacing="0" cellPadding="0" role="grid">
        <thead hidden={!props.content.contents.length} className={classNames((store.getState().view.isTableScrolling) ? 'eureka__tbody-scrolling' : undefined)}>
          <tr>
            {selectHead}
            <th role="rowheader" scope="col" role="columnheader"><FormattedMessage id="media" defaultMessage="Media" /></th>
            <th role="rowheader" scope="col" role="columnheader" onClick={(event) => {
              let dir = this.state.sort.dir;
              //console.log("this.state.sort.by === 'filename'", this.state.sort.by === 'filename', dir);
              if(this.state.sort.by === 'filename') {
                dir = (dir === utility.ASCENDING) ? utility.DESCENDING : utility.ASCENDING
              }
              //console.log('dir',dir);
              this.setState({
                sort:{
                  by:'filename',
                  dir: dir
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
                  dir: dir
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
        <EurekaTableTbody {...props} intl={props.intl} filter={props.view.filter} content={props.content} contents={state.contents} sort={this.state.sort} />
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
      </div>
    );
  }
}

export default EurekaTable;
