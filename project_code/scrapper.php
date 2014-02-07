<?php
/*
Goolge Images scraper
This scraper returns a JSON array containig thumbnail urls from
Google Images.
(the Google Images thumbnails are large eneough for The Big Picture)

Parameters:
- $q = Google Images search query
- $i = start page index
- $n = number of pages

Resources:
- http://simplehtmldom.sourceforge.net/
*/
include("php/simple_html_dom.php");
header('Content-type: application/json');

parse_str($_SERVER["QUERY_STRING"]);
if(!isset($q) || !isset($i) || !isset($n)) return;

$i = intval($i);
$n = intval($n);

echo "{".
	 //start index
	 '"si":'.($i * 20).
	 //end index (index after last index)
    ',"ei":'.($i * 20 + $n * 20).
     //image data array
    ',"images":[';

$first = true;
for($p = 0; $p < $n; $p++)
{
	$html = file_get_html("https://www.google.com/images?q=".urlencode($q).
		"&start=".($i * 20 + $p * 20)."&sout=1");
	
	//find all thumbnails
	foreach($html -> find("img") as $img)
	{
		if(!$first) echo ",";
		else $first = false;
		echo '"'.$img -> src.'"';
	}
}

echo "]}";
?>
