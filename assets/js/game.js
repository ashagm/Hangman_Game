/* Hangman Object */

var hangman = {
	chances : 6,
	images :[{
		6 : 'assets/images/hangman_6.gif', 
		5 : 'assets/images/hangman_5.gif', 
		4 : 'assets/images/hangman_4.gif', 
		3 : 'assets/images/hangman_3.gif', 
		2 : 'assets/images/hangman_2.gif',
		1 : 'assets/images/hangman_1.gif',
		'win': 'assets/images/Hangman-win.gif', //win
		'loss': 'assets/images/Hangman-lose.gif' //loss
	}],
		
	updateImage : function(imageNum){
		getEl('gif-image').src = this.images[0][imageNum];
	},

	resetHangman : function(){
		this.chances = 6;
		getEl('chances').innerHTML = this.chances;
		getEl('gif-image').src = this.images[0][6];
	},

	addNoose : function(){	
		this.chances--;	
		getEl('chances').innerHTML = this.chances;
		this.updateImage(this.chances);
		if(this.chances === 0){
			return false;
		} 
		return true;
	}
};

/* Word object */

var word = { 
	missedChars : [],
	guessedChars : [],
	placeholderChars : [],
	hangmanWord : "",
	hangmanWordCount : 0,
	isWordMatched : false,

	//prints the placeholder on screen and stores the hangman word to be played
	printPlaceHolder: function(word){
		for(let i = 1; i <= this.hangmanWord.length; i++){
			this.placeholderChars.push('_');
		}
		getEl("placeholder").innerHTML = this.placeholderChars.join(" ");
	},

	processInputChar: function(inputChar){
		if(this.isGuessed(inputChar)){
			displayStatus("You have picked '" + inputChar + "' already", "red");
			playSound('beep');	
			return true;
		}

		if(this.hangmanWord.indexOf(inputChar) > -1){			
			this.insertChars(inputChar);
			playSound('right');	

			if(this.hangmanWordCount === 0){
				this.isWordMatched = true;
			}
			return true; 
		}
		else{
			this.appendMissedChars(inputChar);	
            return false;
		}

	},

	isGuessed: function(inputChar){
		if(this.guessedChars.lastIndexOf(inputChar) < 0){
			this.guessedChars.push(inputChar);
			return false; 
		}
		return true;
	},

	appendMissedChars: function(inputChar){
		if(this.missedChars.indexOf(inputChar) < 0){
			this.missedChars.push(inputChar);
			getEl('guesses').innerHTML = this.missedChars.join(", ");
			playSound('error');
		}
	},

	//if keyed in inputChars exist then they get inserted in right places 
	insertChars: function(inputChar){
		let strToArr = this.hangmanWord.split("");

		for(let i=0; i < strToArr.length; i++){
			if(strToArr[i] === inputChar){
				this.placeholderChars.splice(i, 1, inputChar); 

				//keeping track of letters (multiple) remaining
				this.hangmanWordCount--;				
			}
		}

		getEl("placeholder").innerHTML = this.placeholderChars.join(" ");
	},

	isMatched : function(){
		return this.isWordMatched;
	},	

	initWord : function(word){
		this.hangmanWord = word;
		this.hangmanWordCount = word.length;
		console.log("word to play : ", this.hangmanWord);
		this.printPlaceHolder(this.hangmanWord);
	},

	resetWord : function(){ 
		this.missedChars  = [];
		this.guessedChars = [];
		this.placeholderChars = [];
		getEl('guesses').innerHTML = "";

		this.isWordMatched = false;
		this.hangmanWordCount = 0;
	}
};

/* Game controller object */

var gameController = {
	wins : 0,
	losses : 0,
	indexOfWord : -1,

	//picks the word to play and then passes it on to word object to take it further.
	pickAWord : function(){
		this.indexOfWord = (this.indexOfWord < (data.length -1)) ? ++this.indexOfWord : 0;		
		let pickedWord = data[this.indexOfWord].name;
		word.initWord(pickedWord);	
	},

	//passes on the typed in key to the word object to process
	processKey : function(key){	
		if(word.processInputChar(key)){
			if(word.isMatched()){
			  this.displayResults(true);	
			}
		} 
		else if(!hangman.addNoose()){
			this.displayResults(false);
		}
	},

	displayResults : function(result){
		if(result){
			getEl('wins').innerHTML = ++this.wins;	
			playSound('win');		
			displayStatus("Beautifully danced!", "green");		
			hangman.updateImage('win');
			this.updateGifs();
		}else{
			getEl('losses').innerHTML = ++this.losses;	
			playSound('loss');
			displayStatus("You missed the step! Try again!", "red");
			hangman.updateImage('loss');
			getEl('dance-image').src = "assets/images/saddance.gif";
		}

		setTimeout('init()', 4000);
	},

	//updates when there is a win
	updateGifs : function(){
		getEl('dance-image').src = data[this.indexOfWord].image;
	},

	//init resets the game and picks the hangman word to play
	initGame : function(){
		this.resetGame(); 
		this.pickAWord();
	},

	//resets word, hangman and game to default
	resetGame : function(){
		word.resetWord();
		hangman.resetHangman();
		playSound('start');
		getEl('dance-image').src = "assets/images/dance.gif";
		displayStatus('Press any key to Dance!', '#000');
	}
}

//Listen to any keyed in event, forced to pick only letters from a-z
window.addEventListener('keyup', function(event) {
 
    let pickedChar = event.key;
    const lowerCharCodeLimit = 65;//a
    const upperCharCodeLimit = 90;//z

	if(event.keyCode >= lowerCharCodeLimit && event.keyCode <= upperCharCodeLimit){
		typedChar = event.key.toLowerCase(); 
		gameController.processKey(typedChar);
	}
	else{
		displayStatus("Pick only letters from a-z", "red");
	}		
});

//moved this outside of object to be accessible to all
function playSound(sound){
	let audio = document.createElement("audio");
	audio.src = sounds[sound];
	audio.play();
}

function displayStatus(status, color){
	getEl("status").innerHTML = status;
	getEl("status").style.color = color;
}

function getEl(id){
	return document.getElementById(id);
}

function init(){
	gameController.initGame();
}

init();
