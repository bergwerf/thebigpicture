<!DOCTYPE html>
<html>
	<head lang="en">
		<!-- metadata -->		
		<title>he Big Picture</title>
		<link href="img/icon.png" type="image/png" rel="shortcut icon"/>
		
		<meta name="author" content="Herman Bergwerf" />
		<meta name="description" content="" />
		<meta name="keywords" content="" />
		
		<meta property="og:title" content="Herman Bergwerf" />
		<meta property="og:type" content="website" />
		<meta property="og:url" content="" />
		<meta property="og:image" content="" />
		
		<meta charset="utf-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		
		<!-- external -->
		<link type="text/css" rel="stylesheet" href="http://fonts.googleapis.com/css?family=Open+Sans:400,300,800,700,600" />
		<link type="text/css" rel="stylesheet" href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" />
		<script type="text/javascript" src="//code.jquery.com/jquery-1.10.2.min.js"></script>

		<!-- styles -->
		<link type="text/css" rel="stylesheet" href="css/3d.css" />
		<link type="text/css" rel="stylesheet" href="css/scrollbar.css" />
		<link type="text/css" rel="stylesheet" href="css/loader.css" />
		<link type="text/css" rel="stylesheet" href="css/layout.css" />
		<link type="text/css" rel="stylesheet" href="css/search.css" />
		<link type="text/css" rel="stylesheet" href="css/process.css" />
		
		<!-- scripts -->
		<script type="text/javascript" src="js/Color.js"></script>
		<script type="text/javascript" src="js/Tint.js"></script>
		<script type="text/javascript" src="js/Scraper.js"></script>
		<script type="text/javascript" src="js/ImageProcessor.js"></script>
		<script type="text/javascript" src="js/ImageData.js"></script>
		<script type="text/javascript" src="js/Search.js"></script>
		<script type="text/javascript" src="js/GridBox.js"></script>
		<script type="text/javascript" src="js/TheBigPicture.js"></script>
		<script type="text/javascript" src="js/Main.js"></script>
	</head>
	<body>
		<header>
			<h1>The Big Picture</h1>
		</header>
		<div id="content">
			<div id="front" class="hidden layer" >
				
			</div>
			<div id="search" class="layer">
				<div id="search-bar">
					<input type="text" placeholder="Statue, pizza..." />
					<button class="fa fa-search"></button>
				</div>
				<div id="results-container" class="no-select">
					<div id="wall"></div>
					<div id="results-loader" class="blank loader">
						<span></span>
						<span></span>
						<span></span>
					</div>
				</div>
			</div>
		</div>
		<div id="process" class="hidden layer">
			<div id="bigpicture-box">
				<div id="analyze-message" class="hidden">
					<p>Initializing...</p>
				</div>
				<div id="cancel-process" class="no-select">&#215;</div>
				<canvas id="canvas"></canvas>
				<canvas id="overlay"></canvas>
			</div>
		</div>
	</body>
</html>
