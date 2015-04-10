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
        </style>
    </head>
    <body>
        <div id="page-wrapper">            
            <div class="view-a eureka" id="media-browser_0"></div><!-- max-height may be used in CSS just to show how it can be condensed when needed (think modal) -->
        </div>
        
        <script src="assets/js/muckboot.eureka.js?nc=<?php echo time() ?>"></script>
        <script src="assets/js/eureka.min.js?nc=<?php echo time() ?>"></script>
        
        <script>
            (function(){
                var $muckboot = new MuckBoot({
                    id:'media-browser_0'
                });
                var $eureka = new Eureka({
                    uid:'media-browser_0',
                    locale:'en-US',
                    mediaSource:0,
                    currentDirectory:undefined
                });
            }());
        </script>
    </body>
    <!-- that's it for now everyone -->
</html>