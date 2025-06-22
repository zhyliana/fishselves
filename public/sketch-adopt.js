// sketch-adopt.js

let ws;
let myFish = null;   // The fish we adopt from the server

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(14, 12, 30);

  // Connect to server
  ws = new WebSocket("ws://" + window.location.hostname + ":4000");

  ws.onopen = () => {
    // Ask to adopt a fish!
    ws.send(JSON.stringify({ type: "adoptFish" }));
  };

  ws.onmessage = event => {
    const msg = JSON.parse(event.data);
    if (msg.type === "adoptedFish") {
      if (msg.fish) {
        // Map type to class (just like index.js)
        const FISH_CLASSES = {
          fish: Fish,
          psychedelicFish: PsychedelicFish,
          shrimp: SacredShrimp,
          manta: Manta
          // Add more as needed
        };
        const FishClass = FISH_CLASSES[msg.fish.type] || Fish;
        myFish = new FishClass(width / 2, height / 2);
        if (msg.fish.color) myFish.baseCol = color(...msg.fish.color);
        myFish.id = msg.fish.id;

        myFish.swim.setSadMode(true);
        // Show adopted info
        const { name } = getFishPersonality();
        let info = `You adopted: <b>${name}</b>`;
        document.getElementById("fish-info").innerHTML = info;
      } else {
        document.getElementById("fish-info").innerHTML = "Sorry, no fish left to adopt!";
      }
    }
  };
}

function draw() {
  background(17, 12, 35, 80);

  if (myFish) {
    myFish.update(false);
    myFish.display(false);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
