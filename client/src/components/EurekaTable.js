import React, { Component } from 'react';

import store from '../model/store';
import actions from '../model/actions';

import EurekaTableTbody from './EurekaTableTbody';

import classNames from 'classnames';

import Dropzone from 'react-dropzone';

import Icon from './Icon';

import utility from '../utility/utility';

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
  }

  onDrop(files) {
    const props = this.props;
    //console.log('Received files: ', files);

    const formData = new FormData();

    files.forEach((file) => {
      formData.append('eureka__uploadFiles', file, file.name);
    });

    store.dispatch(actions.uploadFiles(props.source.currentSource, props.content.cd, formData));
  }

  render () {
    const props = this.props,
    state = this.state;

    const html5ContextMenus = (props.content.contents.length) ? props.content.contents.map((item, index) => (
      <menu key={index} hidden="true" type="context" id={`context_menu__tbody-${index}`}>
          <menuitem label={`Expand ${item.filename}`}></menuitem>
          <menuitem label={`Choose ${item.filename}`}></menuitem>
          <menuitem label={`Rename ${item.filename}`}></menuitem>
          <menuitem label={`Delete ${item.filename}`} onClick={(event) => {
              store.dispatch(actions.deleteMediaItem(props.source.currentSource, item.absolutePath));
            }}></menuitem>
      </menu>
    )) : undefined;

    return (
      <Dropzone onDrop={this.onDrop.bind(this)} disableClick={true} style={{}}>
        <table className="eureka__table" cellSpacing="0" cellPadding="0">
          <thead hidden={!props.content.contents.length} className={classNames((store.getState().view.isTableScrolling) ? 'eureka__tbody-scrolling' : undefined)}>
            <tr>
              <th>Media</th>
              <th onClick={(event) => {
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
                }}>Name&ensp;<Icon icon="sort" /></th>
              <th className="visually-hidden">Actions</th>
              <th onClick={(event) => {
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
                }}>Dimensions&ensp;<Icon icon="sort" /></th>
              <th onClick={(event) => {
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
                }}>File Size&ensp;<Icon icon="sort" /></th>
              <th onClick={(event) => {
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
                }}>Edited On&ensp;<Icon icon="sort" /></th>
            </tr>
          </thead>
          <EurekaTableTbody {...props} sort={this.state.sort} />
        </table>
        {html5ContextMenus}
      </Dropzone>
    );
  }
}

export default EurekaTable;
