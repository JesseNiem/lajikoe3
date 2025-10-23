
const speciesData = {
    "Sammalet": [
        "karhunsammal",
        "rahkasammal",
        "metsäkerrossammal",
        "sulkasammal",
        "kynsisammal",
        "seinäsammal"
    ],
    "Sienet": [
        "herkkutatti",
        "kangastatti",
        "punikkitatit",
        "voitatti",
        "haaparousku",
        "kangaspalsamirousku",
        "kangasrousku",
        "karvarousku",
        "leppärousku",
        "isohapero",
        "kangashapero",
        "keltahapero",
        "viinihapero",
        "mustavahakas",
        "kehnäsieni",
        "mesisienet",
        "keltavahvero",
        "suppilovahvero",
        "mustatorvisieni",
        "lampaankääpä",
        "vaaleaorakas",
        "korvasieni",
        "huhtasieni",
        "tuoksuvalmuska l. matsutake",
        "punavyöseitikki",
        "punainen kärpässieni",
        "pulkkosieni",
        "valkoinen kärpässieni",
        "lakritsirousku",
        "suippumyrkkyseitikki"
    ],
    "Käävät": [
        "pakurikääpä",
        "taulakääpä",
        "pökkelökääpä",
        "kantokääpä",
        "arinakääpä"
    ],
    "Jäkälät": [
        "naava",
        "luppo",
        "isohirvenjäkälä",
        "sormipaisukarve",
        "pilkkunahkajäkälä",
        "poronjäkälät"
    ],
    "kalat ja ympyräsuiset": [
        "ahven",
        "ankerias",
        "harjus",
        "hauki",
        "kiiski",
        "kirjoeväsimppu",
        "kirjolohi",
        "kolmipiikki",
        "kuha",
        "kymmenpiikki",
        "lahna",
        "lohi",
        "made",
        "muikku",
        "mutu",
        "nahkiainen",
        "rautu",
        "salakka",
        "siika",
        "säyne",
        "silakka",
        "särki",
        "taimen"
    ],
    "Matelijat ja sammakkoeläimet": [
        "kyykäärme",
        "rantakäärme",
        "sisilisko",
        "vaskitsa",
        "rupikonna",
        "sammakko"
    ],
    "Niveljalkaiset": [
        "ampiainen",
        "heinäsirkka",
        "hepokatti",
        "hirvikärpänen",
        "huonekärpänen",
        "hyttynen (sääski)",
        "hämähäkki",
        "suruvaippa",
        "kimalainen",
        "sinisiipi",
        "koskikorento",
        "maakiitäjäinen",
        "marjalude",
        "mehiläinen",
        "metsäsittiäinen",
        "metsätorakka",
        "muurahainen",
        "mäkäräinen",
        "neidonkorento",
        "polttiainen",
        "punkki",
        "päiväkorento",
        "raatokärpänen",
        "sarvijaakko",
        "sokkopaarmo",
        "sudenkorento",
        "suppupaarma",
        "surviaissääski",
        "tukkimiehentäi",
        "turkkilo",
        "vesiperhonen",
        "ritariperhonen"
    ]
};

const scoreEl = document.getElementById("score");
const imageEl = document.getElementById("species-image");
const optionsContainerEl = document.getElementById("options-container");
const feedbackEl = document.getElementById("feedback");

let score = 0;
let currentSpecies;
let correctSpecies;
let incorrectlyAnsweredSpecies = []; // New array to store incorrectly answered species

function startGame() {
    nextRound();
}

function nextRound() {
    optionsContainerEl.innerHTML = "";
    feedbackEl.textContent = ""; // Clear feedback

    let speciesToAsk;

    // Decide whether to re-ask an incorrectly answered species or pick a new one
    if (incorrectlyAnsweredSpecies.length > 0 && Math.random() < 0.3) { // 30% chance to re-ask
        const randomIndex = Math.floor(Math.random() * incorrectlyAnsweredSpecies.length);
        speciesToAsk = incorrectlyAnsweredSpecies[randomIndex];
        // Find the category for the speciesToAsk
        for (const category in speciesData) {
            if (speciesData[category].includes(speciesToAsk)) {
                currentSpecies = speciesData[category];
                break;
            }
        }
    } else {
        const categories = Object.keys(speciesData);
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        currentSpecies = speciesData[randomCategory];
        speciesToAsk = currentSpecies[Math.floor(Math.random() * currentSpecies.length)];
    }

    correctSpecies = speciesToAsk;

    imageEl.src = imageUrls[correctSpecies];
    imageEl.alt = correctSpecies;

    const options = [correctSpecies];
    while (options.length < 3) {
        const randomSpecies = currentSpecies[Math.floor(Math.random() * currentSpecies.length)];
        if (!options.includes(randomSpecies)) {
            options.push(randomSpecies);
        }
    }

    shuffleArray(options);

    options.forEach(option => {
        const button = document.createElement("button");
        button.textContent = option;
        button.classList.add("option");
        button.addEventListener("click", () => checkAnswer(option));
        optionsContainerEl.appendChild(button);
    });
}

function checkAnswer(selectedOption) {
    if (selectedOption === correctSpecies) {
        score++;
        scoreEl.textContent = `Pisteet: ${score}`;
        feedbackEl.textContent = "OIKEIN!";
        feedbackEl.style.color = "#2ecc71"; // Green for correct

        // If answered correctly, remove from incorrectlyAnsweredSpecies if it was there
        const index = incorrectlyAnsweredSpecies.indexOf(correctSpecies);
        if (index > -1) {
            incorrectlyAnsweredSpecies.splice(index, 1);
        }

    } else {
        feedbackEl.textContent = `VÄÄRIN! Oikea vastaus: ${correctSpecies}`;
        feedbackEl.style.color = "#e74c3c"; // Red for incorrect

        // Add to incorrectlyAnsweredSpecies if not already present
        if (!incorrectlyAnsweredSpecies.includes(correctSpecies)) {
            incorrectlyAnsweredSpecies.push(correctSpecies);
        }
    }
    // Disable options after an answer is selected
    Array.from(optionsContainerEl.children).forEach(button => button.disabled = true);

    setTimeout(() => {
        nextRound();
    }, 1500); // 1.5 second delay before next round
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

startGame();
