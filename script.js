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
        "kangasrousku",
        "kangaspalsamirousku",
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
        "punainen kärpässieni",
        "pulkkosieni",
        "valkoinen kärpässieni",
        "lakritsirousku",
        "suippumyrkkyseitikki",
        "vaaleaorakas",
        "korvasieni",
        "huhtasieni",
        "tuoksuvalmuska",
        "punavyöseitikki"
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
        "hyttynen",
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
        "sokkopaarma",
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
const searchInput = document.getElementById("species-search");
const suggestionsContainer = document.getElementById("suggestions-container");
const categorySelect = document.getElementById("category-select");

let score = 0;
let currentSpecies;
let correctSpecies;
let incorrectlyAnsweredSpecies = []; // Stores species answered incorrectly
let unansweredSpecies = []; // Stores all species not yet answered correctly

function populateCategories() {
    for (const category in speciesData) {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    }
}

function initializeUnansweredSpecies(category = "all") {
    unansweredSpecies = [];
    incorrectlyAnsweredSpecies = []; // Clear incorrectly answered when category changes
    score = 0; // Reset score
    scoreEl.textContent = `Pisteet: ${score}`;

    if (category === "all") {
        for (const cat in speciesData) {
            speciesData[cat].forEach(species => {
                unansweredSpecies.push(species);
            });
        }
    } else {
        speciesData[category].forEach(species => {
            unansweredSpecies.push(species);
        });
    }
    shuffleArray(unansweredSpecies);
}

function startGame() {
    populateCategories();
    initializeUnansweredSpecies();
    nextRound();
    searchInput.addEventListener("input", handleSearchInput);
    imageEl.addEventListener("click", showOptions);
    categorySelect.addEventListener("change", (event) => {
        initializeUnansweredSpecies(event.target.value);
        nextRound();
    });
}

function showOptions() {
    optionsContainerEl.style.display = "flex"; // Show options
}

function nextRound() {
    optionsContainerEl.innerHTML = "";
    optionsContainerEl.style.display = "none"; // Hide options initially
    feedbackEl.textContent = ""; // Clear feedback

    let speciesToAsk;
    let speciesListForOptions = [];

    if (unansweredSpecies.length > 0) {
        // Prioritize new questions
        speciesToAsk = unansweredSpecies.pop();
    } else if (incorrectlyAnsweredSpecies.length > 0) {
        // If all new questions are done, ask incorrectly answered ones
        const randomIndex = Math.floor(Math.random() * incorrectlyAnsweredSpecies.length);
        speciesToAsk = incorrectlyAnsweredSpecies.splice(randomIndex, 1)[0]; // Remove from incorrectly answered
    } else {
        // Game over, all questions answered correctly
        feedbackEl.textContent = "Peli ohi! Kaikki lajit arvattu oikein!";
        feedbackEl.style.color = "#2ecc71";
        return;
    }

    // Find the category for the speciesToAsk to generate options from the same category
    const selectedCategory = categorySelect.value;
    if (selectedCategory === "all") {
        for (const category in speciesData) {
            if (speciesData[category].includes(speciesToAsk)) {
                speciesListForOptions = speciesData[category];
                break;
            }
        }
    } else {
        speciesListForOptions = speciesData[selectedCategory];
    }

    correctSpecies = speciesToAsk;

    imageEl.src = imageUrls[correctSpecies];
    imageEl.alt = correctSpecies;

    const options = [correctSpecies];
    while (options.length < 3) {
        const randomSpecies = speciesListForOptions[Math.floor(Math.random() * speciesListForOptions.length)];
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

function showSpecificSpecies(speciesName) {
    optionsContainerEl.innerHTML = "";
    optionsContainerEl.style.display = "none"; // Hide options initially
    feedbackEl.textContent = "";

    let speciesListForOptions = [];
    const selectedCategory = categorySelect.value;

    if (selectedCategory === "all") {
        for (const category in speciesData) {
            if (speciesData[category].includes(speciesName)) {
                speciesListForOptions = speciesData[category];
                break;
            }
        }
    } else {
        speciesListForOptions = speciesData[selectedCategory];
    }

    if (!speciesListForOptions || !speciesListForOptions.includes(speciesName)) {
        console.error("Species not found in selected category:", speciesName);
        return;
    }

    correctSpecies = speciesName;
    imageEl.src = imageUrls[correctSpecies];
    imageEl.alt = correctSpecies;

    const options = [correctSpecies];
    while (options.length < 3) {
        const randomSpecies = speciesListForOptions[Math.floor(Math.random() * speciesListForOptions.length)];
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

function handleSearchInput() {
    const query = searchInput.value.toLowerCase();
    suggestionsContainer.innerHTML = "";

    if (query.length < 2) {
        return;
    }

    let allSpecies = [];
    const selectedCategory = categorySelect.value;

    if (selectedCategory === "all") {
        allSpecies = Object.values(speciesData).flat();
    } else {
        allSpecies = speciesData[selectedCategory];
    }

    const filteredSpecies = allSpecies.filter(species =>
        species.toLowerCase().startsWith(query)
    );

    filteredSpecies.forEach(species => {
        const suggestionItem = document.createElement("div");
        suggestionItem.classList.add("suggestion-item");
        suggestionItem.textContent = species;
        suggestionItem.addEventListener("click", () => {
            searchInput.value = species;
            suggestionsContainer.innerHTML = "";
            showSpecificSpecies(species);
        });
        suggestionsContainer.appendChild(suggestionItem);
    });
}

function checkAnswer(selectedOption) {
    if (selectedOption === correctSpecies) {
        score++;
        scoreEl.textContent = `Pisteet: ${score}`;
        feedbackEl.textContent = "OIKEIN!";
        feedbackEl.style.color = "#2ecc71"; // Green for correct

        // If answered correctly, ensure it's not in incorrectlyAnsweredSpecies
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