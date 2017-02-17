import React, { Component } from 'react';

import EurekaTableTbody from './EurekaTableTbody';

class EurekaTable extends Component {
  render () {
    const props = this.props;
    
    return (
      <table className="eureka__table">
        <thead>
          <tr>
            <th>Media</th>
            <th>Name</th>
            <th>Dimensions</th>
            <th>File Size</th>
            <th>Edited On</th>
          </tr>
        </thead>
        <EurekaTableTbody {...props} />
      </table>
    );
  }
}

export default EurekaTable;

