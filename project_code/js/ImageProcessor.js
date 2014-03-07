/*
ImageProcessor({img}, {size}, {square}, {cb})
Part of TheBigPicture project

This function processes the image using an offscreen canvas context.
- {img} is an Image() object
- Start values: var x = 0, y = 0, w = img.width, h = img.height
- If {square} = true, it crops or resizes the image to a square
- The function resizes the largest side of the image to {size}
- The image is drawn to the offscreen canvas with the calculated dimensions
- The resulting pixels are saved in the {data} object and passed
  to the callback as first argument
  
  data = {
      width: 1,
      height: 1,
      x: 0, y: 0,
      data: [],//row by row 1D pixel data (4 channels)
  }
*/
var SQUARE_METHOD = 0;//0 = resize, 1 = crop

function ImageProcessor(img, size, square, cb)
{
	var x = 0, y = 0, w = img.width, h = img.height;
	var image = {};
	
	if(square)
	{
		//calculate & draw large image canvas
		if(SQUARE_METHOD == 0)//resize
		{
			if(w > h) h = w;
			else w = h;
		}
		else//crop
		{
		}
		
		image = document.createElement("canvas");
		image.width = w;
		image.height = h;
		image.getContext("2d").drawImage(img, x, y, w, h);
		
		//calculate small image dimensions
		if(SQUARE_METHOD == 0)//resize
		{
			w = h = size;
		}
		else//crop
		{
		}
	}
	else
	{
		var ratio = ratio = w / h;
		if(w > h)
		{
			w = size;
			h = w / ratio;
		}
		else
		{
			h = size;
			w = h * ratio;
		}
	}
	
	var canvas = document.createElement("canvas");
	canvas.width = w;
	canvas.height = h;
	var ctx = canvas.getContext("2d");
	ctx.drawImage(img, x, y, w, h);
	
	//(cut pixels to remove misterious black dots on sides)
	var data = ctx.getImageData(0, 0, w - 1, h - 1);
	data.x = x;
	data.y = y;
	
	if(square)//include canvas with cropped / resized image
		data.canvas = image;
	
	cb(data);
};

