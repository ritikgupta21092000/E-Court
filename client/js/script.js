(function (window) {
  var ec = {};
  var homeHtml = "snippets/home-snippet.html";
  var contactHtml = "snippets/contact-snippet.html";
  var aboutHtml = "snippets/about-snippet.html";
  var advocateHtml = "snippets/findadvocate-snippet.html";

  function insertHtml(selector, html) {
    document.querySelector(selector).innerHTML = html;
  }

  function showLoadingSpinner() {
    var html = "<div class='text-center'><img src='./images/ajax-loader.gif'></div>";
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
  }

  ec.loadContactPage = function () {
    showLoadingSpinner();
    setTimeout(function () {
      $ajaxUtils.sendGetRequest(contactHtml, responseHandler);
    }, 1000);
  }

  ec.loadAboutPage = function () {
    showLoadingSpinner();
    setTimeout(() => {
      $ajaxUtils.sendGetRequest(aboutHtml, responseHandler);
    }, 1000);
  }

  ec.loadAdvocatePage = function () {
    showLoadingSpinner();
    setTimeout(() => {
      $ajaxUtils.sendGetRequest(advocateHtml, responseHandler);
    }, 1000);
  }

  function responseHandler(responseText) {
    insertHtml("#main-content", responseText);
  }

  window.$ec = ec;
})(window);
