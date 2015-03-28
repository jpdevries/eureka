<?php include 'functions.php';?><!doctype html>
<!-- if you like markup please stop by and say hello over at http://markup.tips -->
<html class="no-js" lang="">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title></title>
        <meta name="description" content="HTML-first crack at a Flexible Media Browser">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link rel="stylesheet" href="assets/css/main.css">
        <script src="assets/js/vendor/modernizr-2.8.3.min.js"></script>
        
        <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" async>
    </head>
    <body>
        <div id="page-wrapper">            
            <div class="eureka-wrapper"><!-- Eureka Media Browser -->
                <div class="view-a eureka" id="media-browser_0" style="max-height:42em"><!-- just to show how it can be condensed when needed (think modal) -->
                    <!-- so i started using html imports, which are *awesome*, but i decided to pull them out for now -->
                    <!-- import our pathbrowser component using html5 imports -->
                    <!--script>
                        document.write('<div id="yolo" class="pathbrowser"></div>');
                        if(!Modernizr.touch) document.write('<link id="pathbrowser-import" rel="import" data-import-selector=".pathbrowser" href="pathbrowser.php">');
                    </script--><!-- must use rel="import" http://www.html5rocks.com/en/tutorials/webcomponents/imports/ -->
                    <!-- add our import to the DOM -->
                    <!-- initially open, this side navigation adds a a/synchronous tree browser to traverse media source directories  -->
                    <nav id="media-browser_0__pathbrowser" class="pathbrowser">
                        <div class="pathbrowser__topbar">
                            <label for="media-browser_0__mediasource-select" style="display:none">Media Source</label>
                            <select id="media-browser_0__mediasource-select" title="Choose a Media Source to browse">
                                <!-- media sources -->
                                <option value="0">Filesystem</option>
                                <option value="1">Assets</option>
                                <option value="2">Amazon S3</option>
                            </select>
                        </div>
                        <!-- navigation tree -->
                        <nav class="tree">
                            <ul>
                                <li class="open">
                                    <a href="#" title="Browse assets"><i class="fa fa-folder-open"></i>&nbsp;assets</a>
                                    <ul>
                                        <li class="active">
                                            <a href="#" title="Browse assets/images">
                                                <i class="fa fa-folder-open"></i>&nbsp;images
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <a href="#" title="Browse uploads">
                                        <i class="fa fa-folder"></i>&nbsp;uploads
                                    </a>
                                </li>
                            </ul>
                        </nav>
                        <!-- upload & create directory buttons -->
                        <footer>
                            <nav>
                                <form action="#" title="Create a new directory in assets/images">
                                    <input type="hidden" name="mediasource" value="0">
                                    <input type="hidden" name="mediapath" value="assets/images">
                                    <button type="submit" class="nued">
                                        <i class="fa fa-plus-square"></i>
                                    </button>
                                </form>
                                <form action="#" title="Upload media to assets/images">
                                    <input type="hidden" name="mediasource" value="0">
                                    <input type="hidden" name="mediapath" value="assets/images">
                                    <button type="submit" class="nued">
                                        <i class="fa fa-upload"></i>
                                    </button>
                                </form>
                            </nav>
                        </footer>
                    </nav>
                    <!-- our main stage area for browsing -->
                    <div id="media-browser_0__stage" class="stage">
                        <div class="eureka__topbar">
                            <nav class="eureka__topbar-nav" style="opacity:1" title="Please enable JavaScript to change layouts" asyncronously-obsolete="title"><!-- removes the title attribute for .js users -->
                                <!-- closing the navigation tree is an asynchronous interaction we only add the button if .js is available  -->
                                <script>document.write('<a id="media-browser_0__pathbrowser_toggle" title="Close Navigation Tree" data-title-close="Close Navigation Tree" data-title-open="Open Navigation Tree" data-toggle-target="media-browser_0__pathbrowser"><i class="fa fa-toggle-left"></i></a>');</script>
                                <script>
                                (function(){
                                    document.getElementById('media-browser_0__pathbrowser_toggle').addEventListener('click',function(e){
                                        e.preventDefault();
                                        var el = document.getElementById(this.getAttribute('data-toggle-target'));
                                        if(el.classList.contains('hidden')) {
                                            el.classList.remove('hidden');
                                            document.querySelectorAll('#media-browser_0 .browse-select')[0].classList.add('hidden');
                                        } else {
                                            el.classList.add('hidden');
                                            document.querySelectorAll('#media-browser_0 .browse-select')[0].classList.remove('hidden');
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
                                }());
                                </script>
                                <!-- when the navigation tree is closed this accessible a/synchronous form will be available to change directories  -->
                                <div id="media-browser_0__browse-select" class="hidden browse-select">
                                    <label for="media-browser_0__browsing" class="browsing">Browse:</label>
                                    <form aciton="#" id="media-browser_0__browsing">
                                        <select>
                                            <!-- each media source is an optgroup -->
                                            <optgroup label="Filesystem">
                                                <option>assets</option>
                                                <option>assets/images</option>
                                            </optgroup>
                                            <optgroup label="Assets">
                                                <option>assets</option>
                                                <option>assets/images</option>
                                            </optgroup>
                                            <optgroup label="Amazon S3">
                                                <option>uploads</option>
                                            </optgroup>
                                        </select>
                                        <!-- synchronous .no-js users need a submit button -->
                                        <noscript>
                                            <button type="submit" class="nued">Go&nbsp;<i class="fa fa-chevron-right"></i></button>
                                        </noscript>
                                    </form>
                                </div>
                                <!-- these buttons change our layouts when clicked. notice we only assign them titles for .js users -->
                                <a class="current" data-view="view-a" data-view-target="media-browser_0" asyncronous-title="Tabular Layout displays image thumbnails along with Name, Description, File Size and Edited On columns">
                                    <i class="fa fa-th-list"></i>
                                </a>
                                <a data-view="view-b" data-view-target="media-browser_0" asyncronous-title="Thumbnail layout displays a grid of medium sized thumbnails">
                                    <i class="fa fa-th-large"></i>
                                </a>
                                <a data-view="view-d" data-view-target="media-browser_0" asyncronous-title="Grid View displays images a grid of large images">
                                    <i class="fa fa-square"></i>
                                </a>
                                <a data-view="view-c" data-view-target="media-browser_0" asyncronous-title="Sliver View displays a single row of small thumbnails">
                                    <i class="fa fa-ellipsis-h"></i>
                                </a>
                            </nav>
                            <script>
                            (function() {
                                function setCurrent(el) {
                                    var anchors = document.querySelectorAll(".eureka__topbar-nav > a[data-view]");
                                    for(var i = 0; i < anchors.length; i++) {
                                        var anchor = anchors[i];
                                        anchor.classList.remove('current');
                                    }
                                    el.classList.add('current');
                                }
                                var anchors = document.querySelectorAll(".eureka__topbar-nav > a[data-view]");
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
                                  }, true);
                                }
                            }());
                            </script>
                            <form>
                                <!-- this input is disabled for .no-js users and displays a subtle Please enable JavaScript message -->
                                <!-- .js is used to decorate this form. notice the js-enabled attribute with removes the disabled attribute. Also notice the asyncronous-placeholder with changes the placeholder for .js users -->
                                <input id="media-browser_0__filter-images" disabled js-enabled type="search" placeholder="Please enable JavaScript" asyncronous-placeholder="Filter images">
                            </form>
                            <script>
                            (function() {
                                function unFilterView() {
                                    var rows = document.querySelectorAll(".eureka-table tbody > tr:not(.contextual)");
                                    for(var i = 0; i < rows.length; i++) {
                                        var row = rows[i];
                                        row.classList.remove('hidden');
                                    }
                                    document.querySelectorAll('#media-browser_0 .eureka-table > table > tbody')[0].classList.remove('filtered');
                                }
                                function filterView(value) {
                                    var rows = document.querySelectorAll(".eureka-table tbody > tr:not(.contextual)");
                                    for(var i = 0; i < rows.length; i++) {
                                        var row = rows[i];
                                        var show = false;
                                        if(row.getAttribute('data-tokens')) {
                                            var tokens = row.getAttribute('data-tokens').split('||');
                                            for(var token of tokens) {
                                                if(value.length && (token == value || token.indexOf(value) > -1)) {
                                                    show = true;
                                                    break;
                                                }
                                            }
                                        }
                                        (!show) ? row.classList.add('hidden') : row.classList.add('visible');
                                        document.querySelectorAll('#media-browser_0 .eureka-table > table > tbody')[0].classList.add('filtered');
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
                            }());
                            </script>
                        </div>
                        <!-- tabular data is marked up using nothing other than <table>. Party like it's 1999. -->
                        <div class="eureka-table">
                            <table>
                                <thead>
                                    <tr>
                                        <!--  the ability to sort rows requires javascript -->
                                        <th>Name&nbsp;<script>document.write('<i class="fa fa-sort" data-sortby="name" data-sort-asc="1"></i>')</script></th>
                                        <th>Dimensions&nbsp;<script>document.write('<i class="fa fa-sort" data-sortby="dimensions" data-sort-asc="1"></i>')</script></th>
                                        <th>File Size&nbsp;<script>document.write('<i class="fa fa-sort" data-sortby="filesize" data-sort-asc="1"></i>')</script></th>
                                        <th>Edited On&nbsp;<script>document.write('<i class="fa fa-sort" data-sortby="editedon" data-sort-asc="1"></i>')</script></th>
                                    </tr>
                                    <script>
                                    (function(){
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
                                    }());
                                    </script>
                                </thead>
                                <tbody>
                                    <!-- so each media item has TWO ROWS. a persistent tr.eureka__row followed by a tr.contextual row that displays expand, tag, share, rename, and delete options -->
                                    <!-- notice the data attributes, particularly data-tokens which is a || delimited list of typeahead tokens to filter results by -->
                                    <tr contenteditable class="eureka__row" data-filename="DSC02396.jpg" data-tokens="hawaii||DSC02396.jpg||w=400||h=400" data-dimensions-w="400" data-dimensions-h="400" data-filesize-bytes="408600" data-timestamp="1427428986405">
                                        <td contenteditable="false" class="eureka__row-image">
                                            <div class="image">
                                                <input contenteditable="false" only-syncronous type="radio" name="file">
                                                <img src="http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02396.jpg">
                                            </div>
                                            <code contenteditable="false" tabfocus="-1" sorta-draggable="true">DSC02396.jpg</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <code>600x600</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <code>400kb</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <time>3/10/1986</time>
                                        </td>
                                    </tr>
                                    <?php contextual_row('DSC02396.jpg'); ?>
                                    <tr contenteditable class="eureka__row" data-filename="DSC02398.jpg" data-tokens="hawaii||DSC02398.jpg||w=600||h=600" data-dimensions-w="600" data-dimensions-h="600" data-filesize-bytes="429600" data-timestamp="1427428986405">
                                        <td contenteditable="false"  class="eureka__row-image">
                                            <div class="image"><input contenteditable="false" only-syncronous type="radio" name="file"><img src="http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02398.jpg"></div>
                                            <code contenteditable="false" tabfocus="-1" sorta-draggable="true">DSC02398.jpg</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <code>600x600</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <code>400kb</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <time>3/10/1986</time>
                                        </td>
                                    </tr>
                                    <?php contextual_row('DSC02398.jpg'); ?>
                                    <tr contenteditable class="eureka__row" data-filename="DSC02532.jpg" data-tokens="hawaii||DSC02532.jpg||w=600||h=600" data-dimensions-w="600" data-dimensions-h="600" data-filesize-bytes="409600" data-timestamp="1327428386405">
                                        <td class="eureka__row-image">
                                            <div class="image"><input only-syncronous type="radio" name="file"><img src="http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02532.jpg"></div>
                                            <code contenteditable="false" tabfocus="-1" sorta-draggable="true">DSC02532.jpg</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <code>600x600</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <code>400kb</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <time>3/10/1986</time>
                                        </td>
                                    </tr>
                                    <?php contextual_row('DSC02532.jpg'); ?>
                                    <tr contenteditable class="eureka__row" data-filename="DSC02399.jpg" data-tokens="hawaii||DSC02399.jpg||w=600||h=600" data-dimensions-w="600" data-dimensions-h="600" data-filesize-bytes="1048576" data-timestamp="1427428986305">
                                        <td contenteditable="false"  class="eureka__row-image">
                                            <div class="image"><input only-syncronous type="radio" name="file"><img src="http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02399.jpg"></div>
                                            <code contenteditable="false" tabfocus="-1" sorta-draggable="true">DSC02399.jpg</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <code>600x600</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <code>1.0mb</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <time>3/10/1986</time>
                                        </td>
                                    </tr>
                                    <?php contextual_row('DSC02399.jpg'); ?>
                                    <tr contenteditable class="eureka__row" data-filename="DSC02404.jpg" data-tokens="hawaii||DSC02404.jpg||w=600||h=600" data-dimensions-w="600" data-dimensions-h="600" data-filesize-bytes="409600" data-timestamp="1427428985405">
                                        <td class="eureka__row-image">
                                            <div class="image"><input only-syncronous type="radio" name="file"><img src="http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02404.jpg"></div>
                                            <code contenteditable="false" tabfocus="-1" sorta-draggable="true">DSC02404.jpg</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <code>600x600</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <code>400kb</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <time>3/10/1986</time>
                                        </td>
                                    </tr>
                                    <?php contextual_row('DSC02404.jpg'); ?>
                                    <tr contenteditable class="eureka__row" data-filename="DSC02405.jpg" data-tokens="hawaii||DSC02405.jpg||w=600||h=600" data-dimensions-w="600" data-dimensions-h="600" data-filesize-bytes="409600" data-timestamp="1427428976405">
                                        <td class="eureka__row-image">
                                            <div class="image"><input only-syncronous type="radio" name="file"><img src="http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02405.jpg"></div>
                                            <code contenteditable="false" tabfocus="-1" sorta-draggable="true">DSC02405.jpg</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <code>600x600</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <code>400kb</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <time>3/10/1986</time>
                                        </td>
                                    </tr>
                                    <?php contextual_row('DSC02405.jpg'); ?>
                                    <tr contenteditable class="eureka__row" data-filename="DSC02434.jpg" data-tokens="hawaii||DSC02434.jpg||w=600||h=600" data-dimensions-w="600" data-dimensions-h="600" data-filesize-bytes="409600" data-timestamp="1427428985405">
                                        <td class="eureka__row-image">
                                            <div class="image"><input only-syncronous type="radio" name="file"><img src="http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02434.jpg"></div>
                                            <code contenteditable="false" tabfocus="-1" sorta-draggable="true">DSC02434.jpg</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <code>600x600</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <code>400kb</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <time>3/10/1986</time>
                                        </td>
                                    </tr>
                                    <?php contextual_row('DSC02434.jpg'); ?>
                                    <tr contenteditable class="eureka__row" data-filename="DSC02436.jpg" data-tokens="hawaii||DSC02436.jpg||w=600||h=600" data-dimensions-w="600" data-dimensions-h="600" data-filesize-bytes="409600" data-timestamp="1427428986305">
                                        <td class="eureka__row-image">
                                            <div class="image"><input only-syncronous type="radio" name="file"><img src="http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02436.jpg"></div>
                                            <code contenteditable="false" tabfocus="-1" sorta-draggable="true">DSC02436.jpg</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <code>600x600</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <code>400kb</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <time>3/10/1986</time>
                                        </td>
                                    </tr>
                                    <?php contextual_row('DSC02436.jpg'); ?>
                                    <tr contenteditable class="eureka__row" data-filename="DSC02441.jpg" data-tokens="hawaii||DSC02441.jpg||w=600||h=600" data-dimensions-w="600" data-dimensions-h="600" data-filesize-bytes="409600" data-timestamp="1427428926405">
                                        <td class="eureka__row-image">
                                            <div class="image"><input only-syncronous type="radio" name="file"><img src="http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02441.jpg"></div>
                                            <code contenteditable="false" tabfocus="-1" sorta-draggable="true">DSC02441.jpg</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <code>600x600</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <code>400kb</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <time>3/10/1986</time>
                                        </td>
                                    </tr>
                                    <?php contextual_row('DSC02441.jpg'); ?>
                                    <tr contenteditable class="eureka__row" data-filename="DSC02469.jpg" data-tokens="hawaii||DSC02469.jpg||w=600||h=600" data-dimensions-w="600" data-dimensions-h="600" data-filesize-bytes="409600" data-timestamp="1427428946405">
                                        <td class="eureka__row-image">
                                            <div class="image"><input only-syncronous type="radio" name="file"><img src="http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02469.jpg"></div>
                                            <code contenteditable="false" tabfocus="-1" sorta-draggable="true">DSC02469.jpg</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <code>600x600</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <code>400kb</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <time>3/10/1986</time>
                                        </td>
                                    </tr>
                                    <?php contextual_row('DSC02469.jpg'); ?>
                                    <tr contenteditable class="eureka__row" data-filename="DSC02472.jpg" data-tokens="hawaii||DSC02472.jpg||w=600||h=600" data-dimensions-w="600" data-dimensions-h="600" data-filesize-bytes="409600" data-timestamp="1427425986405">
                                        <td class="eureka__row-image">
                                            <div class="image"><input only-syncronous type="radio" name="file"><img src="http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02472.jpg"></div>
                                            <code contenteditable="false" tabfocus="-1" sorta-draggable="true">DSC02472.jpg</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <code>600x600</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <code>400kb</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <time>3/10/1986</time>
                                        </td>
                                    </tr>
                                    <?php contextual_row('DSC02472.jpg'); ?>
                                    <tr contenteditable class="eureka__row" data-filename="DSC02487.jpg" data-tokens="hawaii||DSC02487.jpg||w=600||h=600" data-dimensions-w="600" data-dimensions-h="600" data-filesize-bytes="409600" data-timestamp="1417428986405">
                                        <td class="eureka__row-image">
                                            <div class="image"><input only-syncronous type="radio" name="file"><img src="http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02487.jpg"></div>
                                            <code contenteditable="false" tabfocus="-1" sorta-draggable="true">DSC02487.jpg</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <code>600x600</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <code>400kb</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <time>3/10/1986</time>
                                        </td>
                                    </tr>
                                    <?php contextual_row('DSC02487.jpg'); ?>
                                    <tr contenteditable class="eureka__row" data-filename="DSC02472.jpg" data-tokens="hawaii||DSC02472.jpg||w=600||h=600" data-dimensions-w="600" data-dimensions-h="600" data-filesize-bytes="409600" data-timestamp="1427426986405">
                                        <td class="eureka__row-image">
                                            <div class="image"><input only-syncronous type="radio" name="file"><img src="http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02472.jpg"></div>
                                            <code contenteditable="false" tabfocus="-1" sorta-draggable="true">DSC02472.jpg</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <code>600x600</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <code>400kb</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <time>3/10/1986</time>
                                        </td>
                                    </tr>
                                    <?php contextual_row('DSC02472.jpg'); ?>
                                    <tr contenteditable class="eureka__row" data-filename="DSC02489.jpg" data-tokens="hawaii||DSC02489.jpg||w=600||h=600" data-dimensions-w="600" data-dimensions-h="600" data-filesize-bytes="409600" data-timestamp="1427428986305">
                                        <td class="eureka__row-image">
                                            <div class="image"><input only-syncronous type="radio" name="file"><img src="http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02489.jpg"></div>
                                            <code contenteditable="false" tabfocus="-1" sorta-draggable="true">DSC02489.jpg</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <code>600x600</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <code>400kb</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <time>3/10/1986</time>
                                        </td>
                                    </tr>
                                    <?php contextual_row('DSC02489.jpg'); ?>
                                    <tr contenteditable class="eureka__row" data-filename="DSC02491.jpg" data-tokens="hawaii||DSC02491.jpg||w=600||h=600" data-dimensions-w="600" data-dimensions-h="600" data-filesize-bytes="409600" data-timestamp="1427425986405">
                                        <td class="eureka__row-image">
                                            <div class="image"><input only-syncronous type="radio" name="file"><img src="http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02491.jpg"></div>
                                            <code contenteditable="false" tabfocus="-1" sorta-draggable="true">DSC02491.jpg</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <code>600x600</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <code>400kb</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <time>3/10/1986</time>
                                        </td>
                                    </tr>
                                    <?php contextual_row('DSC02491.jpg'); ?>
                                    <tr contenteditable class="eureka__row" data-filename="DSC02493.jpg" data-tokens="hawaii||DSC02493.jpg||w=600||h=600" data-dimensions-w="600" data-dimensions-h="600" data-filesize-bytes="409600" data-timestamp="1427428986403">
                                        <td class="eureka__row-image">
                                            <div class="image"><input only-syncronous type="radio" name="file"><img src="http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02493.jpg"></div>
                                            <code contenteditable="false" tabfocus="-1" sorta-draggable="true">DSC02493.jpg</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <code>600x600</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <code>400kb</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <time>3/10/1986</time>
                                        </td>
                                    </tr>
                                    <?php contextual_row('DSC02493.jpg'); ?>
                                    <tr contenteditable class="eureka__row" data-filename="DSC02503.jpg" data-tokens="hawaii||DSC02503.jpg||w=600||h=600" data-dimensions-w="600" data-dimensions-h="600" data-filesize-bytes="409600" data-timestamp="1427428986205">
                                        <td class="eureka__row-image">
                                            <div class="image"><input only-syncronous type="radio" name="file"><img src="http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02503.jpg"></div>
                                            <code contenteditable="false" tabfocus="-1" sorta-draggable="true">DSC02503.jpg</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <code>600x600</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <code>400kb</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <time>3/10/1986</time>
                                        </td>
                                    </tr>
                                    <?php contextual_row('DSC02503.jpg'); ?>
                                    <tr contenteditable class="eureka__row" data-filename="DSC02514.jpg" data-tokens="hawaii||DSC02514.jpg||w=600||h=600" data-dimensions-w="600" data-dimensions-h="600" data-filesize-bytes="409600" data-timestamp="1427428786405">
                                        <td class="eureka__row-image">
                                            <div class="image"><input only-syncronous type="radio" name="file"><img src="http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02514.jpg"></div>
                                            <code contenteditable="false" tabfocus="-1" sorta-draggable="true">DSC02514.jpg</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <code>600x600</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <code>400kb</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <time>3/10/1986</time>
                                        </td>
                                    </tr>
                                    <?php contextual_row('DSC02514.jpg'); ?>
                                    <tr contenteditable class="eureka__row" data-filename="DSC02525.jpg" data-tokens="hawaii||DSC02525.jpg||w=600||h=600" data-dimensions-w="600" data-dimensions-h="600" data-filesize-bytes="409600" data-timestamp="1427428956405">
                                        <td class="eureka__row-image">
                                            <div class="image"><input only-syncronous type="radio" name="file"><img src="http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02525.jpg"></div>
                                            <code contenteditable="false" tabfocus="-1" sorta-draggable="true">DSC02525.jpg</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <code>600x600</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <code>400kb</code>
                                        </td>
                                        <td class="eureka__row-dimensions">
                                            <time>3/10/1986</time>
                                        </td>
                                    </tr>
                                    <?php contextual_row('DSC02525.jpg'); ?>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <!-- All this work just to let them choose something?! -->
                <footer class="proceed">
                    <button class="muted clickable">Cancel</button>
                    <button class="btn clickable cta">Choose</button>
                </footer>
            </div>
        </div>
        <!-- colophon -->
        <div class="unaligned">
            <br><br><i class="fa fa-lightbulb-o"></i><br><p style="max-width:40em;margin:0 auto">&mdash;&emsp;&emsp;This is a <span title="Work in Progress">WIP</span> of a flexible media browser&emsp;&emsp;&mdash;<br>The above component is comprised of a simple <code>&lt;table&gt;</code>, some <a href="assets/css/main.css" style="color:currentColor"><code>CSS</code></a>,<br>and a dash of&nbsp;<code>VanillaJS</code>.<br>View source to see for&nbsp;yourself!<br><a href="http://markup.tips" style="color:currentColor"><i class="fa fa-code"></i></a></p>
        </div>
        
        <!--script>
        // abstractly load html5 imports into their taget destinations
        (function(){
            var links = document.querySelectorAll('link[rel="import"]');
            for(var i = 0; i < links.length; i++) {
                var link = links[i];
                var content = link.import;

                // Grab DOM from warning.html's document.
                var el = content.querySelector(link.getAttribute('data-import-selector'));

                //document.write(el.cloneNode(true).outerHTML);
                document.getElementById('yolo').outerHTML = el.cloneNode(true).outerHTML;
            }
            
        }());
        </script-->
        
        <script>
        // remove stuff that is only there for .no-js
        (function() {
            var matches = document.querySelectorAll('input[only-syncronous]');
            for(var i = 0; i < matches.length; i++) {
                matches[i].remove();
            }
        }());
        
        // enable stuff that is disabled for .no-js
        (function() {
            var matches = document.querySelectorAll('*[js-enabled]');
            for(var i = 0; i < matches.length; i++) {
                matches[i].disabled = false;
            }
        }());
        
        // update placeholders with asyncronous-placeholders, etc
        (function() {
            var attrs = ['placeholder'];
            for(var attr of attrs) {
                var matches = document.querySelectorAll('*[asyncronous-' + attr + ']');
                for(var i = 0; i < matches.length; i++) {
                    matches[i].setAttribute('placeholder',matches[i].getAttribute('asyncronous-' + attr));
                }   
            }
        }());
        </script>
        
        <script>
        // remove obsolete elements
        (function(){
            var elements = document.querySelectorAll("*[asyncronously-obsolete]");
            for(var i = 0; i < elements.length; i++) {
                var el = elements[i];
                var obsoletes = el.getAttribute('asyncronously-obsolete').split(',');
                for(var obsolete of obsoletes) el.removeAttribute(obsolete);
            }
            el.removeAttribute('asyncronously-obsolete');
        }());
        </script>
        
        <script>
        // set asyncronous titles
        (function(){
            var asyncronousTitles = document.querySelectorAll("*[asyncronous-title]");
            for(var i = 0; i < asyncronousTitles.length; i++) {
                var asyncronousTitle = asyncronousTitles[i];
                asyncronousTitle.setAttribute('title',asyncronousTitle.getAttribute('asyncronous-title'));
            }
        }());
        </script>
        
        <script>
        // this is weird but necessary to prevent inputs from moving all over the place
        (function(){
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
        }());
        </script>
        
        <script>
        // initially disable buttons that can later be enabled asycronously
        (function(){
            var jsDisables = document.querySelectorAll('*[js-disabled]');
            for (var i = 0; i < jsDisables.length; i++) {
                var current = jsDisables[i];
                current.setAttribute('disabled','true');
            }
        }());
        </script>
        
        <script>
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
        </script>
    </body>
</html>