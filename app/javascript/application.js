// Entry point for the build script in your package.json
import * as bootstrap from "bootstrap"
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree

import Rails from "@rails/ujs"
import Turbolinks from "turbolinks"

let $ = require( "jquery" );
Rails.start()
Turbolinks.start()

$(document).on('turbolinks:load', function() {

  window.addEventListener('offline', function(event){
    alert("You lost connection.");

  });
  window.addEventListener('online', function(event){
    alert("You are now back online.");
    sendValueFromLocalStorageToDB();
  });

  $(".btn").click(function () {
    let link = $("#link_name").val();

    if (validateUrl(link)) {
      link = refactoringLink(link);
      sendValueToDB(link);
      createNewTags(link);
    } else {
      alert("Enter the valid link, please!");
    }
  });

  function createNewTags(link) {
    $('<h4 class="text-center"></h4>').text(link).appendTo($('<div class="card-body">')
      .appendTo($('<article class="card mb-2">').prependTo($('#output'))));
  }

  function validateUrl(link) {
    let pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(link);
  }

  function sendValueToDB(link) {
    let authToken = document.querySelector("meta[name='csrf-token']").getAttribute("content");
    $.ajax({
      url: '/links',
      data: {'authenticity_token' : authToken, 'link' : {'name': link}},
      type: "POST",
      error: function() {
        sendValueToLocalStorage(link);
        $("#link_name").val('');
        $("#warning").show();
        setTimeout(function() { $("#warning").hide(); }, 3500);
      },
      success: function() {
        $("#link_name").val('');
        $("#success").show();
        setTimeout(function() { $("#success").hide(); }, 3500);
      }
    })
  }

  function refactoringLink(link) {
    if (link.search('www.') >= 0) {
      return link.split('www.')[1].split('/')[0]
    } else if (link.search('http') >= 0){
      return link.split('http://')[1].split('/')[0]
    } else {
      return link.split('/')[0]
    }
  }

  function sendValueToLocalStorage(link) {
    let dt = new Date();
    let key = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
    let authToken = document.querySelector("meta[name='csrf-token']").getAttribute("content");
    const data = {'authenticity_token' : authToken, 'link' : {'name': link}}
    window.localStorage.setItem(String(key), JSON.stringify(data));
  }

  function sendValueFromLocalStorageToDB() {
    for (let i = 0; i < localStorage.length; i++) {
      let storedValue = localStorage.key(i);
      $.ajax({
        url: '/links',
        data: JSON.parse(localStorage.getItem(storedValue)),
        type: "POST",
        success: function (){
          localStorage.removeItem(storedValue)
        }
      });
    }
    $("#success").show();
    setTimeout(function() { $("#success").hide(); }, 5500);
  }
});
