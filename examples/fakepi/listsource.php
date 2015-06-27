<?php

$mediaSource = $_GET["s"];

$title = '';
switch($mediaSource) {
    case 0:
    $title = 'Filesystem';
    break;
    
    case 1:
    $title = 'Assets';
    break;
    
    case 2:
    $title = 'Amazon S3';
    break;
    
    default:
    $title = 'Filesystem';
    break;
}

$results = array(
    array(
        'path' => 'assets',
        'children' => array(
            array(
                'path' => 'assets/images/'
            ),
            array(
                'path' => 'assets/maple/'
            ),
            array(
                'path' => 'assets/tea/'
            )
        )
    ),
    array(
        'path' => 'uploads'
    ),
);

$data = array(
	"cs" => "$mediaSource",
    "title" => $title,
    "results" => $results
);

echo json_encode($data);
?>