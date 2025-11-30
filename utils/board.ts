import { Cell } from "./types.ts";
import * as pr from "https://esm.sh/pure-rand@6.0.4";

function hashString(str: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function makeSeededGenerators(seed: string | number) {
  const numericSeed = typeof seed === "number"
    ? seed
    : hashString(seed);

  let rng = pr.mersenne(numericSeed);

  return {
    randomInt: (min: number, max: number) => {
      const dist = pr.uniformIntDistribution(min, max);
      const [value, next] = dist(rng);
      rng = next;
      return value;
    },
  };
}

const goals = [
    // Crests
    "Beast Crest",
    "Wanderer Crest",
    "Witch Crest",

    // Bosses
    "Bell Beast",
    "Fourth Chorus",
    "Cogwork Dancers",
    "Trobbio",
    "Phantom",
    "Lace",
    "Lace 2",
    "Moorwing",
    "Widow",



    // Skills
    "Thread Storm",
    "Needolin",
    "Faydown Cloak",
    "Clawline",
    "Sharpdart",

    // Map areas
    "Unlock 6 different Bellway Stations",
    "Unlock Bilewater's Bellway Station",
    "Unlock Shellwood's Bellway Station",
    "Unlock Far Fields' Bellway Station",
    "Visit 2 different Weavenests",
    
    // NPC
    "Meet the flea caravan at Greymoor",
    "Talk to Vaultkeeper Cardinius",
    "Talk to Eva",
    "Talk to Styx",
    "Talk to Nuu",
    "Free the Green Prince",
    "Interact with 5 Shakra locations",
    "Interact with 7 Shakra locations",
    "Buy out Mottled Skarr",
    "Rescue all fleas in Far Fields",
    "Rescue all fleas in The Marrow + Hunter's March",

    // Items
    "Obtain 1 extra mask",
    "Obtain 2 extra masks",
    "Obtain 1 extra silk spool",
    "Obtain 2 extra silk spool",
    "Obtain 3 memory lockets",
    "Obtain 6 memory lockets",
    "Needle 1",
    "Needle 2",

    // Tools
    "Sting Shard + Thread Storm",
    "Straight Pin + Threefold Pin",
    "Magma Bell + Warding Bell",
    "Magnetite Dice",
    "Scuttlebrace + Silkspeed Anklets",

    // Misc
    "Enter act 2",
    "Learn 1 part of the Threefold Melody",

    // Wishes
    "Grant 5 wishes",
    "Grant 10 wishes",
    "Grant 12 wishes",
    "Give 3 rare delicacies to the Great Gourmand"



];

export function generateBoard(size: number, seed: number): Cell[] {
  const cells: Cell[] = [];
  const rng = makeSeededGenerators(seed.toString());

  const goalsCopy = [...goals];

  let currentIndex: number = goalsCopy.length, randomIndex: number;

  while (currentIndex > 0) {
    randomIndex = rng.randomInt(0, currentIndex - 1);
    currentIndex--;
    [goalsCopy[currentIndex], goalsCopy[randomIndex]] = [
      goalsCopy[randomIndex],
      goalsCopy[currentIndex],
    ];
  }

  for (let i = 0; i < size * size; i++) {
    cells.push({
      colors: [],
      text: goalsCopy[i],
    });
  }

  return cells;
}
