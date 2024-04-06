// project.js - Generates a random mission and set of equipment for the reader to use in the video game Helldivers.
// Author: Connor Lowe
// Date: 4/7/2024

// NOTE: This is how we might start a basic JavaaScript OOP project 

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

// define a class
class MyProjectClass {
  // constructor function
  constructor(param1, param2) {
    // set properties using 'this' keyword
    this.property1 = param1;
    this.property2 = param2;
  }
  
  // define a method
  myMethod() {
    // code to run when method is called
  }
}

function main() {
  const fillers = {
  rank: ["Cadet", "Space Cadet", "Sergeant", "Master Sergeant", "Chief", "Space Chief Prime", "Death Captain", "Marshall", "Star Marshall", "Admiral", "Skull Admiral", "Fleet Admiral", "Admirable Admiral", "Commander", "Galactic Commander", "Hell Commander", "General", "5-Star General", "10-Star General", "Private", "Super Private"],
  planets: ["Alaraph", "Keid", "Kirrik", "Fornskogur II", "Prosperity Falls", "Viridia Prime", "Krakatwo", "Crimsica", "Pherkad Secundus", "Haldus", "Mintoria", "Diluvia", "AIN-5", "Alamak VII", "Aesir Pass", "Emeria", "Epsilon Phoencis VI", "Lesath", "Fenmire", "Liberty Ridge", "Oshaune", "Hyrdobius", "Stor Tha Prime", "Oslo Station", "Super Earth"],
  enemies: ["Terminid", "Automaton", "Illuminate"],
  guns: ["AR-23 Liberator", "ARC-3 Arc Thrower", "APW-1 Anti-Materiel Rifle", "FAF-14 Spear", "FLAM-40 Incinerator", "JAR-5 Dominator", "LAS-16 Sickle", "LAS-98 Laser Cannon", "LAS-5 Scythe", "M-105 Stalwart", "MG-43 Machine Gun", "MG-206 Heavy Machine Gun", "P-19 Redeemer", "P-2 Peacemaker", "P-4 Senator", "R-63 Diligence", "RS-422 Railgun", "SG-225 Breaker", "SG-8 Punisher", "SG-8S Slugger"],
  grenades: ["G-10 Incendiary", "G-3 Smoke", "G-16 Impact", "G-6 Frag", "G-12 High Explosive", "G-23 Stun"],
  powers1: ["Tesla Tower", "Anti-Personnel Minefield", "Incendiary Mines", "Machine Gun Sentry", "Gatling Sentry", "Mortar Sentry", "Autocannon Sentry", "Rocket Sentry", "EMS Mortar Sentry"],
  powers2: ["Gatling Barrage", "Airburst Strike", "120MM HE Barrage", "Walking Barrage", "Laser", "Railcannon Strike", "Gas Strike", "EMS Strike", "Smoke Strike"],
  powers3: ["Strafing Run", "Airstrike", "Cluster Bomb", "Napalm Airstrike", "Smoke Strike", "110MM Rocket Pods", "500kg Bomb"],
  missions: ["defend a friendly outpost", "protect liberty", "defend freedom", "search and destroy enemy outposts", "launch an ICBM", "conduct geological surveys", "upload escape pod data", "retrieve valuable data", "activate E-710 pumps", "evacuate civilians"]
};

const template = `Greetings $rank! We need your assistance on this mission.

$planets is currently being attacked by a small army of $enemies.

Fortunately, we have some equipment for you to take. Your equipment will consist of:
1x $guns
2x $grenades
2x $powers1
3x Orbital $powers2
1x Eagle $powers3

You will need to be smart with this equipment in order to $missions.

Good luck Helldiver!
`;


// STUDENTS: You don't need to edit code below this line.

const slotPattern = /\$(\w+)/;

function replacer(match, name) {
  let options = fillers[name];
  if (options) {
    return options[Math.floor(Math.random() * options.length)];
  } else {
    return `<UNKNOWN:${name}>`;
  }
}

function generate() {
  let story = template;
  while (story.match(slotPattern)) {
    story = story.replace(slotPattern, replacer);
  }

  /* global box */
  $("#box").text(story);
}

/* global clicker */
$("#clicker").click(generate);

generate();

}

// let's get this party started - uncomment me
main();
