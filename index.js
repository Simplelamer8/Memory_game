const moves_count = document.querySelector('#moves_count');
const time = document.querySelector('#time');
const start_btn = document.querySelector('#start');
const stop_btn = document.querySelector('#stop');
const game_container = document.querySelector('.game_container');
const result = document.querySelector('#result');
const control_container = document.querySelector('.control_container');

let cards, interval, firstCard = false, secondCard = false, firstCardValue = false;
let stop_resume = 0;


//Array with images
const items = [
    { name: "arctic-bear", image: "./assets/images/arctic-bear.png" },
    { name: "bunny", image: "./assets/images/bunny.png" },
    { name: "capybara", image: "./assets/images/capybara.png" },
    { name: "dolphin", image: "./assets/images/dolphin.png" },
    { name: "flamingo", image: "./assets/images/flamingo.png" },
    { name: "fox", image: "./assets/images/fox.png" },
    { name: "iguana", image: "./assets/images/iguana.png" },
    { name: "leopard", image: "./assets/images/leopard.png" }
];

 //Inital time
let seconds = 0, minutes = 0, isStop = false;
var timing;

//Initial moves and win count
let movesCounter = 0, winCount = 0;

var formated_seconds, formated_minutes;

//Timer
function createTime()
{
    seconds++;
    if (seconds >= 60)
    {
        minutes++;
        seconds %= 60;
    }
    
    formated_seconds = seconds < 10 ? `0${seconds}` : seconds;
    formated_minutes = minutes < 10 ? `0${minutes}` : minutes;
    time.innerHTML = `<span>Time:</span> ${formated_minutes}:${formated_seconds}`;
};

//Count the number of moves
function countMoves()
{
    movesCounter++;
    moves_count.innerHTML = `<span>Moves:</span>${movesCounter}`;
};

function createRandom(size = 4)
{
    let tempArray = [...items];
    console.log(tempArray);
    let cardValues = [];
    size = size * size / 2;
    for (let i = 0; i < size; i++)
    {
        const randomIndex = Math.floor(Math.random() * tempArray.length);
        cardValues.push(tempArray[randomIndex]);
        tempArray.splice(randomIndex, 1);
    }
    return cardValues;
}

let b = false;

function debounce(func, t)
{
    if (b)
    {
        return;
    }
    else
    {
        b = true;
        setTimeout(() => {b = false}, t);
        return func();
    }
}

function createTable(cardValues, size = 4)
{
    game_container.innerHTML = "";
    cardValues = [...cardValues, ...cardValues];
    cardValues.sort(() => Math.random() - 0.5);
    for (let i = 0; i < size * size; i++)
    {
        game_container.innerHTML += `
        <div class = "card-container" data-card-value = "${cardValues[i].name}">
            <div class = "card-before"><h1>?</h1></div>
            <div class = "card-after"><img src = "${cardValues[i].image}" class = "image"/></div>
        </div>
        `;
    }
    var active_card = 0;
    cards = document.querySelectorAll('.card-container');
    cards.forEach((card) => {
        card.addEventListener("click", () => {
            if (!card.classList.contains('flipped') && !isStop)
            {
                let after = card.querySelector('.card-after');
                if(!after.classList.contains('active'))
                {
                    active_card++;
                    after.classList.add('active');
                    countMoves();
                }
                else
                {
                    active_card--;
                    after.classList.remove('active');
                    firstCard = false;
                    firstCardValue = false;
                }
                if (!firstCard && after.classList.contains('active'))
                {
                    firstCard = card;
                    firstCardValue = card.getAttribute("data-card-value");
                }
                else
                {
                    if (firstCardValue === card.getAttribute("data-card-value"))
                    {
                        active_card = 0;
                        firstCard.classList.add('flipped');
                        firstCard = false;
                        firstCardValue = false;
                        card.classList.add('flipped');
                        winCount++;
                        if (winCount == 8)
                        {
                            clearInterval(timing);
                            setTimeout(() => {
                                game_container.classList.add('hide');
                                control_container.classList.remove('hide');
                                result.innerHTML = `<h1> You Won! </h1>
                                <h4> Moves Count: ${movesCounter} </h4>
                                <h4> Time: ${formated_minutes}:${formated_seconds}</h4>`;
                                start_btn.innerHTML = "Restart Game";
                                control_container.style.position = 'absolute';
                            }, 3000);
                            winCount = 0;
                        }
                    }
                    else
                    {
                        firstCard = false;
                        firstCardValue = false;
                    }
                }
                if (active_card == 2)
                {
                    active_card = 0;
                    setTimeout(() => {
                        cards.forEach((card1) => {
                            if (!card1.classList.contains('flipped'))
                            {
                                let after1 = card1.querySelector('.card-after');
                                if (after1.classList.contains('active'))
                                {
                                    after1.classList.remove('active');
                                }
                            }
                        });
                    }, 500);
                    active_card = 0;
                }
            }
        })
});
}

start_btn.addEventListener('click', () => {
    seconds = 0;
    clearInterval(timing);
    timing = setInterval(createTime, 1000);
    movesCounter = 0;
    moves_count.innerHTML = `<span>Moves:</span>${movesCounter}`;
    game_container.classList.remove('hide');
    control_container.classList.add('hide');
    control_container.style.position = 'static';
    initialize();
});

stop_btn.addEventListener('click', () =>{
    stop_resume++;
    if (stop_resume % 2 == 1)
    {
        isStop = true;
        clearInterval(timing);
        stop_btn.innerHTML = 'Game is Stopped'
    }
    else
    {
        isStop = false;
        timing = setInterval(function() {createTime(), movesCounter()}, 1000);
        stop_btn.innerHTML = 'Stop Game';
    }
});

function initialize()
{
    console.log('start!');
    result.innerHTML = "";
    winCount = 0;
    let cardValues = createRandom();
    console.log(cardValues);
    createTable(cardValues);
}