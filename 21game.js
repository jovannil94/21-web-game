document.addEventListener("DOMContentLoaded" , () =>{
    let start = document.querySelector("#start");
    let draw = document.querySelector("#draw");
    let userScoreDisplay = document.querySelector("#userScoreDisplay");
    let cardDisplay = document.querySelector("#cardDisplay");
    let computerScoreDisplay = document.querySelector("#computerScoreDisplay");
    let computerCard = document.querySelector("#computerCard");
    let winner = document.querySelector("#winner");
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
    //drawing cards
    getDeck()
    // checking scores 
    const checkScores = (score) =>{
        if(score < 21) {
            winner.innerText = ""
        } else if(score === 21){
            winner.innerText= "You win"
        } else {
            winner.innerText = "You lose"
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
    const drawTwoCards = async (id, score, player, display) =>{
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
            checkScores(score)
            return score
        }
        catch(err){
            console.log(err)
        }
    }

    const drawOneCard = async (id, score, player, display) =>{
        try {
            let cardres = await axios.get(`https://deckofcardsapi.com/api/deck/${id}/draw/?count=1`);
            let oneCardValue = cardres.data.cards[0].value;
            score = valuesofCards(oneCardValue, score);
            let imgUrl = cardres.data.cards[0].image;
            let image = document.createElement("img");
            image.src = imgUrl;
            player.innerText = `Score: ${score}`
            display.appendChild(image);
            checkScores(score)
            return score
        }
        catch(err){
            console.log(err)
        }
    }

    start.addEventListener("click", async () => {
        userScore = await drawTwoCards(deckId, userScore, userScoreDisplay, cardDisplay)
        computerScore = await drawTwoCards(deckId, computerScore, computerScoreDisplay, computerCard)
    })

    draw.addEventListener("click" , async () => {
        if(cardDisplay.firstChild){
            userScore = await drawOneCard(deckId, userScore, userScoreDisplay, cardDisplay)
            computerScore = await drawOneCard(deckId, computerScore, computerScoreDisplay, computerCard)
        }
    })
})