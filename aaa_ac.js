// ==UserScript==
// @name         AAA Account Creator
// @namespace    https://vote.aaavietnam2019.com.vn/
// @version      0.2
// @description  Account Creator
// @author       https://twitter.com/allforjsoo
// @supportURL   https://twitter.com/allforjsoo
// @downloadURL  https://srv3.bp-vote-legends.eu/cdn/aaa-ac.js
// @updateURL    https://srv3.bp-vote-legends.eu/cdn/aaa-ac.js
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
    function cssElement(url) {
        var link = document.createElement("link");
        link.href = url;
        link.rel="stylesheet";
        link.type="text/css";
        return link;
    }
    function isEmail(email) {
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(email);
    }
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
    $(document).ready(function() {
        $("head").append(cssElement(GM_getResourceURL("bootstrapCSS")));
        $("head").append(cssElement("https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"));
        $("html").append(GM_getResourceText("bp-comment"));

        $("head").append("<style>\
.jisoo-lisa-jennie-rosé-btn { outline: solid;outline-color: red;outline-width: 1px;padding: 10px 20px;background: none;border: none;} \
.jisoo-lisa-jennie-rosé-btn:hover{color: inherit;outline: solid !important;outline-color: red !important;outline-width: 1px !important;padding: 10px 20px !important;background-color: #8080802e;}\
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
        $(".tit-banner").html("<button href=\"#\" class=\"jisoo-lisa-jennie-rosé-btn\" id=\"registerBtn\"  style=\"color: red;font-size: 2em;\">REGISTER ACCOUNT</button>");
        $("#registerBtn").click(() => {
            $("#myModal").modal('show');
            if(!(GM_SuperValue.get("password", false) === false)){
                $("input[name='password']").val(GM_SuperValue.get("password", false));
            }else{
                $("input[name='password']").val(Math.random().toString(36).slice(-8));
            }
        });

        var modal = `<div id="myModal" class="modal fade" role="dialog">
  <div class="modal-dialog">

    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">REGISTER ACCOUNT</h4>
      </div>
      <div class="modal-body">
        <p id="status"></p>
        <div class="form-group">
           <label>Email</label>
           <input type="text" name="email" id="emailRR" class="form-control">
        </div>
        <div class="form-group">
           <label>Password</label>
           <input type="text" name="password" id="passwordRR" class="form-control">
        </div>
        <div class="form-group">
           <label><input type="checkbox" value="" name="keep">Keep this password</label>
        </div>
      </div>
      <div class="modal-footer" style="display: flex;flex-direction: row;align-items: center;justify-content: space-between;">
       <button type="button" class="btn btn-primary pull-left" id="showHistory">History</button>
        <div>
<button type="button" class="btn btn-success" id="create">Create</button>
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
</div>
      </div>
    </div>
  </div>
</div>`;

        var modal2 = `<div id="myModal2" class="modal fade" role="dialog">
  <div class="modal-dialog">

    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">My Accounts</h4>
      </div>
      <div class="modal-body" id="list" style="height: 50vh; overflow: scroll;">

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-danger" id="clear">Clear</button>
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>`;
        $("body").append(modal);
        $("body").append(modal2);

        $("#showHistory").click(() => {
            $("#myModal").modal('hide');
            $("#myModal2").modal('show');
            var emails = GM_SuperValue.get("registered", []);
            var text = "";
			 $("#list").html("");
            emails.forEach((elem, i) => {
                text += elem.email + ":" + elem.password + "<br>";
            });
            $("#list").append(text);
        });

        $("#clear").click(() => {
            $("#list").html("");
            GM_SuperValue.set("registered", false);
        });

        $("#create").click((e) => {
            e.preventDefault();
            $("#status").html("");
            if($("input[name='keep']").prop("checked")){
                GM_SuperValue.set("password", $("#passwordRR").val().trim());
            }else{
                GM_SuperValue.set("password", false);
            }

            if($("#emailRR").val().trim() == "" || $("#passwordRR").val().trim() == ""){
                $("#status").html("Please fill all the fields");
                return;
            }

            if(!isEmail($("#emailRR").val().trim())){
                $("#status").html("Invalid email");
                return;
            }
            $("#create").attr("disabled", "true");
            firebase.auth().createUserWithEmailAndPassword($("#emailRR").val().trim(), $("#passwordRR").val().trim()).then(function(e) {
                e.user.updateProfile({
                    displayName: $("#emailRR").val().trim().split("@")[0]
                }).then(function() {}, function(error) {
                    $("#create").attr("disabled", false);
                });
                firebase.auth().currentUser.sendEmailVerification().then(function() {
                    $("#status").html("A confirmation email has been send. Please check your email to confirm");
                    $("#create").attr("disabled", false);
                    var emails = GM_SuperValue.get("registered", []);
                    emails.push({
                        email: $("#emailRR").val().trim(),
                        password: $("#passwordRR").val().trim()
                    });
                    GM_SuperValue.set("registered", emails);
                });
            }).catch(function(error) {
                var errorCode = error.code;
                if (errorCode == 'auth/weak-password') {
                    $("#status").html("Passwords must be at least 6 characters in length");
                } else if (errorCode == 'auth/email-already-in-use') {
                    $("#status").html("Email was used. Please use another email to register a new account.");
                } else {
                    $("#status").html("Email was used. Please use another email to register a new account.");
                }
                $("#create").attr("disabled", false);
            });
        });
    });
})();