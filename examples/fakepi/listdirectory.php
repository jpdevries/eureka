<?php

$mediaSource = $_GET["s"];
$dir = $_GET["dir"];

$results = array(
    array(
        "filename" => "DSC02396",
        "src" => "http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02396.jpg",
        "picture" => array(
            array(
                "filename" => "DSC02398.jpg",
                "src" => "http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02398.jpg",
                "filesize" => "2048",
                "dimensions" => "600x600",
                "editedon" => "1261112640",
            ),
            array(
                "filename" => "DSC02532.jpg",
                "src" => "http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02532.jpg",
                "filesize" => "1025",
                "dimensions" => "600x600",
                "editedon" => "1261112640",
            )
        ),
        "filesize" => "1048576",
        "dimensions" => "600x600",
        "editedon" => "1266469440",
    ),
    array(
        "filename" => "DSC02398.css",
        "src" => "http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02398.css",
        "filesize" => "2048",
        "dimensions" => "600x600",
        "editedon" => "1261112640",
    ),
    array(
        "filename" => "DSC02532.jpg",
        "src" => "http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02532.jpg",
        "filesize" => "1025",
        "dimensions" => "600x600",
        "editedon" => "1261112640",
    ),
    array(
        "filename" => "DSC02399.jpg",
        "src" => "http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02399.jpg",
        "filesize" => "1024",
        "dimensions" => "600x600",
        "editedon" => "1261112640",
    ),
    array(
        "filename" => "DSC02404.jpg",
        "src" => "http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02404.jpg",
        "filesize" => "1023",
        "dimensions" => "600x600",
        "editedon" => "1261112640",
    ),
    array(
        "filename" => "DSC02405.jpg",
        "src" => "http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02405.jpg",
        "filesize" => "1024",
        "dimensions" => "600x600",
        "editedon" => "1353215040",
    ),
    array(
        "filename" => "DSC02434.jpg",
        "src" => "http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02434.jpg",
        "filesize" => "1024",
        "dimensions" => "600x600",
        "editedon" => "1353215040",
    ),
    array(
        "filename" => "DSC02436.jpg",
        "src" => "http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02436.jpg",
        "filesize" => "1024",
        "dimensions" => "600x600",
        "editedon" => "1353215040",
    ),
    array(
        "filename" => "DSC02472.jpg",
        "src" => "http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02472.jpg",
        "filesize" => "1024",
        "dimensions" => "600x600",
        "editedon" => "1353215040",
    ),
    array(
        "filename" => "DSC02487.jpg",
        "src" => "http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02487.jpg",
        "filesize" => "1024",
        "dimensions" => "600x600",
        "editedon" => "1353215040",
    ),
    array(
        "filename" => "DSC02472.jpg",
        "src" => "http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02472.jpg",
        "filesize" => "1024",
        "dimensions" => "600x600",
        "editedon" => "1353215040",
    ),
    array(
        "filename" => "DSC02489.jpg",
        "src" => "http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02489.jpg",
        "filesize" => "1024",
        "dimensions" => "600x600",
        "editedon" => "1353215040",
    ),
    array(
        "filename" => "DSC02491.jpg",
        "src" => "http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02491.jpg",
        "filesize" => "1024",
        "dimensions" => "600x600",
        "editedon" => "1353215040",
    ),
    array(
        "filename" => "DSC02493.jpg",
        "src" => "http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02493.jpg",
        "filesize" => "1024",
        "dimensions" => "600x600",
        "editedon" => "1353215040",
    ),
    array(
        "filename" => "DSC02503.jpg",
        "src" => "http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02503.jpg",
        "filesize" => "1024",
        "dimensions" => "600x600",
        "editedon" => "1353215040",
    ),
    array(
        "filename" => "DSC02514.jpg",
        "src" => "http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02514.jpg",
        "filesize" => "1024",
        "dimensions" => "600x600",
        "editedon" => "1353215040",
    )
);

switch($dir) {
    case "assets/":
    $results = array_slice($results,0,4);
    break;
    
    case "assets/images/":
    $results = array_slice($results,6,5);
    break;
    
    case "assets/images/uploads/":
    $results = array_slice($results,10);
    break;
    
    default:
    break;
}

$results[] = array(
    "directory" => "foolder"
);

$data = array(
	"total" => count($results),
	"cd" => "$dir",
    "cs" => $mediaSource,
    "results" => $results
);

echo json_encode($data);
?>