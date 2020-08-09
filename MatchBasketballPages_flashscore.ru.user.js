// ==UserScript==
// @name MatchBasketballPages_flashscore.ru
// @description Save data about basketball matches
// @author MyEvilpumpkin
// @license MIT
// @version 1.0
// @include https://www.flashscore.ru/match/*
// ==/UserScript==

function isReady(expressionFunction, completionFunction) {
   console.log("isReady(" + expressionFunction + ", " + completionFunction + ");");
   if (expressionFunction())
       completionFunction();
   else
       setTimeout(() => { isReady(expressionFunction, completionFunction); }, 50);
}

function collectData(match) {
    let homeResultsSource = document.getElementsByClassName("odd")[0].cells;
    for (let i = 1; i < homeResultsSource.length; ++i)
        match.homeResults.push(homeResultsSource[i].innerText);
    let awayResultsSource = document.getElementsByClassName("even")[0].cells;
    for (let i = 1; i < awayResultsSource.length; ++i)
        match.awayResults.push(awayResultsSource[i].innerText);
    localStorage.setItem("match", JSON.stringify(match));
    window.close();
}

function openMatchWindow(match, indexes) {
    let innerMatch = localStorage.getItem("match");
    if (innerMatch != undefined) {
        match.matches[localStorage.getItem("matchType")].push(JSON.parse(innerMatch));
        localStorage.removeItem("match");
    }
    if ((match.matches.homeHome.length < indexes.numOfMatches || match.matches.homeAway.length < indexes.numOfMatches) && indexes.homeIndex < document.getElementsByClassName("head_to_head h2h_home")[0].getElementsByClassName("highlight").length) {
        let matchInTable = document.getElementsByClassName("head_to_head h2h_home")[0].getElementsByClassName("highlight")[indexes.homeIndex];
        let ID = matchInTable.getAttribute("onclick").slice(84, 92);
        localStorage.setItem("ID", ID);
        let homeName = matchInTable.getElementsByClassName("name")[0].innerText;
        let awayName = matchInTable.getElementsByClassName("name")[1].innerText;
        if (!(homeName == match.homeName && awayName == match.awayName) && !(homeName == match.awayName && awayName == match.homeName)) {
            if (homeName == match.homeName && match.matches.homeHome.length < indexes.numOfMatches) {
                localStorage.setItem("matchType", "homeHome");
                let openWindow = window.open("https://www.flashscore.ru/match/" + ID + "/#h2h;overall");
                console.log("open " + indexes.homeIndex + " match homeHome " + match.matches.homeHome.length);
                indexes.homeIndex++;
                isReady(() => openWindow.closed, () => { openMatchWindow(match, indexes); } );
            }
            else if (awayName == match.homeName && match.matches.homeAway.length < indexes.numOfMatches) {
                localStorage.setItem("matchType", "homeAway");
                let openWindow = window.open("https://www.flashscore.ru/match/" + ID + "/#h2h;overall");
                console.log("open " + indexes.homeIndex + " match homeAway " + match.matches.homeAway.length);
                indexes.homeIndex++;
                isReady(() => openWindow.closed, () => { openMatchWindow(match, indexes); } );
            }
            else {
                console.log("skip " + indexes.homeIndex + " match home");
                indexes.homeIndex++;
                openMatchWindow(match, indexes);
            }
        }
        else {
            console.log("skip " + indexes.homeIndex + " match home");
            indexes.homeIndex++;
            openMatchWindow(match, indexes);
        }
    }
    else if ((match.matches.awayHome.length < indexes.numOfMatches || match.matches.awayAway.length < indexes.numOfMatches) && indexes.awayIndex < document.getElementsByClassName("head_to_head h2h_away")[0].getElementsByClassName("highlight").length) {
        let matchInTable = document.getElementsByClassName("head_to_head h2h_away")[0].getElementsByClassName("highlight")[indexes.awayIndex];
        let ID = matchInTable.getAttribute("onclick").slice(84, 92);
        localStorage.setItem("ID", ID);
        let homeName = matchInTable.getElementsByClassName("name")[0].innerText;
        let awayName = matchInTable.getElementsByClassName("name")[1].innerText;
        if (!(homeName == match.homeName && awayName == match.awayName) && !(homeName == match.awayName && awayName == match.homeName)) {
            if (homeName == match.awayName && match.matches.awayHome.length < indexes.numOfMatches) {
                localStorage.setItem("matchType", "awayHome");
                let openWindow = window.open("https://www.flashscore.ru/match/" + ID + "/#h2h;overall");
                console.log("open " + indexes.awayIndex + " match awayHome " + match.matches.awayHome.length);
                indexes.awayIndex++;
                isReady(() => openWindow.closed, () => { openMatchWindow(match, indexes); } );
            }
            else if (awayName == match.awayName && match.matches.awayAway.length < indexes.numOfMatches) {
                localStorage.setItem("matchType", "awayAway");
                let openWindow = window.open("https://www.flashscore.ru/match/" + ID + "/#h2h;overall");
                console.log("open " + indexes.awayIndex + " match awayAway " + match.matches.awayAway.length);
                indexes.awayIndex++;
                isReady(() => openWindow.closed, () => { openMatchWindow(match, indexes); } );
            }
            else {
                console.log("skip " + indexes.awayIndex + " match away");
                indexes.awayIndex++;
                openMatchWindow(match, indexes);
            }
        }
        else {
            console.log("skip " + indexes.awayIndex + " match away");
            indexes.awayIndex++;
            openMatchWindow(match, indexes);
        }
    }
    else if ((match.matches.homeMutual.length < indexes.numOfMatches || match.matches.awayMutual.length < indexes.numOfMatches) && indexes.mutualIndex < document.getElementsByClassName("head_to_head h2h_mutual")[0].getElementsByClassName("highlight").length) {
        let matchInTable = document.getElementsByClassName("head_to_head h2h_mutual")[0].getElementsByClassName("highlight")[indexes.mutualIndex];
        let ID = matchInTable.getAttribute("onclick").slice(84, 92);
        localStorage.setItem("ID", ID);
        let homeName = matchInTable.getElementsByClassName("name")[0].innerText;
        let awayName = matchInTable.getElementsByClassName("name")[1].innerText;
        if (homeName == match.homeName && match.matches.homeMutual.length < indexes.numOfMatches) {
            localStorage.setItem("matchType", "homeMutual");
            let openWindow = window.open("https://www.flashscore.ru/match/" + ID + "/#h2h;overall");
            console.log("open " + indexes.mutualIndex + " match homeMutual " + match.matches.homeMutual.length);
            indexes.mutualIndex++;
            isReady(() => openWindow.closed, () => { openMatchWindow(match, indexes); } );
        }
        else if (awayName == match.homeName && match.matches.awayMutual.length < indexes.numOfMatches) {
            localStorage.setItem("matchType", "awayMutual");
            let openWindow = window.open("https://www.flashscore.ru/match/" + ID + "/#h2h;overall");
            console.log("open " + indexes.mutualIndex + " match awayMutual " + match.matches.awayMutual.length);
            indexes.mutualIndex++;
            isReady(() => openWindow.closed, () => { openMatchWindow(match, indexes); } );
        }
        else {
            console.log("skip " + indexes.mutualIndex + " match mutual");
            indexes.mutualIndex++;
            openMatchWindow(match, indexes);
        }
    }
    else {
        localStorage.removeItem("matchType");
        console.log("Match script is finished");
        localStorage.setItem("match", JSON.stringify(match));
        window.close();
    }
}

isReady(() => (document.getElementsByClassName("info-status mstat")[0].innerText != undefined && document.getElementsByClassName("tname__text")[0].innerText != "" && document.getElementsByClassName("tname__text")[1].innerText != ""), () => {
    localStorage.removeItem("match");
    let match = {
        ID: localStorage.getItem("ID"),
        isFinished: document.getElementsByClassName("info-status mstat")[0].innerText == "Завершен" || document.getElementsByClassName("info-status mstat")[0].innerText == "После овертайма",
        homeName: document.getElementsByClassName("tname__text")[0].innerText,
        awayName: document.getElementsByClassName("tname__text")[1].innerText,
        homeResults: new Array(),
        awayResults: new Array(),
        matches: {
            homeHome: new Array(),
            homeAway: new Array(),
            awayHome: new Array(),
            awayAway: new Array(),
            homeMutual: new Array(),
            awayMutual: new Array()
        }
    };
    let indexes = {
        homeIndex: 0,
        awayIndex: 0,
        mutualIndex: 0,
        numOfMatches: 10
    }
    if (match.isFinished)
        isReady(() => document.getElementById("a-match-summary") != undefined, () => {
            document.getElementById("a-match-summary").click();
            isReady(() => document.getElementsByClassName("parts-first horizontal")[0] != undefined, () => { collectData(match); });
        } );
    else
        isReady(() => document.getElementsByClassName("head_to_head h2h_home")[0] != undefined, () => { openMatchWindow(match, indexes); } );
} );

