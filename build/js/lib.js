/* 
* @Author: joffrey.gohin
* @Date:   2014-08-05 15:22:13
* @Last Modified by:   huitre
* @Last Modified time: 2015-05-02 15:13:03
*/

!(function () {
  if (!window.H) {
    H = function () {return this};
    H.prototype.toApiUrl = function (e) {
      var action = e.currentTarget ? e.currentTarget.action : e;
      return action.replace(window.location.host, '').replace(window.location.protocol, '').replace('//', '');
    }
    /*
     * Various tools for dom manipulation and Ajax
     */
    // shortcut to selector and creator
    H.prototype.E = function (elName) {
      elName = elName.trim()
      if (typeof elName === 'string' && elName[0] === '<') {
        var tmp = document.createElement('div')
        tmp.innerHTML = elName
        return tmp.firstChild
      }
      return document.createElement(elName)
    }

    H.prototype.cookie = function (name, value, minutes) {
      if (arguments.length > 2) {
        var date = new Date(),
            expires = "";

        date.setTime(date.getTime()+(minutes * 60*1000));
        expires = "; expires="+date.toGMTString();
        document.cookie = name + "=" + value + expires +"; path=/";
      } else {
        var nameEQ = name + "=",
            ca = document.cookie.split(';');

        for(var i = 0, m = ca.length; i < m; ++i) {
          var c = ca[i];
          while (c.charAt(0)==' ') c = c.substring(1, c.length);
          if (c.indexOf(nameEQ) == 0) 
            return c.substring(nameEQ.length, c.length);
        }
      }
    }

    H.prototype.converter = function () {}
    H.prototype.converter.toKm =function (distance) {
      var i = 0,
          units = ['cm', 'm', 'km'];
      while (distance > 1000) {
        i++;
        distance = distance / 1000;
      }

      return Math.round(distance * 100) /100 + units[i];
    }

    // ajax
    H.prototype.ajax = function (options) {
      var xhr = new XMLHttpRequest(),
          method = options.method || 'GET',
          async = options.async || true,
          datas = new FormData();
      
      xhr.withCredentials = options.credentials || false;

      if (options.form) {
        options.form.$$('input').forEach(function (input) {
          datas.append(input.getAttribute('name'), input.value);
        })
        options.form.$$('textarea').forEach(function (input) {
          datas.append(input.getAttribute('name'), input.value);
        })
        options.datas = true;
        options.method = options.form.getAttribute('_method') || options.form.method;
        options.before = function () {
          /*options.form.$$('input').forEach(function (input) {
            input.value = '';
          })
          options.form.$$('textarea').forEach(function (input) {
            input.value = '';
          })*/
          options.form.$$('button').forEach(function (input) {
            input.addClass('loading');
          })
        }
      }

      if (options.progress) {
        xhr.onprogress = options.progress
      }
      
      if (options.headers) {
        options.headers.forEach(function (el, index) {
          for (var k in el)
            xhr.setRequestHeader(k, el[k])
        })
      }

      if (options.datas) {
        switch (options.type) {
          case 'json':
            if (typeof options.datas !== "string") {
              options.datas = JSON.stringify(options.datas)
            }
            datas.append('json', options.datas)
          break;
          default:
            var a = options.datas
            for (var k in a) {
              datas.append(k, a[k])
            }
          break;
        }
        xhr.datas = datas
        method = options.method || 'POST'
      }
      
      xhr.onreadystatechange = function (evt) {
        var responseText

        switch (xhr.readyState) {
          case 4:
            if (xhr.status == 302) {
              if (options.redirect)
                options.redirect(responseText, xhr, evt)
            } else if ((xhr.status == 200 || xhr.status == 0)) {
              if (options.type == 'json')
                try {
                  responseText = JSON.parse(xhr.responseText)
                } catch (e) {
                  responseText = xhr.responseText
                }
              if (options.success) {
                options.success(responseText, xhr, evt)
                if (options.form) {
                  options.form.$$('button').forEach(function (input) {
                    input.removeClass('loading');
                  })
                }
              }
            } else {
              if (options.error) {
                options.error(responseText, xhr, evt)
              }

            }
          break;
          case 3:
            if (options.before)
              options.before.apply(xhr, [options, xhr])
          break;
        }
      }

      if (options.url) {
        xhr.open(method, options.url, async)
      }

      if (options.error) {
        xhr.onerror = options.error
      }

      this.send = function () {
        xhr.send(xhr.datas);
      }

      return this;
    }
    window.H = new H;
  } else {
    throw new Error('Conflict between libraries, H already exists !');
  }


  window.$ = document.querySelector.bind(document)
  window.$$ = document.querySelectorAll.bind(document)

  Element.prototype.$ = Element.prototype.querySelector
  Element.prototype.$$ = Element.prototype.querySelectorAll

  /*
   * Find the closest parent element matching the specified selector
   */
  Element.prototype.closest = function (selector) {
    var p = this.parentElement,
      el = {}
    while (p) {
      el = p.$$(selector)
      if (el.length)
        return el
      p = p.parentElement
    }
    return {}
  }

  /*
   * Shortcut to manipulate class list
   * Allow Chaining
   */
  Element.prototype.addClass = function (className) {
    this.classList.add(className)
    return this
  }
  Element.prototype.removeClass = function (className) {
    this.classList.remove(className)
    return this
  }


  /*
   * Allow to addEventListener only once
   */
  Element.prototype.addEventOnce = function (eventName, callback) {
    if (this.hasOwnProperty(this.previousCallback))
      this.removeEventListener(eventName, this.previousCallback)
    if (!this.getAttribute('data-has-event')) {
      this.addEventListener(eventName, callback)
      this.setAttribute('data-has-event', true)
    }
    this.previousCallback = callback
  }

  /*
   * Adding $, $$ selector to an Array
   * Applied only if the elements are Element
   */
  /*Array.prototype.$ = function (selector) {
    if (this.length && 
      this[0].constructor.toString().match(/Element/)) {
      return Element.prototype.$.apply(this, [selector])
    }
    return null
  }
  Array.prototype.$$ = function (selector) {
    if (this.length && 
      this[0].constructor.toString().match(/Element/)) {
      return Element.prototype.$$.apply(this[0], [selector])
    }
    return null
  }*/

  /*
   * Adding forEach, map, reduce, slice to NodeList
   */
  var arrayMethods = Object.getOwnPropertyNames( Array.prototype );
  function attachArrayMethodsToNodeList(methodName)
  {
      NodeList.prototype[methodName] = Array.prototype[methodName];
  };
  arrayMethods.forEach( attachArrayMethodsToNodeList );

  /*
   * Adding $, $$ selector to NodeList
   */
  NodeList.prototype.$ = Array.prototype.$
  NodeList.prototype.$$ = Array.prototype.$$

  /*
   * Allow to apply a specified className to a NodeList
   * Allow Chaining
   */
  NodeList.prototype.addClass = function (className) {
    this.map(function (e) { e.addClass(className) })
    return this
  }

  /*
   * Allow to apply a specified className to a NodeList
   * Allow Chaining
   */
  NodeList.prototype.removeClass = function (className) {
    this.map(function (e) { e.removeClass(className) })
    return this
  }

  /*
   * AddEvent Listeners shortcut on NodeList
   * Allow Chaining
   */
  NodeList.prototype.on = function (eventName, callBack) {
    this.map(function (el, index) {
      el.addEventListener(eventName, callBack)
    })
    return this
  }

  Date.prototype.toFrenchDate = function () {
      var pad = function (n) {
        return n < 9 ? '0' + n : n;
      }
      return [
        [this.getDate(), this.getMonth(), this.getFullYear()].map(pad).join('-'),
        [this.getHours(), this.getMinutes(), this.getSeconds()].map(pad).join(':')
      ].join(' ')
  }



})()