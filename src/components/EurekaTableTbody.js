import React, { Component } from 'react';

import MediaRow from './MediaRow';
import ContextMenu from './ContextMenu';

import store from '../model/store';
import actions from '../model/actions';

import filesize from 'filesize';

import classNames from 'classnames';

import utility from '../utility/utility';

class EurekaTableTbody extends Component {
  constructor(props) {
    super(props);

    this.handleResize = this.handleResizeEvent.bind(this);
  }

  componentWillMount() {
    try {
      window.addEventListener("resize", this.handleResize, false);
    } catch (e) { }
  }

  componentWillUnmount() {
    try {
      window.removeEventListener("resize", this.handleResize, false);
    } catch (e) { }
  }

  componentDidMount() {
    store.dispatch(actions.updateView({
      isTableScrolling:this.isScrollable(this.tbody)
    }));
  }

  isScrollable(el) {
    const y1 = el.scrollTop;
    el.scrollTop+=1;
    const y2 = el.scrollTop;
    el.scrollTop-=1;
    const y3 = el.scrollTop;
    el.scrollTop = y1;
    const x1 = el.scrollLeft;
    el.scrollTop+=1;
    const x2 = el.scrollLeft;
    el.scrollTop-=1;
    const x3 = el.scrollLeft;
    el.scrollLeft = x1;
    return !(y1 === y2 && y2 === y3 && x1 === x2 && x2 === x3);
}

  handleResizeEvent(event) {
    //console.log('handleResize',this,event);
    //console.log(this.isScrollable(this.tbody));
    const isScrollable = this.isScrollable(this.tbody);
    if(isScrollable === store.getState().view.isTableScrolling) return;
    store.dispatch(actions.updateView({
      isTableScrolling:isScrollable
    }));
  }

  handleRenameStart(item) {
    console.log('handleRenameStart', item);
  }

  handleScroll(event) {
    //console.log('handleScroll', event);
    const isScrollable = this.isScrollable(this.tbody);
    if(isScrollable === store.getState().view.isTableScrolling) return;
    store.dispatch(actions.updateView({
      isTableScrolling:isScrollable
    }));
  }

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

    if(props.view.filter) { // filter based on filename, dimensions, date
      const filter = props.view.filter.toLowerCase();
      contents = contents.filter((value) => (
        value.filename.toLowerCase().includes(filter) || value.dimensions.join('x').toLowerCase().includes(filter) || new Date(value.editedOn).toLocaleString().toLowerCase().includes(filter) || new Date(value.editedOn).toLocaleString(undefined,{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }).toLowerCase().includes(filter) || filesize(value.fileSize, {round: 0}).toLowerCase().includes(filter) || filesize(value.fileSize, {round: 0}).toLowerCase().replace(/ +?/g, '').includes(filter)
      ));
    }

    contents = contents.sort((a,b) => {
      if(a[props.sort.by] === b[props.sort.by]) return 0;

      let n;

      //console.log('props.sort.by',props.sort.by,a,b);

      switch(props.sort.by) {
        case 'dimensions':
        n = a.dimensions[0] * a.dimensions[1] > b.dimensions[0] * b.dimensions[1] ? 1 : -1;
        break;

        case 'editedOn':
        n = new Date(a.editedOn).getTime() > new Date(b.editedOn).getTime() ? 1 : -1;
        break;

        default:
        n = (a[props.sort.by] > b[props.sort.by]) ? 1 : -1;
        break;
      }

      return (props.sort.dir === utility.ASCENDING) ? n : 0-n;
    });

    const contentList = (contents.length) ? contents.map((item, index) => (
      [
        <MediaRow {...props} renameStart={this.handleRenameStart} item={item} index={index} key={index} onFocus={(event) => {
            store.dispatch(actions.updateView({
              focusedMediaItem:item
            }));
          }}
          onBlur={(event) => {

          }}
           />
      ]
    )) : (
      <NoResults {...props} />
    );

    return (
      //onScroll={this.handleScroll.bind(this)}
      <tbody aria-live="polite" className={classNames({empty:!contents.length})} ref={(tbody) => { this.tbody = tbody }} >
        {contentList}
      </tbody>
    );
  }
}

function NoResults(props) {
  return (props.view.filter) ? (
    <tr role="row">
      <td role="presentation" colSpan="5" className="comfortable">
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
      <td role="presentation" colSpan="5" className="comfortable">
        <p className="alert-info eureka__notice" aria-live="assertive">
          Directory "{props.content.cd}" appears to be empty.<br />Perhaps you'd like to <a href="#eureka__upload-form" onClick={(event) => {
            event.preventDefault();
            //document.getElementById('eureka__upload-form').focus();

            try { // wont work if the sidebar is closed
              document.getElementById('eureka__upload-form').click();
            } catch (e) {
              document.querySelector('.eureka__drop-area-zone').click();
            }
          }}>upload some files<span className="visually-hidden"> to {props.content.cd}</span></a>?
        </p>
      </td>
    </tr>
  );
}

export default EurekaTableTbody;
