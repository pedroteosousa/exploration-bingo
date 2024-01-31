import { Cell } from "./types.ts";
import { makeSeededGenerators } from "vegas";

const goals = [
  "Defeat two Dream Bosses",
  "Defeat Broken Vessel",
  "Defeat Lost Kin",
  "Defeat Crystal Guardian 1",
  "Defeat Crystal Guardian 2",
  "Defeat Collector",
  "Defeat Dung Defender",
  "Defeat White Defender",
  "Defeat Failed Champion",
  "Defeat False Knight + Brooding Mawlek",
  "Defeat Flukemarm",
  "Defeat Grey Prince Zote",
  "Defeat Hive Knight",
  "Defeat Hornet 2",
  "Defeat Mantis Lords",
  "Defeat Nosk",
  "Defeat Oro and Mato",
  "Defeat Pale Lurker",
  "Defeat Paintmaster Sheo",
  "Defeat Pure Vessel",
  "Defeat any one Radiant Boss",
  "Defeat Soul Master",
  "Defeat Soul Tyrant",
  "Defeat Traitor Lord",
  "Defeat Troupe Master Grimm",
  "Defeat Nightmare King Grimm",
  "Defeat Uumuu",
  "Defeat Watcher Knights",
  "Defeat Vengefly King + Massive Moss Charger",
  "Defeat two dream warriors",
  "Defeat Galien",
  "Defeat Gorb",
  "Defeat Elder Hu",
  "Defeat Marmu",
  "Defeat Markoth",
  "Defeat No Eyes",
  "Defeat Xero",
  "Kill two Soul Warriors",
  "Kill three different Great Husk Sentries",
  "Kill an Aluba",
  "Kill two different Alubas",
  "Colosseum 1",
  "Colosseum 3",
  "Defeat Colosseum Zote",
  "Check the Crystal Crawler Journal Entry",
  "Kill 6 different Stalking Devouts",
  "Kill a Durandoo",
  "Kill a Great Hopper",
  "Kill Gorgeous Husk",
  "Kill a Gulka with its own projectile",
  "Kill a Kingsmould",
  "Kill a Lightseed",
  "Kill two different Maggots",
  "Dream Nail Marissa",
  "Slash Millibelle in Pleasure House",
  "Check/Kill 4 Mimics",
  "Kill Myla",
  "Obtain Herrah",
  "Obtain Lurien",
  "Obtain Monomon",
  "Ride the stag to Distant Village",
  "Ride the stag to Queen's Gardens",
  "Ride the stag to Hidden Station",
  "Ride the stag to King's Station",
  "Ride the stag to Queen's Station",
  "Have 5 or more Charms",
  "Equip 5 Charms at the same time",
  "Obtain Carefree Melody",
  "Obtain Wayward Compass or Gathering Swarm",
  "Obtain Dream Wielder or Dreamshield",
  "Obtain all three Fragile charms",
  "Obtain Flukenest or Fury of the Fallen",
  "Obtain Grubsong or Grubberfly's Elegy",
  "Obtain Glowing Womb or Weaversong",
  "Obtain Heavy Blow or Steady Body",
  "Obtain Hiveblood or Sharp Shadow",
  "Obtain two Lifeblood charms",
  "Obtain Longnail or Mark of Pride",
  "Obtain Quick Slash or Nailmaster's Glory",
  "Obtain Quick Focus or Deep Focus",
  "Obtain Shaman Stone or Spell Twister",
  "Obtain Sprintmaster or Dashmaster",
  "Obtain Soul Eater or Soul Catcher",
  "Obtain Thorns of Agony or Stalwart Shell",
  "Obtain Shape of Unn or Baldur Shell",
  "Obtain the Love Key",
  "Obtain Descending Dark",
  "Obtain Dream Nail",
  "Obtain Dream Gate",
  "Obtain 2 Nail Arts",
  "Obtain Abyss Shriek",
  "Obtain Shade Soul",
  "Obtain Isma's Tear",
  "Obtain Vengeful Spirit",
  "Obtain Howling Wraiths",
  "Obtain 15 grubs",
  "Obtain 35 grubs",
  "Obtain 2 Pale Ore",
  "Use 2 Simple Keys",
  "Have 3 different maps not counting Dirtmouth or Hive",
  "Obtain Collector's Map",
  "Obtain 1 Arcane Egg",
  "Obtain Godtuner",
  "Obtain 3 King's Idols",
  "Obtain 5 Wanderer's Journals",
  "Obtain Lumafly Lantern",
  "Obtain 1 extra mask",
  "Have 6 Charm Notches total",
  "Obtain 4 Rancid Eggs",
  "Obtain 5 Hallownest Seals",
  "Obtain 1 extra soul vessel",
  "Obtain Tram Pass",
  "Obtain World Sense",
  "Interact with 3 Cornifer locations",
  "Check Crystal Heart",
  "Open the Crystal Peaks chest",
  "Check Deep Focus",
  "Get 2 Dreamer's checks (Requires Dream nail)",
  "Complete the Greenpath Root",
  "Check the Hallownest Crown",
  "Buy the Basin fountain check",
  "Bow to the Fungal Core Elder",
  "Check Glowing Womb",
  "Check the Hive Mask Shard",
  "Check Joni's Blessing",
  "Complete the Kingdom's Edge Root",
  "Check Love Key",
  "Check 2 Nailmasters",
  "Get two Pale Ore checks (Grubs / Essence excluded)",
  "Check the journal below Stone Sanctuary",
  "Check Sheo",
  "Visit all 4 shops (Sly, Iselda, Salubra and Leg Eater)",
  "Check three different spell locations",
  "Check the Stag Nest vessel fragment",
  "Check Shade Soul",
  "Get the Abyss Shriek check",
  "Check Isma's Tear",
  "Complete 4 full dream trees",
  "Check Shape of Unn",
  "Check the journal above Mantis Village",
  "Check Void Heart",
  "Check/Free all grubs in Ancient Basin (2)",
  "Check/Free all grubs in City of Tears (5)",
  "Check/Free all grubs in Crossroads (5) + Fog Canyon (1)",
  "Check/Free all grubs in Deepnest (5)",
  "Check/Free all grubs in Greenpath (4) and in Fungal (2)",
  "Check/Free all grubs in Kingdom's Edge (7)",
  "Check/Free all grubs in Crystal Peaks (7)",
  "Check/Free all grubs in Queen's Gardens (3)",
  "Check/Free all grubs in Waterways (3)",
  "Break 3 floors using Dive",
  "Break the 420 geo rock in Kingdom's Edge",
  "Collect 500 essence",
  "Spend 3000 geo",
  "Spend 4000 geo",
  "Spend 5000 geo",
  "Have 1500 geo in the bank",
  "Talk to Bardoon",
  "Rescue Bretta + Sly",
  "Get Brumm's flame",
  "Talk to Cloth",
  "Complete either ending of the Cloth questline",
  "Sit on the City of Tears Quirrel bench",
  "Use City Crest + Ride both CoT large elevators",
  "Kill 3 Oomas using a minion charm",
  "Rescue Zote in Deepnest",
  "Check/Read the Dung Defender sign before Isma's Grove",
  "Open the Dirtmouth / Crystal Peaks elevator",
  "Give Flower to Elderbug",
  "Talk to Emilitia (shortcut out of sewers)",
  "Talk to the Fluke Hermit",
  "Enter Godhome",
  "Check the Goam and Garpede Journal Entries",
  "Open Jiji's Hut and buy out Jiji",
  "Hit the Oro scarecrow up until the hoppers spawn",
  "Talk to Lemm in his shop with Defender's Crest equipped",
  "Buy out Leg Eater",
  "10 Lifeblood masks at the same time",
  "Enter the Lifeblood Core room without wearing any Lifeblood charms",
  "Check/Read 3 lore tablets in Teacher's Archives",
  "Check/Read the lore tablet in Ancient Basin",
  "Check/Read two lore tablets in City of Tears proper (No sub areas)",
  "Check/Read the lore tablet in Howling Cliffs",
  "Check/Read three lore tablets in Greenpath",
  "Check/Read the lore tablet in Kingdom's Edge (requires Spore Shroom)",
  "Check/Read both Pilgrim's Way lore tablets",
  "Check/Read both lore tablets in Soul Sanctum",
  "Check/Read both lore tablets in Mantis Village",
  "Check the Charged Lumafly Journal Entry",
  "Talk to Mask Maker",
  "Talk to Midwife",
  "Bow to Moss Prophet, dead or alive",
  "Interact with Mr. Mushroom once (Does not require Spore Shroom)",
  "Nail 2",
  "Nail 3",
  "Use a Nail Art in its vanilla Nailmaster's Hut",
  "Eternal Ordeal: 20 Zotes",
  "Talk to Salubra while overcharmed",
  "Complete Path of Pain",
  "Buy 6 map pins from Iselda (All but two)",
  "Buy 8 map pins from Iselda (All)",
  "Parry Revek 3 times without dying (Spirit's Glade Guard)",
  "Buy out Salubra",
  "Slash two Shade Gates",
  "Take a bath in 4 different Hot Springs",
  "Splash the NPC in the Colosseum's hot spring",
  "Visit Shrine of Believers",
  "Look through Lurien's telescope",
  "Check the Void Tendrils Journal Entry",
  "Swat Tiso's shield away from his corpse",
  "Slash the Beast's Den Trilobite",
  "Talk to Tuk",
  "Visit Distant Village or Hive",
  "Visit Lake of Unn or Blue Lake",
  "Visit Overgrown Mound or Crystalised Mound (Crystalised requires dive)",
  "Visit Queen's Gardens or Cast Off Shell",
  "Visit Soul Sanctum or Royal Waterways",
  "Visit Tower of Love (Love Key not required)",
  "Swim in a Void Pool",
  "Dream Nail White Lady",
  "Dream Nail Willoh's meal",
  "Sit down in Hidden Station",
  "Get all the Grubfather checks",
  "Get all the Seer checks",
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
