// Constants
const APP_STATES = ['wholesale_sale', 'sent2_bank', 'wholesale_purchase_delivered', 'stocktake'];
const APP_STATE_MARKS = ['ӿ', '$', '++', '#'];
const APP_SCRIPT_POST_URL = "https://script.google.com/macros/s/AKfycbz0MTsq8zYg3Fc2sZI9HrsVWLYPhg_BcUbeegi1DwvQ1hnmUT4-ju46CYXNeuahMeZ2/exec";

// Utility Functions
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

const show = (msg, timer = false, clip = true, flash = true) => {
    if (flash) flashLong(msg);
    if (clip) setClip(msg);
    if (timer) setTimeout(() => flashLong(""), timer);
};

const goto = location => window.location.href = location;

const setClip = (content = "", callback) => {
    navigator.clipboard.writeText(content).then(() => {
        if (callback) callback();
    }).catch(err => console.error('Failed to copy text: ', err));
};

// Time Management
const updateTime = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
    });
    document.getElementById('currentTime').textContent = timeString;
};

// Global State Management
const global = (variableName = "", par2 = "") => {
    try {
        return Android.global(variableName, par2);
    } catch (error) {
        return localStorage.getItem(variableName) || "";
    }
};

const getwarehouseName = () => global('ALRADAWAREHOUSE') || 'UNKNOWN';
const getShopDate = () => global('ALRADASHOPDATE') || new Date().toISOString().split('T')[0];

// View Management
const ChangeView = (index = "", e = undefined) => {
    if (e) e.preventDefault();
    const view = document.getElementById('mywebview');
    if (index === "") {
        index = APP_STATES.indexOf(view.className);
        index = (index + 1) % APP_STATES.length;
    }
    view.className = APP_STATES[index];
    document.getElementById('appState').textContent = APP_STATE_MARKS[index];
};

// Transaction Management
const loadCachedTrans = async () => {
    const cachedTransElement = document.getElementById('cachedTrans');
    // ... rest of the function implementation
};

// Event Handlers
const handleEnterEventOnProductInputField = (e, val) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        handleExtraDetailsPopup(val);
    }
};

const handleExtraDetailsPopup = async (val) => {
    return new Promise((resolve) => {
        if (!localStorage.getItem("previousTransDetails")) {
            localStorage.setItem("previousTransDetails", JSON.stringify([]));
        }

        const popup = document.createElement("div");
        popup.id = "extraTransDetailsPopup";
        popup.innerHTML = `
        <div class="modal-content">
            <h3>${currentFocusedProduct}<br><span class="subtitle">Elezeya Malipo ya '${val}'</span></h3>
            <div class="input-container">
                <input id="extraDetailsText" placeholder="Ingiza maelezo ya malipo..." list="previousDetails">
                <div id="autocompleteList" class="autocomplete-items"></div>
            </div>
            <div class="button-group">
                <button class="btn-cancel" id="cancelButton">Ghairi</button>
                <button class="btn-submit" id="submitButton">Wasilisha</button>
            </div>
        </div>
    `;

        document.body.appendChild(popup);

        const input = popup.querySelector("#extraDetailsText");
        const submitButton = popup.querySelector("#submitButton");
        const cancelButton = popup.querySelector("#cancelButton");
        const autocompleteList = popup.querySelector("#autocompleteList");

        const closePopup = (result) => {
            if (result !== null) {
                const query = `${currentFocusedProduct}::${result.trim()}=${val}`;
                updateTempTransaction(query);
            }
            popup.remove();
            resolve(result);
        };

        submitButton.onclick = (e) => {
            e.preventDefault();
            handleSubmission(input, closePopup);
        };
        
        cancelButton.onclick = (e) => {
            e.preventDefault();
            closePopup(null);
        };

        input.addEventListener("keyup", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                handleSubmission(input, closePopup);
            }
        });

        input.addEventListener("input", () => handleAutocomplete(input, autocompleteList));

        input.focus();
    });
};

const handleSubmission = (input, closePopup) => {
    const details = input.value.trim();
    if (!details) {
        alert("Lazima Uingize Aina Ya Malipo");
        return;
    }

    try {
        const previousDetails = JSON.parse(localStorage.getItem("previousTransDetails") || "[]");
        if (!previousDetails.includes(details)) {
            previousDetails.push(details);
            localStorage.setItem("previousTransDetails", JSON.stringify(previousDetails));
        }

        // Only close the popup after successfully saving the details
        closePopup(details);
    } catch (error) {
        console.error('Error handling submission:', error);
        alert("Kuna tatizo. Tafadhali jaribu tena.");
    }
};

const handleAutocomplete = (input, list) => {
    const previousDetails = JSON.parse(localStorage.getItem("previousTransDetails") || "[]");
    const value = input.value.toLowerCase();
    const filteredDetails = previousDetails.filter((detail) => detail.toLowerCase().includes(value));

    list.innerHTML = "";
    list.style.display = value && filteredDetails.length ? "block" : "none";

    filteredDetails.forEach((detail) => {
        const div = document.createElement("div");
        div.style.cssText = "padding: 10px; cursor: pointer;";
        div.textContent = detail;
        div.onclick = () => {
            input.value = detail;
            list.style.display = "none";
        };
        list.appendChild(div);
    });
};

const finalizeQuery = (query) => {
    // ... implementation
};

const updateTempTransaction = (query) => {
    // ... implementation
};

const focusNextProduct = () => {
    // ... implementation
};

// UI Creation
const createList = (products = ProductNamesLiWithInput, holderElement, hasinput = true) => {
    // ... implementation
};

const createProductsView = () => {
    // ... implementation
};

// Initialization
const initializeListeners = () => {
    document.getElementById("warehouseName").innerHTML = getwarehouseName();
    
    // Disable clicks on links
    document.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", (e) => e.preventDefault());
    });
    
    // Initialize time updates (every minute instead of every second)
    updateTime();
    setInterval(updateTime, 60000);
    
    // Add String.prototype.replaceAll polyfill if needed
    if (!String.prototype.replaceAll) {
        String.prototype.replaceAll = function(search, replacement) {
            return this.split(search).join(replacement);
        };
    }
    
    // Initialize other event listeners
    addInputEventListeners();
};

// Start the application
document.addEventListener('DOMContentLoaded', () => {
    try {
        if (global('ALRADAUSER')) {
            initializeListeners();
            onload();
        }
    } catch (error) {
        console.error('Initialization error:', error);
    }
});
