/// <reference path="DefinitelyTyped/modernizr.d.ts" />
/// <reference path="./plugins.ts" />
declare var html5Upload; // tell typescript compiler we can assume this will be set http://stackoverflow.com/a/26275242/4671250

class Eureka {
    private _model:EurekaModel;
    private _view:EurekaView;
    private _controller:EurekaController;
    
    constructor(public opts:Object) {   
        var that = this;
             
        this._model = new EurekaModel(opts); // give the model the data
        this._view = new EurekaView(); // keep the view stupid
        this._controller = new EurekaController({ // create a controller that controls the two
            model: this._model,
            view: this._view
        });
        
        // set references to the controller respectively
        this._model.setController(this._controller);
        this._view.setController(this._controller);
        
        this._view.init();
        this._view.paint();
        this._controller.init();
            
        this.fetch();
        
        this._view.getElement().addEventListener('EurekaFilesUploaded',function(e){
            that._model.setCurrentDirectory(that._model.getCurrentDirectory(),true,true,true); // trigger a repaint
        });
    }
    fetch() {
        if(this._model.getDebug()) console.log('fetch');
        var _shouldFetchDirectory = (this._model.getCurrentMediaSource() !== undefined && this._model.getCurrentMediaSource() !== '/' && this._model.getCurrentMediaSource() !== '') ? true : false;
        this._model.setCurrentMediaSource(this._model.getCurrentMediaSource(), true, undefined, !_shouldFetchDirectory, true);
        if(_shouldFetchDirectory) {
            this._model.setCurrentDirectory(this._model.getCurrentDirectory(),true,true,true);
        }
    }
}

interface IEurekaMediaSource {
    getID() : string;
    setID(id:string);
    
    getTitle() : string;
    setTitle(title:string);
    
    toString() : string;
}

class EurekaMediaSource implements IEurekaMediaSource {
    private _id:string = '';
    private _title:string = '';
    
    getID():string {
        return this._id;
    }
    setID(id:string) { 
        this._id = id;
    }
    
    getTitle():string {
        return this._title;
    }
    setTitle(title:string) { 
        this._title = title;
    }

    constructor(public opts:any) {
        if(opts.id !== undefined) this._id = opts.id;
        if(opts.title !== undefined) this._title = opts.title;
    }
    
    toString() {
        return this.getID();  
    }
}

class EurekaModel {
    private _controller:EurekaController; 
    private _uid:string = 'media-browser_0';
    private _storagePrefix:string = 'eureka_';
    private _sources:Array<EurekaMediaSource> = [];
    private _navTreeHidden:boolean = false;
    private _useLocalStorage:boolean = true;
    private _mediaSource:string;
    private _currentDirectory:string = undefined;
    private _currentView:string = 'view-a';
    private _locale:string = 'en-US';
    private _selected:string = '';
    private _editable:boolean = true;
    private _headers:Array<Object> = [];
    private _debug:Boolean = false;
    private _confirmBeforeDelete:Boolean = true;
    private _fileUploadURL:string;
    private _displayFullTreePaths:Boolean = false;
    private _allowRename:Boolean = true;
    private _allowDelete:Boolean = true;
    private _touch:Boolean = false;
    private _prependOptGroupsWithRootOption:Boolean = true;
    
    private _directoryRequestURL:string = '';
    private _listSourceRequestURL:string = '';
    private _listSourcesRequestURL:string = '';
    
    public static get EurekaFoundIt():string { return "EurekaFoundIt"; }
    public static get EurekaFileRename():string { return "EurekaFileRename"; }
    public static get EurekaUnlink():string { return "EurekaUnlink"; }
    public static get EurekaDirectoryCreated():string { return "EurekaDirectoryCreated"; }
    public static get EurekaDirectoryOpened():string { return "EurekaDirectoryOpened"; }
    
    public static get EurekaDirectoryChanged():string { return "EurekaDirectoryChanged"; }
    public static get EurekaMediaSourceChange():string { return "EurekaMediaSourceChange"; }
    public static get EurekaMediaSourcesListChange():string { return "EurekaMediaSourcesListChange"; }
    public static get EurekaViewChange():string { return "EurekaViewChange"; }
    public static get EurekaFilesUploaded():string { return "EurekaFilesUploaded"; }
    public static get EurekaCanceled():string { return "EurekaCanceled"; }
    
    constructor(opts:any) {
        if(opts.uid !== undefined) this._uid = opts.uid;
        if(opts.storagePrefix !== undefined) this._storagePrefix = opts.storagePrefix;
        if(opts.locale !== undefined) this._locale = opts.locale;
        if(opts.mediaSource !== undefined) this._mediaSource = opts.mediaSource;
        if(opts.currentDirectory !== undefined) this._currentDirectory = opts.currentDirectory;
        if(opts.headers !== undefined) this._headers = opts.headers;
        
        if(opts.navTreeHidden !== undefined) this._navTreeHidden = opts.navTreeHidden;
        if(opts.useLocalStorage !== undefined) this._useLocalStorage = opts.useLocalStorage;
        if(opts.currentView !== undefined) this._currentView = opts.currentView;
        if(opts.selected !== undefined) this._selected = opts.selected;
        if(opts.displayFullTreePaths !== undefined) this._displayFullTreePaths = opts.displayFullTreePaths;
        if(opts.allowRename !== undefined) this._allowRename = opts.allowRename;
        if(opts.allowDelete !== undefined) this._allowDelete = opts.allowDelete;
        
        if(opts.directoryRequestURL !== undefined) this._directoryRequestURL = opts.directoryRequestURL;
        if(opts.listSourceRequestURL !== undefined) this._listSourceRequestURL = opts.listSourceRequestURL;
        if(opts.listSourcesRequestURL !== undefined) this._listSourcesRequestURL = opts.listSourcesRequestURL;
        if(opts.fileUploadURL !== undefined) this._fileUploadURL = opts.fileUploadURL;
        
        if(opts.debug === true) this._debug = opts.debug;
        if(opts.confirmBeforeDelete !== undefined) this._confirmBeforeDelete = opts.confirmBeforeDelete;
        if(opts.touch === true) this._touch = true;
        
        if(this._useLocalStorage) {
            if(this.getLocalStorage('currentMediaSource') && !opts.mediaSource) this._mediaSource = this.getLocalStorage('currentMediaSource');
            if(this.getLocalStorage('navTreeHidden') && !opts.navTreeHidden) this._navTreeHidden = (this.getLocalStorage('navTreeHidden') == 'true' ? true : false);
            if(this.getLocalStorage('currentDirectory') && !opts.currentDirectory) this._currentDirectory = this.getLocalStorage('currentDirectory');
            if(this.getLocalStorage('currentView') && !opts.currentView) this._currentView = this.getLocalStorage('currentView');
        }
    }
    
    getLocalStorage(id) {
        id = this.getStoragePrefix() + id;
        if(localStorage.getItem(id) !== undefined && localStorage.getItem(id) !== 'undefined') return localStorage.getItem(id);
        return false;
    }
    
    setLocalStorage(id,value) {
        id = this.getStoragePrefix() + id;
        localStorage.setItem(id,value);
    }
    
    useLocalStorage() {
        return this._useLocalStorage;
    }
    
    getAlertBeforeDelete() {
        return this._confirmBeforeDelete;
    }
    
    getFileUploadURL() {
        return this._fileUploadURL;
    }
    
    setFileUploadURL(val) {
        this._fileUploadURL = val;
    }
    
    setAlertBeforeDelete(val) {
        this._confirmBeforeDelete = val;
    }
    
    getDebug() {
        return this._debug;
    }
    
    setDebug(debug) {
        this._debug = debug;
    }
    
    getHeaders() {
        return this._headers;
    }
    
    getUID(){
        return this._uid;
    }
    
    getStoragePrefix() {
        return this._storagePrefix;
    }
    
    getSources() {
        return this._sources;
    }
    
    getEditable() {
        return this._editable;
    }
    
    getDisplayFullTreePaths() {
        return this._displayFullTreePaths;
    }
    
    getAllowRename() {
        return this._allowRename;
    }
    
    getAllowDelete() {
        return this._allowDelete;
    }
    
    getHTML5UploadData() {
        return {
            s:this.getCurrentMediaSource(),
            dir:this.getCurrentDirectory()
        };
    }
    
    isTouch() {
        return this._touch;
    }
    
    getMediaSourceDTOByID(id) {
        if(this.getDebug()) console.log('getMediaSourceDTOByID: ' + id);
        var sources = this.getSources();
        for (var i = 0; i < sources.length; i++) {
            var source = sources[i];
            if (source.getID() == id) {
                return source;
            }
        }
        if(this.getDebug()) console.log('no media source found with id: ' + id);
        return null;
    }
    getController() {
        return this._controller;
    }
    setController(controller) {
        this._controller = controller;
    }
    getNavTreeHidden() {
        return this._navTreeHidden;
    }
    setNavTreeHidden(navTreeHidden) {
        this._navTreeHidden = navTreeHidden;
        if (this._useLocalStorage) this.setLocalStorage('navTreeHidden', navTreeHidden);
    }
    setCurrentMediaSource(currentMediaSource:string, dispatch:boolean = true, setLocalStorage:boolean = true, clearDirectory:boolean = true, dispatchIdenticalValues:boolean = false) {
        if(this.getDebug()) console.log('setCurrentMediaSource');
        if(this._mediaSource === currentMediaSource && !dispatchIdenticalValues) return;
        this._mediaSource = currentMediaSource;
        if (setLocalStorage) this.setLocalStorage('currentMediaSource', currentMediaSource);
        if (dispatch === false) return;
        
        var currentMediaSourceDTO = this.getMediaSourceDTOByID(this._mediaSource);
        if(currentMediaSourceDTO) {
            var e = document.createEvent('CustomEvent');
            e.initCustomEvent(EurekaModel.EurekaMediaSourceChange, true, true, {
                currentDirectory:this.getCurrentDirectory(),
                currentMediaSource:currentMediaSourceDTO,
                clearDirectory:clearDirectory,
            });
        
            this.getController().getView().getElement().dispatchEvent(e);
        }
    }
    getCurrentMediaSource() {
        return this._mediaSource;
    }
    setCurrentDirectory(currentDirectory:string, dispatch:boolean = true, setLocalStorage:boolean = true, dispatchIdenticalValues:boolean = false) {
        if(setLocalStorage === undefined) setLocalStorage = this.useLocalStorage();
        //if(currentDirectory === undefined || currentDirectory === 'undefined') currentDirectory = '/';
        if(this._currentDirectory === currentDirectory && !dispatchIdenticalValues) return;
        this._currentDirectory = currentDirectory;
        if (setLocalStorage && currentDirectory) this.setLocalStorage('currentDirectory', currentDirectory);
        if (dispatch === false) return;
        var e = document.createEvent('CustomEvent');
        e.initCustomEvent(EurekaModel.EurekaDirectoryChanged, true, true, {
            currentDirectory:currentDirectory,
            currentMediaSource:this.getMediaSourceDTOByID(this._mediaSource)
        });
        
        this.getController().getView().getElement().dispatchEvent(e);
    }
    getCurrentDirectory() {
        if(this.getDebug()) console.log('getCurrentDirectory: ' + this._currentDirectory);
        return this._currentDirectory || '/';
    }
    setCurrentView(currentView:string, dispatch:boolean = true) {
        if(this._currentView === currentView) return;
        this._currentView = currentView;
        if (this._useLocalStorage) this.setLocalStorage('currentView', currentView);
        if (dispatch === false) return;
        var e = document.createEvent('CustomEvent');
        e.initCustomEvent(EurekaModel.EurekaViewChange, true, true, {
            currentView:currentView
        });
        
        this.getController().getView().getElement().dispatchEvent(e);
    }
    getCurrentView() {
        return this._currentView;
    }
    setLocale(locale) {
        this._locale = locale;
    }
    getLocale() {
        return this._locale;
    }
    getPrependOptGroupsWithRootOption() {
        return this._prependOptGroupsWithRootOption;
    }
    setSources(sources, dispatch = true) {
        if(this.getDebug()) console.log('setSources' + dispatch);
        this._sources = sources;
        if (dispatch === false) return;
        
        var e = document.createEvent('CustomEvent');
        e.initCustomEvent(EurekaModel.EurekaMediaSourcesListChange, true, true, {
            sources:sources
        });
        if(this.getDebug()) console.log('setSources');
        
        this.getController().getView().getElement().dispatchEvent(e);
    }
    setMediaSourcesData(data) {
        var that = this;
        if(this.getDebug()) console.log('setMediaSourcesData');
        data = JSON.parse(data);
        var results = data.results;
        var sources = [];
        var current = that.getCurrentMediaSource();
        var currentExists = false;
        for (var i = 0; i < results.length; i++) {
            var result = results[i];
            var mediaSourceDTO = new EurekaMediaSource({
                id: result.id,
                title: result.name
            });
            sources.push(mediaSourceDTO);
            if(result.id == current) currentExists = true;
        }
        this.setSources(sources);
        that.setCurrentMediaSource((!currentExists) ? results[0].id : current, true, true, false, true);
    }
    renameFile(fileName, newFilename) {
        // Create the event
        var e = document.createEvent('CustomEvent');
        e.initCustomEvent('EurekaFileRename', true, true, {
          fileName: fileName,
          newFilename: newFilename,
          cs: this.getController().getModel().getCurrentMediaSource(),
          cd: this.getController().getModel().getCurrentDirectory(),
          path: this.getController().getModel().getCurrentDirectory() + fileName,
          newPath: this.getController().getModel().getCurrentDirectory() + newFilename
        });
        
        this.getController().getView().getElement().dispatchEvent(e);
    }
    deleteFile(filename, tr) {
        var that = this;
        
        var e = document.createEvent('CustomEvent');
        e.initCustomEvent('EurekaUnlink', true, true, {
          filename: tr.getAttribute('data-filename'),
          timestamp: tr.getAttribute('data-timestamp'),
          src: tr.querySelector('.image img').getAttribute('src'),
          dimensions: [tr.getAttribute('data-dimensions-w'), tr.getAttribute('data-dimensions-h')],
          filesize: parseInt(tr.getAttribute('data-filesize-bytes'))
        });
        
        that.getController().getView().getElement().dispatchEvent(e);
    }
    setChoosenMediaItem(filename) {
        var that = this;
        var tr = getEurekaRowByFileName(filename); // #more reliable than tr.eureka__row.focused
        
        var e = document.createEvent('CustomEvent');
        e.initCustomEvent('EurekaFoundIt', true, true, {
          filename: filename,
          timestamp: tr.getAttribute('data-timestamp'),
          src: tr.querySelector('.image img').getAttribute('src'),
          dimensions: [tr.getAttribute('data-dimensions-w'), tr.getAttribute('data-dimensions-h')],
          filesize: parseInt(tr.getAttribute('data-filesize-bytes'))
        });
        
        that.getController().getView().getElement().dispatchEvent(e);
        function getEurekaRowByFileName(filename:string) : HTMLElement {
            var trs = that.getController().getView().getElement().querySelectorAll('tr.eureka__row');
            for (var i = 0; i < trs.length; i++) {
                var tr = <HTMLElement>trs[i];
                if (tr.getAttribute('data-filename') == filename)
                    return tr;
            }
            return null;
        }
    }
    getSelected() {
        return this._selected;
    }
    setSelected(filename) {
        this._selected = filename;
    }
    getXHRHeaders = function() {
        return this._headers;
    }
    getListDirectoryRequestURL() {
      return this._directoryRequestURL;
    }
    setListDirectoryRequestURL(url:string) {
      this._directoryRequestURL = url;
    }
    getListSourceRequestURL() {
      return this._listSourceRequestURL;
    }
    setListSourceRequestURL(url:string) {
      this._listSourceRequestURL = url;
    }
    getListSourcesRequestURL() {
      return this._listSourcesRequestURL;
    }
    setListSourcesRequestURL(url:string) {
      this._listSourcesRequestURL = url;
    }
    
} // end class EurekaModel

class EurekaView {
    private _controller:EurekaController;
    private _html5Upload:Object;
    
    constructor() {} 
     
    getController() {
        return this._controller; 
    }
    
    setController(controller:EurekaController) {
        this._controller = controller;
    }
    
    getElement() {
        return (<HTMLElement>document.getElementById(this.getController().getModel().getUID()));
    }
    assignFooterProceedListeners(){
        var that = this;
        (<HTMLElement>that.getElement().parentNode).querySelector('footer.proceed button.cancel').addEventListener('click', function (e) {
            e.preventDefault();
            
            (function(){
                var e:any = <any>document.createEvent('CustomEvent');
                e.initCustomEvent(EurekaModel.EurekaCanceled, true, true, {});
        
                that.getElement().dispatchEvent(e); 
            })();
        });
        (<HTMLElement>that.getElement().parentNode).querySelector('footer.proceed button.cta').addEventListener('click', function (e) {
            e.preventDefault();
            that.getController().getModel().setChoosenMediaItem(that.getController().getModel().getSelected());
        });
    }
    init(){
        var that = this;
        function assignShortcutListeners() {
            document.addEventListener('keydown', function(event) {
                if(that.getController().getModel().getDebug()) console.log(event);
                if (event.ctrlKey && event.which === 186) { // ctrl ; to toggle sidebar
                    var e = document.createEvent('Event');
                    e.initEvent('click', true, true);
                    
                    document.getElementById(that.getController().getModel().getUID() + '__pathbrowser_toggle').dispatchEvent(e);
                }
                if (event.altKey && event.ctrlKey && (event.which >= 48 && event.which <= 57)) {
                    try {
                        var btns = that.getElement().querySelectorAll('.view-btns > nav > a');
                        var btn:HTMLElement = <HTMLElement>(btns[event.which-48-1]);
                        if(btn) {
                            var e = document.createEvent('Event');
                            e.initEvent('click', true, true);
                            
                            btn.dispatchEvent(e);
                        }
                    } catch(e) {}
                }
                if (event.altKey && !event.ctrlKey && (event.which >= 49 && event.which <= 57)) { // alt 1-9
                    function setSelectOptGroup(select:HTMLSelectElement,group)  {
                        function getOptGroup() : Element {
                            var optgroups = select.querySelectorAll('optgroup');
                            for(var i = 0; i < optgroups.length; i++) {
                                var optgroup:Element = (<Element>optgroups[i]);
                                if(optgroup.getAttribute('data-source') == group) return optgroup;
                            }
                            return null;
                        }
                        var optGroup:Element = getOptGroup();
                        if(optGroup) {
                            select.value = (<HTMLOptionElement>optGroup.querySelector('option')).value;
                        }
                    }
                    function setSelectOption(select,value) {
                        try {
                            var options = select.querySelectorAll('option');
                            var option:HTMLOptionElement = <HTMLOptionElement>options[value];
                            if(option) {
                                select.value = option.getAttribute('value');
                            }
                        } catch(e) {}
                        return;
                        function hasOption(val) {
                            var options = select.querySelectorAll('option');
                            for(var i = 0; i < options.length; i++) {
                                if(((<HTMLOptionElement>(options[i])).value) == val) return true; 
                            }
                            return false;
                        }
                        if(hasOption((event.which - 49).toString())) {
                            select.value = value;
                        }
                    }
                    var msSelect = <HTMLSelectElement>(document.getElementById(that.getController().getModel().getUID() + '__mediasource-select'));
                    setSelectOption(
                        msSelect,
                        (event.which - 49).toString()
                    );
                    setSelectOptGroup(
                        <HTMLSelectElement>(document.getElementById(that.getController().getModel().getUID() + '__browsing').querySelector('select')),
                        (event.which - 49).toString()
                    );
                    that.getController().getModel().setCurrentMediaSource(msSelect.value, true,  true, true, false);
                }
                
                if(event.which === 8 && document.activeElement) { // delete to delete
                    var e = document.createEvent('Event');
                    e.initEvent('click', true, true);
                    
                    try {
                        (<HTMLElement>document.activeElement.nextSibling).querySelector('a.trash').dispatchEvent(e);
                    } catch(e) {}
                } 
                
                if(event.altKey && event.which === 32 && document.activeElement) { // space to expand
                    try {
                        var e = document.createEvent('Event');
                        e.initEvent('click', true, true);
                        
                        (<HTMLElement>document.activeElement.nextSibling).querySelector('a.expand').dispatchEvent(e);
                    } catch(e) {}
                }
                
                if(event.which === 13 && document.activeElement) { // enter to choose
                    try {
                        var e = document.createEvent('Event');
                        e.initEvent('click', true, true);
                        
                        (<HTMLElement>document.activeElement.nextSibling).querySelector('a.choose').dispatchEvent(e);
                    } catch(e) {}
                }
                
                if(event.ctrlKey && event.which === 82) { // ctrl r to rename
                    try {
                        var e = document.createEvent('Event');
                        e.initEvent('click', true, true);
                        
                        (<HTMLElement>document.activeElement.nextSibling).querySelector('a.rename').dispatchEvent(e);
                    } catch(e) {}
                }
                
                if(event.ctrlKey && event.which === 78) { // ctrl n to create directory
                    try {
                        var e = document.createEvent('Event');
                        e.initEvent('click', true, true);
                        
                        (<HTMLElement>that.getElement()).querySelector('.create-new').dispatchEvent(e);
                    } catch(e) {}
                }
                
                if(event.ctrlKey && event.which === 85) { // ctrl n to create directory
                    try {
                        var e = document.createEvent('Event');
                        e.initEvent('click', true, true);
                        document.getElementById(that.getController().getModel().getUID() + '__upload-input').dispatchEvent(e);
                    } catch(e) {}
                }
                
                if(event.ctrlKey && event.which === 70) { // ctrl f to filter
                    try {
                        document.getElementById(that.getController().getModel().getUID() + '__filter-images').focus();
                    } catch(e) {}
                }
            });
        }
        function showSidebar() {
            var tog = document.getElementById(that.getController().getModel().getUID() + '__pathbrowser_toggle');
            var el = document.getElementById(tog.getAttribute('data-toggle-target'));
            el.classList.remove('hidden');
            document.getElementById(that.getController().getModel().getUID()).classList.add('sidebar-open');
            //document.querySelectorAll('#media-browser_0 .browse-select')[0].classList.add('tablet-p-hidden');
            (<HTMLElement>that.getElement().querySelector('.browse-select')).classList.add('tablet-p-hidden');
            that.getController().getModel().setNavTreeHidden(false);
            var toggle = document.getElementById(that.getController().getModel().getUID() + '__pathbrowser_toggle').getElementsByTagName("i")[0];
            toggle.classList.remove('fa-toggle-right');
            toggle.classList.remove('icon-toggle-right');
            toggle.classList.add('fa-toggle-left');
            toggle.classList.add('icon-toggle-left');
            tog.title = tog.getAttribute('data-title-close');
        }
        function hideSidebar() {
            var tog = document.getElementById(that.getController().getModel().getUID() + '__pathbrowser_toggle');
            var el = document.getElementById(tog.getAttribute('data-toggle-target'));
            
            el.classList.add('hidden');
            document.getElementById(that.getController().getModel().getUID()).classList.remove('sidebar-open');
            //document.querySelectorAll('#media-browser_0 .browse-select')[0].classList.remove('tablet-p-hidden');
            (<HTMLElement>that.getElement().querySelector('.browse-select')).classList.remove('tablet-p-hidden');
            that.getController().getModel().setNavTreeHidden(true);
            var toggle = document.getElementById(that.getController().getModel().getUID() + '__pathbrowser_toggle').getElementsByTagName("i")[0];
            toggle.classList.add('fa-toggle-right');
            toggle.classList.add('icon-toggle-right');
            toggle.classList.remove('fa-toggle-left');
            toggle.classList.remove('icon-toggle-left');
            tog.title = tog.getAttribute('data-title-open');
        }
        
        document.getElementById(that.getController().getModel().getUID() + '__pathbrowser_toggle').addEventListener('click', function (e) {
            var el = document.getElementById(this.getAttribute('data-toggle-target'));
            e.preventDefault();
            if (el.classList.contains('hidden')) {
                showSidebar();
            }
            else {
                hideSidebar();
            }
        });
        this.assignViewButtonListeners();
        this.assignFooterProceedListeners();
        this.assignBrowsingSelectOptGroupListeners();
        
        this.assignSelectListeners();
        this.assignSortBtnListeners();
        this.assignFilterListeners();
        this.assignCreateNewDirectoryListener();
        this.assignUploadListeners();
        
        assignShortcutListeners();

        var e = document.createEvent('Event');
        e.initEvent('click', true, true);
        that.getElement().querySelector('.eureka__topbar-nav .view-btns a[data-view="' + that.getController().getModel().getCurrentView() + '"]').dispatchEvent(e);
        
        if (this.getController().getModel().getNavTreeHidden() === true) {
            hideSidebar();
        }
        
        // if a droptarget exists and a modern mouse enabled browser is being used
        var dropContainer = document.getElementById(that.getController().getModel().getUID()).querySelector('.dropzone') || null;
        if (html5Upload !== undefined && !(that.getController().getModel().isTouch()) && html5Upload.fileApiSupported() && dropContainer) {
            that._html5Upload = html5Upload.initialize({
                // URL that handles uploaded files
                uploadUrl: that.getController().getModel().getFileUploadURL(),

                // HTML element on which files should be dropped (optional)
                dropContainer: dropContainer,

                // HTML file input element that allows to select files (optional)
                inputField: document.getElementById(that.getController().getModel().getUID() + '__upload-input'),

                // Key for the file data (optional, default: 'file')
                key: 'File',
                
                data:that.getController().getModel().getHTML5UploadData(),

                // Additional data submitted with file (optional)
                //data: that.getController().getModel().getHeaders(), // NOTE: could also send additional data here

                // Maximum number of simultaneous uploads
                // Other uploads will be added to uploads queue (optional)
                maxSimultaneousUploads: 4,

                // Callback for each dropped or selected file
                // It receives one argument, add callbacks 
                // by passing events map object: file.on({ ... })

                onFileAdded: function (file) {
                    function removeMessages() {
                        var rs = dropContainer.querySelector('.progress').querySelectorAll('h2,p');
                        for(var i = 0; i < rs.length; i++) {
                            (<any>rs[i]).remove();
                        }
                    }
                    removeMessages();
                    // make a really unique identifer
                    var id = file.fileName.replace(/[!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g, '') + file.fileSize.toString().replace(/[!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g, '');
                    
                    var bar = document.createElement('div');
                    bar.classList.add('bar');
                    
                    bar.setAttribute('id',id);
                    bar.title = file.fileName + ' is preparing for upload.';
                    
                    var pill = document.createElement('div');
                    pill.setAttribute('style','right:100%');
                    
                    bar.appendChild(pill);
                    
                    var dropzone:HTMLElement = <HTMLElement>document.getElementById(that.getController().getModel().getUID()).querySelector('.dropzone');
                    dropzone.classList.remove('complete');
                    dropzone.classList.add('uploading');
                    
                    dropzone.querySelector('.progress').appendChild(bar);

                    file.on({
                        // Called after received response from the server
                        onCompleted: function (response) {
                            bar.setAttribute('title', file.fileName + ' has uploaded');
                            
                            if(dropzone.querySelectorAll('.bar').length >= 2)(<any>bar).remove();
                            if(dropzone.querySelectorAll('.bar').length < 2) { // everything is up
                                setTimeout(function(){
                                    (<HTMLElement>dropzone.querySelector('.progress')).innerHTML = '';
                                    dropzone.classList.remove('uploading');
                                    dropzone.classList.add('complete');
                            
                                    (function(){ // wait a bit, then show the complete message
                                        var div = dropzone.querySelector('.progress');
                                        var h2 = document.createElement('h2');
                                        var icon = document.createElement('i');
                                        icon.setAttribute('class','fa fa-check-circle-o icon icon-check-circle-o');
                                        h2.appendChild(icon);
                                        div.appendChild(h2);
                            
                                        var span = document.createElement('span');
                                        span.setAttribute('title','files here...');
                                        span.innerHTML = 'Your files';
                            
                                        var p = document.createElement('p');
                                        p.appendChild(span);
                                        p.innerHTML += ' have been successfully uploaded.';
                                        div.appendChild(p);
                                        
                                        var e:any = <any>document.createEvent('CustomEvent');
                                        //that.getElement().dispatchEvent(e);
                                        e.initCustomEvent(EurekaModel.EurekaFilesUploaded, true, true, {
                                        });
                                        that.getElement().dispatchEvent(e);

                                        (<HTMLFormElement>document.getElementById(that.getController().getModel().getUID() + '__upload-form')).reset();
                                    })();
                                }, 640);
                            }
                            
                        },

                        // Called during upload progress, first parameter
                        // is decimal value from 0 to 100.
                        onProgress: function (progress, fileSize, uploadedBytes) {
                            progress = Math.ceil(progress);
                            bar.setAttribute('title', file.fileName + ' is ' + progress + '% uploaded');
                            pill.setAttribute('style','right:' + (100-progress).toString() + '%');
                        }
                    });
                }
            });
        } else {
            if(dropContainer) (<any>dropContainer).remove(); // remove the drop container because we can't use it
        }
        
        if(that.getController().getModel().getFileUploadURL() === undefined || that.getController().getModel().getFileUploadURL() == '') {
            try {
                (<any>that.getElement().querySelector('.pathbrowser footer form')).remove();
            } catch(e) {}
            
            try {
                (<any>that.getElement().querySelector('.upload-form')).remove();
            } catch(e) {}
        }
        
        if(that.getController().getModel().getCurrentMediaSource() !== undefined && that.getController().getModel().getCurrentMediaSource() !== '/' && that.getController().getModel().getCurrentMediaSource() !== '') {
            that.recursivelyOpenTreeToCurrentDirectory();
        }
        
        that.getElement().addEventListener(EurekaModel.EurekaDirectoryChanged, function (e:any) {
            if(that.getController().getModel().getDebug()) console.log(EurekaModel.EurekaDirectoryChanged);
            var currentDirectory = e.detail.currentDirectory;
            var currentMediaSource = that.getController().getModel().getCurrentMediaSource();
            var split = currentDirectory.split('/');
            split = split.filter(function (n) { return (n !== undefined && n != ""); });
            var levelup:HTMLElement = <HTMLElement>(<HTMLElement>document.getElementById(that.getController().getModel().getUID() + '__pathbrowser')).querySelector('.level-up');
            if(split.length >= 1) levelup.classList.remove('hidden');
            else levelup.classList.add('hidden');

            (function(){
                try {
                    var el:HTMLElement = (<HTMLElement>that.getElement().querySelector('.pathbrowser .create-new'));
                    el.setAttribute('title','Create a new directory in ' + that.sanitizeDisplayPath(currentDirectory));
                    (<HTMLElement>el.querySelector('.audible')).innerHTML = el.getAttribute('title');
                } catch(e) {}
            })();
            (function(){
                try {
                    var el:HTMLElement = (<HTMLElement>that.getElement().querySelector('.pathbrowser .upload-files'));
                    el.setAttribute('title','Upload media to ' + that.sanitizeDisplayPath(currentDirectory));
                    (<HTMLElement>el.querySelector('.audible')).innerHTML = el.getAttribute('title');
                } catch(e) {}
            })();
            that.setBrowseSelectValue();
            that.setMediaSourceSelectValue();
            try {
                (<any>(that._html5Upload)).data = that.getController().getModel().getHTML5UploadData();
            } catch(e) {}
        });
        that.getElement().addEventListener(EurekaModel.EurekaMediaSourceChange, function(e:any){
            var mediaSourceTitle:HTMLElement = (<HTMLElement>that.getElement().querySelector('.eureka__topbar-nav .mediasource-title'));
            
            if(e.detail.currentMediaSource) {
                var prepend =  mediaSourceTitle.getAttribute('data-prepend') || '';
                mediaSourceTitle.innerHTML = prepend + e.detail.currentMediaSource.getTitle();
            } 
            
            that.setBrowseSelectValue();
            that.setMediaSourceSelectValue();
            try {
                (<any>(that._html5Upload)).data = that.getController().getModel().getHTML5UploadData();
            } catch(e) {}
        });
    }
    
    setMediaSourceSelectValue() {
        var that = this;
        if(that.getController().getModel().getDebug()) console.log('setMediaSourceSelectValue');
        
        var currentDirectory = that.getController().getModel().getCurrentDirectory();
        var currentMediaSource = that.getController().getModel().getCurrentMediaSource();
        
        var select:HTMLSelectElement = (<HTMLSelectElement>document.getElementById(that.getController().getModel().getUID() + '__mediasource-select'));
        
        if(select.value !== currentMediaSource) {
            select.value = currentMediaSource;
        }
    }
    
    setBrowseSelectValue() {
        var that = this;
        if(that.getController().getModel().getDebug()) console.log('setBrowseSelectValue'); 
        
        var currentDirectory = that.getController().getModel().getCurrentDirectory();
        var currentMediaSource = that.getController().getModel().getCurrentMediaSource();
        
        var select:HTMLSelectElement = <HTMLSelectElement>(<HTMLElement>document.getElementById(that.getController().getModel().getUID() + '__browsing')).querySelector('select');
        var optgroups = select.querySelectorAll('optgroup');
        var optgroup = getOptGroup(optgroups);
        if(optgroup) {
            var opt:HTMLElement = searchForValue(optgroup);
            if(opt && select.value !== opt.getAttribute('value')) {
                select.value = opt.getAttribute('value');
            }
        } 
        
        function getOptGroup(optgroups) : HTMLElement {
            for(var i = 0; i < optgroups.length; i++) {
                var optgroup = optgroups[i];
                if((<HTMLElement>optgroup).getAttribute('data-source') == currentMediaSource) {
                    return optgroup;
                }
            }
            return null;
        }
        function searchForValue(optgroup) : HTMLElement {
            function splitFilter(path) {
                if(!path) return '';
                var split = path.split('/');
                split = split.filter(function (n) { return (n !== undefined && n != ""); });
                return split;
            }
            var opts = optgroup.querySelectorAll('option');
            for(var i = 0; i < opts.length; i++) {
                var opt:HTMLElement = <HTMLElement>(opts[i]);
                var path = (<HTMLElement>opt).getAttribute('data-cd');
                if(splitFilter(path).toString() == splitFilter(currentDirectory).toString()) {
                    return opt;
                }
            }
        }
    }
    
    recursivelyOpenTreeToCurrentDirectory() {
        var that = this;
        
        var pathbrowser = document.getElementById(that.getController().getModel().getUID() + '__pathbrowser');
        var paths = pathbrowser.querySelectorAll('a.path');
        for(var i = 0; i < paths.length; i++) {
            var path:HTMLElement = <HTMLElement>paths[i];
            if(path.getAttribute('data-cd').split('/').toString() == that.getController().getModel().getCurrentDirectory().split('/').toString()) {
                (function(){
                    (<HTMLElement>path.parentNode).classList.add('active');
                    (<HTMLElement>path.parentNode).classList.add('open');
                    var parents = getParents(path,'ul');
                    function openFolder(folder:HTMLElement) {
                        folder.classList.remove('fa-folder');
                        folder.classList.remove('icon-folder');
                        folder.classList.add('fa-folder-open');
                        folder.classList.add('icon-folder-open');
                        try {
                            (<HTMLElement>folder.querySelector('.audible')).innerHTML = folder.getAttribute('data-close-msg');
                        } catch(e) {}
                    }
                    if(parents.length > 1) {
                        for(var i = 0; i < parents.length; i++) {
                            var li:HTMLElement = (<HTMLElement>parents[i].parentNode);
                            li.classList.add('open');
                            openFolder(<HTMLElement>(li.querySelector('.folder > i')));
                        }
                    } 
                })();
            }
        }
        return false;
    }
    
    assignUploadListeners() {
        var that = this;
        var upload_files = that.getElement().querySelector('.pathbrowser .upload-files');
        if(upload_files) {
            upload_files.addEventListener('click',function(e){
                e.preventDefault();
                e.stopPropagation();
            
                (function(){
                    var e = document.createEvent('Event');
                    e.initEvent('click', true, true);
                    document.getElementById(that.getController().getModel().getUID() + '__upload-input').dispatchEvent(e);
                })();
            });
        }
    }
    
    assignBrowsingSelectOptGroupListeners(){
        var that = this;
        
        if(that.getController().getModel().getDebug())console.log('assignBrowsingSelectOptGroupListeners');
        var select = document.getElementById(that.getController().getModel().getUID() + '__browsing').querySelector('select');
        select.addEventListener('change', function (e) {
            var option = that.getSelectedOption(this);
            var optgroup = that.getClosest(option, 'optgroup');
            var source = optgroup.getAttribute('data-source');
            that.getController().getModel().setCurrentMediaSource(source);
            that.getController().getModel().setCurrentDirectory(option.getAttribute('data-cd'), true, that.getController().getModel().useLocalStorage());
            // fetch current media source's directories
            var ajax = new AJAX();
            ajax.get(
                that.getController().getModel().getListSourceRequestURL(),
                { s: that.getController().getModel().getCurrentMediaSource() },
                function (data) {
                },
                true,
                that.getController().getModel().getXHRHeaders()
            );
        });
    }
    assignCreateNewDirectoryListener() {
        var that = this;
        
        try {
            that.getElement().querySelector('.create-new').addEventListener('click',function(e){
                var li = document.createElement('li');
                var folder = document.createElement('a');
                folder.classList.add('folder');
                folder.innerHTML = '&nbsp;<i class="fa icon fa-folder icon-folder"></i>';
            
                var path = document.createElement('a');
                path.classList.add('path');
                path.setAttribute('title','Browse this directory');
                path.setAttribute('data-cd','');
                path.setAttribute('contenteditable','true');
                path.innerHTML = 'new folder';
            
                li.appendChild(folder);
                li.appendChild(path);
            
                li.appendChild(document.createElement('ul'));

                setTimeout(function(){
                    path.focus();
                    try {
                        (<any>path).select();
                    } catch(e) {}
                },240);
            
                var ul:HTMLElement = <HTMLElement>(that.getElement().querySelector('.pathbrowser .tree li.active > ul') || that.getElement().querySelector('.pathbrowser .tree > ul'));
                ul.classList.add('open');
                (<HTMLElement>(ul.parentNode)).classList.add('open');
                try {
                    (<HTMLElement>(<HTMLElement>(ul.previousSibling).previousSibling)).querySelector('.fa').setAttribute('class','fa icon fa-folder-open icon-folder-open');
                } catch(e) {}
            
                path.addEventListener('focus', function (e) {
                    this.addEventListener('keydown', handleKeyDown, false);
                }, false);
                path.addEventListener('blur', function (e) {
                    this.removeEventListener('keydown', handleKeyDown, false);
                }, false);
            
                function handleKeyDown(e) {
                    //var code = getCodeToFocus(this);
                    //var tr = that.getClosest(this, '.contextual').previousSibling;
                    if (e.keyCode === 13) {
                        e.preventDefault();
                        e.stopPropagation();
                        this.blur();
                        this.setAttribute('contenteditable','false');
                        (<HTMLElement>that.getElement().querySelector('button.create-new')).focus();
                    
                        var foldername = this.innerHTML;
                    
                        var e:any = <any>document.createEvent('CustomEvent');
                        //that.getElement().dispatchEvent(e);
                        e.initCustomEvent('EurekaDirectoryCreated', true, true, {
                            newdirectory: foldername,
                            cd:that.getController().getModel().getCurrentDirectory(),
                            s:that.getController().getModel().getCurrentMediaSource(),
                            path:that.getController().getModel().getCurrentDirectory()+foldername
                        });
                        that.getElement().dispatchEvent(e);
                    }
                }
            
                ul.appendChild(li);
            });
        } catch(e) {}
    }
    assignViewButtonListeners(){
        var model = this.getController().getModel();
        function setCurrent(el) {
            var anchors = document.querySelectorAll(".eureka__topbar-nav .view-btns a[data-view]");
            for (var i = 0; i < anchors.length; i++) {
                var anchor = anchors[i];
                (<HTMLElement>anchor).classList.remove('current');
            }
            el.classList.add('current');
        }
        var anchors = document.querySelectorAll(".eureka__topbar-nav .view-btns a[data-view]");
        for (var i = 0; i < anchors.length; i++) {
            var current = anchors[i];
            current.addEventListener('click', function (e) {
                e.preventDefault();
                var that = this;
                var _v = this.getAttribute('data-view');
                var classes = ['view-a', 'view-b', 'view-c', 'view-d'];
                for (var _i = 0; _i < classes.length; _i++) {
                    var c = classes[_i];
                    document.getElementById(that.getAttribute('data-view-target')).classList.remove(c);
                }
                document.getElementById(that.getAttribute('data-view-target')).classList.add(_v);
                setCurrent(that);
                model.setCurrentView(_v);
            }, true);
        }
    }
    assignARIAKeyListeners(){
        var that = this;
        // ARIA focus support for non-contextual rows
        (function () {
            function setFocused(el) {
                var rows = document.querySelectorAll(".eureka-table tbody > tr:not(.contextual)");
                for (var i = 0; i < rows.length; i++) {
                    var current = (<HTMLElement>rows[i]);
                    if (el !== current && current.classList.contains("focused"))
                        current.classList.remove('focused');
                }
                el.classList.add('focused');
                var _cta = (<HTMLElement>that.getProceedFooter().querySelector('button.cta'));
                _cta.removeAttribute('disabled');
                _cta.classList.remove('muted');
                
                _cta.classList.add('go');
                that.getController().getModel().setSelected(el.getAttribute('data-filename'));
            }
            function handleBlur(el) {
                var contextual = document.getElementById('eureka_contextual__' + el.getAttribute('data-safe-filename'));
                contextual.focus();
                //that.getProceedFooter().querySelector('button.cta').classList.add('muted');
                var _cta = (<HTMLElement>that.getProceedFooter().querySelector('button.cta'));
                _cta.classList.remove('go');
                
                _cta.setAttribute('disabled');
                _cta.classList.add('muted');
            }
            var rows = document.querySelectorAll(".eureka-table tbody > tr:not(.contextual)");
            for (var i = 0; i < rows.length; i++) {
                var current = rows[i];
                current.addEventListener('click', function (e) {
                    e.preventDefault();
                    //var _as = document.querySelectorAll(".eureka-table tbody > tr:not(.contextual)");
                    setFocused(this);
                }, false);
                current.addEventListener('focus', function (e) {
                    e.preventDefault();
                    //var _as = document.querySelectorAll(".eureka-table tbody > tr:not(.contextual)");
                    setFocused(this);
                }, false);
                current.addEventListener('blur', function (e) {
                    handleBlur(this);
                }, false);
            }
        }());
    }
    assignSortBtnListeners(){
        var that = this;
        
        var sortBtns = that.getElement().querySelectorAll('.eureka-table th .fa-sort');
        for (var i = 0; i < sortBtns.length; i++) {
            var sortBtn = sortBtns[i];
            function handleSortBtnClicked(e) {
                e.preventDefault();
                e.stopPropagation();
                // toggle between 0 and 1
                this.setAttribute('data-sort-asc', Math.abs(parseInt(this.getAttribute('data-sort-asc')) - 1).toString());
                var sortby = this.getAttribute('data-sortby');
                var sortASC = (this.getAttribute('data-sort-asc') == "1") ? true : false;
                var rows = [];
                var rs = document.querySelectorAll('.eureka-table tbody > tr:not(.contextual)');
                for (var i = 0; i < rs.length; i++) {
                    rows.push(rs[i]);
                }
                switch (sortby) {
                    case 'dimensions':
                        rows.sort(function (a, b) {
                            return (parseInt(a.getAttribute('data-dimensions-w')) * parseInt(a.getAttribute('data-dimensions-h'))) - (parseInt(b.getAttribute('data-dimensions-w')) * parseInt(b.getAttribute('data-dimensions-h')));
                        });
                        break;
                    case 'filesize':
                        rows.sort(function (a, b) {
                            return parseInt(a.getAttribute('data-filesize-bytes')) - parseInt(b.getAttribute('data-filesize-bytes'));
                        });
                        break;
                    case 'editedon':
                        rows.sort(function (a, b) {
                            return parseInt(a.getAttribute('data-timestamp')) - parseInt(b.getAttribute('data-timestamp'));
                        });
                        break;
                    default:
                        rows.sort(function (a, b) {
                            if (a.getAttribute('data-filename') > b.getAttribute('data-filename'))
                                return 1;
                            if (a.getAttribute('data-filename') < b.getAttribute('data-filename'))
                                return -1;
                            return 0;
                        });
                        break;
                }
                if (!sortASC) {
                    rows.reverse();
                }
                var s = '';
                for (var _i = 0; _i < rows.length; _i++) {
                    var row = rows[_i];
                    s += row.outerHTML;
                }
                (<HTMLElement>that.getElement().querySelector('.eureka-table tbody')).innerHTML = s;
            }
            
            sortBtn.removeEventListener('click', handleSortBtnClicked, true); // assignSortBtnListeners should only be called once but this is another layer of protection
            sortBtn.addEventListener('click', handleSortBtnClicked, true); 
        }
    }
    assignFilterListeners(){
        var that = this;
        function unFilterView() {
            var rows = document.querySelectorAll(".eureka-table tbody > tr:not(.contextual)");
            for (var i = 0; i < rows.length; i++) {
                var row = (<HTMLElement>rows[i]);
                row.classList.remove('hidden');
            }
            (<HTMLElement>document.getElementById(that.getController().getModel().getUID()).querySelector('.eureka-table > table > tbody')).classList.remove('filtered');
        }
        function filterView(value) {
            var rows = that.getElement().querySelectorAll(".eureka-table tbody > tr:not(.contextual)");
            for (var i = 0; i < rows.length; i++) {
                var row = (<HTMLElement>rows[i]);
                var show = false;
                var tokens = [row.getAttribute('data-filename')];
                if (row.getAttribute('data-tokens')) tokens = tokens.concat(row.getAttribute('data-tokens').split('||'));

                (function(){
                    for (var _i = 0; _i < tokens.length; _i++) {
                        var token = tokens[_i];
                        if (value.length && (token == value || token.indexOf(value) > -1)) {
                            show = true;
                            break;
                        }
                    }
                })();

                if (!show) {
                    row.classList.add('hidden');
                    row.classList.remove('visible');
                }
                else {
                    row.classList.add('visible');
                    row.classList.remove('hidden');
                }
                (<HTMLElement>document.getElementById(that.getController().getModel().getUID()).querySelector('.eureka-table > table > tbody')).classList.add('filtered');
            }
        }
        var input = document.getElementById(that.getController().getModel().getUID() + '__filter-images');
        input.addEventListener("input", function (e) {
            if (this.value) {
                filterView(this.value);
            }
            else {
                unFilterView();
            }
        }, false);
    }
    sanitizeDisplayPath(path) : string {
        var split = path.split('/');
        split = split.filter(function (n) { return (n !== undefined && n != ""); });
        return split.join('/');
    }
    getProceedFooter(){
        return (<HTMLElement>(<HTMLElement>this.getElement().parentNode).querySelector('footer.proceed'));
    }
    handleTreePathClicked(el) {
        var that = this;
        if(that.getController().getModel().getDebug()) console.log('handleTreePathClicked: ' + (el.getAttribute('data-cd') || '/'));
        that.getController().getModel().setCurrentDirectory((el.getAttribute('data-cd') || '/'), true,undefined);
        function deactivatePaths() {
            var paths = document.querySelectorAll("nav.tree a.path");
            for (var i = 0; i < paths.length; i++) {
                var path:HTMLElement = (<HTMLElement>paths[i]);
                var li:HTMLElement = (<HTMLElement>that.getClosest(path, 'li'));
                li.classList.remove('active');
            }
        }
        var source = that.getController().getModel().getCurrentMediaSource();
        var ajax = new AJAX();
        ajax.get(
            that.getController().getModel().getListDirectoryRequestURL(),
            { s: source, dir: el.getAttribute('data-cd') || '/' },
            function (data) {
                data = JSON.parse(data);
                if(that.getController().getModel().getDebug()) console.log(data);
                that.paintJSON(data);
            },
            true,
            that.getController().getModel().getXHRHeaders()
        );
        
        /*
        ajax.get(that.getController().getModel().getListDirectoryRequestURL(), { s: source, dir: el.getAttribute('data-cd') }, function (data) {
            that.paintJSON(data);
        });
        */
        var li = that.getClosest(el, 'li');
        deactivatePaths();
        li.classList.add('active');
    }
    assignTreeListeners(){
        var that = this;
        var paths = document.querySelectorAll("nav.tree a.path");
        for (var i = 0; i < paths.length; i++) {
            var path = paths[i];
            path.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                that.handleTreePathClicked(this);
            });
        }
        this.assignTreeFolderListeners();
    }
    assignTreeFolderListeners(){
        var that = this;
        var folders = document.querySelectorAll("nav.tree a.folder");
        for (var i = 0; i < folders.length; i++) {
            var folder = folders[i];
            folder.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var _icon = this.querySelector('.fa');
                var _closing = _icon.classList.contains('fa-folder-open');
                var li = that.getClosest(this, 'li');
                var dataCD = this.nextSibling.getAttribute('data-cd') || '/';
                if (_closing) {
                    _icon.classList.remove('fa-folder-open');
                    _icon.classList.remove('icon-folder-open');
                    _icon.classList.add('fa-folder','icon-folder');
                    li.classList.remove('open');
                    
                    if(this.getAttribute('data-open-msg')) this.querySelector('.audible').innerHTML = this.getAttribute('data-open-msg');
                }
                else {
                    _icon.classList.remove('fa-folder');
                    _icon.classList.remove('icon-folder');
                    _icon.classList.add('fa-folder-open');
                    _icon.classList.add('icon-folder-open');
                    li.classList.add('open');
                    if(this.getAttribute('data-close-msg')) this.querySelector('.audible').innerHTML = this.getAttribute('data-close-msg');
                    
                    var e:Event = document.createEvent('CustomEvent');
                    (<any>(e)).initCustomEvent(EurekaModel.EurekaDirectoryOpened, true, true, {
                        cd:that.getController().getModel().getCurrentDirectory(),
                        s:that.getController().getModel().getCurrentMediaSource(),
                        path:dataCD
                    });
                    that.getElement().dispatchEvent(e);
                }
            });
        }
    }
    assignSelectListeners(){
        var that = this;
        var mediaSourceSelect = that.getElement().querySelector('#' + that.getController().getModel().getUID() + '__mediasource-select');
        mediaSourceSelect.addEventListener('change', function () {
            that.getController().getModel().setCurrentMediaSource(this.value, true, that.getController().getModel().useLocalStorage());
            that.getController().getModel().setCurrentDirectory(this.value,false,that.getController().getModel().useLocalStorage());
            var ajax = new AJAX();
            ajax.get(
                that.getController().getModel().getListSourceRequestURL(),
                { s: that.getController().getModel().getCurrentMediaSource() },
                function (data) {
                },
                true,
                that.getController().getModel().getXHRHeaders()
            );
        });
        
        var levelUp:HTMLAnchorElement = <HTMLAnchorElement>(that.getElement().querySelector('.level-up'));
        levelUp.addEventListener('click', function(e){
            e.preventDefault();
            var currentDirectory = that.getController().getModel().getCurrentDirectory();
            var split = currentDirectory.split('/');
            split = split.filter(function (n) { return (n !== undefined && n != ""); });
            if(split && split.length) {
                var destDirectory = '/';
                if(split.length > 1) {
                    split.pop();
                    destDirectory = split.join('/');
                }
                that.getController().getModel().setCurrentDirectory(destDirectory, true, true, false);
            }
        });
    }
    emptyTree(){
        var paths = document.querySelectorAll("nav.tree a.path");
        for (var i = 0; i < paths.length; i++) {
            var path = (<any>paths[i]); // #janky typescript doesn't seem to support <HTMLElement>.remove();
            path.removeEventListener('click');
            path.remove();
        }
    }
    assignDraggableListeners(){
        var kindaDraggables = document.querySelectorAll('*[sorta-draggable="true"]');
        for (var i = 0; i < kindaDraggables.length; i++) {
            var kindaDraggable = kindaDraggables[i];
            kindaDraggable.addEventListener('blur', function (e) {
                this.parentNode.draggable = false;
            });
            kindaDraggable.addEventListener('focus', function (e) {
                this.parentNode.draggable = false;
            });
        }
    }
    assignChooseClickListeners() {
        var that = this;
        
        if(that.getController().getModel().getDebug()) console.log('assignChooseClickListeners');
        
        var rows = that.getElement().querySelectorAll('tr.eureka__row');
        for(var i = 0; i < rows.length; i++) {
            function addDblClickListener(tr:HTMLElement) {
                tr.querySelector('div.image').addEventListener('dblclick',function(e){
                    var image = this;
                
                    (function(){
                        var e:any = <any>(document.createEvent('CustomEvent'));
                        e.initCustomEvent('EurekaFoundIt', true, true, {
                            filename: tr.getAttribute('data-filename'),
                            timestamp: tr.getAttribute('data-timestamp'),
                            src: image.querySelector('img').getAttribute('src'),
                            dimensions: [tr.getAttribute('data-dimensions-w'), tr.getAttribute('data-dimensions-h')],
                            filesize: parseInt(tr.getAttribute('data-filesize-bytes'))
                        });
        
                        that.getController().getView().getElement().dispatchEvent(e);
                    })();
                })
            }
            addDblClickListener(<HTMLElement>(rows[i]));
        }
    }
    paint(){
        this.assignARIAKeyListeners();
        this.assignContextualClickListeners();
        this.assignDraggableListeners();
        this.assignChooseClickListeners();
        this.assignSortBtnListeners();
        //this.assignContextualRowListeners();
    }
    paintTree(data) {
        var that = this;
        data = JSON.parse(data);
        var tree : HTMLElement = <HTMLElement>(that.getElement().querySelector('nav.tree'));
        var results = data.results;
        function printTreeNavResults(results, ul) {
            for (var i = 0; i < results.length; i++) {
                var result = results[i];
                var li = document.createElement('li');
                var folder = document.createElement('a');
                folder.innerHTML = '&nbsp;';
                folder.setAttribute('href', 'javascript:;');
                folder.classList.add('folder');
                folder.setAttribute('data-open-msg','Expand ' + result.path + ' ');
                folder.setAttribute('data-close-msg','Collapse ' + result.path + ' ');
                var folderOpenIcon = document.createElement('i');
                folderOpenIcon.classList.add('fa');
                folderOpenIcon.classList.add('icon');
                folderOpenIcon.classList.add('fa-folder');
                folderOpenIcon.classList.add('icon-folder');
                folder.appendChild(folderOpenIcon);
                (function(){
                    var audible = document.createElement('span');
                    audible.classList.add('audible');
                    audible.innerHTML = folder.getAttribute('data-open-msg');
                    folder.appendChild(audible);
                })();
                var path = document.createElement('a');
                path.classList.add('path');
                path.setAttribute('href', 'javascript:;');
                path.setAttribute('title', 'Browse ' + result.path);
                
                var split = result.path.split('/');
                split = split.filter(function (n) { return (n !== undefined && n != ""); });
                var displayPath = split.join('/');
                if(!that.getController().getModel().getDisplayFullTreePaths()) {
                    displayPath = split[split.length-1];
                } else {
                    if(displayPath[displayPath.length-1] == '/') displayPath = displayPath.substring(0,displayPath.length - 1);
                }
                
                path.setAttribute('data-cd', result.path);
                path.innerHTML = ' ' + displayPath;
                li.appendChild(folder);
                li.appendChild(path);
                var _ul = document.createElement("ul");
                li.appendChild(_ul);
                if (result.children !== undefined && result.children.length) {
                    printTreeNavResults(result.children, _ul);
                }
                ul.appendChild(li);
            }
        }
        tree.innerHTML = '';
        var ul = document.createElement('ul');
        tree.appendChild(ul);
        printTreeNavResults(results, ul);
        this.assignTreeListeners();
        this.recursivelyOpenTreeToCurrentDirectory();
    }
    paintJSON(data) {
        var that = this;
        if(that.getController().getModel().getDebug()) console.log('paintJSON');
        var model = this.getController().getModel();
        var results = data.results;
        var tbodyHTML = '';
        for (var i = 0; i < results.length; i++) {
            var result = results[i];
            var filename = result.filename;
            var safeFileName = filename.replace(/[!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g, '');
            var src = result.src;
            var filesize = result.filesize;
            var dimensions = result.dimensions;
            var editedon = parseInt(result.editedon);
            var tr = document.createElement("tr");
            tr.classList.add('eureka__row');
            //tr.setAttribute('contenteditable', true);
            tr.setAttribute('tabindex', "0");
            tr.setAttribute('data-tokens', '');
            tr.setAttribute('data-filename', filename);
            tr.setAttribute('data-safe-filename', safeFileName);
            tr.setAttribute('data-dimensions-w', dimensions.split('x')[0]);
            tr.setAttribute('data-dimensions-h', dimensions.split('x')[1]);
            tr.setAttribute('data-filesize-bytes', filesize);
            tr.setAttribute('data-timestamp', editedon.toString());
            var td = document.createElement("td");
            td.setAttribute('contenteditable', 'false');
            td.classList.add('eureka__row-image');
            var imgD = document.createElement('div');
            imgD.classList.add('image');
            var img = document.createElement('img');
            img.setAttribute('src', src);
            //img.setAttribute('alt',filename); // after a11y testing this was determined to be unecessary - jp
            imgD.appendChild(img);
            var code = document.createElement('code');
            code.setAttribute('contenteditable', 'true');
            code.setAttribute('tabindex', '-1');
            code.setAttribute('sorta-draggable', 'true');
            code.innerHTML = filename;
            td.appendChild(imgD);
            td.appendChild(code);
            function createCode(html) {
                var tag = document.createElement('code');
                tag.innerHTML = html;
                return tag;
            }
            var tdDimensionCell = document.createElement('td');
            tdDimensionCell.classList.add('eureka__row-dimensions');
            tdDimensionCell.appendChild(createCode(dimensions));
            var tdFilesizeCell = document.createElement('td');
            tdFilesizeCell.classList.add('eureka__row-filesize');
            tdFilesizeCell.appendChild(createCode(that.formatFileSize(filesize)));
            var tdEditedOnCell = document.createElement('td');
            tdEditedOnCell.classList.add('eureka__row-editedon');
            tdEditedOnCell.appendChild(createCode((<any>new Date(editedon * 1000)).toLocaleDateString(model.getLocale(), { //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            })));
            tr.appendChild(td);
            tr.appendChild(tdDimensionCell);
            tr.appendChild(tdFilesizeCell);
            tr.appendChild(tdEditedOnCell);
            tbodyHTML += tr.outerHTML;
        
            function createContextualRow() {
                var tr = document.createElement('tr');
                tr.classList.add('contextual');
                tr.setAttribute('id', 'eureka_contextual__' + safeFileName);
                //tr.setAttribute('tabindex','0');
                var td = document.createElement('td');
                td.setAttribute('colspan', '4');
                function createFlexibleNav() {
                    var nav = document.createElement('nav');
                    nav.classList.add('flexible_row');
                    nav.classList.add('contextual__nav');
                    function createExpandBtn() {
                        var a = document.createElement('a');
                        a.classList.add('expand');
                        a.setAttribute('href', src);
                        a.setAttribute('title', 'Expand ' + filename);
                        a.setAttribute('target', '_blank');
                        a.setAttribute('tabindex', '0');
                        var fa = document.createElement('i');
                        fa.classList.add('fa');
                        fa.classList.add('icon');
                        fa.classList.add('fa-expand');
                        fa.classList.add('icon-expand');
                        a.appendChild(fa);
                        a.innerHTML += ' Expand';
                        return a;
                    }
                    function createChooseBtn() {
                        var a = document.createElement('a');
                        a.classList.add('choose');
                        a.setAttribute('title', 'Choose ' + filename);
                        a.setAttribute('target', '_blank');
                        a.setAttribute('tabindex', '0');
                        var fa = document.createElement('i');
                        fa.classList.add('fa');
                        fa.classList.add('icon');
                        fa.classList.add('fa-check-circle-o');
                        fa.classList.add('icon-check-circle-o');
                        a.appendChild(fa);
                        a.innerHTML += ' Choose';
                        return a;
                    }
                    function createRenameBtn() {
                        var a = document.createElement('a');
                        a.classList.add('rename');
                        a.setAttribute('title', 'Rename ' + filename);
                        a.setAttribute('target', '_blank');
                        a.setAttribute('tabindex', '0');
                        var fa = document.createElement('i');
                        fa.classList.add('fa');
                        fa.classList.add('icon');
                        fa.classList.add('fa-edit');
                        fa.classList.add('icon-edit');
                        a.appendChild(fa);
                        a.innerHTML += ' Rename';
                        return a;
                    }
                    function createTrashBtn() {
                        var a = document.createElement('a');
                        a.classList.add('dangerous');
                        a.classList.add('trash');
                        a.setAttribute('title', 'Delete ' + filename);
                        a.setAttribute('target', '_blank');
                        a.setAttribute('tabindex', '0');
                        var fa = document.createElement('i');
                        fa.classList.add('fa');
                        fa.classList.add('icon');
                        fa.classList.add('fa-trash');
                        fa.classList.add('icon-trash');
                        a.appendChild(fa);
                        a.innerHTML += ' Delete';
                        return a;
                    }
                    nav.appendChild(createExpandBtn());
                    nav.appendChild(createChooseBtn());
                    if (that.getController().getModel().getAllowRename() && document.execCommand)
                        nav.appendChild(createRenameBtn()); // should probably polyfill or just juse a standard text input instead #janky? #shame?
                    if (that.getController().getModel().getAllowDelete())
                        nav.appendChild(createTrashBtn());
                    //nav.appendChild(createFlexibleNavTagForm());
                    //nav.appendChild(createFlexibleNavShareForm());
                    function createFlexibleNavTagForm() {
                        var form = document.createElement('form');
                        form.classList.add('tag');
                        form.setAttribute('method', 'post');
                        form.setAttribute('action', '#');
                        var label = document.createElement('label');
                        label.setAttribute('title', 'Tagging this media item will make it easier to find');
                        var fa = document.createElement('i');
                        fa.classList.add('fa');
                        fa.classList.add('icon');
                        fa.classList.add('fa-tag');
                        fa.classList.add('icon-tag');
                        label.appendChild(fa);
                        label.innerHTML += ' Tag:';
                        var input = document.createElement('input');
                        input.setAttribute('type', 'text');
                        input.setAttribute('placeholder', 'Tag this media item');
                        input.setAttribute('tabindex', '-1');
                        form.appendChild(label);
                        form.appendChild(input);
                        return form;
                    }
                    function createFlexibleNavShareForm() {
                        var form = document.createElement('form');
                        form.classList.add('share');
                        form.setAttribute('action', '#');
                        form.setAttribute('title', "Share " + filename + " with other");
                        form.appendChild(createMediaSourceInput());
                        form.appendChild(createMediaItemInput());
                        var button = document.createElement('button');
                        button.classList.add('nued');
                        button.setAttribute('type', 'submit');
                        button.setAttribute('tabindex', '0');
                        var fa = document.createElement('i');
                        fa.classList.add('fa');
                        fa.classList.add('icon');
                        fa.classList.add('fa-share-square-o');
                        fa.classList.add('icon-share-square-o');
                        button.appendChild(fa);
                        button.innerHTML += ' Share';
                        form.appendChild(button);
                        function createMediaSourceInput() {
                            var input = document.createElement('input');
                            input.setAttribute('type', 'hidden');
                            input.setAttribute('name', 'mediasource');
                            input.setAttribute('value', '0');
                            return input;
                        }
                        function createMediaItemInput() {
                            var input = document.createElement('input');
                            input.setAttribute('type', 'hidden');
                            input.setAttribute('name', 'mediaitem');
                            input.setAttribute('value', filename);
                            return input;
                        }
                        return form;
                    }
                    return nav;
                }
                td.appendChild(createFlexibleNav());
                tr.appendChild(td);
                return tr;
            }
        
            tbodyHTML += createContextualRow().outerHTML;
        }
        var thead:HTMLElement = <HTMLElement>(document.querySelector('#' + this.getController().getModel().getUID() + ' .eureka-table > table > thead'));
        (<HTMLElement>document.querySelector('#' + this.getController().getModel().getUID() + ' .eureka-table')).innerHTML = '<table>' + thead.outerHTML + '<tbody>' + tbodyHTML + '</tbody>' + '</table>';
        // bolden the correct tree item
        try {
            (<HTMLElement>this.getElement().querySelector('nav.tree li.active')).classList.remove('active');
        }
        catch (e) {
        }
        try {
            (function(){
                var el:HTMLElement = (<HTMLElement>that.getElement().querySelector('nav.tree li > a[data-cd="' + data.cd + '"]').parentNode);
                el.classList.add('active');
                el.classList.add('open');
                
                var folder:HTMLElement = (<HTMLElement>el.querySelector('.folder .fa-folder'));
                folder.classList.add('fa-folder-open');
                folder.classList.add('icon-folder-open');
                folder.classList.remove('fa-folder');
            })();
        }
        catch (e) {
        }
        try {
            (<HTMLInputElement>this.getElement().querySelector('.pathbrowser__topbar > select')).value = data.cs;
        }
        catch (e) {
        }
        this.paint();
    }
    assignContextualClickListeners() {
        var that = this;
        that.assignContexualCodeFocusListeners();
        assignChooseListeners();
        assignRenameListeners();
        assignDeleteListeners();
        function assignChooseListeners() {
            var anchors = that.getElement().querySelectorAll('tr.contextual a.choose');
            for (var i = 0; i < anchors.length; i++) {
                var anchor = anchors[i];
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    handleChooseClicked(this);
                }, false);
                anchor.addEventListener('focus', function (e) {
                    (<HTMLElement>(<HTMLElement>that.getElement().parentNode).querySelector('footer.proceed .cta')).classList.add('go');
                    (<HTMLElement>(<HTMLElement>that.getElement().parentNode).querySelector('footer.proceed .cta')).disabled = false;
                    (<HTMLElement>that.getElement().parentNode).querySelector('footer.proceed .cta').removeAttribute('disabled');
                }, false);
                anchor.addEventListener('blur', function (e) {
                    (<HTMLElement>(<HTMLElement>that.getElement().parentNode).querySelector('footer.proceed .cta')).classList.remove('go');
                    //that.getElement().parentNode.querySelector('footer.proceed .cta').disabled = true;
                    //that.getElement().parentNode.querySelector('footer.proceed .cta').setAttribute('disabled','disabled');
                }, false);
                /*anchor.addEventListener('mouseover',function(e) {
                    (<HTMLElement>(<HTMLElement>that.getElement().parentNode).querySelector('footer.proceed .cta')).classList.add('go');
                }, false);
                anchor.addEventListener('mouseout',function(e) {
                    (<HTMLElement>(<HTMLElement>that.getElement().parentNode).querySelector('footer.proceed .cta')).classList.remove('go');
                }, false);*/
            }
            function handleChooseClicked(anchor) {
                var contextual = that.getClosest(anchor, 'tr');
                var mediaRow:HTMLElement = (<HTMLElement>contextual.previousSibling);
                that.getController().getModel().setChoosenMediaItem(mediaRow.getAttribute('data-filename'));
            }
        }
        function assignDeleteListeners() {
            var anchors = document.querySelectorAll('tr.contextual a.trash');
            for (var i = 0; i < anchors.length; i++) {
                var anchor = anchors[i];
                anchor.addEventListener('click', function (e) {
                    handleTrashClicked(this);
                }, false);
                anchor.addEventListener('focus', function (e) {
                    this.addEventListener('keydown', handleTrashKeyDown, false);
                }, false);
                anchor.removeEventListener('blur', function (e) {
                    this.removeEventListener('keydown', handleTrashKeyDown, false);
                }, false);
            }
            function handleTrashClicked(anchor) {
                var contextual:any = that.getClosest(anchor, 'tr');
                var mediaRow:any = (<HTMLElement>contextual.previousSibling);
                var nextRow:HTMLElement = (<HTMLElement>contextual.nextSibling);
                
                // give them a way out
                if(that.getController().getModel().getAlertBeforeDelete() && !window.confirm('Are you sure you want to delete ' + mediaRow.getAttribute('data-filename') + '?')) {
                    return false;
                }
                
                // proceed
                that.getController().getModel().deleteFile(mediaRow.getAttribute('data-filename'), mediaRow);
                
                function remove(el) {
                    try {
                        el.remove();
                    } catch(e) {
                        el.parentNode.removeChild(el); // IE 10 doesn't support HTMLElement.remove()
                    }
                }
                
                remove(mediaRow);
                remove(contextual);
                
                try {
                    nextRow.focus();
                }
                catch (e) { }
            }
            function handleTrashKeyDown(e) {
                if (e.keyCode === 13) {
                    handleTrashClicked(this);
                }
            }
        }
        function assignRenameListeners() {
            var anchors = document.querySelectorAll('tr.contextual a.rename');
            for (var i = 0; i < anchors.length; i++) {
                var anchor = anchors[i];
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    var code = getCodeToFocus(this);
                    selectCode(code);
                }, false);
                anchor.addEventListener('focus', function (e) {
                    this.addEventListener('keydown', handleAnchorKeyDown, false);
                }, false);
                anchor.addEventListener('blur', function (e) {
                    this.removeEventListener('keydown', handleAnchorKeyDown, false);
                }, false);
            }
            function handleAnchorKeyDown(e) {
                var code = getCodeToFocus(this);
                var tr = that.getClosest(this, '.contextual').previousSibling;
                if (e.keyCode === 13) {
                    e.preventDefault();
                    e.stopPropagation();
                    selectCode(code);
                }
            }
            function selectCode(code) {
                code.focus();
                try {
                    code.select(); // if you think about it contenteditable nodes should probably be selectable...
                }
                catch (e) { }
                // consider selecting also
            }
            function getCodeToFocus(anchor) {
                var tr = that.getClosest(anchor, 'tr');
                var mediaRow:HTMLElement = (<HTMLElement>tr.previousSibling);
                var code = mediaRow.querySelector('.eureka__row-image code[contenteditable="true"]');
                return code;
            }
        }
    }
    assignContexualCodeFocusListeners(){
        var that = this;
        var codes = this.getElement().querySelectorAll('tr.eureka__row .eureka__row-image code[contenteditable="true"]');
        for (var i = 0; i < codes.length; i++) {
            var code = (<HTMLElement>codes[i]);
            code.addEventListener('focus', function () {
                this.addEventListener('keydown', handleCodeKeyPress, false);
            }, false);
            function handleCodeKeyPress(e) {
                if (e.keyCode === 13) {
                    e.preventDefault();
                    var tr = this.parentNode.parentNode; // #janky? :/
                    var contextual = tr.nextSibling;
                    var filename = tr.getAttribute('data-filename');
                    code.contentEditable = 'false';
                    var newFilename = this.innerHTML;
                    that.getController().getModel().renameFile(filename, newFilename);
                    var next = contextual.querySelector('nav > a.rename');
                    next.focus();
                    window.getSelection().collapse(next, 0);
                    return false;
                }
                return true;
            }
        }
    }
    // ensure the optgroups are always sorted in order of their respective media source ids
    sortBrowseSelectOptGroupsByMediaSourceId(select) {
        if (select === undefined)
            select = document.getElementById(this.getController().getModel().getUID() + '__browsing').querySelector('select');
        var os = [];
        var optgrps = select.querySelectorAll('optgroup');
        for (var i = 0; i < optgrps.length; i++) {
            os.push(optgrps[i]);
        }
        var optgroups = os.sort(function (a, b) {
            return parseInt(a.getAttribute('data-source')) - parseInt(b.getAttribute('data-source'));
        });
        select.innerHTML = '';
        for (var _i = 0; _i < optgroups.length; _i++) {
            var optgroup = optgroups[_i];
            select.appendChild(optgroup);
        }
    }
    updateMediaSourceListings(data) {
        var that = this;
        
        if(that.getController().getModel().getDebug()) {
            console.log('updateMediaSourceListings: ');
            console.log(data);
        }

        data = JSON.parse(data);
        var id = data.cs;
        var source = this.getController().getModel().getMediaSourceDTOByID(id);
        function updateTreeSelect() {
            if(that.getController().getModel().getDebug()) console.log('updateTreeSelect');
            var select = document.getElementById(that.getController().getModel().getUID() + '__mediasource-select');
            var option = null;
            try {
                option = select.querySelector('option[value="' + id + '"]');
            }
            catch (e) { }
            if (!option) {
                option = document.createElement('option');
                option.setAttribute('value', id);
                option.innerHTML = data.title;
                select.appendChild(option);
            }
        }
        function updateTopBarSelect() {
            if(that.getController().getModel().getDebug()) console.log('updateTopBarSelect');
            var select = document.getElementById(that.getController().getModel().getUID() + '__browsing').querySelector('select');
            if(that.getController().getModel().getDebug()) console.log(select);
            var optgroup = null;
            try {
                optgroup = select.querySelector('optgroup[data-source="' + id + '"]');
            }
            catch (e) { }
            if (!optgroup) {
                optgroup = document.createElement('optgroup');
                optgroup.setAttribute('label', data.title);
                optgroup.setAttribute('data-source', id);
            }
            var results = data.results;
            if(that.getController().getModel().getPrependOptGroupsWithRootOption()) results.unshift({"path":"/"});
            var options = [];
            printOptGroupOptions(results);
            optgroup.innerHTML = '';
            function printOptGroupOptions(results) {
                function serialize(obj) {
                   var str = [];
                   for(var p in obj){
                       if (obj.hasOwnProperty(p)) {
                           str.push((p) + "=" + (obj[p]));
                       }
                   }
                   return str.join("&");
                }
                for (var i = 0; i < results.length; i++) {
                    var result = results[i];
                    var option = document.createElement('option');
                    option.innerHTML = (that.sanitizeDisplayPath(result.path)) ? that.sanitizeDisplayPath(result.path) : result.path;
                    option.setAttribute('value', JSON.stringify({cs:data.cs,cd:that.sanitizeDisplayPath(result.path)}));
                    option.setAttribute('data-cd', result.path);
                    options.push(option);
                    if (result.children && result.children.length)
                        printOptGroupOptions(result.children);
                }
            }
            for (var _i = 0; _i < options.length; _i++) {
                var option = options[_i];
                optgroup.appendChild(option);
            }
            select.appendChild(optgroup);
            that.sortBrowseSelectOptGroupsByMediaSourceId(select);
        }
        updateTreeSelect();
        updateTopBarSelect();
        that.setBrowseSelectValue();
        that.setMediaSourceSelectValue();
    }
    getSelectedOption  (select) {
        var options = select.querySelectorAll('option');
        for(var i = 0; i < options.length; i++) {
            var option = options[i];
            if(option.selected) return option;
        }
    }
    formatFileSize(size:number) : String {
        var sizes = [' Bytes', ' KB', ' MB', ' GB', ' TB', ' PB', ' EB', ' ZB', ' YB'];
        for (var i = 1; i < sizes.length; i++) {
            if (size < Math.pow(1024, i)) return (Math.round((size/Math.pow(1024, i-1))*100)/100) + sizes[i-1];
        }
        return size.toString();
    }
    getClosest(elem:any, selector:string) : HTMLElement {
        var firstChar = selector.charAt(0);

        // Get closest match
        for ( ; elem && elem !== document; elem = elem.parentNode ) {

            // If selector is a class
            if ( firstChar === '.' ) {
                if ( elem.classList.contains( selector.substr(1) ) ) {
                    return elem;
                }
            }

            // If selector is an ID
            if ( firstChar === '#' ) {
                if ( elem.id === selector.substr(1) ) {
                    return elem;
                }
            } 

            // If selector is a data attribute
            if ( firstChar === '[' ) {
                if ( elem.hasAttribute( selector.substr(1, selector.length - 2) ) ) {
                    return elem;
                }
            }

            // If selector is a tag
            if ( elem.tagName.toLowerCase() === selector ) {
                return elem;
            }

        }

        return null;
    }
    
} // end class EurekaView


interface ModelViewObj {
    model: EurekaModel;
    view: EurekaView;
}

class EurekaController {
    private _model:EurekaModel;
    private _view:EurekaView;
    
    getModel() {
        return this._model;
    }
    getView() {
        return this._view;
    }
    
    constructor(public opts:ModelViewObj) {
        this._model = opts.model;
        this._view = opts.view;
    }
    
    init() {
        var that = this;
        
        var eureka:HTMLElement = that.getView().getElement(); // we found it!
        
        if(that.getModel().useLocalStorage()) {
            (function(){
                var mediaSourcesData = that.getModel().getLocalStorage('mediaSourcesData');
                if(mediaSourcesData) {
                    that.getModel().setMediaSourcesData(mediaSourcesData);    
                }
            })();
        
            (function(){
                var mediaSourceData = that.getModel().getLocalStorage(that.getModel().getCurrentMediaSource() + '_mediaSourceData');
                if(mediaSourceData) {
                    that.getView().paintTree(mediaSourceData);
                }
            })();
        
            (function(){
                var directoryData = that.getModel().getLocalStorage('lastDirectoryPainted');
                if(directoryData) {
                    that.getView().paintJSON(JSON.parse(directoryData));
                }
            })();
        }

        // listen for when certain things happen (currently the DOM element itself dispatches the events)
        eureka.addEventListener(EurekaModel.EurekaViewChange, function (e:any) { // #janky
            //that.getModel().setCurrentView(e.currentView, false);
        });
        eureka.addEventListener(EurekaModel.EurekaDirectoryChanged, function (e:any) {
            if(that.getModel().getDebug()) console.log(EurekaModel.EurekaDirectoryChanged);
            var ajax = new AJAX();
            ajax.get(
                that.getModel().getListDirectoryRequestURL(),
                { s: that.getModel().getCurrentMediaSource(), dir: e.detail.currentDirectory || '/' },
                function (data) {
                    if(that.getModel().useLocalStorage()) that.getModel().setLocalStorage('lastDirectoryPainted',data);
                    data = JSON.parse(data);
                    if(that.getModel().getDebug()) console.log(data);
                    that.getView().paintJSON(data);
                },
                true,
                that.getModel().getXHRHeaders()
            );
        });
        eureka.addEventListener(EurekaModel.EurekaMediaSourceChange, function (e:any) {
            if(that.getModel().getDebug()) console.log(EurekaModel.EurekaMediaSourceChange);
            var ajax = new AJAX();
            ajax.get(
                that.getModel().getListSourceRequestURL(),
                { s: e.detail.currentMediaSource },
                function (data) {
                    var d = JSON.parse(data);
                    if(that.getModel().getDebug()) console.log(data);
                    if(d.cs && that.getModel().useLocalStorage()) that.getModel().setLocalStorage(d.cs + '_mediaSourceData',data);
                    that.getView().paintTree(data);
                    if(e.detail.clearDirectory == true) that.getModel().setCurrentDirectory('',true,false); // clear the current directory and trigger a repaint
                },
                true,
                that.getModel().getXHRHeaders()
            );
        });
        eureka.addEventListener(EurekaModel.EurekaMediaSourcesListChange, function (e:any) {
            if(that.getModel().getDebug()) console.log('MediaSourcesListChange: ');
            var sources = e.detail.sources;
            for (var i = 0; i < sources.length; i++) {
                var source = new EurekaMediaSource(sources[i].opts);
                var id = source.getID();
                //var title = source.getTitle();
            
                function requestMediaListings(source:EurekaMediaSource) {
                    if(that.getModel().getDebug()) console.log('requestMediaListings');
                    var id = source.getID();
                    var ajax = new AJAX();
                    ajax.get(
                        that.getModel().getListSourceRequestURL(),
                        { s: id },
                        function (data) {
                            if(that.getModel().getDebug()) console.log(data);
                            that.getView().updateMediaSourceListings(data);
                        },
                        true,
                        that.getModel().getXHRHeaders()
                    );
                }
                requestMediaListings(source);
            }
        });
        if(that.getModel().getDebug()) console.log('MediaSourcesListChange listener added');
        (function(){
            if(that.getModel().getDebug()) console.log('MediaSourcesListChange: ');
            var ajax = new AJAX();
            ajax.get(
                that.getModel().getListSourcesRequestURL(),
                {},
                function (data) {
                    if(that.getModel().getDebug()) console.log(data);
                    if(that.getModel().useLocalStorage()) that.getModel().setLocalStorage('mediaSourcesData',data);
                    that.getModel().setMediaSourcesData(data);
                },
                true,
                that.getModel().getXHRHeaders()
            );
        })();
        
    }
} // end class EurekaController