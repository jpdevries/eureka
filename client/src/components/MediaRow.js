import React from 'react';

const MediaRow = (props) => {
  
  return (
    <tr tabIndex="0" onFocus={props.onFocus.bind(this)}>
      <td>
        <img src={props.item.absoluteURL} alt=""/>
      </td>
      <td>
      {props.item.filename}
      </td>
      <td>
      {`${props.item.dimensions[0]}x${props.item.dimensions[1]}`}
      </td>
      <td>
      24kB
      </td>
      <td>
      Mar 10, 2016
      </td>
    </tr>
  );
}

export default MediaRow;

