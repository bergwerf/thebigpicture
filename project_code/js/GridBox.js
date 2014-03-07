/*
GridBox object
Part of TheBigPicture project

Methods:
- Tint({data})
  
  {data} = sliced ImageProcessor output
*/

function GridBox(data)
{
	this.tint = new Tint(data);
	this.list = new Array();
	this.best = {
		i: -1,
		diff: -1
	};
}

GridBox.prototype.compare = function(img_data)
{
	return this.tint.compare(img_data.tint);
}

GridBox.prototype.add = function(i, diff)
{
	this.list.push({
		i: i,
		diff: diff
	});
}

GridBox.prototype.getBest = function()
{
	this.best = {
		i: -1,
		diff: -1
	};
	
	for(var i = 0; i < this.list.length; i++)
	{
		if(this.list[i].diff < this.best.diff || this.best.diff == -1)
		{
			this.best.diff = this.list[i].diff;
			this.best.i = this.list[i].i;
		}
	}
	
	if(this.best.i == -1) return undefined;
	else return Results[this.best.i].img;
}

GridBox.prototype.getLastBest = function()
{
	if(this.best.i == -1) return undefined;
	else return Results[this.best.i].img;
}
