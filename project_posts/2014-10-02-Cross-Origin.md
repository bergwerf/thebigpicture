As expected, I can't read the pixel data from the thumbnails my PHP program scraped from Google Images due to Cross-Orign data. In order to solve this problem, I wrote a small, server-side image proxy (not sure what Google thinks about that ;-) That probabely sounds complicated but this is all you need to mirror image data (the image url to retrieve is passed via a URL query):
```
header('Content-type: image');
parse_str($_SERVER["QUERY_STRING"]);
if(isset($src)) echo file_get_contents(urldecode($src));
```
