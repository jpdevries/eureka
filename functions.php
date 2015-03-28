<?php
function contextual_row($filename) {
    $id = "file__$filename";
    ?><tr class="contextual">
    <td colspan="4">
        <nav class="flexible_row contextual__nav">
            <a class="expand"><i class="fa fa-expand"></i> Expand</a>
            <form class="tag" action="#" method="post">
                <label title="Tagging this media item will make it easier to find"><i class="fa fa-tag"></i>&nbsp;Tag:</label>
                <input type="text" placeholder="Tag this media item" tabindex="-1">
                <button type="submit" tabindex="-1" js-disabled>Save</button>
            </form>
            <form class="share" action="#" title="Share <?php echo "$filename" ?> with others">
                <input type="hidden" name="mediasource" value="0"><!-- id of media source -->
                <input type="hidden" name="mediaitem" value="<?php echo "$filename" ?>"><!-- this should really be an absolute file path or other way to uniquely identify a media item -->
                <button type="submit" class="nued" tabindex="-1">
                    <i class="fa fa-share-square-o"></i>&nbsp;Share
                </button>
            </form>
            <!-- instead of a form that takes you to a share component page, a simple mailto could suffice -->
            <!--a href="mailto:?subject=Check%20out%20this%20media%20item" class="expand"><i class="fa fa-share-square-o"></i> Share</a-->
            <form class="rename" action="#" title="Rename this media Item">
                <input type="hidden" name="mediasource" value="0"><!-- id of media source -->
                <input type="hidden" name="mediaitem" value="<?php echo "$filename" ?>"><!-- this should really be an absolute file path or other way to uniquely identify a media item -->
                <button type="submit" class="nued" tabindex="-1">
                    <i class="fa fa-edit"></i>&nbsp;Rename
                </button>
            </form>
            <form class="delete" action="#" title="Permanetly delete <?php echo "$filename" ?>">
                <input type="hidden" name="mediasource" value="0"><!-- id of media source -->
                <input type="hidden" name="mediaitem" value="<?php echo "$filename" ?>"><!-- this should really be an absolute file path or other way to uniquely identify a media item -->
                <button type="submit" class="nued" tabindex="-1">
                    <i class="fa fa-trash"></i>&nbsp;Delete
                </button>
            </form>
        </nav>
    </td>
</tr><?php
}
?>