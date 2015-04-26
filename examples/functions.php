<?php
function contextual_row($filename) {
    $id = "file__$filename";
    ?><tr class="contextual" id="eureka_contextual__<?php echo "$filename" ?>">
    <td colspan="4">
        <nav class="flexible_row contextual__nav">
            <a class="expand" href="http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/<?php echo "$filename" ?>" target="_blank" tabindex="0"><i class="fa icon fa-expand icon-expand"></i> Expand</a>
            <a class="choose" href="http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/<?php echo "$filename" ?>" target="_blank" tabindex="0"><i class="fa icon fa-check-circle-o icon-check-circle-o"></i> Choose</a>
            <a class="rename" target="_blank" tabindex="0"><i class="fa icon fa-edit icon-edit"></i>&nbsp;Rename</a>
            <a class="dangerous trash" target="_blank" tabindex="0"><i class="fa icon fa-trash icon-trash"></i>&nbsp;Delete</a>
        </nav>
    </td>
</tr><?php
}
?>









