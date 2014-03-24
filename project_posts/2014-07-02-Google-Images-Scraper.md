Image search via Google Images is a problem because Google only provides a paid or limited Custom Search API. Therefore I wrote a PHP based Google Images scraper using the [SimpleHTMLDOM Library](http://simplehtmldom.sourceforge.net/ "SimpleHTMLDOM Library").
I can now retrieve the image thumbnails from Google Images trough this piece of PHP:
```
foreach($html -> find("img") as $img)
{
	$result[$idx] = $img -> src;
	$idx++;
}
```
This data is written as JSON so it can be retrieved by JavaScript using AJAX.
These thumbnails are eneough for my application. However, I'm considering using the Picasa Data API for this instead because it is slightly faster and legal ;-).
