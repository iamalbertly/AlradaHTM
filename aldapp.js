function changeMode(index = "") {
    var oldstate = appStates[currentAppStateIndex];
    if (index == "") {
        currentAppStateIndex++;
    } else currentAppStateIndex = eval(index);

    var appStates_btn = document.querySelector("#appStates");
    appStates_btn.classList.remove(`btn-color-${oldstate}}`);

    document.querySelector("#productsview").className = "";

    var local_appstate = appStates[currentAppStateIndex];
    switch (local_appstate) {
        case "wholesale_sale":
            status_display = "<span>💰</span> MAUZO  &nbsp;";
            break;
        case "sent2_bank":
            status_display = "<span>🤌🏽</span> MALIPO  &nbsp;";
            break;
        case "wholesale_purchase_delivered":
            status_display = "<span>➕</span> UPOKEZI  &nbsp;";
            break;
        case "wholesale_purchase":
            status_display = "<span>💱</span> MANUNUZI  &nbsp;";
            break;
        case "stocktake":
            status_display = "<span>#️⃣</span> STOCK  &nbsp;";
            break;
        default:

    }
    document.querySelector("#mywebview").classList.value = "";
    document.querySelector("#mywebview").classList.add(local_appstate);
    document.querySelector("#productsview").classList.add(local_appstate);
    appStates_btn.classList.add("btn-color-" + local_appstate);
    document.querySelector("#appState").innerHTML = status_display;

    document.querySelector("#submitbutton").innerHTML = status_display + "<label>Peleka</label>";

    document.querySelector("#cachedTrans>div>.part1").innerHTML = ((!cachedTransCount[appStates[currentAppStateIndex]]) ? 0 : cachedTransCount[appStates[currentAppStateIndex]]);
    document.querySelector("#cachedTrans>div>.part2").innerHTML = ((!cachedTransCashTotal[appStates[currentAppStateIndex]]) ? 0 : cachedTransCashTotal[appStates[currentAppStateIndex]].toLocaleString('en-US').replace(/\.00/g, ""));
    clearvalues();
    createProductsView();
    closeFilterDialog();
}

const month = date.getMonth(),
    day = date.getDate(),
    hour = (date.getUTCHours() + 3),
    minute = date.getMinutes();

let partOfDay;

if (hour >= 5 && hour < 12) {
    partOfDay = "Asubuhi";
} else if (hour >= 12 && hour < 18) {
    partOfDay = "Mchana";
} else if (hour >= 18 && hour < 21) {
    partOfDay = "Jioni";
} else {
    partOfDay = "Saa za Kufunga";
}

if (!String.prototype.replaceAll) {
    String.prototype.replaceAll = function (search, replacement) {
        return this.replace(new RegExp(search, 'g'), replacement);
    };
}
function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
}

function show(msg, timer = false, clip = true, flash = true) {
    /* if not in debugger */
    if (window.location.href.indexOf("http://127.0.0.1:3000/") == -1) {
        try {
            if (clip) setClip("show():" + msg, false);
            if (flash) flashLong(msg);
        } catch (e) { }
        if (timer) wait(5000);
    } else {
        console.log("log: " + msg);
    }
}
function goto(location) {
    /* if not in debugger */
    if (window.location.href.indexOf("http://127.0.0.1:3000/") == -1) {
        window.location.href = location;
    } else {
        console.log("goto: " + location);
    }
}

const appStates = ['wholesale_sale', 'sent2_bank', 'wholesale_purchase_delivered', 'stocktake'];
const appStateMarks = ['ӿ', '$', '++', '#'];
let specialTransType = "", extraTransDetails = "",
    BreakException = {},
    isMultTextArray = {},
    products_jsonString = {},
    suppliers_jsonString,
    currentAppStateIndex = 0,
    names = [],
    categories = {},
    ald_lstreply = "",
    writtenInSearch = "",
    editingquery = "",
    staffName = "",
    warehouseName = 'HQ',
    queryLog = "",
    responseClone = "",
    confirmAddReportToCache = function () { },
    confirmSendReportRightAway = function () { },
    confirmFormYes = function () { },
    confirmFormNo = function () { },
    confirmFormEdit = function () { },
    finalResponseMsg = "",
    newlink = "", inputnum = "", iswholesale_purchaseText = "", prefix = "";
var currentFocusedProduct = "", oldFocusedProduct = "",
    cachedTransObjectString = [],
    cachedTransObjectJson = [],
    cachedTransCount = [],
    cachedTransCashTotal = [],
    cachedTempTrans2Process = [],
    cachedTransactionQueries = [],
    results = document.getElementById('results');
function getwarehouseName() {
    warehouseName = prompt("Ingiza Jina la shop", "HQ");
    if (warehouseName != null) {
        document.getElementById("warehouseName").innerHTML = warehouseName;
    } else warehouseName = "HQ";
}
function getShopDate() {
    mydate = prompt("Ingiza Tarehe MFANO: 31/1/2025", document.getElementById("date").innerHTML.replaceAll("&nbsp;", ""));
    if (mydate != null) {
        document.getElementById("date").innerHTML = mydate;
    } else mydate = document.getElementById("date").innerHTML;
}
try {
    if (window.location.href.indexOf("http://127.0.0.1:3000/") == -1) {
        try {
            if (global('ALDSETTING'))
                var settingsObj = JSON.parse(global('ALDSETTING'));
        } catch (e) { }
        loadCachedTrans();
    } else {
        staffName = "Al";
    }

    fetch('alradasettings.json')
        .then(response => {
            responseClone = response.clone();
            if (!response.ok) {
                responseClone.text()
                    .then(function (bodyText) {
                        show("recieved the following: " + bodyText)
                    });
                return response.text().then(text => {
                    throw new Error('Server response: ' + text, true, true);
                });
            }
            return response.json();
        })
        .then(data => {
            settingsObj = data;
            loadCachedTrans();
            createProductsView();
        })
        .catch((error) => { });

    /* if not in debugger */
    if (window.location.href.indexOf("http://127.0.0.1:3000/") == -1) {
        try {
            if (global('ALRADAUSER'))
                staffName = global('ALRADAUSER');
            ald_lstreply = global('ALDLSTREPLY');
        } catch (e) { }
    }
    staffName = (staffName == "") ? "XX" : staffName;
}
catch (e) {
    show("error laoding defaults: " + e.stack,true);
    ald_lstreply = ".* ,mauzo yako yana kadiriya ..... ...... ..... ..... ..... .... ...... ........";
}

function loadCachedTrans() {
    try {
        if (window.location.href.indexOf("http://127.0.0.1:3000/") == -1) {
            try {
                for (const TransType in appStates) {
                    if (global(`ALDCACHE${appStates[TransType]}`)) {
                        cachedTransactionQueries[appStates[TransType]] = global(`ALDCACHE${appStates[TransType]}`);
                        cachedTransCount[appStates[TransType]] = cachedTransactionQueries[appStates[TransType]].split("||").length;
                        queryLog = cachedTransactionQueries[appStates[TransType]];

                        cachedTransObjectString[appStates[TransType]] = GetProductDetails(queryLog);
                        cachedTransObjectJson[appStates[currentAppStateIndex]] = JSON.parse(cachedTransObjectString[appStates[TransType]]);

                        var total = /TOTAL:\sTZS\s(\d+,{0,1}\d+,{0,1}\d+,{0,1}\d+)/gm.exec(cachedTransObjectJson[appStates[currentAppStateIndex]].finalResponseMsg);

                        if (total != null) cachedTransCashTotal[appStates[TransType]] = eval((total.length > 0) ? eval(total[1].replaceAll(",", "")) : 0);
                    } else {
                        cachedTransCount[appStates[TransType]] = 0;
                        cachedTransCashTotal[appStates[TransType]] = 0;
                    }
                }

                document.querySelector("#cachedTrans>div>.part1").innerHTML = cachedTransCount[appStates[0]];
                document.querySelector("#cachedTrans>div>.part2").innerHTML = cachedTransCashTotal[appStates[0]];
                document.querySelectorAll(".hiddenpreview").forEach(el => {
                    el.classList.remove("hiddenpreview");
                    el.classList.add("shownpreview");
                });

            } catch (e) { show(`Error Loading CachedTrans loadCachedTrans(): ${e.stack}`) }
        }
    } catch (e) { show("error loadCachedTrans::" + e.stack,true); }
    clearvalues();
}

function createList(products = names, prefix = "") {
    try {
        results.innerHTML = "";
        products.forEach(productLink => {
            results.innerHTML += productLink;
        });

        document.querySelectorAll("input").forEach(el => {
            el.addEventListener("click", () => el.value = "");
        });

        document.querySelectorAll("a.product").forEach(el => {
            el.addEventListener("click", (e) => {
                document.querySelector("#myinputbar").classList.remove("hyper");
            });
            el.addEventListener("focus", (e) => {
                var nm = e.srcElement.getAttribute("name");
                if (nm != oldFocusedProduct && document.querySelector(`li.product[name='${oldFocusedProduct}']`)) {
                    document.querySelector(`li.product[name='${oldFocusedProduct}']`).classList.remove("hovering");
                }

                currentFocusedProduct = document.querySelector(`li.product[name='${nm}']`);
                if (currentFocusedProduct) {
                    if (document.querySelector("li.product.hovering")) document.querySelector("li.product.hovering").classList.remove("hovering");
                    document.querySelector("#myinputbar").classList.remove("hyper");
                    closeFilterDialog();
                    currentFocusedProduct.classList.add("hovering");
                    document.querySelector("li.product[name='" + nm + "']>a>input").select();
                }
                currentFocusedProduct = nm;
                oldFocusedProduct = nm;
                document.querySelectorAll('a').forEach(el => {
                    el.classList.remove('pressed');
                });
                e.srcElement.classList.add('pressed');

                document.querySelector("#myinputbar").classList.add("hyper");

                const clickedvalue = e.srcElement.getAttribute('name');
                const local_appstate = appStates[currentAppStateIndex];
                const input = document.querySelector(".product.pressed > input:not(.hidden)");
                isMultTextArray[clickedvalue] = input ? input.value : "";

                const num = isMultTextArray[clickedvalue] || "1";
                const newlink = clickedvalue + appStateMarks[currentAppStateIndex] + num;
                document.getElementById("submitbutton").innerHTML = newlink;
                document.getElementById("submitbutton").href = "/" + newlink;

                input.focus();
            });
        });

        document.querySelectorAll(".product > input").forEach(input => {
            input.classList.remove("pressed");
            input.addEventListener('keyup', function (e) {
                var thekey = e.key.toString();
                var clickedvalue = e.srcElement.getAttribute("name");
                if (e.key === 'Enter') {

                    document.getElementById("submitbutton").click();
                    document.getElementById("warehouseName").focus();
                }
            });
        });
    } catch (e) {
        show(e.stack + " -- error creating list");
    }
}

function createProductsView() {
    const localAppState = appStates[currentAppStateIndex];
    if (!settingsObj) return;
    switch (localAppState) {
        case "wholesale_sale":
        case "wholesale_purchase":
        case "wholesale_purchase_delivered":
        case "stocktake": {
            products_jsonString = JSON.parse(settingsObj.settings.alradaitemnames).slice(1);

            products_jsonString.sort((a, b) => {
                /* If b is "Pesa", put a before b */
                if (/Pesa/g.test(b.OfficialName)) return -1;

                /* If a is "Pesa", put b before a */
                if (/Crate Peke|Fungu la Chupa|Pesa/g.test(a.OfficialName)) return 1;

                /* Group closely matching OfficialNames together */
                if (a.OfficialName.includes(b.OfficialName) || b.OfficialName.includes(a.OfficialName)) {
                    return 0;
                }

                if (a.category_breakdown < b.category_breakdown) return 1;
                if (a.category_breakdown > b.category_breakdown) return -1;

                if (b.laststocktakedate - a.laststocktakedate) {
                    return b.laststocktakedate - a.laststocktakedate;
                }

                if (b.theysaylaststocktakeamt - a.theysaylaststocktakeamt) {
                    return b.theysaylaststocktakeamt - a.theysaylaststocktakeamt;
                }

                return 0;
            });

            names = products_jsonString.map(product => {
                const name = product.OfficialName;
                const categorySign = getCategorySign(product.category_breakdown);
                const categoryArr = product.category_breakdown.split("_");
                const cat = categoryArr.join(" ");
                const price = formatPrice(product.w_price_a, product.w_purchase_a);
                return createProductLi(name, name.replaceAll(" ", "_"), cat, price, categorySign, localAppState);
            });
            break;
        }
        case "sent2_bank": {
            suppliers_jsonString = JSON.parse(settingsObj.settings.suppliers).slice(1);
            names = suppliers_jsonString.map(supplier => {
                const name = supplier.officialname;
                const contactName = supplier.contactname;
                return createProductLi(name, name.replaceAll(" ", "_"), "", "", "", localAppState, contactName);
            });
            break;
        }
    }

    hideExistingInputs();
    createList(names, prefix);
    addInputEventListeners();
}

function getCategorySign(categoryBreakdown) {
    let categorySign = "";
    if (/alcohol/.test(categoryBreakdown)) {
        categorySign = "🔞";
    }
    if (/beer/.test(categoryBreakdown)) {
        categorySign = "   🍺 " + categorySign;
    }
    if (/liquar/.test(categoryBreakdown)) {
        categorySign = "  🥃  " + categorySign;
    }
    return categorySign;
}

function formatPrice(saleprice, purchaseprice) {
    if (appStates[currentAppStateIndex] == "wholesale_sale" || appStates[currentAppStateIndex] == "stocktake")
        return saleprice.toString().replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, '$&,');
    else
        return purchaseprice.toString().replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, '$&,');
}

function createProductLi(name, formattedname, category, price, categorySign, localAppState, contactName = "") {
    const inputType = localAppState === "wholesale_sale" ? "inputnumber" : "inputremaining";
    const inputTag = localAppState === "sent2_bank" ? contactName : price + " tsh";
    const inputId = `input${inputType}_${localAppState}_${formattedname}`;
    return `<li class="product active ${category}" data-category="${category}" name="${formattedname}">
        <a class="product ${category}" href="#" name="${formattedname}">
          ${productNameWithContact(name, contactName)}
          <span>${inputTag}<span class="classification">${categorySign}</span></span>
          <input type="number" id="${inputId}" name="${formattedname}" placeholder="#️⃣ Kiasi" value="" class="${inputType}" onClick="event.target.parentNode.dispatchEvent(new Event('focus'))" />
        </a>
      </li>`;
}

function productNameWithContact(name, contactName) {
    return contactName ? `${name} -${contactName}` : name;
}

function hideExistingInputs() {
    const existingInput = document.querySelector("a > input");
    existingInput?.classList.add("hidden");
}

function addInputEventListeners() {
    document.querySelectorAll("#myinputbar> input").forEach(input => {
        input.addEventListener("focus", e => {
            document.querySelector("#myinputbar").classList.add("hyper");
        });
        input.addEventListener("focusout", e => {
            document.querySelector("#myinputbar").classList.remove("hyper");
        });
    });
}

window.onload = function () {
    try {
        initializeListeners();
        createProductsView();
    } catch (e) {
        show(e.stack + "-- error trying to load");
    }
};

function sendCachedTrans(event) {
    var status = "";
    try {
        cachedTransCount[transactionType] = "Tunatuma Repoti";
        cachedTransCashTotal[transactionType] = "Subiri ..";
        document.querySelector("#btnSend2Cache").classList.add("disabled");
        document.querySelector("#btnSend2Cache").disabled = true;
        document.querySelector("#cachedTrans>div>.part1").innerHTML = cachedTransCount[transactionType];
        document.querySelector("#cachedTrans>div>.part2").innerHTML = cachedTransCashTotal[transactionType];

        if (window.location.href.indexOf("http://127.0.0.1:3000/") == -1) {
            status = global(`ALDSNDSTATUS${transactionType}`);
            if (status == "sending") {
                show("Bado Repoti ya Mwisho Haijakamilika kwenda");
                return;
            }
        }

        var transactionType = appStates[currentAppStateIndex];
        if (cachedTransactionQueries[transactionType] == 0) return;
        hideLoadingScreen();
        if (!JSON.parse(cachedTransObjectString[transactionType]).json_response) {
            show("Hujafadhi chochote...");
            return 0;
        };

        var json_response = JSON.parse(cachedTransObjectString[transactionType]).json_response;

        const posturl = "https://script.google.com/macros/s/AKfycbyoyton0-dUELgipTaCiyvqoksDCkbL0Nrj82Ouj05iBoNwN9ydVld0cjpnYBqzuIXW/exec";

        const timestampMilliseconds = (new Date()).getTime();
        const data = json_response.map(entry => [entry.transDate, staffName.slice(0, 2) + " " + entry.transMsg.replace(/\d{1,2}\/\d{1,2}\/\d{4}\s\d{1,2}:\d{1,2}\s/, ""), entry.transWarehouseName]);
        const values = JSON.stringify({ usr: staffName, data: data, time: timestampMilliseconds, cmd: "add_transaction" });
        if (window.location.href.indexOf("http://127.0.0.1:3000/") == -1) {
            setGlobal(`ALDSNDSTATUS${transactionType}`, 'sending');
        }
        const clipboard = document.querySelector("#clipboard");
        clipboard.value = values;
        clipboard.focus();
        navigator.clipboard.writeText(clipboard.value).then(function (x) {
            showLoadingScreen("Tunatuma Repoti...", "<h1>♻️</h1>", "<span class='tunatumaMsg'>" + JSON.parse(cachedTransObjectString[transactionType]).finalResponseMsg.replaceAll(/(\=\s\d+\,{0,}\d+)(\s)/gm, "$1<br/>").replaceAll(/\@\d+\.{0,1}\d{0,}/gm, "").replaceAll(/(TOTAL.*)/gm, "<br/>$1") + "</span>");
        });


        fetch(posturl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: values })
            .then(response => {
                responseClone = response.clone();

                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error('ErrServer response: ' + text, false, true);
                    });
                }
                return response.json();
            })
            .then(data => {
                clearvalues();
                cachedTransObjectString[transactionType] = "";
                cachedTransactionQueries[transactionType] = "";
                cachedTransCount[transactionType] = 0;
                cachedTransCashTotal[transactionType] = 0;
                try {
                    document.querySelector("#btnSend2Cache").classList.remove("disabled");
                    document.querySelector("#btnSend2Cache").disabled = false;
                    document.querySelector("#cachedTrans>div>.part1").innerHTML = cachedTransCount[transactionType];
                    document.querySelector("#cachedTrans>div>.part2").innerHTML = cachedTransCashTotal[transactionType];
                } catch (e) { }
                if (window.location.href.indexOf("http://127.0.0.1:3000/") == -1) { setGlobal(`ALDCACHE${transactionType}`, cachedTransactionQueries[transactionType]); setGlobal(`ALDSNDSTATUS${transactionType}`, 'ready'); }
                try {
                    responseClone.text()
                        .then(bodyText => {
                            show('txtServer responded: ' + bodyText, false, true, false);
                        });
                } catch (e) {
                    show(e.stack + "-there was an error");
                }
                show("Repoti Imetumwa...");
                goto("command||beep");
                createProductsView();

            })
            .catch((error) => {
                if (error.message.includes('Failed to fetch')) {
                    if (window.location.href.indexOf("http://127.0.0.1:3000/") == -1) {
                        setGlobal(`ALDSNDSTATUS${transactionType}`, 'sending_failed');
                    }
                    show("Tatizo la Network. Cheki internet alafu Jaribu Tena. " + error.stack);
                } else {
                    responseClone.text()
                        .then(bodyText => {
                            show('Server responded: ' + bodyText, false, true, false);
                        });
                }
            });

        setTimeout(function () {
            hideLoadingScreen();

        }, 4000);
    }
    catch (e) {
        show(e.stack + "-an error");
    }
}

function handleCachedTransEvent(event) {
    if (!event || !event.target.id) return;
    var target = event.target,
        json_response = JSON.parse(cachedTransObjectString[appStates[currentAppStateIndex]]).json_response,
        id = eval(/_(\d+)/g.exec(target.id)[1]);
    if (json_response[id].transType == "sent2_bank")
        var old_mulitplier = json_response[id].priceTotal;
    else
        var old_mulitplier = (json_response[id].multiplier < 1) ? "." + (json_response[id].transCarton * json_response[id].multiplier) : json_response[id].multiplier;
    editingquery = `${json_response[id].transMsg}`;

    var ConfirmDialogContent = `<div id="myModal">
<div class="editvalues showonlyadmin">
<a href="#" class="notyet" id="edit_date">${json_response[id].transDate}</a>
<a href="#" class="notyet" id="edit_shopname" >${json_response[id].transWarehouseName}</a>
<a href="#" class="" id="edit_drinkname" onclick="reCreateProductSelectDialog()"  placeholder="" value="${json_response[id].rawproductname}">${json_response[id].rawproductname}</a>
<span id="edit_multipliersign">${appStateMarks[currentAppStateIndex]}</span>
<input type="text" id="edit_multiplier"  placeholder="${old_mulitplier}" value="${old_mulitplier}" />
    </div>
<div class="buttonholder" style="display:flex">

<button onclick="confirmFormYes()">🚮 ONDOA KABISA</button>`;

    if (appStates[currentAppStateIndex] == "wholesale_sale") ConfirmDialogContent += `<button onclick="confirmFormEdit('isLoan')">⚠️ DENI</button>`;

    ConfirmDialogContent += `<button onclick="confirmFormEdit()">🛠️ REKEBISHA MPYA</button>
<button onclick="confirmFormNo()">👌🏽 USIBADILISHE</button></div>
</div>
</div>`;
    confirmFormNo = function () {
        hideLoadingScreen();
    };

    confirmFormEdit = function (edit_mode = "default") {
        var mult_sign = appStateMarks[currentAppStateIndex];
        if (edit_mode == "isLoan") mult_sign = '-';

        var newquery = `${document.querySelector("#edit_date").value} (${document.querySelector("#edit_shopname").value})${document.querySelector("#edit_drinkname").innerHTML}${mult_sign}${document.querySelector("#edit_multiplier").value}`;
        var oldquery = cachedTransactionQueries[appStates[currentAppStateIndex]].replaceAll("(plus)", "+");

        queryLog = oldquery.replace(editingquery, newquery).replaceAll(/\.(\d+)$/gm, "p$1").trim();

        productdetails_string = GetProductDetails(queryLog);
        cachedTransObjectString[appStates[currentAppStateIndex]] = productdetails_string;
        cachedTransObjectJson[appStates[currentAppStateIndex]] = JSON.parse(productdetails_string);
        json_response = cachedTransObjectJson[appStates[currentAppStateIndex]].json_response;
        cachedTransactionQueries[appStates[currentAppStateIndex]] = cachedTransObjectJson[appStates[currentAppStateIndex]].finalQuery;
        cachedTransCashTotal[appStates[currentAppStateIndex]] = eval(cachedTransObjectJson[appStates[currentAppStateIndex]].finalResponseTotal);

        var result_display = cachedTransObjectJson[appStates[currentAppStateIndex]].finalResponseMsg;

        if (cachedTempTrans2Process[appStates[currentAppStateIndex]])
            if (cachedTempTrans2Process[appStates[currentAppStateIndex]].length <= 0)
                document.querySelectorAll(".disabled").forEach(el => {
                    el.disabled = false;
                    el.classList.remove("disabled");
                    el.classList.add("enabled");
                });

        if (cachedTransactionQueries[appStates[currentAppStateIndex]])
            if (cachedTransactionQueries[appStates[currentAppStateIndex]].length <= 0)
                document.querySelectorAll(".hiddenpreview").forEach(el => {
                    el.classList.remove("hiddenpreview");
                    el.classList.add("shownpreview");
                });

        document.querySelector("#cachedTrans>div>.part1").innerHTML = cachedTransCount[appStates[currentAppStateIndex]];
        document.querySelector("#cachedTrans>div>.part2").innerHTML = cachedTransCashTotal[appStates[currentAppStateIndex]].toLocaleString('en-US').replace(/\.00/g, "");

        if (window.location.href.indexOf("http://127.0.0.1:3000/") == -1) {
            setGlobal(`ALDCACHE${appStates[currentAppStateIndex]}`, cachedTransactionQueries[appStates[currentAppStateIndex]]);
        }

        reCreateCacheCleanupForm();
    };

    showLoadingScreen(`🗑️ FUTA: <sub>${json_response[id].priceTotal.toLocaleString('en-US').replace(/\.00/g, "")}`, "", ConfirmDialogContent);

    confirmFormYes = function () {
        delete json_response[id];
        queryLog = "";
        for (const resp in json_response) {
            queryLog += `${json_response[resp].transMsg},`;
        }
        productdetails_string = GetProductDetails(queryLog);

        cachedTransObjectString[appStates[currentAppStateIndex]] = productdetails_string; cachedTransObjectJson[appStates[currentAppStateIndex]] = JSON.parse(productdetails_string);

        json_response = cachedTransObjectJson[appStates[currentAppStateIndex]].json_response;

        cachedTransactionQueries[appStates[currentAppStateIndex]] = cachedTransObjectJson[appStates[currentAppStateIndex]].finalQuery;
        cachedTransCashTotal[appStates[currentAppStateIndex]] = eval(cachedTransObjectJson[appStates[currentAppStateIndex]].finalResponseTotal);

        var result_display = cachedTransObjectJson[appStates[currentAppStateIndex]].finalResponseMsg;

        if (cachedTempTrans2Process[appStates[currentAppStateIndex]])
            if (cachedTempTrans2Process[appStates[currentAppStateIndex]].length <= 0)
                document.querySelectorAll(".disabled").forEach(el => {
                    el.disabled = false;
                    el.classList.remove("disabled");
                    el.classList.add("enabled");
                });

        if (cachedTransactionQueries[appStates[currentAppStateIndex]])
            if (cachedTransactionQueries[appStates[currentAppStateIndex]].length <= 0)
                document.querySelectorAll(".hiddenpreview").forEach(el => {
                    el.classList.remove("hiddenpreview");
                    el.classList.add("shownpreview");
                });

        document.querySelector("#cachedTrans>div>.part1").innerHTML = cachedTransCount[appStates[currentAppStateIndex]];
        document.querySelector("#cachedTrans>div>.part2").innerHTML = cachedTransCashTotal[appStates[currentAppStateIndex]].toLocaleString('en-US').replace(/\.00/g, "");

        if (window.location.href.indexOf("http://127.0.0.1:3000/") == -1) {
            setGlobal(`ALDCACHE${appStates[currentAppStateIndex]}`, cachedTransactionQueries[appStates[currentAppStateIndex]]);
        }
        reCreateCacheCleanupForm();
    }
}

function reCreateProductSelectDialog(filter = "") {

    var dialogContent = `<h2 style="margin-bottom:10px">Chagua Product</h2><ul id="results" class="products selectproduct">`;
    for (const i in names) {
        dialogContent += names[i];
    }
    document.querySelector("#filter-dialog").innerHTML = dialogContent;
    document.querySelector("#filter-dialog").classList.remove("hidden");
    document.querySelectorAll("#results.selectproduct>li>a").forEach(el => {
        el.addEventListener("click", () => {
            var selectedproductname = el.name.replace("_", " ");
            document.querySelector("#edit_drinkname").innerHTML = selectedproductname;
            document.querySelector("#filter-dialog").classList.add("hidden");
        });
    });

}

function showLoadingScreen(loadingTitle, loadingSubTitle, loadingMsg) {
    hideLoadingScreen();
    document.getElementById("news_display").style.pointerEvents = "none"; document.getElementById("mywebview2").style.pointerEvents = "none";

    document.getElementById("loading-title").innerHTML = loadingTitle; document.getElementById("loading-subtitle").innerHTML = loadingSubTitle; document.getElementById("loading-text").innerHTML = loadingMsg;

    document.getElementById("loading-screen").classList.remove("hidden");
}
function hideLoadingScreen() {
    document.getElementById("news_display").style.pointerEvents = "";
    document.getElementById("mywebview2").style.pointerEvents = ""; document.getElementById("loading-title").innerHTML = "";
    document.getElementById("loading-subtitle").innerHTML = "";
    document.querySelector("#loading-screen .loading-content .buttonholder").innerHTML = "";
    document.getElementById("loading-text").innerHTML = "...";
    document.getElementById("loading-screen").classList.add("hidden");
}


function reCreateCacheCleanupForm() {
    document.getElementById("news_display").style.pointerEvents = "";
    document.getElementById("mywebview2").style.pointerEvents = "";
    document.getElementById("loading-screen").classList.add("hidden");


    var dialogContent = `<code><ul id="entries">`;
    for (const itemcount in cachedTransObjectJson[appStates[currentAppStateIndex]].json_response) {
        var row = cachedTransObjectJson[appStates[currentAppStateIndex]].json_response[itemcount];
        var displaymultiplier = /((\-\-|\+\+|#|=|\+|ӿ|-|\$)\d{0,}[p]{0,1}\d+)$/g.exec(row.transMsg)[1];
        dialogContent += `<li id="confirmCachedEntry" name="confirmCachedEntry_${itemcount}" >
   <div class="flex-column" >
    <span class="flex-row"><a href="#" id="confirmCachedEntry" name="TransactionEditDate_${itemcount}" title="${row.transDate}" onClick="handleTransEvent(event)">${row.transDate}</a>
    <a href="#" id="confirmCachedEntry" type="Jina La Shop" name="TransactionEditWarehouse_${itemcount}" title="${row.transWarehouseName}" onClick="handleTransEvent(event)">(${row.transWarehouseName})</a></span>
    <div class="flex-row"><div class="flex-row">
    <a href="#" id="confirmCachedEntry" name="TransactionEditDrinkName_${itemcount}" title="${row.rawproductname}" onClick="handleTransEvent(event)">${row.rawproductname}</a>
    <a href="#" id="confirmCachedEntry" name="TransactionEditUnitPrice_${itemcount}" rel="@" type="Kiasi" title="${row.unitprice}" onClick="handleTransEvent(event)">@${row.unitprice}</a>
    <a href="#" id="confirmCachedEntry" name="TransactionEditMultiplier_${itemcount}" title="${displaymultiplier.match(/\d+\.{0,1}\d{0,}/g)[0]}" onClick="handleTransEvent(event)" type="" rel="${appStateMarks[currentAppStateIndex]}">${displaymultiplier}=${row.priceTotal}</a></div>
   <button id="confirmCachedEntry" name="TransactionDelete_${itemcount}" onClick="handleTransEvent(event)">❌</button></div>
   </div></li>`;
    }
    dialogContent += `</ul></code>`;

    document.getElementById("loading-text").innerHTML = dialogContent;
    document.getElementById("loading-screen").classList.remove("hidden");
    document.querySelector("#loading-screen .loading-content .buttonholder").innerHTML = `<button onClick="hideLoadingScreen();clearvalues()" >Subiri</button><button onclick='sendCachedTrans()'>Tuma Repoti</button><button id='btnClose' onClick='hideLoadingScreen();clearvalues()'> X </button>`;
    document.getElementById("loading-title").innerHTML = `Angalia vizuri na Sahihisha ripoti,<br/><sub>kabla ya kutuma. ${JSON.parse(cachedTransObjectString[appStates[currentAppStateIndex]]).finalResponseTotal.toLocaleString('en-US').replace(/\.00/g, "")}</sub>`
}

function initializeListeners() {
    document.querySelector("#resultpad").addEventListener("click", (e) => {
        try {
            if ((document.querySelector("#result_display").innerHTML != "") && (document.querySelector("#filter-dialog").classList.contains("hidden") == false)) { }
            if (document.querySelector("a.product.pressed")) document.querySelector("a.product.pressed").parentNode.classList.remove("hovering");


            hideLoadingScreen();
            document.querySelector("#myinputbar").classList.remove("hyper");
        } catch (e) { show("error loadCachedTrans::" + e.stack,true); }
    });

    document.querySelector("#cachedTrans").addEventListener("click", e => {
        if (!JSON.parse(cachedTransObjectString[appStates[currentAppStateIndex]]).json_response) {
            show("Huja fadhi chochote...");
            return 0;
        }

        reCreateCacheCleanupForm();

    });


    document.querySelector("a.submitbutton").addEventListener("click", e => {
        e.preventDefault();
        try { document.querySelector("a.product.pressed").parentNode.classList.remove("hovering"); } catch (e) { }

        if (currentFocusedProduct)
            try {

                if (currentFocusedProduct == "MATUMIZI_MENGINE") {
                    var originalFocusedProduct = currentFocusedProduct;
                    extraTransDetails = prompt("Elezeya Malipo::", "");
                    if (extraTransDetails == null || extraTransDetails == "") {
                        throw new Error('Lazima Uingize Aina Ya Malipo ');
                    }
                    else { currentFocusedProduct = `${currentFocusedProduct}::${extraTransDetails.trim()}`; }
                    var query = currentFocusedProduct + "=" + document.querySelector(`a[name="${originalFocusedProduct}"]>input`).value;
                } else
                    var query = currentFocusedProduct.replaceAll("_", " ") + appStateMarks[currentAppStateIndex] + document.querySelector(`a[name="${currentFocusedProduct}"]>input`).value;


                if (!/\d+$/.test(query)) {
                    if ((appStates[currentAppStateIndex] == "stocktake"))
                        query += "0";
                    else {
                        if (/Kony|vant|Valu|Hanson/.test(query))
                            query += ".1";
                        else
                            query += "1";
                    }
                }
                if (appStates[currentAppStateIndex] != "stocktake") {
                    var firstpart = (/\d+\.\d+$/.test(query)) ? /(\d+)\.\d+$/.exec(query)[1] : "";
                    var secondpart = /\.\d+$/.test(query) ? /\.(\d+)$/.exec(query)[1] : "";
                    if (firstpart != "" && secondpart != "") {
                        var rg = new RegExp("[\+\+|\-|\+|\#|ӿ]" + firstpart + "." + secondpart, "g");
                        var adding = new RegExp("([\+\+|\-|\+|\#|ӿ])" + firstpart + "." + secondpart, "g").exec(query);
                        var prd = query.replaceAll(rg, "");
                        query = prd + adding[1] + firstpart + "," + prd + adding[1] + "." + secondpart
                    }
                }
                query = `(${warehouseName.toLowerCase()})${query}`;
                date = new Date();

                query = (mydate.replaceAll("&nbsp;", "").trim() + ` ${(date.getHours())}:${date.getMinutes()} ` + query.replaceAll(/\.(\d+)$/gm, "p$1")).trim(); if (appStates[currentAppStateIndex] == "stocktake") {
                    queryLog = queryLog.replaceAll(query + ",", "").concat(`,${query}`);

                } else {
                    queryLog = queryLog.concat((`,${query},`).replace("undefined", "").replace(/\n/, "").trim());
                }

                productdetails_string = GetProductDetails(queryLog.replace(/^,/, ""));
                productdetails_json = JSON.parse(productdetails_string);
                queryLog = productdetails_json.finalQuery;
                document.querySelector("#result_display>ul").innerHTML = productdetails_json.finalResponseMsg.replaceAll("\n", "<br/>");
                document.querySelectorAll(".disabled").forEach(el => {
                    el.disabled = false;
                    el.classList.remove("disabled");
                    el.classList.add("enabled")
                });
                document.querySelector("#submitbuttonholder").classList.remove("hyper");
                document.querySelector("#myinputbar").classList.remove("hyper");

                if (appStates[currentAppStateIndex] == "stocktake") {
                    var el = "li.product[name='" + e.srcElement.pathname.replace("/", "") + "']";
                    document.querySelector(el).classList.add("hidden");
                }
                document.getElementById("warehouseName").focus();
            } catch (e) {
                show(e.stack + " -there was an error" + e);
            }
    });

    document.getElementById('search').addEventListener('input', function () {
        var val = this.value;
        var filteredProducts = names.filter(function (product) {
            return product.toLowerCase().includes(val.toLowerCase());
        });
        createList(filteredProducts, prefix);
        writtenInSearch = this.value;
    });

    document.querySelector("#appState").addEventListener("click", e => {
        clearvalues();
        document.querySelector("#choose-mode").classList.remove("hidden");

        document.querySelectorAll("button").forEach(btn => {
            btn.classList.remove("pressed")
        });

        return false;
    });
    document.querySelector('#inputnumber_change').addEventListener('change', e => {
        var cashcollected = eval(e.srcElement.value);
        var total = /TOTAL:\sTZS\s(\d+,{0,1}\d+,{0,1}\d+,{0,1}\d+)/gm.exec(finalResponseMsg);
        if (total == null) return;
        total = (total.length > 0) ? total[1].replaceAll(",", "") : 0;
        var change = cashcollected - total;
        var currentresults = document.querySelector("#result_display").innerHTML.replace(/<br>----------<br>(.*)/gm, "");
        currentresults = currentresults + "<br/>----------<br/>PAID: " + cashcollected.toString().replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, '$&,') + "<br/>----------<br/>CHANGE: " + change.toString().replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, '$&,') + "<end/>";
        document.querySelector("#result_display").innerHTML = currentresults;
    });


    document.querySelector("#search").addEventListener("focus", (e) => {
        e.srcElement.value = "";
    });

    document.querySelector("#selectmode").addEventListener("click", e => {
        document.querySelector("#choose-mode").classList.add("hidden");
        document.querySelector("#querydialog").classList.remove("hidden");

        document.querySelector("#querydialog>input").focus();

    });        document.querySelector("#querydialog>input").addEventListener('keyup', function (e) {
        var thekey = e.key.toString();
        if (e.key === 'Enter') {

            var query = document.querySelector("#query").value;
            if (query == "") return 0;
            if (appStates[currentAppStateIndex] != "stocktake") {
                var firstpart = (/\d+\.\d+$/.test(query)) ? /(\d+)\.\d+$/.exec(query)[1] : "";
                var secondpart = /\.\d+$/.test(query) ? /\.(\d+)$/.exec(query)[1] : "";
                if (firstpart != "" && secondpart != "") {
                    var rg = new RegExp("[\+\+|\-|\+|\#|ӿ]" + firstpart + "." + secondpart, "g");
                    var adding = new RegExp("([\+\+|\-|\+|\#|ӿ])" + firstpart + "." + secondpart, "g").exec(query);
                    var prd = query.replaceAll(rg, "");
                    query = prd + adding[1] + firstpart + "," + prd + adding[1] + "." + secondpart
                }
            }
            query = `(${warehouseName.toLowerCase()})${query}`;
            date = new Date();

            query = (mydate.replaceAll("&nbsp;", "").trim() + ` ${(date.getHours())}:${date.getMinutes()} ` + query.replaceAll(/\.(\d+)$/gm, "p$1")).trim(); if (appStates[currentAppStateIndex] == "stocktake") {
                queryLog = queryLog.replaceAll(query + ",", "").concat(`,${query}`);

            } else {
                queryLog = queryLog.concat((`,${query},`).replace("undefined", "").replace(/\n/, "").trim());
            }

            productdetails_json = JSON.parse(GetProductDetails(queryLog.replace(/^,/, "")));
            queryLog = productdetails_json.finalQuery;
            document.querySelector("#result_display>ul").innerHTML = productdetails_json.finalResponseMsg.replaceAll("\n", "<br/>");
            document.querySelectorAll(".disabled").forEach(el => {
                el.disabled = false;
                el.classList.remove("disabled");
                el.classList.add("enabled")
            });
            document.querySelector("#submitbuttonholder").classList.remove("hyper");
            document.querySelector("#myinputbar").classList.remove("hyper");

            document.querySelector("#querydialog").classList.add("hidden");

            document.getElementById("warehouseName").focus();

        }

    });    }

function chooseToAddTransactionToCache(event) {

    addTransactionToCache(event);

    reCreateCacheCleanupForm();


}



function addTransactionToCache(event) {
    if (cachedTransCashTotal[appStates[currentAppStateIndex]] == "Subiri ..") return;
    let target = event.target, currentQuery = productdetails_json.finalQuery;

    if (appStates[currentAppStateIndex] == "stocktake") {

        var isclosing = prompt(`Bonyeza ' OKAY ' KAMA NI StockTake yakuFUNGA (CLOSE) MAHESABU ya\n${mydate}\nBonyeza ' CANCEL ' kama ni yakuFUNGUA (OPEN) MAHESABU ${mydate}!`, mydate);
        if (isclosing == null) {
            var newdatetext = mydate.trim();
            currentQuery = currentQuery.replaceAll(/(\d+\/\d+[\/\d+]{0,5})/gm, `${newdatetext}`);
        }
        else if (isclosing.trim().toLocaleLowerCase().match(/\d{1,2}\/\d{1,2}\/.*/gm)) {
            var newdatetext = isclosing;
            currentQuery = currentQuery.replaceAll(/(\d+\/\d+[\/\d+]{0,5})/gm, `${newdatetext}`)

        }
        else if (isclosing.toLowerCase() == "ndio") {
            if (/(\d+\/\d+)[(\/\d+)]{0,5}/gm.exec(currentQuery))
                var datetext = /(\d+\/\d+)[(\/\d+)]{0,5}/gm.exec(currentQuery)[0].trim();

            var dd = eval(/(\d+)\/\d+[(\/\d+)]{0,5}/gm.exec(datetext)[1]) + 1;
            currentQuery = currentQuery.replaceAll(/\d+(\/\d+[(\/\d+)]{0,5})/gm, `${dd}$1`);

        }
    }

    if (cachedTransactionQueries[appStates[currentAppStateIndex]] == undefined) {

        cachedTransactionQueries[appStates[currentAppStateIndex]] = currentQuery;
        cachedTransCount[appStates[currentAppStateIndex]] = 1;
        cachedTransObjectJson[appStates[currentAppStateIndex]] = productdetails_json;
        cachedTransObjectString[appStates[currentAppStateIndex]] = productdetails_string;
        cachedTransCashTotal[appStates[currentAppStateIndex]] = /TOTAL:\sTZS\s(\d+,{0,1}\d+,{0,1}\d+,{0,1}\d+)/gm.exec(productdetails_json.finalResponseMsg);

        if (cachedTransCashTotal[appStates[currentAppStateIndex]])
            cachedTransCashTotal[appStates[currentAppStateIndex]] = (cachedTransCashTotal[appStates[currentAppStateIndex]].length > 0) ? eval(cachedTransCashTotal[appStates[currentAppStateIndex]][1].replaceAll(",", "")) : 0;
        else cachedTransCashTotal[appStates[currentAppStateIndex]] = 0;

    } else {
        cachedTransactionQueries[appStates[currentAppStateIndex]] += ",||" + currentQuery;
        cachedTransCount[appStates[currentAppStateIndex]] = cachedTransactionQueries[appStates[currentAppStateIndex]].split("||").length;

        cachedTransObjectString[appStates[currentAppStateIndex]] = GetProductDetails(cachedTransactionQueries[appStates[currentAppStateIndex]]);

        cachedTransObjectJson[appStates[currentAppStateIndex]] = JSON.parse(cachedTransObjectString[appStates[currentAppStateIndex]]);

        var total = /TOTAL:\sTZS\s(\d+,{0,1}\d+,{0,1}\d+,{0,1}\d+)/gm.exec(cachedTransObjectJson[appStates[currentAppStateIndex]].finalResponseMsg);

        if (total != null) cachedTransCashTotal[appStates[currentAppStateIndex]] = ((total.length > 0) ? eval(total[1].replaceAll(",", "")) : 0);
    }

    document.querySelector("#cachedTrans>div>.part1").innerHTML = cachedTransCount[appStates[currentAppStateIndex]];
    document.querySelector("#cachedTrans>div>.part2").innerHTML = cachedTransCashTotal[appStates[currentAppStateIndex]];

    if (window.location.href.indexOf("http://127.0.0.1:3000/") == -1) {
        for (const TransType in cachedTransactionQueries) {
            var transaction = cachedTransactionQueries[TransType];
            setGlobal(`ALDCACHE${TransType}`, transaction)
        }
    }

    document.querySelectorAll(".hiddenpreview").forEach(el => {
        el.classList.remove("hiddenpreview");
        el.classList.add("shownpreview");
    });
    clearvalues();


}

function createFilterDialogContent() {
    const npsValues = {};
    const runningSpeedRanges = {};
    products_jsonString.forEach(product => {
        const category = product.category_breakdown.split("_")[2].toLowerCase(); if (!categories[category]) {
            categories[category] = [];
        }
        if (!categories[category][product.OfficialName]) {
            categories[category][product.OfficialName] = [];
        }

        categories[category][product.OfficialName].push({
            name: product.OfficialName,
            classes: category.split(".").map(part => part.toLowerCase()).join(" ")
        });

        const financialnps = product.category_breakdown.split("_")[3];
        if (!npsValues[financialnps]) {
            npsValues[financialnps] = [];
        }
        npsValues[financialnps].push(product);

        const speed = (product.category_breakdown.split("_")[4]) ? product.category_breakdown.split("_")[4] : 0;
        if (!runningSpeedRanges[speed]) {
            runningSpeedRanges[speed] = [];
        }
        runningSpeedRanges[speed].push(product);
    });

    const dialogContent = document.createElement("div");
    dialogContent.innerHTML = `
<h3>Vichujio:Aina ya kinywaji</h3>
    <ul>`;
    for (const category in categories) {
        dialogContent.innerHTML += `
  <li onClick="handleFilterDialogFilterSelection(event)">
    <label for="${category}">${category}</label>
    <input type="checkbox" id="category_${category}" >
  </li>`;
    }
    dialogContent.innerHTML += `
  </ul>
    <h4>VipaoMbele NPS</h4>
<input type="range" min="0" max="10" id="financial_nps" value="0">
  `;
    dialogContent.innerHTML += `
  <h4>Kasi ya kukimbia</h4>
<input type="range" id="speed" min="0" max="5"> </div>
 `;
    dialogContent.innerHTML += `
`;

    dialogContent.innerHTML += `<button id="close-dialog" onClick="closeFilterDialog()"> X </button>`;
    return dialogContent;
}


function getRunningSpeedRange(speed) {

    if (speed <= 5) {
        return "Slow";
    } else if (speed <= 10) {
        return "Medium";
    } else {
        return "Fast";
    }
}

function showFilterDialog() {
    const dialog = document.getElementById("filter-dialog");
    if (dialog.children.length === 0) {
        dialog.appendChild(createFilterDialogContent());

        document.querySelectorAll("li.product.active").forEach(product => {
            product.classList.remove("active");
        });
    }
    dialog.classList.remove("hidden");
}

function handleTransEvent(event) {
    var target = event.target,
        action = target.name.split("_"),
        family = target.id;
    id = eval(action[1]),
        action = action[0],
        oldval = target.title,
        type = target.type,
        sign = target.rel,
        dialog = document.querySelector("#filter-dialog"),
        content = "";
    if (family == "confirmCachedEntry") {
        var json_transactions = JSON.parse(cachedTransObjectString[appStates[currentAppStateIndex]]);
    }
    else if (family == "confirmTransactionEntry") {
        var json_transactions = productdetails_json;
    }
    var oldquery = json_transactions.finalQuery,
        editing = `${json_transactions.json_response[id].transMsg}`;

    switch (action) {
        case "TransactionEditDrinkName":
            content = `<h2 style="margin-bottom:10px">Chagua Product</h2><ul id="results" class="products selectproduct">`;
            for (const i in names) {
                content += names[i];
            }
            dialog.innerHTML = content;
            document.querySelectorAll("#results.selectproduct>li>a").forEach(el => {
                el.addEventListener("click", () => {
                    var newval = el.name.replaceAll("_", " "),
                        newediting = editing.replace(oldval, newval).replace(/@\d+\.{0,1}\d{0,}/, ""),
                        newquery = oldquery.replace(editing, newediting),
                        newjson_transactions = JSON.parse(GetProductDetails(newquery));
                    if (family == "confirmCachedEntry") {
                        cachedTransObjectString[appStates[currentAppStateIndex]] = JSON.stringify(newjson_transactions);
                        cachedTransactionQueries[appStates[currentAppStateIndex]] = newjson_transactions.finalQuery;
                        cachedTransCashTotal[appStates[currentAppStateIndex]] = eval(newjson_transactions.finalResponseTotal);

                        if (cachedTempTrans2Process[appStates[currentAppStateIndex]])
                            if (cachedTempTrans2Process[appStates[currentAppStateIndex]].length <= 0)
                                document.querySelectorAll(".disabled").forEach(el => {
                                    el.disabled = false;
                                    el.classList.remove("disabled");
                                    el.classList.add("enabled");
                                });
                        if (cachedTransactionQueries[appStates[currentAppStateIndex]])
                            if (cachedTransactionQueries[appStates[currentAppStateIndex]].length <= 0)
                                document.querySelectorAll(".hiddenpreview").forEach(el => {
                                    el.classList.remove("hiddenpreview");
                                    el.classList.add("shownpreview");
                                });

                        document.querySelector("#cachedTrans>div>.part1").innerHTML = cachedTransCount[appStates[currentAppStateIndex]];
                        document.querySelector("#cachedTrans>div>.part2").innerHTML = cachedTransCashTotal[appStates[currentAppStateIndex]].toLocaleString('en-US').replace(/\.00/g, "");

                        if (window.location.href.indexOf("http://127.0.0.1:3000/") == -1) {
                            setGlobal(`ALDCACHE${appStates[currentAppStateIndex]}`, cachedTransactionQueries[appStates[currentAppStateIndex]]);
                        }
                        reCreateCacheCleanupForm();
                    }
                    else if (family == "confirmTransactionEntry") {
                        productdetails_json = newjson_transactions;
                        document.querySelector("#result_display>ul").innerHTML = productdetails_json.finalResponseMsg.replaceAll("\n", "<br/>");
                        document.querySelectorAll(".disabled").forEach(el => {
                            el.disabled = false;
                            el.classList.remove("disabled");
                            el.classList.add("enabled");
                        });

                        document.querySelector("#submitbuttonholder").classList.remove("hyper");
                        document.querySelector("#myinputbar").classList.remove("hyper");
                        queryLog = productdetails_json.finalQuery;
                    }
                    closeFilterDialog();
                });
            });
            showFilterDialog();
            break;
        case "TransactionEditMultiplier":
        case "TransactionEditUnitPrice":
        case "TransactionEditWarehouse":
            content = `<h3>Ingiza ${type} (${oldval}) </h3><div><input name="" placeholder="${oldval}" type="${(action == "TransactionEditWarehouse") ? `text` : `number`}  " onkeyup="confirmFormEdit(event)"/></div>`;
            dialog.innerHTML = content;
            confirmFormEdit = function (e) {
                if (e.key != "Enter") return;

                var newval = document.querySelector("#filter-dialog>div>input").value;
                var newediting = editing.replace(sign + oldval, sign + newval);
                var newquery = oldquery.replace(editing, newediting);
                var newjson_transactions = JSON.parse(GetProductDetails(newquery));
                if (family == "confirmCachedEntry") {
                    cachedTransObjectJson[appStates[currentAppStateIndex]] = newjson_transactions;
                    cachedTransObjectString[appStates[currentAppStateIndex]] = JSON.stringify(newjson_transactions);
                    cachedTransactionQueries[appStates[currentAppStateIndex]] = newjson_transactions.finalQuery;
                    cachedTransCashTotal[appStates[currentAppStateIndex]] = eval(newjson_transactions.finalResponseTotal);

                    if (cachedTempTrans2Process[appStates[currentAppStateIndex]])
                        if (cachedTempTrans2Process[appStates[currentAppStateIndex]].length <= 0)
                            document.querySelectorAll(".disabled").forEach(el => {
                                el.disabled = false;
                                el.classList.remove("disabled");
                                el.classList.add("enabled");
                            });
                    if (cachedTransactionQueries[appStates[currentAppStateIndex]])
                        if (cachedTransactionQueries[appStates[currentAppStateIndex]].length <= 0)
                            document.querySelectorAll(".hiddenpreview").forEach(el => {
                                el.classList.remove("hiddenpreview");
                                el.classList.add("shownpreview");
                            });

                    document.querySelector("#cachedTrans>div>.part1").innerHTML = cachedTransCount[appStates[currentAppStateIndex]];
                    document.querySelector("#cachedTrans>div>.part2").innerHTML = cachedTransCashTotal[appStates[currentAppStateIndex]].toLocaleString('en-US').replace(/\.00/g, "");

                    if (window.location.href.indexOf("http://127.0.0.1:3000/") == -1) {
                        setGlobal(`ALDCACHE${appStates[currentAppStateIndex]}`, cachedTransactionQueries[appStates[currentAppStateIndex]]);
                    }
                    closeFilterDialog();

                    reCreateCacheCleanupForm();
                } else {
                    document.querySelector("#result_display>ul").innerHTML = newjson_transactions.finalResponseMsg.replaceAll("\n", "<br/>");
                    document.querySelectorAll(".disabled").forEach(el => {
                        el.disabled = false;
                        el.classList.remove("disabled");
                        el.classList.add("enabled");
                    });
                    closeFilterDialog();

                    document.querySelector("#submitbuttonholder").classList.remove("hyper");
                    document.querySelector("#myinputbar").classList.remove("hyper");
                    queryLog = newjson_transactions.finalQuery;
                }
            };
            showFilterDialog();
            break;
        case "TransactionDelete":
            var newquery = oldquery.replace(editing, "").replace(/,$/, "").replace(/^,/, "");
            var newjson_transactions = JSON.parse(GetProductDetails(newquery));
            productdetails_json = newjson_transactions;
            if (family == "confirmTransactionEntry") {
                document.querySelector("#result_display>ul").innerHTML = newjson_transactions.finalResponseMsg.replaceAll("\n", "<br/>");
                document.querySelectorAll(".disabled").forEach(el => {
                    el.disabled = false;
                    el.classList.remove("disabled");
                    el.classList.add("enabled")
                });
                document.querySelector("#submitbuttonholder").classList.remove("hyper");
                document.querySelector("#myinputbar").classList.remove("hyper");
                queryLog = newjson_transactions.finalQuery;
            }
            else if (family = "confirmCachedEntry") {
                cachedTransObjectString[appStates[currentAppStateIndex]] = JSON.stringify(newjson_transactions);
                cachedTransactionQueries[appStates[currentAppStateIndex]] = newjson_transactions.finalQuery;
                cachedTransCashTotal[appStates[currentAppStateIndex]] = eval(newjson_transactions.finalResponseTotal);

                if (cachedTempTrans2Process[appStates[currentAppStateIndex]])
                    if (cachedTempTrans2Process[appStates[currentAppStateIndex]].length <= 0)
                        document.querySelectorAll(".disabled").forEach(el => {
                            el.disabled = false;
                            el.classList.remove("disabled");
                            el.classList.add("enabled");
                        });
                if (cachedTransactionQueries[appStates[currentAppStateIndex]])
                    if (cachedTransactionQueries[appStates[currentAppStateIndex]].length <= 0)
                        document.querySelectorAll(".hiddenpreview").forEach(el => {
                            el.classList.remove("hiddenpreview");
                            el.classList.add("shownpreview");
                        });

                document.querySelector("#cachedTrans>div>.part1").innerHTML = cachedTransCount[appStates[currentAppStateIndex]];
                document.querySelector("#cachedTrans>div>.part2").innerHTML = cachedTransCashTotal[appStates[currentAppStateIndex]].toLocaleString('en-US').replace(/\.00/g, "");

                if (window.location.href.indexOf("http://127.0.0.1:3000/") == -1) {
                    setGlobal(`ALDCACHE${appStates[currentAppStateIndex]}`, cachedTransactionQueries[appStates[currentAppStateIndex]]);
                }
                reCreateCacheCleanupForm();
            }
            break;

        default:
            break;
    }
    createProductsView();

    try { document.querySelector("#filter-dialog>div>input").focus(); } catch (e) { }

}
function handleFilterDialogFilterSelection(event) {
    let target = event.target;
    if (target.localName == "li") {
        target = target.firstElementChild;
    } else if (target.localName == "label") {
        target = target.previousElementSibling;
    }
    if (target.type != "checkbox") return;

    const filterType = target.id;
    const products = document.querySelectorAll("li.product");

    const matchingProducts = [];
    if (filterType.startsWith("category")) {

        const category = filterType.split("_")[1];
        for (const product of products) {

            let checking = product.dataset.category.split(" ")[2];
            if (checking == category) {
                if (product.classList.contains("active")) {
                    product.classList.remove("active");
                    target.checked = false;
                    target.parentNode.classList.remove("selected");
                } else {
                    product.classList.add("active");
                    target.parentNode.classList.add("selected");
                    target.checked = true;
                }
            }
        }
    } else if (filterType === "financial_nps") {
        const financialNps = eval(target.value);
        products.forEach(product => {
            const productNps = eval(product.dataset.financialNps);
            if (productNps >= financialNps) {
                matchingProducts.push(product);
            }
        });
    } else if (filterType === "speed") {

        const speed = eval(target.value);
        products.forEach(product => {
            const productSpeed = eval(product.dataset.speed);
            if (productSpeed >= speed) {
                matchingProducts.push(product);
            }
        });
    }
    closeFilterDialog();
}

function closeFilterDialog() {
    const dialog = document.querySelectorAll(".mypopupdialog").forEach(el => {
        if (!el.classList.contains("hidden"))
            el.classList.add("hidden");
    });    }

function GetProductDetails(query = "(hq)Uhai 600ml @400+1", exactdtail = "", productsJsonString) {
    var response = "", itemcount = 1, projectedProfitTotal = 0;
    query = query.replace(/\(plus\)/gm, "+").replace(/,$/, "").replaceAll(/\|\|/gm, "").replace(/^,/, "").trim();

    if (typeof returntype == 'undefined') var returntype = "single";
    let rowmsg = "";

    if (typeof productsJsonString == 'undefined') {
        if (typeof settingsObj != 'undefined') {
            var productsJsonString = settingsObj.settings.alradaitemnames;
        }
    };
    if (productsJsonString == undefined) throw new Error("productsJsonString is undefined");
    productsJsonString = productsJsonString.replace(/(?:\[r,p]\n|\[r,p]|\n)/g, "<br>").replace(/\sTZS/g, "");

    var data = JSON.parse(productsJsonString);
    var headerRow = Object.keys(data[0]);
    var body = data.map(row => Object.values(row));


    var dataHeadings = [], dataBody = [];
    headerRow.forEach(function (title) {
        dataHeadings.push(title);
    });
    body.forEach(function (res) {
        dataBody.push(res);
    });
    var data = dataBody.map((arr, i) => Object.assign({}, ...dataHeadings.map((head, j) => ({ [head]: arr[j] }))));
    var asjson = JSON.stringify(data);
    var cleanasjson = asjson.replace(/(?:\r\n|\r|\n)/g, "<br>").replace(/\sTZS/g, "");

    if (typeof query !== "string") { query = new String(query); }
    var howmanyitems = query.split(new RegExp("(\\s\\&\\s)|,\\s|,|\\sn\\s")).filter((n) => n);

    let total = 0, remain = "", wholesale_remain = "", retail_remain = "", multiplier = "", rawproductname = "", projectedProfit = 0, responseArr = [];

    howmanyitems.some(function (product, n) {

        var priceTotal = 0, netpriceTotal = 0, pricetype = "",
            unitprice = (/\@\d+/.test(product)) ? eval(product.match(/\@\d+\.{0,1}\d{0,}/)[0].replace("@", "")) : "",
            getendvalue = /(\+{1,2}|\-{1,2}|ӿ|\-|\#)\d{0,}\s{0,1}[r,p]{0,1}\d+\.{0,1}\d{0,}$|[r,p]\d+\.{0,1}\d{0,}$/.test(product) ? /(\+{1,2}|\-{1,2}|ӿ|\-|\#)\d{0,}\s{0,1}[r,p]{0,1}\d+$|[r,p]\d+$/.exec(product)[0] : "",
            myval = getendvalue.match(/[ӿ,\+,\-,\#](\d+)/),
            whole_multiplier = (/[ӿ,\#,\+,\-][r,p]\d+\.{0,1}\d{0,}/.test(product)) ? 0 : (/[ӿ,\+,\-,\#]\d{0,}p{0,1}\d+$/.test(product)) ? eval(getendvalue.match(/[ӿ,\+,\-,\#](\d+\.{0,1}\d{0,})/)[1]) : 1,
            retail_multiplier = 0, transCarton = "";
        var getmultipliers = getendvalue.split(" ");

        getmultipliers = getmultipliers[0];
        if (/(\d+\/\d+)[(\/\d+)]{0,5}/gm.exec(product))
            var datetext = /(\d+\/\d+)[(\/\d+)]{0,5}/gm.exec(product)[0].trim();
        else { datetext = ALRADADATE }
        if (/\d+\/\d+[\/\d+]{0,5}\s(.*)\(/gm.exec(product))
            var timetext = /\d+\/\d+[\/\d+]{0,5}\s(.*)\(/gm.exec(product)[1].trim();
        else var timetext = "00:00";
        rawproductname = product.replace(/(\d+\/\d+)[(\/\d+)]{0,5}/gm, "").replace(/(\d+ +[r,p] +|^[r,p] +|^\d+ +|^\d+|[ӿ,\+,\$]\d+$)/g, "").replace(/#\d{0,}[r,p]{0,1}\d+|\#\d+$|[\+,\$]\d+|[\-\-,\+\+]/, "").replace(/\#\d+/, "").replace(/@\d+\.{0,1}\d{0,}/g, "").replace(/^t +| +0 +/, "").replace(/^[r,p] +|\s[r,p]\d+\.{0,1}\d{0,}$/g, "").replace(/^.*(\(.*)/g, "$1").trim();
        rawproductname = rawproductname.replace(/^[r,p] +/g, "").replace(/\s#\d+|ӿp{0,1}\d+\.{0,1}\d{0,}/, "");
        rawproductname = rawproductname.replace(/\s[r,p]\d+\.{0,1}\d{0,}|\+[r,p]\d+\.{0,1}\d{0,}v$/, "");
        rawproductname = rawproductname.replace(/=\d+\.{0,1}\d{0,}|[r,p]\d+\.{0,1}\d{0,}$/, "").replace(/^\(.*\)/, "").replace(/\+$/, "").trim();

        if (!/\$\d+$/.test(product)) {
            if (pricetype == "" || pricetype == undefined)
                pricetype = (/\=\d|\+\+/g.test(product.trim())) ? "purchase" : /(\d\s[r,p]\s)|(\s[r,p]\s)|(^r\s)|([r,p]\d+$)/g.test(product.trim().toLowerCase())
                    ? "retail"
                    : "wholesale";
            try {
                if (/\=\d+/g.test(product)) {
                    unitprice = 1;
                    priceTotal = eval(/\=(\d+)/g.exec(product)[1]),
                        displaymultiplier = priceTotal;
                }
                else
                    JSON.parse(cleanasjson).some(function (item, i) {

                        if (new RegExp(rawproductname.toLowerCase()).test(item.DrinkName.toLowerCase())) {
                            transCarton = item.carton;

                            if (getendvalue.match(/\#/)) {
                                w_remain = (/\#\d+/g.test(getendvalue)) ? eval(getendvalue.match(/\#\d+/)[0].replace("#", "")) : 0;
                                r_remain = (!/[r,p]\d+/g.test(getendvalue)) ? "" : eval(/[r,p](\d+)/g.exec(getendvalue)[1]) / item.carton;
                                remain = w_remain + r_remain;
                            }

                            retail_multiplier = (getendvalue.indexOf("p") == -1) ? 0 : eval(getendvalue.match(/[r,p]\d+/)[0].replace("p", ""));
                            multiplier = whole_multiplier + (retail_multiplier / item.carton);

                            if ((appStates[currentAppStateIndex] == "wholesale_purchase_delivered") || (appStates[currentAppStateIndex] == "stocktake")) {
                                var profitfromwholesale = ((item.w_price_a * whole_multiplier) - ((item.w_purchase_a * whole_multiplier)));
                                var profitfromretail = ((item.p_price_a * retail_multiplier) - (((item.w_purchase_a / item.carton) * retail_multiplier)));
                                projectedProfit = ((item.w_price_a * whole_multiplier) - ((item.w_purchase_a * whole_multiplier))) + profitfromretail;
                            }
                            if (unitprice == "") {
                                if (pricetype == "purchase") {
                                    if (whole_multiplier)
                                        unitprice = item.w_purchase_a,
                                            priceTotal += item.w_purchase_a * whole_multiplier;
                                    if (retail_multiplier)
                                        unitprice = Math.round((((unitprice == "") ? (item.w_purchase_a + item.p_purchasemarkup_a) : unitprice) / item.carton) * 100) / 100,
                                            priceTotal += unitprice * retail_multiplier;

                                }
                                else {
                                    if (whole_multiplier || whole_multiplier == 0)
                                        unitprice = item.w_price_a,
                                            priceTotal += item.w_price_a * whole_multiplier;

                                    if (retail_multiplier)
                                        unitprice = ((unitprice == "") ? item.w_price_a : unitprice) / item.carton,
                                            priceTotal += unitprice * retail_multiplier;

                                }
                                product = product.replace(new RegExp(`(${getendvalue.replaceAll(/(\+)/gm, "\\$1")})`), `@${unitprice}$1`);
                            } else {
                                if (whole_multiplier)
                                    priceTotal = unitprice * whole_multiplier;
                                if (retail_multiplier)
                                    priceTotal += unitprice * retail_multiplier;
                                product = product.replace(new RegExp(`(\@\d+\.{0,1}\d{0,})`), `@${unitprice}`);
                            }

                            throw BreakException;
                        }
                    });
            } catch (e) {
                if (e !== BreakException) throw e;
            }
            var realitemcount = itemcount - 1;

            var realeditmultipliersign = (displaymultiplier == undefined) ? "=" : displaymultiplier;
            var displaymultiplier = ((whole_multiplier > 0) ? whole_multiplier : 0) + ((retail_multiplier > 0) ? `p${retail_multiplier}` : "");

            rowmsg = rowmsg + datetext + "::" + product.replace(/^\d+/g, '').trim() + "::" + multiplier + "÷÷";

            total = total + parseFloat(priceTotal);

            projectedProfitTotal += parseFloat(projectedProfit);
            if (priceTotal == "") {
                priceTotal = (priceTotal == "") ? ((/.*=\d+/.test(rawproductname)) ? rawproductname.match(/\d+$/)[0] : 0) : 0;
            }

            let transDate = `${datetext} ${timetext}`,
                transMsg = product;
            transUnitPrice = unitprice,
                transWarehouseName = /\((.*)\)/gm.test(product) ? /\((.*)\)/gm.exec(product)[1].toLowerCase() : warehouseName.toLowerCase(),
                transStaffID = staffName.slice(0, 2),
                transType = (specialTransType == "") ? appStates[currentAppStateIndex] : specialTransType;
            getendvalue = (getendvalue) ? getendvalue : "";


            response = `${response} <li id="confirmTransactionEntry" name="confirmTransactionEntry_${realitemcount}" >`;
            response += `<div class="flex-row"><div class="flex-row"><small>${itemcount}.</small><a id="confirmTransactionEntry" href="#" name="TransactionEditDrinkName_${realitemcount}" title="${rawproductname}" onClick="handleTransEvent(event)" > ${rawproductname} </a>`;
            response += `<a id="confirmTransactionEntry" href="#" name="TransactionEditUnitPrice_${realitemcount}" rel="@" type="Kiasi" title="${unitprice}" onClick="handleTransEvent(event)"> @${unitprice}</a>`;
            response += `<a id="confirmTransactionEntry" href="#" name="TransactionEditMultiplier_${realitemcount}" rel="${appStateMarks[currentAppStateIndex]}" title="${displaymultiplier}" onClick="handleTransEvent(event)">${appStateMarks[currentAppStateIndex]}${displaymultiplier} = ${priceTotal.toLocaleString('en-US').replace(/\.00/g, "").trim()} </a>`;
            response += `<small><a id="confirmTransactionEntry" href="#" name="TransactionEditWarehouse_${realitemcount}" title="${transWarehouseName}" type="Jina La Shop" onClick="handleTransEvent(event)">&nbsp;${(transWarehouseName != "hq") ? transWarehouseName : "&nbsp;"}</a></small></div>`;
            response += `<div class="buttonholder flex-row"><button id="confirmTransactionEntry" name="TransactionDelete_${realitemcount}" onClick="handleTransEvent(event)">❌</button></div></div></li>`;

            responseArr.push({ transDate, transWarehouseName, transMsg, getendvalue, rawproductname, transUnitPrice, transStaffID, transType, rawproductname, remain, multiplier, transCarton, unitprice, priceTotal, netpriceTotal });
            itemcount++;
            unitprice = "";

        }
        if ((responseArr.length == 0) || (/\$\d+$/.test(product))) {
            remain = (/\#\d+/.test(product)) ? parseFloat(product.match(/\#\d+/)[0].replace("#", "")) : 0;
            unitprice = 1;
            var rx = new RegExp("\\" + appStateMarks[currentAppStateIndex] + "\\d+");

            multiplier = (rx.test(product)) ? parseFloat(product.match(rx)[0].replace(appStateMarks[currentAppStateIndex], "")) : 1;
            priceTotal = (/\=\d+/.test(product)) ? parseFloat(product.match(/\=\d+/)[0].replace("=", "")) * -1 : multiplier * unitprice;
            netpriceTotal = 0;

            total = total + priceTotal;
            response = (response + ((rawproductname == "") ? rawproductname : rawproductname) + ((unitprice > 0 && unitprice != "" && unitprice != 1) ? "@" + unitprice : "") + " | " + priceTotal.toLocaleString('en-US').replace(/\.00/g, "")).trim() + "\n";
            date = new Date();
            let transDate = `${datetext} ${timetext}`,
                transMsg = product;
            transUnitPrice = unitprice,
                transStaffID = staffName.slice(0, 2),
                transType = (specialTransType == "") ? appStates[currentAppStateIndex] : specialTransType,
                transWarehouseName = /\((.*)\)/gm.test(product) ? /\((.*)\)/gm.exec(product)[1].toLowerCase() : warehouseName.toLowerCase(),
                transCarton = 0;
            getendvalue = (getendvalue) ? getendvalue : "";
            responseArr.push({ transDate, transWarehouseName, transMsg, rawproductname, getendvalue, transUnitPrice, transStaffID, transType, transWarehouseName, remain, multiplier, transCarton, unitprice, priceTotal, netpriceTotal });
        }

        try {
            var sele = 'li.product[name=\"' + rawproductname.replaceAll(" ", "_") + '\"]';
            document.querySelector(sele).classList.add("processed");
        } catch (e) { }
    });

    finalResponseMsg = `${response}\n<li class="total">TOTAL: ` + total.toLocaleString('en-US', {
        style: 'currency',
        currency: 'tzs'
    }).replace(/\.00/g, "") + " " + ((projectedProfitTotal == "") ? "\n" : ` <small>&nbsp;(prf: ${projectedProfitTotal.toLocaleString('en-US').replace(/\.00/g, "")})</small>  </li>\n`);

    var newquery = "";
    for (const val in responseArr) {
        newquery += `,${responseArr[val].transMsg}`;
    }
    newquery = newquery.replace(/^,/, "");
    return JSON.stringify({ json_response: responseArr, finalResponseMsg: finalResponseMsg, finalResponseTotal: total, finalQuery: newquery });
}

function clearvalues() {
    document.title = "Alrada Duka";
    document.querySelector("#search").value = "";
    document.querySelector("#result_display>ul").innerHTML = "";
    document.querySelectorAll(".enabled").forEach(el => {
        el.disabled = false;
        el.classList.remove("enabled");
        el.classList.add("disabled");
    });
    document.querySelector("#warehouseName").innerHTML = "HQ";
    document.querySelectorAll("#results>li.product.active").forEach(product => {
        product.classList.remove("processed");
    });

    productdetails_string = "",
        productdetails_json = [],
        query = "", queryLog = "",
        href = "undefined+",
        sign_mult = "",
        sign_wholesale_remain = "",
        sign_retail_remain = "",
        newlink = "",
        prefix = "", iswholesale_purchaseText = "", ismult_text = "", iswholesale_purchase = false, isstock = false;
    document.querySelector("a.submitbutton").href = "";
    document.querySelector("a.submitbutton").innerHTML = "PELEKA";
    document.querySelector("a.submitbutton").classList.remove('btn-color-wholesale_sale');

    closeFilterDialog();
}
document.querySelector("#warehouseName").innerHTML = warehouseName;
/* if in debugger */
if (window.location.href.indexOf("http://127.0.0.1:3000/") == -1)
    document.querySelector("a").addEventListener("click", (e) => {
        e.preventDefault();
    });

try {
    var ALRADADATE = day + " / " + month;
} catch (e) {

}