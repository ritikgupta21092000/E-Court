(function (window) {
  var admin = {};
  var adminFrontHtml = "snippets/admin-front-snippet.html";
  var addLawyerPersonalForm = "snippets/addLawyer-Personal.html";
  var addLawyerProfessionalForm = "snippets/addLawyer-Professional.html";
  var serverUrl = "http://localhost:3001/";

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

  admin.addLawyerPersonalDetails = function () {
    showLoadingSpinner();
    setTimeout(() => {
      $ajaxUtils.sendGetRequest(addLawyerPersonalForm, responseHandler);
    }, 1000);
  }

  admin.addLawyerProfessionalDetails = function () {
    var data = {
      username: $("#email").val(),
      fullname: $("#firstName").val() + " " + $("#middleName").val() + " " + $("#lastName").val(),
      dob: $("#dob").val(),
      gender: $(".gender:checked").val(),
      mobile: $("#mobile").val(),
      state: $("#state").val(),
      city: $("#city").val()
    };
    showLoadingSpinner();
    setTimeout(() => {
      $.ajax({
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json",
        url: serverUrl + "addLayerPersonal",
        success: function (data) {
          admin.lawyerUsername = data.lawyer.username;
          $ajaxUtils.sendGetRequest(addLawyerProfessionalForm, responseHandler);
        }
      });
    }, 1000);
  }

  admin.addLawyerAllInfo = function () {
    var speciality = [];
    $.each($("input[id='speciality']:checked"), function () {
      speciality.push($(this).val());
    });
    console.log(document.getElementById("photo").files[0].name);
    var data = {
      username: admin.lawyerUsername,
      degreeCollege: $("#degreeCollege").val(),
      stateOfCollege: $("#statedegreeCollege").val(),
      yearOfPassing: $("#yop").val(),
      startPracticeDate: $("#dosp").val(),
      speciality: speciality
    };
    showLoadingSpinner();
    $.ajax({
      type: "POST",
      data: JSON.stringify(data),
      contentType: "application/json",
      url: serverUrl + "addLayerProfessional",
      success: function (data) {
        Swal.fire(
          "Registered " + admin.lawyerUsername + " lawyer successfully!",
          "You clicked the button!",
          "success"
        );
        $ajaxUtils.sendGetRequest(adminFrontHtml, responseHandler);
      }
    });
  }

  function responseHandler(responseText) {
    insertHtml("#admin-content", responseText);
  }

  window.$admin = admin;

})(window);
