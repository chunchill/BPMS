/**
 * Created by jasperchiu on 3/19/16.
 */
(function (BPMS, $, amplify) {
   BPMS.Services = BPMS.Services || {};
   BPMS.Services.Utils = (function () {
      var restfulRequest = function (resourceId, url, options) {
         var serviceUrl = BPMS.config.serviceUrl;
         var token = window.localStorage.getItem("bpms_token");
         if (url.indexOf(serviceUrl) < 0)
            url = serviceUrl + url;
         amplify.request.define(resourceId, 'ajax', {
            type: 'get',
            dataType: "json",
            url: url,
            crossDomain: true,
            beforeSend: function (xhr) {
               xhr.setRequestHeader("authorization", token);
            }
         });

         return $.Deferred(function (dfd) {
            amplify.request({
               resourceId: resourceId,
               data: options,
               success: dfd.resolve,
               error: dfd.reject
            });
         }).promise();
      },
       restfulPost = function (resourceId, url, options) {
          var serviceUrl = BPMS.config.serviceUrl;
          var token = window.localStorage.getItem("bpms_token");
          if (url.indexOf(serviceUrl) < 0)
             url = serviceUrl + url;
          amplify.request.define(resourceId, 'ajax', {
             type: 'post',
             dataType: "json",
             url: url,
             contentType: "application/json;charset=UTF-8",
             crossDomain: true,
             beforeSend: function (xhr) {
                xhr.setRequestHeader("authorization", token);
             }
          });

          return $.Deferred(function (dfd) {
             amplify.request({
                resourceId: resourceId,
                data: JSON.stringify(options),
                success: dfd.resolve,
                error: dfd.reject
             });
          }).promise();
       },
           base64_encode = function (str) {
              var c1, c2, c3;
              var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
              var i = 0, len = str.length, string = '';

              while (i < len) {
                 c1 = str.charCodeAt(i++) & 0xff;
                 if (i == len) {
                    string += base64EncodeChars.charAt(c1 >> 2);
                    string += base64EncodeChars.charAt((c1 & 0x3) << 4);
                    string += "==";
                    break;
                 }
                 c2 = str.charCodeAt(i++);
                 if (i == len) {
                    string += base64EncodeChars.charAt(c1 >> 2);
                    string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                    string += base64EncodeChars.charAt((c2 & 0xF) << 2);
                    string += "=";
                    break;
                 }
                 c3 = str.charCodeAt(i++);
                 string += base64EncodeChars.charAt(c1 >> 2);
                 string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                 string += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
                 string += base64EncodeChars.charAt(c3 & 0x3F);
              }
              return string;
           },
           base64_decode = function (str) {
              var c1, c2, c3, c4;
              var base64DecodeChars = new Array(
                  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                  -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57,
                  58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6,
                  7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
                  25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
                  37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1,
                  -1, -1
              );
              var i = 0, len = str.length, string = '';

              while (i < len) {
                 do {
                    c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
                 } while (
                 i < len && c1 == -1
                     );

                 if (c1 == -1) break;

                 do {
                    c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
                 } while (
                 i < len && c2 == -1
                     );

                 if (c2 == -1) break;

                 string += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

                 do {
                    c3 = str.charCodeAt(i++) & 0xff;
                    if (c3 == 61)
                       return string;

                    c3 = base64DecodeChars[c3];
                 } while (
                 i < len && c3 == -1
                     );

                 if (c3 == -1) break;

                 string += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

                 do {
                    c4 = str.charCodeAt(i++) & 0xff;
                    if (c4 == 61) return string;
                    c4 = base64DecodeChars[c4];
                 } while (
                 i < len && c4 == -1
                     );

                 if (c4 == -1) break;

                 string += String.fromCharCode(((c3 & 0x03) << 6) | c4);
              }
              return string;
           },
           getAuthToken = function (username, password) {
              var rawStr = username + ':' + password;
              var encodeStr = base64_encode(rawStr);
              var token = "Basic " + encodeStr;
              return token;
           },
          handleUIControlItem = function(item){
             var formItem = {
                type: item.type,
                value: ko.observable(item.value),
                option: { name: item.name, id: item.id },
                enumValues: item.enumValues
             };
             if (formItem.type == "text") {
                formItem.option.data_clear_btn = true;
             }
             //jqm has a bug that id should be same as name for checkbox
             if (formItem.type == "bool" || formItem.type == "boolean") {
                keyValue[formItem.option.id] = formItem.option.name;
                formItem.option.id = formItem.option.name;
             }
             return formItem;
          };
      var getUrlParams = function (url) {
         var vars = [], hash;
         var hashes = url.slice(window.location.href.indexOf('?') + 1).split('&');
         for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
         }
         return vars;
      };
      var getUrlParam = function (url, key) {
         return getUrlParams(url)[key];
      };
      return {
         restfulRequest: restfulRequest,
         restfulPost: restfulPost,
         base64_encode: base64_encode,
         base64_decode: base64_decode,
         getAuthToken: getAuthToken,
         checkLoginStatus: function () {
            var user = localStorage.getItem("bpms_userId");
            if (!user)
               window.location.href = "RYlogin.html";
         },
         getUrlParams: getUrlParams,
         getUrlParam: getUrlParam,
         handleUIControlItem:handleUIControlItem
      };
   })();

})(window.BPMS = window.BPMS || {}, jQuery, amplify)