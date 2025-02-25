var dim = 8; //размерность игрового поля
var root = document.querySelector(":root");
root.style.setProperty("--number_patternes", dim);

var numberPatternes = (dim % 2 === 0) ? dim * dim / 2 : (dim * dim - 1) / 2;
var gameField = document.getElementById("game_field");
function randomLandscape(){
    var landscapeNum = rnd(0, 20);
    landscapeNum = (landscapeNum < 10) ? "0" + landscapeNum : landscapeNum;
    gameField.style.backgroundImage = "url(img/landscapes/" + landscapeNum + ".jpg)";   
} //Установка случайного пезажа на обои игрового поля

var patternsObjList = [{}];
var gamePatternes; //Коллекция элементов DOM, паттерны на игровом поле
var timer = document.getElementById("timer");
var score = document.getElementById("score");
var click = document.getElementById("click");
var dateStart, dateEnd, dTime, timerH, timerM, timerS;
var scoreCount = 0;
var clickCount = 0;
var isRunGame = false;
var isStopGame = false;

var isOpen = false;
var dataID1, dataID2;
var openPattern1, openPattern2;
var isWait = false;
var delay = 500;


var submenu = document.getElementById("submenu");
var dimension = document.getElementById("dimension");
var cardtops = document.getElementById("cardtops");
var activeTop = 2;
setActiveTop(activeTop);

function setActiveTop(number) {
    var tops = cardtops.children;
    $(tops[activeTop]).removeClass("active_top");
    $(tops[number]).addClass("active_top");
    activeTop = number;
    number = (number < 10) ? "0" + number : number;
    root.style.setProperty("--cardstop-image", "url(../img/cardtops/" + number + ".png)");
    
} //выделение активной рубашки

function createDimSubmenu() {
    var table = document.createElement("table");
    table.dataset.sub = "1";
    var row, cell;
    for(var i = 0; i < 10; i++) {
        row = document.createElement("tr");
        row.dataset.sub = "1";
        for(var j = 0; j < 10; j++) {
            cell = document.createElement("td");
            cell.dataset.sub = "1";
            cell.id = "dimension-tab-" + i + "-" + j;
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    dimension.appendChild(table);
    dimension.dataset.sub = "1";    
} //функция создания подменю с выбором размерности игрового поля
createDimSubmenu();

function createTopSubmenu() {
    var tops = cardtops.children;
    for(var i = 0; i < tops.length; i++) {
        tops[i].style.backgroundImage = "url(img/cardtops/0" + i + ".png)";
    }
} //функция создания подменю с выбором рубашки
createTopSubmenu();

function CreatePatternObj(dataID, image, isDelete) { //Конструктор паттернов-объектов
    this.dataID = dataID;
    this.image = image;
    this.isDelete = isDelete;
    
    this.toString = function() {
        return "url(" + this.image + ")";
    };
} //конструктор паттернов-объектов

function resetGame() { //Функция перезагрузки игры
    dateStart = undefined;
    dateEnd = undefined;
    scoreCount = 0;
    score.textContent = scoreCount;
    clickCount = 0;
    click.textContent = clickCount;
    dateStart = undefined;
    timer.textContent = "00:00:00";
    isOpen = false;
    dataID1 = undefined;
    dataID2 = undefined;
    openPattern1 = undefined;
    openPattern2 = undefined;
    isWait = false;
    gamePatternes = gameField.children;
    
    randomLandscape();
    setDimTable(dim);
    
    var image;
    for(var i = 0; i < numberPatternes; i++) {
        image = (i < 10) ? "img/patternes/0" + i + ".jpg" : "img/patternes/" + i + ".jpg";
        patternsObjList[2 * i] = new CreatePatternObj(i, image, false);
        patternsObjList[2 * i + 1] = new CreatePatternObj(i, image, false);
    }
    
    gameField.textContent = "";
    for(i = 0; i < numberPatternes; i++) {
        createPattern(gameField, patternsObjList[i * 2].dataID);
        createPattern(gameField, patternsObjList[i * 2 + 1].dataID);
    }
}
resetGame(); //Функция перезагрузки игры

function createPattern(elem, dataID){ //Функция размещения паттерна на игровом поле
    var pattern = document.createElement("div");
    $(pattern).addClass("pattern");
//    $(pattern).addClass("top");
    pattern.dataset.id = dataID;
    elem.appendChild(pattern);    
} //Функция размещения паттерна на игровом поле

function randomPatternes() {
    var swapIndex1;
    var swapIndex2;
    
    for(var i = 0; i < 10 * dim * dim; i++) {
        swapIndex1 = rnd(0, gamePatternes.length - 1);
        swapIndex2 = rnd(0, gamePatternes.length - 1);
        
        swapElementes(gamePatternes, swapIndex1, swapIndex2);
        swapArrElementes(patternsObjList, swapIndex1, swapIndex2);
    }
} //функция перемешивания паттернов
randomPatternes();

function game(e) {
    if(isWait || e.target.dataset.id === undefined) { return; };
    if(!isRunGame) { 
        setTimer(); 
        isRunGame = true;
        console.log("Запуск таймера"); 
    }
    
    clickCount++;
    click.textContent = clickCount;
    var index = hasElementIndex(gamePatternes, e.target);
    var hiddenIndex1, hiddenIndex2;
        
    if(!isOpen) {
        dataID1 = e.target.dataset.id;
        openPattern1 = e.target;
        openPattern1.style.backgroundImage = patternsObjList[index].toString();
        isOpen = true;        
        
    } else {
        dataID2 = e.target.dataset.id;
        openPattern2 = e.target;
        openPattern2.style.backgroundImage = patternsObjList[index].toString();
        if(comporatePattern(dataID1, dataID2)){
            console.log("YES", scoreCount + " из " + numberPatternes);
            hiddenIndex1 = hasElementIndex(gamePatternes, openPattern1);
            hiddenIndex2 = index;
            if(hiddenIndex1 === hiddenIndex2) { //Не реагировать если дважды щёлкнут по одному и тому же паттерну
               return;
            }
            
            isWait = true;
                        
            var timerID1 = setTimeout(function(){
                
                patternsObjList[hiddenIndex1].isDelete = true;
                openPattern1.style.visibility = "hidden";
                console.log("скрытие паттерна 1");
                
                patternsObjList[hiddenIndex2].isDelete = true;
                openPattern2.style.visibility = "hidden";
                console.log("скрытие паттерна 2");
                
                scoreCount++;
                score.textContent = scoreCount;
                
                if(scoreCount === +numberPatternes) {
                    isStopGame = true;
                    isRunGame = false;
                    console.log("Stop the Time", scoreCount, numberPatternes, (scoreCount === numberPatternes));
                }
                explosion.animation(openPattern1);
                explosion.animation(openPattern2);
                
                isWait = false;  
            }, delay);
            
            
        } else {
            console.log("NO");
            isWait = true;
            var timerID2 = setTimeout(function(){
                openPattern1.style.backgroundImage = "";
                openPattern2.style.backgroundImage = "";
                isWait = false;                
            }, delay);
        }
        isOpen = false;
    }
} //обработчик игры

function comporatePattern(dataID1, dataID2){
    var result;
    result = (dataID1 === dataID2) ? true : false;
    return result;
} //Сравнение паттернов

function hasElementIndex(collection, element) {
    for(var i = 0; i < collection.length; i++) {
        if(collection[i] === element) {
            return i;
        }
    }
    return -1;
}

var cheatString = "";
var cheatCode = "lichiy";

function cheat(e) {
    var cheatChain = [];
    
    if(cheatString.length < cheatCode.length) {
        cheatString += getChar(e);
    } else {
        cheatChain = cheatString.split("");
        cheatChain.shift();
        cheatString = cheatChain.join("");
        cheatString += getChar(e);
    }
    
    if(cheatString === cheatCode) {
        openPatternesAll();
        if(isRunGame) {
            isStopGame = true;
        }
        
    }
} //Обработчик чит-кода

function openPatternesAll() {
    var i = 0;
    var timerIDcheat = setTimeout(function interval(){
        if(i >= gamePatternes.length / 2) {
            clearTimeout(timerIDcheat);
            return;
        }
        
        patternsObjList[i].isDelete = true;
        gamePatternes[i].style.visibility = "hidden";
        
        patternsObjList[gamePatternes.length - i - 1].isDelete = true;
        gamePatternes[gamePatternes.length - i - 1].style.visibility = "hidden";
        i++;
        score.textContent = (i <= scoreCount) ? scoreCount : i;
        setTimeout(interval, delay / 10);
    }, delay / 10);
} //Открыть все паттерны

var explosion = {
    path: "img/explosion/",
    fileName: "frame",
    extension: ".png",
    framesDelay: [30, 30, 30, 30, 30, 30, 60, 60, 60, 60, 60, 60, 90, 90, 90, 90, 90, 90, 120, 120, 120, 120, 120, 120],
    
    animation: function(elem){
        var framesNumber = 0;
        var filePostfix;
        var img = document.createElement("img");
        $(img).css({
                boxSizing: "border-box",
                width: elem.offsetWidth,
                left: elem.offsetLeft,
                bottom: gameField.offsetHeight - elem.offsetTop - getComputedStyle(elem).marginTop.split("px")[0] - elem.offsetHeight,
                position: "absolute",
                visibility: "visible",
            });
        gameField.appendChild(img);
        
        var timerID = setTimeout(function repeatFrames(){
            if(framesNumber === explosion.framesDelay.length) {
                img.style.visibility = "hidden";
                return;
            }
            filePostfix = (framesNumber < 10) ? "0" + framesNumber : framesNumber;
            $(img).attr("src", explosion.path + explosion.fileName + filePostfix + explosion.extension);
            framesNumber++;
            setTimeout(repeatFrames, explosion.framesDelay[framesNumber]); 
            
        }, explosion.framesDelay[framesNumber]);
        
    }
} //создание взрыва на месте совпавших паттернов: объект, содержащий метод вывода анимации кадров

var timerNumber = 0;
function setTimer() {  
    timerNumber++;
    console.log("Запущено " + timerNumber + " таймеов.");
    var timerID0 = setTimeout(function runTimer(){
        if(isStopGame) {
            console.log("Остановить таймер, ибо isStopGame = " + isStopGame);
            clearTimeout(timerID0);
            timerNumber = 0;
            isStopGame = false;
            isRunGame = false;
            console.log("Таймер остановлен, isStopGame = " + isStopGame);
            return;
        } else {
            if(dateStart === undefined) {
                dateStart = new Date(); 
                dateEnd = dateStart;
            } else {
                dateEnd = new Date();
            }

            dTime = Math.floor((dateEnd - dateStart) / 1000); //интервал в секундах
            timerS = dTime % 60;
            timerM = ((dTime - timerS) / 60) % 60;
            timerH = (dTime - timerS - 60 * timerM) / 3600;

            timerS = (timerS < 10) ? "0" + timerS : timerS;
            timerM = (timerM < 10) ? "0" + timerM : timerM;
            timerH = (timerH < 10) ? "0" + timerH : timerH;
            timer.textContent = timerH + ":" + timerM + ":" + timerS;

            setTimeout(runTimer, 1000);
        }
    }, 0);
    return (timerH + ":" + timerM + ":" + timerS);
} //обработчик таймера

var isOpenMenu = false;
var openMenu;
function openMenu(event) {
    var e = event.target;
    var level = e.id.split("-")[0];
    var isSubmenu = e.dataset.sub === "1";
    var menuName = e.id.split("-")[1];
    
    if(!isOpenMenu && level !== "menu") {
        return;
    }
    
    if(menuName === "reset") {
        resetGame();
        randomPatternes();
        if(isRunGame) {
            isStopGame = true;
        }
        console.log("Нажат сброс, isStopGame = " + isStopGame);
        return;
    }
    
    if(isOpenMenu) {
        if(menuName === openMenu || level !== "menu" && !isSubmenu) {
            hiddenSubmenu();
        }
    } else {
            var xMenu = e.offsetLeft;
            var yMenu = e.parentElement.offsetTop + e.parentElement.offsetHeight;
            $(e).css({
                boxShadow: "none",
                marginTop: ".5vh",
                cursor: "pointer",
                "-webkit-filter": "brightness(105%)", 
                color: "#000"
            });
            $("#"+menuName).css({
                left: xMenu,
                top: "calc(" + yMenu + "px - .5vh)"
            });

            $("#"+menuName).removeClass("close");
            openMenu = menuName;
            isOpenMenu = true;
     }
} //Обработчик открытия-закрытия меню по клику

function moveMenu(event) {
    var e = event.target;
    var level = e.id.split("-")[0];
    var isSubmenu = e.dataset.sub === "1";
    var menuName = e.id.split("-")[1];
    
    if(isOpenMenu) {
        if(menuName !== openMenu && level === "menu") {
            hiddenSubmenu();
            
            openMenu = menuName;
            isOpenMenu = true;
            if(menuName === "reset") {return};
            
            var xMenu = e.offsetLeft;
            var yMenu = e.parentElement.offsetTop + e.parentElement.offsetHeight;
            $(e).css({
                boxShadow: "none",
                marginTop: ".5vh",
                cursor: "pointer",
                "-webkit-filter": "brightness(105%)", 
                color: "#000"
            });
            $("#"+menuName).css({
                left: xMenu,
                top: "calc(" + yMenu + "px - .5vh)"
            });

            $("#"+menuName).removeClass("close");
        } 
    }
} //Обработчик перемещения по меню

function hiddenSubmenu(){
    $("#" + openMenu).addClass("close");
    $("#menu-" + openMenu).attr("style", " ");
    openMenu = undefined;
    isOpenMenu = false;
    setDimTable(dim);
} //скрыть выпадающие подменю

function submenuAction(event) {
    var subName = event.target.id.split("-")[0];
    console.log(subName);
    switch(subName){
        case "dimension":
            dimensionAction(event);
            break;
        case "cardtops":
            cardtopsAction(event);
            break;
        return
    }    
} //обработчик действий в подменю

function dimensionAction(event) {
    console.log("Вход в dimensionAction");    
    var e = event.target;
    var eType = event.type;
    if(e.tagName !== "TD") {
        return;
    }
    console.log(e.tagName);
    var td_i = e.parentElement.rowIndex;
    var td_j = e.cellIndex;
    var setDim = max([td_i, td_j]) + 1;
    setDim = (setDim < 2) ? 2 : setDim;
    
    console.log("Событие - " + eType);
    if(eType === "mouseover") {
        setDimTable(setDim);
    } else if(eType === "click" && setDim !== dim) {
        console.log("Вход в dimensionAction по click");
        isStopGame = true;
        dim = setDim;
        numberPatternes = (dim % 2 === 0) ? dim * dim / 2 : (dim * dim - 1) / 2;
        root.style.setProperty("--number_patternes", dim); 
        hiddenSubmenu();
        resetGame();
        randomPatternes();
    } else {
        hiddenSubmenu();
    }
    
    
} //обработчик действий в подменю Размер

function cardtopsAction(event) {
    console.log("Вход в cardtopsAction");
    var e = event.target;
    var eType = event.type;
    var selectTopNum = e.id.split("-")[1];
    if(selectTopNum === undefined) {
        return;
    }
    if(eType === "click") {
        setActiveTop(+selectTopNum);
    }
} //обработчик действий в подменю Рубашка

function setDimTable(setDim) {
    console.log("Вход в setDimTable");
    console.log("setDim = " + setDim);
    var rows = dimension.firstChild.rows;
    console.log(rows);
    var cells;
    for(var i = 0; i < rows.length; i++) {
        cells = rows[i].cells;
        for(var j = 0; j < cells.length; j++) {
            if(i < setDim && j < setDim) {
                cells[j].style.backgroundColor = "#000";
            } else {
                cells[j].style.backgroundColor = "";
            }
            if(i === (setDim - 1) && j === (setDim - 1)) {
                cells[j].textContent = setDim;
            } else {
                cells[j].textContent = "";
            }
        }
    }    
} //Установка прототипа игрового поля в подменю Размер


$(gameField).click(game); 
$(document).keypress(cheat);
$("body").click(openMenu);
$("body").mouseover(moveMenu);
$(submenu).mouseover(submenuAction);
$(submenu).click(submenuAction);


