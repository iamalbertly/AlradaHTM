var transDate = new Date();
var todayDate = transDate;

const month = transDate.getMonth(),
    day = transDate.getDate(),
    hour = (transDate.getUTCHours() + 3),
    minute = transDate.getMinutes();

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

var transDateStr = transDate.getDate() + "/" + eval(transDate.getMonth() + 1) + "/" + eval(transDate.getFullYear());
var todayDateStr = transDateStr;

var rgx = new RegExp(`${partOfDay}_${transDateStr}_clr`, "g");
                if (global('ALDSETTING') && rgx.test(global("ALDLOG"))) {
                    var settingsObj = JSON.parse(global('ALDSETTING'));
                } else {
                    fetchProductUpdate(false, false, reLoadSettingsData);
                }

                function fetchProductUpdate(ShowUpdateScreen = true, JustGetDB = false, callback = undefined) {
                    var sndClient = "";
        
                    const params = new URLSearchParams(new URL(AppScriptPostUrl).search);
        
                    params.append('version', settingsObj.date);
                    const geturl = AppScriptPostUrl + "?" + params;
                    var options = {};
                    if (typeof createScene == 'undefined') {
                        /* not in tasker and not localhost*/
                        var finalurl = 'https://cors-proxy3.p.rapidapi.com/api';
                        options = {
                            method: 'POST',
                            headers: {
                                'content-type': 'application/x-www-form-urlencoded',
                                'X-RapidAPI-Key': 'b885eb794emsh79a1af1e8dff803p1c9f71jsnf78274969f09',
                                'X-RapidAPI-Host': 'cors-proxy3.p.rapidapi.com'
                            },
                            body: new URLSearchParams({ 'my-url': geturl })
                        };
                        sndClient = "Web-Proxy";
                    }
                    else { /* inside Tasker*/
                        var finalurl = geturl;
                        options = {
                            method: 'GET',
                            headers: {
                                'content-type': 'application/json',
                                Origin: '*'
                            }
                        };
                        sndClient = "Tasker";
                    }
                    if (ShowUpdateScreen)
                        showLoadingScreen("Fetching updates...", "Tafadhali Subiri.");
                    else
                        show("Fetching updates...");
        
                    fetch(finalurl, options)
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
                            setGlobal("ALDLOG", `${partOfDay}_${transDateStr}_clr:`);
                            settingsObj = data;
                            setGlobal('ALDSETTING', JSON.stringify(settingsObj));
                            loadCachedTrans();
        
                            if (callback)
                                callback();
        
                            if (!JustGetDB)
                                fetchHTMUpdate();
                            show(sndClient + ": Successfully Updated Settings...");
                            goto("command||beep");
                            hideLoadingScreen();
                            clearvalues();
                        })
                        .catch((error) => {
                            if (error.message.includes('Failed to fetch')) {
                                show("Tatizo la Network. Cheki internet alafu Jaribu Tena. " + error.stack, true, true);
                            } else {
                                responseClone.text()
                                    .then(bodyText => {
                                        if (bodyText == "#NAME?") show(" database is busy '#NAME?'");
                                    });
                            }
        
                            hideLoadingScreen();
                            clearvalues();
                            show("Error!\n" + error.stack);
                        });
        
                }
        