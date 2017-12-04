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

	updateChances : function(){		
		getEl('chances').innerHTML = --this.chances;
		this.updateImages(this.chances);
	},

	updateImages : function(imageNum){
		console.log("updateImages" , imageNum);
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

	resetHangman : function(){
		this.chances = 6;
		getEl('gif-image').src = this.images[0][6];
	}

};

const game = {

	missedChars : [],
	guessedChars : [],
	placeholderChars : [],

	pickRandomWord: function(){
		return data[Math.floor((Math.random() * (data.length +1)))].name;
	},

	printPlaceHolder: function(word){
		for(let i = 1; i <= word.length; i++){
			this.placeholderChars.push('_');
		}

		getEl("placeholder").innerHTML = this.placeholderChars.join(" ");
	},

	updateStatus: function(status){
		getEl("status").innerHTML = status;
	},

	insertChars: function(char, word){
		console.log("in insertChars()", char,"-", word);

		//split word into array 
		let strToArr = word.split("");

		//check if letter exists in the word
		for(let i=0; i < strToArr.length; i++){
			if(strToArr[i] === char){
				this.placeholderChars.splice(i, 1, char); 
			}else{
				console.log(char, " is not in word");
			}
		}

		// if(this.placeholderChars.lastIndexOf('_') < 0){
		// 	console.log("all letters gone");
		// 	hangman.updateImages('win');
		// }

		getEl("placeholder").innerHTML = this.placeholderChars.join(" ");
	},

	appendMissedChars: function(char){
		console.log("in appendMissedChars()", char, this.missedChars.indexOf(char));
		
		if(this.missedChars.indexOf(char) <= -1){
			this.missedChars.push(char);
			console.log(this.missedChars);
			getEl('guesses').innerHTML += (char + ", ");

		}else{
			this.updateStatus("You have already picked the letter " + char);
		}
	},

	resetGame : function(){
		this.missedChars  = [];
		this.guessedChars = [];
		this.placeholderChars = [];
	}		
};

var hangmanWord = "";

window.addEventListener('keyup', function(event) {
    console.log("You picked the letter " + event.key);

    //Ensuring only characters are accepted
    let pickedChar = event.key;

	if(event.keyCode >= 48 && event.keyCode <= 90){
		pickedChar = event.key.toLowerCase(); 

		if(hangmanWord.indexOf(pickedChar) > -1){
			game.insertChars(pickedChar, hangmanWord);

			if(game.placeholderChars.lastIndexOf('_') < 0){
				console.log("all letters gone");
				hangman.updateImages('win');
				beginGame();
			}else if(hangman.chances <= 0){
				beginGame();
			}
		}else{
			game.appendMissedChars(pickedChar);
			hangman.updateChances();
		}
	}
	else{
		game.updateStatus("Pick a letter between a-z");
	}		
});

function getEl(id){
	return document.getElementById(id);
}

function beginGame(){
	console.log(" ****In beginGame()***")
	game.resetGame();
	hangman.resetHangman();

	//pick a word to play
	hangmanWord = game.pickRandomWord();
	console.log("Word to play ", hangmanWord);

	//print the placeholder on screen
	game.printPlaceHolder(hangmanWord);
}

beginGame();