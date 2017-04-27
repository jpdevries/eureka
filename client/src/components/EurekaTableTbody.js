import React, { PureComponent } from 'react';

import MediaRow from './MediaRow';
import ContextMenu from './ContextMenu';

import store from '../model/store';
import actions from '../model/actions';

import filesize from 'filesize';

import classNames from 'classnames';

import utility from '../utility/utility';

import Icon from './Icon';

import { FormattedMessage } from 'react-intl';
import definedMessages from '../i18n/definedMessages';

class EurekaTableTbody extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      focusedMediaItem: undefined,
      filter: undefined
    };

    //this.handleResize = this.handleResizeEvent.bind(this);
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

  /*componentDidMount() {
    //console.log('EurekaTableTbody componentDidMount');
    store.dispatch(actions.updateView({
      isTableScrolling: this.isScrollable(this.tbody)
    }));
  }*/

  /*isScrollable(el) {
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
    const isScrollable = this.isScrollable(this.tbody);
    if(isScrollable === store.getState().view.isTableScrolling) return;
    store.dispatch(actions.updateView({
      isTableScrolling:isScrollable
    }));
  }*/

  handleRenameStart(item) {
    console.log('handleRenameStart', item);
  }

  /*handleScroll(event) {
    const isScrollable = this.isScrollable(this.tbody);
    if(isScrollable === store.getState().view.isTableScrolling) return;
    store.dispatch(actions.updateView({
      isTableScrolling: isScrollable
    }));
  }*/

  /*shouldComponentUpdate(nextProps, nextState) {
    return true;
    console.log('EurekaTableTbody shouldComponentUpdate');
    if(nextProps.view.filter || (!nextProps.view.filter && this.props.view.filter)) return true;
    try {
      console.log('shouldComponentUpdate', (this.state.focusedMediaItem.path !== nextProps.view.focusedMediaItem.path), this.state.focusedMediaItem.path, nextProps.view.focusedMediaItem.path);
      //if((this.state.focusedMediaItem.path !== nextProps.view.focusedMediaItem.path)) return true; // #janky SLOOOOW
    } catch (e) {}
    console.log(this.props.contents[0], nextProps.contents[0]);
    return !(this.props.contents === nextProps.contents);
  }*/

  render () {
    //console.log('rendering EurekaTableTbody');
    const props = this.props,
    state = this.state;

    function shouldHide(item) {

      try {
        //console.log('shouldHide',props.view.focusedMediaItem.path,item.path,props.view.focusedMediaItem.path !== item.path);
        return props.view.focusedMediaItem.path !== item.path
      } catch(e) {
        //console.log('shouldHide',true);
        return true;
      }
    }

    let contents = props.contents;

    if(props.filter) { // filter based on filename, dimensions, date
      const filter = props.view.filter.toLowerCase();
      contents = contents.filter((value) => {
        const editedOnDate = new Date(value.editedOn);
        //console.log('value', value);
        //return value.filename.toLowerCase().includes(filter);
        return (
          value.filename.toLowerCase().includes(filter) || value.dimensions.join('x').toLowerCase().includes(filter) || value.localString.toLowerCase().includes(filter) || value.localStringVerbose.toLowerCase().includes(filter) || value.fileSizeHumanReadable.toLowerCase().includes(filter) || value.fileSizeHumanReadable.toLowerCase().replace(/ +?/g, '').includes(filter)
        )
      });
    }

    /*const sortContents = true;
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
    });*/

    const contentList = (contents.length) ? contents.map((item, index) => (
      [
        <MediaRow {...props} intl={props.intl} focusedMediaItem={props.view.focusedMediaItem} renameStart={this.handleRenameStart} item={item} index={index} key={index} onFocus={(event) => {

            /*this.setState({
              focusedMediaItem: item
            })*/
            store.dispatch(actions.updateView({
              focusedMediaItem: item
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
      <tbody role="rowgroup" aria-live="polite" className={classNames({empty:!contents.length})} ref={(tbody) => { this.tbody = tbody }} >
        {contentList}
      </tbody>
    );
  }
}

function NoResults(props) {
  const searchTryAnother = (
    <FormattedMessage id="search.tryAnother" defaultMessage="Try another search" />
  );

  if(props.view.fetchingContents) {
    return (
      <tr role="row">
        <td role="presentation" colSpan="5" className="comfortable">
          <p className="alert-info eureka__notice" aria-live="assertive">
            <span className="spinner"><Icon {...props} icon="circle-o-notch" /></span><br />
            <FormattedMessage id="contents.fetchingContents" defaultMessage="Hold tight while we fetch {cd}" values={{
              cd: props.content.cd
            }} />
          </p>
        </td>
      </tr>
    );
  }

  return (props.view.filter) ? (
    <tr role="row">
      <td role="presentation" colSpan="5" className="comfortable">
        <p className="alert-info eureka__notice" aria-live="assertive">
          <FormattedMessage id="search.noResults" defaultMessage='Uh oh. No results found for "{filter}"' values={{
            filter: props.view.filter
          }} />. <a href="#eureka__filter" onClick={(event) => {
            event.preventDefault();
            document.getElementById('eureka__filter').focus();
          }}>{searchTryAnother}</a> <FormattedMessage id="grammar.or" defaultMessage="or" /> <a href="#eureka__filter" onClick={(event) => {
            event.preventDefault();
            store.dispatch(actions.updateView({
              filter:undefined
            }));
            document.getElementById('eureka__filter').value = '';
          }}><FormattedMessage id="search.clearFilter" defaultMessage="clear the search&nbsp;filter" /></a>.
        </p>
      </td>
    </tr>
  ) : (
    <tr role="row">
      <td role="presentation" colSpan="5" className="comfortable">
        <p className="alert-info eureka__notice" aria-live="assertive">
          <FormattedMessage id="directory.appearsToBeEmpty" defaultMessage='Directory "{cd}" appears to be empty.' values={{
            cd: props.content.cd
          }} /><br /><FormattedMessage id="perhapsYouWouldLikeTo" defaultMessage="Perhaps you'd like to" /> <a href="#eureka__upload-form" onClick={(event) => {
            event.preventDefault();
            //document.getElementById('eureka__upload-form').focus();

            try { // wont work if the sidebar is closed
              document.getElementById('eureka__upload-form').click();
            } catch (e) {
              document.querySelector('.eureka__drop-area-zone').click();
            }
          }}><FormattedMessage id="upload.someFiles" defaultMessage="upload some files" /><span className="visually-hidden"> <FormattedMessage id="grammar.to" defaultMessage="to" /> {props.content.cd}</span></a>?
        </p>
      </td>
    </tr>
  );
}

export default EurekaTableTbody;
