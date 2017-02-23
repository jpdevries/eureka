import React, { Component } from 'react';
import MediaSourceSelector from './components/MediaSourceSelector';
import MediaDirectorySelector from './components/MediaDirectorySelector';
import TreeBar from './components/TreeBar';
import TreeToggle from './components/TreeToggle';
import ChooseBar from './components/ChooseBar';
import SearchBar from './components/SearchBar';
import ViewChooser from './components/ViewChooser';
import EurekaTable from './components/EurekaTable';
import FileTree from './components/FileTree';
import UploadForm from './components/UploadForm';
import PathBar from './components/PathBar';
import DropArea from './components/DropArea';


import store from './model/store';
import actions from './model/actions';


class Eureka extends Component {
  componentDidMount() {
    store.dispatch(actions.fetchMediaSources()).then(() => { // hit the server and get the media sources
      store.dispatch(actions.updateSourceTree(this.props.source.sources[0].id)).then((content) => { // then hit server for the directory tree of the first (default) media source
        const props = this.props; 
        if(props.view.intervals.fetchDirectoryContents !== undefined && props.view.intervals.fetchDirectoryContents > 0) {
          setInterval(() => { // every so often hit the server and update the displayed contents of the current directory
            const state = store.getState(); 
            const props = this.props; 
            
            store.dispatch(actions.updateContent({ // updates the "current directory" of the view right away
              cd: props.content.cd
            }));
            store.dispatch(actions.fetchDirectoryContents(props.source.currentSource, { // asyncronously fetches the directory contents from the API
              dir: props.content.cd
            }));
            
          }, props.view.intervals.fetchDirectoryContents);
        }
        
        if(props.view.intervals.updateSourceTree !== undefined && props.view.intervals.updateSourceTree > 0) { // hit the server and get the (top-level-ish) directory tree of the current source
          setInterval(() => {
            store.dispatch(actions.updateSourceTree(props.source.currentSource));
          }, props.view.intervals.updateSourceTree);
        }
      }); 
    });
  }
  render() {
    const props = this.props;
    
    const pathbrowser = (props.view.sourceTreeOpen) ? (
      <div id="eureka__pathbrowser" className="eureka__pathbrowser">
        <MediaSourceSelector {...props} />
        <FileTree {...props} />
        <DropArea {...props} />
        <TreeBar {...props} />
      </div>
    ) : undefined;
    
    const mediaDirectorySelector = (!props.view.sourceTreeOpen) ? (
      <MediaDirectorySelector {...props} />
    ) : undefined;
    
    const uploadForm = (!props.view.sourceTreeOpen) ? (
      <UploadForm {...props} />
    ) : undefined;
    
    const pathBar = (props.view.focusedMediaItem) ? (
      <PathBar {...props} />
    ) : undefined;
    
    const enlargeFocusedRows = (props.view.enlargeFocusedRows) ? ' eureka__enlarge-focused-rows' : '';
    
    return (
      <div className={`eureka eureka__view-mode__${props.view.mode}${enlargeFocusedRows}`}>
        <div className="eureka__browse-content">
          {pathbrowser}
          <div className="eureka__stage">
            <div className="eureka__stage__filter-view">
              <header>
                <h2>
                  <span className="visually-hidden">Browse </span>Media Content
                </h2>
                <SearchBar {...props} />
              </header>
              <div className="eureka__tree-toggle">
                <TreeToggle {...props} />
                  {mediaDirectorySelector}
                  {uploadForm}
                <ViewChooser {...props} />  
              </div>
            </div>
            <div className="eureka__table-wrapper">
              <EurekaTable {...props} />
            </div>
          </div>
        </div>
        {pathBar}
        <ChooseBar {...props} />
      </div>
    );
  }
}

export default Eureka;
