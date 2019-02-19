/////////////////////////////////// Global variables ///////////////////////////////////

const pathToImg = 'http://i482.photobucket.com/albums/rr188/evanescenta/';	// Location of images displayed on webpage
//const pathToImg = 'images/';	// Location of images displayed on webpage

const fireworks = $('.fireworks');							// Fireworks background, different image on each page
const darkLayer = $('.dark-layer');							// Dark grey layer used to darken fireworks background images



////////////////////// Delete existing webpage elements under darkLayer //////////////////////

function clearWebpage() {
	darkLayer.children().remove();
}



////////////////////////////// Build display objective webpage //////////////////////////////

function displayObjective(level) {

	// Remove existing elements from webpage
	clearWebpage();

	// Update background image
	fireworks.css('background', 'url("' + pathToImg + 'fireworks_2.jpg") no-repeat center').css('background-size', 'cover').css('min-height', '95%');

	// Insert new elements
	const h1 = $('<h1>Find the matching 2018 cards</h1>');
	const starImg = $('<img class="image-2018" src="' + pathToImg + '2018.jpg" alt="2018">');

	darkLayer.append(h1);
	starImg.insertAfter(h1);

	// Display objective for 2 seconds, then start the game
	const delay = 2000;										// 2 seconds
	setTimeout(function () {
		startCardGame(level);
	}, delay);

}



/////////////////////// Build start game webpage and play the game ///////////////////////

function startCardGame(level) {


	////////////////////////////// Build start game webpage //////////////////////////////
	
	const imgList = [										// 16 images available. An image will be used on 2 cards.
		['FHvideo.mp4', '2018'],
		['aurora.jpg', 'aurora borealis over snowy mountain'],
		['berry.jpg', 'branch with berries'],
		['cat.jpg', 'cat playing with Christmas lights'],
		['champagne.jpg', '2 glasses of champagne'],
		['cookies.jpg', 'heart-shaped cookie arrangement'],
		['dog.jpg', 'Husky dog in the snow'],
		['firwreath.jpg', 'fir wreath with cones and baubles'],
		['forest.jpg', 'fir tree forest view from above'],
		['house.jpg', 'winter landscape with house'],
		['iceberg.jpg', 'an iceberg'],
		['lake.jpg', 'winter landscape with lake and fir tree forest'],
		['mountain.jpg', 'snowy mountain at sunset'],
		['penguin.jpg', 'a penguin'],
		['snowman.jpg', 'a snowman and a plush toy'],
		['star.jpg', 'star-shaped bauble']
	]

	const hiddenImg = pathToImg + 'hiddencard.jpg';			// Hidden card image

	let row, column;										// Number of rows/columns of cards

	switch (level) {
		
		case 'easy':
			row = 2;
			column = 4;
			break;
			
		case 'normal':
			row = 3;
			column = 6;
			break;
			
		case 'hard':
			row = 4;
			column = 8;
	}

	// Create list of available image indexes. At start, each image index 0-3, or 0-8, or 0-15 (depending on level) will be listed twice.
	let imgIndex = [];

	for (let i = 0; i < (row*column/2); i++) {
		imgIndex.push(i,i);
	}

	// Remove existing elements from webpage
	clearWebpage();

	// Update background image
	fireworks.css('background', 'url("' + pathToImg + 'fireworks_5.jpg") no-repeat center').css('background-size', 'cover').css('min-height', '95%');

	// Insert table
	const table = $('<table id="card-table"></table>');
	darkLayer.append(table);

	// Insert table cells and assign random index from imgIndex (imgList) to each cell
	let randomIndex;										// Random index from imgIndex array
	let newTd;												// New cell to be added to the table

	for (let i = 0; i < row; i++) {

		table.append('<tr></tr>');                    		// Add new line to table

		for (let j = 0; j < column; j++) {

			randomIndex = Math.floor(Math.random() * imgIndex.length);	// Select random index from imgIndex array
			newTd = $('<td class="hidden">' + imgIndex[randomIndex] + '</td>');		// Store index as text in the new cell. td class hidden will be toggled when card image is revealed.
			imgIndex.splice(randomIndex,1);					// Remove used element from list of available image indexes

			if (j === 0) {									// If first cell on row, add new cell as first child of row
				$('tr').last().append(newTd);
			} else {										// Else, add new cell after last cell
				newTd.insertAfter($('td').last());
			}

			$('td').last().append($('<img class="card-image" src="' + hiddenImg + '" alt="hidden card">'));	// Display "hidden" image on card
		}
	}


	//////////////////////////////// Play the game ////////////////////////////////


	let currentCard, previousCard;							// td cell of the current/previously clicked card
	let cardsShown = 0;										// Number of cards visible to user
	let currentIndex, previousIndex;						// Index (inside imgList), identifies the image on the current/previously clicked card

	const delay = 1000;										// 1 second delay before removing matching cards
	let startTime = Date.now();								// Game start time
	let endTime;											// Game end time
	let clickDisabled = false;								// clickDisabled will be true when 2 matching cards are already visible

	//Listen for click only on hidden cards	(td class="hidden")
	table.on('click', 'td.hidden', function () {

		// No action on click if 2 matching cards are already visible
		if (clickDisabled)
			return;

		switch (cardsShown) {

			case 0:

				// Update most recently clicked card and the current index, and display its image
				currentCard = $(this);
				currentIndex = Number(currentCard.text());
				currentCard.toggleClass("hidden");
				currentCard.children('img').attr('src', pathToImg + imgList[currentIndex][0]).attr('alt', imgList[currentIndex][1]);
				cardsShown = 1;								// 1 card visible to user at the moment
				break;

			case 1:

				// When a new card is clicked, the previous currentCard becomes previousCard
				previousCard = currentCard;
				previousIndex = currentIndex;

				// Update most recently clicked card and its image index, and display its image
				currentCard = $(this);
				currentIndex = Number(currentCard.text());
				currentCard.toggleClass("hidden");
				currentCard.children('img').attr('src', pathToImg + imgList[currentIndex][0]).attr('alt', imgList[currentIndex][1]);

				// Check if most recently clicked card and previously clicked card match
				if (currentIndex !== previousIndex) {		// Not matching
					cardsShown = 2;							// 2 cards visible to user at the moment

				} else if (currentIndex === 0) {			// Cards match, found the desired image (2018)

					clickDisabled = true;					// Disable event listener actions on click until the matching cards are removed
					endTime = Date.now();

					setTimeout(function () {
						clickDisabled = false;
						displayWinMessage(level, (endTime-startTime)/1000);
					}, delay);

				} else {									// Cards match, image different than 2018. Wait for 1 second and then remove the matching cards.

					clickDisabled = true;

					setTimeout(function removeMatchingCards() {
						currentCard.children().remove();
						previousCard.children().remove();
						cardsShown = 0;
						clickDisabled = false;
					}, delay);
				}

				break;

			case 2:

				// Hide the non-matching images of the 2 cards that were already visible
				currentCard.toggleClass("hidden");
				currentCard.children('img').attr('src', hiddenImg).attr('alt', 'hidden card');
				previousCard.toggleClass("hidden");
				previousCard.children('img').attr('src', hiddenImg).attr('alt', 'hidden card');

				// Update most recently clicked card and its image index, and display its image
				currentCard = $(this);
				currentIndex = Number(currentCard.text());
				currentCard.toggleClass("hidden");
				currentCard.children('img').attr('src', pathToImg + imgList[currentIndex][0]).attr('alt', imgList[currentIndex][1]);

				cardsShown = 1;								// 1 card visible to user at the moment
				break;
		}
	});

}



////////////////////////////// Build win message webpage //////////////////////////////

function displayWinMessage(level, x) {

	// Remove existing elements from webpage
	clearWebpage();

	// Update background image
	fireworks.css('background', 'url("' + pathToImg + 'fireworks_3.jpg") no-repeat center').css('background-size', 'cover').css('min-height', '95%');

	// Insert new elements
	let h1 = $('<h1>Well done, !<br> You found 2018 in ' + x + ' seconds!</h1>');

	switch (level) {
		case 'easy':
			h1.html(h1.html().slice(0, 11) + 'padawan' + h1.html().slice(11));
			break;
		case 'normal':
			h1.html(h1.html().slice(0, 11) + 'Jedi Knight' + h1.html().slice(11));
			break;
		case 'hard':
			h1.html(h1.html().slice(0, 11) + 'Jedi Master' + h1.html().slice(11));
	}

	const claimReward = $('<input type="submit" id="claim-reward" name="claimReward" value="Claim reward!">');
	const buttonMenu = $('<div class="button-menu"></div>');

	darkLayer.append(h1);
	darkLayer.append(buttonMenu);
	buttonMenu.append(claimReward);
	addButtons(buttonMenu);

}



//////////////////////////// Recreate Start game button menu ////////////////////////////

function addButtons(menu){

	// Insert Play again fake button, and Easy, Normal and Hard buttons as children of menu argument
	const playAgain = $('<input type="submit" id="fake" name="fake" value="Play again!">');
	const easy = $('<input type="submit" id="easy" name="start-easy" value="Easy">');
	const normal = $('<input type="submit" id="normal" name="start-normal" value="Normal">');
	const hard = $('<input type="submit" id="hard" name="start-hard" value="Hard">');

	menu.append(playAgain);
	easy.insertAfter(playAgain);
	normal.insertAfter(easy);
	hard.insertAfter(normal);

}



///////////////////////////// Build reward message webpage /////////////////////////////

function displayReward() {

	// Remove existing elements from webpage
	clearWebpage();

	// Update background image and reduce opacity of darkLayer
	fireworks.css('background', 'url("' + pathToImg + 'fireworks.gif") no-repeat center').css('background-size', 'cover').css('min-height', '95%');
	darkLayer.css("background", "rgba(5,5,5,0.5)");

	// Insert new elements
	const container = $('<div class="container"></div>');
	const h1 = $('<div class="message-container"><h1>Happy New Year 2018!<br>May all your wishes come true!</h1></div>');
	const welcomeSign = $('<div class="welcome-container"><img class="welcome-image" src="' + pathToImg + 'lasvegas2.png" alt="welcome to 2018 sign"></div>');

	darkLayer.append(container);
	container.append(h1);
	welcomeSign.insertAfter(h1);

	// Insert button menu
	const buttonMenu = $('<div class="button-menu"></div>');
	const music = $('<audio autoplay="autoplay" class="audio"><source src="http://audionautix.com/Music/JoyToTheWorld.mp3" /></audio>');
	const playButton = $('<button type="button" class="play-audio">XX</button>');
	const pauseButton = $('<button type="button" class="pause-audio">XX</button>');
	const increaseVolumeButton = $('<button type="button" class="increase-audio">XX</button>');
	const decreaseVolumeButton = $('<button type="button" class="decrease-audio">XX</button>');

	buttonMenu.insertAfter(container);
	addButtons(buttonMenu);
	buttonMenu.append(playButton);
	pauseButton.insertAfter(playButton);
	increaseVolumeButton.insertAfter(pauseButton);
	decreaseVolumeButton.insertAfter(increaseVolumeButton);
	music.insertAfter(buttonMenu);

}



////////////////////////////////// Event listeners //////////////////////////////////

// Listen for click on Easy, Normal or Hard button on landing page
$('.dark-layer').on('click', 'input[name*="start"]', function(evt) {
	evt.preventDefault();                           		// Prevent page reload on Submit
	let level = $(this).attr('id');							// Difficulty level for the matching cards game (Easy, Normal or Hard)
	displayObjective(level); 								// Rebuild webpage elements to display the objective of the game
});


// Listen for click on Claim reward button on win page
$('.dark-layer').on('click', 'input[name="claimReward"]', function(evt) {
	evt.preventDefault();
	displayReward();                  						// Rebuild webpage elements to display the reward page
});


// Listen for click on audio controls on reward page
$('.dark-layer').on('click', 'button[class*="audio"]', function(evt) {
	
	evt.preventDefault();
	
	let control = $(this).attr('class');					// Difficulty level for the matching cards game (Easy, Normal or Hard)
	let vol = $('.audio').prop("volume");					// Current volume

	switch (control) {
		
		case 'play-audio':
			if (vol < 0.01) 
				$('.audio').prop("volume", 0.1);			// If volume is already muted, start playing at low volume
			$('.audio').trigger("play");
			break;
			
		case 'pause-audio':
			$('.audio').trigger("pause");
			break;
			
		case 'increase-audio':
			vol = (vol >= 0.8) ? 1 : vol + 0.2;				// Increase volume by 0.2 (maximum value 1)
			$('.audio').prop("volume", vol);
			break;
			
		case 'decrease-audio':
			vol = (vol <= 0.2) ? 0 : vol - 0.2;				// Decrease volume by 0.2 (minimum value 0)
			$('.audio').prop("volume", vol);
			break;
	}
			
});