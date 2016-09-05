
// Define the jQuery objects to append
var $overlay = $('<div id="overlay"></div>');
var $image = $('<img>');
var $caption = $('<p></p>');
var $index = 0;
var $video = $("<iframe id='video-player' frameborder='0' allowfullscreen> </iframe>");

var isVideo = false;
var overlayOn = false;
var videoPlays = false;


//Function: load img or video
function loadMedia(media){
	var mediaLocation=media.attr("href");
	isVideo = media.hasClass("video");
	if (isVideo) {
		$video.attr("src", mediaLocation+'?enablejsapi=1');
		$overlay.append($video);
		$image.detach();
	} else {
		$image.attr("src", mediaLocation);
		$overlay.append($image);
		$video.detach();
	}

	var captionText=media.children("span").text();
	$caption.text(captionText);
	$overlay.append($caption);

}

//Function: button and key navigation when overlay
var prevNext = function (direction){

	//increment or decrement the index value
	if (direction==="prev") {
		$index--;
	}else if (direction ==="next"){
		$index++;
	}

	//Update the new media information
	var $galleryLength = $("#imagegallery li").length;

	//make the images cycle
	if ($index < 0) { 
		$index = $galleryLength-1;
	} else if ($index == $galleryLength) { 
		$index = 0; 
	}

	var indexUpdated = parseInt($index) +1;
	loadMedia($('#imagegallery li:nth-child('+ indexUpdated +') a'));

	//getting rid of focus on the buttons to be able to start video with the spacebar key
	$(':focus').blur();

};

//Function: close the lightbox overlay
var openCloseOverlay = function(event){
	if (event=='open'){
		$overlay.fadeIn();
		overlayOn = true;
	}else if (event=='close'){
		$overlay.fadeOut();
		overlayOn = false;
	}else{
		return false;
	}
	
};

//Function: fires play and pause on embedded Youtube videos in lightbox
function playStopVideo(plays){

	var videoURL = $video.attr("src");
	if (!plays){
		$video[0].contentWindow.postMessage('{"event":"command","func":"' + 'playVideo' + '","args":""}', '*');    
		videoPlays = true;
	} else {
		$video[0].contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
		videoPlays = false;
	}
};

/********************
THE OVERLAY
********************/


$("body").append($overlay);

//Capture the click event of the image
$("#imagegallery a").click(function(event){
	event.preventDefault();
	loadMedia($(this));
	
	//determine the index of the image
	$index=$(this).parent().index();

	//Open the overlay
	openCloseOverlay("open");
});

/********************
NAVIGATION BUTTONS
********************/

//add a buttons
$overlay.add().append("<button id='btnPrev' class='btn'> < </button>");
$overlay.add().append("<button id='btnNext' class='btn'> > </button>");
$overlay.add().append("<button id='btnClose' class='btn'> X </button>");
$overlay.add().append("<p class='info'>You can navigate also with the <br><b>Left</b> and <b>Right</b><br> keys on your keyboard</p>");

//for Next increment and show the new image
$("#btnNext").click(function(event){
	prevNext("next");
});

//for Prev decrement and show the new image
$("#btnPrev").click(function(event){
	prevNext("prev");
});

// for Close hide the overlay
$("#btnClose").click(function(){
	openCloseOverlay("close");
});

/********************
KEYBOARD NAVIGATION
********************/

//Left : 37 ->Previous
//Right : 39 -> Next
//Esc : 27 -> Close the Lightbox
//Space : 32 -> Start the video

$( window ).keyup(function(event) {
  var KeyboardKey = event.which;
  if(overlayOn){
	if (KeyboardKey == '37'){
		prevNext("prev");
	} 
	else if (KeyboardKey == '39'){
		prevNext("next");
	}
	else if (KeyboardKey == '27'){
		closeOverlay();
	//fires only if the media is video
	} else if (KeyboardKey == '32' & isVideo){
		playStopVideo(videoPlays);
	}
  }
});

/********************
LIVE SEARCH
********************/


$("#search").keyup(function(){
	var searchVal = $(this).val();

	$("#imagegallery img").each(function(){
		var searchAttr = $(this).attr("alt") + $(this).siblings().text();

		if (searchAttr.toLowerCase().search(searchVal.toLowerCase()) > -1){
			$(this).parent().parent().fadeIn();
		} else{
			$(this).parent().parent().fadeOut();
		}

	});

});
