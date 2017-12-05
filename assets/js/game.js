var pickedWords = [];

const hangman = {
	wins : 0,
	losses : 0,
	chances : 6,
	images :[{
		6 : 'assets/images/Hangman0.gif', 
		5 : 'assets/images/Hangman1.gif', 
		4 : 'assets/images/Hangman2.gif', 
		3 : 'assets/images/Hangman3.gif', 
		2 : 'assets/images/Hangman4.gif',
		1 : 'assets/images/Hangman5.gif',
		'win': 'assets/images/Hangman-win.gif',
		'lose': 'assets/images/Hangman-lose.gif'
	}],

	sounds : [{
		'right': "assets/sounds/correct.wav",
		'beep' : "assets/sounds/beep.wav",
		'start': "assets/sounds/start.mp3", 
		'error' : "assets/sounds/error.wav", 
		'win': "assets/sounds/win.wav",
		'lost': "assets/sounds/lost.wav"
	}],
		
	updateChances : function(){	
		this.chances--;	
		getEl('chances').innerHTML = this.chances;
		// console.log('updateChances()', this.chances);
		this.updateImages(this.chances);
	},

	updateImages : function(imageNum){
		if(imageNum > 0){
			getEl('gif-image').src = this.images[0][imageNum];
		}else if(imageNum == 'win'){
			getEl('gif-image').src = this.images[0][imageNum];
			this.updateResults('wins');
		}else if(imageNum == 0){
			getEl('gif-image').src = this.images[0]['lose'];
			this.updateResults('loss');
		}
	},

	updateResults : function(result){
		if(result === 'wins')
			getEl('wins').innerHTML = ++this.wins;
		else if(result === 'loss')
			getEl('losses').innerHTML = ++this.losses;	
	},

	playSounds : function(sound){
		let audio = document.createElement("audio");
		audio.src = this.sounds[0][sound];
		audio.play();
	},

	resetHangman : function(){
		this.chances = 6;
		getEl('chances').innerHTML = this.chances;
		getEl('gif-image').src = this.images[0][6];
	}

};

const game = {

	missedChars : [],
	guessedChars : [],
	placeholderChars : [],
	'indexOfWord' : 0,

	pickRandomWord: function(){
		let index = Math.floor(Math.random() * (data.length));
		this['indexOfWord'] = index;
		data[index].used = true; //set the word as already picked
		return data[index].name;
	},

	printPlaceHolder: function(word){
		for(let i = 1; i <= word.length; i++){
			this.placeholderChars.push('_');
		}
		getEl("placeholder").innerHTML = this.placeholderChars.join(" ");
	},

	updateGifs : function(word){
		let index = this['indexOfWord'];

		if(word === data[index].name){
			getEl('dance-image').src = data[index].image;
		}
	},

	updateStatus: function(status, color){
		getEl("status").innerHTML = status;
		getEl("status").style.color = color;
	},

	insertChars: function(char, word){
		// console.log("in insertChars()", char,"-", word);

		//split word into array 
		let strToArr = word.split("");

		//check if letter exists in the word
		for(let i=0; i < strToArr.length; i++){
			if(strToArr[i] === char){
				this.placeholderChars.splice(i, 1, char); 

				if(this.guessedChars.lastIndexOf(char) < 0)
					this.guessedChars.push(char); //push char in already guessed			
			}else{
				// console.log(char, " is not in word");
			}
		}

		getEl("placeholder").innerHTML = this.placeholderChars.join(" ");
	},

	appendMissedChars: function(char){		
		let charExistsInArray = false;

		if(this.missedChars.indexOf(char) < 0){
			this.missedChars.push(char);
			// console.log(this.missedChars);
			getEl('guesses').innerHTML += (char + ", ");
		}else{
			this.updateStatus("You danced with '" + char + "' already!", 'red');
			charExistsInArray = true;
		}

		return charExistsInArray;
	},

	resetGame : function(){
		this.missedChars  = [];
		this.guessedChars = [];
		this.placeholderChars = [];
		getEl('guesses').innerHTML = "";
		getEl('dance-image').src = "assets/images/dance.gif";
		this.updateStatus('Press any key to Dance!', '#000');
	}		
};

var hangmanWord = "";

//Listen to any keyed in event
window.addEventListener('keyup', function(event) {
    console.log("You typed -- " + event.key);

    //Ensuring only characters are accepted
    let pickedChar = event.key;

	if(event.keyCode >= 48 && event.keyCode <= 90){
		pickedChar = event.key.toLowerCase(); 

		if(hangmanWord.indexOf(pickedChar) > -1){
			game.insertChars(pickedChar, hangmanWord);
			hangman.playSounds('right');

			if(game.placeholderChars.lastIndexOf('_') < 0){
				//here all letters done
				hangman.updateImages('win');
				hangman.playSounds('win');
				game.updateStatus("You got it Right!!", "green");
				game.updateGifs(hangmanWord);
				setTimeout('beginGame()', 3000);
			}else if(hangman.chances < 0){
				hangman.playSounds('lost');
				game.updateStatus("Sorry, you lost. Play again!", "red");
				setTimeout('beginGame()', 3000);
			}
		}else{
			var charExists = game.appendMissedChars(pickedChar);

			if(!charExists){
				hangman.playSounds('error');
				hangman.updateChances();
			}else{
				hangman.playSounds('beep');
			}

			if(hangman.chances <= 0){
				game.updateStatus("Sorry, you lost. Play again!", "red");
				hangman.playSounds('lost');
				setTimeout('beginGame()', 3000);
			}
		}
	}
	else{
		game.updateStatus("Pick only letters from a-z", "red");
		hangman.playSounds('beep');
	}		
});

function getEl(id){
	return document.getElementById(id);
}

function beginGame(){
	console.log("****In beginGame()- initializing***")
	game.resetGame();
	hangman.resetHangman();
	hangman.playSounds('start');

	//pick a word to play
	hangmanWord = game.pickRandomWord();
	console.log("Word to play ", hangmanWord);

	//print the placeholder on screen
	game.printPlaceHolder(hangmanWord);
}

beginGame();