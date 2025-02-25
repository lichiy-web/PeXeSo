var Pi = Math.PI;
var E = Math.E;
var BR = "<br>";
var opDiv = "<div>";
var clDiv = "</div>";
var opB = "<b>";
var clB = "</b>";
var opUl = "<ul>";
var clUl = "</ul>";
var opOl = "<ol>";
var clOl = "</ol>";
var opLi = "<li>";
var clLi = "</li>";
var opTab = "<table>";
var clTab = "</table>";
var opTr = "<tr>";
var clTr = "</tr>";
var opTd = "<td>";
var clTd = "</td>";
var opTh = "<th>";
var clTh = "</th>";

function gcd(a, b) { //Наибольший общий делитель
    var result = (b === 0) ? a : gcd(b, a % b);
    return result;
}

function intDiv(a, b) { // Целочисленное деление
    return (a - a % b) / b;
}

function roundNth(number, precision) { // Округление числа до precision-го знака после запятой
    precision = (precision === undefined || precision < 0) ? 0 : Math.round(precision);
    var base = Math.pow(10, precision);
    var result = Math.round(number * base) / base;
    return result;
}

function rndAM(amplitude, middle, isInt) { //Случайное число в диапазоне [middle - amplitude/2, middle + amplitude/2], isInt - по умолчанию true - генерация целых чисел
    
    isInt = (isInt === undefined) ? true : false;
    middle = (middle === undefined) ? 0 : middle;
    var result = amplitude * (Math.random() - .5) + middle;
    if(isInt) result = Math.round(result);
    return result;
}

function rnd(min, max, isInt) { //Случайное число в диапазоне [min, max], isInt - по умолчанию true - генерация целых чисел
    
    isInt = (isInt === undefined) ? true : false;
    var result = (max - min) * Math.random() + min;
    if(isInt) result = Math.round(result);
    return result;
}

function expectedValue(arr) { //Математическое ожидание числовой выборки
    var result = 0;
    for(var i = 0; i < arr.length; i++) {
        result += arr[i];
    }
    result *= 1 / arr.length;
    return result;
}

function arrConcat(arr1, arr2) { //Объединение двух массивов
    var result = arr1.slice();
    for(var i = 0; i < arr2.length; i++) {
        result.push(arr2[i]);
    }
    return result;
}

function arrSearch(arr, word) {
    word = word.toLowerCase();
    var result = -1;
    
    for(var i = 0; i < arr.length; i++) {
        if(arr[i] === word) {
            result = i;
            break;
        } 
    }
    return result;
}

function arrSort(arr, isAscend) { //Сортировка массива по возрастанию или убыванию
    isAscend = (isAscend === undefined) ? true : isAscend; 
    var Length = arr.length;
    var change;
    
    for(var i = 0; i < Length; i++) {
        for(var j = 0; j < i; j++) {
                                   
            if((arr[j] > arr[i] && isAscend) || (arr[j] < arr[i] && !isAscend) ) {
                change = arr[i];
                arr[i] = arr[j];
                arr[j] = change;
            }
        }    
    }
    return arr;
}

function arrSearch(arr, word) { //Функция выдаёт индекс элемента массива arr, содержащиего слово word
    word = word.toLowerCase();
    var result = -1;
    
    for(var i = 0; i < arr.length; i++) {
        if(arr[i].toLowerCase() === word) {
            result = i;
            break;
        } 
    }
    return result;
}

function max(arr) {
    var result = arr[0];
    for(var i = 1; i < arr.length; i++) {
        if(result < arr[i]) {
            result = arr[i];
        }
    }
    return result
}

function swapElementes(collection, i , j) { //Функция меняет местами элементы динамической коллекции collection с индексами i, j
    var elementI = collection[i].cloneNode(true);
    var elementJ = collection[j].cloneNode(true);
    
    collection[i].parentElement.replaceChild(elementJ, collection[i]);    
    collection[j].parentElement.replaceChild(elementI, collection[j]);     
}

function swapArrElementes(arr, i, j, key) { //Функция меняет местами элементы массива arr с индексами i, j
    var swap;
    if(key === undefined) {
        swap = arr[i];
        arr[i] = arr[j];
        arr[j] = swap; 
    } else {
        swap = arr[i][key];
        arr[i][key] = arr[j][key];
        arr[j][key] = swap; 
    }
}

// event.type должен быть keypress
function getChar(event) { //получение символа по нажатой клавише
  if (event.which == null) { // IE
    if (event.keyCode < 32) return null; // спец. символ
    return String.fromCharCode(event.keyCode)
  }

  if (event.which != 0 && event.charCode != 0) { // все кроме IE
    if (event.which < 32) return null; // спец. символ
    return String.fromCharCode(event.which); // остальные
  }

  return null; // спец. символ
}