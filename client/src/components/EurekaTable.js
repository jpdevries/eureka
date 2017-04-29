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
      contents: (() => {
        try {
          return this.sortContents(props.content.contents, props.view)
        } catch(e) {}
        return []
      })(),
      sort: Object.assign({}, {
        by: 'filename',
        dir: utility.ASCENDING,
        renamingItem: undefined
      }, props.sort)
    };
    this.decoratedActions = props.decoratedActions ? Object.assign({}, actions, props.decoratedActions) : actions;
    //console.log('EurekaTable constructor', props, this.state);
  }

  /*componentShouldUpdate(nextProps, nextState) {
    if(this.state !== nextState) return true;
    if(this.props !== nextProps) return true;
    //console.log('EurekaTable should not update');
    return false;
  }*/

  sortContents(contents = this.state.contents, state = this.props.view) {
    //console.log('sorting contents', contents, state.sort);
    //return contents;
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

        case 'fileSize':
        n = (a.fileSize < b.fileSize) ? 1 : -1;
        break;

        default:
        //console.log(a[state.sort.by], b[state.sort.by], a[state.sort.by] > b[state.sort.by]);
        n = (a[state.sort.by] < b[state.sort.by]) ? 1 : -1;
        break;
      }

      return (state.sort.dir === utility.DESCENDING) ? n : 0-n;
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
    if(nextProps.view.chooseMultiple !== this.props.view.chooseMultiple) return true;

    if(nextProps.view.sort !== this.props.view.sort) return true;
    return true;
    //console.log('EurekaTable should not update');
    return false;
  }

  componentWillUpdate(nextProps, nextState) {
    //console.log('EurekaTable componentWillUpdate');
    //console.log('nextProps.sort', nextProps.sort);
    //console.log('nextState.sort', nextState.sort);
    //console.log('this.props.sort', this.props.sort);
    //console.log('nextState.sort', nextState.sort);

    /*if(nextProps.sort !== nextState.sort) {
      console.log('nextProps.sort !== nextState.sort');
      this.setState({
        sort: nextProps.sort,
        //contents: this.sortContents(nextProps.content.contents, nextState)
      });
      return;
    }*/

    if(this.props.view.sort !== nextProps.view.sort || this.props.content.cd !== nextProps.content.cd) {
      //console.log('this.props.view.sort !== nextProps.view.sort || this.props.content.cd !== nextProps.content.cd');
      this.setState({
        contents: this.sortContents(nextProps.content.contents, nextProps.view)
      })
    } else if(nextProps.content.contents !== this.props.content.contents) {
      //console.log('nextProps.content.contents !== this.state.contents');
      this.setState({
        contents: (nextProps.view.filter) ? nextProps.content.contents : this.sortContents(nextProps.content.contents, nextProps.view)
      })
    }
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

    //console.log('render EurekaTable');

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

    const selectHead = (utility.serverSideRendering) ? <th scope="col" role="columnheader">Select</th> : undefined;
    const checkboxHead = (!utility.serverSideRendering && props.view.chooseMultiple) ? <th scope="col" role="columnheader" className="eureka__choose"><span className="visually-hidden"><FormattedMessage id="choose" defaultMessage="Choose" /></span></th> : undefined;

    const table = (
      <table className="eureka__table" cellSpacing="0" cellPadding="0" role="grid">
        <thead hidden={!props.content.contents.length} className={classNames((store.getState().view.isTableScrolling) ? 'eureka__tbody-scrolling' : undefined)}>
          <tr>
            {selectHead}
            {checkboxHead}
            <th role="rowheader" scope="col" role="columnheader" className="eureka__th-media"><FormattedMessage id="media" defaultMessage="Media" /></th>
            <th className="eureka__th-filename" aria-sort={props.view.sort.by === 'filename' ? props.view.sort.dir : undefined} role="rowheader" scope="col" role="columnheader" onClick={(event) => {
              let dir = this.props.view.sort.dir;
              //console.log("this.state.sort.by === 'filename'", this.state.sort.by === 'filename', dir);
              if(this.props.view.sort.by === 'filename') {
                dir = (dir === utility.ASCENDING) ? utility.DESCENDING : utility.ASCENDING
              }
              //console.log('dir',dir);
              store.dispatch(actions.updateView({
                sort: {
                  by: 'filename',
                  dir: dir
                }
              }));
              /*this.setState({
                sort:{
                  by:'filename',
                  dir: dir
                }
              });
              this.props.handleSort({
                by: 'filename',
                dir: dir
              });*/
            }}><FormattedMessage id="name" defaultMessage="Name" />&ensp;{(!utility.serverSideRendering) ? <Icon {...props}  icon="sort" /> : undefined}</th>
            <th role="rowheader" scope="col" role="columnheader" className="visually-hidden eureka__th-actions">Actions</th>
            <th className="eureka__th-dimensions" aria-sort={props.view.sort.by === 'dimensions' ? props.view.sort.dir : undefined} role="rowheader" scope="col" role="columnheader" onClick={(event) => {
              let dir = this.state.sort.dir;
              if(this.props.view.sort.by === 'dimensions') {
                dir = (dir === utility.ASCENDING) ? utility.DESCENDING : utility.ASCENDING
              }
              store.dispatch(actions.updateView({
                sort:{
                  by:'dimensions',
                  dir: dir
                }
              }));
              /*this.setState({
                sort:{
                  by:'dimensions',
                  dir: dir
                }
              });
              this.props.handleSort({
                by: 'dimensions',
                dir: dir
              });*/
            }}><FormattedMessage id="dimensions" defaultMessage="Dimensions" />&ensp;{(!utility.serverSideRendering) ? <Icon {...props} icon="sort" /> : undefined}</th>
            <th className="eureka__th-file-size" aria-sort={props.view.sort.by === 'fileSize' ? props.view.sort.dir : undefined} role="rowheader" scope="col" role="columnheader" onClick={(event) => {
              let dir = this.state.sort.dir;
              if(this.props.view.sort.by === 'fileSize') {
                dir = (dir === utility.ASCENDING) ? utility.DESCENDING : utility.ASCENDING
              }
              store.dispatch(actions.updateView({
                sort:{
                  by:'fileSize',
                  dir: dir
                }
              }));
              /*this.setState({
                sort:{
                  by:'fileSize',
                  dir:dir
                }
              });
              this.props.handleSort({
                by: 'fileSize',
                dir: dir
              });*/
            }}><FormattedMessage id="fileSize" defaultMessage="File Size" />&ensp;{(!utility.serverSideRendering) ? <Icon {...props} icon="sort" /> : undefined}</th>
            <th className="eureka__th-edited-on" aria-sort={props.view.sort.by === 'editedOn' ? props.view.sort.dir : undefined} role="rowheader" scope="col" role="columnheader" onClick={(event) => {
                let dir = this.state.sort.dir;
                if(this.props.view.sort.by === 'editedOn') {
                  dir = (dir === utility.ASCENDING) ? utility.DESCENDING : utility.ASCENDING
                }
                store.dispatch(actions.updateView({
                  sort:{
                    by:'editedOn',
                    dir: dir
                  }
                }));
                /*this.setState({
                  sort:{
                    by:'editedOn',
                    dir:dir
                  }
                });
                this.props.handleSort({
                  by: 'editedOn',
                  dir: dir
                });*/
              }}><FormattedMessage id="editedOn" defaultMessage="Edited On" />&ensp;{(!utility.serverSideRendering) ? <Icon {...props} icon="sort" /> : undefined}</th>
          </tr>
        </thead>
        <EurekaTableTbody {...props} intl={props.intl} filter={props.view.filter} content={props.content} contents={state.contents} sort={this.props.sort} />
      </table>
    );

    const dz = (props.config.doDragNDrop) ? (
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

    return props.config.allowUploads && !utility.serverSideRendering ? (
      dz
    ) : (
      <div>
        {table}
      </div>
    );
  }
}

export default EurekaTable;
