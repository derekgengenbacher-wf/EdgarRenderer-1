/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var ErrorsMinor = {
  
  unknownError : function( ) {
    var messageToUser = 'An Error has occured within the Inline XBRL Viewer.';
    var ec = document.getElementById('error-container');
    var div = document.createElement('div');
    div.className = 'alert-height alert alert-warning alert-dismissable show mb-0';
    div.textContent = messageToUser;
    var btn = document.createElement('button');
    btn.className = 'close';
    btn.setAttribute('data-dismiss', 'alert');
    btn.addEventListener('click', function(e) {Errors.updateMainContainerHeight(true)});
    var icon = document.createElement('i');
    icon.className = 'fas fa-times';
    btn.appendChild(icon);
    div.appendChild(btn);
    ec.appendChild(div);
    Errors.updateMainContainerHeight();
  },
  
  browserSuggestion : function( ) {
    var messageToUser = 'Using <a target="_blank" href="https://www.google.com/chrome/">Google Chrome</a> can help alleviate some of these performance issues.';
    var ec = document.getElementById('error-container');
    var div = document.createElement('div');
    div.className = 'alert-height alert alert-warning alert-dismissable show mb-0';
    div.textContent = messageToUser;
    var btn = document.createElement('button');
    btn.className = 'close';
    btn.setAttribute('data-dismiss', 'alert');
    btn.addEventListener('click', function(e) {Errors.updateMainContainerHeight(true)});
    var icon = document.createElement('i');
    icon.className = 'fas fa-times';
    btn.appendChild(icon);
    div.appendChild(btn);
    ec.appendChild(div);
    Errors.updateMainContainerHeight();
  },
  
  factNotFound : function( ) {
    var messageToUser = 'Inline XBRL can not locate the requested fact.';
    var ec = document.getElementById('error-container');
    var div = document.createElement('div');
    div.className = 'alert-height alert alert-warning alert-dismissable show mb-0';
    div.textContent = messageToUser;
    var btn = document.createElement('button');
    btn.className = 'close';
    btn.setAttribute('data-dismiss', 'alert');
    btn.addEventListener('click', function(e) {Errors.updateMainContainerHeight(true)});
    var icon = document.createElement('i');
    icon.className = 'fas fa-times';
    btn.appendChild(icon);
    div.appendChild(btn);
    ec.appendChild(div);
    Errors.updateMainContainerHeight();
  },
  
  continuedAt : function( ) {
    var messageToUser = 'Inline XBRL HTML Form is missing data to complete this action. This functionality has been removed.';
    var ec = document.getElementById('error-container');
    var div = document.createElement('div');
    div.className = 'alert-height alert alert-warning alert-dismissable show mb-0';
    div.textContent = messageToUser;
    var btn = document.createElement('button');
    btn.className = 'close';
    btn.setAttribute('data-dismiss', 'alert');
    btn.addEventListener('click', function(e) {Errors.updateMainContainerHeight(true)});
    var icon = document.createElement('i');
    icon.className = 'fas fa-times';
    btn.appendChild(icon);
    div.appendChild(btn);
    ec.appendChild(div);
    Errors.updateMainContainerHeight();
  },
  
  fileSize : function( ) {
    var messageToUser = 'Inline XBRL HTML Form is over ' + Constants.fileSizeError[1]
        + ', performance may be affected.';
    var ec = document.getElementById('error-container');
    var div = document.createElement('div');
    div.className = 'alert-height alert alert-warning alert-dismissable show mb-0';
    div.textContent = messageToUser;
    var btn = document.createElement('button');
    btn.className = 'close';
    btn.setAttribute('data-dismiss', 'alert');
    btn.addEventListener('click', function(e) {Errors.updateMainContainerHeight(true)});
    var icon = document.createElement('i');
    icon.className = 'fas fa-times';
    btn.appendChild(icon);
    div.appendChild(btn);
    ec.appendChild(div);
    Errors.updateMainContainerHeight();
    
    if ( !window.chrome ) {
      ErrorsMinor.browserSuggestion();
    }
  },
  
  metaLinksNotFound : function( fileName ) {
    
    var messageToUser = 'Inline XBRL viewing features are minimal because no supporting file was found.';
    var ec = document.getElementById('error-container');
    var div = document.createElement('div');
    div.className = 'alert-height alert alert-warning alert-dismissable show mb-0';
    div.textContent = messageToUser;
    var btn = document.createElement('button');
    btn.className = 'close';
    btn.setAttribute('data-dismiss', 'alert');
    btn.addEventListener('click', function(e) {Errors.updateMainContainerHeight(true)});
    var icon = document.createElement('i');
    icon.className = 'fas fa-times';
    btn.appendChild(icon);
    div.appendChild(btn);
    ec.appendChild(div);
    Errors.updateMainContainerHeight();
  },
  
  metaLinksInstance : function( fileName ) {
    
    var messageToUser = 'Inline XBRL viewing features are minimal because supporting file is not correct.';
    var ec = document.getElementById('error-container');
    var div = document.createElement('div');
    div.className = 'alert-height alert alert-warning alert-dismissable show mb-0';
    div.textContent = messageToUser;
    var btn = document.createElement('button');
    btn.className = 'close';
    btn.setAttribute('data-dismiss', 'alert');
    btn.addEventListener('click', function(e) {Errors.updateMainContainerHeight(true)});
    var icon = document.createElement('i');
    icon.className = 'fas fa-times';
    btn.appendChild(icon);
    div.appendChild(btn);
    ec.appendChild(div);
    Errors.updateMainContainerHeight();
  },
  
  metaLinksVersion : function( ) {
    
    var messageToUser = 'File found was not a MetaLinks version 2.0 file or higher.';
    var ec = document.getElementById('error-container');
    var div = document.createElement('div');
    div.className = 'alert-height alert alert-warning alert-dismissable show mb-0';
    div.textContent = messageToUser;
    var btn = document.createElement('button');
    btn.className = 'close';
    btn.setAttribute('data-dismiss', 'alert');
    btn.addEventListener('click', function(e) {Errors.updateMainContainerHeight(true)});
    var icon = document.createElement('i');
    icon.className = 'fas fa-times';
    btn.appendChild(icon);
    div.appendChild(btn);
    ec.appendChild(div);
    Errors.updateMainContainerHeight();
  },
  
  factNotActive : function( ) {
    
    var messageToUser = 'This fact is not apart of your active filter(s) and is not present in the Fact Menu.';
    var ec = document.getElementById('error-container');
    var div = document.createElement('div');
    div.className = 'alert-height alert alert-warning alert-dismissable show mb-0';
    div.textContent = messageToUser;
    var btn = document.createElement('button');
    btn.className = 'close';
    btn.setAttribute('data-dismiss', 'alert');
    btn.addEventListener('click', function(e) {Errors.updateMainContainerHeight(true)});
    var icon = document.createElement('i');
    icon.className = 'fas fa-times';
    btn.appendChild(icon);
    div.appendChild(btn);
    ec.appendChild(div);
    Errors.updateMainContainerHeight();
  }

};
