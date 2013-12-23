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
    var listener = function(event) {
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
    for (var i = 0; i < regexs.length; ++i) {
        s = s.replace(regexs[i][0], regexs[i][1](date));
    }
    return s;
};
        var window = event.currentTarget;
        var handler = {
            date: null,
            NotifyComposeFieldsReady: function() {
                this.date = new Date();
                var document = window.document;
                var msgSubject = document.getElementById("msgSubject");
                var subject = msgSubject.value;
                subject = replaceMacros(subject, this.date);
                msgSubject.value = subject;
            },
            ComposeProcessDone: function(aResult) {
            },
            SaveInFolderDone: function(folderName) {
            },
            NotifyComposeBodyReady: function() {
                var document = window.document;
                var contentFrame = document.getElementById("content-frame");
                var body = contentFrame.contentDocument.body.innerHTML;
                body = replaceMacros(body, this.date);
                contentFrame.contentDocument.body.innerHTML = body;
            },
        };
        window.gMsgCompose.RegisterStateListener(handler);
    };

var windowListener = {
    onOpenWindow: function(aWindow) {
        var domWindow = aWindow.docShell.
            QueryInterface(Components.interfaces.nsIInterfaceRequestor).
            getInterface(Components.interfaces.nsIDOMWindow);
        domWindow.addEventListener("compose-window-init", listener, true);
    },
    onCloseWindow: function (aWindow) {
        var domWindow = aWindow.docShell.
            QueryInterface(Components.interfaces.nsIInterfaceRequestor).
            getInterface(Components.interfaces.nsIDOMWindow);
        domWindow.removeEventListener("compose-window-init", listener, true);
    },
    onWindowTitleChange: function (aWindow, aTitle) {
    },
};

var startup = function(data, reason) {
    var windowMediator =
        Components.classes["@mozilla.org/appshell/window-mediator;1"].
        getService(Components.interfaces.nsIWindowMediator);
    for (var i = windowMediator.getEnumerator("msgcompose");
         i.hasMoreElements();) {
        var domWindow = i.getNext().docShell.
            QueryInterface(Components.interfaces.nsIInterfaceRequestor).
            getInterface(Components.interfaces.nsIDOMWindow);
        domWindow.addEventListener("compose-window-init", listener, true);
    }
    windowMediator.addListener(windowListener);
};

var shutdown = function(data, reason) {
    var windowMediator =
        Components.classes["@mozilla.org/appshell/window-mediator;1"].
        getService(Components.interfaces.nsIWindowMediator);
    for (var i = windowMediator.getEnumerator("msgcompose");
         i.hasMoreElements();) {
        var domWindow = i.getNext().docShell.
            QueryInterface(Components.interfaces.nsIInterfaceRequestor).
            getInterface(Components.interfaces.nsIDOMWindow);
        domWindow.removeEventListener("compose-window-init", listener, true);
    }
    windowMediator.removeListener(windowListener);
};

var install = function(data, reason) {
};

var uninstall = function(data, reason) {
};
