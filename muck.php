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
                margin: 0;
                padding:0.5em;
              }
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
            <div class="view-a eureka" id="media-browser_0"></div><!-- max-height may be used in CSS just to show how it can be condensed when needed (think modal) -->
        </div>
        
        <script src="assets/js/muckboot.eureka.js?nc=<?php echo time() ?>"></script>
        <script src="assets/js/eureka.js?nc=<?php echo time() ?>"></script>
        
        <script>
            (function(){
                var $muckboot = new MuckBoot({ // paint the DOM
                    id:'media-browser_0'
                });
                var $eureka = new Eureka({ // init the Eureka component
                    uid:'media-browser_0',
                    locale:'en-US',
                    mediaSource:undefined,
                    currentDirectory:undefined,
                    directoryRequestURL:'fakepi/listdirectory.php',
                    listSourceRequestURL:'fakepi/listsource.php',
                    listSourcesRequestURL:'fakepi/listsources.php',
                    debug:false, // will trace debugging info to console.log
                    headers: [{
                        'modAuth': MODx.siteId,
                        'Powered-By': 'Eureka by Markup.tips'
                    }]
                });
                
                // NOTE: "event" system is kinda experimental and may change
                // currently the Eureka class (MVC) dispatches events from the eureka component itself (div.eureka)
                // listen for when a file is renamed
                document.getElementById('media-browser_0').addEventListener('EurekaFileRename',function(e){
                    console.log('EurekaFileRename');
                    console.log(e.data);
                    // make XHR 
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
    </body>
    <!-- that's it for now everyone -->
</html>