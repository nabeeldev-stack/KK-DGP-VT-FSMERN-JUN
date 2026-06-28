const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Game = require("./models/Game");

dotenv.config({ path: require("path").join(__dirname, ".env") });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected for seeding");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

const games = [
    {
        title: "Minecraft",
        description: "Minecraft is a sandbox game where players explore a blocky, procedurally generated 3D world, discover and extract raw materials, craft tools and items, and build structures or earthworks. It offers multiple game modes including survival, creative, adventure, and spectator.",
        genre: "Sandbox / Survival",
        imageUrl: "https://www.minecraft.net/content/dam/minecraftnet/games/minecraft/key-art/Homepage_Discover-our-games_MC-Vanilla-KeyArt_864x864.jpg",
        downloadLink: "https://www.minecraft.net/en-us/download"
    },
    {
        title: "Grand Theft Auto V",
        description: "Grand Theft Auto V is an action-adventure game set in the fictional state of San Andreas. Players can freely roam the countryside and the city of Los Santos, engaging in missions, heists, and various side activities. The game features three protagonists and a massive open world.",
        genre: "Action-Adventure / Open World",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/271590/header.jpg",
        downloadLink: "https://www.rockstargames.com/gta-v"
    },
    {
        title: "The Witcher 3: Wild Hunt",
        description: "The Witcher 3 is an action RPG set in a fantasy world. Players control Geralt of Rivia, a monster hunter for hire, as he searches for his adopted daughter while the world is consumed by war. The game features a vast open world, branching storylines, and deep character progression.",
        genre: "Action RPG / Open World",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg",
        downloadLink: "https://www.thewitcher.com/en/witcher3"
    },
    {
        title: "Red Dead Redemption 2",
        description: "Red Dead Redemption 2 is a Western-themed action-adventure game set in an open world. The story follows Arthur Morgan, an outlaw and member of the Van der Linde gang, as they try to survive against government forces, rival gangs, and other adversaries.",
        genre: "Action-Adventure / Western",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg",
        downloadLink: "https://www.rockstargames.com/reddeadredemption2"
    },
    {
        title: "Elden Ring",
        description: "Elden Ring is an action RPG set in the Lands Between, a vast fantasy world created by Hidetaka Miyazaki and George R.R. Martin. Players explore open fields, massive dungeons, and fight challenging enemies while uncovering the secrets of the Elden Ring.",
        genre: "Action RPG / Souls-like",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg",
        downloadLink: "https://www.eldenring.com/"
    },
    {
        title: "Cyberpunk 2077",
        description: "Cyberpunk 2077 is an open-world action RPG set in Night City, a megalopolis obsessed with power, glamour, and body modification. Players play as V, a mercenary outlaw, as they take on the most dangerous heist of their lives.",
        genre: "Action RPG / Cyberpunk",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg",
        downloadLink: "https://www.cyberpunk.net/"
    },
    {
        title: "God of War (2018)",
        description: "God of War is an action-adventure game following Kratos, the former Greek God of War, and his young son Atreus in the world of Norse mythology. Together they embark on a deeply personal journey to fulfill his wife's dying wish: to spread her ashes at the highest peak of the realms.",
        genre: "Action-Adventure / Mythology",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/1593500/header.jpg",
        downloadLink: "https://www.playstation.com/en-us/games/god-of-war/"
    },
    {
        title: "Stardew Valley",
        description: "Stardew Valley is a farming simulation game where players inherit their grandfather's old farm in Stardew Valley. Players can grow crops, raise animals, mine for ores, befriend villagers, and restore the community center. The game offers a relaxing, open-ended experience.",
        genre: "Simulation / Farming RPG",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/413150/header.jpg",
        downloadLink: "https://www.stardewvalley.net/"
    },
    {
        title: "The Legend of Zelda: Breath of the Wild",
        description: "Breath of the Wild is an action-adventure game where Link awakens from a 100-year slumber to defeat Calamity Ganon and save the kingdom of Hyrule. The game features a massive open world with physics-based puzzles, dynamic weather, and countless secrets to discover.",
        genre: "Action-Adventure / Open World",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/353160/header.jpg",
        downloadLink: "https://www.zelda.com/breath-of-the-wild/"
    },
    {
        title: "Baldur's Gate 3",
        description: "Baldur's Gate 3 is a role-playing game set in the Dungeons & Dragons universe. Players create a character and embark on a grand adventure through the Forgotten Realms, making choices that shape the story. The game features turn-based combat, deep character customization, and rich narrative.",
        genre: "CRPG / Turn-Based Strategy",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/header.jpg",
        downloadLink: "https://baldursgate3.game/"
    },
    {
        title: "Hollow Knight",
        description: "Hollow Knight is a 2D action-adventure metroidvania game set in Hallownest, a desolate kingdom of bugs and insects. Players explore hauntingly beautiful environments, fight challenging enemies, and uncover ancient mysteries as they descend into the depths of a ruined civilization.",
        genre: "Metroidvania / Action-Adventure",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/367520/header.jpg",
        downloadLink: "https://www.hollowknight.com/"
    },
    {
        title: "Doom Eternal",
        description: "Doom Eternal is a first-person shooter that continues the story of the Doom Slayer as he battles demonic forces across Earth and Hell. The game features fast-paced combat, a variety of powerful weapons, and a heavy metal soundtrack. Players must use strategy and agility to survive.",
        genre: "First-Person Shooter",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/782330/header.jpg",
        downloadLink: "https://www.doom.com/"
    },
    {
        title: "Valorant",
        description: "Valorant is a free-to-play tactical first-person shooter developed by Riot Games. Players take on the role of agents, each with unique abilities, and compete in 5v5 matches. The game combines precise gunplay with strategic ability usage, requiring teamwork and coordination.",
        genre: "Tactical FPS / Hero Shooter",
        imageUrl: "https://i0.wp.com/waytoomany.games/wp-content/uploads/2020/06/Header-1.jpg?zoom=2&resize=860%2C280&ssl=1",
        downloadLink: "https://playvalorant.com/"
    },
    {
        title: "Counter-Strike 2",
        description: "Counter-Strike 2 is a free-to-play tactical first-person shooter and the successor to CS:GO. Teams of terrorists and counter-terrorists battle in objective-based game modes. The game features updated graphics, improved physics, and classic competitive gameplay.",
        genre: "Tactical FPS",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg",
        downloadLink: "https://store.steampowered.com/app/730/CounterStrike_2/"
    },
    {
        title: "Fortnite",
        description: "Fortnite is a free-to-play battle royale game where 100 players compete to be the last one standing. Players can build structures, collect resources, and use a variety of weapons. The game features regular content updates, collaborations, and a vibrant art style.",
        genre: "Battle Royale / Third-Person Shooter",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/3519140/header.jpg",
        downloadLink: "https://www.fortnite.com/"
    },

    // ── NEW GAMES ──────────────────────────────────────────────────────────────

    {
        title: "Dark Souls III",
        description: "Dark Souls III is an action RPG set in the dark fantasy world of Lothric. Players must traverse treacherous environments, battle fearsome bosses, and unravel the mysteries of a dying world. Known for its punishing difficulty, intricate level design, and deeply rewarding combat system.",
        genre: "Action RPG / Souls-like",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/374320/header.jpg",
        downloadLink: "https://store.steampowered.com/app/374320/DARK_SOULS_III/"
    },
    {
        title: "Sekiro: Shadows Die Twice",
        description: "Sekiro: Shadows Die Twice is an action-adventure game set in late 1500s Sengoku Japan. Players control a shinobi named Wolf who must rescue his kidnapped lord and take revenge on his enemies. The game features a unique posture-based combat system and vertical traversal mechanics.",
        genre: "Action-Adventure / Souls-like",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/814380/header.jpg",
        downloadLink: "https://store.steampowered.com/app/814380/Sekiro_Shadows_Die_Twice/"
    },
    {
        title: "Hades",
        description: "Hades is a roguelike dungeon crawler where players control Zagreus, the immortal son of Hades, as he attempts to escape the Underworld. Each run features procedurally generated chambers, powerful boons from Olympian gods, and a rich narrative that unfolds with every attempt.",
        genre: "Roguelike / Action",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/header.jpg",
        downloadLink: "https://store.steampowered.com/app/1145360/Hades/"
    },
    {
        title: "Apex Legends",
        description: "Apex Legends is a free-to-play battle royale hero shooter set in the Titanfall universe. Teams of three compete to be the last squad standing, using unique character abilities, advanced movement mechanics, and a wide arsenal of weapons across ever-evolving maps.",
        genre: "Battle Royale / Hero Shooter",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/1172470/header.jpg",
        downloadLink: "https://www.ea.com/games/apex-legends"
    },
    {
        title: "League of Legends",
        description: "League of Legends is a free-to-play multiplayer online battle arena (MOBA) game. Two teams of five champions compete to destroy the opposing team's Nexus. With over 160 champions, each with unique abilities, the game offers endless strategic depth and competitive play.",
        genre: "MOBA / Strategy",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/2801590/header.jpg",
        downloadLink: "https://www.leagueoflegends.com/"
    },
    {
        title: "Dota 2",
        description: "Dota 2 is a free-to-play multiplayer online battle arena game. Two teams of five players compete to destroy the enemy's Ancient structure. With over 120 heroes and an incredibly deep strategic layer, Dota 2 is one of the most complex and rewarding competitive games ever made.",
        genre: "MOBA / Strategy",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg",
        downloadLink: "https://www.dota2.com/"
    },
    {
        title: "Overwatch 2",
        description: "Overwatch 2 is a free-to-play team-based hero shooter. Players choose from a diverse roster of heroes, each with unique abilities, and compete in objective-based game modes. The game emphasizes teamwork, strategy, and fast-paced action across a variety of maps and modes.",
        genre: "Hero Shooter / FPS",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/2357570/header.jpg",
        downloadLink: "https://overwatch.blizzard.com/"
    },
    {
        title: "Resident Evil Village",
        description: "Resident Evil Village is a survival horror game and the eighth major installment in the Resident Evil series. Players control Ethan Winters as he searches for his kidnapped daughter in a mysterious Eastern European village filled with terrifying creatures and gothic horror.",
        genre: "Survival Horror / Action",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/1196590/header.jpg",
        downloadLink: "https://store.steampowered.com/app/1196590/Resident_Evil_Village/"
    },
    {
        title: "Horizon Zero Dawn",
        description: "Horizon Zero Dawn is an action RPG set in a post-apocalyptic world reclaimed by nature and dominated by robotic creatures. Players control Aloy, a skilled hunter, as she unravels the mysteries of her world and discovers the truth about her origins.",
        genre: "Action RPG / Open World",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/1151640/header.jpg",
        downloadLink: "https://store.steampowered.com/app/1151640/Horizon_Zero_Dawn/"
    },
    {
        title: "Death Stranding",
        description: "Death Stranding is an action game set in a post-apocalyptic America where players control Sam Porter Bridges, a courier tasked with reconnecting isolated cities. The game features unique gameplay centered around traversal, cargo management, and building connections between communities.",
        genre: "Action / Walking Simulator",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/1190460/header.jpg",
        downloadLink: "https://store.steampowered.com/app/1190460/DEATH_STRANDING/"
    },
    {
        title: "Monster Hunter: World",
        description: "Monster Hunter: World is an action RPG where players take on the role of a hunter tasked with tracking and slaying or trapping massive monsters in a living, breathing ecosystem. The game features deep crafting systems, co-op multiplayer, and a vast array of weapons and armor.",
        genre: "Action RPG / Co-op",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/582010/header.jpg",
        downloadLink: "https://store.steampowered.com/app/582010/Monster_Hunter_World/"
    },
    {
        title: "Terraria",
        description: "Terraria is a 2D sandbox action-adventure game with a focus on exploration, building, crafting, and combat. Players dig, fight, explore, and build in a procedurally generated world. With hundreds of items, enemies, and bosses, Terraria offers an enormous amount of content.",
        genre: "Sandbox / Action-Adventure",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/105600/header.jpg",
        downloadLink: "https://store.steampowered.com/app/105600/Terraria/"
    },
    {
        title: "Among Us",
        description: "Among Us is an online multiplayer social deduction game. Players work together to maintain a spaceship while impostors secretly sabotage and eliminate crewmates. The game requires communication, deception, and deduction skills as players try to identify the impostors before it's too late.",
        genre: "Social Deduction / Party",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/945360/header.jpg",
        downloadLink: "https://www.innersloth.com/games/among-us/"
    },
    {
        title: "Celeste",
        description: "Celeste is a precision platformer about climbing a mountain. Players control Madeline as she faces her inner demons while ascending the treacherous Celeste Mountain. The game is celebrated for its tight controls, challenging level design, and heartfelt story about mental health.",
        genre: "Platformer / Indie",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/504230/header.jpg",
        downloadLink: "https://store.steampowered.com/app/504230/Celeste/"
    },
    {
        title: "Disco Elysium",
        description: "Disco Elysium is a groundbreaking open-world RPG with no combat. Players control a detective with amnesia as he investigates a murder in a decaying city. The game features an unprecedented dialogue system, deep political themes, and a unique skill system that shapes the narrative.",
        genre: "RPG / Detective",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/632470/header.jpg",
        downloadLink: "https://store.steampowered.com/app/632470/Disco_Elysium/"
    },
    {
        title: "Divinity: Original Sin 2",
        description: "Divinity: Original Sin 2 is a critically acclaimed RPG with deep tactical turn-based combat. Players create their own character and embark on an epic journey in the world of Rivellon. The game features rich storytelling, co-op multiplayer, and an incredibly flexible character system.",
        genre: "CRPG / Turn-Based Strategy",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/435150/header.jpg",
        downloadLink: "https://store.steampowered.com/app/435150/Divinity_Original_Sin_2/"
    },
    {
        title: "Cuphead",
        description: "Cuphead is a classic run-and-gun action game heavily focused on boss battles. Inspired by the cartoons of the 1930s, the visuals and audio are painstakingly created with the same techniques of the era. Players control Cuphead and Mugman as they battle through a series of challenging bosses.",
        genre: "Run-and-Gun / Platformer",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/268910/header.jpg",
        downloadLink: "https://store.steampowered.com/app/268910/Cuphead/"
    },
    {
        title: "Persona 5 Royal",
        description: "Persona 5 Royal is a JRPG following a group of high school students who become Phantom Thieves, exploring supernatural Palaces to steal the corrupt desires of adults. The game blends dungeon crawling, social simulation, and a stylish aesthetic with a deep narrative about rebellion.",
        genre: "JRPG / Social Simulation",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/1687950/header.jpg",
        downloadLink: "https://store.steampowered.com/app/1687950/Persona_5_Royal/"
    },
    {
        title: "Final Fantasy XIV",
        description: "Final Fantasy XIV is a massively multiplayer online RPG set in the world of Eorzea. Players create a character and embark on an epic story-driven adventure, joining forces with other players to battle powerful enemies, explore vast dungeons, and experience one of gaming's most celebrated narratives.",
        genre: "MMORPG / Fantasy",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/39210/header.jpg",
        downloadLink: "https://www.finalfantasyxiv.com/"
    },
    {
        title: "World of Warcraft",
        description: "World of Warcraft is the world's most iconic MMORPG set in the Warcraft universe. Players choose a faction, race, and class, then explore the vast world of Azeroth, completing quests, raiding dungeons, and competing in PvP battles. With decades of content, it remains a landmark in online gaming.",
        genre: "MMORPG / Fantasy",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/2835570/header.jpg",
        downloadLink: "https://worldofwarcraft.blizzard.com/"
    },
    {
        title: "Diablo IV",
        description: "Diablo IV is an action RPG set in the dark, gothic world of Sanctuary. Players choose from multiple classes and battle through a massive open world filled with demons, dungeons, and powerful bosses. The game features deep loot systems, seasonal content, and both solo and co-op gameplay.",
        genre: "Action RPG / Hack and Slash",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/2344520/header.jpg",
        downloadLink: "https://diablo4.blizzard.com/"
    },
    {
        title: "Starfield",
        description: "Starfield is an open-world RPG set in space, developed by Bethesda Game Studios. Players explore over 1,000 planets across multiple star systems, build and customize their own spaceship, and uncover the mysteries of a rare artifact that holds the key to humanity's future.",
        genre: "Action RPG / Space Exploration",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/1716740/header.jpg",
        downloadLink: "https://store.steampowered.com/app/1716740/Starfield/"
    },
    {
        title: "Palworld",
        description: "Palworld is an open-world survival crafting game where players collect and battle mysterious creatures called Pals. Players can build bases, craft weapons, farm, and explore a vast world. The game blends creature-collecting mechanics with survival gameplay and multiplayer co-op.",
        genre: "Survival / Creature Collecting",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/1623730/header.jpg",
        downloadLink: "https://store.steampowered.com/app/1623730/Palworld/"
    },
    {
        title: "Helldivers 2",
        description: "Helldivers 2 is a third-person co-op shooter where players fight as elite soldiers defending Super Earth from alien threats. Teams of up to four players drop into hostile planets, complete objectives, and call in powerful stratagems. The game features intense action, friendly fire, and a galactic war meta-campaign.",
        genre: "Co-op Shooter / Action",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/553850/header.jpg",
        downloadLink: "https://store.steampowered.com/app/553850/HELLDIVERS_2/"
    },
    {
        title: "Lies of P",
        description: "Lies of P is a souls-like action RPG inspired by the story of Pinocchio, set in a dark Belle Époque world. Players control P, a puppet, as he navigates the ruined city of Krat overrun by mad puppets. The game features a unique weapon assembly system and a morality mechanic based on lying.",
        genre: "Action RPG / Souls-like",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/1627720/header.jpg",
        downloadLink: "https://store.steampowered.com/app/1627720/Lies_of_P/"
    },
    {
        title: "Alan Wake 2",
        description: "Alan Wake 2 is a survival horror game and sequel to the original Alan Wake. The game follows two protagonists: FBI agent Saga Anderson investigating ritualistic murders in a small town, and Alan Wake himself, trapped in a dark dimension. It features a unique narrative structure and stunning visuals.",
        genre: "Survival Horror / Thriller",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/1903780/header.jpg",
        downloadLink: "https://store.steampowered.com/app/1903780/Alan_Wake_2/"
    },
    {
        title: "Hogwarts Legacy",
        description: "Hogwarts Legacy is an open-world action RPG set in the wizarding world of Harry Potter in the 1800s. Players attend Hogwarts School of Witchcraft and Wizardry, learn spells, brew potions, tame magical beasts, and uncover a hidden truth about the wizarding world.",
        genre: "Action RPG / Open World",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/990080/header.jpg",
        downloadLink: "https://store.steampowered.com/app/990080/Hogwarts_Legacy/"
    },
    {
        title: "Spider-Man: Miles Morales",
        description: "Marvel's Spider-Man: Miles Morales follows teenager Miles Morales as he masters his new powers and embraces his identity as Spider-Man. Set in a snow-covered New York City, Miles must stop a war between a high-tech energy corporation and a criminal army while protecting his community.",
        genre: "Action-Adventure / Superhero",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/1817070/header.jpg",
        downloadLink: "https://store.steampowered.com/app/1817070/Marvels_SpiderMan_Miles_Morales/"
    },
    {
        title: "Returnal",
        description: "Returnal is a roguelike third-person shooter where players control Selene, an astronaut trapped in a time loop on an alien planet. Each death restarts the loop, but players retain knowledge and some items. The game features intense bullet-hell combat, procedurally generated levels, and a haunting narrative.",
        genre: "Roguelike / Third-Person Shooter",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/1649240/header.jpg",
        downloadLink: "https://store.steampowered.com/app/1649240/Returnal/"
    },
    {
        title: "It Takes Two",
        description: "It Takes Two is a co-op action-adventure game about a couple on the verge of divorce who are magically transformed into dolls. They must work together to navigate a fantastical world and fix their relationship. The game features constantly changing gameplay mechanics and is designed exclusively for co-op play.",
        genre: "Co-op / Action-Adventure",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/1426210/header.jpg",
        downloadLink: "https://store.steampowered.com/app/1426210/It_Takes_Two/"
    },
    {
        title: "Ghostwire: Tokyo",
        description: "Ghostwire: Tokyo is an action-adventure game set in a supernatural version of Tokyo where 99% of the population has mysteriously vanished. Players control Akito, who teams up with a spirit detective to battle malevolent supernatural forces using elemental abilities and spirit magic.",
        genre: "Action-Adventure / Supernatural",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/1475810/header.jpg",
        downloadLink: "https://store.steampowered.com/app/1475810/Ghostwire_Tokyo/"
    },
    {
        title: "Sifu",
        description: "Sifu is a third-person kung fu action game where players control a young martial arts student seeking revenge for the murder of their family. The game features a unique aging mechanic where dying makes the character older and more powerful but closer to permanent death, and stunning hand-to-hand combat.",
        genre: "Beat 'em Up / Martial Arts",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/2138710/header.jpg",
        downloadLink: "https://store.steampowered.com/app/2138710/Sifu/"
    },
    {
        title: "Ori and the Will of the Wisps",
        description: "Ori and the Will of the Wisps is a visually stunning platformer and sequel to Ori and the Blind Forest. Players guide Ori through a beautiful and dangerous world, using fluid movement abilities to navigate challenging environments and uncover the mysteries of a new land.",
        genre: "Platformer / Metroidvania",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/1057090/header.jpg",
        downloadLink: "https://store.steampowered.com/app/1057090/Ori_and_the_Will_of_the_Wisps/"
    },
    {
        title: "Subnautica",
        description: "Subnautica is an underwater open-world survival game set on an alien ocean planet. Players must gather resources, build underwater bases, and explore the depths while managing oxygen and hunger. The game features a rich ecosystem of alien sea creatures and a compelling mystery to unravel.",
        genre: "Survival / Exploration",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/264710/header.jpg",
        downloadLink: "https://store.steampowered.com/app/264710/Subnautica/"
    },
    {
        title: "No Man's Sky",
        description: "No Man's Sky is a space exploration survival game featuring a procedurally generated universe with over 18 quintillion planets to explore. Players can fly seamlessly between planets, build bases, trade resources, and engage in space combat. The game has received massive updates since launch, transforming it into a rich multiplayer experience.",
        genre: "Space Exploration / Survival",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/275850/header.jpg",
        downloadLink: "https://store.steampowered.com/app/275850/No_Mans_Sky/"
    },
    {
        title: "Rust",
        description: "Rust is a multiplayer survival game where players must gather resources, build shelters, craft weapons, and survive against other players and the environment. The game features a harsh, unforgiving world where trust is rare and danger is everywhere. It is one of the most popular survival games on PC.",
        genre: "Survival / Multiplayer",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/252490/header.jpg",
        downloadLink: "https://store.steampowered.com/app/252490/Rust/"
    },
    {
        title: "ARK: Survival Evolved",
        description: "ARK: Survival Evolved is a survival game where players are stranded on a mysterious island filled with dinosaurs and other prehistoric creatures. Players must tame dinosaurs, build bases, craft equipment, and survive against both the environment and other players in this massive open-world adventure.",
        genre: "Survival / Open World",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/346110/header.jpg",
        downloadLink: "https://store.steampowered.com/app/346110/ARK_Survival_Evolved/"
    },
    {
        title: "Sea of Thieves",
        description: "Sea of Thieves is a shared-world adventure game where players become pirates sailing the seas, hunting for treasure, battling skeleton forts, and engaging in ship-to-ship combat. The game features a vibrant art style, co-op gameplay for up to four players, and a constantly expanding world of adventures.",
        genre: "Adventure / Co-op",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/1172620/header.jpg",
        downloadLink: "https://store.steampowered.com/app/1172620/Sea_of_Thieves/"
    },
    {
        title: "Rocket League",
        description: "Rocket League is a high-powered hybrid of arcade-style soccer and vehicular mayhem. Players control rocket-powered cars to hit a giant ball into the opposing team's goal. The game features a deep skill ceiling, competitive ranked modes, and a thriving esports scene.",
        genre: "Sports / Vehicular",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/252950/header.jpg",
        downloadLink: "https://www.rocketleague.com/"
    },
    {
        title: "Fall Guys",
        description: "Fall Guys is a massively multiplayer party game where up to 60 players compete in a series of increasingly chaotic mini-games. Players control jellybean-like characters through obstacle courses, survival challenges, and team games, with the last player standing winning the crown.",
        genre: "Party / Battle Royale",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/1097150/header.jpg",
        downloadLink: "https://www.fallguys.com/"
    },
    {
        title: "Warframe",
        description: "Warframe is a free-to-play co-op action game set in a futuristic sci-fi universe. Players control members of the Tenno, ancient warriors who wield powerful exosuits called Warframes. The game features fast-paced combat, deep customization, and a constantly expanding universe with regular major updates.",
        genre: "Action / Co-op / Free-to-Play",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/230410/header.jpg",
        downloadLink: "https://store.steampowered.com/app/230410/Warframe/"
    },
    {
        title: "Path of Exile",
        description: "Path of Exile is a free-to-play action RPG set in the dark fantasy world of Wraeclast. Players choose from multiple classes and battle through a grim world filled with monsters, dungeons, and powerful bosses. The game is renowned for its incredibly deep passive skill tree and complex crafting systems.",
        genre: "Action RPG / Hack and Slash",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/238960/header.jpg",
        downloadLink: "https://store.steampowered.com/app/238960/Path_of_Exile/"
    },
    {
        title: "Genshin Impact",
        description: "Genshin Impact is a free-to-play open-world action RPG set in the fantasy world of Teyvat. Players control a traveler who explores the world, collects elemental characters, and battles enemies using a dynamic elemental combat system. The game features stunning visuals, a rich story, and regular content updates.",
        genre: "Action RPG / Gacha",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/1971870/header.jpg",
        downloadLink: "https://genshin.hoyoverse.com/"
    },
    {
        title: "Halo Infinite",
        description: "Halo Infinite is a first-person shooter and the sixth mainline entry in the Halo series. Players control Master Chief as he battles the Banished on the ringworld Zeta Halo. The game features an open-world campaign, a grappling hook mechanic, and a free-to-play multiplayer mode.",
        genre: "First-Person Shooter / Sci-Fi",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/1240440/header.jpg",
        downloadLink: "https://store.steampowered.com/app/1240440/Halo_Infinite/"
    },
    {
        title: "Battlefield 2042",
        description: "Battlefield 2042 is a first-person shooter set in the near future. Players battle across massive maps with up to 128 players, using a variety of vehicles, gadgets, and specialist abilities. The game features dynamic weather events, destructible environments, and a range of multiplayer modes.",
        genre: "First-Person Shooter / Military",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/1517290/header.jpg",
        downloadLink: "https://store.steampowered.com/app/1517290/Battlefield_2042/"
    },
    {
        title: "Call of Duty: Modern Warfare III",
        description: "Call of Duty: Modern Warfare III is a first-person shooter featuring a gripping campaign, classic multiplayer maps remastered, and the iconic Zombies mode. Players battle across iconic locations with a massive arsenal of weapons and equipment in one of gaming's most popular franchises.",
        genre: "First-Person Shooter / Military",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/2519060/header.jpg",
        downloadLink: "https://store.steampowered.com/app/2519060/Call_of_Duty_Modern_Warfare_III/"
    },
    {
        title: "Assassin's Creed Odyssey",
        description: "Assassin's Creed Odyssey is an action RPG set in ancient Greece during the Peloponnesian War. Players choose to play as either Alexios or Kassandra, a mercenary descended from the legendary Spartan king Leonidas. The game features a massive open world, naval combat, and deep RPG mechanics.",
        genre: "Action RPG / Historical",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/812140/header.jpg",
        downloadLink: "https://store.steampowered.com/app/812140/Assassins_Creed_Odyssey/"
    },
    {
        title: "Far Cry 6",
        description: "Far Cry 6 is a first-person open-world action game set on the fictional Caribbean island of Yara, ruled by a ruthless dictator. Players join a guerrilla revolution to liberate the island, using a variety of improvised weapons, vehicles, and animal companions in their fight for freedom.",
        genre: "First-Person Shooter / Open World",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/1448420/header.jpg",
        downloadLink: "https://store.steampowered.com/app/1448420/Far_Cry_6/"
    },
    {
        title: "Watch Dogs: Legion",
        description: "Watch Dogs: Legion is an open-world action-adventure game set in a near-future London under authoritarian control. Players build a resistance movement by recruiting any NPC in the city, each with unique skills and backstories. The game features hacking mechanics, stealth, and a fully playable cast of characters.",
        genre: "Action-Adventure / Open World",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/2241780/header.jpg",
        downloadLink: "https://store.steampowered.com/app/2241780/Watch_Dogs_Legion/"
    },
    {
        title: "Hitman 3",
        description: "Hitman 3 is a stealth action game and the conclusion of the World of Assassination trilogy. Players control Agent 47, a professional assassin, as he travels the globe to eliminate high-profile targets. The game features massive sandbox levels with countless ways to complete each mission.",
        genre: "Stealth / Action",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/1659040/header.jpg",
        downloadLink: "https://store.steampowered.com/app/1659040/HITMAN_3/"
    },
    {
        title: "Control",
        description: "Control is a third-person action-adventure game set in a brutalist government building called the Oldest House, which has been taken over by a supernatural threat. Players control Jesse Faden, the new director of the Federal Bureau of Control, as she battles the Hiss using telekinetic powers and a shape-shifting weapon.",
        genre: "Action-Adventure / Supernatural",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/870780/header.jpg",
        downloadLink: "https://store.steampowered.com/app/870780/Control/"
    },
    {
        title: "Outer Wilds",
        description: "Outer Wilds is an open-world mystery game set in a handcrafted solar system trapped in a 22-minute time loop. Players explore planets, uncover ancient alien ruins, and piece together the mystery of a long-dead civilization. The game is celebrated for its sense of wonder and one of gaming's most profound narratives.",
        genre: "Exploration / Mystery",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/753640/header.jpg",
        downloadLink: "https://store.steampowered.com/app/753640/Outer_Wilds/"
    },
    {
        title: "Vampire Survivors",
        description: "Vampire Survivors is a gothic horror casual game with rogue-lite elements. Players choose a character and survive waves of monsters for as long as possible, automatically attacking enemies while collecting experience gems to level up and unlock new weapons and abilities. Simple to learn but deeply addictive.",
        genre: "Roguelite / Casual",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/1794680/header.jpg",
        downloadLink: "https://store.steampowered.com/app/1794680/Vampire_Survivors/"
    },
    {
        title: "Dave the Diver",
        description: "Dave the Diver is a casual adventure game that blends underwater exploration with restaurant management. Players dive into the Blue Hole to catch fish during the day and serve them at a sushi restaurant at night. The game features a charming story, diverse gameplay mechanics, and a colorful cast of characters.",
        genre: "Adventure / Simulation",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/1868140/header.jpg",
        downloadLink: "https://store.steampowered.com/app/1868140/DAVE_THE_DIVER/"
    },
    {
        title: "Baldur's Gate 3",
        description: "Baldur's Gate 3 is a role-playing game set in the Dungeons & Dragons universe. Players create a character and embark on a grand adventure through the Forgotten Realms, making choices that shape the story. The game features turn-based combat, deep character customization, and rich narrative.",
        genre: "CRPG / Turn-Based Strategy",
        imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/header.jpg",
        downloadLink: "https://baldursgate3.game/"
    }
];

// Remove duplicate titles (keep first occurrence)
const uniqueGames = games.filter((game, index, self) =>
    index === self.findIndex(g => g.title === game.title)
);

const seedGames = async () => {
    await connectDB();

    try {
        await Game.deleteMany({});
        console.log("Existing games cleared");

        const inserted = await Game.insertMany(uniqueGames);
        console.log(`${inserted.length} games seeded successfully`);

        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error.message);
        process.exit(1);
    }
};

seedGames();
