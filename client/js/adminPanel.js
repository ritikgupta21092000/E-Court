(function (window) {
  var admin = {};
  var adminFrontHtml = "snippets/admin-front-snippet.html";
  var addCaseStatusAppelantForm = "snippets/addCaseStatus-Appelant.html";
  var addCaseStatusDefendantForm = "snippets/addCaseStatus-Defendant.html";
  var addCaseForm = "snippets/addCaseStatus-Case.html";

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

  admin.addCaseStatusAppelant = function () {
    showLoadingSpinner();
    setTimeout(function () {
      $ajaxUtils.sendGetRequest(addCaseStatusAppelantForm, responseHandler);
    }, 1000);
  }

  admin.addCaseStatusDefendant = function () {
    var data = {
      fullname: document.getElementsByClassName("firstName")[0].value + " " + $(".middleName").val() + " " + $(".lastName").val(),
      address: $(".address").val(),
      username: $(".username").val(),
      lawyerId: $(".lawyerId").val()
    };
    showLoadingSpinner();
    setTimeout(function () {
      $.ajax({
        type: "post",
        url: serverUrl + "updateAppelantCase",
        data: data,
        success: function (response) {
          $ajaxUtils.sendGetRequest(addCaseStatusDefendantForm, responseHandler);
        }
      });
    }, 1000);
  }

  admin.addCase = function () {
    var data = {
      fullname: document.getElementsByClassName("firstName")[0].value + " " + $(".middleName").val() + " " + $(".lastName").val(),
      address: $(".address").val(),
      username: $(".username").val(),
      lawyerId: $(".lawyerId").val()
    };
    showLoadingSpinner();
    setTimeout(function () {
      $.ajax({
        type: "post",
        url: serverUrl + "updateDefendantCase",
        data: data,
        success: function (response) {
          $ajaxUtils.sendGetRequest(addCaseForm, responseHandler);
        }
      });
    }, 1000);
  }

  admin.registerCase = function () {
    var codes = document.getElementsByClassName("codes")[0].value.split(" ");
    var data = {
      complaint: document.getElementsByClassName("complaint")[0].value,
      dateOfComplaint: document.getElementsByClassName("dateOfComplaint")[0].value,
      codes: codes,
      status: document.querySelector('input[name="status"]:checked').value,
      lastCourtOfHearing: document.getElementsByClassName("lastCourtOfHearing")[0].value,
      nextCourtOfHearing: document.getElementsByClassName("nextCourtOfHearing")[0].value,
      lastDateOfHearing: document.getElementsByClassName("lastDateOfHearing")[0].value,
      nextDateOfHearing: document.getElementsByClassName("nextDateOfHearing")[0].value,
    };
    showLoadingSpinner();
    $.ajax({
      type: "post",
      url: serverUrl + "registerCase",
      data: data,
      success: function (response) {
        alert("Added Lawyer Successfully");
        $ajaxUtils.sendGetRequest(adminFrontHtml, responseHandler);
      }
    });
  }

  admin.getLawyerId = function () {
    var data = {
      lawyerUsername: $(".lawyerUsername").val()
    };
    $.ajax({
      type: "post",
      url: serverUrl + "getLawyerId",
      data: data,
      success: function (response) {
        if (response.lawyerId) {
          document.getElementsByClassName("lawyerId")[0].value = response.lawyerId;
          document.getElementsByClassName("lawyerId")[0].disabled = true;
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please Enter Correct Lawyer Username!",
            footer: "<a href>Why do I have this issue?</a>",
          });
        }
      }
    });
  }

  admin.updateCaseStatusAppelant = function () {
    console.log("Inside of updateCaseStatusAppelant");
  }

  admin.viewAllLawyers = function () {
    showLoadingSpinner();
    $.ajax({
      type: "GET",
      url: serverUrl + "viewLawyers",
      success: function (data) {
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
