(function (window) {
  var ec = {};
  var homeHtml = "snippets/home-snippet.html";
  var contactHtml = "snippets/contact-snippet.html";
  var aboutHtml = "snippets/about-snippet.html";
  var userDashboardHtml = "snippets/user-dashboard-snippet.html";
  var adminPanelUrl = "http://localhost:3000/client/adminPanel.html";
  var serverUrl = "http://localhost:5000/";

  function insertHtml(selector, html) {
    document.querySelector(selector).innerHTML = html;
  }

  function showLoadingSpinner() {
    var html =
      "<div class='text-center'><img src='./images/ajax-loader.gif'></div>";
    insertHtml("#main-content", html);
  }

  document.addEventListener("DOMContentLoaded", function (event) {
    showLoadingSpinner();
    setTimeout(function () {
      $ajaxUtils.sendGetRequest(homeHtml, responseHandler);
    }, 1000);
  });

  ec.loadHomePage = function () {
    showLoadingSpinner();
    setTimeout(function () {
      $ajaxUtils.sendGetRequest(homeHtml, responseHandler);
    }, 1000);
  };

  ec.loadContactPage = function () {
    showLoadingSpinner();
    setTimeout(function () {
      $ajaxUtils.sendGetRequest(contactHtml, responseHandler);
    }, 1000);
  };

  ec.loadAboutPage = function () {
    showLoadingSpinner();
    setTimeout(() => {
      $ajaxUtils.sendGetRequest(aboutHtml, responseHandler);
    }, 1000);
  };

  ec.loadAdvocatePage = function () {
    showLoadingSpinner();
    setTimeout(() => {
      $.ajax({
        type: "GET",
        url: serverUrl + "lawyers",
        success: function (data) {
          responseHandler(data);
        },
      });
    }, 1000);
  };

  ec.loadUserDashboard = function () {
    showLoadingSpinner();
    setTimeout(() => {
      $ajaxUtils.sendGetRequest(userDashboardHtml, responseHandler);
    }, 1000);
  }

  $("#register").click(function (e) {
    e.preventDefault();

    var data = {};
    data.username = $("#email").val();
    data.password = $("#pwd").val();
    $.ajax({
      type: "POST",
      data: JSON.stringify(data),
      contentType: "application/json",
      url: serverUrl + "signup",
      success: function (data) {
        if (data.success) {
          Swal.fire(
            "Registered Successfully!",
            "You clicked the button!",
            "success"
          );
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
            footer: "<a href>Why do I have this issue?</a>",
          });
        }
      },
    });
  });

  $("#login").click(function (e) {
    e.preventDefault();
    var data = {};
    data.username = $("#username").val();
    data.password = $("#password").val();

    $.ajax({
      type: "POST",
      data: JSON.stringify(data),
      contentType: "application/json",
      url: serverUrl + "login",
      success: function (data) {
        if (data.user == null) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
            footer: "<a href>Why do I have this issue?</a>",
          });
        } else if (data.user.admin === true) {
          location.replace(adminPanelUrl);
        } else if (data.user.admin === false) {
          Swal.fire(
            "LoggedIn Successfully!",
            "You clicked the button!",
            "success"
          );
          $(".manipulated-text a.nav-link").text(data.user.username);
          $(".manipulated-text").removeClass("manipulated-text");
        }
      },
    });
  });

  ec.allLaws = function () {
    showLoadingSpinner();
    $.ajax({
      type: "GET",
      url: serverUrl + "laws",
      success: function (data) {
        insertHtml("#main-content", data);
      }
    })
  }

  function responseHandler(responseText) {
    insertHtml("#main-content", responseText);
  }

  window.$ec = ec;
})(window);
