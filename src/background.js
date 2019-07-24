$(document).ajaxError(function(event, jqXHR, ajaxSettings, thrownError) {
  console.log("unknown ajax error: " + event);
});

function doSignout(user_id, password) {
  $.ajax({
    url: "http://station.csgrandeur.com/gpu/User/logout_ajax",
    type: "POST",
    crossDomain: true,
    cache: false,
    async: true,
    success: function() {
      //save userid and password
      var cre = {
        userid: user_id,
        password: password
      };

      chrome.storage.local.remove("cre", function() {
        if (chrome.runtime.error) {
          console.log("Runtime error.");
        } else {
          console.log("Exit and remove storage successfully...");
        }
      });
    }
  });
}

function doSignin(user_id, password) {
  $.ajax({
    url: "http://station.csgrandeur.com/gpu/user/login_ajax",
    type: "POST",
    data: {
      user_id: user_id,
      password: password
    },
    crossDomain: true,
    cache: false,
    async: true,
    success: function() {
      //save userid and password
      var cre = {
        userid: user_id,
        password: password
      };
      chrome.storage.local.set({ cre: JSON.stringify(cre) }, function() {
        if (chrome.runtime.error) {
          console.log("Runtime error.");
        } else {
          console.log("Refresh storage successfully...");
          doPoll();
        }
      });
    }
  });
  return false;
}

function setNotification(isNotify) {
  var mute = isNotify;

  chrome.storage.local.set({ mute: mute }, function() {
    if (chrome.runtime.error) {
      console.log("runtime error.");
    } else {
      console.log("set  notification" + mute);
    }
  });
}

function doPoll() {
  chrome.storage.local.get("cre", function(items) {
    //if logined
    if (typeof items["cre"] === "undefined" || chrome.runtime.error) {
      console.log("first need login.");
    } else {
      //if notificated
      chrome.storage.local.get("mute", function(items) {
        if (items["mute"] === "0" || chrome.runtime.error) {
          console.log("mute notifications.");
        } else {
          console.log("start notifications.");
          $.get(
            "http://station.csgrandeur.com/gpu/station/status_ajax?station_id=1",
            function(data) {
              console.log(data); // process results here
              var re = /\d{1,3}W/g;

              var match,
                indexes = [];
              while ((match = re.exec(data))) {
                indexes.push([match.index, match.index + match[0].length]);
                console.log(match[0]);
                if (match[0].length > 1) {
                  power = match[0].substring(0, match[0].length - 1);
                  if (parseInt(power) <= 20) {
                    chrome.notifications.create(null, {
                      type: "basic",
                      iconUrl: "icon48.png",
                      title: "From CSU GPU station helper ",
                      message: "Available GPU in Titan_XP_1 :)"
                    });
                    break;
                  }
                }
              }
            }
          );

          $.get(
            "http://station.csgrandeur.com/gpu/station/status_ajax?station_id=2",
            function(data) {
              console.log(data); // process results here
              var re = /\d{1,3}W/g;

              var match,
                indexes = [];
              while ((match = re.exec(data))) {
                indexes.push([match.index, match.index + match[0].length]);
                console.log(match[0]);
                if (match[0].length > 1) {
                  power = match[0].substring(0, match[0].length - 1);
                  if (parseInt(power) <= 20) {
                    chrome.notifications.create(null, {
                      type: "basic",
                      iconUrl: "icon48.png",
                      title: "From CSU GPU station helper ",
                      message: "Available GPU in Titan_XP_2 :)"
                    });
                    break;
                  }
                }
              }
            }
          );
        }
      });
    }
    setTimeout(doPoll, 60000); //10s every time
  });
}

doPoll();
