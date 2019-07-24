document.getElementById("signin").onclick = signin;
document.getElementById("signout").onclick = signout;

function signin() {
  var user_id = document.getElementById("user_id").value;
  var password = document.getElementById("password").value;

  var bg = chrome.extension.getBackgroundPage();
  bg.doSignin(user_id, password);
}

function signout() {
  var user_id = document.getElementById("user_id").value;
  var password = document.getElementById("password").value;

  var bg = chrome.extension.getBackgroundPage();
  bg.doSignout(user_id, password);
}

chrome.storage.local.get("cre", function(items) {
  if (typeof items["cre"] === "undefined" || chrome.runtime.error) {
    //not login
    $("#input").show();
    $("#detail").hide();
  } else {
    //logined
    $("#input").hide();
    $("#detail").show();
  }
});

chrome.storage.local.get("mute", function(items) {
  if (items["mute"] === "0" || chrome.runtime.error) {
    console.log("mute notifications.");
    $("#cbxIsPoll").prop("checked", false);
  } else {
    console.log("start notifications.");
    $("#cbxIsPoll").prop("checked", true);
  }
});

$("#cbxIsPoll").click(function() {
  if ($(this).is(":checked")) {
    //start notification
    var bg = chrome.extension.getBackgroundPage();
    bg.setNotification("1");
  } else {
    //mute notification
    var bg = chrome.extension.getBackgroundPage();
    bg.setNotification("0");
  }
});
