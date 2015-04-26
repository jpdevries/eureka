<?php

$results = array(
    array(
        'id' => 0,
        'name' => 'Filesystem'
    ),
    array(
        'id' => 1,
        'name' => 'Assets'
    ),
    array(
        'id' => 2,
        'name' => 'Amazon S3'
    )
);

$data = array(
    "results" => $results
);

echo json_encode($data);
?>