document.addEventListener("DOMContentLoaded" , () =>{
    let start = document.querySelector("#start");
    let draw = document.querySelector("#draw");
    let stay = document.querySelector("#stay");
    let userScoreDisplay = document.querySelector("#userScoreDisplay");
    let cardDisplay = document.querySelector("#cardDisplay");
    let computerScoreDisplay = document.querySelector("#computerScoreDisplay");
    let computerCard = document.querySelector("#computerCard");
    let winner = document.querySelector("#winner");
    let audio1 = document.querySelector("#audio1");
    let audio2 = document.querySelector("#audio2");
    let audio3 = document.querySelector("#audio3");
    let audioShuffleDeck = document.querySelector("#audioShuffleDeck");
    let deckId
    let userScore = 0
    let computerScore = 0

    //delay function I used in my first text based game
    function wait(ms){
        var start = new Date().getTime();
        var end = start;
        while(end < start + ms) {
        end = new Date().getTime();
        }
    }

    //creating deck
    const getDeck = async () => {
        try{
            let res = await axios.get("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1");
            deckId = res.data.deck_id
        } 
        catch(err) {
            console.log(err)
        }
    }
    getDeck()
    //reset game
    const reset = () =>{
        document.body.removeChild(start)
        document.body.removeChild(draw)
        document.body.removeChild(stay)
        let button = document.createElement("button")
        button.innerText = "New Game"
        button.id = `newButton`
        document.body.appendChild(button)
        button.addEventListener("click" , () =>{
            audioShuffleDeck.play();
            document.location.reload(true)
        })
    }
    // checking scores 
    const checkScores = (name, score) =>{
        if(score < 21) {
            winner.innerText = ""
        } else if(score === 21){
            winner.innerText= `${name} WINS`
            reset();
        } else {
            winner.innerText = `${name} BUSTED`
            reset();
        }
    }
    const computerWins = (name, score, score2) =>{
        if(score > score2 && score < 21){
            winner.innerText= `${name} WINS`
            reset();
        }
    }
    //check if draw
    const checkDraw = (score, score2) =>{
        if(score === score2){
            winner.innerText = `DRAW`
            reset();
        }
    }
    //sets values
    const valuesofCards = (value, score) =>{
        if(value === "JACK" || value === "QUEEN" || value === "KING"){
            score += 10;
        } else if(value === "ACE") {
            if(score <= 10){
                score += 11
            } else {
                score +=1
            }
        } else {
            score += Number(value)
        }
        return score
    }

    //draws cards
    const drawCards = async (num, name, id, score, player, display) =>{
        try{
            let cardres = await axios.get(`https://deckofcardsapi.com/api/deck/${id}/draw/?count=${num}`);
            for(let i = 0; i < num; i++){
                let cardValue = cardres.data.cards[i].value;
                score = valuesofCards(cardValue, score);
                let imgUrl = cardres.data.cards[i].image;
                let image = document.createElement("img");
                image.src = imgUrl;
                player.innerText = `Score: ${score}`
                display.appendChild(image);
            }
            // checkScores(name, score)
            return score
        }
        catch(err){
            console.log(err)
        }
    }

    start.addEventListener("click", async () => {
        if(!cardDisplay.firstChild){
            audio2.play();
            wait(150);
            userScore = await drawCards(2, "HUMAN", deckId, userScore, userScoreDisplay, cardDisplay)
            checkScores("HUMAN", userScore)
        }
    })

    draw.addEventListener("click" , async () => {
        if(cardDisplay.firstChild){
            audio1.play();
            wait(50);
            userScore = await drawCards(1, "HUMAN", deckId, userScore, userScoreDisplay, cardDisplay);
            checkScores("HUMAN", userScore);
        }
    })
    stay.addEventListener("click", async() =>{
        // if(!computerCard.firstChild){
            computerScore = await drawCards(3, "COMPUTER", deckId, computerScore, computerScoreDisplay, computerCard);
            audio3.play();
            checkDraw(userScore, computerScore);
            checkScores("COMPUTER", computerScore);
            computerWins("COMPUTER", computerScore, userScore);
            wait(500);
            while(!winner.innerHTML.length) {
                audio1.play();
                computerScore = await drawCards(1, "COMPUTER", deckId, computerScore, computerScoreDisplay, computerCard);
                checkDraw(userScore, computerScore);
                checkScores("COMPUTER", computerScore);
                computerWins("COMPUTER", computerScore, userScore);
            }
    })
})