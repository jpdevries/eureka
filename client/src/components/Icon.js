import React from 'react';

import path from 'path';

const Icon = (props) => {
  console.log(props);
  return (
    <svg aria-hidden={props.ariaHidden === undefined ? true : props.ariaHidden} className={`icon icon-${props.icon}`}>
      <use xlinkHref={`${path.join(props.config.assetsBasePath || './assets/', props.config.iconSVG || './img/icons.svg')}#icon-${props.icon}`}></use>
    </svg>
  )
};

export default Icon;
