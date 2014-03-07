/*
Image Data storage object
Part of TheBigPicture project
*/

function ImageData(src, cb)
{
	var scope = this;
	this.img = new Image();
	this.img.onload = function()
	{
		ImageProcessor(scope.img, 5, true, function(data)
		{
			scope.canvas = data.canvas;
			scope.tint = new Tint(data);			
			cb();
		});
	}
	this.img.src = "proxy.php?src=" + encodeURIComponent(src);
}
