// sketch-adopt.js

let ws;
let myFish = null;   // The fish we adopt from the server
let img;
let cnv

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  img = loadImage('../assets/bowl_with_water.png')
  // background(14, 12, 30);

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
          manta: Manta,
          quetzal: Quetzal,
          // Add more as needed
        };
        const FishClass = FISH_CLASSES[msg.fish.type] || Fish;

        myFish = new FishClass(0, height);
        if (msg.fish.color) myFish.baseCol = color(...msg.fish.color);
        myFish.id = msg.fish.id;

        myFish.swim.setSadMode(true);
        // Show adopted info
        const { name } = getFishPersonality();
        let title = `Thank you for your enthusiastic participation.`
        title += `<p>The magic of fish is now optimized for your convenience,`
        title += ` and safe enough for everyday use.</p>`
        title += `Enjoy the convenience of wonder.`
        document.getElementById("title").innerHTML = title;

        let info = `<p>You adopted: <b>${name}</b>`;
        document.getElementById("fish-info").innerHTML = info;
      } else {
        let title = `No fish left to adopt!<p>`
        title += "Magic is has been safely repurposed for approved functions.<p>Please resume normal joy.";

        document.getElementById("title").innerHTML = title;
        document.getElementById("fish-info").innerHTML = '';
      }
    }
  };
}

function draw() {
  image(img, 0, 0, width, height, 0, 0, img.width, img.height, COVER);
  if (myFish) {
    myFish.update(false);
    scale(0.5)
    myFish.display(false);
    scale(1)
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
