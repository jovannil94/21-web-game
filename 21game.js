document.addEventListener("DOMContentLoaded" , () =>{
    let start = document.querySelector("#start");
    let draw = document.querySelector("#draw");
    let stay = document.querySelector("#stay");
    let userScoreDisplay = document.querySelector("#userScoreDisplay");
    let cardDisplay = document.querySelector("#cardDisplay");
    let computerScoreDisplay = document.querySelector("#computerScoreDisplay");
    let computerCard = document.querySelector("#computerCard");
    let winner = document.querySelector("#winner");
    //delay function I used in my first text based game
    function wait(ms){
        var start = new Date().getTime();
        var end = start;
        while(end < start + ms) {
          end = new Date().getTime();
       }
     }
    let deckId
    let userScore = 0
    let computerScore = 0

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

    //draws two cards on first hit
    const drawTwoCards = async (name, id, score, player, display) =>{
        try{
            let cardres = await axios.get(`https://deckofcardsapi.com/api/deck/${id}/draw/?count=2`);
            for(let i = 0; i < 2; i++){
                let twoCardValue = cardres.data.cards[i].value;
                score = valuesofCards(twoCardValue, score);
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

    const drawOneCard = async (name, id, score, player, display) =>{
        try {
            let cardres = await axios.get(`https://deckofcardsapi.com/api/deck/${id}/draw/?count=1`);
            let oneCardValue = cardres.data.cards[0].value;
            score = valuesofCards(oneCardValue, score);
            let imgUrl = cardres.data.cards[0].image;
            let image = document.createElement("img");
            image.src = imgUrl;
            player.innerText = `Score: ${score}`
            display.appendChild(image);
            // checkScores(name, score)
            return score
        }
        catch(err){
            console.log(err)
        }
    }

    start.addEventListener("click", async () => {
        if(!cardDisplay.firstChild){
            userScore = await drawTwoCards("YOU", deckId, userScore, userScoreDisplay, cardDisplay)
            checkScores("YOU", userScore)
        }
    })

    draw.addEventListener("click" , async () => {
        if(cardDisplay.firstChild){
            userScore = await drawOneCard("YOU", deckId, userScore, userScoreDisplay, cardDisplay);
            checkScores("YOU", userScore);
        }
    })
    stay.addEventListener("click", async() =>{
        if(!computerCard.firstChild){
            computerScore = await drawOneCard("COMPUTER", deckId, computerScore, computerScoreDisplay, computerCard);
            computerScore = await drawTwoCards("COMPUTER", deckId, computerScore, computerScoreDisplay, computerCard);
            checkDraw(userScore, computerScore);
            checkScores("COMPUTER", computerScore);
            computerWins("COMPUTER", computerScore, userScore);
        } else {
            computerScore = await drawOneCard("COMPUTER", deckId, computerScore, computerScoreDisplay, computerCard);
            checkDraw(userScore, computerScore);
            checkScores("COMPUTER", computerScore);
            computerWins("COMPUTER", computerScore, userScore);
        }
    })
})