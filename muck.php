<?php include 'functions.php';?><!doctype html>
<!-- if you like markup please stop by and say hello over at http://markup.tips -->
<html class="no-js" lang="">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title></title>
        <meta name="description" content="HTML-first crack at a Flexible Media Browser">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link rel="stylesheet" href="assets/css/eureka.css?nc=<?php echo time() ?>">
        <script src="assets/js/vendor/modernizr-2.8.3.min.js"></script>
        
        <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" async>
        
        <style>
            html,body {
                margin:0;
                padding:0;
            }
            html.no-touch #page-wrapper {
              height: 96vh;
              margin: 0;
              padding:2vh;
              
            }
            @-moz-document url-prefix() { /* disable "holy-grail" layout for firefox because it still doesn't understand flexbox  #janky #shame #hack */
                html.no-touch #page-wrapper {
                    height:auto;
                    max-height:none;
                }
            }
        </style>
        <script>var MODx = {siteId:'foo'};</script>
    </head>
    <body>
        <div id="page-wrapper" class="hack-firefox">            
            <div class="view-a eureka" id="redactor-media-browser_0"></div><!-- max-height may be used in CSS just to show how it can be condensed when needed (think modal) -->
        </div>
        
        <script src="assets/js/muckboot.eureka.js?nc=<?php echo time() ?>"></script>
        <script src="assets/js/eureka.js?nc=<?php echo time() ?>"></script>
        
        <script>
            (function(){
                var $muckboot = new MuckBoot({ // paint the DOM
                    id:'redactor-media-browser_0', // unique identifier
                    upload:true, // paint upload UI elements
                    createDir:true // add create directory button
                });
                var $eureka = new Eureka({ // init the Eureka component
                    // REQUIRED
                    uid:'redactor-media-browser_0',
                    directoryRequestURL:'fakepi/listdirectory.php',
                    listSourceRequestURL:'fakepi/listsource.php',
                    listSourcesRequestURL:'fakepi/listsources.php',
                    
                    fileUploadURL:'/file/upload', // if undefined upload and create UI elements will be removed
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
                
                console.log(EurekaModel.EurekaFoundIt);
                
                // NOTE: "event" system is kinda experimental and may change
                // currently the Eureka class (MVC) dispatches events from the eureka component itself (div.eureka)
                // listen for when a file is renamed
                document.getElementById('redactor-media-browser_0').addEventListener(EurekaModel.EurekaFileRename,function(e){
                    console.log('EurekaFileRename');
                    console.log(e.detail.data);
                    // make XHR to API endpoint to rename file
                });
                
                // listen for when a media item has been chosen
                document.getElementById('redactor-media-browser_0').addEventListener(EurekaModel.EurekaFoundIt,function(e){
                    console.log('EurekaFoundIt');
                    console.log(e.detail.data); 
                    // NOTE: Eureka doesn't kill itself, it's up to to handle animating it out and destroying it
                });
                
                // listen for when a media item has been deleted
                document.getElementById('redactor-media-browser_0').addEventListener(EurekaModel.EurekaUnlink,function(e){
                    console.log('EurekaUnlink');
                    console.log(e.detail.data);
                    // make XHR to API endpoint to delete media item
                });
                
                // listen for when a new directory has been created
                document.getElementById('redactor-media-browser_0').addEventListener(EurekaModel.EurekaDirectoryCreated,function(e){
                    console.log('EurekaDirectoryCreated');
                    console.log(e.detail.data);
                    // make XHR (or not, might not need to if upload server script creates unexistant directories)
                });
                
                // listen for when a directory has been opened
                document.getElementById('redactor-media-browser_0').addEventListener(EurekaModel.EurekaDirectoryOpened,function(e){
                    console.log('EurekaDirectoryOpened');
                    console.log(e.detail.data);
                    // make XHR to API endpoint to create new directory on server
                });
            }());
        </script>
    </body>
    <!-- that's it for now everyone -->
</html>