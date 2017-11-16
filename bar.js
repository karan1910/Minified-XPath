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

// Constants.
var MOVE_COOLDOWN_PERIOD_MS = 400;
var X_KEYCODE = 88;

// Global variables.
var queryEl = document.getElementById('query');
var resultsEl = document.getElementById('results');
var nodeCountEl = document.getElementById('node-count');
var btn = document.getElementById('btnSave');

var nodeCountText = document.createTextNode('0');
nodeCountEl.appendChild(nodeCountText);

// Used by handleMouseMove() to enforce a cooldown period on move.
var lastMoveTimeInMs = 0;

var evaluateQuery = function() {
  console.log("evaluateQuery");
  chrome.runtime.sendMessage({
    type: 'evaluate',
    query: queryEl.value
  });
};

var handleRequest = function(request, sender, cb) {
  console.log("handleRequest");
  // Note: Setting textarea's value and text node's nodeValue is XSS-safe.
  if (request.type === 'update') {
    if (request.query !== null) {
      queryEl.value = request.query;
    }
    if (request.results !== null) {
      resultsEl.value = request.results[0];
      nodeCountText.nodeValue = request.results[1];  
    }
  }
};

var handleMouseMove = function(e) {
  console.log("handleMouseMove");
  if (e.shiftKey) {
    // Only move bar if we aren't in the cooldown period. Note, the cooldown
    // duration should take CSS transition time into consideration.
    var timeInMs = new Date().getTime();
    if (timeInMs - lastMoveTimeInMs < MOVE_COOLDOWN_PERIOD_MS) {
      return;
    }
    lastMoveTimeInMs = timeInMs;
    // Tell content script to move iframe to a different part of the screen.
    chrome.runtime.sendMessage({type: 'moveBar'});
  }
};

var handleKeyDown = function(e) {
  console.log("handleKeyDown");
  var ctrlKey = e.ctrlKey || e.metaKey;
  var shiftKey = e.shiftKey;
  if (e.keyCode === X_KEYCODE && ctrlKey && shiftKey) {
    chrome.runtime.sendMessage({type: 'hideBar'});
  }
};

function saveToFile(){
  function errorHandler(e) {
    var msg = '';
  
    switch (e.code) {
      case FileError.QUOTA_EXCEEDED_ERR:
        msg = 'QUOTA_EXCEEDED_ERR';
        break;
      case FileError.NOT_FOUND_ERR:
        msg = 'NOT_FOUND_ERR';
        break;
      case FileError.SECURITY_ERR:
        msg = 'SECURITY_ERR';
        break;
      case FileError.INVALID_MODIFICATION_ERR:
        msg = 'INVALID_MODIFICATION_ERR';
        break;
      case FileError.INVALID_STATE_ERR:
        msg = 'INVALID_STATE_ERR';
        break;
      default:
        msg = 'Unknown Error';
        break;
    };
  
    console.log('Error: ' + msg);
  }

  console.log("in save to file");
  window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
   window.requestFileSystem(window.TEMPORARY, 5*1024*1024, function(fs) {
    console.log("fs" + fs);
    fs.root.getFile('20171115log.txt', {create: true}, function(fileEntry) {
      // Create a FileWriter object for our FileEntry (log.txt).
      fileEntry.createWriter(function(fileWriter) {
        fileWriter.seek(fileWriter.length); // Start write position at EOF.
        // Create a new Blob and write it to log.txt.
        var blob = new Blob(['Hello World'], {type: 'text/plain'});
        fileWriter.write(blob);
        location.href = fileEntry.toURL();
      }, errorHandler);
    }, errorHandler);
  }, errorHandler);
}

queryEl.addEventListener('keyup', evaluateQuery);
queryEl.addEventListener('mouseup', evaluateQuery);

// Add mousemove listener so we can detect Shift + mousemove inside iframe.
document.addEventListener('mousemove', handleMouseMove);
// Add keydown listener so we can detect Ctrl-Shift-X and tell the content
// script to hide iframe and steal focus.
document.addEventListener('keydown', handleKeyDown);

chrome.runtime.onMessage.addListener(handleRequest);

btn.addEventListener('click', saveToFile);