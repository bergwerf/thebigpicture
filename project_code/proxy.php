<?php
header('Content-type: image');
parse_str($_SERVER["QUERY_STRING"]);
if(isset($src)) echo file_get_contents(urldecode($src));
?>
