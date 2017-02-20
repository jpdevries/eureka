import React, { Component } from 'react';

import MediaRow from './MediaRow';
import ContextMenu from './ContextMenu';

import store from '../model/store';
import actions from '../model/actions';

import filesize from 'filesize';

import classNames from 'classnames';

const ASCENDING = 'ascending';
const DESCENDING = 'descending';

class EurekaTableTbody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sort: {
        by: 'filename',
        dir: ASCENDING,
        renamingItem: undefined
      }
    };
  }
  
  handleRenameStart(item) {
    console.log('handleRenameStart', item);
  }
  
  render () {
    const props = this.props,
    state = this.state;
    
    function shouldHide(item) {
      
      try {
        //console.log('shouldHide',props.view.focusedMediaItem.absolutePath,item.absolutePath,props.view.focusedMediaItem.absolutePath !== item.absolutePath);
        return props.view.focusedMediaItem.absolutePath !== item.absolutePath
      } catch(e) {
        //console.log('shouldHide',true);
        return true;
      }
    }
    
    let contents = props.content.contents;
    
    if(props.view.filter) { // filter based on filename, dimensions, date
      const filter = props.view.filter.toLowerCase();
      contents = contents.filter((value) => (
        value.filename.toLowerCase().includes(filter) || value.dimensions.join('x').toLowerCase().includes(filter) || new Date(value.editedOn).toLocaleString().toLowerCase().includes(filter) || new Date(value.editedOn).toLocaleString(undefined,{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }).toLowerCase().includes(filter) || filesize(value.fileSize, {round: 0}).toLowerCase().includes(filter) || filesize(value.fileSize, {round: 0}).toLowerCase().replace(/ +?/g, '').includes(filter)
      ));
    }
    
    contents = contents.sort((a, b) => {
      if(a[state.sort.by] === b[state.sort.by]) return 0;
      
      let n;
      
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

      return (state.sort.dir === ASCENDING) ? n : 0-n;
    });

    const contentList = (contents.length) ? contents.map((item, index) => (
      [
        <MediaRow {...props} item={item} index={index} key={index} onFocus={(event) => {     
            store.dispatch(actions.updateView({
              focusedMediaItem:item
            }));
          }}
          onBlur={(event) => {
              
          }}
           />,
         <ContextMenu {...props} item={item} renameStart={this.handleRenameStart} hidden={shouldHide(item)} key={`cm__${index}`} />
      ]
    )) : (
      <NoResults {...props} />
    );
    
    return (
      <tbody aria-live="polite" className={classNames({empty:!contents.length})}>
        {contentList}
      </tbody>
    );
  }
}

function NoResults(props) {
  return (props.view.filter) ? (
    <tr>
      <td colSpan="5" className="comfortable">
        <p className="alert-info eureka__notice" aria-live="assertive">
          Uh oh. No results found for "{props.view.filter}". <a href="#eureka__filter" onClick={(event) => {
            event.preventDefault();
            document.getElementById('eureka__filter').focus();
          }}>Try another search</a> or <a href="#eureka__filter" onClick={(event) => {
            event.preventDefault();
            store.dispatch(actions.updateView({
              filter:undefined
            }));
            document.getElementById('eureka__filter').value = '';
          }}>clear the search&nbsp;filter</a>.
        </p>
      </td>
    </tr>
  ) : (
    <tr>
      <td colSpan="5" className="comfortable">
        <p className="alert-info eureka__notice" aria-live="assertive">
          Directory "{props.content.cd}" appears to be empty.<br />Perhaps you'd like to <a href="#eureka__upload-form" onClick={(event) => {
            event.preventDefault();
            //document.getElementById('eureka__upload-form').focus();
            
            try { // wont work if the sidebar is closed
              document.getElementById('eureka__upload-form').click();  
            } catch (e) {
              document.querySelector('.eureka__drop-area-zone').click();
            } 
          }}>upload some files</a>?
        </p>
      </td>
    </tr>
  );
}

export default EurekaTableTbody;

