var Eureka = function(opts) {
    // model notifies the controller of updates
    var eurekaModel = new EurekaModel(opts);
    
    // view paints the DOM and listens to it
    var eurekaView = new EurekaView({
    });
    
    // controller updates the model and the view
    var eurekaController = new EurekaController({
        model:eurekaModel,
        view:eurekaView
    });
    
    eurekaModel.setController(eurekaController);
    eurekaView.setController(eurekaController);
    
    // fire up the view and add listeners
    eurekaView.init();
    eurekaView.paint();
    
    eurekaController.init();
    
    // cheap way to trigger the eurekaViewChange event
    eurekaModel.setCurrentView(eurekaModel.getCurrentView());
}


                     /*          ___      
 /'\_/`\            /\ \        /\_ \     
/\      \    ___    \_\ \     __\//\ \    
\ \ \__\ \  / __`\  /'_` \  /'__`\\ \ \   
 \ \ \_/\ \/\ \L\ \/\ \L\ \/\  __/ \_\ \_ 
  \ \_\\ \_\ \____/\ \___,_\ \____\/\____\
   \/_/ \/_/\/___/  \/__,_ /\/____/\/___*/
                                          
var EurekaModel = function(opts) {
    //if(EurekaModel.instance !== undefined) return EurekaModel.instance;
    var defaults = {
        locale:'en-US',
        debug:false,
        mediaSource:0,
        currentDirectory:'',
        currentView:'view-a',
        uid:'media-browser_0'
    };
    
    //this.view = null;
    this.controller = null;
    
    opts = opts !== undefined ? opts : defaults;

    //this.setCurrentMediaSource(opts.mediaSource !== undefined ? opts.mediaSource : 0);
    //this.setLocale(opts.locale !== undefined ? opts.locale : 'en-US');
    //this.setCurrentView(opts.currentView !== undefined ? opts.currentView : 'view-a');
    
    this.opts = extend({}, opts, defaults);
    
    //EurekaModel.instance = this;
};

/*EurekaModel.prototype.getView = function() {
    return this.view;
}

EurekaModel.prototype.setView = function(view) {
    this.view = view;
}*/
EurekaModel.prototype.getController = function() {
    return this.controller;
}

EurekaModel.prototype.setController = function(controller) {
    this.controller = controller;
}

EurekaModel.prototype.getUID = function() {
    return this.opts.uid;
};

EurekaModel.prototype.setUID = function(uid) {
    this.opts.uid = uid;
};

EurekaModel.prototype.setCurrentMediaSource = function(currentMediaSource) {
    this.opts.currentMediaSource = currentMediaSource;
};

EurekaModel.prototype.getCurrentMediaSource = function() {
    return this.opts.currentMediaSource;
};

EurekaModel.prototype.setCurrentDirectory = function(currentDirectory) {
    this.opts.currentDirectory = currentDirectory;
};

EurekaModel.prototype.getCurrentDirectory = function() {
    return this.opts.currentDirectory;
};

EurekaModel.prototype.setCurrentView = function(currentView) {
    this.opts.currentView = currentView;
    
    var e = new Event('eurekaViewChange');
    e.currentView = this.currentView;
    document.dispatchEvent(e);
};

EurekaModel.prototype.getCurrentView = function() {
    return this.opts.currentView;
};

EurekaModel.prototype.setLocale = function(locale) {
    this.opts.locale = locale;
};

EurekaModel.prototype.getLocale = function() {
    return this.opts.locale;
};

EurekaModel.prototype.setData = function(data) {
    data = JSON.parse(data);

    var results = data.results;
    
    var tbodyHTML = '';
    
    for(var i = 0; i < results.length; i++) {
        var result = results[i];
        
        var filename = result.filename;
        var src = result.src;
        var filesize = result.filesize;
        var dimensions = result.dimensions;
        var editedon = parseInt(result.editedon);
        
        var tr = document.createElement("tr");
        tr.setAttribute('contenteditable',true);
        tr.setAttribute('data-tokens','');
        tr.setAttribute('data-filename',filename);
        tr.setAttribute('data-dimensions-w',dimensions.split('x')[0]);
        tr.setAttribute('data-dimensions-h',dimensions.split('x')[1]);
        tr.setAttribute('data-filesize-bytes',filesize);
        tr.setAttribute('data-timestamp',editedon);
        
            var td = document.createElement("td");
            td.setAttribute('contenteditable',true);
            td.classList.add('eureka__row-image');
        
                var imgD = document.createElement('div');
                imgD.classList.add('image');
        
                    var img = document.createElement('img');
                    img.setAttribute('src',src);
            
                imgD.appendChild(img);
        
                var code = document.createElement('code');
                code.setAttribute('contenteditable',false);
                code.setAttribute('tabfocus','-1');
                code.setAttribute('sorta-draggable',true);
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
            tdFilesizeCell.appendChild(createCode(formatFileSize(filesize)));
        
            var tdEditedOnCell = document.createElement('td');
            tdEditedOnCell.classList.add('eureka__row-editedon');
            tdEditedOnCell.appendChild(createCode(new Date(editedon * 1000).toLocaleDateString(this.getLocale(),{
                month:'short',
                day:'numeric',
                year:'numeric'
            })));
        
        tr.appendChild(td);
        tr.appendChild(tdDimensionCell);
        tr.appendChild(tdFilesizeCell);
        tr.appendChild(tdEditedOnCell);
        
        tbodyHTML += tr.outerHTML;
    }
    
    document.querySelector('#media-browser_0 .eureka-table > table > tbody').innerHTML = tbodyHTML;
};








 /*  __                            
/\ \/\ \  __                       
\ \ \ \ \/\_\     __   __  __  __  
 \ \ \ \ \/\ \  /'__`\/\ \/\ \/\ \ 
  \ \ \_/ \ \ \/\  __/\ \ \_/ \_/ \
   \ `\___/\ \_\ \____\\ \___x___/'
    `\/__/  \/_/\/____/ \/__//_*/  
                                   
var EurekaView = function(opts) {
    opts = opts !== undefined ? opts : {
        //model:new EurekaModel()
    };
    //if(typeof opts.model !== 'object') throw new Error('EurekaView requires an instance of EurekaModel to be supplied as opts.model in the constructor')
    
    this.opts = opts;
}

EurekaView.prototype.getController = function() {
    return this.controller;
}

EurekaView.prototype.setController = function(controller) {
    this.controller = controller;
}

EurekaView.prototype.init = function() {
    document.getElementById('media-browser_0__pathbrowser_toggle').addEventListener('click',function(e){
        e.preventDefault();
        var el = document.getElementById(this.getAttribute('data-toggle-target'));
        if(el.classList.contains('hidden')) {
            el.classList.remove('hidden');
            document.querySelectorAll('#media-browser_0 .browse-select')[0].classList.add('tablet-p-hidden');
        } else {
            el.classList.add('hidden');
            document.querySelectorAll('#media-browser_0 .browse-select')[0].classList.remove('tablet-p-hidden');
        }
        var toggle = this.getElementsByTagName("i")[0];
        if(toggle.classList.contains('fa-toggle-right')) {
            toggle.classList.remove('fa-toggle-right');
            toggle.classList.add('fa-toggle-left');
            this.title = this.getAttribute('data-title-close');
        } else {
            toggle.classList.add('fa-toggle-right');
            toggle.classList.remove('fa-toggle-left');
            this.title = this.getAttribute('data-title-open');
        }
    });
    
    this.assignViewButtonListeners();
}

EurekaView.prototype.assignViewButtonListeners = function() {
    var model = this.getController().getModel();
    function setCurrent(el) {
        var anchors = document.querySelectorAll(".eureka__topbar-nav .view-btns a[data-view]");
        for(var i = 0; i < anchors.length; i++) {
            var anchor = anchors[i];
            anchor.classList.remove('current');
        }
        el.classList.add('current');
    }
    var anchors = document.querySelectorAll(".eureka__topbar-nav .view-btns a[data-view]");
    for (var i = 0; i < anchors.length; i++) {
      var current = anchors[i];
      current.addEventListener('click', function(e){
          e.preventDefault();

          var that = this;
          var _v = this.getAttribute('data-view');

          var classes = ['view-a','view-b','view-c','view-d'];                          
          for(var c of classes) document.getElementById(that.getAttribute('data-view-target')).classList.remove(c);

          document.getElementById(that.getAttribute('data-view-target')).classList.add(_v);
      
          setCurrent(that);
          
          model.setCurrentView(_v);
      }, true);
    }
}

EurekaView.prototype.assignARIAKeyListeners = function() {
    // ARIA focus support for non-contextual rows
    (function() {
        function setFocused(el) {
            var rows = document.querySelectorAll(".eureka-table tbody > tr:not(.contextual)");
            for (var i = 0; i < rows.length; i++) {
                var current = rows[i];
                if(el !== current && current.classList.contains("focused")) current.classList.remove('focused');
            }
            el.classList.add('focused');
        }
        var rows = document.querySelectorAll(".eureka-table tbody > tr:not(.contextual)");
        for (var i = 0; i < rows.length; i++) {
          var current = rows[i];
          current.addEventListener('focus', function(e){
              e.preventDefault();
              
              var _as = document.querySelectorAll(".eureka-table tbody > tr:not(.contextual)");
              setFocused(this);
              
          }, false);
        }
    }());
}

EurekaView.prototype.assignSortBtnListeners = function() {
    var sortBtns = document.querySelectorAll('.eureka-table th .fa-sort');
    for(var i = 0; i < sortBtns.length; i++) {
        var sortBtn = sortBtns[i];
        sortBtn.addEventListener('click',function(e) {
            e.preventDefault();

            // toggle between 0 and 1
            this.setAttribute('data-sort-asc',Math.abs(parseInt(this.getAttribute('data-sort-asc')) - 1));

            var sortby = this.getAttribute('data-sortby');
            var sortASC = (this.getAttribute('data-sort-asc') == "1") ? true : false;

            var rows = [];

            var rs = document.querySelectorAll('.eureka-table tbody > tr:not(.contextual)');
            for(var i = 0; i < rs.length; i++) {
                rows.push(rs[i]);
            }

            switch(sortby) {
            case 'dimensions':
                rows.sort(function(a, b) {
                    return (parseInt(a.getAttribute('data-dimensions-w')) * parseInt(a.getAttribute('data-dimensions-h'))) - (parseInt(b.getAttribute('data-dimensions-w')) * parseInt(b.getAttribute('data-dimensions-h')));
                });
            break;

            case 'filesize':
                rows.sort(function(a, b) {
                    return parseInt(a.getAttribute('data-filesize-bytes')) - parseInt(b.getAttribute('data-filesize-bytes'));
                });
            break;

            case 'editedon':
                rows.sort(function(a, b) {
                    return parseInt(a.getAttribute('data-timestamp')) - parseInt(b.getAttribute('data-timestamp'));
                });
            break;

            default:
                rows.sort(function(a, b) {
                    if(a.getAttribute('data-filename') > b.getAttribute('data-filename')) return 1;
                    if(a.getAttribute('data-filename') < b.getAttribute('data-filename')) return -1;
                    return 0;
                });
            break;
            }

            if(!sortASC) {
                rows.reverse();
            }

            var s = '';
            for(var row of rows) {
                s += row.outerHTML;
            }

            document.querySelectorAll('.eureka-table tbody')[0].innerHTML = s;
        });
    }
}

EurekaView.prototype.assignFilterListeners = function() {
    var that = this;
    function unFilterView() {
        var rows = document.querySelectorAll(".eureka-table tbody > tr:not(.contextual)");
        for(var i = 0; i < rows.length; i++) {
            var row = rows[i];
            row.classList.remove('hidden');
        }
        
        document.getElementById(that.getController().getModel().getUID()).querySelector('.eureka-table > table > tbody').classList.remove('filtered');
    }
    function filterView(value) {
        var rows = document.querySelectorAll(".eureka-table tbody > tr:not(.contextual)");
        for(var i = 0; i < rows.length; i++) {
            var row = rows[i];
            var show = false;
            if(row.getAttribute('data-tokens')) {
                var tokens = row.getAttribute('data-tokens').split('||');
                tokens.push(row.getAttribute('data-filename'));

                for(var token of tokens) {

                    if(value.length && (token == value || token.indexOf(value) > -1)) {
                        show = true;
                        break;
                    }
                }
            }

            if(!show) {
                row.classList.add('hidden');
                row.classList.remove('visible');
            } else {
                row.classList.add('visible');
                row.classList.remove('hidden');
            }
            
            document.getElementById(that.getController().getModel().getUID()).querySelector('.eureka-table > table > tbody').classList.add('filtered');
        }
    }

    var input = document.getElementById('media-browser_0__filter-images');
    input.addEventListener("input", function(e) {
        if(this.value) {
            filterView(this.value);
        }
        else {
            unFilterView();
        }
    }, false);
}

EurekaView.prototype.populateTree = function(data) {
    var s = '';
    
    function PrintResults(results,ul) {
        for(var i = 0; i < results.length; i++) {
            var result = results[i];

            var split = result.path.split('/');
            split = split.filter(function(n){ return (n !== undefined && n != "") }); 
            var displayPath = split.join('/');
            
            var li = document.createElement('li');
            
            var folder = document.createElement('a');
            folder.classList.add('folder');
            
            var fa = document.createElement('i');
            fa.classList.add('fa');
            fa.classList.add('fa-folder');
            fa.classList.add('folder');
            folder.appendChild(fa);
            folder.innerHTML += '&nbsp;';
            
            var path = document.createElement('a');
            path.innerHTML = displayPath;
            path.setAttribute('title','Browse ' + result.path);
            path.setAttribute('data-cd',result.path);
            path.classList.add('path');
            li.appendChild(folder);
            li.appendChild(path);
            
            if(result.children !== undefined && result.children.length) {
                var _ul = document.createElement("ul");
                PrintResults(result.children,_ul);
                li.appendChild(_ul);
            }
            
            ul.appendChild(li);
        }
    }

    data = JSON.parse(data);
    
    var results = data.results;
    var _ul = document.querySelector('#media-browser_0__pathbrowser nav.tree > ul');
    this.emptyTree();
    _ul.innerHTML = '';
    PrintResults(results,_ul);
    
    this.assignTreeListeners();
}

EurekaView.prototype.getElement = function() {
    console.log('getElement');
    return document.getElementById(this.getController().getModel().getUID());
}

EurekaView.prototype.assignTreeListeners = function() {    
    console.log('assignTreeListeners');
    var that = this;
    
    var paths = document.querySelectorAll("nav.tree a.path");
    for (var i = 0; i < paths.length; i++) {
        var path = paths[i];
        path.addEventListener('click', function(e) {
            function deactivatePaths() {
                var paths = document.querySelectorAll("nav.tree a.path");
                for (var i = 0; i < paths.length; i++) {
                    var path = paths[i];
                    var li = getClosest(path,'li');
                    li.classList.remove('active');
                }
            }
            e.preventDefault();
            e.stopPropagation();
    
            var source = that.getController().getModel().getCurrentMediaSource();

            ajax.get('fakepi/listdirectory.php', {s: source,dir:this.getAttribute('data-cd')}, function(data) {
                that.getController().getModel().setData(data);
            });

            var li = getClosest(this,'li');

            deactivatePaths();
            li.classList.add('active');
        });
    }
    
    
    this.assignTreeFolderListeners();
    this.assignSelectListeners();
};

EurekaView.prototype.assignMediaBrowserOptGroupListeners = function() {
    var that = this;
    
    var select = document.querySelector('#media-browser_0__browsing select');
    select.addEventListener('change',function(){
        var selected = getSelectedOption(select); //querySelector('option:selected') errors out
        // update the model to reflect the now current media source
        that.getController().getModel().setCurrentMediaSource(getClosest(selected,'optgroup').getAttribute('data-source'));

        // fetch current media source's directories
        ajax.get('fakepi/listsource.php', {s: that.getController().getModel().getCurrentMediaSource()}, function(data) {
            that.getController().getView().populateTree(data);
        });

    });
};

EurekaView.prototype.assignTreeFolderListeners = function() {
    console.log('assignTreeFolderListeners');
    var folders = document.querySelectorAll("nav.tree a.folder");
    for(var i = 0; i < folders.length; i++) {
        var folder = folders[i];
        console.log(folder);
        folder.addEventListener('click',function(e){
            e.preventDefault();
            e.stopPropagation();
            
            var _icon = this.querySelector('.fa');

            var _closing = _icon.classList.contains('fa-folder-open');

            var li = getClosest(this,'li');
            if(_closing) {
                _icon.classList.remove('fa-folder-open');
                _icon.classList.add('fa-folder');

                li.classList.remove('open');
            } else {
                _icon.classList.remove('fa-folder');
                _icon.classList.add('fa-folder-open');

                li.classList.add('open');
            }
        });
    }
};

EurekaView.prototype.assignSelectListeners = function() {
    var that = this;
    
    var mediaSourceSelect = document.getElementById('media-browser_0__mediasource-select');
    mediaSourceSelect.addEventListener('change',function(){
        that.getController().getModel().setCurrentMediaSource(this.value);
        ajax.get('fakepi/listsource.php', {s: that.getController().getModel().getCurrentMediaSource().toString()}, function(data) {
            that.getController().getView().populateTree(data);
        });
    });
};

EurekaView.prototype.emptyTree = function() {
    var paths = document.querySelectorAll("nav.tree a.path");
    for (var i = 0; i < paths.length; i++) {
        var path = paths[i];
        path.removeEventListener('click');
        
        path.remove();
    }
};

EurekaView.prototype.assignDraggableListeners = function() {
    var kindaDraggables = document.querySelectorAll('*[sorta-draggable="true"]');
    for(var i = 0; i < kindaDraggables.length; i++) {
        var kindaDraggable = kindaDraggables[i];
        kindaDraggable.addEventListener('blur',function(e){
            this.parentNode.draggable = false;
        });
        kindaDraggable.addEventListener('focus',function(e){
            this.parentNode.draggable = false;
        });
    }
}

EurekaView.prototype.paint = function() {
    this.assignTreeListeners();
    this.assignMediaBrowserOptGroupListeners();
    this.assignFilterListeners();
    this.assignSortBtnListeners();
    this.assignARIAKeyListeners();
    this.assignDraggableListeners();
}













 /*__                    __                 ___    ___                   
/\  _`\                 /\ \__             /\_ \  /\_ \                  
\ \ \/\_\    ___     ___\ \ ,_\  _ __   ___\//\ \ \//\ \      __   _ __  
 \ \ \/_/_  / __`\ /' _ `\ \ \/ /\`'__\/ __`\\ \ \  \ \ \   /'__`\/\`'__\
  \ \ \L\ \/\ \L\ \/\ \/\ \ \ \_\ \ \//\ \L\ \\_\ \_ \_\ \_/\  __/\ \ \/ 
   \ \____/\ \____/\ \_\ \_\ \__\\ \_\\ \____//\____\/\____\ \____\\ \_\ 
    \/___/  \/___/  \/_/\/_/\/__/ \/_/ \/___/ \/____/\/____/\/____/ \/*/ 
                                                                         
var EurekaController = function(opts) {
    opts = opts !== undefined ? opts : {
    };
    
    this.opts = opts;
    
    this.view = null;
    this.model = null;
    
    if(this.opts.model !== undefined) this.setModel(this.opts.model);
    if(this.opts.view !== undefined) this.setView(this.opts.view);
}

EurekaController.prototype.getModel = function() {
    return this.model;
}

EurekaController.prototype.setModel = function(model) {
    this.model = model;
}

EurekaController.prototype.getView = function() {
    return this.view;
}

EurekaController.prototype.setView = function(view) {
    this.view = view;
}

EurekaController.prototype.init = function() {
    /*var eureka = this.opts.model.getView().getElement(); // we found it!
    
    eureka.addEventListener('eurekaViewChange',function(e){
        console.log(e.currentView);
        
    });
    */
}