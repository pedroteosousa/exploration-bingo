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
    "Obtain the Beast Crest",
    "Obtain the Wanderer Crest",
    "Obtain the Witch Crest",
    "Obtain the Reaper Crest",
    "Obtain the Architect Crest",

    // Bosses
    "Defeat Bell Beast",
    "Defeat Disgraced Chef Lugoli",
    "Defeat Forebrothers SIgnis & Gron",
    "Defeat Moss Mothers in Weavenest Atla",
    "Defeat Fourth Chorus",
    "Defeat Cogwork Dancers",
    "Defeat Sister Splinter",
    "Defeat Trobbio",
    "Defeat Phantom",
    "Defeat Lace in Deep Docks",
    "Defeat Lace in the Cradle",
    "Defeat Moorwing",
    "Defeat Great Conchflies",
    "Defeat Raging Conchfly",
    "Defeat Skull Tyrant",
    "Defeat First Sinner",
    "Defeat Raging Conchfly",

    // Skills
    "Obtain Thread Storm",
    "Obtain Needolin",
    "Obtain Drifter's Cloak",
    "Obtain Clawline",
    "Obtain Sharpdart",
    "Obtain Needle Strike",

    // Map areas
    "Unlock 6 different Bellway stations",
    "Unlock 8 different Bellway stations",
    "Unlock Bilewater's Bellway station",
    "Unlock Shellwood's Bellway station",
    "Unlock Far Fields' Bellway station",
    "Unlock Greymoor's Bellway station",
    "Unlock The Slab's Bellway station",
    "Unlock Deep Docks' Bellway station",
    "Unlock Blasted Steps' Bellway station",
    "Unlock the Grand Bellway station",
    "Unlock 1 Ventrica",
    "Unlock 3 Ventricas (excluding Terminus)",
    "Visit all Citadel sub-areas",
    "Visit 1 Weavenest",
    "Visit 2 different Weavenests",
    "Visit Skarrsinger Karmelita's statue",
    "Visit Crust King Khann's Statue",
    
    // NPC
    "Slap someone",
    "Slap 2 different characters",
    "Meet the flea caravan at Greymoor",
    "Talk to Vaultkeeper Cardinius",
    "Talk to Mask Maker",
    "Talk to Loam",
    "Talk to Eva",
    "Talk to Styx",
    "Talk to Nuu",
    "Talk to Forge Daugther",
    "Talk to Greyroot",
    "Talk to the Bell Hermit",
    "Talk to Garmond and Zaza",
    "Talk to the Twelfth Architect",
    "Free the Green Prince",
    "Interact with 5 Shakra locations",
    "Interact with 7 Shakra locations",
    "Buy out Mottled Skarr",
    "Rescue all 2 fleas in Far Fields",
    "Rescue all 2 fleas in The Marrow + Hunter's March",
    "Rescue all 3 fleas in Greymoor",
    "Complete Loddie's first challenge",
    "Play with Lumble the Lucky",
    "Sell 1 relic to Relic Seeker Scrounge",
    "Sell 3 relics to Relic Seeker Scrounge",
    "Sell 5 relics to Relic Seeker Scrounge",

    // Items
    "Obtain 1 extra mask",
    "Obtain 2 extra masks",
    "Obtain 1 extra silk spool",
    "Obtain 2 extra silk spool",
    "Obtain 3 Memory Lockets",
    "Obtain 6 Memory Lockets",
    "Obtain 2 Craftmetal",
    "Obtain 4 Craftmetal",
    "Obtain 2 Psalm Cylinders",
    "Obtain Twisted Bud",
    "Needle 1",
    "Needle 2",
    "Have 1 Silkeater",
    "Have 2 Silkeaters",
    "Have 4 Silkeaters",
    "Have 5 Rosary Necklaces",
    "Obtain the Hornet Statuette",
    "Obtain a Pale Rosary Necklace",
    "Obtain Key of Apostate",
    "Obtain White Key",
    "Obtain a Cogheart piece",
    "Obtain the white Quill",
    "Obtain the red Quill",
    // "Obtain ",

    // Tools
    "Obtain Straight Pin + Threefold Pin",
    "Obtain Magma Bell + Warding Bell",
    "Obtain Scuttlebrace + Silkspeed Anklets",
    "Obtain Magnetite Dice",
    "Obtain Barbed Bracelet",
    "Obtain Silkshot (any version)",
    "Obtain Cogflies",
    "Obtain Druid's Eye",
    "Obtain Druid's Eyes",
    "Obtain Curveclaw",
    "Obtain Conchcutter",
    "Obtain Flintslate",
    "Obtain Tacks",
    "Obtain Longpin",
    "Obtain Fractured Mask",
    "Obtain Pollip Pouch",
    "Obtain Quick Sling",
    "Obtain Wreath of Purity",
    "Obtain Delver's Drill",
    "Have 5 tools",
    "Have 8 tools",
    "Have 10 tools",
    "Have 12 tools",
    "Have 15 tools",
    "Have 20 tools",
    
    // Misc
    "Enter act 2",
    "Learn 1 part of the Threefold Melody",
    "Interact with the target from Far Field's practice room",
    "Complete Loddie's first challenge",
    "Acquire your own Bellhome",
    "Obtain Sting Shard + Thread Storm + Clawline",
    "Ring Songclave's Bellshrine",
    "Ring 2 Bellshrines",
    "Ring 4 Bellshrines",
    "Ring all 6 Bellshrines",
    "Plasmify Hornet",
    "Become infested with maggots",
    "Get free entrance to a payed room",
    // "",

    // Wishes
    "Grant 5 wishes",
    "Grant 10 wishes",
    "Grant 12 wishes",
    "Grant 15 wishes",
    "Give 3 rare delicacies to the Great Gourmand",
    "Deliver supplies to Bone Bottom",
    "Deliver supplies to Pilgrim's Rest",
    "Deliver Queen's egg to Styx",
    "Grant Nuu's wish",
    "Complete the My Missing Courier wish",
    "Complete the My Missing Brother wish",

    // Enemies
    "Kill a Wraith",
    "Kill a Lifeseed",
    "Kill a Ductsucker",
    "Kill a Clawmaiden",
    "Kill a Servitor Ignim",
    "Kill a Winged Furm",
    "Kill a Roachkeeper",
    "Kill a Bloatroach",
    "Kill a Brushflit",
    // "Kill a ",
    "Muckmaggot journal entry",
    "Wisp journal entry",

    // Wings needed
    "Obtain Faydown Cloak",
    "Talk to Huntress",
    "Unlock Putrified Ducts's Bellway Station",
    "Rescue the huge flea",
    "Obtain Thief's Mark",
    "Awaken Second Sentinel",
    "Obtain Materium",
    "Obtain Pimpillo",
    "Obtain Voltvessel",
    "Obtain Snare Setter",
    "Defeat Father of the Flame"
];

export function generateBoard(size: number, seed: number): Cell[] {
  const cells: Cell[] = [];
  const rng = makeSeededGenerators(seed.toString());

  let goalsCopy = [...goals];
  while (goalsCopy.length < size * size) {
    goalsCopy = [...goalsCopy, ...goals]
  }

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
