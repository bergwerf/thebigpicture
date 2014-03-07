/*
TheBigPicture object
Part of TheBigPicture project

This object is built to turn an image into a mosaic of associated images.

Methods:
- start()

  Starts processing, stops previous process if present.
  
- setPicture({src})

  Sets main picture which will be used in the next process.

- setScale({scale})
- processPicture()
- fillPicture()
- putImage({x}, {y}, {i}, {diff})
*/

function getMousePos(canvas, e)
{
	var rect = canvas.getBoundingClientRect();
	return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

var TheBigPicture = {
	//data
	src: "",//main picture source
	img: undefined,//main picture Image()
	size: 100,//main picture processing size
	cb: undefined,//progress callback, can be replaced to stop process
	terminate: false,//used to terminate the processing
	
	//big data
	picture: [],//main picture Tints array[x][y].Tint
	grid: [],//output grid data array[x][y].GridBox
	
	//graphic
	canvas: undefined,
	ctx: undefined,
	overlay: undefined,
	octx: undefined,
	rm: 0.3,//processPicture circle radius = {xs or ys(smallest)} * rm
	xs: 1,//x step, used for canvas processing
	ys: 1,//y step, used for canvas processing
	mouse: { x: 0, y: 0 },
	pointer: { x: 0, y: 0 },//pointer inside canvas
	magnifier: undefined,
	magnifierR: 108,
	magnifierG: 80,//magnifier grid size
	
	initialize: function()
	{
		this.canvas = document.getElementById("canvas");
		this.ctx = canvas.getContext("2d");
		
		this.overlay = document.getElementById("overlay");
		this.overlay.width = window.innerWidth;
		this.overlay.height = window.innerHeight;
		this.octx = overlay.getContext("2d");
		
		this.magnifier = new Image();
		this.magnifier.src = "img/magnifier.png";
		
		this.overlay.addEventListener('mousemove', function(e)
		{
			TheBigPicture.mouse = getMousePos(overlay, e);
			TheBigPicture.pointer = getMousePos(canvas, e);
			TheBigPicture.drawMagnifier.call(TheBigPicture);
		}, false);
		
		$("#cancel-process").on("click", function()
		{
			$("#search").removeClass("blur");
			$("#process").addClass("hidden");
			$("#analyze-message").addClass("hidden");
			$("#bigpicture-box").css("padding-top", "");
			$("#bigpicture-box").css("padding-left", "");
			TheBigPicture.terminate = true;
			Search.loadAll = false;
		});
	},
	
	start: function()
	{
		$("#search").addClass("blur");
		$("#process").removeClass("hidden");
		$("#canvas").addClass("hidden");
		$("#analyze-message").removeClass("hidden");
		TheBigPicture.terminate = false;
		
		this.cb = function()
		{
			TheBigPicture.processPicture.call(TheBigPicture);
		}
		
		window.setTimeout(this.cb, 100);
	},
	
	processPicture: function()
	{
		var scope = this;
		this.img = new Image();
		this.img.onload = function()
		{
			scope.overlay.width = window.innerWidth;
			scope.overlay.height = window.innerHeight;
		
			var box = $("#bigpicture-box");
			var img_ratio = scope.img.width / scope.img.height;
			var box_ratio = (box.width() - 20) / (box.height() - 20);
			if(img_ratio > box_ratio)//img wider than box
			{
				scope.canvas.width = box.width() - 20;
				scope.canvas.height = scope.canvas.width / img_ratio;
				box.css("padding-top", (box.height() - scope.canvas.height) / 2);
			}
			else//img taller than box
			{
				scope.canvas.height = box.height() - 20;
				scope.canvas.width = scope.canvas.height * img_ratio;
				box.css("padding-left", (box.width() - scope.canvas.width) / 2);
			}
			
			ImageProcessor(scope.img, scope.size, false, function(data)
			{
				//prepare images array
				scope.grid = new Array();
				scope.grid.width = data.width;
				scope.grid.height = data.height;
				for(var x = 0; x < data.width; x++)
				{
					scope.grid.push(new Array());
					for(var y = 0; y < data.height; y++)
					{
						var i = (y * data.width + x) * 4;
						var sample = new Object();
						sample.data = [ data.data[i], data.data[i + 1], data.data[i + 2], data.data[i + 3] ];
						sample.width = sample.height = 1;
						scope.grid[x].push(new GridBox(sample));
					}
				}
				
				scope.xs = scope.canvas.width / (data.width);
				scope.ys = scope.canvas.height / (data.height);
				var r = scope.xs < scope.ys ? scope.xs * scope.rm : scope.ys * scope.rm;
				
				for(var x = 0; x < scope.grid.width; x++)
				{
					for(var y = 0; y < scope.grid.height; y++)
					{
						scope.ctx.beginPath();
						scope.ctx.arc((x + .5) * scope.xs, (y + .5) * scope.ys, r, 0, 2 * Math.PI, false);
						scope.ctx.fillStyle = scope.grid[x][y].tint.getColorString();
						scope.ctx.fill();
						scope.ctx.closePath();
					}
				}
				
				$("#analyze-message").addClass("hidden");
				$("#canvas").removeClass("hidden");
				
				scope.cb = function()
				{
					scope.fillPicture.call(TheBigPicture);
				}
				
				window.setTimeout(scope.cb, 100);
			});
		}
		this.img.src = "proxy.php?src=" + encodeURIComponent(this.src);
	},
	
	processImage: function(i)
	{
		if(TheBigPicture.terminate) return;
		Search.loadResult(i, function()
		{
			//loop trough all possible positions
			for(var x = 0; x < TheBigPicture.grid.width; x++)
			{
				for(var y = 0; y < TheBigPicture.grid.height; y++)
				{
					//compare
					var diff = TheBigPicture.grid[x][y].compare(Results[i]);
					if(diff < tolerance)
						TheBigPicture.putImage(x, y, i, diff);
				}
			}
			
			TheBigPicture.cb = function()
			{
				//redraw magnifier
				TheBigPicture.drawMagnifier();
			
				i++;
				TheBigPicture.processImage.call(TheBigPicture, i);
			}
			
			window.setTimeout(TheBigPicture.cb, 100);
		});
	},
	
	fillPicture: function()
	{
		this.processImage(0);
	},
	
	putImage: function(x, y, i, diff)
	{		 
		//store
		this.grid[x][y].add(i, diff);
		
		//draw best image for this entry
		var canvas = this.grid[x][y].getBest();
		if(canvas !== undefined)
			this.ctx.drawImage(canvas, x * this.xs, y * this.ys, this.xs, this.ys);
	},
	
	drawMagnifier: function()
	{
		var x = this.pointer.x / this.xs;
		var y = this.pointer.y / this.ys;
		var minx = Math.round(x) - 2;
		var miny = Math.round(y) - 2;
		var sx = this.mouse.x - (x - minx) * this.magnifierG;
		var sy = this.mouse.y - (y - miny) * this.magnifierG;
		
		this.octx.clearRect(0, 0, this.overlay.width, this.overlay.height);
		
		this.octx.save();
		{
			this.octx.lineWidth = 5.0;
			this.octx.strokeStyle = "#eeeeee";
			this.octx.fillStyle = "#eeeeee";
			
			this.octx.beginPath();
			this.octx.arc(this.mouse.x, this.mouse.y, this.magnifierR, 0, 2 * Math.PI, false);
			this.octx.closePath();
			
			this.octx.fill();
			
			this.octx.clip();
			{
				//images
				for(var xi = 0; xi < 4; xi++)
					for(var yi = 0; yi < 4; yi++)
						this.drawMagnifiedImage(minx + xi, miny + yi, 
							sx + xi * this.magnifierG, sy + yi * this.magnifierG);
				
				/*this.octx.drawImage(this.magnifier, this.mouse.x - this.magnifierR,
					this.mouse.y - this.magnifierR, 2 * this.magnifierR, 2 * this.magnifierR);*/
			}
			
			this.octx.stroke();
		}
		this.octx.restore();
	},
	
	drawMagnifiedImage: function(xi, yi, x, y)
	{
		if(xi < 0 || xi >= this.grid.width || yi < 0 || yi >= this.grid.height) return;
		if(this.grid[xi][yi].getLastBest() == undefined) return;
		this.octx.drawImage(this.grid[xi][yi].getLastBest(),
			x, y, this.magnifierG, this.magnifierG);
	},
	
	setPicture: function(src)
	{
		this.src = src;
	},
	
	setScale: function(scale)
	{
		this.scale = scale;
	}
};
