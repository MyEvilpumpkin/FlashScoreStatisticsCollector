// ==UserScript==
// @name MainBasketballPage_flashscore.ru
// @description Open tabs with results for all matches
// @author MyEvilpumpkin
// @license MIT
// @version 1.0
// @include https://www.flashscore.ru/basketball/
// ==/UserScript==

function isReady(expressionFunction, completionFunction) {
   console.log("isReady(" + expressionFunction + ", " + completionFunction + ");");
   if (expressionFunction())
       completionFunction();
   else
       setTimeout(() => { isReady(expressionFunction, completionFunction); }, 50);
}

function openMatchWindow(matches, index) {
    let match = localStorage.getItem("match");
    if (match != undefined) {
        matches.push(JSON.parse(match));
        localStorage.removeItem("match");
    }
    let matchesTable = document.getElementsByClassName("event__match");
    if (index < matchesTable.length) {
        let isCancel = false;
        if (matchesTable[index].getElementsByClassName("event__stage--block")[0] != undefined)
            isCancel = matchesTable[index].getElementsByClassName("event__stage--block")[0].innerText == "Отменен";
        if (!isCancel) {
            let ID = matchesTable[index].id.slice(4);
            localStorage.setItem("ID", ID);
            let openWindow = window.open("https://www.flashscore.ru/match/" + ID + "/#h2h;overall");
            console.log("open " + index + " match");
            isReady(() => openWindow.closed, () => { openMatchWindow(matches, ++index); } );
        }
        else {
            console.log("skip " + index + " match");
            openMatchWindow(matches, ++index);
        }
    }
    else {
        localStorage.removeItem("ID");
        var a = document.createElement("a");
        var file = new Blob([JSON.stringify(matches, null, "\t")], { type: "text/plain" });
        a.href = URL.createObjectURL(file);
        a.download = "json.txt";
        a.click();
    }
}

isReady(() => document.getElementsByClassName("event__match")[0] != undefined, () => {
    localStorage.removeItem("match");
    let index = 0;
    let matches = new Array();
    openMatchWindow(matches, index);
} );

