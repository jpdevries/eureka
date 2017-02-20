import React from 'react';

const Icon = (props) => {
  return (
    <svg aria-hidden={props.ariaHidden === undefined ? true : props.ariaHidden} className={`icon icon-${props.icon}`}>
      <use xlinkHref={`assets/img/icons.svg#icon-${props.icon}`}></use>
    </svg>
  )
};

export default Icon;