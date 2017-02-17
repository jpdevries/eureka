import React, { Component } from 'react';
import MediaSourceSelector from './components/MediaSourceSelector';
import MediaDirectorySelector from './components/MediaDirectorySelector';
import TreeBar from './components/TreeBar';
import ChooseBar from './components/ChooseBar';
import SearchBar from './components/SearchBar';
import ViewChooser from './components/ViewChooser';
import EurekaTable from './components/EurekaTable';
import FileTree from './components/FileTree';
import UploadForm from './components/UploadForm';

import store from './model/store';
import actions from './model/actions';


class Eureka extends Component {
  componentDidMount() {
    console.log('componentDidMount');
    store.dispatch(actions.fetchMediaSources())
  }
  render() {
    const props = this.props;
    
    return (
      <div className={`eureka eureka__view-mode__${props.view.mode}`}>
        
        <div className="eureka__browse-content">
          <div className="eureka__pathbrowser">
            <MediaSourceSelector {...props} />
            <FileTree {...props} />
            <TreeBar {...props} />
            
            <MediaDirectorySelector {...props} />
            <UploadForm {...props} />
        
          </div>
          <div className="eureka__stage">
            <div className="eureka__stage__filter-view">
              <h2><span className="visually-hidden">Browse </span>Media Content</h2>
              
              <SearchBar {...props} />
              <ViewChooser {...props} />
            </div>
            <div className="eureka__table-wrapper">
              <EurekaTable {...props} />
            </div>
          </div>
        </div>
        <ChooseBar {...props} />
      </div>
    );
  }
}

export default Eureka;
