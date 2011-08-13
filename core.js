/**
 * By Oscar Godson ( @oscargodson / oscargodson.com )
 * License:http://www.opensource.org/licenses/mit-license.php
 */
var Core = function(){
  /**
   * Change these if you want
   */
  var settings = {
    widgetWrapperElement: 'div',
    prefixOnWidgetId: 'core-'
  }
  
  //change to "true" to get error logs in your console
  var errors = false
  ,   extensions = {}
  ,   listeners = {};
  
  /**
   * @description 
   * Core.extend() creates a new widget but doesn't actually run any code until Core.load() is
   * called. You can pass it parameters in the callback function so that you can set options
   * when you use Core.load().
   *
   * @argument {String} name  Name of your widget so that you can call .remove() and .load()
   * @argument {Function} func  The callback function to be called when .load() is invoked
   * @returns {Object} the Core
   */
  var extend = function(name,func){
    name = name || '';
    func = func || function(){};
    if(typeof extensions[name] == 'undefined'){
      extensions[name] = func;
    }
    else{
      if(errors){
        throw new Error('Core extend() error: the extension "'+name+'" already exists');
      }
    }
    return this;
  }
  
  /**
   * @description
   * Core.load() loads and runs a widget that was defined by Core.extend(). The options you
   * pass here will be run in the callback of the Core.extend() method. The location param is
   * optional, but if you are doing any DOM manipulation or attaching any event listeners you
   * should put a location.
   *
   * @argument {String} name  The name of your widget which you named with .extend()
   * @argument {String}{Object} params  Whatever you want to give back to extend() to use as params
   * @argument {Object}  sel  The optional param which places the generated HTML as a child of
   * @returns {Object} the Core
   */
  var load = function(name,params,sel){
    name = name || '';
    params = params || '';
    if(typeof extensions[name]  !== 'undefined'){
      if(sel){
        var widgetElement = document.createElement(settings.widgetWrapperElement);
        widgetElement.setAttribute('id',settings.prefixOnWidgetId+name);
        sel.appendChild(widgetElement);
      }
      extensions[name].call(widgetElement,params);
    }
    else{
      if(errors){
        throw new Error('Core load() error: the extension "'+name+'" doesn\'t exist');
      }
    }
    return this;
  }
  
  /**
   * @description
   * Core.remove() does what it says and completely removed a widget. If the widget was built
   * correctly all pushes, listens, and bound events will stop working since all of the widget's DOM
   * and code is completely removed.
   *
   * @param {String} name  The name of the extension you want to remove
   * @returns {Object} the Core
   */
  var remove = function(name){
    name = name || '';
    if(typeof extensions[name] !== 'undefined'){
      var el = document.getElementById(settings.prefixOnWidgetId+name)
      ,   elParent = el.parentNode;
      elParent.removeChild(el);
      delete extensions[name];
    }
    else{
      if(errors){
        throw new Error('Core remove() error: the extension "'+name+'" doesn\'t exist');
      }
    }
  }
  
  /**
   * @description
   * Push events make your code a lot cleaner and more flexible and allows you to interact with
   * other widgets without them ever having to know if you exist. When you call Core.push() it
   * tells all the Core.listen() methods to run their code. If the event never happens, such as
   * getting tweets and Twitter is down, a "timeline" widget would just never get updated and there
   * would be no JS errors.
   *
   * @param {String} name  The name of the event you want to push
   * @param {String}{Object} value  The value you want to send to .listen()
   * @returns {Object} the Core
   */
  var push = function(name, value){
    name = name || '';
    value = value || '';
    if(typeof listeners[name] !== 'undefined'){
      listeners[name].call(this,value);
    }
    else{
      if(errors){
        throw new Error('Core push() error: the extension "'+name+'" doesn\'t exist');
      }
    }
  }
  
  /**
   * @description
   * After a push is sent all Core.listen()s that are listening for that specific push's name are
   * notified and the callback is run. In the callback, the value of the push is returned.
   *
   * @param {String} name  The name of the push event you are listening for
   * @param {Function} callback  The function to invoke when the push event is sent
   * @returns {Object} the Core
   */
  var listen = function(name, callback){
    name = name || '';
    callback = callback || function(){};
    listeners[name] = callback;
  }
  
  return {
    extend:extend,
    load:load,
    remove:remove,
    push:push,
    listen:listen
  }
}();