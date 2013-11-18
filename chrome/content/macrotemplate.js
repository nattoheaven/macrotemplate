/*
 * Macro Template
 *
 * Copyright (C) 2013  NISHIMURA Ryohei
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
(function () {
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
    var regexs = [
        [ /{{{yyyy}}}/g, function(date) {
            return padZero(date.getFullYear(), 4);
        } ],
        [ /{{{MM}}}/g, function(date) {
            return padZero(date.getMonth() + 1, 2);
        } ],
        [ /{{{MMM}}}/g, function(date) {
            return ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][date.getMonth()];
        } ],
        [ /{{{dd}}}/g, function(date) {
            return padZero(date.getDate(), 2);
        } ],
    ];
    var listener = function(event) {
        var handler = {
            NotifyComposeFieldsReady: function() {
                var date = new Date();
                var subject = gMsgCompose.compFields.subject;
                for (var i = 0; i < regexs.length; ++i) {
                    subject = subject.replace(regexs[i][0], regexs[i][1](date));
                }
                gMsgCompose.compFields.subject = subject;
                var element = document.getElementById("msgSubject");
                element.value = gMsgCompose.compFields.subject;
            },
            ComposeProcessDone: function(aResult) {
            },
            SaveInFolderDone: function(folderName) {
            },
            NotifyComposeBodyReady: function() {
            },
        };
        event.currentTarget.gMsgCompose.RegisterStateListener(handler);
    };
    window.addEventListener("compose-window-init", listener, true);
})();
