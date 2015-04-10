var MuckBoot = function(opts) {
    var defaults = {
        id: 'media-browser_0'
    };
    this.opts = extend({}, defaults, opts);

    this.muck();
};

MuckBoot.prototype.muck = function() {
    var eureka = document.createElement('div');
    eureka.classList.add('view-a');
    eureka.classList.add('eureka');
    eureka.setAttribute('id',this.opts.id);

    function createPathBrowser(opts) {
        var nav = document.createElement('nav');
        nav.setAttribute('id','media-browser_0__pathbrowser');
        nav.classList.add('pathbrowser');
        
        function createPathBrowserTopBar() {
            var div = document.createElement('div');
            div.classList.add('pathbrowser__topbar');
            
            var label = document.createElement('label');
            label.setAttribute('for',opts.id + '__mediasource-select');
            
            var heading = document.createElement('h4');
            heading.innerHTML = 'Media Source';
            
            label.appendChild(heading);
            
            var select = document.createElement('select');
            select.setAttribute('id',opts.id + '__mediasource-select');
            select.setAttribute('title','Choose a Media Source to browse');
            
            div.appendChild(label);
            div.appendChild(select);
            
            return div;
        }
        
        function createPathBrowserNavTree() {
            var nav = document.createElement('nav');
            
            nav.classList.add('tree');
            
            var ul = document.createElement('ul');
            nav.appendChild(ul);
            
            return nav;
        }
        
        function createPathBrowserFooter() {
            var footer = document.createElement('footer');
            
            var nav = document.createElement('nav');
            
            function createPathBrowserFooterMediaSourceInput() {
                var input = document.createElement('input');
                input.setAttribute('type','hidden');
                input.setAttribute('name','mediasource'),
                input.setAttribute('value','0');

                return input;
            }
        
            function createPathBrowserFooterMediaPathInput() {
                var input = document.createElement('input');
                input.setAttribute('type','hidden');
                input.setAttribute('name','mediapath'),
                input.setAttribute('value','/');

                return input;
            }
            
            function createPathBrowserFooterCreateNewForm() {
                nav.appendChild(createPathBrowserFooterMediaSourceInput());
                nav.appendChild(createPathBrowserFooterMediaPathInput());
            
                var btn = document.createElement('button');
                btn.setAttribute('type','submit');
                btn.setAttribute('class','nued');
                btn.setAttribute('title','Create a new directory');
            
                var fa = document.createElement('i');
                fa.classList.add('fa');
                fa.classList.add('fa-plus-square');
                
                btn.appendChild(fa);
                
                nav.appendChild(btn);
                
                return nav;
            }
            
            function createPathBrowserFooterUploadForm() {
                var form = document.createElement('form');
                //form.setAttribute('action','#upload');
            
                form.appendChild(createPathBrowserFooterMediaSourceInput());
                form.appendChild(createPathBrowserFooterMediaPathInput());
            
                var btn = document.createElement('button');
                btn.setAttribute('type','submit');
                btn.setAttribute('class','nued');
                btn.setAttribute('title','Create a new directory');
            
                var fa = document.createElement('i');
                fa.classList.add('fa');
                fa.classList.add('fa-upload');
                
                btn.appendChild(fa);

                form.appendChild(btn);

                return form;
            }
            
            
            createPathBrowserFooterCreateNewForm();
            nav.appendChild(createPathBrowserFooterUploadForm());
            
            footer.appendChild(nav);
            
            return footer;
            
        }
        
        nav.appendChild(createPathBrowserTopBar());
        nav.appendChild(createPathBrowserNavTree());
        nav.appendChild(createPathBrowserFooter());
        
        return nav;
    }
    
    function createBrowserStage(opts) {
        var browserStage = document.createElement('div');
        browserStage.setAttribute('id',opts.id + '__stage')
        browserStage.classList.add('stage');
        
        function createEurekaTable() {
            var div = document.createElement('div');
            div.classList.add('eureka-table');
            
            var table = document.createElement('table');
            var thead = document.createElement('thead');
            var tr = document.createElement('tr');
            var ths = [
                ((function() {
                    var th = document.createElement('th');
                    th.innerHTML = 'Name ';
                    
                    var fa = document.createElement('i');
                    fa.classList.add('fa');
                    fa.classList.add('fa-sort');
                    fa.setAttribute('data-sortby','name');
                    fa.setAttribute('data-sort-asc','1');
                    
                    th.appendChild(fa);
                    
                    return th;
                })()),
                ((function() {
                    var th = document.createElement('th');
                    th.innerHTML = 'Dimensions ';
                    
                    var fa = document.createElement('i');
                    fa.classList.add('fa');
                    fa.classList.add('fa-sort');
                    fa.setAttribute('data-sortby','dimensions');
                    fa.setAttribute('data-sort-asc','1');
                    
                    th.appendChild(fa);
                    
                    return th;
                })()),
                ((function() {
                    var th = document.createElement('th');
                    th.innerHTML = 'File Size ';
                    
                    var fa = document.createElement('i');
                    fa.classList.add('fa');
                    fa.classList.add('fa-sort');
                    fa.setAttribute('data-sortby','filesize');
                    fa.setAttribute('data-sort-asc','1');
                    
                    th.appendChild(fa);
                    
                    return th;
                })()),
                ((function() {
                    var th = document.createElement('th');
                    th.innerHTML = 'Edited On ';
                    
                    var fa = document.createElement('i');
                    fa.classList.add('fa');
                    fa.classList.add('fa-sort');
                    fa.setAttribute('data-sortby','editedon');
                    fa.setAttribute('data-sort-asc','1');
                    
                    th.appendChild(fa);
                    
                    return th;
                })())
            ];
            for(var th of ths) tr.appendChild(th);
            
            thead.appendChild(tr);
            table.appendChild(thead);
            
            table.appendChild(document.createElement('tbody'));
            
            div.appendChild(table);
            
            return div;
        }
        
        function createEurekaTopBar() {
            var div = document.createElement('div');
            div.classList.add('eureka__topbar');
            
            function createEurekaTopBarNav() {
                var nav = document.createElement('nav');
                nav.classList.add('eureka__topbar-nav');
                
                function createEurekaTopBarNavToggleBtn() {
                    var a = document.createElement('a');
                    a.setAttribute('id',opts.id + '__pathbrowser_toggle');
                    a.classList.add('pathbrowser_toggle');
                    a.setAttribute('title','Close Navigation Tree');
                    a.setAttribute('data-title-close','Close Navigation Tree');
                    a.setAttribute('data-title-open','Open Navigation Tree');
                    a.setAttribute('data-toggle-target',opts.id + '__pathbrowser');
                    
                    var fa = document.createElement('i');
                    fa.classList.add('fa');
                    fa.classList.add('fa-toggle-left');
                    
                    a.appendChild(fa);
                    
                    return a;
                }
                
                function createEurekaTopbarBrowseSelectForm() {
                    var form = document.createElement('form');
                    form.setAttribute('action','#');
                    form.setAttribute('id',opts.id + '__browsing');
                    
                    var select = document.createElement('select');
                    
                    form.appendChild(select);
                    
                    return form;
                }
                
                function createEurekaTopBarBrowseSelect() {
                    var div = document.createElement('div');
                    div.setAttribute('id',opts.id + '__browse-select');
                    div.classList.add('tablet-p-hidden');
                    div.classList.add('browse-select');
                    
                    var label = document.createElement('label');
                    label.classList.add('tablet-p-hidden');
                    label.classList.add('browse-select');
                    label.setAttribute('for',opts.id + '__browsing');
                    label.innerHTML = 'Browse';

                    div.appendChild(label);
                    div.appendChild(createEurekaTopbarBrowseSelectForm());
                    
                    return div;
                }
                
                function createEurekaTopBarViewBtns() {
                    var div = document.createElement('div');
                    div.classList.add('view-btns');
                    
                    var btns = [
                        (function(){
                            var a = document.createElement('a');
                            a.classList.add('current');
                            a.classList.add('view-a-btn');
                            a.setAttribute('data-view','view-a');
                            a.setAttribute('data-view-target',opts.id);
                            a.setAttribute('asyncronous-title','Tabular Layout displays image thumbnails along with Name, Description, File Size and Edited On columns');
                            
                            var fa = document.createElement('i');
                            fa.classList.add('fa');
                            fa.classList.add('fa-th-list');
                            
                            a.appendChild(fa);
                            
                            return a;
                        })(),
                        (function(){
                            var a = document.createElement('a');
                            a.classList.add('current');
                            a.classList.add('view-b-btn');
                            a.setAttribute('data-view','view-b');
                            a.setAttribute('data-view-target',opts.id);
                            a.setAttribute('asyncronous-title','Thumbnail layout displays a grid of medium sized thumbnails');
                            
                            var fa = document.createElement('i');
                            fa.classList.add('fa');
                            fa.classList.add('fa-th-large');
                            
                            a.appendChild(fa);
                            
                            return a;
                        })(),
                        (function(){
                            var a = document.createElement('a');
                            a.classList.add('current');
                            a.classList.add('view-d-btn');
                            a.setAttribute('data-view','view-d');
                            a.setAttribute('data-view-target',opts.id);
                            a.setAttribute('asyncronous-title','Grid View displays images a grid of large images');
                            
                            var fa = document.createElement('i');
                            fa.classList.add('fa');
                            fa.classList.add('fa-square');
                            
                            a.appendChild(fa);
                            
                            return a;
                        })()
                    ];
                    
                    if(Modernizr !== undefined && !Modernizr.touch) {
                        btns.push(
                            (function(){
                                var a = document.createElement('a');
                                a.classList.add('current');
                                a.classList.add('view-c-btn');
                                a.setAttribute('data-view','view-c');
                                a.setAttribute('data-view-target',opts.id);
                                a.setAttribute('asyncronous-title','Sliver View displays a single row of small thumbnails');
                            
                                var fa = document.createElement('i');
                                fa.classList.add('fa');
                                fa.classList.add('fa-ellipsis-h');
                            
                                a.appendChild(fa);
                                
                                return a;
                            })()
                        );
                    }
                    
                    var nav = document.createElement('nav');
                    
                    for(var btn of btns) nav.appendChild(btn);
                    
                    div.appendChild(nav);
                    
                    return div;
                }
                
                function createEurekaTopbarNavHeader() {
                    var header = document.createElement('header');
                    
                    var h4 = document.createElement('h4');
                    h4.innerHTML = 'Media Content';
                    header.appendChild(h4);
                    
                    header.appendChild(createEurekaTopBarForm());
                    
                    return header;
                }
                
                nav.appendChild(createEurekaTopbarNavHeader());
                
                function createEurekaTopBarNavSelect() {
                    var div = document.createElement('div');
                    div.classList.add('eureka__topbar-nav__select');
                    
                    div.appendChild(createEurekaTopBarNavToggleBtn());
                    div.appendChild(createEurekaTopBarBrowseSelect());
                    div.appendChild(createEurekaTopBarViewBtns());
                    
                    return div;
                }
                
                nav.appendChild(createEurekaTopBarNavSelect());

                return nav;
            }
            
            function createEurekaTopBarForm() {
                var form = document.createElement('form');
                
                var input = document.createElement('input');
                input.setAttribute('id',opts.id + '__filter-images');
                input.setAttribute('type','search');
                input.setAttribute('placeholder','Filter images');
                input.setAttribute('autocomplete','off');
                
                form.appendChild(input);
                
                return form;
            }
            
            div.appendChild(createEurekaTopBarNav());
            
            return div;
        }
        
        function createEurekaTable() {
            var div = document.createElement('div');
            div.classList.add('eureka-table');
            
            var table = document.createElement('table');
            
            var thead = document.createElement('thead');
            
            var tr = document.createElement('tr');
            
            var tbody = document.createElement('tbody');
            
            var ths = [
                (function(){
                    var th = document.createElement('th');
                    
                    th.innerHTML = 'Name ';
                    
                    var fa = document.createElement('i');
                    fa.classList.add('fa');
                    fa.classList.add('fa-sort');
                    fa.setAttribute('data-sortby','name');
                    fa.setAttribute('data-sort-asc','1');
                    
                    th.appendChild(fa);
                    
                    return th;
                })(),
                (function(){
                    var th = document.createElement('th');
                    
                    th.innerHTML = 'Dimensions ';
                    
                    var fa = document.createElement('i');
                    fa.classList.add('fa');
                    fa.classList.add('fa-sort');
                    fa.setAttribute('data-sortby','dimensions');
                    fa.setAttribute('data-sort-asc','1');
                    
                    th.appendChild(fa);
                    
                    return th;
                })(),
                (function(){
                    var th = document.createElement('th');
                    
                    th.innerHTML = 'File Size ';
                    
                    var fa = document.createElement('i');
                    fa.classList.add('fa');
                    fa.classList.add('fa-sort');
                    fa.setAttribute('data-sortby','filesize');
                    fa.setAttribute('data-sort-asc','1');
                    
                    th.appendChild(fa);
                    
                    return th;
                })(),
                (function(){
                    var th = document.createElement('th');
                    
                    th.innerHTML = 'Edited On ';
                    
                    var fa = document.createElement('i');
                    fa.classList.add('fa');
                    fa.classList.add('fa-sort');
                    fa.setAttribute('data-sortby','editedon');
                    fa.setAttribute('data-sort-asc','1');
                    
                    th.appendChild(fa);
                    
                    return th;
                })()
            ];
            
            for(var th of ths) tr.appendChild(th);
            
            thead.appendChild(tr);
            table.appendChild(thead);
            table.appendChild(tbody);
            
            div.appendChild(table);
            
            return div;
        }
        
        browserStage.appendChild(createEurekaTopBar());
        browserStage.appendChild(createEurekaTable());
        
        return browserStage;
    }
    
    function createChooseFooter() {
        var footer = document.createElement('footer');
        footer.classList.add('proceed');
        
        var btns = [
            (function(){
                var btn = document.createElement('button');
                btn.classList.add('muted');
                btn.classList.add('clickable');
                btn.innerHTML = 'Cancel';
                
                return btn;
            })(),
            (function(){
                var btn = document.createElement('button');
                btn.classList.add('btn');
                btn.classList.add('clickable');
                btn.classList.add('cta');
                btn.setAttribute('type','submit');
                btn.innerHTML = 'Choose';
                
                return btn;
            })()
        ];
        
        for(var btn of btns) footer.appendChild(btn);
        
        return footer;
    }

    var pathBrowser = createPathBrowser(this.opts);
    eureka.appendChild(pathBrowser);
    
    var browserStage = createBrowserStage(this.opts);
    eureka.appendChild(browserStage);
    
    var eurekaWrapper = document.createElement('div');
    eurekaWrapper.classList.add('eureka-wrapper');
    
    eurekaWrapper.appendChild(eureka);
    eurekaWrapper.appendChild(createChooseFooter());

    document.getElementById('media-browser_0').outerHTML = eurekaWrapper.outerHTML;
}