<?php include 'functions.php';?><!doctype html>
<!-- if you like markup please stop by and say hello over at http://markup.tips -->
<html class="no-js" lang="">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title></title>
        <meta name="description" content="HTML-first crack at a Flexible Media Browser">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link rel="stylesheet" href="assets/css/main.css?nc=<?php echo time() ?>">
        <script src="assets/js/vendor/modernizr-2.8.3.min.js"></script>
        
        <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" async>
        
        <style>
            @media screen and (min-width: 641px) {
              html.no-touch #page-wrapper {
                height: 100%;
                max-height:100vh;
                margin: 0;
                padding:0.5em;
              }
            }
        </style> 
        <script>var MODx = {siteId:'foo'};</script>
    </head>
    <body>
        <form>
            <div id="page-wrapper">            
                    <div class="hack-firefox eureka-wrapper"><!-- Eureka Media Browser -->                        
                        <div class="view-a eureka" id="media-browser_0"><!-- max-height may be used in CSS just to show how it can be condensed when needed (think modal) -->
                            <!-- initially open, this side navigation adds a a/synchronous tree browser to traverse media source directories  -->
                            <nav id="media-browser_0__pathbrowser" class="pathbrowser">
                                <div class="pathbrowser__topbar">
                                    <label for="media-browser_0__mediasource-select"><h4>Media Source</h4></label>
                                    <select id="media-browser_0__mediasource-select" title="Choose a Media Source to browse">
                                        <!-- media sources -->
                                        <option value="0" selected>Filesystem</option>
                                        <option value="1">Assets</option>
                                        <option value="2">Amazon S3</option>
                                    </select>
                                </div>
                                <!-- navigation tree -->
                                <nav class="tree">
                                    <ul>
                                        <li class="open">
                                                <a class="folder"><i class="fa fa-folder-open"></i>&nbsp;</a>
                                                <a class="path" href="#" title="Browse assets" data-cd="assets/">assets</a>
                                            <ul>
                                                <li class="active">
                                                    <a class="folder"><i class="fa fa-folder-open"></i>&nbsp;</a>
                                                    <a class="path" href="#" title="Browse assets/images" data-cd="assets/images/">assets/images</a>
                                                </li>
                                            </ul>
                                        </li>
                                        <li>
                                            <a class="folder"><i class="fa fa-folder-open"></i>&nbsp;</a>
                                            <a class="path" href="#" title="Browse assets/uploads" data-cd="assets/uploads/">uploads</a>
                                        </li>
                                    </ul>
                                </nav>
                                <!-- upload & create directory buttons -->
                                <footer>
                                    <nav>
                                        <form action="#">
                                            <input type="hidden" name="mediasource" value="0">
                                            <input type="hidden" name="mediapath" value="assets/images">
                                            <button type="submit" class="nued" title="Create a new directory in assets/images">
                                                <i class="fa fa-plus-square"></i>
                                            </button>
                                        </form>
                                        <form action="#">
                                            <input type="hidden" name="mediasource" value="0">
                                            <input type="hidden" name="mediapath" value="assets/images">
                                            <button type="submit" class="nued" title="Upload media to assets/images">
                                                <i class="fa fa-upload"></i>
                                            </button>
                                        </form>
                                    </nav>
                                </footer>
                            </nav>
                            <!-- our main stage area for browsing -->
                            <div id="media-browser_0__stage" class="stage">
                                <div class="eureka__topbar">
                                    <nav class="eureka__topbar-nav" title="Please enable JavaScript to change layouts" asyncronously-obsolete="title"><!-- removes the title attribute for .js users -->
                                        <header>
                                            <h4>Media Content</h4>
                                            <form>
                                                <!-- this input is disabled for .no-js users and displays a subtle Please enable JavaScript message -->
                                                <!-- .js is used to decorate this form. notice the js-enabled attribute with removes the disabled attribute. Also notice the asyncronous-placeholder with changes the placeholder for .js users -->
                                                <input id="media-browser_0__filter-images" disabled js-enabled type="search" placeholder="Please enable JavaScript" asyncronous-placeholder="Filter images" autocomplete="off">
                                            </form>
                                        </header>
                                        <div class="eureka__topbar-nav__select">
                                            <!-- closing the navigation tree is an asynchronous interaction we only add the button if .js is available  -->
                                            <script>document.write('<a id="media-browser_0__pathbrowser_toggle" class="pathbrowser_toggle" title="Close Navigation Tree" data-title-close="Close Navigation Tree" data-title-open="Open Navigation Tree" data-toggle-target="media-browser_0__pathbrowser"><i class="fa fa-toggle-left"></i></a>');</script>
                                            <!-- when the navigation tree is closed this accessible a/synchronous form will be available to change directories  -->
                                            <div id="media-browser_0__browse-select" class="tablet-p-hidden browse-select">
                                                <label for="media-browser_0__browsing" class="browsing">Browse:</label>
                                                <form aciton="#" id="media-browser_0__browsing">
                                                    <select>
                                                        <!-- each media source is an optgroup -->
                                                        <optgroup label="Filesystem" data-source="0">
                                                            <option>assets</option>
                                                            <option>assets/images</option>
                                                        </optgroup>
                                                        <optgroup label="Assets" data-source="1">
                                                            <option>assets</option>
                                                            <option value="">assets/images</option>
                                                        </optgroup>
                                                        <optgroup label="Amazon S3" data-source="2">
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
                                            <div class="view-btns">
                                                <nav>
                                                    <a class="current view-a-btn" data-view="view-a" data-view-target="media-browser_0" asyncronous-title="Tabular Layout displays image thumbnails along with Name, Description, File Size and Edited On columns">
                                                        <i class="fa fa-th-list"></i>
                                                    </a>
                                                    <a class="view-b-btn" data-view="view-b" data-view-target="media-browser_0" asyncronous-title="Thumbnail layout displays a grid of medium sized thumbnails">
                                                        <i class="fa fa-th-large"></i>
                                                    </a>
                                                    <a class="view-d-btn" data-view="view-d" data-view-target="media-browser_0" asyncronous-title="Grid View displays images a grid of large images"><i class="fa fa-square"></i></a>
                                                    <script>if(!Modernizr.touch) document.write('<a class="view-c-btn" data-view="view-c" data-view-target="media-browser_0" asyncronous-title="Sliver View displays a single row of small thumbnails"><i class="fa fa-ellipsis-h"></i></a>');</script>
                                                </nav>
                                            </div>
                                        </div>
                                    </nav>
                                    
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
                                        </thead>
                                        <tbody>
                                            <!-- so each media item has TWO ROWS. a persistent tr.eureka__row followed by a tr.contextual row that displays expand, tag, share, rename, and delete options -->
                                            <!-- notice the data attributes, particularly data-tokens which is a || delimited list of typeahead tokens to filter results by -->
                                            <tr class="eureka__row" tabindex="0" data-filename="DSC02396.jpg" data-tokens="hawaii||DSC02396.jpg||w=400||h=400" data-dimensions-w="400" data-dimensions-h="400" data-filesize-bytes="408600" data-timestamp="1427428986405">
                                                <td class="eureka__row-image">
                                                    <div class="image">
                                                        <input only-syncronous type="radio" name="file">
                                                        <img src="http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02396.jpg">
                                                    </div>
                                                    <code tabfocus="-1" sorta-draggable="true">DSC02396.jpg</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <code>600x600</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <code>400kb</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <time>Jan 3, 2015</time>
                                                </td>
                                            </tr>
                                            <?php contextual_row('DSC02396.jpg'); ?>
                                            <tr class="eureka__row" tabindex="0" data-filename="DSC02398.jpg" data-tokens="hawaii||DSC02398.jpg||w=600||h=600" data-dimensions-w="600" data-dimensions-h="600" data-filesize-bytes="429600" data-timestamp="1427428986405">
                                                <td  class="eureka__row-image">
                                                    <div class="image"><input only-syncronous type="radio" name="file"><img src="http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02398.jpg"></div>
                                                    <code tabfocus="-1" sorta-draggable="true">DSC02398.jpg</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <code>600x600</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <code>400kb</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <time>Jan 3, 2015</time>
                                                </td>
                                            </tr>
                                            <?php contextual_row('DSC02398.jpg'); ?>
                                            <tr class="eureka__row" tabindex="0" data-filename="DSC02532.jpg" data-tokens="hawaii||DSC02532.jpg||w=600||h=600" data-dimensions-w="600" data-dimensions-h="600" data-filesize-bytes="409600" data-timestamp="1327428386405">
                                                <td class="eureka__row-image">
                                                    <div class="image"><input only-syncronous type="radio" name="file"><img src="http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02532.jpg"></div>
                                                    <code tabfocus="-1" sorta-draggable="true">DSC02532.jpg</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <code>600x600</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <code>400kb</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <time>Jan 3, 2015</time>
                                                </td>
                                            </tr>
                                            <?php contextual_row('DSC02532.jpg'); ?>
                                            <tr class="eureka__row" tabindex="0" data-filename="DSC02399.jpg" data-tokens="hawaii||DSC02399.jpg||w=600||h=600" data-dimensions-w="600" data-dimensions-h="600" data-filesize-bytes="1048576" data-timestamp="1427428986305">
                                                <td  class="eureka__row-image">
                                                    <div class="image"><input only-syncronous type="radio" name="file"><img src="http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02399.jpg"></div>
                                                    <code tabfocus="-1" sorta-draggable="true">DSC02399.jpg</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <code>600x600</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <code>1.0mb</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <time>Jan 3, 2015</time>
                                                </td>
                                            </tr>
                                            <?php contextual_row('DSC02399.jpg'); ?>
                                            <tr class="eureka__row" tabindex="0" data-filename="DSC02404.jpg" data-tokens="hawaii||DSC02404.jpg||w=600||h=600" data-dimensions-w="600" data-dimensions-h="600" data-filesize-bytes="409600" data-timestamp="1427428985405">
                                                <td class="eureka__row-image">
                                                    <div class="image"><input only-syncronous type="radio" name="file"><img src="http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02404.jpg"></div>
                                                    <code tabfocus="-1" sorta-draggable="true">DSC02404.jpg</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <code>600x600</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <code>400kb</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <time>Jan 3, 2015</time>
                                                </td>
                                            </tr>
                                            <?php contextual_row('DSC02404.jpg'); ?>
                                            <tr class="eureka__row" tabindex="0" data-filename="DSC02405.jpg" data-tokens="hawaii||DSC02405.jpg||w=600||h=600" data-dimensions-w="600" data-dimensions-h="600" data-filesize-bytes="409600" data-timestamp="1427428976405">
                                                <td class="eureka__row-image">
                                                    <div class="image"><input only-syncronous type="radio" name="file"><img src="http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02405.jpg"></div>
                                                    <code tabfocus="-1" sorta-draggable="true">DSC02405.jpg</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <code>600x600</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <code>400kb</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <time>Jan 3, 2015</time>
                                                </td>
                                            </tr>
                                            <?php contextual_row('DSC02405.jpg'); ?>
                                            <tr class="eureka__row" tabindex="0" data-filename="DSC02434.jpg" data-tokens="hawaii||DSC02434.jpg||w=600||h=600" data-dimensions-w="600" data-dimensions-h="600" data-filesize-bytes="409600" data-timestamp="1427428985405">
                                                <td class="eureka__row-image">
                                                    <div class="image"><input only-syncronous type="radio" name="file"><img src="http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02434.jpg"></div>
                                                    <code tabfocus="-1" sorta-draggable="true">DSC02434.jpg</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <code>600x600</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <code>400kb</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <time>Jan 3, 2015</time>
                                                </td>
                                            </tr>
                                            <?php contextual_row('DSC02434.jpg'); ?>
                                            <tr class="eureka__row" tabindex="0" data-filename="DSC02436.jpg" data-tokens="hawaii||DSC02436.jpg||w=600||h=600" data-dimensions-w="600" data-dimensions-h="600" data-filesize-bytes="409600" data-timestamp="1427428986305">
                                                <td class="eureka__row-image">
                                                    <div class="image"><input only-syncronous type="radio" name="file"><img src="http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02436.jpg"></div>
                                                    <code tabfocus="-1" sorta-draggable="true">DSC02436.jpg</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <code>600x600</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <code>400kb</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <time>Jan 3, 2015</time>
                                                </td>
                                            </tr>
                                            <?php contextual_row('DSC02436.jpg'); ?>
                                            <tr class="eureka__row" tabindex="0" data-filename="DSC02441.jpg" data-tokens="hawaii||DSC02441.jpg||w=600||h=600" data-dimensions-w="600" data-dimensions-h="600" data-filesize-bytes="409600" data-timestamp="1427428926405">
                                                <td class="eureka__row-image">
                                                    <div class="image"><input only-syncronous type="radio" name="file"><img src="http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02441.jpg"></div>
                                                    <code tabfocus="-1" sorta-draggable="true">DSC02441.jpg</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <code>600x600</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <code>400kb</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <time>Jan 3, 2015</time>
                                                </td>
                                            </tr>
                                            <?php contextual_row('DSC02441.jpg'); ?>
                                            <tr class="eureka__row" tabindex="0" data-filename="DSC02469.jpg" data-tokens="hawaii||DSC02469.jpg||w=600||h=600" data-dimensions-w="600" data-dimensions-h="600" data-filesize-bytes="409600" data-timestamp="1427428946405">
                                                <td class="eureka__row-image">
                                                    <div class="image"><input only-syncronous type="radio" name="file"><img src="http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02469.jpg"></div>
                                                    <code tabfocus="-1" sorta-draggable="true">DSC02469.jpg</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <code>600x600</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <code>400kb</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <time>Jan 3, 2015</time>
                                                </td>
                                            </tr>
                                            <?php contextual_row('DSC02469.jpg'); ?>
                                            <tr class="eureka__row" tabindex="0" data-filename="DSC02472.jpg" data-tokens="hawaii||DSC02472.jpg||w=600||h=600" data-dimensions-w="600" data-dimensions-h="600" data-filesize-bytes="409600" data-timestamp="1427425986405">
                                                <td class="eureka__row-image">
                                                    <div class="image"><input only-syncronous type="radio" name="file"><img src="http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02472.jpg"></div>
                                                    <code tabfocus="-1" sorta-draggable="true">DSC02472.jpg</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <code>600x600</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <code>400kb</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <time>Jan 3, 2015</time>
                                                </td>
                                            </tr>
                                            <?php contextual_row('DSC02472.jpg'); ?>
                                            <tr class="eureka__row" tabindex="0" data-filename="DSC02487.jpg" data-tokens="hawaii||DSC02487.jpg||w=600||h=600" data-dimensions-w="600" data-dimensions-h="600" data-filesize-bytes="409600" data-timestamp="1417428986405">
                                                <td class="eureka__row-image">
                                                    <div class="image"><input only-syncronous type="radio" name="file"><img src="http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02487.jpg"></div>
                                                    <code tabfocus="-1" sorta-draggable="true">DSC02487.jpg</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <code>600x600</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <code>400kb</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <time>Jan 3, 2015</time>
                                                </td>
                                            </tr>
                                            <?php contextual_row('DSC02487.jpg'); ?>
                                            <tr class="eureka__row" tabindex="0" data-filename="DSC02472.jpg" data-tokens="hawaii||DSC02472.jpg||w=600||h=600" data-dimensions-w="600" data-dimensions-h="600" data-filesize-bytes="409600" data-timestamp="1427426986405">
                                                <td class="eureka__row-image">
                                                    <div class="image"><input only-syncronous type="radio" name="file"><img src="http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02472.jpg"></div>
                                                    <code tabfocus="-1" sorta-draggable="true">DSC02472.jpg</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <code>600x600</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <code>400kb</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <time>Jan 3, 2015</time>
                                                </td>
                                            </tr>
                                            <?php contextual_row('DSC02472.jpg'); ?>
                                            <tr class="eureka__row" tabindex="0" data-filename="DSC02489.jpg" data-tokens="hawaii||DSC02489.jpg||w=600||h=600" data-dimensions-w="600" data-dimensions-h="600" data-filesize-bytes="409600" data-timestamp="1427428986305">
                                                <td class="eureka__row-image">
                                                    <div class="image"><input only-syncronous type="radio" name="file"><img src="http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02489.jpg"></div>
                                                    <code tabfocus="-1" sorta-draggable="true">DSC02489.jpg</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <code>600x600</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <code>400kb</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <time>Jan 3, 2015</time>
                                                </td>
                                            </tr>
                                            <?php contextual_row('DSC02489.jpg'); ?>
                                            <tr class="eureka__row" tabindex="0" data-filename="DSC02491.jpg" data-tokens="hawaii||DSC02491.jpg||w=600||h=600" data-dimensions-w="600" data-dimensions-h="600" data-filesize-bytes="409600" data-timestamp="1427425986405">
                                                <td class="eureka__row-image">
                                                    <div class="image"><input only-syncronous type="radio" name="file"><img src="http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02491.jpg"></div>
                                                    <code tabfocus="-1" sorta-draggable="true">DSC02491.jpg</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <code>600x600</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <code>400kb</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <time>Jan 3, 2015</time>
                                                </td>
                                            </tr>
                                            <?php contextual_row('DSC02491.jpg'); ?>
                                            <tr class="eureka__row" tabindex="0" data-filename="DSC02493.jpg" data-tokens="hawaii||DSC02493.jpg||w=600||h=600" data-dimensions-w="600" data-dimensions-h="600" data-filesize-bytes="409600" data-timestamp="1427428986403">
                                                <td class="eureka__row-image">
                                                    <div class="image"><input only-syncronous type="radio" name="file"><img src="http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02493.jpg"></div>
                                                    <code tabfocus="-1" sorta-draggable="true">DSC02493.jpg</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <code>600x600</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <code>400kb</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <time>Jan 3, 2015</time>
                                                </td>
                                            </tr>
                                            <?php contextual_row('DSC02493.jpg'); ?>
                                            <tr class="eureka__row" tabindex="0" data-filename="DSC02503.jpg" data-tokens="hawaii||DSC02503.jpg||w=600||h=600" data-dimensions-w="600" data-dimensions-h="600" data-filesize-bytes="409600" data-timestamp="1427428986205">
                                                <td class="eureka__row-image">
                                                    <div class="image"><input only-syncronous type="radio" name="file"><img src="http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02503.jpg"></div>
                                                    <code tabfocus="-1" sorta-draggable="true">DSC02503.jpg</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <code>600x600</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <code>400kb</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <time>Jan 3, 2015</time>
                                                </td>
                                            </tr>
                                            <?php contextual_row('DSC02503.jpg'); ?>
                                            <tr class="eureka__row" tabindex="0" data-filename="DSC02514.jpg" data-tokens="hawaii||DSC02514.jpg||w=600||h=600" data-dimensions-w="600" data-dimensions-h="600" data-filesize-bytes="409600" data-timestamp="1427428786405">
                                                <td class="eureka__row-image">
                                                    <div class="image"><input only-syncronous type="radio" name="file"><img src="http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02514.jpg"></div>
                                                    <code tabfocus="-1" sorta-draggable="true">DSC02514.jpg</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <code>600x600</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <code>400kb</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <time>Jan 3, 2015</time>
                                                </td>
                                            </tr>
                                            <?php contextual_row('DSC02514.jpg'); ?>
                                            <tr class="eureka__row" tabindex="0" data-filename="DSC02525.jpg" data-tokens="hawaii||DSC02525.jpg||w=600||h=600" data-dimensions-w="600" data-dimensions-h="600" data-filesize-bytes="409600" data-timestamp="1427428956405">
                                                <td class="eureka__row-image">
                                                    <div class="image"><input only-syncronous type="radio" name="file"><img src="http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02525.jpg"></div>
                                                    <code tabfocus="-1" sorta-draggable="true">DSC02525.jpg</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <code>600x600</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <code>400kb</code>
                                                </td>
                                                <td class="eureka__row-dimensions">
                                                    <time>Jan 3, 2015</time>
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
                            <button class="btn clickable cta" id="media-browser_0__choose-btn" type="submit" js-disabled>Choose</button>
                        </footer>
                    </div>
            </div>
        </form>
        <script>
        // remove stuff that is only there for .no-js
        (function() {
            var matches = document.querySelectorAll('*[only-syncronous], *[data-only-syncronous]');
            for(var i = 0; i < matches.length; i++) {
                matches[i].remove();
            }
        }());
        
        // enable stuff that is disabled for .no-js
        (function() {
            var matches = document.querySelectorAll('*[js-enabled]');
            for(var i = 0; i < matches.length; i++) {
                matches[i].disabled = false;
                matches[i].removeAttribute('disabled');
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
        // initially disable buttons that can later be enabled asycronously
        (function(){
            var jsDisables = document.querySelectorAll('*[js-disabled]');
            for (var i = 0; i < jsDisables.length; i++) {
                var current = jsDisables[i];
                current.disabled = true;
                current.setAttribute('disabled','true');
                current.removeAttribute('js-disabled');
            }
        }());
        </script>   
             
        <script src="assets/js/eureka.min.js?nc=<?php echo time() ?>"></script>
        
        <script>
            (function(){
                var $eureka = new Eureka({
                    uid:'media-browser_0',
                    editable:false, // set to false to remove rename and delete features
                    locale:'en-US',
                    mediaSource:0,
                    currentDirectory:undefined,
                    headers: [{
                        'modAuth': MODx.siteId,
                        'Powered-By': 'Eureka in MODX Revolution'
                    }]
                });
                
                // listen for when a file is renamed
                document.getElementById('media-browser_0').addEventListener('EurekaFileRename',function(e){
                    console.log('EurekaFileRename');
                    console.log(e.data);
                });
                
                // listen for when a media item has been chosen
                document.getElementById('media-browser_0').addEventListener('EurekaFoundIt',function(e){
                    console.log('EurekaFoundIt');
                    console.log(e.data);
                });
                
                // listen for when a media item has been deleted
                document.getElementById('media-browser_0').addEventListener('EurekaUnlink',function(e){
                    console.log('EurekaUnlink');
                    console.log(e.data);
                });
            }());
        </script>
            <script>
            /*
              hopefully we are mistaken but we believe we found a use case where firefox 38 deviates from the flexbox spec
              find the patch we came up with below
            */
            Modernizr.addTest('firefox', function () {
                return !!navigator.userAgent.match(/firefox/i); // who cut the user agent? shame on us...
            });
            (function(){
                /*
                  checking the userAgent is really gross...
                  so let us not and say we did...
                */
                if(!Modernizr.touch && Modernizr.firefox) { // for firefox non-touch browsers
                    document.addEventListener('DOMContentLoaded', function(){ // layout the flex children the way firefox should
                        /* fix the bug somehow???... */
                    });
                }
            })();
            (function(){ 
                /*
                  this is probably a more reliable way than checking the userAgent...
                */
                document.addEventListener('DOMContentLoaded',function(){
                    var mediaBrowser = document.getElementById('media-browser_0'); // dangerous but more optimal to not looks these up each resize
                    var eurekaWrapper = mediaBrowser.parentNode;
                    var eurekaTable = mediaBrowser.querySelector('.eureka-table');
                    
                    document.querySelector('.hack-firefox.eureka-wrapper').classList.remove('hack-firefox'); // remove the CSS patch :/
                    
                    if(eurekaTable.offsetHeight > eurekaWrapper.offsetHeight) { // eurekaTable might be too tall now
                        try {
                            console.log('uh oh, we detect a flexbox bug');
                        } catch(e) {}
                        
                        function handleResize() {       
                            // i hope i don't get in trouble for doing other browsers homework...
                            var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
                            var dh = (eurekaWrapper.offsetHeight - eurekaWrapper.querySelector('.eureka__topbar').offsetHeight - eurekaWrapper.querySelector('footer.proceed').offsetHeight);
                            dh -= (16*1.5); //1.5ems of margin
                            
                            eurekaTable.style.height = eurekaTable.style.maxHeight = eurekaTable.style.flexBasis = dh + 'px'; 
                        }
                        
                        window.addEventListener('resize',handleResize, false); // we'll be here all night folks...
                        handleResize();
                    }

                });
            })();
            </script>
    </body>
    <!-- that's it for now everyone -->
</html>