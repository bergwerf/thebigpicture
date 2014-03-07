/*
Picasa object
Part of TheBigPicture project

Picasa Images Seach using the Picasa Data API

https://picasaweb.google.com/data/feed/api/all?alt=json&max-results={max}&start-index={i}&q={q}
*/

var Picasa = {
	STEP: 500,
	query: "",
	
	setQuery: function(query)
    {
        this.query = query;
    },
    
    load: function(i, n, cb)
    {
    },
    
    getURL: function(i, cb)
    {
		$.getJSON("https://picasaweb.google.com/data/feed/api/all?max-results=300&start-index=300&alt=json&q='" + "hello", function(data)
		{
			console.log(data.feed.entry.length);
		});
    }
};
