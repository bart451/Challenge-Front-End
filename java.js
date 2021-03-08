let zetels = 15;
let partijen = "none";
let vraag = 0;
let stemmen = [];
let weight = [];
let Text = ["terug", "skip", "true", "none", "false"];
let TextButton = ["terug", "Sla deze vraag over", "Eens", "Geen mening", "Oneens"];

//Punten van array ellements 
for (var i = 0; i < parties.length; i++) {
    parties[i].points = 0;
}

function createElement(elementType, appendTo, id, innerText, Class) {
    let element = document.createElement(elementType);
    document.getElementById(appendTo).appendChild(element);
    element.id = id;
    if (innerText) {
        element.innerText = innerText;
    }
    if (Class) {
        element.className = Class;
    }
}

document.getElementById("startButton").onclick = function () {
    this.style.display = "none";
    document.getElementById("startMenu").style.display = "none";
    document.getElementById("container").style.display = "block";
    document.getElementById("title").innerHTML = subjects[0].title;
    document.getElementById("statement").innerHTML = subjects[0].statement;

    for (let i = 0; i < 5; i++) {
        createElement("button", "BTNcontainer", "btn" + i, TextButton[i], null);
        document.getElementById("btn0").innerHTML = "";
        document.getElementById("btn0").style.backgroundImage = "url(images/arrow.png)";
        if (i <= 4 && i >= 1) {
            document.getElementById("btn" + i).onclick = function () {
                onclickBTNsetup()
            };

            function onclickBTNsetup() {
                for (let a = 1; a < 5; a++) {
                    if (stemmen[vraag == null]) {
                        stemmen.push(Text[a])
                    } else {
                        stemmen[vraag] = Text[i];
                    }
                }
                vraag++;
                if (vraag >= subjects.length) {
                    ExtraVragen();
                } else {
                    document.getElementById("title").innerHTML = subjects[vraag].title;
                    document.getElementById("statement").innerHTML = subjects[vraag].statement;
                }
            }
        } else if (i === 0) {
            document.getElementById("btn" + i).onclick = function () {
                if (vraag > 0) {
                    vraag--;
                    document.getElementById("title").innerHTML = subjects[vraag].title;
                    document.getElementById("statement").innerHTML = subjects[vraag].statement;
                } else if (vraag === 0) {
                    document.getElementById("startButton").style.display = "block";
                    document.getElementById("startMenu").style.display = "inline-block";
                    document.getElementById("voteContainer").style.display = "none";
                }
            }
        }
    }
    document.getElementById("startButton").onclick = function () {
        document.getElementById("voteContainer").style.display = "block";
        document.getElementById("startButton").style.display = "none";
        document.getElementById("startMenu").style.display = "none";
    }
};

//Weergeeft extra stellingen en laat een box zien onder de vraag
function ExtraVragen() {
    document.getElementById("title").innerHTML = "Zijn er onderwerpen die u extra belangrijkt vindt?";
    document.getElementById("statement").innerHTML = "Aangevinkte stellingen tellen extra mee bij het berekenen van het resultaat.";
    for (let i = 0; i < subjects.length; i++) {
        weight.push(1);
        createElement("P", "feedbackContainer", "Question " + i, subjects[i].title, "Qtitle");
        createElement("IMG", "feedbackContainer", "Toggle " + i, false, "Qbox");
        var element = document.getElementById("Toggle " + i);
        element.src = "images/box.png";
        element.onclick = function () {
            changeOnclickBox(i)
        };
    }
    document.getElementById("BTNcontainer").style.display = "none";
    createElement("BUTTON", "voteContainer", "NextButton", "Alle partijen", "Qbox");
    document.getElementById("NextButton").onclick = function () { partiesPickList() };
}

//Weergeeft een checkmark wanneer je op de box klikt
function changeOnclickBox(i) {
    document.getElementById("Toggle " + i).src = "images/checkmark.png";
    document.getElementById("Toggle " + i).onclick = function () {
        changeOnclickCheckmark(i)
    };
    weight[i] = 2;
}

//Weergeeft een box wanneer je op de checkmark klikt
function changeOnclickCheckmark(i) {
    document.getElementById("Toggle " + i).src = "images/box.png";
    document.getElementById("Toggle " + i).onclick = function () {
        changeOnclickBox(i)
    };
    weight[i] = 1;
}

//Is nog niet af. Is om de keuze te krijgen tussen alleen grote partijen, alles etc.
function partiesPickList() {
    document.getElementById("feedbackContainer").style.display = "none";
    document.getElementById("statement").innerHTML = "U kunt kiezen voor Alle partijen.";
    document.getElementById("NextButton").onclick = function () { endCalculation() };
}

//Eind berekening + weergeven van partijen
function endCalculation() {
    document.getElementById("title").innerHTML = "Hier ziet u de partijen die bij uw selectie passen:";
    document.getElementById("statement").style.display = "none";
    document.getElementById("NextButton").style.display = "none";
    for (let i = 0; i < subjects.length; i++) {
        for (let x = 0; x < subjects[i].parties.length; x++) {
            if (stemmen[i] === "skip") {
                console.log("skipped");
                break;
            } else if (stemmen[i] === "none") {
                parties.find(x => x.name === 'Niet Stemmers').points += parseInt(weight[i]);
                break;
            } else if (subjects[i].parties[x].position === stemmen[i]) {
                var a = subjects[i].parties[x].name;
                parties.find(x => x.name === a).points += parseInt(weight[i]);
            }
        }
    }
    createElement("DIV", "container", "answerWrapper");
    sortList();
    showList();
}

//Sorteert de partijen
function sortList() {
    parties.sort(function (a, b) { return b.points - a.points });
}

//Omrekening van stemmen in percentages
function percentage(partialValue, totalValue) {
    return (100 * partialValue) / totalValue;
}
function calculateVotes() {
    let x = 0;
    for (let i = 0; i < weight.length; i++) {
        x += parseInt(weight[i]);
    }
    return x;
}

//Laat Partij + Percentages zien
function showList() {
    if (partijen === "none") {
        for (let x = 0; x < parties.length; x++) {
            createElement("P", "answerWrapper", "answer" + parties[x].name, 'De partij "' + parties[x].name + '" past bij u voor ' + (percentage(parties[x].points, calculateVotes())) + '%.');
        }
    }
}