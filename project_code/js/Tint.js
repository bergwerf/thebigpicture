/*
Tint object
Part of TheBigPicture project

This object stores color information and holds comparison methods

Methods:
- Tint({data})
  
  {data} = ImageProcessor output
*/
var tolerance = 20;//maximum Delta E


//algorithm to find pixmap tint
var TINT_AVERAGE = 0;
var TINT_ALGORITHM = 0;

function Tint(data)
{
	//simple processing
	if(data.data.length == 4)//1x1 input
	{
		this.rgb = [ data.data[0], data.data[1], data.data[2] ];
	}
	else
	{
		if(TINT_ALGORITHM == TINT_AVERAGE)
		{
			this.rgb = [ 0, 0, 0 ];
			for(var i = 0; i < data.data.length; i += 4)
			{
				this.rgb[0] += data.data[i + 0];
				this.rgb[1] += data.data[i + 1];
				this.rgb[2] += data.data[i + 2];
			}
			
			this.rgb[0] /= data.data.length / 4;
			this.rgb[1] /= data.data.length / 4;
			this.rgb[2] /= data.data.length / 4;
		}
	}
	
	this.xyz = RGB2XYZ(this.rgb[0], this.rgb[1], this.rgb[2]);
	this.Lab = XYZ2LAB(this.xyz[0], this.xyz[1], this.xyz[2]);
}

Tint.prototype.getColorString = function()
{
	return "rgb(" + Math.round(this.rgb[0]) +
			  "," + Math.round(this.rgb[1]) +
			  "," + Math.round(this.rgb[2]) + ")";
}

Tint.prototype.compare = function(tint)
{
	return cie1994(this.Lab, tint.Lab, false);
}
