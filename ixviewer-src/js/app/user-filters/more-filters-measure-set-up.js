/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var UserFiltersMoreFiltersMeasureSetUp = {
  filtersSet : false,
  
  measuresOptions : [ ],
  
  setMeasures : function( callback ) {
    var foundMeasures = document.getElementById('dynamic-xbrl-form').querySelectorAll('[unitref]');
    var foundMeasuresArray = Array.prototype.slice.call(foundMeasures);
    
    UserFiltersMoreFiltersMeasureSetUp.measuresOptions = foundMeasuresArray.map(function( current ) {
      return current.getAttribute('unitref');
    }).filter(function( element, index, array ) {
      return array.indexOf(element) === index;
    }).sort();
    
    document.getElementById('filters-measures-count').innerText = UserFiltersMoreFiltersMeasureSetUp.measuresOptions.length;
    
    UserFiltersMoreFiltersMeasureSetUp.populate();
    callback();
  },
  
  populate : function( ) {
    var elem = document.getElementById('user-filters-measures');
    elem.innerHTML = '';

    var innerHtml = '';
    UserFiltersMoreFiltersMeasureSetUp.measuresOptions.forEach(function( current, index ) {

      var outerDiv = document.createElement('div');
      var innerDiv = document.createElement('div');
      var input = document.createElement('input');
      var label = document.createElement('label');

      outerDiv.className = 'd-flex justify-content-between align-items-center w-100 px-2';
      innerDiv.className = 'form-check';
      input.className = 'form-check-input';
      label.className = 'form-check-label';

      input.type = 'checkbox';
      input.tabindex = 9;
      input.title = 'Select/Deselect this option.';
      // index is guaranteed to be numeric by way of forEach construction
      input.onclick = 'UserFiltersMoreFiltersMeasure.clickEvent(event, this, ' + index + ')'

      label.textContent = FiltersUnitref.getMeasure(current);

      innerDiv.appendChild(input);
      innerDiv.appendChild(label);
      outerDiv.appendChild(innerDiv);

      elem.appendChild(outerDiv);

    });
  }
};
