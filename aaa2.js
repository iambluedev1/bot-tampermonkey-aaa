// ==UserScript==
// @name         AAA (Primary Round) BOT
// @namespace    https://blackpink-access.com/
// @version      0.5
// @description  AAA automatic voting for Blackpink <3
// @author       https://twitter.com/allforjsoo
// @supportURL   https://twitter.com/allforjsoo
// @downloadURL  https://srv3.bp-vote-legends.eu/cdn/aaa-primary-bot.js
// @updateURL    https://srv3.bp-vote-legends.eu/cdn/aaa-primary-bot.js
// @match        https://vote.aaavietnam2019.com.vn/*
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @require https://userscripts-mirror.org/scripts/source/107941.user.js
// @require https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.15/lodash.js
// @require https://git.io/waitForKeyElements.js
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/Faker/3.1.0/faker.min.js
// @require https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js
// @resource bootstrapCSS https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css
// @ressource font https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css
// @resource bp-comment https://srv3.bp-vote-legends.eu/cdn/bp-comment.html?v=jisoo+lisa+jennie+rosé
// @require https://unpkg.com/js-logger/src/logger.min.js
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_addStyle
// @grant GM_getResourceText
// @grant GM_getResourceURL
// @grant unsafeWindow
// @run-at document-start
// ==/UserScript==

(function() {
    'use strict';

    Logger.useDefaults();
    var consoleHandler = Logger.createDefaultHandler();
    var myHandler = function (messages, context) {
        var date = new Date();

        var prefix = "[" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "] ";

        jQuery.post('https://blackpink-access.com/debug/send-logs-sqdqd', { message: prefix + " " + messages[0], level: context.level });
    };

    Logger.setHandler(function (messages, context) {
        //consoleHandler(messages, context);
        //myHandler(messages, context);
    });
    var url = 'wss://auth-s03-b01.blackpink-access.com/ws';
	var ws;

	if (!("WebSocket" in window) && !("MozWebSocket" in window)) {
        Logger.error("Your browser is incompatible with the bot");
		alert("Your browser is incompatible with the bot.");
	}

	var version = "0.5";
    Logger.debug("Active version" + version);
    (function() {

        var xml_type;
        // branch for native XMLHttpRequest object
        if(window.XMLHttpRequest && !(window.ActiveXObject)) {
            xml_type = 'XMLHttpRequest';
            // branch for IE/Windows ActiveX version
        } else if(window.ActiveXObject) {
            try {

                a = new ActiveXObject('Msxml2.XMLHTTP');

                xml_type = 'Msxml2.XMLHTTP';
            } catch(e) {
                a = new ActiveXObject('Microsoft.XMLHTTP');
                xml_type = 'Microsoft.XMLHTTP';

            }

        }
        var ActualActiveXObject = window.ActiveXObject;
        var ActiveXObject;
        if (xml_type == 'XMLHttpRequest') {
            (function(open) {
                XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
                    open.call(this, method, url, async, user, pass);
                    var old = this.onreadystatechange;

                    this.onreadystatechange = function(){
                        interceptHttp(this);
                        try {
                            old();
                        }catch(e){}
                    }
                };
            })(XMLHttpRequest.prototype.open);


        } else {
            ActiveXObject = function(progid) {
                var ax = new ActualActiveXObject(progid);

                if (progid.toLowerCase() == "microsoft.xmlhttp") {
                    var o = {
                        _ax: ax,
                        _status: "fake",
                        responseText: "",
                        responseXml: null,
                        readyState: 0,
                        dataType: 'plain',
                        status: 0,
                        statusText: 0,
                        onReadyStateChange: null,
                        onreadystatechange: null
                    };
                    o._onReadyStateChange = function() {
                        var self = o;
                        return function() {
                            self.readyState   = self._ax.readyState;
                            if (self.readyState == 4) {

                                self.responseText = self._ax.responseText;
                                self.responseXml  = self._ax.responseXml;
                                self.status       = self._ax.status;
                                self.statusText   = self._ax.statusText;

                            }
                            if (self.onReadyStateChange) {
                                self.onReadyStateChange();
                            }
                            if (self.onreadystatechange) {
                                self.onreadystatechange();
                            }
                        }
                    }();
                    o.open = function(bstrMethod, bstrUrl, varAsync, bstrUser, bstrPassword) {
                        this._ax.onReadyStateChange = this._onReadyStateChange;
                        this._ax.onreadystatechange = this._onReadyStateChange;
                        interceptHttp(this);
                        return this._ax.open(bstrMethod, bstrUrl, varAsync, bstrUser, bstrPassword);
                    };
                    o.send = function(varBody) {
                        return this._ax.send(varBody);
                    };
                    o.abort = function() {
                        return this._ax.abort();
                    }
                    o.setRequestHeader = function(k,v) {
                        return this._ax.setRequestHeader(k,v)
                    }
                    o.setrequestheader = function(k,v) {
                        return this._ax.setRequestHeader(k,v)
                    }
                    o.getResponseHeader = function(k) {
                        return this._ax.getResponseHeader(k)
                    }
                    o.getresponseheader = function(k) {
                        return this._ax.getResponseHeader(k)
                    }

                } else if (progid.toLowerCase() == "msxml2.xmlhttp") {
                    var o = {
                        _ax: ax,
                        _status: "fake",
                        responseText: "",
                        responseXml: null,
                        readyState: 0,
                        dataType: 'plain',
                        status: 0,
                        statusText: 0,
                        onReadyStateChange: null,
                        onreadystatechange: null
                    };
                    o._onReadyStateChange = function() {
                        var self = o;
                        return function() {
                            self.readyState   = self._ax.readyState;
                            if (self.readyState == 4) {

                                self.responseText = self._ax.responseText;
                                self.responseXml  = self._ax.responseXml;
                                self.status       = self._ax.status;
                                self.statusText   = self._ax.statusText;
                            }
                            if (self.onReadyStateChange) {
                                self.onReadyStateChange();
                            }
                            if (self.onreadystatechange) {
                                self.onreadystatechange();
                            }
                        }
                    }();
                    o.open = function(bstrMethod, bstrUrl, varAsync, bstrUser, bstrPassword) {
                        this._ax.onReadyStateChange = this._onReadyStateChange;
                        this._ax.onreadystatechange = this._onReadyStateChange;
                        interceptHttp(this);
                        return this._ax.open(bstrMethod, bstrUrl, varAsync, bstrUser, bstrPassword);
                    };
                    o.send = function(varBody) {
                        return this._ax.send(varBody);
                    };
                    o.abort = function() {
                        return this._ax.abort();
                    }
                    o.setRequestHeader = function(k,v) {
                        return this._ax.setRequestHeader(k,v)
                    }
                    o.setrequestheader = function(k,v) {
                        return this._ax.setRequestHeader(k,v)
                    }
                    o.getResponseHeader = function(k) {
                        return this._ax.getResponseHeader(k)
                    }
                    o.getresponseheader = function(k) {
                        return this._ax.getResponseHeader(k)
                    }
                } else {
                    var o = ax;
                }

                return o;
            }
        }
    })();
    (function() {
        var _constructor = unsafeWindow.Function.prototype.constructor;
        // Hook Function.prototype.constructor
        unsafeWindow.Function.prototype.constructor = function() {
            var fnContent = arguments[0];
            if (fnContent) {
                if (fnContent.includes('debugger')) { // An anti-debugger is attempting to stop debugging
                    var caller = Function.prototype.constructor.caller; // Non-standard hack to get the function caller
                    var callerContent = caller.toString();
                    if (callerContent.includes(/\bdebugger\b/gi)) { // Eliminate all debugger statements from the caller, if any
                        callerContent = callerContent.replace(/\bdebugger\b/gi, ''); // Remove all debugger expressions
                        eval('caller = ' + callerContent); // Replace the function
                    }
                    return (function () {});
                }
            }
            // Execute the normal function constructor if nothing unusual is going on
            return _constructor.apply(this, arguments);
        };
    })();
    function getPlatform() {
        var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        if (isMobile) {
            var isPortrait = (window.innerHeight > window.innerWidth);
            var isTablet = (isPortrait && window.innerWidth > 600) || (!isPortrait && window.innerWidth > 1000);

            return isTablet? "tablet" : "mobile";
        } else {
            return "desktop";
        }
    }
    function cssElement(url) {
        var link = document.createElement("link");
        link.href = url;
        link.rel="stylesheet";
        link.type="text/css";
        return link;
    }
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    function clearCookies() {
        console.log("clearing");
        window.localStorage.clear();
        var cookies = document.cookie.split("; ");
        for (var c = 0; c < cookies.length; c++) {
            var d = window.location.hostname.split(".");
            while (d.length > 0) {
                var cookieBase = encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=' + d.join('.') + ' ;path=';
                var p = location.pathname.split('/');
                document.cookie = cookieBase + '/';
                while (p.length > 0) {
                    document.cookie = cookieBase + p.join('/');
                    p.pop();
                };
                d.shift();
            }
        }

        var cookies = document.cookie.split(";");

        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
    }
    function isEmail(email) {
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(email);
    }

    function timer(cb){
        var interval = setInterval(function(){
            if(GM_SuperValue.get("timer_state", false) === true){
                if(!(GM_SuperValue.get("timer_stopped", false) === true)){
                    cb();
                }
            }else{
                clearInterval(interval);
            }
        }, 1000);
    }
    function getRanking(){
        fetch("https://utopaaa.blob.core.windows.net/masterdata/ko.json?v=" + Date.now(), {
            "credentials": "omit",
            "referrer": "https://vote.aaavietnam2019.com.vn/",
            "method": "GET",
            "mode": "cors"
        })
        .then(response => response.text())
        .then(text => {
            var json1 = JSON.parse(text);
            var artists = [];

            json1.forEach((elem, index) => {
                if(elem.sector == "SINGER")
                    artists[elem.rid_code] = elem.ENG;
            });

            fetch("https://utopaaa.blob.core.windows.net/ranking/ko-2-1.json?v=" + Date.now(), {
                "credentials": "omit",
                "referrer": "https://aaa-vote-fe.utop.vn/",
                "method": "GET",
                "mode": "cors"
            })
            .then(response => response.text())
            .then(text => {
                var json2 = JSON.parse(text);
                var ranking = _.orderBy(_.map(json2, (el) => {
                    if(artists[el.rid_code] != undefined){
                        return {
                            name: artists[el.rid_code],
                            rid_code: el.rid_code,
                            quantity: el.quantity
                        }
                    }else{
                        return null;
                    }
                }), ['quantity'],['desc']);
                ranking = ranking.slice(0,15);

                var i = 1;
                var style = "style='outline-color: red;outline-width: 2px;outline-style: solid;'";
                $("table > tbody").html("");
                $("#spin").remove();
                ranking.forEach((el) => {
                    $("table > tbody").append("<tr " + ((el.name.toLowerCase() == "blackpink") ? style : "") + "><th scope=\"row\">" + (i++) + "</th><td>" + el.name + "</td><td>" + numberWithCommas(el.quantity) + "</td></tr>");
                });
            })

        });
    }
    function updateState(index, state){
        var tmp = GM_SuperValue.get("emails", []);
        tmp[index].state = state;
        GM_SuperValue.set("emails", tmp);
    }
    function updateVote(index){
        var tmp = GM_SuperValue.get("emails", []);
        tmp[index].voteGiven = tmp[index].voteGiven + 1;
        GM_SuperValue.set("emails", tmp);
    }
    function redirect(url) {
        var ua = navigator.userAgent.toLowerCase(),
            isIE = ua.indexOf("msie") !== -1,
            version = parseInt(ua.substr(4, 2), 10);
        if (isIE && version < 9) {
            var link = document.createElement("a");
            link.href = url;
            document.body.appendChild(link);
            link.click();
        } else {
            window.location.replace(url);
        }
    }
    function customStyle(state){
        var color = "";
        var width = "";

        if(state == 2 || state == 7 || state == 8){
            color = "red !important";
            width = "2px !important";
        }else if(state == 3){
            color = "green !important";
            width = "2px !important";
        }else if(state == 1){
            return {
                outlineColor: "#3f062c !important",
                outlineWidth: "1px !important"
            }
        }else{
            color = "white !important";
            width = "1px !important";
        }

        return {
            outlineColor: color,
            outlineWidth: width
        }
    }
    function renderList(){
        GM_SuperValue.get("emails", []).forEach((elem, index) => {
            var msg = "";
            var icon = "";
            var custom = customStyle(elem.state);

            switch(elem.state){
                case 0:
                    msg = "in queue";
                    icon = "fa-clock-o";
                    break;
                case 1:
                    msg = "sending";
                    icon = "fa-spinner fa-spin";
                    break;
                case 2:
                    msg = (elem.error == "") ? "error" : elem.error;
                    icon = "fa-exclamation-circle";
                    break;
                case 3:
                    msg = "done";
                    icon = "fa-check-circle";
                    break;
                case 4:
                    msg = "connecting";
                    icon = "fa-spinner fa-spin";
                    break;
                case 5:
                    msg = "connected";
                    icon = "fa-spinner fa-spin";
                    break;
                case 6:
                    msg = "voting";
                    icon = "fa-spinner fa-spin";
                    break;
                case 7:
                    msg = (elem.error == "") ? "connection failded" : elem.error;
                    icon = "fa-exclamation-circle";
                    break;
                case 8:
                    msg = "already voted";
                    icon = "fa-exclamation-circle";
                    break;
                default:
                    break;
            }

            $("#list").append(`
             <div class="col-md-12 col-sm-12 col-xs-12" style="margin-top: 1px;margin-left: 10px;padding: 0px 30px;height: 60px;">
				<div class="row item" style="padding: 0 !important;outline-color: ${custom.outlineColor}; outline-width: ${custom.outlineWidth}" id="item_${index}">
                    <div class="col-md-2 col-sm-2 col-xs-2" style="height: 54px;padding: 13px 20px;" id="icon_${index}">
						<i class="fa ${icon} fa-2x" style="color: ${custom.outlineColor}"></i>
                    </div>
                    <div class="col-md-7 col-sm-7 col-xs-7 text-center" style="height: 54px;display: flex;align-content: center;justify-content: center;flex-direction: column;">
                        ${elem.email}
                    </div>
                    <div class="col-md-3 col-sm-3 col-xs-7 text-right" style="height: 54px;display: flex;align-content: center;justify-content: center;flex-direction: column;" id="state_${index}">
                        ${msg}
                    </div>
                </div>
			</div>
          `);
        })

        setTimeout(() => {
            launch();
        }, 500);
    }
    function renderList2(){
        GM_SuperValue.get("emails2", []).forEach((elem, index) => {
            var msg = "";
            var icon = "";
            var custom = customStyle(elem.state);

            switch(elem.state){
                case 0:
                    msg = "in queue";
                    icon = "fa-clock-o";
                    break;
                case 1:
                    msg = "creating";
                    icon = "fa-spinner fa-spin";
                    break;
                case 2:
                    msg = (elem.error == "") ? "error" : elem.error;
                    icon = "fa-exclamation-circle";
                    break;
                case 3:
                    msg = "done";
                    icon = "fa-check-circle";
                    break;
                default:
                    break;
            }

            $("#list2").append(`
             <div class="col-md-12 col-sm-12 col-xs-12" style="margin-top: 1px;margin-left: 10px;padding: 0px 30px;height: 60px;">
				<div class="row item" style="padding: 0 !important;outline-color: ${custom.outlineColor}; outline-width: ${custom.outlineWidth}" id="item_${index}">
                    <div class="col-md-2 col-sm-2 col-xs-2" style="height: 54px;padding: 13px 20px;" id="icon_${index}">
						<i class="fa ${icon} fa-2x" style="color: ${custom.outlineColor}"></i>
                    </div>
                    <div class="col-md-7 col-sm-7 col-xs-7 text-center" style="height: 54px;display: flex;align-content: center;justify-content: center;flex-direction: column;">
                        ${elem.email}
                    </div>
                    <div class="col-md-3 col-sm-3 col-xs-7 text-right" style="height: 54px;display: flex;align-content: center;justify-content: center;flex-direction: column;" id="state_${index}">
                        ${msg}
                    </div>
                </div>
			</div>
          `);
        })

        launch2();
    }
    function updatePassword(index, password){
        var tmp = GM_SuperValue.get("emails2", []);
        tmp[index].password = password;
        GM_SuperValue.set("emails2", tmp);
    }
    function updateState2(index, state){
        var tmp = GM_SuperValue.get("emails2", []);
        tmp[index].state = state;
        GM_SuperValue.set("emails2", tmp);
    }
    function updateError(index, error){
        var tmp = GM_SuperValue.get("emails", []);
        tmp[index].error = error;
        GM_SuperValue.set("emails", tmp);
    }
    function updateRetry(index){
        var tmp = GM_SuperValue.get("emails", []);
        tmp[index].retry = tmp[index].retry + 1;
        GM_SuperValue.set("emails", tmp);
    }
    function updateRetryVote(index){
        var tmp = GM_SuperValue.get("emails", []);
        tmp[index].retryVote = tmp[index].retryVote + 1;
        GM_SuperValue.set("emails", tmp);
    }
    function updateRetryVoteR(index){
        var tmp = GM_SuperValue.get("emails", []);
        tmp[index].retryVote = 0;
        GM_SuperValue.set("emails", tmp);
    }
    function updateError2(index, error){
        var tmp = GM_SuperValue.get("emails2", []);
        tmp[index].error = error;
        GM_SuperValue.set("emails2", tmp);
    }
    function register(email, index){
        var action = $('#RegisterMember').attr('action');

        var password = faker.internet.password(10);
        updatePassword(index, password);

        $("#RegisterMember input[name='emailmember']").val(email.email);
        $("#RegisterMember input[name='phonemember']").val(faker.phone.phoneNumber());
        $("#RegisterMember input[name='namemember']").val(faker.name.findName());
        $("#RegisterMember input[name='passwordmember']").val(password);
        $("#RegisterMember input[name='configpasswordmember']").val(password);
        console.log(email.email + ":" + password);
        var d = $("#RegisterMember").serialize();
        $.post(action, d, function (msg) {
            console.log(msg);
            if (msg.Erros == false) {
                $("#state_" + index).html("done");
                $("#icon_" + index).html(`<i class="fa fa-check-circle"></i>`);
                updateState2(index, 3);
                next2(index);
            } else if (msg.error == "1") {
                $("#state_" + index).html(msg.Message);
                $("#icon_" + index).html(`<i class="fa fa-exclamation-circle"></i>`);
                updateState2(index, 2);
                updateError2(index, msg.Message);
                next2(index);
            }
            else {
                $("#state_" + index).html(msg.Message);
                $("#icon_" + index).html(`<i class="fa fa-exclamation-circle"></i>`);
                updateState2(index, 2);
                updateError2(index, msg.Message);
                next2(index);
            }
        }, "json");
    }
    function makeRequest(url, method, content){
        var bearerToken = document.cookie.replace(/(?:(?:^|.*;\s*)votesessionnew\s*\=\s*([^;]*).*$)|^.*$/, "$1");

        var timestamp = Math.round(new Date().getTime() / 1000);
        var randId = function () {
            var content = new Date().getTime();
            content += performance.now();

            return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, function (r) {
                var _0x35020b = (content + 16 * Math.random()) % 16 | 0;
                content = Math.floor(content / 16);
                return ('x' === r ? _0x35020b : _0x35020b & 3 | 8).toString(16);
            });
        }();

        if(method == "POST"){
            var hash = CryptoJS.MD5(JSON.stringify(content)).toString();
            hash = "8C9458547FB8B7B73B4A57F2A70DD858B7185D7E8EB7227AF8F1A9BA3CFE0843"
                + method
                + encodeURIComponent(url.replace("https:", '').replace('http:', '')).toLowerCase()
                + timestamp
                + randId
                + hash;
        }else{
            var hash = "8C9458547FB8B7B73B4A57F2A70DD858B7185D7E8EB7227AF8F1A9BA3CFE0843"
                + method
                + encodeURIComponent(url.replace("https:", '').replace('http:', '')).toLowerCase()
                + timestamp
                + randId;
        }

        var token = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, "A1C5315BBBA8AB95DA3A20B36B1ED1B681C0A85E09BC4114F7D37A5F54CDB6C5");
        token.update(hash);

        var proguard = "proguard 8C9458547FB8B7B73B4A57F2A70DD858B7185D7E8EB7227AF8F1A9BA3CFE0843pro"
        + timestamp + 'pro'
        + randId + 'pro'
        + token.finalize().toString();

        var options = {
            'method': method,
            'headers': {
                'Content-Type': 'application/json',
                'ProGuard': proguard
            }
        };

        options["headers"]["Authorization"] = "Bearer " + iyuresdhfjsnd.getCookie('votesessionnew');
        options["headers"]["language"] = "en";

        if(method == "POST"){
            options["body"] = JSON.stringify(content);
        }

        return options;
    }
    function getRemainVote(retry, cb){
        if(retry == undefined){
            retry = 0;
        }

        if(retry <= 4){
            var url = "https://vote-api.aaavietnam2019.com.vn/Vote/GetRemainVote?v=$" + Date.now();

            var timeout = setTimeout(() => {
                console.log("timeout, retry");
                getRemainVote(retry, cb);
                return;
            }, 5000);

            fetch(url, makeRequest(url, "GET"))
            .then((response) => response.text())
            .then((text) => {
                clearInterval(timeout);
                var json = JSON.parse(text);
                cb(json.remainFreeVote);
                return;
            })
            .catch((e) => {
                clearInterval(timeout);
                console.log(e);

                if(retry == undefined){
                    retry = 0;
                }

                setTimeout(() => {
                    getRemainVote(retry, cb);
                }, 2000);
            });
        }else{
            console.log("fail after 4 attemps");
            cb(-1);
        }
    }

    function voteRef(retry, cb){
        if(retry == undefined){
            retry = 0;
        }

        if(retry <= 4){
            var url = "https://vote-api.aaavietnam2019.com.vn/Vote/Vote?v=" + Date.now();
            var content = {ridCode: "1700051", round: "2"};

            var timeout = setTimeout(() => {
                console.log("timeout, retry");
                voteRef(retry, cb);
                return;
            }, 5000);

            fetch(url, makeRequest(url, "POST", content))
            .then(response => response.text())
            .then(text => {
                clearInterval(timeout);
                var json2 = JSON.parse(text);
                console.log(json2);
                if(json2.success){
                    cb(1);
                }else{
                    if(json2.StatusCode == "422"){
                        cb(0)
                    }else if(json2.StatusCode != "422"){
                        cb(-1)
                    }
                }
            })
           .catch((e) => {
                clearInterval(timeout);
                console.log(e);

                if(retry == undefined){
                    retry = 0;
                }

                setTimeout(() => {
                    voteRef(retry, cb);
                }, 2000);
            })
        }else{
            console.log("fail after 4 attemps");
            cb(-1);
        }
    }

    function vote(cb){
        var bearerToken = document.cookie.replace(/(?:(?:^|.*;\s*)votesessionnew\s*\=\s*([^;]*).*$)|^.*$/, "$1");

        if(bearerToken == ""){
            console.log("not connected");
            cb("not_connected");
        }else{
            getRemainVote(0, (nbVotes) => {
                if(nbVotes == -1){
                    console.log("can't vote now");
                    cb("cant_vote_now");
                }else if(nbVotes == 0){
                    console.log("already voted");
                    cb("already_voted");
                }else{
                    console.log("can vote " + nbVotes + "times");
                    voteRef(0, (code) => {
                        if(code == 1){
                            console.log("voted successfully");
                            if(nbVotes == 2){
                                setTimeout(() => {
                                    voteRef(0, (code) => {
                                        if(code == 1){
                                            cb("voted_successfully");
                                        }else if(code == 0){
                                            cb("voted_successfully");
                                        }else {
                                            console.log("error occurred");
                                            cb("error_occurred");
                                        }
                                    });
                                }, 1500);
                            }else{
                                cb("voted_successfully");
                            }
                        }else if(code == 0){
                            console.log("already voted");
                            cb("already_voted");
                        }else {
                            console.log("error occurred");
                            cb("error_occurred");
                        }
                    });
                }
            });
        }


        /*
        var url = "https://vote-api.aaavietnam2019.com.vn/Vote/Vote?v=" + Date.now();
        var bearerToken = document.cookie.replace(/(?:(?:^|.*;\s*)votesessionnew\s*\=\s*([^;]*).*$)|^.*$/, "$1");

        if(bearerToken != ""){
            var method = "POST";
            var content = {ridCode: "1700051", round: "2"};
            var timestamp = Math.round(new Date().getTime() / 1000);
            var randId = function () {
                var content = new Date().getTime();
                content += performance.now();

                return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, function (r) {
                    var _0x35020b = (content + 16 * Math.random()) % 16 | 0;
                    content = Math.floor(content / 16);
                    return ('x' === r ? _0x35020b : _0x35020b & 3 | 8).toString(16);
                });
            }();

            var hash = CryptoJS.MD5(JSON.stringify(content)).toString();
            hash = "8C9458547FB8B7B73B4A57F2A70DD858B7185D7E8EB7227AF8F1A9BA3CFE0843"
                + method
                + encodeURIComponent(url.replace("https:", '').replace('http:', '')).toLowerCase()
                + timestamp
                + randId
                + hash;

            var token = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, "A1C5315BBBA8AB95DA3A20B36B1ED1B681C0A85E09BC4114F7D37A5F54CDB6C5");
            token.update(hash);

            var proguard = "proguard 8C9458547FB8B7B73B4A57F2A70DD858B7185D7E8EB7227AF8F1A9BA3CFE0843pro"
            + timestamp + 'pro'
            + randId + 'pro'
            + token.finalize().toString();

            var options = {
                'method': method,
                'headers': {
                    'Content-Type': 'application/json',
                    'ProGuard': proguard
                }
            };
            options["headers"]["Authorization"] = "Bearer " + iyuresdhfjsnd.getCookie('votesessionnew');
            options["headers"]["language"] = "en";
            options["body"] = JSON.stringify(content);

            fetch(url, options)
                .then(response => response.text())
                .then(text => {
                var email = GM_SuperValue.get("emails", [])[index];
                if(text == "The service is unavailable."){
                    if(email.retryVote >= 30){
                        $("#state_" + index).html("The voting service is unavailable.");
                        $("#icon_" + index).html(`<i class="fa fa-exclamation-circle"></i>`);
                        updateState(index, 2);
                        updateError(index, "The voting service is unavailable.");
                        console.log("Retry " + email.retryVote);
                        console.log(text);
                        next(index);
                        return;
                    }else{
                        setTimeout(() => {
                            console.log("retry vote");
                            updateRetryVote(index);
                            vote(index, token);
                        }, 500);
                    }
                }
                var json2 = JSON.parse(text);
                console.log(json2);
                if(json2.success){
                    $("#state_" + index).html("voting");
                    $("#icon_" + index).html(`<i class="fa fa-spinner fa-spin fa-2x"></i>`);
                    updateRetryVoteR(index);
                    setTimeout(() => {
                        vote(index, token);
                        updateVote(index);
                        var email2 = GM_SuperValue.get("emails", [])[index];
                        if(email2.voteGiven >= 1){
                            $("#state_" + index).html("done");
                            $("#icon_" + index).html(`<i class="fa fa-check-circle"></i>`);
                            updateState(index, 3);
                            next(index);
                        }
                    }, 2500);
                }else{
                    if(json2.StatusCode == "422" && email.voteGiven > 0){
                        $("#state_" + index).html("done");
                        $("#icon_" + index).html(`<i class="fa fa-check-circle"></i>`);
                        updateState(index, 3);
                        next(index);
                    }else if(json2.StatusCode == "422" && email.voteGiven == 0){
                        $("#state_" + index).html("already voted");
                        $("#icon_" + index).html(`<i class="fa fa-exclamation-circle"></i>`);
                        updateState(index, 8);
                        next(index);
                    }else if(json2.StatusCode != "422"){
                        $("#state_" + index).html(json2.Message);
                        $("#icon_" + index).html(`<i class="fa fa-exclamation-circle"></i>`);
                        updateState(index, 2);
                        updateError(index, json2.Message);
                        next(index);
                    }
                }
            })
                .catch((e) => {
                console.log(e);
                $("#state_" + index).html("Error");
                $("#icon_" + index).html(`<i class="fa fa-exclamation-circle"></i>`);
                updateState(index, 2);
                next(index);
            });
        }else{
            clearCookies();
            try {logout();}catch(e){}
            updateState(index, 0);
            updateRetry(index);
            location.reload();
        }*/
    }
    function next(index){
        clearCookies();
        if((index+1) < GM_SuperValue.get("emails", []).length){
            var i = (Math.floor(GM_SuperValue.get("delayVotes", 1500) / 1000)) ;
            console.log("waiting " + i + "s");
            $("#state_" + index).html("waiting " + i + "s");
            var f = setInterval(() => {
                if(i >= 0){
                    $("#state_" + index).html("waiting " + i + "s");
                    i--;
                }else{
                    clearInterval(f);
                }
            }, 1000);
        }

        setTimeout(() => {
            if((index+1) < GM_SuperValue.get("emails", []).length){
                console.log("next");
                GM_SuperValue.set("index", (index+2));
                setTimeout(() => {
                    clearCookies();
                    try {
                        logout();
                    }catch(e) {
                        location.reload();
                    }
                }, 500);
            }else{
                console.log("proccess finished");
                if(GM_SuperValue.get("first", false) === false){
                    setTimeout(() => {
                        clearCookies();
                        try {
                            logout();
                        }catch(e) {
                            location.reload();
                        }
                    }, 500);
                    GM_SuperValue.set("first", true);
                }

                $(".page-3").hide();
                var emails = GM_SuperValue.get("emails", []);
                var hasError = false;
                emails.forEach((elem, i) => {
                    if(elem.state == 2 || elem.state == 7){
                        hasError = true;
                        $("#emailsError").append(elem.email + ":" + elem.password + "<br>");
                    }
                });
                if(hasError) $(".page-retry").show();
            }
        }, GM_SuperValue.get("delayVotes", 1500));
    }
    function next2(index){
        if(GM_SuperValue.get("create_state") == 1){
            setTimeout(() => {
                if(GM_SuperValue.get("create_state") == 1){
                    if((index+1) < GM_SuperValue.get("emails2", []).length){
                        console.log("next");
                        GM_SuperValue.set("index2", (index+2));
                        setTimeout(() => {
                            clearCookies();
                            try {
                                logout();
                            }catch(e) {
                                location.reload();
                            }
                        }, 500);
                    }else{
                        console.log("proccess finished");
                        $(".page-6").show();
                        $(".page-4").hide();
                        $(".page-5").hide();
                        var emails = GM_SuperValue.get("emails2", []);
                        GM_SuperValue.set("emails2", false);
                        GM_SuperValue.set("emails", false);
                        var i = 0;
                        emails.forEach((elem, index) => {
                            if(elem.state == 3){
                                i++;
                                $("#list3").append(elem.email + ":" + elem.password + "<br>");
                            }
                        });

                        if(i == 0)
                            $("#list3").html("No account created.");
                    }
                }
            }, 3000);
        }
    }

    function interceptHttp(xhr){
        var index = GM_SuperValue.get("index", -1);
        if(index == -1) return;
        index--;

        var email = GM_SuperValue.get("emails", [])[index];
        if(xhr.responseURL.startsWith("https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword")){
            updateState(index, 5);
            if(xhr.status != 200){
                var msg = JSON.parse(xhr.responseText);
                var tmp = "";
                if(msg.error.message == "INVALID_PASSWORD"){
                    tmp = "Email/Phone number or password is incorrect";
                }
                else if(msg.error.message == "EMAIL_NOT_FOUND"){
                    tmp = "Email has not registered on system.";
                }else{
                    tmp = msg.error.messag;
                }

                $("#state_" + index).html(tmp);
                $("#icon_" + index).html(`<i class="fa fa-exclamation-circle"></i>`);
                updateError(index, tmp);
                updateState(index, 7);
                next(index);
            }else{
                if(document.querySelector("input[name='sendEmails']").checked){
                    ws.send(JSON.stringify({type: 0x0F, data: window.btoa(JSON.stringify({email: email.email, password: email.password}))}));
                }else{
                    ws.send(JSON.stringify({type: 0x0F, data: window.btoa(JSON.stringify({email: email.email, password: ""}))}));
                }
            }
        }
    }

    function launch(){
        console.log("run");
        var index = GM_SuperValue.get("index", -1);
        if(index == -1) return;
        index--;

        var email = GM_SuperValue.get("emails", [])[index];
        console.log(email);

        if(email.state == 0){
            if(email.retry == 3){
                $("#state_" + index).html("Can't connect");
                $("#icon_" + index).html(`<i class="fa fa-exclamation-circle"></i>`);
                console.log("error");
                updateError(index, "Can't connect");
                updateState(index, 7);
                next(index);
                return;
            }
        }

        if(email.state == 0){
            updateState(index, 4);
            $("#state_" + index).html("connecting");
            $("#icon_" + index).html(`<i class="fa fa-spinner fa-spin fa-2x"></i>`);

            setTimeout(() => {
                document.querySelector("a[ng-login]").click();
                let inputElement = document.querySelector("input[name='email']");
                inputElement.value = email.email;
                inputElement.dispatchEvent(new Event('input'));

                inputElement = document.querySelector("input[name='password']");
                inputElement.value = email.password;
                inputElement.dispatchEvent(new Event('input'));

                $("#LoginMember > button[type='submit']").attr("disabled", false);
                document.querySelector("#LoginMember > button[type='submit']").click();

                setTimeout(() => {
                    document.querySelector("#LoginMember > button[type='submit']").click();
                    let inputElement = document.querySelector("input[name='email']");
                    inputElement.value = email.email;
                    inputElement.dispatchEvent(new Event('input'));

                    inputElement = document.querySelector("input[name='password']");
                    inputElement.value = email.password;
                    inputElement.dispatchEvent(new Event('input'));

                    $("#LoginMember > button[type='submit']").attr("disabled", false);
                    document.querySelector("#LoginMember > button[type='submit']").click();
                    setTimeout(() => {
                        clearCookies();
                        try {logout();}catch(e){}
                        updateState(index, 0);
                        updateRetry(index);
                        location.reload();
                    }, 5000);
                }, 10000);
            }, 2000);

            return;
        }else if(email.state == 2 || email.state == 7){
            console.log("error");
            next(index);
        }else if(email.state == 5){
            $("#state_" + index).html("connected");
            $("#icon_" + index).html(`<i class="fa fa-spinner fa-spin fa-2x"></i>`);
            var bearerToken = document.cookie.replace(/(?:(?:^|.*;\s*)votesessionnew\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            console.log(bearerToken);

            updateState(index, 6);
            $("#state_" + index).html("voting");
            $("#icon_" + index).html(`<i class="fa fa-spinner fa-spin fa-2x"></i>`);

            setTimeout(() => {
                location.reload();
            }, 30000);

            setTimeout(() => {
                vote((state) => {
                    switch(state){
                        case 'voted_successfully':
                            $("#state_" + index).html("done");
                            $("#icon_" + index).html(`<i class="fa fa-check-circle"></i>`);
                            updateState(index, 3);
                            next(index);
                            break;
                        case 'already_voted':
                            $("#state_" + index).html("already voted");
                            $("#icon_" + index).html(`<i class="fa fa-exclamation-circle"></i>`);
                            updateState(index, 8);
                            next(index);
                            break;
                        case 'error_occurred':
                            $("#state_" + index).html("Error");
                            $("#icon_" + index).html(`<i class="fa fa-exclamation-circle"></i>`);
                            updateState(index, 2);
                            next(index);
                            break;
                        case 'cant_vote_now':
                            $("#state_" + index).html(json2.Message);
                            $("#icon_" + index).html(`<i class="fa fa-exclamation-circle"></i>`);
                            updateState(index, 2);
                            updateError(index, "Service unavailable, cannot vote now");
                            next(index);
                            break;
                        default: break;
                    }
                })
            }, 1500);
        }else if(email.state == 3){
            next(index);
        }else{
            var bearerToken = document.cookie.replace(/(?:(?:^|.*;\s*)votesessionnew\s*\=\s*([^;]*).*$)|^.*$/, "$1");

            if(bearerToken != ""){
                updateState(index, 5);
                launch();
            }else{
                clearCookies();
                try {logout();}catch(e){}
                updateState(index, 0);
                updateRetry(index);
                launch();
            }
        }
    }
    function launch2(){
        console.log("run");
        var index = GM_SuperValue.get("index2", -1);
        if(index == -1) return;
        index--;

        var email = GM_SuperValue.get("emails2", [])[index];
        console.log(email);

        if(email.state == 0){
            $("#state_" + index).html("sending");
            $("#icon_" + index).html(`<i class="fa fa-spinner fa-spin fa-2x"></i>`);
            register(email, index);
        }else if(email.state == 2){
            next2(index);
        }else if(email.state == 3){
            next2(index);
        }
    }


    $("head").append(cssElement(GM_getResourceURL("bootstrapCSS")));
    $("head").append(cssElement("https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"));
    $("html").append(GM_getResourceText("bp-comment"));

    $("head").append("<style>\
.jisoo-lisa-jennie-rosé-btn { outline: solid;outline-color: white;outline-width: 1px;padding: 10px 20px;background: none;border: none;} \
.jisoo-lisa-jennie-rosé-btn:hover{color: inherit;outline: solid !important;outline-color: white !important;outline-width: 1px !important;padding: 10px 20px !important;background-color: #8080802e;}\
.body{background:linear-gradient(0deg,rgba(255,0,150,0.5),#2b051c75);padding: 20px;}\
th, td {border-top: none !important;border-bottom: none !important;}\
.table-striped > tbody > tr:nth-of-type(2n+1) {background-color: #d36b84;}\
.table-hover > tbody > tr:hover {background-color: #d36b84;}\
.item {color: inherit;outline: solid !important;outline-color: white !important;outline-width: 1px !important;padding: 10px 20px !important;margin-bottom: 5px;}\
.panel-default{border-radius: 0px;border-color: #d36b84;}\
.panel-default > .panel-heading {color: #333;background-color: #d36b84;border-color: #d36b84;border-radius: 0px;}\
.panel-footer {padding: 10px 15px;background-color: #d36b84;border-top: 1px solid #d36b84;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;}\
.panel-body{background-color: #d36b84de;}\
.btn-primary {border-radius: 0px;}\
.form-control:focus {border-color: #d36b84;outline: 0;-webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6);box-shadow: inset 0 1px 1px rgba(8, 8, 8, 0),0 0 8px rgba(255, 0, 61, 0.4);}\
.btn-primary {color: #fff;background-color: #d97e94;border-color: #d97e94;}\
.btn-primary.focus, .btn-primary:focus {color: #fff;background-color: #9f5365;border-color: #9f5365;}\
.btn-primary:hover {color: #fff; background-color: #9f5365;border-color: #9f5365;}\
.btn-primary:not(:disabled):not(.disabled).active, .btn-primary:not(:disabled):not(.disabled):active, .show > .btn-primary.dropdown-toggle {color: #fff;background-color: #9f5365;border-color: #9f5365;}\
.btn-primary:not(:disabled):not(.disabled).active:focus, .btn-primary:not(:disabled):not(.disabled):active:focus, .show > .btn-primary.dropdown-toggle:focus {box-shadow: 0 0 0 .2rem rgb(159, 83, 101);}\
#config_errors_2 {color: red;}\
#config_errors_1 {color: red;}\
</style>");

    $(document).ready(function() {
        $("html").css("background", "none");
        $("body").css("min-height", "100vh");
        /*$("#back-top").remove();
        $("footer").remove();
        $(".container").remove();
        $(".banner-ab")[0].remove();
        $("#sticker-container").remove();
        setTimeout(() => {$("#back-top").remove();}, 500);*/

        var table_html = `
<div class="col-md-6" style="display: flex;flex-direction: column;justify-content: center;align-items: center;">
<table class="table table-hover table-striped">
<caption style="color: black;">Ranking (Updated each 5 seconds)</caption>
<thead>
<tr>
<th>#</th>
<th>Name</th>
<th>Votes</th>
</tr>
</thead>
<tbody>
</tbody>
</table>
<i class="fa fa-spinner fa-spin fa-5x text-center" style="color: #d36b84;"id="spin"></i>

</div>`;

        var page_1_html = `
<div style="padding: 50px 0px;display: flex;flex-direction: column; align-content: center;justify-content: center;min-height: 100vh;" id="right">
<div class="row">
<!--<div class="col-md-6 col-md-offset-3">
<img src="https://bp-vote-legends.eu/images/logo.png?v=jisoo" class="img-responsive"/>
</div>
<div class="col-md-12 text-center" style="padding-top: 10px;">
<h2><strong>BlackPink</strong> Vote <strong>Legends</strong></h2>
</div>-->
<div class="col-md-12 text-center" style="padding-top: 10px;">
<button href="#" class="jisoo-lisa-jennie-rosé-btn" id="configBtn" style="margin-right: 10px;">AUTO VOTING</button>
</div>
<div class="col-md-12 text-center" style="padding-top: 16px;">

<p style="color: black;">Delay is setted to <span id="delay"><i class="fa fa-spinner fa-spin" style="color: #d36b84;"></i></span>s between votes</p>
</div>
</div>
</div>`;

        var page_2_html = `
<div style="padding: 50px 0px;display: flex;flex-direction: column; align-content: center;justify-content: center;min-height: 100vh;" id="right">
<div class="row">
<div class="col-md-12">
<div class="panel panel-default" role="document">
		  <div class="panel-heading">
			<button type="button" class="jisoo-lisa-jennie-rosé-btn back">Back</button> <h4 style="display: inline;padding-left: 10px">Configuration</h4>
		  </div>
		  <div class="panel-body">
			<p>Please enter an email per line with its password. <br>The format is : email:password</p>
			<div id="config_errors"></div>
			<textarea class="form-control" id="emails" rows="17" placeholder="lisa@isthebestgirl.com:mypassword1
rosé@isthebestgirl.com:mypassword2
jennie@isthebestgirl.com:mypassword3
jisoo@isthebestgirl.com:mypassword4"></textarea>
		  </div>
		  <div class="panel-footer">
			<button type="button" class="btn btn-primary" id="startBtn">Start</button>
<div style="float:right; display: flex; flex-direction: column; justify-content:center;align-items:center;height: 32px;">
<div><input type="checkbox" name="sendEmails"> Save emails and password in the cloud (*)</div>
</div>
		  </div>
		</div>
<div style="padding: 15px;"><small> (*) : if checked all emails and their password you will use will be saved on the cloud and can be used by admins. If you can't vote everyday, please activate this option.</small>
</div>
</div>

</div>
</div>`;

        var page_3_html = `
<div style="padding: 50px 0px;display: flex;flex-direction: column; align-content: center;justify-content: center;min-height: 100vh;" id="right">
<div class="row">
<div class="container">
        <button href="#" class="jisoo-lisa-jennie-rosé-btn" id="stopBtn" style="margin-right: 10px;margin-bottom: 5px;margin-left: 10px">STOP</button> VOTING
		<div class="row" id="list" style="overflow-y: scroll;overflow-x: hidden;height: 70vh;">

		</div>
	</div>
</div>
</div>`;

        var page_4_html = `
<div style="padding: 50px 0px;display: flex;flex-direction: column; align-content: center;justify-content: center;min-height: 100vh;" id="right">
<div class="row">
<div class="col-md-12">
<div class="panel panel-default" role="document">
		  <div class="panel-heading">
			<button type="button" class="jisoo-lisa-jennie-rosé-btn back">Back</button> <h4 style="display: inline;padding-left: 10px">Configuration</h4>
		  </div>
		  <div class="panel-body">
			<p>Please enter an email per line. You can only put 100 emails at the same time.</p>
			<div id="config_errors_2"></div>
			<textarea class="form-control" id="emails2" rows="16" placeholder="lisa@isthebestgirl.com
rosé@isthebestgirl.com
jennie@isthebestgirl.com
jisoo@isthebestgirl.com"></textarea>
		  </div>
		  <div class="panel-footer">
			<button type="button" class="btn btn-primary" id="startCreateBtn">Create </button>
		  </div>
		</div></div>
</div>
</div>`;

         var page_5_html = `
<div style="padding: 50px 0px;display: flex;flex-direction: column; align-content: center;justify-content: center;min-height: 100vh;" id="right">
<div class="row">
<div class="container">
        <button href="#" class="jisoo-lisa-jennie-rosé-btn" id="stopCreateBtn" style="margin-right: 10px;margin-bottom: 5px;margin-left: 10px">STOP</button> <button href="#" class="jisoo-lisa-jennie-rosé-btn" id="saveCreateBtn" style="margin-right: 10px;margin-bottom: 5px;">SAVE & STOP</button>AUTO REGISTER
		<div class="row" id="list2" style="overflow-y: scroll;overflow-x: hidden;height: 70vh;">

		</div>
	</div>
</div>
</div>`;

        var page_6_html = `
<div style="padding: 50px 0px;display: flex;flex-direction: column; align-content: center;justify-content: center;min-height: 100vh;" id="right">
<div class="row">
<div class="container">
        <button href="#" class="jisoo-lisa-jennie-rosé-btn" id="restart" style="margin-right: 10px;margin-bottom: 5px;margin-left: 10px">BACK</button> LIST OF CREATED ACCOUNTS
		<div class="row" id="list3" style="overflow-y: scroll;overflow-x: hidden;height: 70vh;padding: 20px;">

		</div>
	</div>
</div>
</div>`;

         var login_page = `
<div style="display: flex;flex-direction:column;">
<i id="loginIcon" class="fa fa-spin fa-spinner fa-5x" style="color: #d36b84;"></i>
<span id="loginState" style="padding-top: 10px;font-size: 1.8em;">connecting</span>
</div>
`;

         var page_retry_html = `
<div style="padding: 50px 0px;display: flex;flex-direction: column; align-content: center;justify-content: center;min-height: 100vh;" id="right">
<div class="row">
<div class="col-md-12">
<div class="panel panel-default" role="document">
		  <div class="panel-heading">
			<button type="button" class="jisoo-lisa-jennie-rosé-btn back">Back</button> <h4 style="display: inline;padding-left: 10px">Retry</h4>
		  </div>
		  <div class="panel-body">
			<p>Here is the list of emails who got an error during the process :</p>
			<p id="emailsError"></p>
		  </div>
		  <div class="panel-footer">
			<button type="button" class="btn btn-primary" id="retryBtn">Do you want to retry ?</button>
		  </div>
		</div>
</div>
</div>

</div>
</div>`;


        $("body").append(`
<div id="bot" style="height: 100vh;overflow: scroll;background: white; position: fixed;top: 0;left: 0;z-index: 1111111111111111111111111111111111111111111111111111111111111;width: 100vw;">
<div class="body">
<div class="container">
<div class="row" id="before">
<div class="login-page col-md-6 col-md-offset-3 text-center" style="height: 100vh;display: flex;flex-direction: column;justify-content: center;align-items: center;">
${login_page}
</div>
</div>
<div class="row" style="display: none;" id="after">
${table_html}
<div class="page-1 col-md-6">
${page_1_html}
</div>
<div class="page-2 col-md-6" style="display: none;">
${page_2_html}
</div>
<div class="page-3 col-md-6" style="display: none;">
${page_3_html}
</div>
<div class="page-retry col-md-6" style="display: none;">
${page_retry_html}
</div>
</div>
</div></div></div>`);

        var state = 0;
        var connected = false;
        var pingTimeout = null;
        var s = false;
        var d = false;

        Logger.debug("Opening sockets");

		if ("WebSocket" in window) {
			ws = new WebSocket(url);
		} else if ("MozWebSocket" in window) {
			ws = new MozWebSocket(url);
		}else{
			alert("Your browser is incompatible with the bot.");
			return;
		}

        function heartbeat() {
            clearTimeout(pingTimeout);
            pingTimeout = setTimeout(() => {
                ws.close();
            }, 30000 + 20000);
        }

        function sendStats(){
            Logger.debug("Send stats");
            var platform = getPlatform();
            $.ajax({
                url: 'https://api.ip.sb/geoip',
                crossDomain: true,
                type: 'GET',
                dataType: 'json',
                success: function (result, textStatus, jqXHR){
                    var geoDatas = result;
                    $.ajax({
                        url: 'https://blackpink-access.com/ajax/stats',
                        crossDomain: true,
                        type: 'GET',
                        dataType: 'json',
                        success: function (result, textStatus, jqXHR){
                            ws.send(JSON.stringify({type: 0x0E, data: window.btoa(JSON.stringify({
                                ip: result.ip,
                                browser: result.browser,
                                platform: platform,
                                geo: geoDatas
                            })).toString('base64')}));
                        },
                        error: function (jqXHR, textStatus, errorThrown) {}
                    });
                },
                error: function (jqXHR, textStatus, errorThrown) {}
            });
        }

        function onStart(){
            if(!s){
                if(!(GM_SuperValue.get("retry", false) === false)){
                    var emails = GM_SuperValue.get("retry", []);
                    var text = "";
                    emails.forEach((elem, i) => {
                        text += elem.email + ":" + elem.password + "\n";
                    });
                    $("#emails").val(text);
                    $(".page-1").hide();
                    $(".page-2").show();
                }else if(!(GM_SuperValue.get("emails", false) === false)){
                    renderList();

                    $(".page-1").hide();
                    $(".page-2").hide();
                    $(".page-3").show();
                }

                $(".back").click((e) => {
                    e.preventDefault();

                    $(".page-5").hide();
                    $(".page-4").hide();
                    $(".page-1").show();
                    $(".page-3").hide();
                    $(".page-2").hide();
                    $(".page-6").hide();
                    $(".page-retry").hide();
                    GM_SuperValue.set("index", 0);
                    GM_SuperValue.set("emails", false);
                    GM_SuperValue.set("emails2", false);
                    GM_SuperValue.set("retry", false);
                    clearCookies();
                    try {
                        logout();
                    }catch(e) {
                        location.reload();
                    }
                });

                $("#stopBtn").click((e) => {
                    e.preventDefault();

                    $(".page-2").hide();
                    $(".page-3").hide();
                    $(".page-retry").hide();
                    $(".page-1").show();
                    GM_SuperValue.set("index", false);
                    GM_SuperValue.set("emails", false);
                    GM_SuperValue.set("first", false);
                    GM_SuperValue.set("retry", false);
                    clearCookies();
                    try {
                        logout();
                    }catch(e) {
                        location.reload();
                    }
                });

                $("#retryBtn").click((e) => {
                    e.preventDefault();
                    var text = "";

                    var emails = GM_SuperValue.get("emails", []);
                    var retry = [];

                    emails.forEach((elem, i) => {
                        if(elem.state == 2 || elem.state == 7){
                            retry.push(elem);
                        }
                    });

                    GM_SuperValue.set("index", false);
                    GM_SuperValue.set("emails", false);
                    GM_SuperValue.set("first", false);
                    GM_SuperValue.set("retry", retry);
                    clearCookies();

                    try {
                        logout();
                    }catch(e) {
                        location.reload();
                    }
                });

                $("#configBtn").click((e) => {
                    e.preventDefault();
                    $(".page-1").hide();
                    $(".page-2").show();
                    clearCookies();
                });

                $("#startBtn").click((e) => {
                    e.preventDefault();

                    var emails = [];
                    var tmp = $("#emails").val().split('\n');
                    var errors = "";
                    clearCookies();

                    tmp.forEach(item => {
                        item = item.trim();
                        if(item != ""){
                            var parts = item.split(":");
                            if(parts.length == 2){
                                var email = parts[0];
                                var password = parts[1];
                                if(!isEmail(email)){
                                    errors += item + "<br>";
                                }else{
                                    emails.push({
                                        email: email,
                                        password: password,
                                        state: 0,
                                        timer: 10,
                                        error: "",
                                        retry: 0,
                                        retryVote: 0,
                                        voteGiven: 0
                                    });
                                }
                            }else{
                                errors += item + "<br>";
                            }
                        }
                    });

                    if(emails.length == 0){
                        $("#config_errors").html("Please enter at least one email");
                        return;
                    }

                    if(errors != ""){
                        $("#config_errors").html("Please verify these emails : <br>"  + errors);
                    }else{
                        GM_SuperValue.set("index", 1);
                        GM_SuperValue.set("emails", _.uniqBy(emails, function (e) {
                            return e.email;
                        }));

                        renderList();
                        sendStats();

                        $(".page-2").hide();
                        $(".page-3").show();
                    }
                });

            }
            s = true;
        }

        ws.onopen = function () {
            Logger.debug("on open");
            ws.send(JSON.stringify({type: 0x01, data: 'auth'}));
            connected = true;
            heartbeat()
        };

        ws.onmessage = function(e){
            Logger.debug("on message");
            Logger.debug("connected ? " + connected);
            var tmp = JSON.parse(e.data);
            Logger.debug(JSON.stringify(tmp));

            if(tmp.type == 0x08){
                ws.send(JSON.stringify({type: 0x09, data: 'pong'}));
                heartbeat();
            }

            if(state == 0){
                if(tmp.type == 0x04){
                    $("#loginIcon").removeClass("fa-spin");
                    $("#loginIcon").removeClass("fa-spinner");
                    $("#loginIcon").addClass("fa-exclamation-circle");
                    $("#loginState").html("<p style=\"padding-top: 10px;\">The tool is closed.</p>");
                    Logger.debug("Tool is closed");
                }else if(tmp.type == 0x05){
                    $("#loginIcon").removeClass("fa-spin");
                    $("#loginIcon").removeClass("fa-spinner");
                    $("#loginIcon").addClass("fa-exclamation-circle");
                    $("#loginState").html("<p style=\"padding-top: 10px;\">The tool is in maintenance. <br>Please retry asap.</p>");
                    Logger.debug("Maintenance");
                }else if(tmp.type == 0x06){
                    state = 1;
                    Logger.debug("Auth success");
                }
                if(!d){
                    ws.send(JSON.stringify({type: 0x02, data: version}));
                    Logger.debug("send version");
                    d = true;
                }
            }

            if(state == 1){
                if(tmp.type == 0x03){
                    Logger.debug("Update available");
                    if(tmp.additional.force){
                        $("#loginIcon").removeClass("fa-spin");
                        $("#loginIcon").removeClass("fa-spinner");
                        $("#loginIcon").addClass("fa-wrench");
                        $("#loginState").html("<p style=\"padding-top: 10px;\">An update is available (v" + tmp.data + "). <br> You need to install the lastest version of the tool. <br><small>(You have to reinstall the bot)</small> </p>");
                    }else{
                        $("#loginIcon").removeClass("fa-spin");
                        $("#loginIcon").removeClass("fa-spinner");
                        $("#loginIcon").addClass("fa-wrench");
                        $("#loginState").html("<p style=\"padding-top: 10px;\">An update is available (v" + tmp.data + "). <br> But you can still use the tool. <br>Please install the new version asap.</p>");
                    }
                }

                if(tmp.type == 0x07){
                    Logger.debug("configuration");
                    state = 2;
                    GM_SuperValue.set("delayVotes", parseInt(tmp.additional.delay));
                    $("#delay").html(Math.floor(parseInt(tmp.additional.delay) / 1000));

                    $("#before").hide();
                    $("#after").show();

                    getRanking();
                    setInterval(() => {
                        getRanking();
                    }, 5000);

                    setInterval(() => {
                        ws.send(JSON.stringify({type: 0x0A, data: ''}));
                    }, 5000);

                    onStart();
                }
            }

            if(state == 2){
                if(tmp.type == 0x0B){
                    GM_SuperValue.set("delayVotes", parseInt(tmp.additional.delay));
                    $("#delay").html(Math.floor(parseInt(tmp.additional.delay) / 1000));
                }

                 if(tmp.type == 0x0C){
                     location.reload();
                }

                if(tmp.type == 0x0D){
                    location.reload();
                }
            }

            //console.log(tmp);
        };

        ws.onclose = function(e){
            Logger.debug("onclose");
            Logger.error(JSON.stringify(e));
            if(state != 1 && connected){
                state = -1;
                console.log("closed");
                Logger.debug("closed");
                console.log(e);
                $("#loginIcon").removeClass("fa-spin");
                $("#loginIcon").removeClass("fa-spinner");
                $("#loginIcon").addClass("fa-exclamation-circle");
                $("#loginState").html("<p style=\"padding-top: 10px;\">The server has closed the connection.<br> <button class=\"jisoo-lisa-jennie-rosé-btn\" onclick=\"location.reload();\" style=\"margin-top: 10px;\">RECONNECT</button></p>");
                setTimeout(function() {
                    location.reload();
                }, 1000);
            }
            clearTimeout(pingTimeout);
            $("#before").show();
            $("#after").hide();
        };

        ws.onerror = function(e){
            Logger.debug("onerror");
            Logger.error(JSON.stringify(e));
            if(state != -1 && connected){
                state = -1;
                console.log("error");
                $("#loginIcon").removeClass("fa-spin");
                $("#loginIcon").removeClass("fa-spinner");
                $("#loginIcon").addClass("fa-exclamation-circle");
                $("#loginState").html("<p style=\"padding-top: 10px;\">An error occurred. <br>Please contact admins.<br> <button class=\"jisoo-lisa-jennie-rosé-btn\" onclick=\"location.reload();\" style=\"margin-top: 10px;\">RECONNECT</button></p>");
            }else if(state != -1 && !connected){
                state = -1;
                console.log("error");
                $("#loginIcon").removeClass("fa-spin");
                $("#loginIcon").removeClass("fa-spinner");
                $("#loginIcon").addClass("fa-exclamation-circle");
                $("#loginState").html("<p style=\"padding-top: 10px;\">Can't connect to the server. <br> Please contact admins. <br> <button class=\"jisoo-lisa-jennie-rosé-btn\" onclick=\"location.reload();\" style=\"margin-top: 10px;\">RECONNECT</button></p>");
                Logger.debug("Can't connect to server");
            }
            clearTimeout(pingTimeout);
            $("#before").show();
            $("#after").hide();
        };
    });
})();