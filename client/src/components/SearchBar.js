import React, { Component } from 'react';

import store from '../model/store';
import actions from '../model/actions';

import utility from '../utility/utility';

import filesize from 'filesize';

import { FormattedMessage } from 'react-intl';
import definedMessages from '../i18n/definedMessages';

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      placeholderField:'filename',
      lastDir:'/'
    };
    if(!utility.serverSideRendering && this.props.view.intervals.searchBarPlaceholder) {
      setInterval(() => {
        this.pickRandomField();
      }, this.props.view.intervals.searchBarPlaceholder);
    }
  }

  componentDidMount() {
    //console.log('componentDidMount');
    this.pickRandomField();


    /*store.subscribe(() => {
      if(this.state.lastDir !== store.getState().content.cd) this.pickRandomField();

      this.setState({
        lastDir:store.getState().content.cd
      })
    });*/
  }

  pickRandomField() {
    const random = Math.random();
    const cases = ['filename','dimensions','editedOn','fileSize'];
    this.setState({
      placeholderField:cases[Math.round(Math.random() * (cases.length - 1))]
    });
  }

  render() {
    const props = this.props;

    const formatMessage = props.intl.formatMessage;

    const options = [
      <option key="0">FileSystem</option>
    ];

    const placeholder = (() => {
      if(!props.content.contents.length) return "";

      const randomItem = props.content.contents[Math.round(Math.random() * (props.content.contents.length - 1))];

      switch(this.state.placeholderField) {
        case 'filename':
        return randomItem.filename;

        case 'dimensions':
        return randomItem.dimensions.join('x');

        case 'editedOn':
        return (Math.random() < .5) ? new Date(randomItem.editedOn).toLocaleString() : new Date(randomItem.editedOn).toLocaleString(undefined,{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });

        case 'fileSize':
        return filesize(randomItem.fileSize, {round: 0});
      }
    })();

    const list = (
      <datalist id={`${props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__' }__datalist`}>
        {props.content.contents.map((item) => (
          <option key={item.filename} value={item.filename}></option>
        ))}
      </datalist>
    );

    const filterTitle = formatMessage(definedMessages.filterContentsOfBy, {
      cd: props.content.cd
    });

    const contentsOfBy = formatMessage(definedMessages.contentsOfBy, {
      cd: props.content.cd
    });

    const filterMessage = <FormattedMessage id="filter" defaultMessage="Filter" />;

    return (!utility.serverSideRendering) ? (
      <form role="search" className="eureka__search-bar">
      <label htmlFor="eureka__filter" title={filterTitle}>{filterMessage}<span className="visually-hidden"> {contentsOfBy}</span>:&ensp;</label>
      <input list={`${props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__' }__datalist`} type="text" name="eureka__filter" id="eureka__filter" placeholder={placeholder} value={props.view.filter} onChange={(event) => {
          store.dispatch(actions.updateView({
            filter:event.target.value || undefined
          }))
        }} />
        {list}
      </form>
    ) : (
      <div className="eureka__search-bar">
      <label htmlFor="eureka__filter" title={filterTitle}>{filterMessage}<span className="visually-hidden"> {contentsOfBy}</span>:&ensp;</label>
      <input list={`${props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__' }__datalist`} type="text" name="eureka__filter" id="eureka__filter" placeholder={placeholder} value={props.view.filter} onChange={(event) => {
          store.dispatch(actions.updateView({
            filter:event.target.value || undefined
          }))
        }} />
        {list}
      </div>
    );

  }
}

export default SearchBar;
