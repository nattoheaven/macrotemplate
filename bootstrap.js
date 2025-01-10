/*
 * Macro Template
 *
 * Copyright (C) 2013 - 2025  NISHIMURA Ryohei
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// source: https://weeknumber.net/how-to/javascript
Date.prototype.getWeek = function() {
    var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
                           - 3 + (week1.getDay() + 6) % 7) / 7);
}

//returns the relative day in the week of date d
//based on: https://stackoverflow.com/a/62899412/704329
// d - some date
// dy - day of week to calculate date
//    1 - return date of Monday of the week of d
//    2 - return date of Tuesday of the week of d
//    ...
//    7 - date of Sunday 
function getRelativeDayInWeek(d, dy) {
    d = new Date(d);
    var day = d.getDay();
    if (day == 0) { 
        day = 7; 
    }
    var diff = d.getDate() + dy - day;
    return new Date(d.setDate(diff));
}


browser.tabs.onCreated.addListener(async (tab) => {
    var replaceMacros = function(s, date) {
        var padZero = function(x, n) {
            var padZeroSub = function(s, i) {
                if (i <= 0) {
                    return s;
                } else {
                    return padZeroSub("0" + s, i - 1);
                }
            };
            var s = x.toString();
            return padZeroSub(s, n - s.length);
        };
        var getLocale = function(p1, p2) {
            if (typeof p1 === "undefined") {
                return "en-US";
            } else if (p2 === "") {
                return browser.i18n.getUILanguage();
            } else {
                return p2;
            }
        };
        var getLocale2 = function(p1, p2) {
            if (typeof p1 === "undefined") {
                return undefined;
            } else if (p2 === "") {
                return browser.i18n.getUILanguage();
            } else {
                return p2;
            }
        };
        var regexs = [
            [ /{{{y({([^}]*)})?}}}/g, function(match, p1, p2, offset, string, groups) {
                return date.toLocaleDateString(getLocale(p1, p2), { year: 'numeric' });
            } ],
            [ /{{{yyyy(\+(\d))?({([^}]*)})?}}}/g, function(match, p1, p2, p3, p4, offset, string, groups) {
                debugger;
                if (typeof p1 === "undefined") {
                    return padZero(date.toLocaleDateString(getLocale(p3, p4), { year: 'numeric' }), 4);
                } else {
                    return date.getFullYear() + Number(p2);
                }
            } ],
            [ /{{{M({([^}]*)})?}}}/g, function(match, p1, p2, offset, string, groups) {
                return date.toLocaleDateString(getLocale(p1, p2), { month: 'numeric' });
            } ],
            [ /{{{MM({([^}]*)})?}}}/g, function(match, p1, p2, offset, string, groups) {
                return date.toLocaleDateString(getLocale(p1, p2), { month: '2-digit' });
            } ],
            [ /{{{MMM({([^}]*)})?}}}/g, function(match, p1, p2, offset, string, groups) {
                return date.toLocaleDateString(getLocale(p1, p2), { month: 'short' });
            } ],
            [ /{{{MMMM({([^}]*)})?}}}/g, function(match, p1, p2, offset, string, groups) {
                return date.toLocaleDateString(getLocale(p1, p2), { month: 'long' });
            } ],
            [ /{{{d({([^}]*)})?}}}/g, function(match, p1, p2, offset, string, groups) {
                return date.toLocaleDateString(getLocale(p1, p2), { day: 'numeric' });
            } ],
            [ /{{{dd({([^}]*)})?}}}/g, function(match, p1, p2, offset, string, groups) {
                return date.toLocaleDateString(getLocale(p1, p2), { day: '2-digit' });
            } ],
            [ /{{{E({([^}]*)})?}}}/g, function(match, p1, p2, offset, string, groups) {
                return date.toLocaleDateString(getLocale(p1, p2), { weekday: 'long' });
            } ],
            [ /{{{EEE({([^}]*)})?}}}/g, function(match, p1, p2, offset, string, groups) {
                return date.toLocaleDateString(getLocale(p1, p2), { weekday: 'short' });
            } ],
            [ /{{{H({([^}]*)})?}}}/g, function(match, p1, p2, offset, string, groups) {
                return date.toLocaleTimeString(getLocale(p1, p2), { hour12: false, hour: 'numeric' });
            } ],
            [ /{{{HH({([^}]*)})?}}}/g, function(match, p1, p2, offset, string, groups) {
                return date.toLocaleTimeString(getLocale(p1, p2), { hour12: false, hour: '2-digit' });
            } ],
            [ /{{{m({([^}]*)})?}}}/g, function(match, p1, p2, offset, string, groups) {
                return date.toLocaleTimeString(getLocale(p1, p2), { minute: 'numeric' });
            } ],
            [ /{{{mm({([^}]*)})?}}}/g, function(match, p1, p2, offset, string, groups) {
                return date.toLocaleTimeString(getLocale(p1, p2), { minute: '2-digit' });
            } ],
            [ /{{{s({([^}]*)})?}}}/g, function(match, p1, p2, offset, string, groups) {
                return date.toLocaleTimeString(getLocale(p1, p2), { second: 'numeric' });
            } ],
            [ /{{{ss({([^}]*)})?}}}/g, function(match, p1, p2, offset, string, groups) {
                return date.toLocaleTimeString(getLocale(p1, p2), { second: '2-digit' });
            } ],
            [ /{{{w({([^}]*)})?}}}/g, function(match, p1, p2, offset, string, groups) {
                return date.getWeek().toString();
            } ],
            [ /{{{w1({([^}]*)})?}}}/g, function(match, p1, p2, offset, string, groups) {
                monday = getRelativeDayInWeek(date, 1);
                return monday.toLocaleDateString(getLocale2(p1, p2), {month: '2-digit', day: '2-digit'});
            } ],
            [ /{{{w5({([^}]*)})?}}}/g, function(match, p1, p2, offset, string, groups) {
                friday = getRelativeDayInWeek(date, 5);
                return friday.toLocaleDateString(getLocale2(p1, p2), {month: '2-digit', day: '2-digit'});
            } ],
        ];
        for (var i = 0; i < regexs.length; ++i) {
            s = s.replace(regexs[i][0], regexs[i][1]);
        }
        return s;
    };
    // Sleep for a second to wait for all of the fields filled.
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Call getComposeDetails twice.
    // Hack for the problem that details of replies cannot be got correctly.
    await browser.compose.getComposeDetails(tab.id);
    let details = await browser.compose.getComposeDetails(tab.id);
    if (details) {
        let date = new Date();
        let oldSubject = details.subject;
        let newSubject = replaceMacros(oldSubject, date);
        if (details.isPlainText) {
            let oldBody = details.plainTextBody;
            let newBody = replaceMacros(oldBody, date);
            if (oldSubject != newSubject || oldBody != newBody) {
                browser.compose.setComposeDetails(tab.id, { plainTextBody: newBody, subject: newSubject });
            }
        } else {
            let oldBody = details.body;
            let newBody = replaceMacros(oldBody, date);
            if (oldSubject != newSubject || oldBody != newBody) {
                browser.compose.setComposeDetails(tab.id, { body: newBody, subject: newSubject });
            }
        }
    }
});
console.log("macrotemplate loaded")
