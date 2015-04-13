var MuckBoot;
(function () {
    var d = document;
    MuckBoot = function (opts) {
        var defaults = {
            id: 'media-browser_0'
        };
        this.opts = extend({}, defaults, opts);
        this.opts = opts;
        this.muck();
        function extend(target) {
            for (var i = 1; i < arguments.length; ++i) {
                var from = arguments[i];
                if (typeof from !== 'object')
                    continue;
                for (var j in from) {
                    if (from.hasOwnProperty(j)) {
                        target[j] = typeof from[j] === 'object' ? extend({}, target[j], from[j]) : from[j];
                    }
                }
            }
            return target;
        }
    };
    MuckBoot.prototype.muck = function () {
        var eureka = d.createElement('div');
        eureka.classList.add('view-a');
        eureka.classList.add('eureka');
        eureka.setAttribute('id', this.opts.id);
        function createPathBrowser(opts) {
            var nav = d.createElement('nav');
            nav.setAttribute('id', 'media-browser_0__pathbrowser');
            nav.classList.add('pathbrowser');
            function createPathBrowserTopBar() {
                var div = d.createElement('div');
                div.classList.add('pathbrowser__topbar');
                var label = d.createElement('label');
                label.setAttribute('for', opts.id + '__mediasource-select');
                var heading = d.createElement('h4');
                heading.innerHTML = 'Media Source';
                label.appendChild(heading);
                var select = d.createElement('select');
                select.setAttribute('id', opts.id + '__mediasource-select');
                select.setAttribute('title', 'Choose a Media Source to browse');
                div.appendChild(label);
                div.appendChild(select);
                return div;
            }
            function createPathBrowserNavTree() {
                var nav = d.createElement('nav');
                nav.classList.add('tree');
                var ul = d.createElement('ul');
                nav.appendChild(ul);
                return nav;
            }
            function createPathBrowserFooter() {
                var footer = d.createElement('footer');
                var nav = d.createElement('nav');
                function createPathBrowserFooterMediaSourceInput() {
                    var input = d.createElement('input');
                    input.setAttribute('type', 'hidden');
                    input.setAttribute('name', 'mediasource'), input.setAttribute('value', '0');
                    return input;
                }
                function createPathBrowserFooterMediaPathInput() {
                    var input = d.createElement('input');
                    input.setAttribute('type', 'hidden');
                    input.setAttribute('name', 'mediapath'), input.setAttribute('value', '/');
                    return input;
                }
                function createPathBrowserFooterCreateNewForm() {
                    nav.appendChild(createPathBrowserFooterMediaSourceInput());
                    nav.appendChild(createPathBrowserFooterMediaPathInput());
                    var btn = d.createElement('button');
                    btn.setAttribute('type', 'submit');
                    btn.setAttribute('class', 'nued');
                    btn.setAttribute('title', 'Create a new directory');
                    var fa = d.createElement('i');
                    fa.classList.add('fa');
                    fa.classList.add('fa-plus-square');
                    fa.classList.add('icon');
                    fa.classList.add('icon-plus-square');
                    btn.appendChild(fa);
                    nav.appendChild(btn);
                    return nav;
                }
                function createPathBrowserFooterUploadForm() {
                    var form = d.createElement('form');
                    form.appendChild(createPathBrowserFooterMediaSourceInput());
                    form.appendChild(createPathBrowserFooterMediaPathInput());
                    var btn = d.createElement('button');
                    btn.setAttribute('type', 'submit');
                    btn.setAttribute('class', 'nued');
                    btn.setAttribute('title', 'Create a new directory');
                    var fa = d.createElement('i');
                    fa.classList.add('fa');
                    fa.classList.add('fa-upload');
                    fa.classList.add('icon');
                    fa.classList.add('icon-upload');
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
            var browserStage = d.createElement('div');
            browserStage.setAttribute('id', opts.id + '__stage');
            browserStage.classList.add('stage');
            function createEurekaTopBar() {
                var div = d.createElement('div');
                div.classList.add('eureka__topbar');
                function createEurekaTopBarNav() {
                    var nav = d.createElement('nav');
                    nav.classList.add('eureka__topbar-nav');
                    function createEurekaTopBarNavToggleBtn() {
                        var a = d.createElement('a');
                        a.setAttribute('id', opts.id + '__pathbrowser_toggle');
                        a.classList.add('pathbrowser_toggle');
                        a.setAttribute('title', 'Close Navigation Tree');
                        a.setAttribute('data-title-close', 'Close Navigation Tree');
                        a.setAttribute('data-title-open', 'Open Navigation Tree');
                        a.setAttribute('data-toggle-target', opts.id + '__pathbrowser');
                        var fa = d.createElement('i');
                        fa.classList.add('fa');
                        fa.classList.add('fa-toggle-left');
                        fa.classList.add('icon');
                        fa.classList.add('icon-toggle-left');
                        a.appendChild(fa);
                        return a;
                    }
                    function createEurekaTopbarBrowseSelectForm() {
                        var form = d.createElement('form');
                        form.setAttribute('action', '#');
                        form.setAttribute('id', opts.id + '__browsing');
                        var select = d.createElement('select');
                        form.appendChild(select);
                        return form;
                    }
                    function createEurekaTopBarBrowseSelect() {
                        var div = d.createElement('div');
                        div.setAttribute('id', opts.id + '__browse-select');
                        div.classList.add('tablet-p-hidden');
                        div.classList.add('browse-select');
                        var label = d.createElement('label');
                        label.classList.add('tablet-p-hidden');
                        label.classList.add('browse-select');
                        label.setAttribute('for', opts.id + '__browsing');
                        label.innerHTML = 'Browse';
                        div.appendChild(label);
                        div.appendChild(createEurekaTopbarBrowseSelectForm());
                        return div;
                    }
                    function createEurekaTopBarViewBtns() {
                        var div = d.createElement('div');
                        div.classList.add('view-btns');
                        var btns = [
                            (function () {
                                var a = d.createElement('a');
                                a.classList.add('current');
                                a.classList.add('view-a-btn');
                                a.setAttribute('data-view', 'view-a');
                                a.setAttribute('data-view-target', opts.id);
                                a.setAttribute('asyncronous-title', 'Tabular Layout displays image thumbnails along with Name, Description, File Size and Edited On columns');
                                var fa = d.createElement('i');
                                fa.classList.add('fa');
                                fa.classList.add('fa-th-list');
                                fa.classList.add('icon');
                                fa.classList.add('icon-th-list');
                                a.appendChild(fa);
                                return a;
                            })(),
                            (function () {
                                var a = d.createElement('a');
                                a.classList.add('current');
                                a.classList.add('view-b-btn');
                                a.setAttribute('data-view', 'view-b');
                                a.setAttribute('data-view-target', opts.id);
                                a.setAttribute('asyncronous-title', 'Thumbnail layout displays a grid of medium sized thumbnails');
                                var fa = d.createElement('i');
                                fa.classList.add('fa');
                                fa.classList.add('fa-th-large');
                                fa.classList.add('icon');
                                fa.classList.add('icon-th-large');
                                a.appendChild(fa);
                                return a;
                            })(),
                            (function () {
                                var a = d.createElement('a');
                                a.classList.add('current');
                                a.classList.add('view-d-btn');
                                a.setAttribute('data-view', 'view-d');
                                a.setAttribute('data-view-target', opts.id);
                                a.setAttribute('asyncronous-title', 'Grid View displays images a grid of large images');
                                var fa = d.createElement('i');
                                fa.classList.add('fa');
                                fa.classList.add('fa-square');
                                fa.classList.add('icon');
                                fa.classList.add('icon-square');
                                a.appendChild(fa);
                                return a;
                            })()
                        ];
                        if (Modernizr !== undefined && !Modernizr.touch) {
                            btns.push((function () {
                                var a = d.createElement('a');
                                a.classList.add('current');
                                a.classList.add('view-c-btn');
                                a.setAttribute('data-view', 'view-c');
                                a.setAttribute('data-view-target', opts.id);
                                a.setAttribute('asyncronous-title', 'Sliver View displays a single row of small thumbnails');
                                var fa = d.createElement('i');
                                fa.classList.add('fa');
                                fa.classList.add('fa-ellipsis-h');
                                fa.classList.add('icon');
                                fa.classList.add('icon-ellipsis-h');
                                a.appendChild(fa);
                                return a;
                            })());
                        }
                        var nav = d.createElement('nav');
                        for (var i = 0; i < btns.length; i++)
                            nav.appendChild(btns[i]);
                        div.appendChild(nav);
                        return div;
                    }
                    function createEurekaTopbarNavHeader() {
                        var header = d.createElement('header');
                        var h4 = d.createElement('h4');
                        h4.innerHTML = 'Media Content';
                        header.appendChild(h4);
                        header.appendChild(createEurekaTopBarForm());
                        return header;
                    }
                    nav.appendChild(createEurekaTopbarNavHeader());
                    function createEurekaTopBarNavSelect() {
                        var div = d.createElement('div');
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
                    var form = d.createElement('form');
                    var input = d.createElement('input');
                    input.setAttribute('id', opts.id + '__filter-images');
                    input.setAttribute('type', 'search');
                    input.setAttribute('placeholder', 'Filter images');
                    input.setAttribute('autocomplete', 'off');
                    form.appendChild(input);
                    return form;
                }
                div.appendChild(createEurekaTopBarNav());
                return div;
            }
            function createEurekaTable() {
                var div = d.createElement('div');
                div.classList.add('eureka-table');
                var table = d.createElement('table');
                var thead = d.createElement('thead');
                var tr = d.createElement('tr');
                var tbody = d.createElement('tbody');
                var ths = [
                    (function () {
                        var th = d.createElement('th');
                        th.innerHTML = 'Name ';
                        var fa = d.createElement('i');
                        fa.classList.add('fa');
                        fa.classList.add('fa-sort');
                        fa.classList.add('icon');
                        fa.classList.add('icon-sort');
                        fa.setAttribute('data-sortby', 'name');
                        fa.setAttribute('data-sort-asc', '1');
                        th.appendChild(fa);
                        return th;
                    })(),
                    (function () {
                        var th = d.createElement('th');
                        th.innerHTML = 'Dimensions ';
                        var fa = d.createElement('i');
                        fa.classList.add('fa');
                        fa.classList.add('fa-sort');
                        fa.classList.add('icon');
                        fa.classList.add('icon-sort');
                        fa.setAttribute('data-sortby', 'dimensions');
                        fa.setAttribute('data-sort-asc', '1');
                        th.appendChild(fa);
                        return th;
                    })(),
                    (function () {
                        var th = d.createElement('th');
                        th.innerHTML = 'File Size ';
                        var fa = d.createElement('i');
                        fa.classList.add('fa');
                        fa.classList.add('fa-sort');
                        fa.classList.add('icon');
                        fa.classList.add('icon-sort');
                        fa.setAttribute('data-sortby', 'filesize');
                        fa.setAttribute('data-sort-asc', '1');
                        th.appendChild(fa);
                        return th;
                    })(),
                    (function () {
                        var th = d.createElement('th');
                        th.innerHTML = 'Edited On ';
                        var fa = d.createElement('i');
                        fa.classList.add('fa');
                        fa.classList.add('fa-sort');
                        fa.classList.add('icon');
                        fa.classList.add('icon-sort');
                        fa.setAttribute('data-sortby', 'editedon');
                        fa.setAttribute('data-sort-asc', '1');
                        th.appendChild(fa);
                        return th;
                    })()
                ];
                for (var i = 0; i < ths.length; i++)
                    tr.appendChild(ths[i]);
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
            var footer = d.createElement('footer');
            footer.classList.add('proceed');
            var btns = [
                (function () {
                    var btn = d.createElement('button');
                    btn.classList.add('muted');
                    btn.classList.add('clickable');
                    btn.innerHTML = 'Cancel';
                    return btn;
                })(),
                (function () {
                    var btn = d.createElement('button');
                    btn.classList.add('btn');
                    btn.classList.add('clickable');
                    btn.classList.add('cta');
                    btn.setAttribute('disabled', 'disabled');
                    btn.setAttribute('type', 'submit');
                    btn.innerHTML = 'Choose';
                    return btn;
                })()
            ];
            for (var i = 0; i < btns.length; i++)
                footer.appendChild(btns[i]);
            return footer;
        }
        var pathBrowser = createPathBrowser(this.opts);
        eureka.appendChild(pathBrowser);
        var browserStage = createBrowserStage(this.opts);
        eureka.appendChild(browserStage);
        var eurekaWrapper = d.createElement('div');
        eurekaWrapper.classList.add('eureka-wrapper');
        eurekaWrapper.appendChild(eureka);
        eurekaWrapper.appendChild(createChooseFooter());
        d.getElementById(this.opts.id).outerHTML = eurekaWrapper.outerHTML;
    };
})();
//# sourceMappingURL=muckboot.eureka.js.map