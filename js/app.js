
// Define the overlay as a jQuery object
var $overlay = $('<div id="overlay"></div>');
var $image = $('<img>');
var $caption = $('<p></p>');
var $index = 0;
var $video = $("<iframe frameborder='0' allowfullscreen> </iframe>");
var overlayOn = false;


//Function: load img or video
function loadMedia(media){
	var mediaLocation=media.attr("href");
	
	if (media.hasClass("video")) {
		$video.attr("src", mediaLocation);
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

	$overlay.fadeIn();
	overlayOn = true;

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
	$overlay.fadeOut();
	overlayOn = false;
});

/********************
KEYBOARD NAVIGATION
********************/

//Left : 37 ->Previous
//Right : 39 -> Next
$( window ).keyup(function(event) {
  var KeyboardKey = event.which;
  
  if(overlayOn){
    if (KeyboardKey == '37'){
      prevNext("prev");
    } 
    else if (KeyboardKey == '39'){
      prevNext("next");
    }
  }
});

/********************
LIVE SEARCH
********************/


$("#search").keyup(function(){
	var searchVal = $(this).val();

	$("#imagegallery img").each(function(){
		var searchAttr = $(this).attr("alt");

		if (searchAttr.toLowerCase().search(searchVal.toLowerCase()) > -1){
			$(this).parent().parent().fadeIn();
		} else{
			$(this).parent().parent().fadeOut();
		}

	});

});
