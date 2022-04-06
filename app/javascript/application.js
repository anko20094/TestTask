// Entry point for the build script in your package.json
import * as bootstrap from "bootstrap"

import 'jquery'
import Rails from "@rails/ujs"
import Turbolinks from "turbolinks"

var $ = require( "jquery" );
Rails.start()
Turbolinks.start()

$(document).on('turbolinks:load', function() {

  $(".btn").click(function () {
    let link = $("#link_name").val();

    if (validateUrl(link)) {
      link = takeHostOfLink(link);
      sendValueToDB(link);
      createNewTags(link);
    } else {
      alert("Enter the valid link, please!");
    }

  });

  function createNewTags(link) {
    $('<h4 class="text-center"></h4>').text(link).appendTo($('<div class="card-body">')
      .appendTo($('<article class="card mt-2">').prependTo($('#output'))));
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
      type: "POST"
    })
  }

  function takeHostOfLink(link) {
    if (link.search('www.') >= 0) {
      return link.split('www.')[1].split('/')[0]
    } else if (link.search('http') >= 0){
      return link.split('http://')[1].split('/')[0]
    } else {
      return link.split('/')[0]
    }
  }
});
