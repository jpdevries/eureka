import React from 'react';

import store from '../model/store';
import actions from '../model/actions';

const SearchBar = (props) => {
  const options = [
    <option key="0">FileSystem</option>
  ];
  
  return (
    <form className="eureka__search-bar">
      <label htmlFor="eureka__filter">Filter<span className="visually-hidden"> contents of {props.content.cd}</span>:&ensp;</label>
      <input type="text" name="eureka__filter" id="eureka__filter" placeholder="waldo.jpg" value={props.view.filter} onChange={(event) => {
          store.dispatch(actions.updateView({
            filter:event.target.value || undefined
          }))
        }} />
    </form>
  );
}

export default SearchBar;

