import React from 'react';

import path from 'path';

import { FormattedMessage } from 'react-intl';
import definedMessages from '../i18n/definedMessages';

import utility from '../utility/utility';

import store from '../model/store';
import actions from '../model/actions';

const SortContents = (props) => {
  const { formatMessage, formatDate } = props.intl;
  const optionNameMessage = 'Name',
  optionDimensionsMessage = 'Dimensions',
  optionFilesizeMessage = 'File Size',
  optionEditedOnMessage = 'Edited On';

  //console.log('props.sort', props.sort);


  return (
    <form className="eureka__sort-select">
      <label htmlFor="eureka__sort-select">
        <FormattedMessage id="sortBy" defaultMessage="Sort by" />:
      </label>
      <select value={props.sort.by} name="eureka__sort-select" id="eureka__sort-select" onChange={(event) => {
        store.dispatch(actions.updateView({
          sort: Object.assign({}, props.view.sort, {
            by: event.target.value
          })
        }))
      }}>
        <option value="filename">
          {optionNameMessage}
        </option>
        <option value="dimensions">
          {optionDimensionsMessage}
        </option>
        <option value="fileSize">
          {optionFilesizeMessage}
        </option>
        <option value="editedOn">
          {optionEditedOnMessage}
        </option>
      </select>
      <label htmlFor="eureka__sort-direction">Sort Direction:</label>
      <select value={props.sort.dir} name="eureka__sort-direction" id="eureka__sort-direction" onChange={(event) => {
        store.dispatch(actions.updateView({
          sort: Object.assign({}, props.view.sort, {
            dir: event.target.value
          })
        }))
      }}>
        <option checked={props.sort.dir == utility.ASCENDING} value={utility.ASCENDING}>Ascending</option>
        <option checked={props.sort.dir == utility.DESCENDING} value={utility.DESCENDING}>Descending</option>
      </select>
    </form>
  )
};

export default SortContents;
