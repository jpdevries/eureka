<?php include 'functions.php';?><!doctype html>
<!-- if you like markup please stop by and say hello over at http://markup.tips -->
<html class="no-js" lang="">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title></title>
        <meta name="description" content="HTML-first crack at a Flexible Media Browser">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link rel="stylesheet" href="assets/css/eureka.1.1.0.css?nc=<?php echo time() ?>">
        <script src="assets/js/vendor/modernizr-2.8.3.min.js"></script>

        <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" async>

        <style>
            html,body {
                margin:0;
                padding:0;
            }

            body {
                padding:1vh;
                 min-height: 98vh;
                @media screen and (min-width: 769px) {
                    padding:2vh;
                     min-height: 96vh;
                }
            }

            @media screen and (min-width: 769px) {
              html.no-touch body {
                display: -webkit-box;
                display: -moz-box;
                display: box;
                display: -webkit-flex;
                display: -moz-flex;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-orient: vertical;
                -moz-box-orient: vertical;
                box-orient: vertical;
                -webkit-flex-direction: column;
                -moz-flex-direction: column;
                flex-direction: column;
                -ms-flex-direction: column;
                -webkit-box-lines: single;
                -moz-box-lines: single;
                box-lines: single;
                -webkit-flex-wrap: nowrap;
                -moz-flex-wrap: nowrap;
                -ms-flex-wrap: nowrap;
                flex-wrap: nowrap;
                height: 96vh;
                max-height:96vh;
              }

            html.no-touch #page-wrapper {
              margin: 0;
              padding:0;
              min-height: 98vh;
              @media screen and (min-width: 769px) {
                  height: 96vh;
              }
            }

            @media screen and (min-width: 769px) {
                body {
                  /* move them */
                  /*height: 100vh;*/
                  display: -webkit-flex;
                  display: -ms-flexbox;
                  display: flex;
                  -webkit-flex-direction: column;
                      -ms-flex-direction: column;
                          flex-direction: column;
                      }
                #page-wrapper {
                    display: -webkit-box;
                    display: -moz-box;
                    display: box;
                    display: -webkit-flex;
                    display: -moz-flex;
                    display: -ms-flexbox;
                    display: flex;
                    -webkit-flex-direction: column;
                        -ms-flex-direction: column;
                            flex-direction: column;
                    -webkit-flex-grow: 1;
                        -ms-flex-positive: 1;
                            flex-grow: 1;
                    -webkit-flex-wrap: nowrap;
                        -ms-flex-wrap: nowrap;
                            flex-wrap: nowrap;
                }
            }

        </style>
        <script>var MODx = {siteId:'foo'};</script>
    </head>
    <body>
        <div id="page-wrapper" class="">
            <div class="view-a eureka" id="redactor-media-browser_0"></div><!-- max-height may be used in CSS just to show how it can be condensed when needed (think modal) -->
        </div>
        <script>
            if(Modernizr !== undefined && Modernizr.flexbox == false) {
                console.log('no flexbox');

                link = document.createElement( "link" );
                link.href = 'assets/css/eureka.no-flexbox.1.1.0.css';
                link.type = "text/css";
                link.rel = "stylesheet";
                link.media = "screen,print";

                document.getElementsByTagName( "head" )[0].appendChild(link);
            }
            try {
                console.log(document.querySelectorAll('body').classList.add(''));
            } catch(e) {
                document.write('<script src="assets/js/vendor/dom4.js"><\/script>');
            }
        </script>
        <script src="assets/js/muckboot.eureka.1.1.0.js?nc=<?php echo time() ?>"></script>
        <script src="assets/js/eureka.1.1.0.js?nc=<?php echo time() ?>"></script>

        <script>
            (function(){
                var $muckboot = new MuckBoot({ // paint the DOM
                    id:'redactor-media-browser_0', // unique identifier
                    upload:false, // paint upload UI elements
                    createDir:false, // add create directory button
                    enlargeFocusRows:true,
                    hideImagesOnListView:undefined
                });
                var $eureka = new Eureka({ // init the Eureka component
                    // REQUIRED
                    uid:$muckboot.getID(),
                    directoryRequestURL:'/static/eureka/examples/fakepi/listdirectory.php',
                    listSourceRequestURL:'/static/eureka/examples/fakepi/listsource.php',
                    listSourcesRequestURL:'/static/eureka/examples/fakepi/listsources.php',

                    //fileUploadURL:'/file/upload', // if undefined upload and create UI elements will be removed
                    editable:true, // if false will not add rename and delete features
                    locale:'en-US', // i18n
                    mediaSource:0, // numeric index of current media source (overrides localStorage)
                    currentDirectory:'./', // current directory (overrides localStorage)
                    debug:false, // will trace debugging info to console.log
                    confirmBeforeDelete:true, // when enabled confirms before deleting media sources
                    headers: [{
                        'modAuth': MODx.siteId,
                        'Powered-By': 'Eureka by Markup.tips'
                    }]
                });

                // NOTE: "event" system is kinda experimental and may change
                // currently the Eureka class (MVC) dispatches events from the eureka component itself (div.eureka)
                // listen for when a file is renamed
                document.getElementById('redactor-media-browser_0').addEventListener(EurekaModel.EurekaFileRename,function(e){
                    console.log('EurekaFileRename');
                    console.log(e.detail);
                    // make XHR to API endpoint to rename file
                });

                // listen for when a media item has been chosen
                document.getElementById('redactor-media-browser_0').addEventListener(EurekaModel.EurekaFoundIt,function(e){
                    console.log('EurekaFoundIt');
                    console.log(e.detail);
                    alert('You found ' + e.detail.filename);
                    // NOTE: Eureka doesn't kill itself, it's up to you to handle animating it out and destroying it
                });

                // listen for when a media item has been deleted
                document.getElementById('redactor-media-browser_0').addEventListener(EurekaModel.EurekaUnlink,function(e){
                    console.log('EurekaUnlink');
                    console.log(e.detail);
                    // make XHR to API endpoint to delete media item
                });

                // listen for when a new directory has been created
                document.getElementById('redactor-media-browser_0').addEventListener(EurekaModel.EurekaDirectoryCreated,function(e){
                    console.log('EurekaDirectoryCreated');
                    console.log(e.detail);
                    // make XHR (or not, might not need to if upload server script creates unexistant directories)
                });

                // listen for when a directory has been opened
                document.getElementById('redactor-media-browser_0').addEventListener(EurekaModel.EurekaDirectoryOpened,function(e){
                    console.log('EurekaDirectoryOpened');
                    console.log(e.detail);
                    // make XHR to API endpoint to create new directory on server
                });
            }());
        </script>
    </body>
    <!-- that's it for now everyone -->
</html>
