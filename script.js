// Declaring variables
let rhs;
let lhs;
let variable;
let lhsUnitRandom;
let lhsVarRandom;
let rhsUnitRandom;
let rhsVarRandom;
let stepOneComplete;
let rhsUnit;
let rhsVarl;
let lhsUnit;
let lhsVar;
let difficulty = 1;
let language;
let answerSign, lhsUnitSign, lhsVarSign, rhsUnitSign, rhsVarSign;

const tileContainer = document.getElementById("tileContainer");
const posTileContainerUnit = document.getElementById("posTileContainerUnit");
const posTileContainerVar = document.getElementById("posTileContainerVar");
const negTileContainerUnit = document.getElementById("negTileContainerUnit");
const negTileContainerVar = document.getElementById("negTileContainerVar");
const lhsUnitContainer = document.getElementById("lhsUnitContainer");
const lhsVarContainer = document.getElementById("lhsVarContainer");
const rhsUnitContainer = document.getElementById("rhsUnitContainer");
const rhsVarContainer = document.getElementById("rhsVarContainer");

const lhsUnitContainerAnswer = document.getElementById(
  "lhsUnitContainerAnswer"
);
const lhsVarContainerAnswer = document.getElementById("lhsVarContainerAnswer");
const rhsUnitContainerAnswer = document.getElementById(
  "rhsUnitContainerAnswer"
);
const rhsVarContainerAnswer = document.getElementById("rhsVarContainerAnswer");

const rhsAnswerContainer = document.getElementById("rhsAnswerContainer");
const parentElement = document.getElementById("scale-top");
const equality = document.getElementById("equality");
const restart = document.getElementsByName("restart");
const settings = document.getElementById("settingsButton");
const display = document.getElementsByClassName("display");
const calculationsField = document.getElementById("calculations");

// Sound effects

function playAudio(fileName) {
  let sound = new Audio(`audio/${fileName}`);
  if (soundIsOn) {
    sound.play();
  }
}

// Initialize audio
let soundIsOn = true;
$(document).on("change", 'input:radio[name="audio"]', function (event) {
  soundIsOn = !soundIsOn;
  playAudio("click.wav");
});

// Detect and change level

$(document).on("change", 'input:radio[name="level"]', function (event) {
  difficulty = event.target.value;
  startGame();
});

// Difficulty detection
$(document).on("change", 'input:radio[name="level"]', function (event) {
  difficulty = this.value;
  startGame();
});

// Language detection and change

$('[lang="fr"]').hide();

$(document).on("change", 'input:radio[name="language"]', function (event) {
  let restart = document.getElementById("restart");
  let settingsButton = document.getElementById("settingsButton");

  $('[lang="fr"]').toggle();
  $('[lang="en"]').toggle();
  if (language == "en" || language == null) {
    restart.setAttribute("data-bs-original-title", "Redémarrer");
    settingsButton.setAttribute("data-bs-original-title", "Réglages");
    language = "fr";
  } else if (language == "fr") {
    restart.setAttribute("data-bs-original-title", "Restart");
    settingsButton.setAttribute("data-bs-original-title", "Settings");
    language = "en";
  }
});

// Initialize modal

$(document).ready(function () {
  $("#settingsModal").modal("show");
});

settings.addEventListener("click", function () {
  $("#settingsModal").modal("show");
});

// Blur buttons when modals close
$("body").on("hidden.bs.modal", ".modal", function () {
  $(".btn").blur();
});

// Generating equation to match
function equationToMatch() {
  changeTextByName("rhsSign", "");
  changeTextByName("rhsVar", "");
  changeTextByName("lhsUnit", "");
  changeTextByName("lhsVar", "");
  changeTextByName("rhsUnit", "");
  rhsUnit = 1;
  rhsVar = 2;
  lhsUnit = 3;
  lhsVar = 4;
  variable = 0.5;
  while (lhsUnit + lhsVar * variable != rhsUnit + rhsVar * variable) {
    if (difficulty == 1 || difficulty == 2 || difficulty == 3) {
      variable = Math.floor(Math.random() * 8) + 1;
    } else if (difficulty == 4) {
      variable = Math.floor(Math.random() * 10) - 5;
    }

    if (difficulty == 1) {
      rhsUnit = Math.floor(Math.random() * 9) + 1;
      rhsVar = 0;
      lhsUnit = Math.floor(Math.random() * 9) + 1;
      lhsVar = Math.floor(Math.random() * 9) + 1;
    } else if (difficulty == 2) {
      rhsUnit = Math.floor(Math.random() * 9) + 1;
      rhsVar = Math.floor(Math.random() * 9);
      lhsUnit = Math.floor(Math.random() * 9) + 1;
      lhsVar = Math.floor(Math.random() * 9) + 1;
    } else if (difficulty == 3) {
      rhsUnit = Math.floor(Math.random() * 9) - 5;
      rhsVar = 0;
      lhsUnit = Math.floor(Math.random() * 9) - 5;
      lhsVar = Math.floor(Math.random() * 9) - 5;
    } else {
      rhsUnit = Math.floor(Math.random() * 9) - 5;
      rhsVar = Math.floor(Math.random() * 9) - 5;
      lhsUnit = Math.floor(Math.random() * 9) - 5;
      lhsVar = Math.floor(Math.random() * 9) - 5;
    }
  }
  if (rhsVar != 0) {
    changeTextByName("rhsVar", `${rhsVar}x`);
    changeTextByName("rhsSign", `+`);
  } else {
    changeTextByName("rhsSign", "");
    changeTextByName("rhsVar", "");
  }
  changeTextByName("lhsUnit", lhsUnit);
  changeTextByName("lhsVar", `${lhsVar}x`);
  changeTextByName("rhsUnit", rhsUnit);
}

// Function change inntertext all elements with a given name
function changeTextByName(elementName, text) {
  let e = document.getElementsByName(elementName);
  for (let i = 0; i < e.length; i++) {
    e[i].innerHTML = text;
  }
}

// Initialize tooltips
var tooltipTriggerList = [].slice.call(
  document.querySelectorAll('[data-bs-toggle="tooltip"]')
);
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl);
});

// Create tiles
function createTile(
  unitOrVars,
  posOrNeg,
  parentContainer,
  textNoText,
  onBalance
) {
  let newTile = document.createElement("div");
  newTile.setAttribute("draggable", "true");
  let classList =
    "tiles mx-auto d-flex align-items-center justify-content-center";
  if (unitOrVars == "vars") {
    newTile.className = `vars ${posOrNeg} ${classList}`;
    newTile.setAttribute("data-type", "vars");
    if (textNoText) {
      if (posOrNeg == "pos") {
        newTile.innerHTML = "+x";
      } else {
        newTile.innerHTML = "-x";
      }
    }
  } else if (unitOrVars == "unit") {
    newTile.className = `unit ${posOrNeg} ${classList}`;
    newTile.setAttribute("data-type", "unit");
    if (textNoText) {
      if (posOrNeg == "pos") {
        newTile.innerHTML = "+1";
      } else {
        newTile.innerHTML = "-1";
      }
    }
  }
  if (onBalance) {
    newTile.setAttribute("onBalance", "true");
  } else {
    newTile.setAttribute("onBalance", "false");
  }
  parentContainer.appendChild(newTile);
}

// Counting tiles in containers
function countElements(parentContainer) {
  var parentContainer = document.getElementById(parentContainer);
  var positive = parentContainer.getElementsByClassName("pos").length;
  var negative = parentContainer.getElementsByClassName("neg").length;
  return (count = positive - negative);
}

// Updating the equation to reflect tiles on balance
function equationText() {
  function digitText(lhsORrhs, UnitOrVar) {
    if (countElements(`${lhsORrhs}${UnitOrVar}Container`) == 0) {
      document.getElementById(`${lhsORrhs}${UnitOrVar}Count`).innerHTML = "";
    } else {
      if (UnitOrVar == "Unit") {
        document.getElementById(`${lhsORrhs}${UnitOrVar}Count`).innerHTML =
          countElements(`${lhsORrhs}${UnitOrVar}Container`);
      } else {
        document.getElementById(`${lhsORrhs}${UnitOrVar}Count`).innerHTML =
          countElements(`${lhsORrhs}${UnitOrVar}Container`) + "x";
      }
    }
  }
  digitText("lhs", "Unit");
  digitText("lhs", "Var");
  digitText("rhs", "Unit");
  digitText("rhs", "Var");

  // LHS Shananigans
  if (
    countElements("lhsVarContainer") > 0 &&
    countElements("lhsUnitContainer") != 0
  ) {
    document.getElementById("lhsPosNeg").innerHTML = " + ";
  } else if (countElements("lhsVarContainer") < 0) {
    document.getElementById("lhsPosNeg").innerHTML = "  ";
  } else if (
    countElements("lhsUnitContainer") == 0 &&
    countElements("lhsVarContainer") == 0
  ) {
    document.getElementById("lhsPosNeg").innerHTML = "0";
  } else if (
    countElements("lhsVarContainer") == 0 ||
    countElements("lhsUnitContainer") == 0
  ) {
    document.getElementById("lhsPosNeg").innerHTML = "  ";
  }
  // RHS Shenananigans

  if (
    countElements("rhsUnitContainer") > 0 &&
    countElements("rhsVarContainer") != 0
  ) {
    document.getElementById("rhsPosNeg").innerHTML = " + ";
  } else if (
    countElements("rhsUnitContainer") > 0 &&
    countElements("rhsVarContainer") == 0
  ) {
    document.getElementById("rhsPosNeg").innerHTML = "  ";
  } else if (
    countElements("rhsUnitContainer") == 0 &&
    countElements("rhsVarContainer") != 0
  ) {
    document.getElementById("rhsPosNeg").innerHTML = "  ";
  } else if (countElements("rhsUnitContainer") < 0) {
    document.getElementById("rhsPosNeg").innerHTML = "  ";
  } else if (
    countElements("rhsVarContainer") == 0 &&
    countElements("rhsUnitContainer") == 0
  ) {
    document.getElementById("rhsPosNeg").innerHTML = "0";
  }
}

// Balancing the balance after tiles added or removed
function balance() {
  equationText();
  lhs =
    countElements("lhsUnitContainer") +
    countElements("lhsVarContainer") * variable;
  rhs =
    countElements("rhsUnitContainer") +
    countElements("rhsVarContainer") * variable;

  if (rhs > lhs) {
    var rotatePercent = 1 - lhs / rhs;
    var Deg = rotatePercent * 6;
    if (Deg > 8) {
      Deg = 8;
    } else if (Deg < 8 && Deg < -8) {
      Deg = -8;
    }
    $("#scale-top").css({
      transform: "rotate(" + Deg + "deg)",
    });
    equality.innerHTML = "<";
  } else if (lhs > rhs) {
    var rotatePercent = 1 - rhs / lhs;
    var Deg = rotatePercent * 6;
    if (Deg > 8) {
      Deg = 8;
    } else if (Deg < 8 && Deg < -8) {
      Deg = -8;
    }

    $("#scale-top").css({
      transform: "rotate(-" + Deg + "deg)",
    });
    equality.innerHTML = ">";
  } else if (lhs === rhs) {
    $("#scale-top").css({
      transform: "rotate(0deg)",
    });
    equality.innerHTML = "=";
  }
}

// Random addition of tiles to scale
function setTiles() {
  lhsUnitContainer.innerHTML = "";
  lhsVarContainer.innerHTML = "";
  rhsUnitContainer.innerHTML = "";
  rhsVarContainer.innerHTML = "";

  if (difficulty == 1) {
    lhsUnitRandom = Math.floor(Math.random() * 8) + 1;
    lhsVarRandom = Math.floor(Math.random() * 8) + 1;
    rhsUnitRandom = Math.floor(Math.random() * 8) + 1;
    rhsVarRandom = 0;
  } else if (difficulty == 2) {
    lhsUnitRandom = Math.floor(Math.random() * 8);
    lhsVarRandom = Math.floor(Math.random() * 8);
    rhsUnitRandom = Math.floor(Math.random() * 8);
    rhsVarRandom = Math.floor(Math.random() * 8);
  } else if (difficulty == 3) {
    lhsUnitRandom = Math.floor(Math.random() * 8) - 4;
    lhsVarRandom = Math.floor(Math.random() * 8);
    rhsUnitRandom = Math.floor(Math.random() * 8) - 4;
    rhsVarRandom = 0;
  } else {
    lhsUnitRandom = Math.floor(Math.random() * 8) - 4;
    lhsVarRandom = Math.floor(Math.random() * 8) - 4;
    rhsUnitRandom = Math.floor(Math.random() * 8) - 4;
    rhsVarRandom = Math.floor(Math.random() * 8) - 4;
  }
  for (let i = 0; i < Math.abs(lhsUnitRandom); i++) {
    if (lhsUnitRandom > 0) {
      createTile("unit", "pos", lhsUnitContainer, false, true);
    } else {
      createTile("unit", "neg", lhsUnitContainer, false, true);
    }
  }

  for (let i = 0; i < Math.abs(lhsVarRandom); i++) {
    if (lhsVarRandom > 0) {
      createTile("vars", "pos", lhsVarContainer, false, true);
    } else {
      createTile("vars", "neg", lhsVarContainer, false, true);
    }
  }

  for (let i = 0; i < Math.abs(rhsUnitRandom); i++) {
    if (rhsUnitRandom > 0) {
      createTile("unit", "pos", rhsUnitContainer, false, true);
    } else {
      createTile("unit", "neg", rhsUnitContainer, false, true);
    }
  }

  for (let i = 0; i < Math.abs(rhsVarRandom); i++) {
    if (rhsVarRandom > 0) {
      createTile("vars", "pos", rhsVarContainer, false, true);
    } else {
      createTile("vars", "neg", rhsVarContainer, false, true);
    }
  }
}

//Check Match
function checkMatch() {
  if (
    lhsVar == countElements("lhsVarContainer") &&
    lhsUnit == countElements("lhsUnitContainer") &&
    rhsVar == countElements("rhsVarContainer") &&
    rhsUnit == countElements("rhsUnitContainer") &&
    !stepOneComplete
  ) {
    playAudio("celebrate.mp3");
    if (language == "en" || language == null) {
      alert(
        "Great! Now use the algebra tiles to solve for the unknown variable."
      );
    } else if (language == "fr") {
      alert(
        "Bravo! Ensuite, il faut se servir des tuiles pour résoudre l'équation."
      );
    }
    for (let i = 0; i < display.length; i++) {
      display[i].classList.toggle("d-none");
    }
    stepOneComplete = true;
  }
}

// Check if equation has been solved
function checkSolvedEquation() {
  if (stepOneComplete) {
    if (
      (countElements("lhsVarContainer") == 1 &&
        countElements("lhsUnitContainer") == 0 &&
        countElements("rhsUnitContainer") == variable) ||
      (countElements("rhsVarContainer") == 1 &&
        countElements("lhsUnitContainer") == variable &&
        countElements("lhsVarContainer") == 0)
    ) {
      $(document).ready(function () {
        $("#youWinModal").modal("show");
      });
      playAudio("celebrate.wav");
    }
  }
}

// Initialize functions and variables
function startGame() {
  stepOneComplete = false;
  display[0].classList.remove("d-none");
  display[1].classList.add("d-none");
  equationToMatch();
  setTiles();
  equationText();
  balance();
  verifySolution();
}

// Start game with initial functions
startGame();

// Restart button functionality
for (let i = 0; i < restart.length; i++) {
  restart[i].addEventListener("click", () => {
    startGame();
  });
}

// Radio button functionality

radioButtonActive("language-radio-buttons");
radioButtonActive("difficulty-radio-buttons");
radioButtonActive("audio-radio-buttons");

function radioButtonActive(radioButtonClassName) {
  let e = document.getElementsByClassName(radioButtonClassName);
  for (let i = 0, max = e.length; i < max; i++) {
    e[i].addEventListener("click", function () {
      for (let i = 0, max = e.length; i < max; i++) {
        e[i].classList.remove("active");
      }
      this.classList.add("active");
    });
  }
}

// Drag and drop functionality
(function initiate() {
  for (
    var items = document.querySelectorAll('[data-draggable="item"]'),
      len = items.length,
      i = 0;
    i < len;
    i++
  ) {
    items[i].setAttribute("draggable", "true");
    items[i].classList.add("draggable");
  }
  var item = null;
  let position = { x: 0, y: 0 };

  interact('*[draggable="true"]').draggable({
    listeners: {
      start(event) {
        parent = event.target.parentElement;
        let item = event.target;
        innerValue = item.innerHTML;
        // Add the dotted line to indicate dropzone

        if (item.classList[0] == "unit") {
          rhsUnitContainer.classList.add("drag-over");
          lhsUnitContainer.classList.add("drag-over");
        }

        if (item.classList[0] == "vars") {
          rhsVarContainer.classList.add("drag-over");
          lhsVarContainer.classList.add("drag-over");
        }
        playAudio("click.wav");
      },
      move(event) {
        position.x += event.dx;
        position.y += event.dy;
        event.target.style.transform = `translate(${position.x}px, ${position.y}px)`;
      },
      end(event) {
        let eventTarget = event.target;
        function remove(eventTarget) {
          if (eventTarget.style.transform != "") {
            position = { x: 0, y: 0 };
            eventTarget.remove();
            playAudio("trash.mp3");
          }
        }
        setTimeout(remove(eventTarget), 100);

        if (posTileContainerUnit.children.length == 0) {
          createTile("unit", "pos", posTileContainerUnit, true, false);
        }
        if (posTileContainerVar.children.length == 0) {
          createTile("vars", "pos", posTileContainerVar, true, false);
        }
        if (negTileContainerUnit.children.length == 0) {
          createTile("unit", "neg", negTileContainerUnit, true, false);
        }
        if (negTileContainerVar.children.length == 0) {
          createTile("vars", "neg", negTileContainerVar, true, false);
        }
        let dragOverBoxes = document.querySelectorAll(".drag-over");
        for (let i = 0; i < dragOverBoxes.length; i++) {
          dragOverBoxes[i].classList.remove("drag-over");
        }

        balance();
        equationText();
        setTimeout(checkMatch, 800);
        setTimeout(checkSolvedEquation, 800);
      },
    },
  });

  interact(".boxes").dropzone({
    accept: "div",
    overlap: 0.75,

    ondrop: function (event) {
      console.log(event.relatedTarget.classList[0]);
      if (
        event.relatedTarget.classList[0] ==
        event.target.getAttribute("data-type")
      ) {
        event.relatedTarget.style = "";
        event.relatedTarget.innerHTML = "";
        event.target.insertBefore(event.relatedTarget, event.target.firstChild);
        position = { x: 0, y: 0 };
        balance();
        equationText();
        playAudio("drop.wav");
      }
    },
  });

  //   document.addEventListener(
  //     "dragstart",
  //     function (e) {
  //       item = e.target;
  //       e.dataTransfer.setData("text", "");
  //       playAudio("click.wav");
  //     },
  //     false
  //   );

  //   document.addEventListener(
  //     "dragover",
  //     function (e) {
  //       if (item) {
  //         e.preventDefault();

  //         // Add the dotted line to indicate dropzone

  //         if (item.classList[0] == "unit") {
  //           rhsUnitContainer.classList.add("drag-over");
  //           lhsUnitContainer.classList.add("drag-over");
  //         }

  //         if (item.classList[0] == "vars") {
  //           rhsVarContainer.classList.add("drag-over");
  //           lhsVarContainer.classList.add("drag-over");
  //         }
  //       }
  //     },
  //     false
  //   );

  //   //drop event to allow the element to be dropped into valid targets
  //   document.addEventListener(
  //     "drop",
  //     function (e) {
  //       if (
  //         (e.target.getAttribute("data-draggable") == "target" &&
  //           e.target.getAttribute("data-type") == item.classList[0]) ||
  //         item.getAttribute("onBalance") == "true" ||
  //         e.target.getAttribute("onBalance") == "true" ||
  //         e.target.getAttribute("data-draggable") != "target"
  //       ) {
  //         if (
  //           e.target.getAttribute("data-type") == "garbage" ||
  //           e.target.getAttribute("data-draggable") != "target"
  //         ) {
  //           item.remove();
  //           playAudio("trash.mp3");
  //           // Remove dotted lines on drop boxes
  //           let dragOverBoxes = document.querySelectorAll(".drag-over");
  //           for (let i = 0; i < dragOverBoxes.length; i++) {
  //             dragOverBoxes[i].classList.remove("drag-over");
  //           }
  //           setTimeout(checkMatch, 800);
  //           setTimeout(checkSolvedEquation, 800);
  //         }
  //         if (
  //           e.target.getAttribute("data-draggable") == "target" &&
  //           e.target.getAttribute("data-type") == item.classList[0]
  //         ) {
  //           e.target.insertBefore(item, e.target.firstChild);

  //           playAudio("drop.wav");
  //         } else if (e.target.getAttribute("onBalance") == "true") {
  //           e.target.parentElement.insertBefore(
  //             item,
  //             e.target.parentElement.firstChild
  //           );

  //           playAudio("drop.wav");
  //         }

  //         item.innerHTML = "";
  //         item.setAttribute("onBalance", "true");
  //         e.preventDefault();
  //         balance();
  //         equationText();

  //         if (posTileContainerUnit.children.length == 0) {
  //           createTile("unit", "pos", posTileContainerUnit, true, false);
  //         }
  //         if (posTileContainerVar.children.length == 0) {
  //           createTile("vars", "pos", posTileContainerVar, true, false);
  //         }
  //         if (negTileContainerUnit.children.length == 0) {
  //           createTile("unit", "neg", negTileContainerUnit, true, false);
  //         }
  //         if (negTileContainerVar.children.length == 0) {
  //           createTile("vars", "neg", negTileContainerVar, true, false);
  //         }
  //       }
  //     },
  //     false
  //   );

  //   document.addEventListener(
  //     "dragend",
  //     function (e) {
  //       item = null;

  //       // Remove dotted lines on drop boxes
  //       let dragOverBoxes = document.querySelectorAll(".drag-over");
  //       for (let i = 0; i < dragOverBoxes.length; i++) {
  //         dragOverBoxes[i].classList.remove("drag-over");
  //       }
  //     },
  //     false
  //   );
  //
})();

// You Win Modal Set-Up

function verifySolution() {
  rhsAnswerContainer.innerHTML = "";
  lhsUnitContainerAnswer.innerHTML = "";
  lhsVarContainerAnswer.innerHTML = "";
  rhsUnitContainerAnswer.innerHTML = "";
  rhsVarContainerAnswer.innerHTML = "";
  changeTextByName("variable", "");
  changeTextByName("variable", variable);
  changeTextByName("totals", ``);
  changeTextByName("totals", `${lhsUnit + lhsVar * variable}`);
  if (variable > 0) {
    varSign = "pos";
  } else {
    varSign = "neg";
  }
  for (let i = 0; i < variable; i++) {
    createTile("unit", varSign, rhsAnswerContainer, true, false);
  }

  if (lhsUnit > 0) {
    lhsUnitSign = "pos";
  } else {
    lhsUnitSign = "neg";
  }
  for (let i = 0; i < lhsUnit; i++) {
    createTile("unit", lhsUnitSign, lhsUnitContainerAnswer, true, false);
  }

  if (lhsVar > 0) {
    lhsVarSign = "pos";
  } else {
    lhsVarSign = "neg";
  }
  for (let i = 0; i < lhsVar; i++) {
    createTile("vars", lhsVarSign, lhsVarContainerAnswer, true, false);
    lhsVarContainerAnswer.children[i].innerHTML = `x = ${variable}`;
  }

  if (rhsUnit > 0) {
    rhsUnitSign = "pos";
  } else {
    rhsUnitSign = "neg";
  }
  for (let i = 0; i < rhsUnit; i++) {
    createTile("unit", rhsUnitSign, rhsUnitContainerAnswer, true, false);
  }

  if (rhsVar > 0) {
    rhsVarSign = "pos";
  } else {
    rhsVarSign = "neg";
  }
  for (let i = 0; i < rhsVar; i++) {
    createTile("vars", rhsVarSign, rhsVarContainerAnswer, true, false);
  }
  // Algebraic Solution
  if (rhsVar != 0) {
    calculationsField.innerHTML = `
  ${lhsUnit} + ${lhsVar}x = ${rhsVar}x + ${rhsUnit} <br>
  ${lhsUnit} + ${lhsVar}(${variable}) = ${rhsVar}(${variable}) + ${rhsUnit} <br>
  ${lhsUnit} + ${lhsVar * variable} = ${rhsVar * variable} + ${rhsUnit} <br>
  ${lhsUnit + lhsVar * variable} = ${lhsUnit + lhsVar * variable}`;
  } else {
    calculationsField.innerHTML = `
    ${lhsUnit} + ${lhsVar}x =  ${rhsUnit} <br>
    ${lhsUnit} + ${lhsVar}(${variable}) =  ${rhsUnit} <br>
    ${lhsUnit} + ${lhsVar * variable} = ${rhsUnit} <br>
    ${lhsUnit + lhsVar * variable} = ${lhsUnit + lhsVar * variable}`;
  }
}
