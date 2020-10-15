(function (window) {
  var ec = {};
  var homeHtml = "snippets/home-snippet.html";
  var contactHtml = "snippets/contact-snippet.html";
  var aboutHtml = "snippets/about-snippet.html";
  var userDashboardHtml = "snippets/user-dashboard-snippet.html";
  var authenticationHtml = "snippets/authentication.html"
  var addLawyerPersonalForm = "snippets/addLawyer-Personal.html";
  var addLawyerProfessionalForm = "snippets/addLawyer-Professional.html";
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

  ec.register = function (e) {
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
  }

  ec.login = function (e) {
    e.preventDefault();
    var data = {};
    data.username = $("#username").val();
    data.password = $("#password").val();

    // let headers = new Headers();
    // headers.append("Access-Control-Allow-Origin", "*");
    // headers.append("Content-Type", "application/json");

    // fetch(serverUrl + "login", {
    //   method: "post",
    //   mode: "cors",
    //   headers: headers,
    //   body: {
    //     data: JSON.stringify(data)
    //   }
    // })
    //   .then((data) => data.json())
    //   .then((data) => {
    //     if (data.user == null) {
    //       Swal.fire({
    //         icon: "error",
    //         title: "Oops...",
    //         text: "Something went wrong!",
    //         footer: "<a href>Why do I have this issue?</a>",
    //       });
    //     } else if (data.user.admin === true) {
    //       location.replace(adminPanelUrl);
    //     } else if (data.user.admin === false) {
    //       Swal.fire(
    //         "LoggedIn Successfully!",
    //         "You clicked the button!",
    //         "success"
    //       );
    //       $(".manipulated-text a.nav-link").text(data.user.username);
    //       $(".manipulated-text").removeClass("manipulated-text");
    //     }
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

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
  }

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
        console.log(data);
        if (data.success == false) {
          console.log(data.success);
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
          $(".trigger-class a.nav-link").text(data.user.username);
          $(".trigger-class").removeClass("manipulated-text");
        }
      },
    });
  });

  ec.authentication = function () {
    showLoadingSpinner();
    setTimeout(function () {
      $ajaxUtils.sendGetRequest(authenticationHtml, responseHandler);
    }, 1000)
  }

  ec.logout = function () {
    $.ajax({
      type: "get",
      url: serverUrl + "logout",
      success: function (data) {
        if (data.logout) {
          $(".trigger-class a.nav-link").text("");
          $(".trigger-class").addClass("manipulated-text");
          Swal.fire(
            "Logged Out Successfully!",
            "You clicked the button!",
            "success"
          );
        }
      }
    });
  }

  ec.addLawyerPersonalDetails = function () {
    showLoadingSpinner();
    setTimeout(() => {
      $ajaxUtils.sendGetRequest(addLawyerPersonalForm, responseHandler);
    }, 1000);
  }

  ec.addLawyerProfessionalDetails = function () {
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
          ec.lawyerUsername = data.lawyer.username;
          $ajaxUtils.sendGetRequest(addLawyerProfessionalForm, responseHandler);
        }
      });
    }, 1000);
  }

  ec.addLawyerAllInfo = function () {
    var speciality = [];
    $.each($("input[id='speciality']:checked"), function () {
      speciality.push($(this).val());
    });
    var file = document.getElementById("photo").files[0];
    var certificateFile = document.getElementById("certificate").files[0];
    var form = document.querySelector("form");
    var formData = new FormData(form);
    formData.append("imageFile", file);
    formData.append("certificateFile", certificateFile);
    var data = {
      username: ec.lawyerUsername,
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
        console.log("Success");
      }
    });

    fetch(serverUrl + 'saveImage', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        Swal.fire(
          "Registered " + ec.lawyerUsername + " lawyer successfully!",
          "Please Wait for our Approval!",
          "success"
        );
        $ajaxUtils.sendGetRequest(authenticationHtml, responseHandler);
      })
      .catch(error => {
        console.error(error);
      });
  }

  function responseHandler(responseText) {
    insertHtml("#main-content", responseText);
  }

  window.$ec = ec;
})(window);
