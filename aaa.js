// ==UserScript==
// @name         AAA BOT
// @namespace    https://blackpink-access.com/
// @version      0.5
// @description  AAA automatic voting for Blackpink <3
// @author       https://twitter.com/allforjsoo
// @supportURL   https://twitter.com/allforjsoo
// @downloadURL  http://srv3.bp-vote-legends.eu/cdn/aaa-bot.js
// @updateURL    http://srv3.bp-vote-legends.eu/cdn/aaa-bot.js
// @match        https://aaavietnam2019.com.vn/*
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
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_addStyle
// @grant GM_getResourceText
// @grant GM_getResourceURL
// @run-at document-start
// ==/UserScript==

(function() {
    'use strict';
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
            "referrer": "https://aaa-vote-fe.utop.vn/",
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

            fetch("https://utopaaa.blob.core.windows.net/ranking/ko-1-1.json?v=" + Date.now(), {
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
                    msg = "connection failed";
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
    function vote(index, token){
        fetch("https://aaa-vote-api.utop.vn/Vote/Vote", {
            "headers":{
                "authorization":"Bearer " + token,
                "content-type":"application/json",
                "language":"en",
                "sec-fetch-mode":"cors"
            },
            "referrer":"https://aaavietnam2019.com.vn/pre-vote/korea?type=singer",
            "referrerPolicy":"no-referrer-when-downgrade",
            "body":"{\"ridCode\":\"1700051\",\"round\":1}",
            "method":"POST",
            "mode":"cors"
        })
        .then(response => response.text())
        .then(text => {
            var json2 = JSON.parse(text);
            console.log(json2);
            var email = GM_SuperValue.get("emails", [])[index];
            if(json2.success){
                $("#state_" + index).html("voting");
                $("#icon_" + index).html(`<i class="fa fa-spinner fa-spin fa-2x"></i>`);
                vote(index, token);
                updateVote(index);
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
    }
    function next(index){
        setTimeout(() => {
            if((index+1) < GM_SuperValue.get("emails", []).length){
                console.log("next");
                GM_SuperValue.set("index", (index+2));
                setTimeout(() => {
                    clearCookies();
                    logout();
                }, 500);
            }else{
                console.log("proccess finished");
                if(GM_SuperValue.get("first", false) === false){
                    setTimeout(() => {
                        clearCookies();
                        logout();
                    }, 500);
                    GM_SuperValue.set("first", true);
                }
            }
        }, 1500);
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
                            logout();
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
    function launch(){
        console.log("run");
        var index = GM_SuperValue.get("index", -1);
        if(index == -1) return;
        index--;

        var email = GM_SuperValue.get("emails", [])[index];
        console.log(email);

        if(email.state == 0){
            updateState(index, 4);
            $("#state_" + index).html("connecting");
            $("#icon_" + index).html(`<i class="fa fa-spinner fa-spin fa-2x"></i>`);
            var action = $('#LoginMember').attr('action');
            $("input[name='email']").val(email.email);
            $("input[name='password']").val(email.password);
            var d = $("#LoginMember").serialize();
            $.post(action, d, function (msg) {
                if (msg.Erros == false) {
                    $("#state_" + index).html("connected, refreshing page");
                    $("#icon_" + index).html(`<i class="fa fa-spinner fa-spin fa-2x"></i>`);
                    updateState(index, 5);
                    redirect("https://aaavietnam2019.com.vn/pre-vote/korea?type=singer");
                }
                else {
                    $("#state_" + index).html(msg.Message);
                    $("#icon_" + index).html(`<i class="fa fa-exclamation-circle"></i>`);
                    updateError(index, msg.Message);
                    updateState(index, 7);
                    next(index);
                }
            }, "json");
        }else if(email.state == 2 || email.state == 7){
            console.log("error");
            next(index);
        }else if(email.state == 5){
            $("#state_" + index).html("connected");
            $("#icon_" + index).html(`<i class="fa fa-spinner fa-spin fa-2x"></i>`);
            var bearerToken = document.cookie.replace(/(?:(?:^|.*;\s*)voteSession\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            console.log(bearerToken);

            updateState(index, 6);
            $("#state_" + index).html("voting");
            $("#icon_" + index).html(`<i class="fa fa-spinner fa-spin fa-2x"></i>`);
            vote(index, bearerToken);
        }else if(email.state == 3){
            next(index);
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

    getRanking();
    setInterval(() => {
        getRanking();
    }, 5000);

    $("head").append(cssElement(GM_getResourceURL("bootstrapCSS")));
    $("head").append(cssElement("https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"));
    $("html").append(GM_getResourceText("bp-comment"));

    $("head").append("<style>\
.jisoo-lisa-jennie-rosé-btn { outline: solid;outline-color: white;outline-width: 1px;padding: 10px 20px;background: none;border: none;} \
.jisoo-lisa-jennie-rosé-btn:hover{color: inherit;outline: solid !important;outline-color: white !important;outline-width: 1px !important;padding: 10px 20px !important;background-color: #8080802e;}\
body{background:linear-gradient(0deg,rgba(255,0,150,0.5),#2b051c75);padding: 20px;}\
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
        var html_cache = "<div style=\"display: none;\" id=\"html_cache\">" +  $("body").html() + "</div>";
        $("body").html(html_cache);
        $("body").css("min-height", "100vh");

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
<div class="col-md-6 col-md-offset-3">
<img src="https://bp-vote-legends.eu/images/logo.png?v=jisoo" class="img-responsive"/>
</div>
<div class="col-md-12 text-center" style="padding-top: 10px;">
<h2><strong>BlackPink</strong> Vote <strong>Legends</strong></h2>
</div>
<div class="col-md-12 text-center" style="padding-top: 10px;">
<button href="#" class="jisoo-lisa-jennie-rosé-btn" id="configBtn" style="margin-right: 10px;">AUTO VOTING</button>
<button href="#" class="jisoo-lisa-jennie-rosé-btn" id="createBtn" style="margin-right: 10px;">AUTO REGISTER</button>
</div>
<div class="col-md-12 text-center" style="padding-top: 16px;">
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
		  </div>
		</div></div>
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


        $("body").append(`
<div class="container">
<div class="row">
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
<div class="page-4 col-md-6" style="display: none;">
${page_4_html}
</div>
<div class="page-5 col-md-6" style="display: none;">
${page_5_html}
</div>
<div class="page-6 col-md-6" style="display: none;">
${page_6_html}
</div>
</div>
</div>`);

        if(!(GM_SuperValue.get("emails", false) === false)){
            renderList();

            $(".page-1").hide();
            $(".page-2").hide();
            $(".page-3").show();
        }

        if(!(GM_SuperValue.get("emails2", false) === false)){
            renderList2();

            $(".page-1").hide();
            $(".page-4").hide();
            $(".page-5").show();
        }

        $("#configBtn").click((e) => {
            e.preventDefault();
            $(".page-1").hide();
            $(".page-2").show();
        });

        $("#startBtn").click((e) => {
            e.preventDefault();
            var emails = [];
            var tmp = $("#emails").val().split('\n');
            var errors = "";

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

                $(".page-2").hide();
                $(".page-3").show();
            }
        });

        $("#startCreateBtn").click((e) => {
            e.preventDefault();
            var emails = [];
            var tmp = $("#emails2").val().split('\n');
            var errors = "";

            tmp.forEach(item => {
                item = item.trim();
                if(item != ""){
                    if(!isEmail(item)){
                        errors += item + "<br>";
                    }else{
                        emails.push({
                            email: item,
                            password: "",
                            state: 0,
                            timer: 10,
                            error: ""
                        });
                    }
                }
            });

            if(emails.length == 0){
                $("#config_errors_2").html("Please enter at least one email");
                return;
            }

            if(errors != ""){
                $("#config_errors_2").html("Please verify these emails : <br>"  + errors);
            }else{
                if(emails.length > 100){
                    $("#config_errors_2").html("You're limited to 100 emails at the same time.");
                }else{
                    GM_SuperValue.set("index2", 1);
                    GM_SuperValue.set("create_state", 1);
                    GM_SuperValue.set("emails2", _.uniqBy(emails, function (e) {
                        return e.email;
                    }));

                    renderList2();

                    $(".page-4").hide();
                    $(".page-5").show();
                }
            }
        });

        $("#stopBtn").click((e) => {
            e.preventDefault();

            $(".page-2").hide();
            $(".page-3").hide();
            $(".page-1").show();
            GM_SuperValue.set("emails", false);
            GM_SuperValue.set("first", false);
            clearCookies();
            logout();
         });

         $("#stopCreateBtn").click((e) => {
             e.preventDefault();

             $(".page-5").hide();
             $(".page-4").hide();
             $(".page-1").show();
             $(".page-6").hide();
             GM_SuperValue.set("emails", false);
             GM_SuperValue.set("emails2", false);
             clearCookies();
             logout();
         });

		 $("#restart").click((e) => {
             e.preventDefault();

             $(".page-5").hide();
             $(".page-4").hide();
             $(".page-1").show();
             $(".page-6").hide();
             GM_SuperValue.set("emails", false);
             GM_SuperValue.set("emails2", false);
             clearCookies();
             logout();
         });

        $(".back").click((e) => {
            e.preventDefault();

            $(".page-5").hide();
            $(".page-4").hide();
            $(".page-1").show();
            $(".page-3").hide();
            $(".page-2").hide();
            $(".page-6").hide();
            GM_SuperValue.set("emails", false);
            GM_SuperValue.set("emails2", false);
            clearCookies();
            logout();
        });

        $("#createBtn").click((e) => {
            console.log("aaa");
            e.preventDefault();
            $(".page-1").hide();
            $(".page-4").show();
            $(".page-6").hide();
        });

        $("#saveCreateBtn").click((e) => {
            console.log("bbb");
            e.preventDefault();
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
        });
    });
})();