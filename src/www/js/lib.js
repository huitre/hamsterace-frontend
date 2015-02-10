/* 
    * @Author: joffrey.gohin
    * @Date:   2014-08-05 15:22:13
    * @Last Modified by:   joffrey.gohin
    * @Last Modified time: 2014-10-02 10:39:27
    */

    if (!window.$) {
      // shortcut to selector and creator
      window.E = function (elName) {
        elName = elName.trim()
        if (typeof elName === 'string' && elName[0] === '<') {
          var tmp = document.createElement('div')
          tmp.innerHTML = elName
          return tmp.firstChild
        }
        return document.createElement(elName)
      }

      // ajax
      window.ajax = function (options) {
        var xhr = new XMLHttpRequest(),
            method = options.method || 'GET',
            async = options.async || true,
            datas = new FormData();
        
        xhr.withCredentials = options.credentials || false;

        if (options.form) {
          options.form.$$('input').forEach(function (input) {
            datas.append(input.getAttribute('name'), input.value);
          })
          options.datas = [];
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

        this.send = function () {
          xhr.send(xhr.datas);
        }

        return this;
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
       * Adding forEach, map, reduce, slice to NodeList
       */
      var arrayMethods = Object.getOwnPropertyNames( Array.prototype );
      function attachArrayMethodsToNodeList(methodName)
      {
          NodeList.prototype[methodName] = Array.prototype[methodName];
      };
      arrayMethods.forEach( attachArrayMethodsToNodeList );


      /*
       * Adding $, $$ selector to an Array
       * Applied only if the elements are Element
       */
      Array.prototype.$ = function (selector) {
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
      }

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
    }