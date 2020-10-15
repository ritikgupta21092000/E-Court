(function (window) {
  var admin = {};
  var adminFrontHtml = "snippets/admin-front-snippet.html";
  var addLawyerPersonalForm = "snippets/addLawyer-Personal.html";
  var addLawyerProfessionalForm = "snippets/addLawyer-Professional.html";
  var updateCaseStatusAppelantForm = "snippets/updateCaseStatus-Appelant.html";
  var updateCaseStatusDefendantForm = "snippets/updateCaseStatus-Defendant.html";
  var updateCaseForm = "snippets/updateCaseStatus-Case.html";

  var clientUrl = "http://localhost:3000/client/index.html";
  var serverUrl = "http://localhost:5000/";

  admin.lawyerUsername = "";

  function insertHtml(selector, html) {
    document.querySelector(selector).innerHTML = html;
  }

  function showLoadingSpinner() {
    var html =
      "<div class='text-center'><img src='./images/ajax-loader.gif'></div>";
    insertHtml("#admin-content", html);
  }

  document.addEventListener("DOMContentLoaded", function (event) {
    showLoadingSpinner();
    setTimeout(() => {
      $ajaxUtils.sendGetRequest(adminFrontHtml, responseHandler);
    }, 1000);
  });

  admin.loadFrontPage = function () {
    showLoadingSpinner();
    setTimeout(() => {
      $ajaxUtils.sendGetRequest(adminFrontHtml, responseHandler);
    }, 1000);
  }

  admin.verifyLawyer = function () {
    $.ajax({
      type: "GET",
      url: serverUrl + "verifyLawyer",
      success: function (data) {
        insertHtml("#admin-content", data);
      }
    });
  }

  admin.updateCaseStatusAppelant = function () {
    showLoadingSpinner();
    setTimeout(function () {
      $ajaxUtils.sendGetRequest(updateCaseStatusAppelantForm, responseHandler);
    }, 1000);
  }

  admin.updateCaseStatusDefendant = function () {
    showLoadingSpinner();
    setTimeout(function () {
      $ajaxUtils.sendGetRequest(updateCaseStatusDefendantForm, responseHandler);
    }, 1000);
  }

  admin.updateCase = function () {
    showLoadingSpinner();
    setTimeout(function () {
      $ajaxUtils.sendGetRequest(updateCaseForm, responseHandler);
    }, 1000);
  }

  admin.viewAllLawyers = function () {
    showLoadingSpinner();
    $.ajax({
      type: "GET",
      url: serverUrl + "viewLawyers",
      success: function (data) {
        console.log(data);
        insertHtml("#admin-content", data);
      }
    })
  }

  admin.viewPic = function (url) {
    window.open(url, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes, left = 300, top = 100, width = 500, height = 500, scrollbars = yes");
  }

  admin.viewCertificate = function (url) {
    window.open(url, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes, left = 300, top = 100, width = 500, height = 500, scrollbars = yes");
  }

  admin.rejectApplication = function (id) {
    var message = prompt("Reason for Rejecting Application");
    var newdata = {
      id: id,
      message: message
    };
    $.ajax({
      type: "POST",
      url: serverUrl + "rejectApplication",
      data: newdata,
      success: function (data) {
        admin.loadFrontPage();
      }
    });
  }

  admin.acceptApplication = function (id) {
    var newdata = {
      id: id
    };
    $.ajax({
      type: "POST",
      url: serverUrl + "acceptApplication",
      data: newdata,
      success: function (data) {
        admin.loadFrontPage();
      }
    });
  }

  admin.logout = function () {
    $.ajax({
      type: "get",
      url: serverUrl + "logout",
      success: function (data) {
        if (data.logout) {
          $(".trigger-class a.nav-link").text("");
          $(".trigger-class").addClass("manipulated-text");
          location.replace(clientUrl);
        }
      }
    });
  }

  function responseHandler(responseText) {
    insertHtml("#admin-content", responseText);
  }

  window.$admin = admin;

})(window);
