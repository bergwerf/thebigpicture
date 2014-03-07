/*
Color related functions
Part of TheBigPicture project

Includes:
- Color difference
  
  Implementation of cie1994 algorithm to get Delta-E value, thanks to:
  http://html5hub.com/exploring-color-matching-in-javascript/
  https://github.com/drakonka/TSVETT/blob/master/game.js
*/

/*
To score color accuracy properly we need to convert HSL to LAB
and then get Delta-E by using CIE94 formula. To do this we need
to convert HSL to RGB to XYZ to LAB, then run CIE94 formula
*/

function HUE2RGB(p, q, t)
{
	if(t < 0) t += 1;
	if(t > 1) t -= 1;
	if(t < 1/6) return p + (q - p) * 6 * t;
	if(t < 1/2) return q;
	if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
	return p;
}

function HSL2RGB(h, s, l)
{
    var r, g, b;
 
    if(s == 0) r = g = b = l;//achromatic
    else
    {
        
 
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = HUE2RGB(p, q, h + 1/3);
        g = HUE2RGB(p, q, h);
        b = HUE2RGB(p, q, h - 1/3);
    }
 
    return [r * 255, g * 255, b * 255].map(Math.round);
};

function RGB2XYZ(r, g, b)
{
	var _r = (r / 255);
	var _g = (g / 255);
	var _b = (b / 255);

	if(_r > 0.04045)
		_r = Math.pow(((_r + 0.055) / 1.055 ), 2.4);
	else
		_r = _r / 12.92;

	if(_g > 0.04045)
		_g = Math.pow(((_g + 0.055) / 1.055 ), 2.4);
	else
		_g = _g / 12.92;

	if(_b > 0.04045)
		_b = Math.pow(((_b + 0.055) / 1.055 ), 2.4);
	else
		_b = _b / 12.92;

	_r = _r * 100;
	_g = _g * 100;
	_b = _b * 100;

	//Observer = 2°, Illuminant = D65
	X = _r * 0.4124 + _g * 0.3576 + _b * 0.1805;
	Y = _r * 0.2126 + _g * 0.7152 + _b * 0.0722;
	Z = _r * 0.0193 + _g * 0.1192 + _b * 0.9505;

	return [X, Y, Z];
};

function XYZ2LAB(x, y, z)
{
    var ref_X =  95.047;
    var ref_Y = 100.000;
    var ref_Z = 108.883;

    var _X = x / ref_X;//ref_X =  95.047   Observer= 2°, Illuminant= D65
    var _Y = y / ref_Y;//ref_Y = 100.000
    var _Z = z / ref_Z;//ref_Z = 108.883

    if(_X > 0.008856)
		_X = Math.pow(_X, (1/3));
    else
		_X = (7.787 * _X) + (16 / 116);

    if(_Y > 0.008856)
		_Y = Math.pow(_Y, ( 1/3 ));
    else
		_Y = ( 7.787 * _Y ) + ( 16 / 116 );

    if(_Z > 0.008856)
    	_Z = Math.pow(_Z, ( 1/3 ));
    else
    	_Z = ( 7.787 * _Z ) + ( 16 / 116 );

    var CIE_L = (116 * _Y) - 16;
    var CIE_a = 500 * (_X - _Y);
    var CIE_b = 200 * (_Y - _Z);

	return [CIE_L, CIE_a, CIE_b];
};

function cie1994(x, y, isTextiles)
{
	var x = {l: x[0], a: x[1], b: x[2]};
	var y = {l: y[0], a: y[1], b: y[2]};
	
	labx = x;
	laby = y;
	
	var k2;
	var k1;
	var kl;
	var kh = 1;
	var kc = 1;
	
	if(isTextiles)
	{
		k2 = 0.014;
		k1 = 0.048;
		kl = 2;
	}
	else
	{
		k2 = 0.015;
		k1 = 0.045;
		kl = 1;
	}

	var c1 = Math.sqrt(x.a * x.a + x.b * x.b);
	var c2 = Math.sqrt(y.a * y.a + y.b * y.b);

	var sh = 1 + k2 * c1;
	var sc = 1 + k1 * c1;
	var sl = 1;

	var da = x.a - y.a;
	var db = x.b - y.b;
	var dc = c1 - c2;

	var dl = x.l - y.l;
	var dh = Math.sqrt(da * da + db * db - dc * dc);

	return Math.sqrt(Math.pow((dl / (kl * sl)), 2) +
					 Math.pow((dc / (kc * sc)), 2) +
					 Math.pow((dh / (kh * sh)), 2));
}

