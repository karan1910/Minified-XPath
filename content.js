/**
 * Copyright 2011 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @author opensource@google.com
 * @license Apache License, Version 2.0.
 */

'use strict';

// Extension namespace.
var xh = xh || {};
var docMain;
var originalXpath;
////////////////////////////////////////////////////////////
// Generic helper functions and constants

xh.SHIFT_KEYCODE = 16;
xh.X_KEYCODE = 88;

var bootstrap_classes = [
  'active',
  'affix',
  'alert',
  'alertanger',
  'alert-dismissable',
  'alert-info',
  'alert-link',
  'alert-success',
  'alert-warning',
  'badge',
  'bg-danger',
  'bg-info',
  'bg.primary',
  'bg-success',
  'bg-warning',
  'breadcrumb',
  'btn',
  'btn-block',
  'btn-danger',
  'btn-default',
  'btn-group',
  'btn-group-justified',
  'btn-group-lg',
  'btn-group-sm',
  'btn-group-xs',
  'btn-group-vertical',
  'btn-info',
  'btn-link',
  'btn-lg',
  'btn-primary',
  'btn-sm',
  'btn-success',
  'btn-warning',
  'btn-xs',
  'caption',
  'caret',
  'carousel',
  'carousel-caption',
  'carousel-control',
  'carousel-indicators',
  'carousel-inner',
  'center-block',
  'checkbox',
  'checkbox-inline',
  'clearfix',
  'close',
  'col-*-*',
  'col-*-offset-*',
  'col-*-pull-*',
  'col-*-push-*',
  'collapse',
  'in',
  'container',
  'container-fluid',	
  'control-label',
  'danger',
  'disabled',
  'divider',
  'dl-horizontal',
  'dropdown',
  'dropdown-header',
  'dropdown-menu',
  'dropdown-menu-right',
  'dropdown-toggle',
  'dropup',
  'embed-responsive',
  'embed-responsive-16by9',
  'embed-responsive-4by3',
  'embed-responsive-item',
  'fade',
  'form-control',
  'form-control-feedback',
  'form-control-static',
  'form-group',
  'form-inline',
  'form-horizontal',
  'glyphicon',
  'has-danger',
  'has-feedback',
  'has-success',
  'help-block',
  'hidden',
  'hidden-*',
  'hide',
  'icon-bar',
  'icon-next',
  'icon-prev',
  'img-circle',
  'img-responsive',
  'img-rounded',
  'img-thumbnail',
  'info',
  'initialism',
  'input-group',
  'input-group-lg',
  'input-group-sm',
  'input-group-addon',
  'input-group-btn',
  'input-lg',
  'input-sm',
  'invisible',
  'item',
  'jumbotron',
  'label',
  'label-danger',
  'label-info',
  'label-success',
  'label-warning',
  'lead',
  'left',
  'list-group',
  'list-group-item',
  'list-group-item-heading',
  'list-group-item-text',
  'list-group-item-danger',
  'list-group-item-info',
  'list-group-item-success',
  'list-group-item-warning',
  'list-inline',
  'list-unstyled',
  'mark',
  'media',
  'media-body',
  'media-heading',
  'media-list',
  'media-object',
  'modal',
  'modal-body',
  'modal-content',
  'modal-dialog',
  'modal-footer',
  'modal-header',
  'modal-lg',	
  'modal-sm',
  'modal-open',
  'modal-title',
  'nav-tabs',
  'nav',
  'navbar-nav',
  'nav-stacked',
  'nav-justified',
  'nav-tabs',
  'navbar',
  'navbar-brand',
  'navbar-btn',
  'navbar-collapse',
  'navbar-default',
  'navbar-fixed-bottom',
  'navbar-fixed-top',
  'navbar-form',
  'navbar-header',
  'navbar-inverse',
  'navbar-left',
  'navbar-link',
  'navbar-nav',
  'navbar-right',
  'navbar-static-top',
  'navbar-text',
  'navbar-toggle',
  'next',
  'page-header',
  'pagination',
  'pager',
  'pagination-lg',
  'pagination-sm',
  'panel',
  'panel-body',
  'panel-collapse',
  'panel-danger',
  'panel-info',
  'panel-success',
  'panel-warning',
  'panel-footer',
  'panel-group',
  'panel-heading',
  'panel-title',
  'popover',
  'pre-scrollable',
  'prev',
  'previous',
  'progress',
  'progress-bar',
  'progress-bar-danger',
  'progress-bar-info',
  'progress-bar-striped',
  'progress-bar-success',
  'progress-bar-warning',
  'pull-left',
  'pull-right',
  'right',
  'row',
  'show',
  'small',
  'sr-only',
  'sr-only-focusable',
  'success',
  'tab-content',
  'tab-pane',
  'table',
  'table-bordered',
  'table-condensed',
  'table-hover',
  'table-responsive',
  'text-capitalize',
  'text-center',
  'text-danger',
  'text-hide',
  'text-info',
  'text-justify',
  'text-left',
  'text-lowercase',
  'text-muted',
  'text-nowrap',
  'text-primary',
  'text-right',
  'text-success',
  'text-uppercase',
  'text-warning',
  'thumbnail',
  'tooltip',
  'visible-*',
  'visible-print-block',
  'visible-print-inline',
  'visible-print-block-inline',
  'hidden-print',
  'warning',
  'well',
  'well-lg',
  'well-sm'
];

function removeBootstrapClasses(Xpath){
  Xpath = Xpath.split('/');
  for(var idx = Xpath.length - 1; idx >= 0; idx--){
    if(Xpath[idx].includes('@class')){
      //if an element consists of index, we can't use contains with it.
      if(!hasIndex(Xpath[idx])){
        var classes = extractClasses(Xpath[idx]);
        var unremovedClasses = [];
        var sz = classes.length;
        for(var i = 0; i < classes.length; i++){
            var cls = classes[i];
            if(sz === 1){
                unremovedClasses.push(cls);
                break;
            }
            if(!bootstrap_classes.includes(cls)){
                sz--;
                unremovedClasses.push(cls);
            }
        }
        Xpath[idx] = addClassToElement(Xpath[idx], unremovedClasses);
      }
    }
  }
  return Xpath.join('/');
}

function getText(xpath){
  let results = [];
  let query = document.evaluate(xpath, document,
      null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  if(query.snapshotLength > 1 || query.snapshotLength == 0){
    return "";
  }
  if(query.snapshotItem(0).children && query.snapshotItem(0).children.length > 0){
    return "";
  }
  if(query.snapshotItem(0).outerText){
    return query.snapshotItem(0).outerText;
  }
  return "";
}

function makeValidXpath(xpath){
  xpath = xpath.replace('///', '//');
  xpath = xpath.replace('[[', '[');
  xpath = xpath.replace(']]', ']');
  return xpath;
}

function getElementsCount(xpath){
  var query = document.evaluate(xpath,
    document,
      null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  return query.snapshotLength;
}

function getElementsByXPath(xpath, parent){
  if(xpath.length > 0){
    let results = [];
    let query = document.evaluate(xpath,
        parent || document,
        null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    return query.snapshotItem(0);
  }
  return "";
}

function getTextArr(classes){ 
  var clonedArr = classes.slice();
  var textArr = [];
  for(var i = clonedArr.length - 1; i >= 1; i--){
    var xpath = clonedArr.join("/");
    var text = getText(xpath);
    textArr.splice(0, 0, text);
    clonedArr.splice(clonedArr.length - 1, 1);
  }
  textArr.splice(0, 0, "");
  return textArr;
}

function hasIndex(element){
  return (element.indexOf('[') !== element.lastIndexOf('['));
}

function mainAlgo(xpath){
  var classes = xpath.split('/');
  var textOfElements = getTextArr(classes);
  var finalAttributes = [];
  for(var i = 2, j = classes.length - 1; i < j; i++, j--){
    if(textOfElements[i].length > 0){
      var elementName = classes[i].substring(0, classes[i].indexOf('['));
      if(elementName == ""){
        elementName = classes[i];
      }
      finalAttributes.splice(i - 2, 0, elementName + '[text() = "'+ textOfElements[i] + '"]');
      if(check(finalAttributes)){
        return makeXpathFromArr(finalAttributes);
      }
      var indexToPutText = classes[i].indexOf('[');
      finalAttributes[i - 2] = classes[i].substring(0, indexToPutText + 1) + 'text() = "' + textOfElements[i] +
                              '" and ' + classes[i].substring(indexToPutText + 1, classes[i].length);
      if(check(finalAttributes)){
        return makeXpathFromArr(finalAttributes);
      }
    }
    else{
      finalAttributes.splice(i - 2, 0, classes[i]);
      if(check(finalAttributes)){
        return makeXpathFromArr(finalAttributes);
      }
    }
    if(textOfElements[j].length > 0){
      var elementName = classes[j].substring(0, classes[j].indexOf('['));
      if(elementName == ""){
        elementName = classes[j];
      }
      finalAttributes.splice(finalAttributes.length - i + 2, 0, elementName + '[text() = "'+ textOfElements[j] + '"]');
      if(check(finalAttributes)){
        return makeXpathFromArr(finalAttributes);
      }
      var indexToPutText = classes[j].indexOf('[');
      finalAttributes[finalAttributes.length - i + 1] = classes[j].substring(0, indexToPutText + 1) + 'text() = "' + textOfElements[j] +
                              '" and ' + classes[j].substring(indexToPutText + 1, classes[j].length);
      if(check(finalAttributes)){
        return makeXpathFromArr(finalAttributes);
      }
    }
    else{
      finalAttributes.splice(finalAttributes.length - i + 2, 0, classes[j]);
      if(check(finalAttributes)){
        return makeXpathFromArr(finalAttributes);
      }
    }
  }
  return xpath;
}

function makeXpathFromArr(arr){
  var clonedArr = arr.slice();
  clonedArr.splice(0, 0, "");
  clonedArr = clonedArr.join("//");
  clonedArr = makeValidXpath(clonedArr);
  return clonedArr;
}

function check(arr){
  var xpath = makeXpathFromArr(arr);
  if(getElementsByXPath(xpath) === getElementsByXPath(originalXpath) && getElementsCount(xpath) === 1){
    return true;
  }
  return false;
}

function removeExtraClasses(xpath){
  var elements = xpath.split('//');
  elements.splice(0, 1);
  for(var i = 0; i < elements.length; i++){
    if(elements[i].includes('and')){
      if(!hasIndex(elements[i])){
        var initialElement = elements[i];
        var str = elements[i];
        var regex = / and /gi, result, indices = [];
        while ((result = regex.exec(str)) ) {
            indices.push(result.index);
        }
        indices.push(elements[i].length);
        for(var j = 0; j < indices.length; j++){
          var newElement = initialElement.substring(0, indices[j]);
          newElement = newElement + ']';
          elements[i] = newElement;
          if(check(elements)){
            break;
          }
        }
      }
    }
  }
  return makeXpathFromArr(elements);
}

function updatedXpath(xpath){
  xpath = minimizeXpath(xpath);
  var minifiedXpathByGoogle = xpath;
  xpath = removeBootstrapClasses(xpath);
  // var elementsLength = getElementsCount(xpath);
  // Result upto now is "//*[@id="ribbon-tab-Home"]/div[contains(@class, "karan") and contains(@class, "arora")][2]/li[contains(@class, "23")][3]"
  
  xpath = mainAlgo(xpath);
  // Result upto now is "//*[@id="ribbon-tab-Home"]//li[contains(@class, "23") and contains(@class, "423423")][3]"

  xpath = removeExtraClasses(xpath);
  if(getElementsCount(xpath) === 1){
    return xpath;
  }
  return minifiedXpathByGoogle;
}

function extractClasses(element){
  var updatedElement = element;
  updatedElement = updatedElement.substring(updatedElement.indexOf("'") + 1, updatedElement.lastIndexOf("'"));
  updatedElement = updatedElement.split(' ');
  return updatedElement;
}

function addClassToElement(element, classes){
  var template = "contains(@class, '{class_name}')";
  var res = [];
  for(var i = 0; i < classes.length; i++){
    if(classes[i] === ' '){
      continue;
    }
    var tmp = "contains(@class, '" + classes[i] + "')";
    res.push(tmp);
  }
  res = res.join(' and ');
  res = '[' + res + ']';
  var elemntName = element.substring(0, element.indexOf('['));
  res = elemntName + res;
  return res;
}

var minimizeXpath = function(Xpath){
  if(!Xpath || Xpath == null){
    return Xpath;
  }
  var updatedXpath = '';
  Xpath = Xpath.split('/');
  var pos = -1;
  for(var idx = Xpath.length - 1; idx >= 0; idx--){
      if(Xpath[idx].includes('@id')){
          pos = idx;
          break;
      }
  }
  if(pos !== -1){
      Xpath.splice(0, pos);
  }
  Xpath = Xpath.join('/');
  Xpath = '//' + Xpath;    
  return Xpath;
}

xh.elementsShareFamily = function(primaryEl, siblingEl) {
  var p = primaryEl, s = siblingEl;
  return (p.tagName === s.tagName &&
          (!p.className || p.className === s.className) &&
          (!p.id || p.id === s.id));
};

xh.getElementIndex = function(el) {
  var index = 1;  // XPath is one-indexed
  var sib;
  for (sib = el.previousSibling; sib; sib = sib.previousSibling) {
    if (sib.nodeType === Node.ELEMENT_NODE && xh.elementsShareFamily(el, sib)) {
      index++;
    }
  }
  if (index > 1) {
    return index;
  }
  for (sib = el.nextSibling; sib; sib = sib.nextSibling) {
    if (sib.nodeType === Node.ELEMENT_NODE && xh.elementsShareFamily(el, sib)) {
      return 1;
    }
  }
  return 0;
};

xh.makeQueryForElement = function(el) {
  var query = '';
  for (; el && el.nodeType === Node.ELEMENT_NODE; el = el.parentNode) {
    var component = el.tagName.toLowerCase();
    var index = xh.getElementIndex(el);
    if (el.id) {
      component += '[@id=\'' + el.id + '\']';
    } else if (el.className) {
      component += '[@class=\'' + el.className + '\']';
    }
    if (index >= 1) {
      component += '[' + index + ']';
    }
    // If the last tag is an img, the user probably wants img/@src.
    if (query === '' && el.tagName.toLowerCase() === 'img') {
      component += '/@src';
    }
    query = '/' + component + query;
  }
  originalXpath = query;
  query = updatedXpath(query);
  return query;
};

xh.highlight = function(els) {
  for (var i = 0, l = els.length; i < l; i++) {
    els[i].classList.add('xh-highlight');
  }
};

xh.clearHighlights = function() {
  docMain = document;
  var els = document.querySelectorAll('.xh-highlight');
  for (var i = 0, l = els.length; i < l; i++) {
    els[i].classList.remove('xh-highlight');
  }
};

// Returns [values, nodeCount]. Highlights result nodes, if applicable. Assumes
// no nodes are currently highlighted.
xh.evaluateQuery = function(query) {
  var xpathResult = null;
  var str = '';
  var nodeCount = 0;
  var toHighlight = [];

  try {
    xpathResult = document.evaluate(query, document, null,
                                    XPathResult.ANY_TYPE, null);
  } catch (e) {
    str = '[INVALID XPATH EXPRESSION]';
    nodeCount = 0;
  }

  if (!xpathResult) {
    return [str, nodeCount];
  }

  if (xpathResult.resultType === XPathResult.BOOLEAN_TYPE) {
    str = xpathResult.booleanValue ? '1' : '0';
    nodeCount = 1;
  } else if (xpathResult.resultType === XPathResult.NUMBER_TYPE) {
    str = xpathResult.numberValue.toString();
    nodeCount = 1;
  } else if (xpathResult.resultType === XPathResult.STRING_TYPE) {
    str = xpathResult.stringValue;
    nodeCount = 1;
  } else if (xpathResult.resultType ===
             XPathResult.UNORDERED_NODE_ITERATOR_TYPE) {
    for (var node = xpathResult.iterateNext(); node;
         node = xpathResult.iterateNext()) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        toHighlight.push(node);
      }
      if (str) {
        str += '\n';
      }
      str += node.textContent;
      nodeCount++;
    }
    if (nodeCount === 0) {
      str = '[NULL]';
    }
  } else {
    // Since we pass XPathResult.ANY_TYPE to document.evaluate(), we should
    // never get back a result type not handled above.
    str = '[INTERNAL ERROR]';
    nodeCount = 0;
  }

  xh.highlight(toHighlight);
  return [str, nodeCount];
};

////////////////////////////////////////////////////////////
// xh.Bar class definition

xh.Bar = function() {
  this.boundHandleRequest_ = this.handleRequest_.bind(this);
  this.boundMouseMove_ = this.mouseMove_.bind(this);
  this.boundKeyDown_ = this.keyDown_.bind(this);

  this.inDOM_ = false;
  this.currEl_ = null;

  this.barFrame_ = document.createElement('iframe');
  this.barFrame_.src = chrome.runtime.getURL('bar.html');
  this.barFrame_.id = 'xh-bar';
  // Init to hidden so first showBar_() triggers fade-in.
  this.barFrame_.classList.add('hidden');

  document.addEventListener('keydown', this.boundKeyDown_);
  chrome.runtime.onMessage.addListener(this.bound
  
  
  );
};

xh.Bar.prototype.hidden_ = function() {
  return this.barFrame_.classList.contains('hidden');
};

xh.Bar.prototype.updateQueryAndBar_ = function(el) {
  xh.clearHighlights();
  this.query_ = el ? xh.makeQueryForElement(el) : '';
  this.updateBar_(true);
};

xh.Bar.prototype.updateBar_ = function(updateQuery) {
  var results = this.query_ ? xh.evaluateQuery(this.query_) : ['', 0];
  chrome.runtime.sendMessage({
    type: 'update',
    query: updateQuery ? this.query_ : null,
    results: results
  });
};

xh.Bar.prototype.showBar_ = function() {
  var that = this;
  function impl() {
    that.barFrame_.classList.remove('hidden');
    document.addEventListener('mousemove', that.boundMouseMove_);
    that.updateBar_(true);
  }
  if (!this.inDOM_) {
    this.inDOM_ = true;
    document.body.appendChild(this.barFrame_);
  }
  window.setTimeout(impl, 0);
};

xh.Bar.prototype.hideBar_ = function() {
  var that = this;
  function impl() {
    that.barFrame_.classList.add('hidden');
    document.removeEventListener('mousemove', that.boundMouseMove_);
    xh.clearHighlights();
  }
  window.setTimeout(impl, 0);
};

xh.Bar.prototype.toggleBar_ = function() {
  if (this.hidden_()) {
    this.showBar_();
  } else {
    this.hideBar_();
  }
};

xh.Bar.prototype.handleRequest_ = function(request, sender, cb) {
  if (request.type === 'evaluate') {
    xh.clearHighlights();
    this.query_ = request.query;
    this.updateBar_(false);
  } else if (request.type === 'moveBar') {
    // Move iframe to a different part of the screen.
    this.barFrame_.classList.toggle('bottom');
  } else if (request.type === 'hideBar') {
    this.hideBar_();
    window.focus();
  } else if (request.type === 'toggleBar') {
    this.toggleBar_();
  }
};

xh.Bar.prototype.mouseMove_ = function(e) {
  if (this.currEl_ === e.toElement) {
    return;
  }
  this.currEl_ = e.toElement;
  if (e.shiftKey) {
    this.updateQueryAndBar_(this.currEl_);
  }
};

xh.Bar.prototype.keyDown_ = function(e) {
  var ctrlKey = e.ctrlKey || e.metaKey;
  var shiftKey = e.shiftKey;
  if (e.keyCode === xh.X_KEYCODE && ctrlKey && shiftKey) {
    this.toggleBar_();
  }
  // If the user just pressed Shift and they're not holding Ctrl, update query.
  // Note that we rely on the mousemove handler to have updated this.currEl_.
  // Also, note that checking e.shiftKey wouldn't work here, since Shift is the
  // key that triggered this event.
  if (!this.hidden_() && !ctrlKey && e.keyCode === xh.SHIFT_KEYCODE) {
    this.updateQueryAndBar_(this.currEl_);
  }
};

////////////////////////////////////////////////////////////
// Initialization code

if (location.href.indexOf('acid3.acidtests.org') === -1) {
  console.log("wdadwdawdawdawdaw");
  window.xhBarInstance = new xh.Bar();
}