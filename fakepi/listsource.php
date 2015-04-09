<?php

$mediaSource = $_GET["s"];

$results = array(
    array(
        'path' => 'assets',
        'children' => array(
            array(
                'path' => 'assets/images/'
            )
        )
    ),
    array(
        'path' => 'uploads'
    ),
);

$data = array(
	"cs" => "$mediaSource",
    "results" => $results
);

echo json_encode($data);
?>