(function (window) {
  var ec = {};
  var homeHtml = "snippets/home-snippet.html";
  var contactHtml = "snippets/contact-snippet.html";
  function insertHtml(selector, html) {
    document.querySelector(selector).innerHTML = html;
  }

  function showLoadingSpinner() {
    var html = "<div class='text-center'><img src='../images/ajax-loader.gif'></div>";
    insertHtml("#main-content", html);
  }

  document.addEventListener("DOMContentLoaded", function (event) {
    showLoadingSpinner();
    $ajaxUtils.sendGetRequest(homeHtml, responseHandler);
  });

  ec.loadHomePage = function () {
    showLoadingSpinner();
    $ajaxUtils.sendGetRequest(homeHtml, responseHandler);
  }

  ec.loadContactPage = function () {
    showLoadingSpinner();
    $ajaxUtils.sendGetRequest(contactHtml, responseHandler);
  }

  function responseHandler(responseText) {
    insertHtml("#main-content", responseText);
  }

  window.$ec = ec;
})(window);