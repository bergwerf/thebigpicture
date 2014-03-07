/*
Scraper object
Part of TheBigPicture project

JavaScript wrapper for the (Google) Images Scraper (PHP)

Methods:
- setQuery({query})
  
  Sets the current search query

- load({i}, {n}, cb)

  Retrieves JSON data from crawl.sh
  * {i} as i and {n} as n parameter
  * Replaces the data object with new data.
  (uses server side bash script)
  
- getSource({i}, cb)

  Calls cb with image {i} as argument
  If {i} is larger than the largest current image index,
  the Scraper uses the load method to retrieve new image data.

Server:
- crawl.php?q={q}&i={i}&n={n}

  Returns JSON data containing image
  thumnail urls from Google Images
  thumnail urls from Google Images
  * {q} = Google Images search query
  * {i} = start page index
  * {n} = number of pages
  (20 images per page)
  
  This server side PHP should be
  protected from CSRF
*/

var Scraper = {
    STEP: 1,//data is loaded with STEP as {n} value
    data: undefined,
    size: -1,//total number of Google Images results
    query: "",
    
    setQuery: function(query)
    {
        if(query == this.query) return;
        this.query = query;
        this.size = -1;//reset size
        this.data = undefined;
    },
    
    load: function(i, n, cb)
    {
        $.getJSON("scraper.php?q=" + this.query + "&i=" + i + "&n=" + n, function(data)
        {
			Scraper.data = data;
			if(data.images.length < n * 20)
				Scraper.size = data.ei;
			cb();
		});
    },
    
    getSource: function(i, cb)
    {
		if(i >= this.size && this.size >= 0) return;
		
		if(this.data == undefined)//load first set
		{
			this.load(Math.floor(i / 20), this.STEP, function()
			{
				Scraper.getSource(i, cb);
			});
		}
		else if(i >= this.data.si && i < this.data.ei)//return loaded source
        {
            cb(this.data.images[i - this.data.si]);
            return;
        }
        else//load next set
		{
			this.load(Math.floor(i / 20), this.STEP, function()
			{
				Scraper.getSource(i, cb);
			});
		}
    }
};
