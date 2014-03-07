/*
Search object
Part of TheBigPicture project

Loads search data and handles the search layer events
(Scraper object wrapper)
*/

function isEmpty(str)
{
	return str === null || str.match(/^ *$/) !== null;
}

var Results = [];//processed ImageData

var Search = {
	STEP: 20,//size of new image set
    max: 500,//stops when size >= max
	query: "",//search query
	i: 0,//current image loading index
	stop: -1,//current image loading stop index (-1 = infinite)
	cb: undefined,//called when requested images are loaded
	cb2: undefined,//called when requested images are loaded
	loading: false,
	loadAll: false,//call loadNextImageSet until max
	
	initialize: function()
	{
		$("#search-bar input").on("keypress", function(e)
		{
			if(e.which == 13) Search.reload();
		});
		$("#search-bar button").on("click", function(e)
		{
			Search.reload();
		});
		$("#results-container").on("scroll", function(e)
		{
			if($("#wall").height() - ($("#results-container").scrollTop() + $("#results-container").height()) <= 0)
				Search.loadNextImageSet();
		});
	},
	
	reload: function()
	{
		if(isEmpty($("#search-bar input").val())) return;
		
		this.query = $("#search-bar input").val();
		Scraper.setQuery(this.query);
		
		$("#wall").empty();
		this.i = 0;
		Results = [];
		this.loadAll = false;
		this.loading = false;
		this.loadNextImageSet();
		
		this.cb2 = function()
		{
			if($("#wall").height() < $("#results-container").height())
				this.loadNextImageSet();
		}
	},
	
	loadNextImage: function()
	{
		if((Search.i >= Scraper.size && Scraper.size >= 0) || Search.i >= Search.max)
		{
			Search.loading = false;
			if(Search.cb) Search.cb();
			if(Search.cb2) Search.cb2();
		}
		
		Scraper.getSource(Search.i, function(src)
		{			
			Results.push(new ImageData(src, function()
			{
				$("<img class='result'/>")
					.attr("src", src)
					.appendTo($("<div class='image' />")
						.append($("<div class='border' />")
							.css("border-color", Results[Results.length - 1].tint.getColorString()))
						.on("click", function()
						{
							TheBigPicture.setPicture($(this).children("img").attr("src"));
							TheBigPicture.start();
						}).appendTo("#wall"));
				
				Search.i++;
				if((Search.i < Search.stop || Search.stop ==  -1)
				&& (Search.i < Scraper.size || Scraper.size == -1)) Search.loadNextImage();
				else
				{
					Search.loading = false;
					if(Search.cb) Search.cb();
					if(Search.cb2) Search.cb2();
					
					if(Search.loadAll) Search.loadNextImageSet();
				}
			}));
		});
	},
	
	loadNextImageSet: function()
	{
		if(this.i >= Scraper.size && Scraper.size >= 0) return;
		else if(this.loading) return;
		
		$("#results-loader").removeClass("blank");
		this.loading = true;
		this.stop = this.i + this.STEP;
		this.cb = function()
		{
			$("#results-loader").addClass("blank");
		}
		
		this.loadNextImage();
	},
	
	loadResult: function(i, cb)
	{
		this.loadAll = true;
		Search.loadNextImageSet();
		
		this.cb2 = function()
		{
			if(i < Results.length) cb();
			else if(!((Search.i >= Scraper.size && Scraper.size >= 0) || Search.i >= Search.max))
				Search.loadNextImageSet();
		}
		this.cb2();
	}
};
