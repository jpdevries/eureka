import React from 'react';

import path from 'path';

const Icon = (props) => {
  const config = Object.assign({}, {
    assetsBasePath:'./assets/',
    iconSVG:'./img/icons.svg'
  }, props.config);
  return (
    <svg aria-hidden={props.ariaHidden === undefined ? true : props.ariaHidden} className={`icon icon-${props.icon}`}>
      <use xlinkHref={`${path.join(config.assetsBasePath, config.iconSVG)}#icon-${props.icon}`}></use>
    </svg>
  )
};

export default Icon;
