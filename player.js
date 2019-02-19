// This variable will store the video tag for later use
var player;

// Wait for document to be loaded
window.onload = function()
{
	// Locate the video player
	player = document.getElementById('player').getElementsByTagName('video')[0];

	// Locate all of the controls in the document
	var playButton = document.getElementById('playButton');
	var stopButton = document.getElementById('stopButton');
	var volumeControl = document.getElementById('volumeControl');
	
	// Attach their interactivity
	playButton.onclick = playButtonClicked;
	stopButton.onclick = stopButtonClicked;
	volumeControl.onchange = volumeChanged;
}

function playButtonClicked()
{
	// If the playback is paused..
	if( player.paused )
	{
		// ..resume it and swap the text on the button
		player.play();
		
		// Change the label on the play/pause button
        this.firstChild.nodeValue = 'Pause';
    }
	else
	{
		// ..otherwise pause playback and swap the text on the button
        player.pause();
		
		// Change the label on the play/pause button
        this.firstChild.nodeValue = 'Play';
    }
}

function stopButtonClicked()
{
	// Change the label on the play/pause button
	var playButton = document.getElementById('playButton');
	playButton.firstChild.nodeValue = 'Play';
	
	// Pause playback
	 player.pause();
	 
	 // Reset the position of the video
	 player.currentTime = 0;
}

function volumeChanged()
{
	// Volume ranges from 0 to 1
	// The range slider's value (0 to 100) is divided by 100
	player.volume = this.value / 100;
}