import React, { Component } from 'react';

import MediaRow from './MediaRow';
import ContextMenu from './ContextMenu';

import store from '../model/store';
import actions from '../model/actions';

function NoResults(props) {
  return (props.view.filter) ? (
    <tr>
      <td colSpan="5">
        <div>
          <p className="eureka__notice" aria-live="assertive">
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
        </div>
      </td>
    </tr>
  ) : (
    <tr>
      <td colSpan="5">
        <div>
          <p className="eureka__notice" aria-live="assertive">
            Directory "{props.content.cd}" appears to be empty.<br />Perhaps you'd like to <a href="#eureka__upload-form" onClick={(event) => {
              event.preventDefault();
              //document.getElementById('eureka__upload-form').focus();
              document.getElementById('eureka__upload-form').click();
            }}>upload some files</a>?
          </p>
        </div>
      </td>
    </tr>
  );
}

class EurekaTableTbody extends Component {
  render () {
    const props = this.props;
    
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
    
    if(props.view.filter) {
      contents = contents.filter((value) => (
        value.filename.includes(props.view.filter)
      ));
    }
    
    const contentList = (contents.length) ? contents.map((item, index) => (
      [
        <MediaRow item={item} key={index} onFocus={(event) => {     
            store.dispatch(actions.updateView({
              focusedMediaItem:item
            }));
          }}
          onBlur={(event) => {
              
          }}
           />,
         <ContextMenu item={item} hidden={shouldHide(item)} key={`cm__${index}`} />
      ]
    )) : (
      <NoResults {...props} />
    );
    
    
    return (
      <tbody aria-live="polite">
        {contentList}
      </tbody>
    );
  }
}

export default EurekaTableTbody;

