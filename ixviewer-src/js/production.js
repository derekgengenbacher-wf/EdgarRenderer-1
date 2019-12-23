/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var AjaxForm = {
  
  init : function( callback ) {
    
    if ( HelpersUrl.getAllParams ) {
      var input = HelpersUrl.getAllParams['doc'];
      document.getElementById('dynamic-xbrl-form').innerHTML = '';
      document.getElementById('xbrl-form-loading').classList.remove('d-none');
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function( event ) {
        if ( xhr['readyState'] === 4 ) {
          if ( xhr['status'] === 200 ) {
            
            if ( (xhr.getResponseHeader('Content-Length') || xhr.getResponseHeader('Content-Encoding')) ) {
              Errors.checkFileSizeForLimits(xhr.response.length);
            }
            
            var regex = /<html[^>]*>/;
            
            var result = xhr.response.match(regex);
            
            if ( result && result[0] ) {
              
              ConstantsFunctions.setHTMLAttributes(result[0].replace(/(\r\n|\n|\r)/gm, ' ').trim());
            } else {
              ErrorsMinor.unknownError();
            }
            
            document.getElementById('dynamic-xbrl-form').innerHTML = event['currentTarget']['response'];
            
            ConstantsFunctions.setHTMLPrefix();
            
            document.getElementById('xbrl-form-loading').classList.add('d-none');
            
            callback(true);
          } else {
            document.getElementById('xbrl-form-loading').className += ' d-none';
            callback(false);
          }
          
        }
      };
      
      xhr.open('GET', input, true);
      xhr.send();
    } else {
      document.getElementById('xbrl-form-loading').className += ' d-none';
      callback(false);
    }
    
  }

};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var AjaxMeta = {
  
  init : function( callback ) {
    if ( HelpersUrl.getAllParams ) {
      var xhr = new XMLHttpRequest();
      
      xhr.onreadystatechange = function( event ) {
        if ( xhr['readyState'] === 4 ) {
          if ( xhr['status'] === 200 ) {
            var response = JSON.parse(event['target']['response']);
            AjaxMeta.setInstance(response, event['target']['responseURL'], function( result ) {
              callback(result);
            });
          } else {
            
            document.getElementById('xbrl-form-loading').classList.add('d-none');
            
            ErrorsMinor.metaLinksNotFound(event['target']['responseURL']);
            
            callback(false);
          }
        }
      }

      xhr.open('GET', HelpersUrl.getAllParams['metalinks'], true);
      xhr.send();
    } else {
      callback(false);
    }
  },
  
  setInstance : function( input, metaFileLink, callback ) {
    if ( HelpersUrl.getAllParams['doc-file']
        && (Object.keys(input['instance'])[0].indexOf(HelpersUrl.getAllParams['doc-file']) > -1) ) {
      
      // we are good to proceed
      ConstantsFunctions.setMetaSourceDocumentsThenFixLinks(Object.keys(input['instance'])[0]);
      ConstantsFunctions.setMetaTags(input['instance'][Object.keys(input['instance'])[0]]['tag']);
      ConstantsFunctions.setMetaEntityCounts(input['instance'][Object.keys(input['instance'])[0]]);
      ConstantsFunctions.setMetaReports(input['instance'][Object.keys(input['instance'])[0]]['report']);
      ConstantsFunctions.setMetaStandardReference(input['std_ref']);
      ConstantsFunctions.setMetaVersion(input['version']);
      ConstantsFunctions.setMetaCustomPrefix(input['instance'][Object.keys(input['instance'])[0]]);
      ConstantsFunctions.setMetaDts(input['instance'][Object.keys(input['instance'])[0]]['dts']);
      ConstantsFunctions.setMetaHidden(input['instance'][Object.keys(input['instance'])[0]]['hidden']);
      callback(true);
    } else {
      // MetaLinks.json does not have this file as a key, hence we have an issue
      ErrorsMinor.metaLinksInstance(metaFileLink);
      callback(false);
    }
  }

};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var ConstantsDate = {

	getDuration : function(input) {
		var float = parseFloat(input);

		if (float === NaN)
			return {
				negative : false,
				value : null,
				error : true
			};
		var negative = false;
		if (float !== NaN && float < 0)
			negative = true;
		return {
			negative : negative,
			value : Math.abs(float),
			error : false
		};
	},

	eraStart : {
		'\u4EE4\u548C' : 2018,
		'\u4EE4' : 2018,
		'\u5E73\u6210' : 1988,
		'\u5E73' : 1988,
		'\u660E\u6CBB' : 1867,
		'\u660E' : 1867,
		'\u5927\u6B63' : 1911,
		'\u5927' : 1911,
		'\u662D\u548C' : 1925,
		'\u662D' : 1925
	},

	gregorianLastMoDay : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],

	sakaMonthLength : [30, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30],

	sakaMonthOffset : [[3, 22, 0], [4, 21, 0], [5, 22, 0], [6, 22, 0],
			[7, 23, 0], [8, 23, 0], [9, 23, 0], [10, 23, 0], [11, 22, 0],
			[12, 22, 0], [1, 21, 1], [2, 20, 1]],

	getLastDayInMonth : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],

	getGregorianHindiMonthNumber : {
		'\u091C\u0928\u0935\u0930\u0940' : '01',
		'\u092B\u0930\u0935\u0930\u0940' : '02',
		'\u092E\u093E\u0930\u094D\u091A' : '03',
		'\u0905\u092A\u094D\u0930\u0948\u0932' : '04',
		'\u092E\u0908' : '05',
		'\u091C\u0942\u0928' : '06',
		'\u091C\u0941\u0932\u093E\u0908' : '07',
		'\u0905\u0917\u0938\u094D\u0924' : '08',
		'\u0938\u093F\u0924\u0902\u092C\u0930' : '09',
		'\u0905\u0915\u094D\u0924\u0942\u092C\u0930' : '10',
		'\u0928\u0935\u092E\u094D\u092C\u0930' : '11',
		'\u0926\u093F\u0938\u092E\u094D\u092C\u0930' : '12'
	},

	getSakaMonthNumber : {
		'Chaitra' : 1,
		'\u091A\u0948\u0924\u094D\u0930' : 1,
		'Vaisakha' : 2,
		'Vaishakh' : 2,
		'Vai\u015B\u0101kha' : 2,
		'\u0935\u0948\u0936\u093E\u0916' : 2,
		'\u092C\u0948\u0938\u093E\u0916' : 2,
		'Jyaishta' : 3,
		'Jyaishtha' : 3,
		'Jyaistha' : 3,
		'Jye\u1E63\u1E6Dha' : 3,
		'\u091C\u094D\u092F\u0947\u0937\u094D\u0920' : 3,
		'Asadha' : 4,
		'Ashadha' : 4,
		'\u0100\u1E63\u0101\u1E0Dha' : 4,
		'\u0906\u0937\u093E\u0922' : 4,
		'\u0906\u0937\u093E\u0922\u093C' : 4,
		'Sravana' : 5,
		'Shravana' : 5,
		'\u015Ar\u0101va\u1E47a' : 5,
		'\u0936\u094D\u0930\u093E\u0935\u0923' : 5,
		'\u0938\u093E\u0935\u0928' : 5,
		'Bhadra' : 6,
		'Bhadrapad' : 6,
		'Bh\u0101drapada' : 6,
		'Bh\u0101dra' : 6,
		'Pro\u1E63\u1E6Dhapada' : 6,
		'\u092D\u093E\u0926\u094D\u0930\u092A\u0926' : 6,
		'\u092D\u093E\u0926\u094B' : 6,
		'Aswina' : 7,
		'Ashwin' : 7,
		'Asvina' : 7,
		'\u0100\u015Bvina' : 7,
		'\u0906\u0936\u094D\u0935\u093F\u0928' : 7,
		'Kartiak' : 8,
		'Kartik' : 8,
		'Kartika' : 8,
		'K\u0101rtika' : 8,
		'\u0915\u093E\u0930\u094D\u0924\u093F\u0915' : 8,
		'Agrahayana' : 9,
		'Agrah\u0101ya\u1E47a' : 9,
		'Margashirsha' : 9,
		'M\u0101rga\u015B\u012Br\u1E63a' : 9,
		'\u092E\u093E\u0930\u094D\u0917\u0936\u0940\u0930\u094D\u0937' : 9,
		'\u0905\u0917\u0939\u0928' : 9,
		'Pausa' : 10,
		'Pausha' : 10,
		'Pau\u1E63a' : 10,
		'\u092A\u094C\u0937' : 10,
		'Magha' : 11,
		'Magh' : 11,
		'M\u0101gha' : 11,
		'\u092E\u093E\u0918' : 11,
		'Phalguna' : 12,
		'Phalgun' : 12,
		'Ph\u0101lguna' : 12,
		'\u092B\u093E\u0932\u094D\u0917\u0941\u0928' : 12
	},

	// Chaitra has 31 days in Gregorian leap year
	getSakaMonthLength : [30, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30],

	getSakaMonthOffset : [[3, 22, 0], [4, 21, 0], [5, 22, 0], [6, 22, 0],
			[7, 23, 0], [8, 23, 0], [9, 23, 0], [10, 23, 0], [11, 22, 0],
			[12, 22, 0], [1, 21, 1], [2, 20, 1]],

	getEraStart : {
		'\u5E73\u6210' : 1988,
		'\u5E73' : 1988,
		'\u660E\u6CBB' : 1867,
		'\u660E' : 1867,
		'\u5927\u6B63' : 1911,
		'\u5927' : 1911,
		'\u662D\u548C' : 1925,
		'\u662D' : 1925
	},

	// functions

	getSakaYearPadding : function(year, month, day) {
		// zero pad to 4 digits

		if (year && typeof year !== 'boolean' && typeof year !== 'object'
				&& (typeof year === 'string' || !isNaN(year))) {
			if (typeof year === 'number') {
				year = year.toString();
			}
			if (year.length === 2) {
				if (year > '21' || (year === '21' && month >= 10 && day >= 11)) {
					return '19' + year;
				} else {
					return '20' + year;
				}
			}
			return year;
		} else {
			return null;
		}
	},

	getSakaToGregorian : function(inputYear, inputMonth, inputDay) {
		if (typeof inputYear === 'number' && typeof inputMonth === 'number'
				&& typeof inputDay === 'number') {

			// offset from Saka to Gregorian year
			var gregorianYear = inputYear + 78;
			// Saka year starts in leap year
			var sStartsInLeapYr = (gregorianYear % 4 === 0 && (gregorianYear % 100 !== 0 || gregorianYear % 400 === 0));
			if (gregorianYear < 0) {
				return 'Saka calendar year not supported: ' + inputYear + ' '
						+ inputMonth + ' ' + inputDay;
			}
			if (inputMonth < 1 || inputMonth > 12) {
				return 'Saka calendar month error: ' + inputYear + ' '
						+ inputMonth + ' ' + inputDay;
			}
			var inputMonthLength = ConstantsDate.sakaMonthLength[inputMonth - 1];
			if (sStartsInLeapYr && inputMonth === 1) {
				// Chaitra has 1 extra day when starting in gregorian leap years
				inputMonthLength += 1;
			}
			if (inputDay < 1 || inputDay > inputMonthLength) {
				return 'Saka calendar day error: ' + inputYear + ' '
						+ inputMonth + ' ' + inputDay;
			}
			// offset Saka to Gregorian by Saka month
			var sakaMonthOffset = ConstantsDate.sakaMonthOffset[inputMonth - 1];
			var gregorianMonth = sakaMonthOffset[0];
			var gregorianDayOffset = sakaMonthOffset[1];
			var gregorianYearOffset = sakaMonthOffset[2];
			if (sStartsInLeapYr && inputMonth === 1) {
				// Chaitra starts 1 day earlier when starting in Gregorian leap
				// years
				gregorianDayOffset -= 1;
			}
			// later Saka months offset into next Gregorian year
			gregorianYear += gregorianYearOffset;
			// month length (days in month)
			var gregorianMonthLength = ConstantsDate.gregorianLastMoDay[gregorianMonth - 1];
			// does Phalguna (Feb) end in a Gregorian leap year?
			if (gregorianMonth === 2 && gregorianYear % 4 === 0
					&& (gregorianYear % 100 !== 0 || gregorianYear % 400 === 0)) {
				// Phalguna (Feb) is in a Gregorian leap year (Feb has 29 days)
				gregorianMonthLength += 1;
			}
			var gregorianDay = gregorianDayOffset + inputDay - 1;
			if (gregorianDay > gregorianMonthLength) {
				// overflow from Gregorial month of start of Saka month to next
				// Gregorian
				// month
				gregorianDay -= gregorianMonthLength;
				gregorianMonth += 1;
				if (gregorianMonth === 13) {
					// overflow from Gregorian year of start of Saka year to
					// following
					// Gregorian year
					gregorianMonth = 1;
					gregorianYear += 1;
				}
			}
			return gregorianYear + '-' + gregorianMonth + '-' + gregorianDay;
		} else {
			return null;
		}
	}
};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var ConstantsFunctions = {
  
  setHTMLAttributes : function( input ) {
    
    if ( typeof input === 'string' && input.length > 0 ) {
      var temp = {};
      var arrayToLoopOver = input.split(' ');
      arrayToLoopOver.forEach(function( current ) {
        if ( current.indexOf('=') >= 0 ) {
          var nameSpaceArray = current.split('=');
          temp[nameSpaceArray[0].trim()] = nameSpaceArray[1].trim().replace('>', '').replace(/["']/g, '');
        }
      });
      Constants.getHTMLAttributes = temp;
      ConstantsFunctions.setFormattingObject(temp);
      return true;
    } else {
      return null;
    }
  },
  
  setMetaSourceDocumentsThenFixLinks : function( input ) {
    if ( typeof input === 'string' ) {
      Constants.getMetaSourceDocuments = input.split(' ');
      
    } else {
      return null;
    }
  },
  
  setHTMLPrefix : function( ) {
    
    for ( var option in Constants.getHTMLAttributes ) {
      
      if ( Constants.getHTMLAttributes[option] === 'http://www.xbrl.org/2013/inlineXBRL' ) {
        
        Constants.getHtmlPrefix = option.split(':')[1];
        break;
      }
    }
  },
  
  setMetaTags : function( input ) {
    
    if ( input && (typeof input === 'object') && !Array.isArray(input) ) {
      var tagsAsArray = [ ];
      for ( var i = 0; i < Object.keys(input).length; i++ ) {
        
        if ( Object.keys(input)[i] ) {
          input[Object.keys(input)[i]]['original-name'] = Object.keys(input)[i];
          tagsAsArray.push(input[Object.keys(input)[i]]);
        } else {
          return null;
        }
      }
      Constants.getMetaTags = tagsAsArray;
      ConstantsFunctions.setMetaCalculationsParentTags();
    } else {
      return null;
    }
  },
  
  setMetaCalculationsParentTags : function( ) {
    var tempMetaCalculation = [ ];
    Constants.getMetaTags.forEach(function( current ) {
      if ( current && current['calculation'] ) {
        tempMetaCalculation.push(current['original-name']);
      }
    });
    
    Constants.getMetaCalculationsParentTags = tempMetaCalculation.filter(function( element, index, array ) {
      return (array.indexOf(element) === index);
    });
    
  },
  
  setMetaEntityCounts : function( input ) {
    if ( input && (typeof input === 'object') && !Array.isArray(input) ) {
      var entityObject = {
        'keyStandard' : input['keyStandard'],
        'axisStandard' : input['axisStandard'],
        'memberStandard' : input['memberStandard'],
        'keyCustom' : input['keyCustom'],
        'axisCustom' : input['axisCustom'],
        'memberCustom' : input['memberCustom']
      };
      Constants.getMetaEntityCounts = entityObject;
    } else {
      return null;
    }
  },
  
  setMetaReports : function( input ) {
    if ( input && (typeof input === 'object') && !Array.isArray(input) ) {
      var reportsAsArray = [ ];
      for ( var i = 0; i < Object.keys(input).length; i++ ) {
        input[Object.keys(input)[i]]['original-name'] = Object.keys(input)[i];
        reportsAsArray.push(input[Object.keys(input)[i]]);
      }
      Constants.getMetaReports = reportsAsArray;
    } else {
      return null;
    }
  },
  
  setMetaStandardReference : function( input ) {
    if ( input && (typeof input === 'object') && !Array.isArray(input) ) {
      var referencesAsArray = [ ];
      for ( var i = 0; i < Object.keys(input).length; i++ ) {
        input[Object.keys(input)[i]]['original-name'] = Object.keys(input)[i];
        referencesAsArray.push(input[Object.keys(input)[i]]);
      }
      
      Constants.getMetaStandardReference = referencesAsArray;
    } else {
      return null;
    }
  },
  
  getSingleMetaStandardReference : function( ref ) {
    if ( ref && typeof ref === 'string' ) {
      return Constants.getMetaStandardReference.filter(function( element ) {
        return element['original-name'] === ref;
      });
    } else {
      return null;
    }
  },
  
  setMetaVersion : function( input ) {
    if ( input && (typeof input === 'string') ) {
      Constants.getMetaVersion = input;
      if ( input >= '2.0' ) {
        
        var metaLinksElements = document.querySelectorAll('.meta-links-version');
        
        var metaLinksElementsArray = Array.prototype.slice.call(metaLinksElements);
        
        metaLinksElementsArray.forEach(function( current ) {
          current.textContent = input;
        });
      }

      else {
        
        var warningMessage = 'File found was not a MetaLinks version 2.0 file or higher';
        if ( document.getElementById('app-warning') ) {
          document.getElementById('app-warning').textContent = warningMessage;
          document.getElementById('app-warning').classList.remove('d-none');
        } else {
          return null;
        }
      }
    } else {
      return null;
    }
    
  },
  
  setMetaCustomPrefix : function( input ) {
    if ( input && (typeof input === 'object') && !Array.isArray(input) && input['nsprefix'] ) {
      Constants.getMetaCustomPrefix = input['nsprefix'].toLowerCase();
    } else {
      return null;
    }
  },
  
  setMetaDts : function( input ) {
    if ( input && (typeof input === 'object') && !Array.isArray(input) ) {
      Constants.getMetaDts = input;
    } else {
      return null;
    }
  },
  
  setMetaHidden : function( input ) {
    if ( input && (typeof input === 'object') && !Array.isArray(input) ) {
      Constants.getMetaHidden = input;
    } else {
      return null;
    }
  },
  
  setFormattingObject : function( input ) {
    var temp = {};
    for ( var option in input ) {
      if ( input[option] === 'http://www.xbrl.org/inlineXBRL/transformation/2010-04-20'
          || input[option] === 'http://www.xbrl.org/2008/inlineXBRL/transformation' ) {
        if ( option.split(':') && option.split(':')[1] ) {
          temp[option.split(':')[1]] = [
              'dateslashus',
              'dateslasheu',
              'datedotus',
              'datedoteu',
              'datelongus',
              'dateshortus',
              'datelongeu',
              'dateshorteu',
              'datelonguk',
              'dateshortuk',
              'numcommadot',
              'numdash',
              'numspacedot',
              'numdotcomma',
              'numcomma',
              'numspacecomma',
              'dateshortdaymonthuk',
              'dateshortmonthdayus',
              'dateslashdaymontheu',
              'dateslashmonthdayus',
              'datelongyearmonth',
              'dateshortyearmonth',
              'datelongmonthyear',
              'dateshortmonthyear' ];
        }
        
      }
      if ( input[option] === 'http://www.xbrl.org/inlineXBRL/transformation/2011-07-31' ) {
        if ( option.split(':') && option.split(':')[1] ) {
          temp[option.split(':')[1]] = [
              'booleanfalse',
              'booleantrue',
              'datedaymonth',
              'datedaymonthen',
              'datedaymonthyear',
              'datedaymonthyearen',
              'dateerayearmonthdayjp',
              'dateerayearmonthjp',
              'datemonthday',
              'datemonthdayen',
              'datemonthdayyear',
              'datemonthdayyearen',
              'datemonthyearen',
              'dateyearmonthdaycjk',
              'dateyearmonthen',
              'dateyearmonthcjk',
              'nocontent',
              'numcommadecimal',
              'zerodash',
              'numdotdecimal',
              'numunitdecimal' ];
        }
      }
      if ( input[option] === 'http://www.xbrl.org/inlineXBRL/transformation/2015-02-26' ) {
        if ( option.split(':') && option.split(':')[1] ) {
          temp[option.split(':')[1]] = [
              'booleanfalse',
              'booleantrue',
              'calindaymonthyear',
              'datedaymonth',
              'datedaymonthdk',
              'datedaymonthen',
              'datedaymonthyear',
              'datedaymonthyeardk',
              'datedaymonthyearen',
              'datedaymonthyearin',
              'dateerayearmonthdayjp',
              'dateerayearmonthjp',
              'datemonthday',
              'datemonthdayen',
              'datemonthdayyear',
              'datemonthdayyearen',
              'datemonthyear',
              'datemonthyeardk',
              'datemonthyearen',
              'datemonthyearin',
              'dateyearmonthcjk',
              'dateyearmonthday',
              'dateyearmonthdaycjk',
              'dateyearmonthen',
              'nocontent',
              'numcommadecimal',
              'numdotdecimal',
              'numdotdecimalin',
              'numunitdecimal',
              'numunitdecimalin',
              'zerodash' ];
        }
      }
      if ( input[option] === 'http://www.sec.gov/inlineXBRL/transformation/2015-08-31' ) {
        if ( option.split(':') && option.split(':')[1] ) {
          temp[option.split(':')[1]] = [
              'boolballotbox',
              'yesnoballotbox',
              'countrynameen',
              'stateprovnameen',
              'exchnameen',
              'edgarprovcountryen',
              'entityfilercategoryen',
              'duryear',
              'durmonth',
              'durweek',
              'durday',
              'durhour',
              'numinf',
              'numneginf',
              'numnan',
              'numwordsen',
              'durwordsen',
              'datequarterend' ];
        }
      }
    }
    Constants.getFormattingObject = temp;
  }
};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var Constants = {
  
  version : '2.0.0',
  
  fileSizeError : [ 7500000, '7.5MB' ],
  
  scrollPosition : localStorage.getItem('scrollPosition') || 'start',
  
  getHTMLAttributes : {},
  
  getPaginationPerPage : 10,
  
  getHtmlOverallTaxonomiesCount : null,
  
  getMetaSourceDocuments : [ ],
  
  getScaleOptions : {
    '0' : 'Zero',
    '1' : 'Tens',
    '2' : 'Hundreds',
    '3' : 'Thousands',
    '4' : 'Ten thousands',
    '5' : 'Hundred thousands',
    '6' : 'Millions',
    '7' : 'Ten Millions',
    '8' : 'Hundred Millions',
    '9' : 'Billions',
    '10' : 'Ten Billions',
    '11' : 'Hundred Billions',
    '12' : 'Trillions',
    '-1' : 'Tenths',
    '-2' : 'Hundredths',
    '-3' : 'Thousandths',
    '-4' : 'Ten Thousandths',
    '-5' : 'Hundred Thousandths',
    '-6' : 'Millionths'
  },
  
  getDecimalOptions : {
    '-1' : 'Tens',
    '-2' : 'Hundreds',
    '-3' : 'Thousands',
    '-4' : 'Ten thousands',
    '-5' : 'Hundred thousands',
    '-6' : 'Millions',
    '-7' : 'Ten Millions',
    '-8' : 'Hundred Millions',
    '-9' : 'Billions',
    '-10' : 'Ten Billions',
    '-11' : 'Hundred Billions',
    '-12' : 'Trillions',
    '1' : 'Tenths',
    '2' : 'Hundredths',
    '3' : 'Thousandths',
    '4' : 'Ten Thousandths',
    '5' : 'Hundred Thousandths',
    '6' : 'Millionths'
  },
  
  getHTMLPrefix : null,
  
  getMetaTags : [ ],
  
  getMetaCalculationsParentTags : [ ],
  
  getMetaCalculations : [ ],
  
  getMetaEntityCounts : null,
  
  getMetaReports : [ ],
  
  getMetaStandardReference : [ ],
  
  getMetaVersion : null,
  
  getMetaCustomPrefix : null,
  
  getMetaHidden : null,
  
  getMetaDts : null,
  
  getMetaDocuments : function( input ) {
    if ( input && (typeof input === 'string') ) {
      return (Constants.getMetaDts && Constants.getMetaDts[input]) ? Constants.getMetaDts[input] : null;
    } else {
      return null;
    }
  },
  
  getFormattingObject : {}
};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';
var ConstantsNumber = {

	getSmallNumber : {
		'zero' : 0,
		'one' : 1,
		'two' : 2,
		'three' : 3,
		'four' : 4,
		'five' : 5,
		'six' : 6,
		'seven' : 7,
		'eight' : 8,
		'nine' : 9,
		'ten' : 10,
		'eleven' : 11,
		'twelve' : 12,
		'thirteen' : 13,
		'fourteen' : 14,
		'fifteen' : 15,
		'sixteen' : 16,
		'seventeen' : 17,
		'eighteen' : 18,
		'nineteen' : 19,
		'twenty' : 20,
		'thirty' : 30,
		'forty' : 40,
		'fifty' : 50,
		'sixty' : 60,
		'seventy' : 70,
		'eighty' : 80,
		'ninety' : 90
	},

	getMagnitude : {
		'thousand' : 1000,
		'million' : 1000000,
		'billion' : 1000000000,
		'trillion' : 1000000000000,
		'quadrillion' : 1000000000000000,
		'quintillion' : 1000000000000000000,
		'sextillion' : 1000000000000000000000,
		'septillion' : 1000000000000000000000000,
		'octillion' : 1000000000000000000000000000,
		'nonillion' : 1000000000000000000000000000000,
		'decillion' : 1000000000000000000000000000000000,
	},

	getDevanagariDigitsToNormal : function(input) {

		if (input && typeof input === 'string') {

			var normal = '';
			for (var i = 0; i < input.length; i++) {
				var d = input[i];
				if ('\u0966' <= d && d <= '\u096F') {
					normal += String.fromCharCode(d.charCodeAt(0) - 0x0966
							+ '0'.charCodeAt(0));
				} else {
					normal += d;
				}
			}
			return normal;
		}
		return '09';

	},

	textToNumber : function(input) {

		var wordSplitPattern = /[\s|-|\u002D\u002D\u058A\u05BE\u2010\u2011\u2012\u2013\u2014\u2015\uFE58\uFE63\uFF0D]+/g;
		var a = input.toString().split(wordSplitPattern);
		var n = new BigNumber(0);
		var g = new BigNumber(0);

		for (var i = 0; i < a.length; i++) {
			var w = a[i];
			var x = ConstantsNumber.getSmallNumber[w];
			if (x && x !== null) {
				g = g.plus(x);
			} else if (w === 'hundred') {
				g = g.times(100);
			} else {
				x = ConstantsNumber.getMagnitude[w];

				if (x && x !== null) {

					var tempMagnitude = new BigNumber(x);
					var tempAddition = g.times(tempMagnitude);
					n = n.plus(tempAddition);
					g = new BigNumber(0);
				} else {
					return 'ixt:text2numError ' + w;
				}
			}
		}
		return n.plus(g);
	},

	zeroPadTwoDigits : function(input) {
		if (input.toString().length === 1) {
			return '0' + input.toString();
		}
		return input;
	}
};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var Errors = {
  
  checkPerformanceConcern : function( totalTaxonomies ) {
    if ( totalTaxonomies && typeof totalTaxonomies === 'number' ) {
      var isChrome = window.chrome;
      
      if ( (!isChrome && totalTaxonomies > 1000) || (isChrome && totalTaxonomies >= 7500) ) {
        var performanceConcern = document.querySelectorAll('.performance-concern');
        var performanceConcernArray = Array.prototype.slice.call(performanceConcern);
        performanceConcernArray.forEach(function( current ) {
          current.classList.remove('d-none');
        });
      }
      return;
    } else {
      return null;
    }
  },
  
  checkFileSizeForLimits : function( fileSize ) {
    if ( fileSize && typeof fileSize === 'number' ) {
      // fileSize is in bytes
      if ( fileSize > Constants.fileSizeError[0] ) {
        
        ErrorsMinor.fileSize();
        return;
      }
      return;
    } else {
      return;
    }
  },
  
  updateMainContainerHeight : function( removingWarning ) {
    
    removingWarning = removingWarning || false;
    
    var numberOfChildrenInErrorContainer = document.getElementById('error-container').children.length;
    
    if ( !removingWarning ) {
      numberOfChildrenInErrorContainer++;
    }
    
    var container = document.querySelector('.main-container');
    
    container.style.height = 'calc(100vh - ' + (numberOfChildrenInErrorContainer * 45) + 'px)';
    
  }
};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var ErrorsMajor = {
  
  inactive : function( ) {
    var messageToUser = 'Inline XBRL is not usable in this state.';
    document.getElementById('error-container').innerHTML += '<div class="alert-height alert alert-danger show mb-0">'
        + messageToUser + '</div>';
    Errors.updateMainContainerHeight();
  },
  
  formLinksNotFound : function( ) {
    
    var messageToUser = 'Inline XBRL form could not be found.';
    document.getElementById('error-container').innerHTML += '<div class="alert-height alert alert-danger show mb-0">'
        + messageToUser + '</div>';
    Errors.updateMainContainerHeight();
  },
  
  urlParams : function( ) {
    
    var messageToUser = 'Inline XBRL requires a URL param (doc | file) that coorelates to a Financial Report.';
    document.getElementById('error-container').innerHTML += '<div class="alert-height alert alert-danger show mb-0">'
        + messageToUser + '</div>';
    Errors.updateMainContainerHeight();
  },
  
  cors : function( doc ) {
    var host = window.location.protocol + '//' + window.location.host;
    var messageToUser = 'The protocol, host name and port number of the "doc" field (' + doc.hostname
        + '), if provided, must be identical to that of the Inline XBRL viewer(' + host + ')';
    document.getElementById('error-container').innerHTML += '<div class="alert-height alert alert-danger show mb-0">'
        + messageToUser + '</div>';
    Errors.updateMainContainerHeight();
  }
};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var ErrorsMinor = {
  
  unknownError : function( ) {
    var messageToUser = 'An Error has occured within the Inline XBRL Viewer.';
    document.getElementById('error-container').innerHTML += '<div class="alert-height alert alert-warning alert-dismissable show mb-0">'
        + messageToUser
        + '<button type="button" class="close" data-dismiss="alert" onclick="Errors.updateMainContainerHeight(true);"><i class="fas fa-times"></i></button></div>';
    Errors.updateMainContainerHeight();
  },
  
  browserSuggestion : function( ) {
    var messageToUser = 'Using <a target="_blank" href="https://www.google.com/chrome/">Google Chrome</a> can help alleviate some of these performance issues.';
    document.getElementById('error-container').innerHTML += '<div class="alert-height alert alert-warning alert-dismissable show mb-0">'
        + messageToUser
        + '<button type="button" class="close" data-dismiss="alert" onclick="Errors.updateMainContainerHeight(true);"><i class="fas fa-times"></i></button></div>';
    Errors.updateMainContainerHeight();
  },
  
  factNotFound : function( ) {
    var messageToUser = 'Inline XBRL can not locate the requested fact.';
    document.getElementById('error-container').innerHTML += '<div class="alert-height alert alert-warning alert-dismissable show mb-0">'
        + messageToUser
        + '<button type="button" class="close" data-dismiss="alert" onclick="Errors.updateMainContainerHeight(true);"><i class="fas fa-times"></i></button></div>';
    Errors.updateMainContainerHeight();
  },
  
  continuedAt : function( ) {
    var messageToUser = 'Inline XBRL HTML Form is missing data to complete this action. This functionality has been removed.';
    document.getElementById('error-container').innerHTML += '<div class="alert-height alert alert-warning alert-dismissable show mb-0">'
        + messageToUser
        + '<button type="button" class="close" data-dismiss="alert" onclick="Errors.updateMainContainerHeight(true);"><i class="fas fa-times"></i></button></div>';
    Errors.updateMainContainerHeight();
  },
  
  fileSize : function( ) {
    var messageToUser = 'Inline XBRL HTML Form is over ' + Constants.fileSizeError[1]
        + ', performance may be affected.';
    document.getElementById('error-container').innerHTML += '<div class="alert-height alert alert-warning alert-dismissable show mb-0">'
        + messageToUser
        + '<button type="button" class="close" data-dismiss="alert" onclick="Errors.updateMainContainerHeight(true);"><i class="fas fa-times"></i></button></div>';
    Errors.updateMainContainerHeight();
    
    if ( !window.chrome ) {
      ErrorsMinor.browserSuggestion();
    }
  },
  
  metaLinksNotFound : function( fileName ) {
    
    var messageToUser = 'Inline XBRL viewing features are minimal because no supporting file was found.';
    document.getElementById('error-container').innerHTML += '<div class="alert-height alert alert-warning alert-dismissable show mb-0">'
        + messageToUser
        + '<button type="button" class="close" data-dismiss="alert" onclick="Errors.updateMainContainerHeight(true);"><i class="fas fa-times"></i></button></div>';
    Errors.updateMainContainerHeight();
  },
  
  metaLinksInstance : function( fileName ) {
    
    var messageToUser = 'Inline XBRL viewing features are minimal because supporting file is not correct.';
    document.getElementById('error-container').innerHTML += '<div class="alert-height alert alert-warning alert-dismissable show mb-0">'
        + messageToUser
        + '<button type="button" class="close" data-dismiss="alert" onclick="Errors.updateMainContainerHeight(true);"><i class="fas fa-times"></i></button></div>';
    Errors.updateMainContainerHeight();
  },
  
  metaLinksVersion : function( ) {
    
    var messageToUser = 'File found was not a MetaLinks version 2.0+ file.';
    document.getElementById('error-container').innerHTML += '<div class="alert-height alert alert-warning alert-dismissable show mb-0">'
        + messageToUser
        + '<button type="button" class="close" data-dismiss="alert" onclick="Errors.updateMainContainerHeight(true);"><i class="fas fa-times"></i></button></div>';
    Errors.updateMainContainerHeight();
  },
  
  factNotActive : function( ) {
    
    var messageToUser = 'This fact is not apart of your active filter(s) and is not present in the Fact Menu.';
    document.getElementById('error-container').innerHTML += '<div class="alert-height alert alert-warning alert-dismissable show mb-0">'
        + messageToUser
        + '<button type="button" class="close" data-dismiss="alert" onclick="Errors.updateMainContainerHeight(true);"><i class="fas fa-times"></i></button></div>';
    Errors.updateMainContainerHeight();
  },

};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var FiltersBoolean = {
	booleanFalse : function(element) {
		return 'false';
	},

	booleanTrue : function(element) {
		return 'true';
	},

	boolBallotBox : function(element) {
		if (element && typeof element === 'object' && element['innerText']) {

			switch (element['innerText'].trim()) {
				case '&#x2610;' : {
					return 'false';
					break;
				}
				case '&#9744;' : {
					return 'false';
					break;
				}
				case '\u2610' : {
					return 'false';
					break;
				}

				case '&#x2611;' : {
					return 'true';
					break;
				}
				case '&#9745;' : {
					return 'true';
					break;
				}
				case '\u2611' : {
					return 'true';
					break;
				}

				case '&#x2612;' : {
					return 'true';
					break;
				}
				case '&#9746;' : {
					return 'true';
					break;
				}
				case '\u2612' : {
					return 'true';
					break;
				}

				default : {
					return 'Format Error: Bool Ballot Box';
				}
			}

		}
		return 'Format Error: Bool Ballot Box';
	},

	yesNoBallotBox : function(element) {
		if (element && typeof element === 'object' && element['innerText']) {
			switch (element['innerText'].trim()) {
				case '&#x2610;' : {
					return 'No';
					break;
				}
				case '&#9744;' : {
					return 'No';
					break;
				}
				case '\u2610' : {
					return 'No';
					break;
				}

				case '&#x2611;' : {
					return 'Yes';
					break;
				}
				case '&#9745;' : {
					return 'Yes';
					break;
				}
				case '\u2611' : {
					return 'Yes';
					break;
				}

				case '&#x2612;' : {
					return 'Yes';
					break;
				}
				case '&#9746;' : {
					return 'Yes';
					break;
				}
				case '\u2612' : {
					return 'Yes';
					break;
				}

				default : {
					return 'Format Error: Yes No Ballot Box';
				}
			}
		}
		return 'Format Error: Yes No Ballot Box';
	}
};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var FiltersContextref = {
  
  getDimensions : function( contextref ) {
    if ( contextref && typeof contextref === 'string' ) {
      contextref = contextref.replace(/\./g, '\\\.');
      var foundDimensions = document.getElementById('dynamic-xbrl-form').querySelectorAll(
          '[id="' + contextref + '"] [dimension]');
      return Array.prototype.slice.call(foundDimensions);
    }
    return null;
  },
  
  getAxis : function( contextref, plainText ) {
    plainText = plainText || false;
    
    if ( contextref && typeof contextref === 'string' ) {
      contextref = contextref.replace(/\./g, '\\\.');
      
      var foundDimensions = document.getElementById('dynamic-xbrl-form').querySelectorAll(
          '[id="' + contextref + '"] [dimension]');
      var foundDimensionsArray = Array.prototype.slice.call(foundDimensions);
      
      var axis = foundDimensionsArray.map(function( current ) {
        if ( plainText ) {
          return current.getAttribute('dimension');
        }
        return FiltersName.getFormattedName(current.getAttribute('dimension'));
      }).filter(function( element, index, array ) {
        return array.indexOf(element) == index;
      })

      if ( plainText ) {
        return axis.join(' ');
      }
      return axis.join('<br>');
    }
    return null;
  },
  
  getMember : function( contextref, plainText ) {
    plainText = plainText || false;
    
    if ( contextref && typeof contextref === 'string' ) {
      var foundDimensions = document.getElementById('dynamic-xbrl-form').querySelectorAll(
          '[id="' + contextref + '"] [dimension]');
      
      var foundDimensionsArray = Array.prototype.slice.call(foundDimensions);
      
      var member = foundDimensionsArray.map(function( current ) {
        if ( plainText ) {
          return current.innerText;
        }
        return FiltersName.getFormattedName(current.innerText);
      }).filter(function( element, index, array ) {
        return array.indexOf(element) == index;
      });
      
      if ( plainText ) {
        return member.join(' ');
      }
      return member.join('<br>');
    }
    return null;
  },
  
  getPeriod : function( contextref ) {
    if ( contextref && typeof contextref === 'string' ) {
      contextref = contextref.replace(/\./g, '\\\.');
      if ( document.getElementById('dynamic-xbrl-form').querySelector('[id="' + contextref + '"]')
          && document.getElementById('dynamic-xbrl-form').querySelector('[id="' + contextref + '"]')['nodeName']
              .split(':')[0].toLowerCase() ) {
        var prefix = document.getElementById('dynamic-xbrl-form').querySelector('[id="' + contextref + '"]')['nodeName']
            .split(':')[0].toLowerCase();
      }
      
      var startDateTag = prefix + '\\:startDate';
      var endDateTag = prefix + '\\:endDate';
      
      var instantDateTag = prefix + '\\:instant';
      
      var startDate;
      
      if ( document.getElementById('dynamic-xbrl-form').querySelector('[id="' + contextref + '"] ' + startDateTag) ) {
        
        startDate = moment(document.getElementById('dynamic-xbrl-form').querySelector(
            '[id="' + contextref + '"] ' + startDateTag).innerText, 'YYYY-MM-DD');
      }
      
      var endDate;
      if ( document.getElementById('dynamic-xbrl-form').querySelector('[id="' + contextref + '"] ' + endDateTag) ) {
        
        endDate = moment(document.getElementById('dynamic-xbrl-form').querySelector(
            '[id="' + contextref + '"] ' + endDateTag).innerText, 'YYYY-MM-DD');
      }
      
      var instantDate;
      if ( document.getElementById('dynamic-xbrl-form').querySelector('[id="' + contextref + '"] ' + instantDateTag) ) {
        
        instantDate = moment(document.getElementById('dynamic-xbrl-form').querySelector(
            '[id="' + contextref + '"] ' + instantDateTag).innerText, 'YYYY-MM-DD');
      }
      
      if ( (startDate && startDate.isValid()) && (endDate && endDate.isValid()) ) {
        
        var betweenDate;
        var monthsDifference = Math.round(endDate.diff(startDate, 'months', true));
        if ( monthsDifference !== 0 ) {
          betweenDate = monthsDifference + ' months ending ' + endDate.format('MM/DD/YYYY')
        } else {
          betweenDate = startDate.format('MM/DD/YYYY') + ' - ' + endDate.format('MM/DD/YYYY');
        }
        return betweenDate;
        
      } else if ( instantDate && instantDate.isValid() ) {
        return 'As of ' + instantDate.format('MM/DD/YYYY');
        return 'As of ' + instantDate[1] + '/' + instantDate[2] + '/' + instantDate[0];
      } else {
        return 'No period information.';
      }
      
    }
    return 'No period information.';
    
  },

};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var FiltersCredit = {
  
  getBalance : function( element ) {
    if ( element && typeof element === 'object' ) {
      var tagInformation = FiltersName.getTag(element.getAttribute('name'));
      
      if ( tagInformation && tagInformation.length && tagInformation[0]['crdr'] ) {
        return tagInformation[0]['crdr'].charAt(0).toUpperCase() + tagInformation[0]['crdr'].substring(1);
      }
    }
    return null;
  },
  
  getDecimals : function( decimals ) {
    if ( decimals && typeof decimals === 'string' && Constants.getDecimalOptions[decimals] ) {
      return Constants.getDecimalOptions[decimals];
    }
    return null;
  }
};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var FiltersDate = {

	eraYear : function(era, year) {
		if ((era && typeof era === 'string' && ConstantsDate.eraStart[era])
				&& (year && typeof year === 'string')) {
			return ConstantsDate.eraStart[era]
					+ (year === '\u5143' ? 1 : parseInt(year));
		}
		return null;
	},

	dateQuarterEnd : function(element) {
		if (element && typeof element === 'object' && element['innerText']) {

			var year = element.innerText.match(/\d{4}/)[0];
			var month;
			var day;

			var quarter = element.innerText
					.match(/1st|first|q1|2nd|second|q2|3rd|third|q3|4th|fourth|last|q4/gi);

			if (quarter && quarter[0]) {

				switch (quarter[0].toLowerCase()) {
					case ('1st') : {
						month = "03";
						day = "31";
						break;
					}
					case ('first') : {
						month = "03";
						day = "31";
						break;
					}
					case ('q1') : {
						month = "03";
						day = "31";
						break;
					}
					case ('2nd' || 'second' || 'q2') : {
						month = "06";
						day = "30";
						break;
					}
					case ('second') : {
						month = "06";
						day = "30";
						break;
					}
					case ('q2') : {
						month = "06";
						day = "30";
						break;
					}
					case ('3rd') : {
						month = "09";
						day = "30";
						break;
					}
					case ('third') : {
						month = "09";
						day = "30";
						break;
					}
					case ('q3') : {
						month = "09";
						day = "30";
						break;
					}
					case ('4th') : {
						month = "12";
						day = "31";
						break;
					}
					case ('fourth') : {
						month = "12";
						day = "31";
						break;
					}
					case ('last') : {
						month = "12";
						day = "31";
						break;
					}
					case ('q4') : {
						month = "12";
						day = "31";
						break;
					}
					default : {
						return 'Format Error: Date Quarter End';
					}
				}
			} else {
				return 'Format Error: Date Quarter End';
			}

			var result = moment(year + '-' + month + '-' + day, 'YYYY-MM-DD');
			if (!result.isValid()) {
				return 'Format Error: Date Quarter End';
			}
			return result.format('YYYY-MM-DD');

		}
		return 'Format Error: Date Quarter End';

	},

	calINDayMonthYear : function(element) {

		if (element && typeof element === 'object' && element['innerText']) {

			var regex = /^\s*([0-9\u0966-\u096F]{1,2})\s([\u0966-\u096F]{2}|[^\s0-9\u0966-\u096F]+)\s([0-9\u0966-\u096F]{2}|[0-9\u0966-\u096F]{4})\s*$/;

			var regexSakaMonth = /(C\S*ait|\u091A\u0948\u0924\u094D\u0930)|(Vai|\u0935\u0948\u0936\u093E\u0916|\u092C\u0948\u0938\u093E\u0916)|(Jy|\u091C\u094D\u092F\u0947\u0937\u094D\u0920)|(dha|\u1E0Dha|\u0906\u0937\u093E\u0922|\u0906\u0937\u093E\u0922\u093C)|(vana|\u015Ar\u0101va\u1E47a|\u0936\u094D\u0930\u093E\u0935\u0923|\u0938\u093E\u0935\u0928)|(Bh\S+dra|Pro\u1E63\u1E6Dhapada|\u092D\u093E\u0926\u094D\u0930\u092A\u0926|\u092D\u093E\u0926\u094B)|(in|\u0906\u0936\u094D\u0935\u093F\u0928)|(K\S+rti|\u0915\u093E\u0930\u094D\u0924\u093F\u0915)|(M\S+rga|Agra|\u092E\u093E\u0930\u094D\u0917\u0936\u0940\u0930\u094D\u0937|\u0905\u0917\u0939\u0928)|(Pau|\u092A\u094C\u0937)|(M\S+gh|\u092E\u093E\u0918)|(Ph\S+lg|\u092B\u093E\u0932\u094D\u0917\u0941\u0928)/;

			var result = regex.exec(element.innerText);

			if (result) {
				var resultSaka = regexSakaMonth.exec(result[2]);

				if (resultSaka) {
					var month = 0;
					for (month = resultSaka.length - 1; month >= 0; month -= 1) {
						if (resultSaka[month]) {
							var day = parseInt(ConstantsNumber
									.getDevanagariDigitsToNormal(result[1]));

							var year = parseInt(ConstantsNumber
									.getDevanagariDigitsToNormal(ConstantsDate
											.getSakaYearPadding(result[3],
													month, day)));

							var result = moment(ConstantsDate
									.getSakaToGregorian(year, month, day), [
									'YYYY-MM-DD', 'YYYY-M-D'], true);

							if (!result.isValid()) {
								return 'Format Error: Cal IN Day Month Year';
							}
							return result.format('YYYY-MM-DD');
							break;
						}
					}
				}
			}
		}
		return 'Format Error: Cal IN Day Month Year';

	},

	dateDayMonth : function(element) {
		if (element && typeof element === 'object' && element['innerText']) {
			var result = moment(element.innerText, 'DDMM');
			if (!result.isValid()) {
				return 'Format Error: Date Day Month';
			}
			return result.format('--MM-DD');
		}
		return 'Format Error: Date Day Month';

	},

	dateDayMonthDK : function(element) {
		if (element && typeof element === 'object' && element['innerText']) {
			var regex = /^\s*([0-9]{1,2})[^0-9]+(jan|feb|mar|apr|maj|jun|jul|aug|sep|okt|nov|dec)([A-Za-z]*)([.]*)\s*$/i;

			var result = regex.exec(element.innerText);

			if (result && result.length === 5) {

				var month = result[2];
				var day = result[1];

				var monthEnd = result[3];
				var monthPer = result[4];

				if (((!monthEnd && !monthPer) || (!monthEnd && monthPer) || (monthEnd && !monthPer))
						&& '01' <= day
						&& day <= moment(month, 'MMM').daysInMonth()) {
					var dateResult = moment(day + '-' + month, 'DD-MMM');

					if (!dateResult.isValid()) {
						return 'Format Error: Date Day Month DK';
					}
					return dateResult.format('--MM-DD');
				}
			}
		}
		return 'Format Error: Date Day Month DK';
	},

	dateDayMonthEN : function(element) {
		if (element && typeof element === 'object' && element['innerText']) {
			var regex = /^\s*([0-9]{1,2})[^0-9]+(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC|JANUARY|FEBRUARY|MARCH|APRIL|MAY|JUNE|JULY|AUGUST|SEPTEMBER|OCTOBER|NOVEMBER|DECEMBER)\s*$/;
			var result = regex.exec(element.innerText);
			if (result) {
				var month = result[2];
				var day = result[1];
				var dateResult = moment(day + '-' + month, 'DD-MMM');

				if (!dateResult.isValid()) {
					return 'Format Error: Date Day Month EN';
				}
				return dateResult.format('--MM-DD');
			}
		}
		return 'Format Error: Date Day Month EN';

	},

	dateDayMonthYear : function(element) {
		if (element && typeof element === 'object' && element['innerText']) {
			var regex = /^\s*([0-9]{1,2})[^0-9]+([0-9]{1,2})[^0-9]+([0-9]{4}|[0-9]{1,2})\s*$/;

			var result = regex.exec(element.innerText);

			if (result) {

				var dateResult = moment(element.innerText, ['DD MM YY',
						'DD.MM.YYYY', 'DD.MM.Y', 'DD.MM.YY', 'D.M.YY',
						'DD/MM/YY'], true);
				if (!dateResult.isValid()) {
					return 'Format Error: Date Day Month Year';
				}

				if (dateResult.year().toString().length === 1) {
					dateResult.year(2000 + dateResult.year());
				}
				if (dateResult.year().toString().length === 2) {
					dateResult.year(2000 + dateResult.year());
				}

				if (dateResult.year().toString().length === 3
						&& result[3].length === 3) {
					return 'Format Error: Date Day Month Year';
				}
				return dateResult.format('YYYY-MM-DD');
			}

		}
		return 'Format Error: Date Day Month Year';
	},

	dateDayMonthYearDK : function(element) {
		if (element && typeof element === 'object' && element['innerText']) {

			var regex = /^\s*([0-9]{1,2})[^0-9]+(jan|feb|mar|apr|maj|jun|jul|aug|sep|okt|nov|dec)([A-Za-z]*)([.]*)[^0-9]*([0-9]{4}|[0-9]{1,2})\s*$/i;

			var result = regex.exec(element.innerText);

			if (result) {
				var year = result[5];
				var day = result[1];
				var month = moment().month(result[2]).format('M')

				var monthEnd = result[3];
				var monthPer = result[4];

				if (month
						&& ((!monthEnd && !monthPer) || (!monthEnd && monthPer))
						|| (monthEnd && !monthPer)) {
					var dateResult = moment()

					var dateResult = moment(day + '-' + month + '-' + year,
							'DD-M-YYYY');

					if (!dateResult.isValid()) {
						return 'Format Error: Date Day Month DK';
					}

					if (dateResult.year().toString().length === 1) {
						dateResult.year(2000 + dateResult.year());
					}
					if (dateResult.year().toString().length === 2) {
						dateResult.year(2000 + dateResult.year());
					}

					return dateResult.format('YYYY-MM-DD');
				}
			}
		}
		return 'Format Error: Date Day Month Year DK';
	},

	dateDayMonthYearEN : function(element) {
		if (element && typeof element === 'object' && element['innerText']) {

			var regex = /^\s*([0-9]{1,2})[^0-9]+(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC|JANUARY|FEBRUARY|MARCH|APRIL|MAY|JUNE|JULY|AUGUST|SEPTEMBER|OCTOBER|NOVEMBER|DECEMBER)[^0-9]+([0-9]{4}|[0-9]{1,2})\s*$/;
			var result = regex.exec(element.innerText);
			if (result) {
				var month = result[2];
				var day = result[1];
				var year = result[3];
				var dateResult = moment(day + '-' + month + '-' + year,
						'DD-MMM-Y');
				if (!dateResult.isValid()) {
					return 'Format Error: Date Day Month Year EN';
				}

				if (dateResult.year().toString().length === 1) {
					dateResult.year(2000 + dateResult.year());
				}
				if (dateResult.year().toString().length === 2) {
					dateResult.year(2000 + dateResult.year());
				}

				return dateResult.format('YYYY-MM-DD');
			}
		}
		return 'Format Error: Date Day Month Year EN';
	},

	dateDayMonthYearIN : function(element) {
		if (element && typeof element === 'object' && element['innerText']) {

			var regex = /^\s*([0-9\u0966-\u096F]{1,2})\s([\u0966-\u096F]{2}|[^\s0-9\u0966-\u096F]+)\s([0-9\u0966-\u096F]{2}|[0-9\u0966-\u096F]{4})\s*$/;
			var result = regex.exec(element.innerText);
			if (result) {
				var year = ConstantsNumber
						.getDevanagariDigitsToNormal(result[3]);

				var month;
				if (ConstantsDate.getGregorianHindiMonthNumber[ConstantsNumber
						.getDevanagariDigitsToNormal(result[2])]) {
					month = ConstantsDate.getGregorianHindiMonthNumber[ConstantsNumber
							.getDevanagariDigitsToNormal(result[2])];
				} else {
					month = ConstantsNumber
							.getDevanagariDigitsToNormal(result[2]);
				}

				var day = ConstantsNumber
						.getDevanagariDigitsToNormal(result[1]);

				var dateResult = moment(day + '-' + month + '-' + year,
						'DD-MM-YYYY');

				if (!dateResult.isValid()) {
					return 'Format Error: Date Day Month Year IN';
				}
				return dateResult.format('YYYY-MM-DD');
			}
		}
		return 'Format Error: Date Day Month Year IN';

	},

	dateDotEU : function(element) {
		if (element && typeof element === 'object' && element['innerText']) {
			var result = moment(element.innerText, 'DD.MM.Y');
			if (!result.isValid()) {
				return 'Format Error: Date Dot EU';
			}
			return result.format('YYYY-MM-DD');
		}
		return 'Format Error: Date Dot EU';
	},

	dateDotUS : function(element) {
		if (element && typeof element === 'object' && element['innerText']) {
			var result = moment(element.innerText, 'MM.DD.Y');
			if (!result.isValid()) {
				return 'Format Error: Date Dot US';
			}
			return result.format('YYYY-MM-DD');
		}
		return 'Format Error: Date Dot US';
	},

	dateEraYearMonthDayJP : function(element) {
		if (element && typeof element === 'object' && element['innerText']) {

			var regex = /^[\s ]*(\u660E\u6CBB|\u660E|\u5927\u6B63|\u5927|\u662D\u548C|\u662D|\u5E73\u6210|\u5E73|\u4EE4\u548C|\u4EE4)[\s ]*([0-9\uFF10-\uFF19]{1,2}|\u5143)[\s ]*(\u5E74)[\s ]*([0-9\uFF10-\uFF19]{1,2})[\s ]*(\u6708)[\s ]*([0-9\uFF10-\uFF19]{1,2})[\s ]*(\u65E5)[\s]*$/;

			var result = regex.exec(FiltersNumber
					.jpDigitsToNormal(element.innerText));

			if (result) {
				var year = FiltersDate.eraYear(result[1], result[2]);
				var month = result[4];
				var day = result[6];

				var dateResult = moment(day + '-' + month + '-' + year,
						'DD-MM-Y');

				if (!dateResult.isValid()) {
					return 'Format Error: Date Era Year Month Day JP';
				}
				return dateResult.format('YYYY-MM-DD');
			}
		}
		return 'Format Error: Date Era Year Month Day JP';
	},

	dateEraYearMonthJP : function(element) {
		if (element && typeof element === 'object' && element['innerText']) {

			var regex = /^[\s ]*(\u660E\u6CBB|\u660E|\u5927\u6B63|\u5927|\u662D\u548C|\u662D|\u5E73\u6210|\u5E73|\u4EE4\u548C|\u4EE4)[\s ]*([0-9\uFF10-\uFF19]{1,2}|\u5143)[\s ]*(\u5E74)[\s ]*([0-9\uFF10-\uFF19]{1,2})[\s ]*(\u6708)[\s ]*$/;

			var result = regex.exec(FiltersNumber
					.jpDigitsToNormal(element.innerText));
			if (result) {

				var year = FiltersDate.eraYear(result[1], result[2]);
				var month = result[4];

				var dateResult = moment(month + '-' + year, 'MM-Y');
				if (!dateResult.isValid()) {
					return 'Format Error: Date Era Year Month JP';
				}
				return dateResult.format('YYYY-MM');
			}
		}
		return 'Format Error: Date Era Year Month JP';

	},

	dateLongMonthYear : function(element) {
		if (element && typeof element === 'object' && element['innerText']) {
			var result = moment(element.innerText, ['MMMM YY', 'MMMM YYYY'],
					true);
			if (!result.isValid()) {
				return 'Format Error: Date Long Month Year';
			}
			return result.format('YYYY-MM');
		}
		return 'Format Error: Date Long Month Year';
	},

	dateLongUK : function(element) {
		if (element && typeof element === 'object' && element['innerText']) {
			var result = moment(element.innerText, 'DD MMM YY');
			if (!result.isValid()) {
				return 'Format Error: Date Long UK';
			}
			return result.format('YYYY-MM-DD');
		}
		return 'Format Error: Date Long UK';
	},

	dateLongUS : function(element) {
		if (element && typeof element === 'object' && element['innerText']) {
			var result = moment(element.innerText, 'MMM DD, YY');
			if (!result.isValid()) {
				return 'Format Error: Date Long US';
			}
			return result.format('YYYY-MM-DD');
		}
		return 'Format Error: Date Long US';
	},

	dateLongYearMonth : function(element) {
		if (element && typeof element === 'object' && element['innerText']) {

			var result = moment(element.innerText, 'YY MMM');
			if (!result.isValid()) {
				return 'Format Error: Date Long Year Month';
			}
			return result.format('YYYY-MM');
		}
		return 'Format Error: Date Long Year Month';

	},

	dateMonthDay : function(element) {
		if (element && typeof element === 'object' && element['innerText']) {

			var result = moment(element.innerText, 'MMDD');
			if (!result.isValid()) {
				return 'Format Error: Date Month Day';
			}
			return result.format('--MM-DD');
		}
		return 'Format Error: Date Month Day';

	},

	dateMonthDayEN : function(element) {
		if (element && typeof element === 'object' && element['innerText']) {

			var regex = /^\s*(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC|JANUARY|FEBRUARY|MARCH|APRIL|MAY|JUNE|JULY|AUGUST|SEPTEMBER|OCTOBER|NOVEMBER|DECEMBER)[^0-9]+([0-9]{1,2})[A-Za-z]{0,2}\s*$/;

			var result = regex.exec(element.innerText);

			if (result) {
				var month = result[1];
				var day = result[2];

				var dateResult = moment(month + '-' + day, 'MMM-DD');

				if (!dateResult.isValid()) {
					return 'Format Error: Date Month Day EN';
				}

				return dateResult.format('--MM-DD');
			}
		}
		return 'Format Error: Date Month Day EN';

	},

	dateMonthDayYear : function(element) {
		if (element && typeof element === 'object' && element['innerText']) {

			var regex = /^\s*([0-9]{1,2})[^0-9]+([0-9]{1,2})[^0-9]+([0-9]{4}|[0-9]{1,2})\s*$/;

			var result = regex.exec(element.innerText);

			if (result) {
				var year = result[3];
				var month = result[1];
				var day = result[2];

				var dateResult = moment(year + '-' + month + '-' + day, [
						'YY-MM-DD', 'YYYY-MM-DD']);
				if (!dateResult.isValid()) {
					return 'Format Error: Date Month Day Year';
				}
				return dateResult.format('YYYY-MM-DD');
			}
		}
		return 'Format Error: Date Month Day Year';

	},

	dateMonthDayYearEN : function(element) {
		if (element && typeof element === 'object' && element['innerText']) {

			var regex = /^\s*(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC|JANUARY|FEBRUARY|MARCH|APRIL|MAY|JUNE|JULY|AUGUST|SEPTEMBER|OCTOBER|NOVEMBER|DECEMBER)[^0-9]+([0-9]+)[^0-9]+([0-9]{4}|[0-9]{1,2})\s*$/;

			var result = regex.exec(element.innerText);

			if (result) {
				var year = result[3];
				var month = result[1];
				var day = result[2];

				var dateResult = moment(year + '-' + month + '-' + day, [
						'YY-MM-DD', 'YYYY-MMM-DD']);
				if (!dateResult.isValid()) {
					return 'Format Error: Date Month Day Year EN';
				}
				if (dateResult.year().toString().length === 1) {
					dateResult.year(2000 + dateResult.year());
				}
				if (dateResult.year().toString().length === 2) {
					dateResult.year(2000 + dateResult.year());
				}
				return dateResult.format('YYYY-MM-DD');
			}
		}
		return 'Format Error: Date Month Day Year EN';
	},

	dateMonthYear : function(element) {
		if (element && typeof element === 'object' && element['innerText']) {

			var regex = /^[\s\u00A0]*([0-9]{1,2})[^0-9]+([0-9]{4}|[0-9]{1,2})[\s\u00A0]*$/;
			var result = regex.exec(element.innerText);

			if (result) {
				var year = result[2];
				var month = result[1];

				var dateResult = moment(year + '-' + month, ['YYYY-MM']);
				if (!dateResult.isValid()) {
					return 'Format Error: Date Month Year';
				}
				if (dateResult.year().toString().length === 1) {
					dateResult.year(2000 + dateResult.year());
				}
				if (dateResult.year().toString().length === 2) {
					dateResult.year(2000 + dateResult.year());
				}

				return dateResult.format('YYYY-MM');
			}
		}
		return 'Format Error: Date Month Year';

	},

	dateMonthYearDK : function(element) {
		if (element && typeof element === 'object' && element['innerText']) {

			var regex = /^\s*(jan|feb|mar|apr|maj|jun|jul|aug|sep|okt|nov|dec)([A-Za-z]*)([.]*)[^0-9]*([0-9]{4}|[0-9]{1,2})\s*$/i
			var result = regex.exec(element.innerText);

			if (result) {
				var year = result[4];
				var month = result[1];

				var dateResult = moment(year + '-' + month, ['YYYY-MMM',
						'YY-MMM', 'Y-MMM'], true);

				if (!dateResult.isValid()) {
					return 'Format Error: Date Month Year DK';
				}
				if (dateResult.year().toString().length === 1) {
					dateResult.year(2000 + dateResult.year());
				}
				if (dateResult.year().toString().length === 2) {
					dateResult.year(2000 + dateResult.year());
				}
				return dateResult.format('YYYY-MM');

			}
		}
		return 'Format Error: Date Month Year DK';

	},

	dateMonthYearEN : function(element) {
		if (element && typeof element === 'object' && element['innerText']) {

			var regex = /^\s*(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC|JANUARY|FEBRUARY|MARCH|APRIL|MAY|JUNE|JULY|AUGUST|SEPTEMBER|OCTOBER|NOVEMBER|DECEMBER)[^0-9]+([0-9]{1,2}|[0-9]{4})\s*$/;
			var result = regex.exec(element.innerText);

			if (result) {
				var year = result[2];
				var month = result[1];

				var dateResult = moment(year + '-' + month, ['YYYY-MMM']);
				if (!dateResult.isValid()) {
					return 'Format Error: Date Month Year EN';
				}
				if (dateResult.year().toString().length === 1) {
					dateResult.year(2000 + dateResult.year());
				}
				if (dateResult.year().toString().length === 2) {
					dateResult.year(2000 + dateResult.year());
				}
				return dateResult.format('YYYY-MM');

			}
		}
		return 'Format Error: Date Month Year EN';

	},

	dateMonthYearIN : function(element) {
		if (element && typeof element === 'object' && element['innerText']) {

			var regex = /^\s*([^\s0-9\u0966-\u096F]+)\s([0-9\u0966-\u096F]{4})\s*$/;
			var result = regex.exec(element.innerText);
			if (result) {
				if (result[1] in ConstantsDate.getGregorianHindiMonthNumber) {
					var year = ConstantsNumber
							.getDevanagariDigitsToNormal(result[2]);
					var month = ConstantsDate.getGregorianHindiMonthNumber[result[1]];
					var dateResult = moment(month + '-' + year, 'MM-YYYY');
					if (!dateResult.isValid()) {
						return 'Format Error: Date Month Year IN';
					}
					return dateResult.format('YYYY-MM');
				}
			}
		}
		return 'Format Error: Date Month Year IN';
	},

	dateShortDayMonthUK : function(element) {
		if (element && typeof element === 'object' && element['innerText']) {
			var result = moment(element.innerText, 'DD MM');
			if (!result.isValid()) {
				return 'Format Error: Date Short Day Month UK';
			}
			return result.format('--MM-DD');
		}
		return 'Format Error: Date Short Day Month UK';

	},

	dateShortEU : function(element) {
		if (element && typeof element === 'object' && element['innerText']) {
			return 'TODO';
		}

		return 'Format Error: Date Short EU';
	},

	dateShortMonthDayUS : function(element) {
		if (element && typeof element === 'object' && element['innerText']) {
			var result = moment(element.innerText, 'MMM DD');
			if (!result.isValid()) {
				return 'Format Error: Date Short Month Day US';
			}
			return result.format('--MM-DD');
		}
		return 'Format Error: Date Short Month Day US';
	},

	dateShortMonthYear : function(element) {
		if (element && typeof element === 'object' && element['innerText']) {

			var result = moment(element.innerText, 'MMM YYYY');
			if (!result.isValid()) {
				return 'Format Error: Date Short Month Year US';
			}
			return result.format('YYYY-MM');
		}
		return 'Format Error: Date Short Month Year US';

	},

	dateShortUK : function(element) {
		if (element && typeof element === 'object' && element['innerText']) {

			var result = moment(element.innerText, ['DD MMM YY', 'DD MMM YYYY']);
			if (!result.isValid()) {
				return 'Format Error: Date Short UK';
			}
			return result.format('YYYY-MM-DD');
		}
		return 'Format Error: Date Short UK';

	},

	dateShortUS : function(element) {
		if (element && typeof element === 'object' && element['innerText']) {

			var result = moment(element.innerText, ['MMM DD, YY',
					'MMM DD, YYYY']);
			if (!result.isValid()) {
				return 'Format Error: Date Short US';
			}
			return result.format('YYYY-MM-DD');
		}
		return 'Format Error: Date Short US';

	},

	dateShortYearMonth : function(element) {
		if (element && typeof element === 'object' && element['innerText']) {

			var result = moment(element.innerText, ['YY MMM', 'YYYY MMM']);
			if (!result.isValid()) {
				return 'Format Error: Date Short Year Month';
			}
			return result.format('YYYY-MM');
		}
		return 'Format Error: Date Short Year Month';

	},

	dateSlashDayMonthEU : function(element) {
		if (element && typeof element === 'object' && element['innerText']) {

			var result = moment(element.innerText, 'DD/MM');
			if (!result.isValid()) {
				return 'Format Error: Date Slash Day Month EU';
			}
			return result.format('--MM-DD');
		}
		return 'Format Error: Date Slash Day Month EU';
	},

	dateSlashEU : function(element) {
		if (element && typeof element === 'object' && element['innerText']) {

			var result = moment(element.innerText, ['DD/MM/YY', 'DD/MM/YYYY']);
			if (!result.isValid()) {
				return 'Format Error: Date Slash EU';
			}
			return result.format('YYYY-MM-DD');
		}
		return 'Format Error: Date Slash EU';

	},

	dateSlashMonthDayUS : function(element) {
		if (element && typeof element === 'object' && element['innerText']) {

			var result = moment(element.innerText, 'MM/DD');
			if (!result.isValid()) {
				return 'Format Error: Date Slash Month Day US';
			}
			return result.format('--MM-DD');
		}
		return 'Format Error: Date Slash Month Day US';
	},

	dateSlashUS : function(element) {
		if (element && typeof element === 'object' && element['innerText']) {

			var result = moment(element.innerText, ['MM/DD/YY', 'MM/DD/YYYY']);
			if (!result.isValid()) {
				return 'Format Error: Date Slash EU';
			}
			return result.format('YYYY-MM-DD');
		}
		return 'Format Error: Date Slash EU';

	},

	dateYearMonthCJK : function(element) {
		if (element && typeof element === 'object' && element['innerText']) {

			var regex = /^[\s\u00A0]*([0-9]{4}|[0-9]{1,2})[\s\u00A0]*\u5E74[\s\u00A0]*([0-9]{1,2})[\s\u00A0]*\u6708\s*$/;
			var result = regex.exec(FiltersNumber
					.jpDigitsToNormal(element.innerText));
			if (result) {
				var month = result[2];
				var year = result[1];
				var dateResult = moment(year + '-' + month, 'YYYY-MM');
				if (!dateResult.isValid()) {
					return 'Format Error: Date Year Month CJK';
				}

				if (dateResult.year().toString().length === 1) {
					dateResult.year(2000 + dateResult.year());
				}
				if (dateResult.year().toString().length === 2) {
					dateResult.year(2000 + dateResult.year());
				}

				return dateResult.format('YYYY-MM');
			}
		}
		return 'Format Error: Date Year Month CJK';

	},

	dateYearMonthDay : function(element) {
		if (element && typeof element === 'object' && element['innerText']) {

			var fromJP = FiltersNumber.jpDigitsToNormal(element.innerText);

			var regex = /^[\s\u00A0]*([0-9]{4}|[0-9]{1,2})[^0-9]+([0-9]{1,2})[^0-9]+([0-9]{1,2})[\s\u00A0]*$/;

			var result = regex.exec(fromJP);

			if (result) {
				var year = result[1];
				var month = result[2];
				var day = result[3];

				var dateResult = moment(year + '-' + month + '-' + day, [
						'YYYY-MM-DD', 'YYYY-MM-D', 'YYYY-M-DD', 'YY-M-DD',
						'Y-M-DD'], true);

				if (!dateResult.isValid()) {
					return 'Format Error: Date Year Month Day';
				}
				if (dateResult.year().toString().length === 1) {
					dateResult.year(2000 + dateResult.year());
				}
				if (dateResult.year().toString().length === 2) {
					dateResult.year(2000 + dateResult.year());
				}
				return dateResult.format('YYYY-MM-DD');
			}
		}
		return 'Format Error: Date Year Month Day';

	},

	dateYearMonthDayCJK : function(element) {
		if (element && typeof element === 'object' && element['innerText']) {

			var regex = /^[\s\u00A0]*([0-9]{4}|[0-9]{1,2})[\s\u00A0]*\u5E74[\s\u00A0]*([0-9]{1,2})[\s\u00A0]*\u6708[\s\u00A0]*([0-9]{1,2})[\s\u00A0]*\u65E5[\s\u00A0]*$/;
			var result = regex.exec(FiltersNumber
					.jpDigitsToNormal(element.innerText));
			if (result) {
				var year = result[1];
				var month = result[2];
				var day = result[3];
				var dateResult = moment(year + '-' + month + '-' + day,
						'YYYY-MM-DD');
				if (!dateResult.isValid()) {
					return 'Format Error: Date Year Month Day CJK';
				}

				if (dateResult.year().toString().length === 1) {
					dateResult.year(2000 + dateResult.year());
				}
				if (dateResult.year().toString().length === 2) {
					dateResult.year(2000 + dateResult.year());
				}

				return dateResult.format('YYYY-MM-DD');
			}
		}
		return 'Format Error: Date Year Month Day CJK';
	},

	dateYearMonthEN : function(element) {
		if (element && typeof element === 'object' && element['innerText']) {

			var regex = /^\s*([0-9]{1,2}|[0-9]{4})[^0-9]+(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC|JANUARY|FEBRUARY|MARCH|APRIL|MAY|JUNE|JULY|AUGUST|SEPTEMBER|OCTOBER|NOVEMBER|DECEMBER)\s*$/;

			var result = regex.exec(element.innerText);
			if (result) {
				var month = result[2];
				var year = result[1];
				var dateResult = moment(month + '-' + year, 'MMM-Y');
				if (!dateResult.isValid()) {
					return 'Format Error: Date Year Month EN';
				}

				if (dateResult.year().toString().length === 1) {
					dateResult.year(2000 + dateResult.year());
				}
				if (dateResult.year().toString().length === 2) {
					dateResult.year(2000 + dateResult.year());
				}

				return dateResult.format('YYYY-MM');

			}
		}
		return 'Format Error: Date Year Month EN';
	},

	durYear : function(element) {
		if (element && typeof element === 'object' && element['innerText']) {

			var durationObj = ConstantsDate.getDuration(element.innerText);

			if (durationObj.error) {
				return 'Format Error: Dur Year';
			}

			var years = Math.floor(durationObj.value);
			var months = ((durationObj.value - years) * 12);
			var days = ((months - Math.floor(months)) * 30.4375);

			return durationObj.negative ? '-P' + years + 'Y'
					+ Math.floor(months) + 'M' + Math.floor(days) + 'D' : 'P'
					+ years + 'Y' + Math.floor(months) + 'M' + Math.floor(days)
					+ 'D';
		}
		return 'Format Error: Dur Year';
	},

	durMonth : function(element) {
		if (element && typeof element === 'object' && element['innerText']) {
			var durationObj = ConstantsDate.getDuration(element.innerText);
			if (durationObj.error) {
				return 'Format Error: Dur Month';
			}
			var months = Math.floor(durationObj.value);
			var days = Math.floor((durationObj.value - months) * 30.4375);
			return durationObj.negative ? '-P' + Math.floor(months) + 'M'
					+ Math.floor(days) + 'D' : 'P' + Math.floor(months) + 'M'
					+ Math.floor(days) + 'D';

		}
		return 'Format Error: Dur Month';

	},

	durDay : function(element) {
		if (element && typeof element === 'object' && element['innerText']) {
			var durationObj = ConstantsDate.getDuration(element.innerText);
			if (durationObj.error) {
				return 'Format Error: Dur Day';
			}
			var days;
			var hours;
			if (durationObj.value) {
				days = Math.floor(durationObj.value);
				hours = Math.floor((durationObj.value - days) * 24);
			} else {
				days = Math.floor(durationObj.value);
				hours = Math.floor((durationObj.value - days) * 24);
			}

			if (hours === 0) {
				hours = null;
			}

			if (hours) {
				return durationObj.negative ? '-P' + Math.floor(days) + 'D'
						+ Math.floor(hours) + 'H' : 'P' + Math.floor(days)
						+ 'D' + Math.floor(hours) + 'H';
			} else {
				return durationObj.negative
						? '-P' + Math.floor(days) + 'D'
						: 'P' + Math.floor(days) + 'D';
			}

		}
		return 'Format Error: Dur Day';
	},

	durHour : function(element) {
		if (element && typeof element === 'object' && element['innerText']) {
			var durationObj = ConstantsDate.getDuration(element.innerText);
			if (durationObj.error) {
				return 'Format Error: Dur Hour';
			}

			var hours = Math.floor(durationObj.value);

			return durationObj.negative
					? '-PT' + Math.floor(hours) + 'H'
					: 'PT' + Math.floor(hours) + 'H';

		}
		return 'Format Error: Dur Hour';
	},

	durWordsEn : function(element) {
		if (element && typeof element === 'object' && element['innerText']) {

			var regex = /^\s*((((([Oo]ne|[Tt](wo|hree|en|welve|hirteen)|[Ff](our(teen)?|ive|ifteen)|[Ss](ix(teen)?|even(teen)?)|[Ee](ight(een)?|leven)|[Nn]ine(teen)?)([\u058A\u05BE\u2010\u2011\u2012\u2013\u2014\u2015\uFE58\uFE63\uFF0D\-]|\s+)+[Hh]undred([\u058A\u05BE\u2010\u2011\u2012\u2013\u2014\u2015\uFE58\uFE63\uFF0D\s-]+(and[\s]+)?(([Oo]ne|[Tt](wo|hree|en|welve|hirteen)|[Ff](our(teen)?|ive|ifteen)|[Ss](ix(teen)?|even(teen)?)|[Ee](ight(een)?|leven)|[Nn]ine(teen)?)|([Tt](wenty|hirty)|[Ff](orty|ifty)|[Ss](ixty|eventy)|[Ee]ighty|[Nn]inety)(([\u058A\u05BE\u2010\u2011\u2012\u2013\u2014\u2015\uFE58\uFE63\uFF0D-]|\s+)([Oo]ne|[Tt](wo|hree)|[Ff](our|ive)|[Ss](ix|even)|[Ee]ight|[Nn]ine))?))?)|(([Oo]ne|[Tt](wo|hree|en|welve|hirteen)|[Ff](our(teen)?|ive|ifteen)|[Ss](ix(teen)?|even(teen)?)|[Ee](ight(een)?|leven)|[Nn]ine(teen)?)|([Tt](wenty|hirty)|[Ff](orty|ifty)|[Ss](ixty|eventy)|[Ee]ighty|[Nn]inety)(([\u058A\u05BE\u2010\u2011\u2012\u2013\u2014\u2015\uFE58\uFE63\uFF0D-]|\s+)([Oo]ne|[Tt](wo|hree)|[Ff](our|ive)|[Ss](ix|even)|[Ee]ight|[Nn]ine))?))|[Zz]ero|[Nn]o|[0-9][0-9]{0,3})[\u058A\u05BE\u2010\u2011\u2012\u2013\u2014\u2015\uFE58\uFE63\uFF0D\s-]+[Yy]ears?(,?[\u058A\u05BE\u2010\u2011\u2012\u2013\u2014\u2015\uFE58\uFE63\uFF0D\s-]+(and[\u058A\u05BE\u2010\u2011\u2012\u2013\u2014\u2015\uFE58\uFE63\uFF0D\s-]+)?|$))?((((([Oo]ne|[Tt](wo|hree|en|welve|hirteen)|[Ff](our(teen)?|ive|ifteen)|[Ss](ix(teen)?|even(teen)?)|[Ee](ight(een)?|leven)|[Nn]ine(teen)?)[\u058A\u05BE\u2010\u2011\u2012\u2013\u2014\u2015\uFE58\uFE63\uFF0D\s-]+[Hh]undred([\u058A\u05BE\u2010\u2011\u2012\u2013\u2014\u2015\uFE58\uFE63\uFF0D\s-]+(and[\u058A\u05BE\u2010\u2011\u2012\u2013\u2014\u2015\uFE58\uFE63\uFF0D\s-]+)?(([Oo]ne|[Tt](wo|hree|en|welve|hirteen)|[Ff](our(teen)?|ive|ifteen)|[Ss](ix(teen)?|even(teen)?)|[Ee](ight(een)?|leven)|[Nn]ine(teen)?)|([Tt](wenty|hirty)|[Ff](orty|ifty)|[Ss](ixty|eventy)|[Ee]ighty|[Nn]inety)(([\u058A\u05BE\u2010\u2011\u2012\u2013\u2014\u2015\uFE58\uFE63\uFF0D-]|\s+)([Oo]ne|[Tt](wo|hree)|[Ff](our|ive)|[Ss](ix|even)|[Ee]ight|[Nn]ine))?))?)|(([Oo]ne|[Tt](wo|hree|en|welve|hirteen)|[Ff](our(teen)?|ive|ifteen)|[Ss](ix(teen)?|even(teen)?)|[Ee](ight(een)?|leven)|[Nn]ine(teen)?)|([Tt](wenty|hirty)|[Ff](orty|ifty)|[Ss](ixty|eventy)|[Ee]ighty|[Nn]inety)(([\u058A\u05BE\u2010\u2011\u2012\u2013\u2014\u2015\uFE58\uFE63\uFF0D-]|\s+)([Oo]ne|[Tt](wo|hree)|[Ff](our|ive)|[Ss](ix|even)|[Ee]ight|[Nn]ine))?))|[Zz]ero|[Nn]o|[0-9][0-9]{0,3})[\u058A\u05BE\u2010\u2011\u2012\u2013\u2014\u2015\uFE58\uFE63\uFF0D\s-]+[Mm]onths?(,?[\u058A\u05BE\u2010\u2011\u2012\u2013\u2014\u2015\uFE58\uFE63\uFF0D\s-]+(and[\u058A\u05BE\u2010\u2011\u2012\u2013\u2014\u2015\uFE58\uFE63\uFF0D\s-]+)?|$))?((((([Oo]ne|[Tt](wo|hree|en|welve|hirteen)|[Ff](our(teen)?|ive|ifteen)|[Ss](ix(teen)?|even(teen)?)|[Ee](ight(een)?|leven)|[Nn]ine(teen)?)[\u058A\u05BE\u2010\u2011\u2012\u2013\u2014\u2015\uFE58\uFE63\uFF0D\s-]+[Hh]undred([\u058A\u05BE\u2010\u2011\u2012\u2013\u2014\u2015\uFE58\uFE63\uFF0D\s-]+(and[\u058A\u05BE\u2010\u2011\u2012\u2013\u2014\u2015\uFE58\uFE63\uFF0D\s-]+)?(([Oo]ne|[Tt](wo|hree|en|welve|hirteen)|[Ff](our(teen)?|ive|ifteen)|[Ss](ix(teen)?|even(teen)?)|[Ee](ight(een)?|leven)|[Nn]ine(teen)?)|([Tt](wenty|hirty)|[Ff](orty|ifty)|[Ss](ixty|eventy)|[Ee]ighty|[Nn]inety)(([\u058A\u05BE\u2010\u2011\u2012\u2013\u2014\u2015\uFE58\uFE63\uFF0D-]|\s+)([Oo]ne|[Tt](wo|hree)|[Ff](our|ive)|[Ss](ix|even)|[Ee]ight|[Nn]ine))?))?)|(([Oo]ne|[Tt](wo|hree|en|welve|hirteen)|[Ff](our(teen)?|ive|ifteen)|[Ss](ix(teen)?|even(teen)?)|[Ee](ight(een)?|leven)|[Nn]ine(teen)?)|([Tt](wenty|hirty)|[Ff](orty|ifty)|[Ss](ixty|eventy)|[Ee]ighty|[Nn]inety)(([\u058A\u05BE\u2010\u2011\u2012\u2013\u2014\u2015\uFE58\uFE63\uFF0D-]|\s+)([Oo]ne|[Tt](wo|hree)|[Ff](our|ive)|[Ss](ix|even)|[Ee]ight|[Nn]ine))?))|[Zz]ero|[Nn]o|[0-9][0-9]{0,3})[\u058A\u05BE\u2010\u2011\u2012\u2013\u2014\u2015\uFE58\uFE63\uFF0D\s-]+[Dd]ays?)?\s*$/;
			var secondRegex = /^\s*[\u058A\u05BE\u2010\u2011\u2012\u2013\u2014\u2015\uFE58\uFE63\uFF0D-]?([Zz]ero|[Nn]o(ne)?)[\u058A\u05BE\u2010\u2011\u2012\u2013\u2014\u2015\uFE58\uFE63\uFF0D-]?\s*$/;
			var thirdRegex = /,|\sand\s/g;
			var result = regex.exec(element.innerText);
			if (result && element.innerText.trim().length > 0) {
				var dur = 'P';
				var grp = [[1 + 1, 'Y'], [62 + 1, 'M'], [122 + 1, 'D']];
				for (var i = 0; i < grp.length; i++) {
					var groupIndex = grp[i][0];
					var groupSuffix = grp[i][1];
					var groupPart = result[groupIndex];
					if (groupPart && groupPart !== null) {
						if (secondRegex.exec(groupPart) == null) {
							if (isNaN(groupPart)) {
								var tmp = groupPart.trim().toLowerCase()
										.replace(thirdRegex, ' ');
								dur += ConstantsNumber.textToNumber(tmp);
							} else {
								dur += groupPart;
							}
							dur += groupSuffix;
						}
					}
				}
				return (dur.length > 1) ? dur : "P0D";
			}

		}
		return 'Format Error: Dur Words EN';
	}
};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var FiltersFormat = {
  getFormattedFormat : function( format ) {
    if ( format && typeof format === 'string' ) {
      if ( format.split(':').length > 1 ) {
        return format.split(':')[1];
      }
      return null
    }
    return null;
  }
};

/*
 * Created by staff of the U.S. Securities and Exchange Commission. Data and
 * content created by government employees within the scope of their
 * employment are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var FiltersName = {
  
  getFormattedName : function( name ) {
    if ( name && typeof name === 'string' ) {
      if ( name.split(':').length > 1 ) {
        
        var returnedName = '';
        name = name.split(':');
        returnedName += '<span class="font-weight-bold">' + name[0].toUpperCase() + '</span>';
        returnedName += '<span class="ml-1">' + name[1].replace(/([A-Z])/g, ' $1').trim() + '</span>';
        return returnedName;
      }
    }
    return '';
  },
  
  getFormattedType : function( name ) {
    if ( name && typeof name === 'string' ) {
      var foundTagInformation = Constants.getMetaTags.filter(function( element ) {
        if ( element['original-name'] === name.replace(':', '_') ) {
          return true;
        }
        return false;
      });
      if ( foundTagInformation && foundTagInformation[0] && foundTagInformation[0]['xbrltype'] ) {
        // we format
        var returnedType = foundTagInformation[0]['xbrltype'].replace(/([A-Z])/g, ' $1').trim();
        return returnedType.charAt(0).toUpperCase() + returnedType.slice(1);
      }
      return null;
    }
    return null;
  },
  
  getDefinition : function( name ) {
    if ( name && typeof name === 'string' ) {
      var foundTagInformation = Constants.getMetaTags.filter(function( element ) {
        if ( element['original-name'] === name.replace(':', '_') ) {
          return true;
        }
        return false;
      });
      if ( foundTagInformation && foundTagInformation[0] && foundTagInformation[0]['lang'] ) {
        var stringToReturn = '';
        Object.keys(foundTagInformation[0]['lang']).forEach(
            function( current, index ) {
              if ( foundTagInformation[0]['lang'][current]['role']
                  && foundTagInformation[0]['lang'][current]['role']['documentation'] ) {
                
                if ( Object.keys(foundTagInformation[0]['lang']).length === 1 ) {
                  stringToReturn = foundTagInformation[0]['lang'][current]['role']['documentation'];
                } else {
                  
                  stringToReturn += '<span class="font-weight-bold">' + current.toUpperCase() + '</span>: '
                      + foundTagInformation[0]['lang'][current]['role']['documentation'];
                  
                  if ( index < Object.keys(foundTagInformation[0]['lang']).length ) {
                    stringToReturn += '<br>';
                  }
                }
              }
              
            });
        return stringToReturn;
      }
      return null;
    }
    return null;
  },
  
  getAllLabelObject : function( name ) {
    if ( name && typeof name === 'string' ) {
      var foundTagInformation = Constants.getMetaTags.filter(function( element ) {
        if ( element['original-name'] === name.replace(':', '_') ) {
          return true;
        }
        return false;
      });
      if ( foundTagInformation && foundTagInformation[0] && foundTagInformation[0]['lang'] ) {
        var objectToReturn = {};
        
        Object.keys(foundTagInformation[0]['lang']).forEach(function( current, index, array ) {
          var language = '';
          if ( array.length > 1 ) {
            language = '(' + current.toUpperCase() + ')';
          }
          if ( foundTagInformation[0]['lang'][current]['role'] ) {
            for ( var label in foundTagInformation[0]['lang'][current]['role'] ) {
              var updatedLabel = label.charAt(0).toUpperCase() + label.slice(1).replace(/([A-Z])/g, ' $1');
              
              if ( language ) {
                objectToReturn[updatedLabel + ' ' + language] = foundTagInformation[0]['lang'][current]['role'][label];
                
              } else {
                objectToReturn[updatedLabel] = foundTagInformation[0]['lang'][current]['role'][label];
              }
            }
          }
          
        });
        return objectToReturn;
      }
    }
    return null;
  },
  
  getAllLabels : function( name ) {
    if ( name && typeof name === 'string' ) {
      var foundTagInformation = Constants.getMetaTags.filter(function( element ) {
        if ( element['original-name'] === name.replace(':', '_') ) {
          return true;
        }
        return false;
      });
      if ( foundTagInformation && foundTagInformation[0] && foundTagInformation[0]['lang'] ) {
        var arrayToReturn = [ ];
        
        Object.keys(foundTagInformation[0]['lang']).forEach(function( current, index ) {
          
          if ( foundTagInformation[0]['lang'][current]['role'] ) {
            
            for ( var label in foundTagInformation[0]['lang'][current]['role'] ) {
              if ( label.toLowerCase().indexOf('label') >= 0 ) {
                arrayToReturn.push(foundTagInformation[0]['lang'][current]['role'][label]);
              }
            }
          }
        });
        return arrayToReturn;
      }
    }
    return null;
  },
  
  getLabel : function( name ) {
    if ( name && typeof name === 'string' ) {
      var foundTagInformation = Constants.getMetaTags.filter(function( element ) {
        if ( element['original-name'] === name.replace(':', '_') ) {
          return true;
        }
        return false;
      });
      
      if ( foundTagInformation && foundTagInformation[0] && foundTagInformation[0]['lang'] ) {
        var stringToReturn = '';
        
        Object.keys(foundTagInformation[0]['lang']).forEach(
            function( current, index ) {
              if ( foundTagInformation[0]['lang'][current]['role']
                  && foundTagInformation[0]['lang'][current]['role']['label'] ) {
                if ( Object.keys(foundTagInformation[0]['lang']).length === 1 ) {
                  stringToReturn = foundTagInformation[0]['lang'][current]['role']['label'];
                } else {
                  stringToReturn += '<span class="font-weight-bold">' + current.toUpperCase() + '</span>: '
                      + foundTagInformation[0]['lang'][current]['role']['label'];
                  
                  if ( index < Object.keys(foundTagInformation[0]['lang']).length ) {
                    stringToReturn += '<br>';
                  }
                }
              }
              
            });
        return stringToReturn;
        
      }
      return null;
    }
    return null;
  },
  
  getTextOnlyLabel : function( name ) {
    
    if ( name && typeof name === 'string' ) {
      var foundTagInformation = Constants.getMetaTags.filter(function( element ) {
        if ( element['original-name'] === name.replace(':', '_') ) {
          return true;
        }
        return false;
      });
      
      if ( foundTagInformation && foundTagInformation[0] && foundTagInformation[0]['lang'] ) {
        if ( Object.keys(foundTagInformation[0]['lang']).length > 0 ) {
          return foundTagInformation[0]['lang'][Object.keys(foundTagInformation[0]['lang'])[0]]['role']['label'];
        }
        
      }
      return null;
    }
    return null;
  },
  
  getTerseLabel : function( name ) {
    if ( name && typeof name === 'string' ) {
      var foundTagInformation = Constants.getMetaTags.filter(function( element ) {
        if ( element['original-name'] === name.replace(':', '_') ) {
          return true;
        }
        return false;
      });
      
      if ( foundTagInformation && foundTagInformation[0] && foundTagInformation[0]['lang'] ) {
        var stringToReturn = '';
        Object.keys(foundTagInformation[0]['lang']).forEach(
            function( current, index ) {
              if ( foundTagInformation[0]['lang'][current]['role']
                  && foundTagInformation[0]['lang'][current]['role']['terseLabel'] ) {
                stringToReturn += '<span class="font-weight-bold">' + current.toUpperCase() + '</span>: '
                    + foundTagInformation[0]['lang'][current]['role']['terseLabel'];
                
                if ( index < Object.keys(foundTagInformation[0]['lang']).length ) {
                  stringToReturn += '<br>';
                }
              }
              
            });
        return stringToReturn;
      }
      return null;
    }
    return null;
  },
  
  getTerseLabelOnlyLabel : function( name ) {
    if ( name && typeof name === 'string' ) {
      var foundTagInformation = Constants.getMetaTags.filter(function( element ) {
        if ( element['original-name'] === name.replace(':', '_') ) {
          return true;
        }
        return false;
      });
      
      if ( foundTagInformation && foundTagInformation[0] && foundTagInformation[0]['lang'] ) {
        var stringToReturn = '';
        Object.keys(foundTagInformation[0]['lang']).forEach(
            function( current, index ) {
              if ( foundTagInformation[0]['lang'][current]['role']
                  && foundTagInformation[0]['lang'][current]['role']['terseLabel'] ) {
                stringToReturn += foundTagInformation[0]['lang'][current]['role']['terseLabel'];
              }
              
            });
        return stringToReturn;
      }
      return null;
    }
    return null;
  },
  
  getLabelForTitle : function( name ) {
    if ( name && typeof name === 'string' ) {
      var foundTagInformation = Constants.getMetaTags.filter(function( element ) {
        if ( element['original-name'] === name.replace(':', '_') ) {
          return true;
        }
        return false;
      });
      
      if ( foundTagInformation && foundTagInformation[0] && foundTagInformation[0]['lang'] ) {
        var stringToReturn = '';
        Object.keys(foundTagInformation[0]['lang']).forEach(
            function( current, index ) {
              if ( foundTagInformation[0]['lang'][current]['role']
                  && foundTagInformation[0]['lang'][current]['role']['label'] ) {
                stringToReturn += foundTagInformation[0]['lang'][current]['role']['label'];
              }
              
            });
        return stringToReturn;
      }
      return null;
    }
    return null;
  },
  
  getAuthRefs : function( name ) {
    if ( name && typeof name === 'string' ) {
      var foundTagInformation = Constants.getMetaTags.filter(function( element ) {
        if ( element['original-name'] === name.replace(':', '_') ) {
          return true;
        }
        return false;
      });
      if ( foundTagInformation && foundTagInformation[0] && foundTagInformation[0]['auth_ref'] ) {
        return foundTagInformation[0]['auth_ref'];
      }
      return null;
    }
    return null;
  },
  
  getTag : function( name ) {
    if ( name && typeof name === 'string' ) {
      return Constants.getMetaTags.filter(function( element ) {
        return element['original-name'] === name.replace(':', '_');
      });
    }
  },
  
  getCalculationsForModal : function( name ) {
    if ( (name && typeof name === 'string') ) {
      
      var foundTag = Constants.getMetaTags.filter(function( element ) {
        return element['original-name'] === name.replace(':', '_');
      });
      
      if ( foundTag && foundTag[0] && foundTag[0]['calculation'] ) {
        var returnArray = [ ];
        Object.keys(foundTag[0]['calculation']).forEach(
            function( current, index ) {
              Constants.getMetaReports.forEach(function( nestedCurrent ) {
                if ( nestedCurrent['role'] === current ) {
                  
                  returnArray.push({
                    'blank' : true,
                  });
                  
                  returnArray.push({
                    'label' : 'Section',
                    'value' : nestedCurrent['longName'],
                  });
                  
                  var weight = foundTag[0]['calculation'][current]['weight'] || null;
                  
                  if ( weight ) {
                    weight = weight > 0 ? 'Added to parent (' + weight.toFixed(2) + ')' : 'Substracted from parent ('
                        + weight.toFixed(2) + ')';
                  } else {
                    weight = 'Not Available.';
                  }
                  
                  returnArray.push({
                    'label' : 'Weight',
                    'value' : weight,
                  });
                  
                  var parent = foundTag[0]['calculation'][current]['parentTag'] || null;
                  
                  if ( parent ) {
                    parent = FiltersName.getFormattedName(parent.replace('_', ':'));
                  } else {
                    parent = 'Not Available.';
                  }
                  
                  returnArray.push({
                    'label' : 'Parent',
                    'value' : parent,
                  });
                }
              });
            });
        return returnArray;
      }
      return null;
    } else {
      return null;
    }
  }

};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var FiltersNumber = {
  numberFormatting : function( element, input ) {
    
    if ( element.hasAttribute('xsi:nil') ) {
      return 'nil';
    }
    if ( element.nodeName.split(':')[1].toLowerCase() === 'nonfraction' ) {
      if ( element.hasAttribute('xsi:nil') && (element.getAttribute('xsi:nil') === true) ) {
        return 'nil';
        
      } else if ( element.innerHTML === '—' ) {
        return input;
      } else {
        var scale = (element.hasAttribute('scale') && parseInt(element.getAttribute('scale'))) ? parseInt(element
            .getAttribute('scale')) : 0;
        
        var decimals = (element.hasAttribute('decimals') && parseInt(element.getAttribute('decimals'))) ? parseInt(element
            .getAttribute('decimals'))
            : 0;
        
        if ( scale > 0 ) {
          
          var periodIndex = input.indexOf('.');
          if ( periodIndex !== -1 ) {
            
            var inputArray = input.split('.');
            scale = scale - inputArray[1].length;
          }
          input = input.padEnd(input.length + Math.abs(scale), 0);
          input = input.replace('.', '');
          input = [ input.slice(0, scale), input.slice(scale) ].join('');
//          if ( periodIndex !== -1 ) {
//            console.log(scale);
//            input = [ input.slice(0, scale), input.slice(scale) ].join('');
//          } else {
//            //console.log(scale);
//            input = [ input.slice(0, scale), input.slice(scale) ].join('');
//          }
          
        } else if ( scale < 0 ) {
          
          var absScale = Math.abs(scale);
          
          if ( (input).split('.')[1] ) {
            var precision = (input).split('.')[1].length + 2;
            input = (input / 100).toFixed(precision);
          }
          
        }
        
        if ( element.hasAttribute('sign') ) {
          input = element.getAttribute('sign') + input;
        }
        
        // adding commas when necessary
        input = input.toString().replace(/,/g, '');
        var arraySplitByPeriod = input.toString().split('.');
        if ( arraySplitByPeriod.length > 0 ) {
          arraySplitByPeriod[0] = arraySplitByPeriod[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          if ( arraySplitByPeriod[1] && arraySplitByPeriod[1].match(/^0+$/) ) {
            arraySplitByPeriod[1] = '';
            return arraySplitByPeriod.join('');
          }
          return arraySplitByPeriod.join('.');
        }
        return input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
    } else {
      return input;
    }
    
  },
  
  jpDigitsToNormal : function( jpDigits ) {
    if ( jpDigits && typeof jpDigits === 'string' ) {
      var normal = '';
      for ( var i = 0; i < jpDigits.length; i++ ) {
        var d = jpDigits[i];
        if ( '\uFF10' <= d && d <= '\uFF19' )
          normal += String.fromCharCode(d.charCodeAt(0) - 0xFF10 + '0'.charCodeAt(0));
        else
          normal += d;
      }
      return normal;
    }
    return null
  },
  
  numComma : function( element ) {
    if ( element && typeof element === 'object' && element['innerText'] ) {
      if ( isNaN(element.innerText) ) {
        return 'Format Error: Num Comma';
      }
      return parseInt(element.innerText).toLocaleString();
    }
    return 'Format Error: Num Comma';
  },
  
  numDotDecimal : function( element ) {
    if ( element && typeof element === 'object' && element['innerText'] ) {
      
      var regex = /^\s*[0-9]{1,3}([, \xA0]?[0-9]{3})*(\.[0-9]+)?\s*$/;
      
      if ( regex.exec(element.innerText) ) {
        
        return element.innerText.replace(/\,/g, '').replace(/ /g, '').replace('/\u00A0/g', '');
        return FiltersNumber.numberFormatting(element, element.innerText.replace(/\,/g, '').replace(/ /g, '').replace(
            '/\u00A0/g', ''));
        
      }
    }
    return 'Format Error: Num Dot Decimal';
    
  },
  
  textToNumber : function( numberAsString ) {
    // if ( numberAsString && typeof element === 'string' ) {
    var wordSplitPattern = /[\s-]+/;
    var a = numberAsString.toString().split(wordSplitPattern);
    var n = 0;
    var g = 0;
    for ( var i = 0; i < a.length; i++ ) {
      var w = a[i];
      var x = ConstantsNumber.getSmallNumber[w];
      if ( x != null ) {
        g = g + x;
      } else if ( w === 'hundred' ) {
        g = g * 100;
      } else {
        x = ConstantsNumber.getMagnitude[w];
        if ( x !== null ) {
          n = n + g * x;
          g = 0;
        } else {
          return 'ixt:text2numError ' + w;
        }
      }
    }
    return n + g;
    
  },
  
  numCommaDecimal : function( element ) {
    if ( element && typeof element === 'object' && element['innerText'] ) {
      
      var regex = /^\s*[0-9]{1,3}([. \xA0]?[0-9]{3})*(,[0-9]+)?\s*$/;
      
      if ( regex.exec(element.innerText) ) {
        
        return element.innerText.replace(/\./g, '').replace(/\,/g, '.').replace(/ /g, '').replace('/\u00A0/g', '');
      }
    }
    return 'Format Error: Num Comma Decimal';
  },
  
  numCommaDot : function( element ) {
    if ( element && typeof element === 'object' && element['innerText'] ) {
      
      if ( isNaN(element.innerText.replace(',', '')) ) {
        return 'Format Error: Num Comma Dot';
      }
      return element.innerText.replace(',', '');
    }
    return 'Format Error: Num Comma Dot';
  },
  
  numDash : function( element ) {
    if ( element && typeof element === 'object' && element['innerText'] ) {
      
      return element.innerText.replace('-', '0');
    }
    return 'Format Error: Num Dash';
  },
  
  numDotComma : function( element ) {
    if ( element && typeof element === 'object' && element['innerText'] ) {
      
      return element.innerText.replace('.', '').replace(',', '.');
    }
    return 'Format Error: Num Dot Comma';
  },
  
  numDotDecimalIN : function( element ) {
    
    if ( element && typeof element === 'object' && element['innerText'] ) {
      var regex = /^(([0-9]{1,2}[, \xA0])?([0-9]{2}[, \xA0])*[0-9]{3})([.][0-9]+)?$|^([0-9]+)([.][0-9]+)?$/;
      var result = regex.exec(element.innerText);
      if ( result ) {
        var lastM = '';
        var fraction;
        var arrayResult = result.filter(function( element ) {
          return element;
        });
        
        for ( var i = result.length - 1; i >= 0; i-- ) {
          if ( result[i] ) {
            lastM = result[i];
            break;
          }
        }
        if ( lastM && lastM.charAt(0) === '.' ) {
          fraction = arrayResult[-1];
        } else {
          fraction = '';
        }
        
        return arrayResult[0].replace(/\,/g, '').replace(/ /g, '').replace(/\xa0/g, '') + (fraction ? fraction : '');
      }
    }
    return 'Format Error: Num Dot Decimal IN';
    
  },
  
  numSpaceComma : function( element ) {
    if ( element && typeof element === 'object' && element['innerText'] ) {
      
      return element.innerText.replace(' ', '').replace(',', '.');
    }
    return 'Format Error: Num Space Comma';
  },
  
  numSpaceDot : function( element ) {
    if ( element && typeof element === 'object' && element['innerText'] ) {
      
      return element.innerText.replace(' ', '');
    }
    return 'Format Error: Num Space Dot';
    
  },
  
  numUnitDecimal : function( element ) {
    if ( element && typeof element === 'object' && element['innerText'] ) {
      
      var regex = /^([0]|([1-9][0-9]{0,2}([.,\uFF0C\uFF0E]?[0-9]{3})*))[^0-9,.\uFF0C\uFF0E]+([0-9]{1,2})[^0-9,.\uFF0C\uFF0E]*$/;
      
      var result = regex.exec(FiltersNumber.jpDigitsToNormal(element.innerText));
      if ( result ) {
        
        return result[1].replace(/\./g, '').replace(/\,/g, '').replace('/\uFF0C/g', '').replace('/\uFF0E/g', '')
            .replace(/\，/g, '')
            + '.' + ConstantsNumber.zeroPadTwoDigits(result[result.length - 1]);
      }
    }
    
    return 'Format Error: Num Unit Decimal';
  },
  
  numUnitDecimalIN : function( element ) {
    if ( element && typeof element === 'object' && element['innerText'] ) {
      
      var regex = /^(([0-9]{1,2}[, \xA0])?([0-9]{2}[, \xA0])*[0-9]{3})([^0-9]+)([0-9]{1,2})([^0-9]*)$|^([0-9]+)([^0-9]+)([0-9]{1,2})([^0-9]*)$/;
      var result = regex.exec(element.innerText);
      if ( result ) {
        var m2 = [ ];
        for ( var i = 0; i < result.length; i++ ) {
          if ( result[i] ) {
            m2.push(result[i]);
          }
        }
        return m2[1].replace(/\,/g, '').replace(/ /g, '').replace('/\xa0/g', '') + '.'
            + ConstantsNumber.zeroPadTwoDigits(m2[m2.length - 2]);
      }
    }
    return "Format Error: Num Unit Decimal IN";
    
  },
  
  numWordsEn : function( element ) {
    if ( element && typeof element === 'object' && element['innerText'] ) {
      
      var regex = /^\s*([Nn]o(ne)?|[Nn]il|[Zz]ero)\s*$/;
      
      if ( regex.exec(element.innerText) ) {
        return "0";
      } else if ( element.innerText.trim().length > 0 ) {
        
        var secondRegex = /^\s*(((((([Oo]ne|[Tt](wo|hree|en|welve|hirteen)|[Ff](our(teen)?|ive|ifteen)|[Ss](ix(teen)?|even(teen)?)|[Ee](ight(een)?|leven)|[Nn]ine(teen)?)\s+[Hh]undred(\s+(and\s+)?(([Oo]ne|[Tt](wo|hree|en|welve|hirteen)|[Ff](our(teen)?|ive|ifteen)|[Ss](ix(teen)?|even(teen)?)|[Ee](ight(een)?|leven)|[Nn]ine(teen)?)|([Tt](wenty|hirty)|[Ff](orty|ifty)|[Ss](ixty|eventy)|[Ee]ighty|[Nn]inety)(([\u058A\u05BE\u2010\u2011\u2012\u2013\u2014\u2015\uFE58\uFE63\uFF0D-]|\s+)([Oo]ne|[Tt](wo|hree)|[Ff](our|ive)|[Ss](ix|even)|[Ee]ight|[Nn]ine))?))?)|(([Oo]ne|[Tt](wo|hree|en|welve|hirteen)|[Ff](our(teen)?|ive|ifteen)|[Ss](ix(teen)?|even(teen)?)|[Ee](ight(een)?|leven)|[Nn]ine(teen)?)|([Tt](wenty|hirty)|[Ff](orty|ifty)|[Ss](ixty|eventy)|[Ee]ighty|[Nn]inety)(([\u058A\u05BE\u2010\u2011\u2012\u2013\u2014\u2015\uFE58\uFE63\uFF0D-]|\s+)([Oo]ne|[Tt](wo|hree)|[Ff](our|ive)|[Ss](ix|even)|[Ee]ight|[Nn]ine))?))\s+[Qq]uintillion(\s*,\s*|\s+|$))?(((([Oo]ne|[Tt](wo|hree|en|welve|hirteen)|[Ff](our(teen)?|ive|ifteen)|[Ss](ix(teen)?|even(teen)?)|[Ee](ight(een)?|leven)|[Nn]ine(teen)?)\s+[Hh]undred(\s+(and\s+)?(([Oo]ne|[Tt](wo|hree|en|welve|hirteen)|[Ff](our(teen)?|ive|ifteen)|[Ss](ix(teen)?|even(teen)?)|[Ee](ight(een)?|leven)|[Nn]ine(teen)?)|([Tt](wenty|hirty)|[Ff](orty|ifty)|[Ss](ixty|eventy)|[Ee]ighty|[Nn]inety)(([\u058A\u05BE\u2010\u2011\u2012\u2013\u2014\u2015\uFE58\uFE63\uFF0D-]|\s+)([Oo]ne|[Tt](wo|hree)|[Ff](our|ive)|[Ss](ix|even)|[Ee]ight|[Nn]ine))?))?)|(([Oo]ne|[Tt](wo|hree|en|welve|hirteen)|[Ff](our(teen)?|ive|ifteen)|[Ss](ix(teen)?|even(teen)?)|[Ee](ight(een)?|leven)|[Nn]ine(teen)?)|([Tt](wenty|hirty)|[Ff](orty|ifty)|[Ss](ixty|eventy)|[Ee]ighty|[Nn]inety)(([\u058A\u05BE\u2010\u2011\u2012\u2013\u2014\u2015\uFE58\uFE63\uFF0D-]|\s+)([Oo]ne|[Tt](wo|hree)|[Ff](our|ive)|[Ss](ix|even)|[Ee]ight|[Nn]ine))?))\s+[Qq]uadrillion(\s*,\s*|\s+|$))?(((([Oo]ne|[Tt](wo|hree|en|welve|hirteen)|[Ff](our(teen)?|ive|ifteen)|[Ss](ix(teen)?|even(teen)?)|[Ee](ight(een)?|leven)|[Nn]ine(teen)?)\s+[Hh]undred(\s+(and\s+)?(([Oo]ne|[Tt](wo|hree|en|welve|hirteen)|[Ff](our(teen)?|ive|ifteen)|[Ss](ix(teen)?|even(teen)?)|[Ee](ight(een)?|leven)|[Nn]ine(teen)?)|([Tt](wenty|hirty)|[Ff](orty|ifty)|[Ss](ixty|eventy)|[Ee]ighty|[Nn]inety)(([\u058A\u05BE\u2010\u2011\u2012\u2013\u2014\u2015\uFE58\uFE63\uFF0D-]|\s+)([Oo]ne|[Tt](wo|hree)|[Ff](our|ive)|[Ss](ix|even)|[Ee]ight|[Nn]ine))?))?)|(([Oo]ne|[Tt](wo|hree|en|welve|hirteen)|[Ff](our(teen)?|ive|ifteen)|[Ss](ix(teen)?|even(teen)?)|[Ee](ight(een)?|leven)|[Nn]ine(teen)?)|([Tt](wenty|hirty)|[Ff](orty|ifty)|[Ss](ixty|eventy)|[Ee]ighty|[Nn]inety)(([\u058A\u05BE\u2010\u2011\u2012\u2013\u2014\u2015\uFE58\uFE63\uFF0D-]|\s+)([Oo]ne|[Tt](wo|hree)|[Ff](our|ive)|[Ss](ix|even)|[Ee]ight|[Nn]ine))?))\s+[Tt]rillion(\s*,\s*|\s+|$))?(((([Oo]ne|[Tt](wo|hree|en|welve|hirteen)|[Ff](our(teen)?|ive|ifteen)|[Ss](ix(teen)?|even(teen)?)|[Ee](ight(een)?|leven)|[Nn]ine(teen)?)\s+[Hh]undred(\s+(and\s+)?(([Oo]ne|[Tt](wo|hree|en|welve|hirteen)|[Ff](our(teen)?|ive|ifteen)|[Ss](ix(teen)?|even(teen)?)|[Ee](ight(een)?|leven)|[Nn]ine(teen)?)|([Tt](wenty|hirty)|[Ff](orty|ifty)|[Ss](ixty|eventy)|[Ee]ighty|[Nn]inety)(([\u058A\u05BE\u2010\u2011\u2012\u2013\u2014\u2015\uFE58\uFE63\uFF0D-]|\s+)([Oo]ne|[Tt](wo|hree)|[Ff](our|ive)|[Ss](ix|even)|[Ee]ight|[Nn]ine))?))?)|(([Oo]ne|[Tt](wo|hree|en|welve|hirteen)|[Ff](our(teen)?|ive|ifteen)|[Ss](ix(teen)?|even(teen)?)|[Ee](ight(een)?|leven)|[Nn]ine(teen)?)|([Tt](wenty|hirty)|[Ff](orty|ifty)|[Ss](ixty|eventy)|[Ee]ighty|[Nn]inety)(([\u058A\u05BE\u2010\u2011\u2012\u2013\u2014\u2015\uFE58\uFE63\uFF0D-]|\s+)([Oo]ne|[Tt](wo|hree)|[Ff](our|ive)|[Ss](ix|even)|[Ee]ight|[Nn]ine))?))\s+[Bb]illion(\s*,\s*|\s+|$))?(((([Oo]ne|[Tt](wo|hree|en|welve|hirteen)|[Ff](our(teen)?|ive|ifteen)|[Ss](ix(teen)?|even(teen)?)|[Ee](ight(een)?|leven)|[Nn]ine(teen)?)\s+[Hh]undred(\s+(and\s+)?(([Oo]ne|[Tt](wo|hree|en|welve|hirteen)|[Ff](our(teen)?|ive|ifteen)|[Ss](ix(teen)?|even(teen)?)|[Ee](ight(een)?|leven)|[Nn]ine(teen)?)|([Tt](wenty|hirty)|[Ff](orty|ifty)|[Ss](ixty|eventy)|[Ee]ighty|[Nn]inety)(([\u058A\u05BE\u2010\u2011\u2012\u2013\u2014\u2015\uFE58\uFE63\uFF0D-]|\s+)([Oo]ne|[Tt](wo|hree)|[Ff](our|ive)|[Ss](ix|even)|[Ee]ight|[Nn]ine))?))?)|(([Oo]ne|[Tt](wo|hree|en|welve|hirteen)|[Ff](our(teen)?|ive|ifteen)|[Ss](ix(teen)?|even(teen)?)|[Ee](ight(een)?|leven)|[Nn]ine(teen)?)|([Tt](wenty|hirty)|[Ff](orty|ifty)|[Ss](ixty|eventy)|[Ee]ighty|[Nn]inety)(([\u058A\u05BE\u2010\u2011\u2012\u2013\u2014\u2015\uFE58\uFE63\uFF0D-]|\s+)([Oo]ne|[Tt](wo|hree)|[Ff](our|ive)|[Ss](ix|even)|[Ee]ight|[Nn]ine))?))\s+[Mm]illion(\s*,\s*|\s+|$))?((((([Oo]ne|[Tt](wo|hree|en|welve|hirteen)|[Ff](our(teen)?|ive|ifteen)|[Ss](ix(teen)?|even(teen)?)|[Ee](ight(een)?|leven)|[Nn]ine(teen)?)\s+[Hh]undred(\s+(and\s+)?(([Oo]ne|[Tt](wo|hree|en|welve|hirteen)|[Ff](our(teen)?|ive|ifteen)|[Ss](ix(teen)?|even(teen)?)|[Ee](ight(een)?|leven)|[Nn]ine(teen)?)|([Tt](wenty|hirty)|[Ff](orty|ifty)|[Ss](ixty|eventy)|[Ee]ighty|[Nn]inety)(([\u058A\u05BE\u2010\u2011\u2012\u2013\u2014\u2015\uFE58\uFE63\uFF0D-]|\s+)([Oo]ne|[Tt](wo|hree)|[Ff](our|ive)|[Ss](ix|even)|[Ee]ight|[Nn]ine))?))?)|(([Oo]ne|[Tt](wo|hree|en|welve|hirteen)|[Ff](our(teen)?|ive|ifteen)|[Ss](ix(teen)?|even(teen)?)|[Ee](ight(een)?|leven)|[Nn]ine(teen)?)|([Tt](wenty|hirty)|[Ff](orty|ifty)|[Ss](ixty|eventy)|[Ee]ighty|[Nn]inety)(([\u058A\u05BE\u2010\u2011\u2012\u2013\u2014\u2015\uFE58\uFE63\uFF0D-]|\s+)([Oo]ne|[Tt](wo|hree)|[Ff](our|ive)|[Ss](ix|even)|[Ee]ight|[Nn]ine))?))\s+[Tt]housand((\s*,\s*|\s+)((([Oo]ne|[Tt](wo|hree|en|welve|hirteen)|[Ff](our(teen)?|ive|ifteen)|[Ss](ix(teen)?|even(teen)?)|[Ee](ight(een)?|leven)|[Nn]ine(teen)?)\s+[Hh]undred(\s+(and\s+)?(([Oo]ne|[Tt](wo|hree|en|welve|hirteen)|[Ff](our(teen)?|ive|ifteen)|[Ss](ix(teen)?|even(teen)?)|[Ee](ight(een)?|leven)|[Nn]ine(teen)?)|([Tt](wenty|hirty)|[Ff](orty|ifty)|[Ss](ixty|eventy)|[Ee]ighty|[Nn]inety)(([\u058A\u05BE\u2010\u2011\u2012\u2013\u2014\u2015\uFE58\uFE63\uFF0D-]|\s+)([Oo]ne|[Tt](wo|hree)|[Ff](our|ive)|[Ss](ix|even)|[Ee]ight|[Nn]ine))?))?)|(and\s+)?(([Oo]ne|[Tt](wo|hree|en|welve|hirteen)|[Ff](our(teen)?|ive|ifteen)|[Ss](ix(teen)?|even(teen)?)|[Ee](ight(een)?|leven)|[Nn]ine(teen)?)|([Tt](wenty|hirty)|[Ff](orty|ifty)|[Ss](ixty|eventy)|[Ee]ighty|[Nn]inety)(([\u058A\u05BE\u2010\u2011\u2012\u2013\u2014\u2015\uFE58\uFE63\uFF0D-]|\s+)([Oo]ne|[Tt](wo|hree)|[Ff](our|ive)|[Ss](ix|even)|[Ee]ight|[Nn]ine))?)))?)|(([Oo]ne|[Tt](wo|hree|en|welve|hirteen)|[Ff](our(teen)?|ive|ifteen)|[Ss](ix(teen)?|even(teen)?)|[Ee](ight(een)?|leven)|[Nn]ine(teen)?)\s+[Hh]undred(\s+(and\s+)?(([Oo]ne|[Tt](wo|hree|en|welve|hirteen)|[Ff](our(teen)?|ive|ifteen)|[Ss](ix(teen)?|even(teen)?)|[Ee](ight(een)?|leven)|[Nn]ine(teen)?)|([Tt](wenty|hirty)|[Ff](orty|ifty)|[Ss](ixty|eventy)|[Ee]ighty|[Nn]inety)(([\u058A\u05BE\u2010\u2011\u2012\u2013\u2014\u2015\uFE58\uFE63\uFF0D-]|\s+)([Oo]ne|[Tt](wo|hree)|[Ff](our|ive)|[Ss](ix|even)|[Ee]ight|[Nn]ine))?))?)|(([Oo]ne|[Tt](wo|hree|en|welve|hirteen)|[Ff](our(teen)?|ive|ifteen)|[Ss](ix(teen)?|even(teen)?)|[Ee](ight(een)?|leven)|[Nn]ine(teen)?)|([Tt](wenty|hirty)|[Ff](orty|ifty)|[Ss](ixty|eventy)|[Ee]ighty|[Nn]inety)(([\u058A\u05BE\u2010\u2011\u2012\u2013\u2014\u2015\uFE58\uFE63\uFF0D-]|\s+)([Oo]ne|[Tt](wo|hree)|[Ff](our|ive)|[Ss](ix|even)|[Ee]ight|[Nn]ine))?))?)|[Zz]ero|[Nn]o(ne)?|[Nn]il)\s*$/;
        var result = secondRegex.exec(element.innerText);
        if ( element.innerText.length > 0 && result ) {
          var thirdRegex = /,|\sand\s/g;
          
          var returnString = element.innerText.trim().toLowerCase().replace(thirdRegex, " ");
          
          return ConstantsNumber.textToNumber(returnString).toString();
        }
      }
    }
    return "Format Error: Num Words EN";
  }

};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var FiltersOther = {
  
  getLanguage : function( lang ) {
    if ( lang && typeof lang === 'string' ) {
      return lang.toUpperCase();
    }
    return null;
  },
  
  getFootnote : function( footnoteID ) {
    if ( footnoteID && typeof footnoteID === 'string' ) {
      var foundRelations = document.getElementById('dynamic-xbrl-form').querySelectorAll(
          '[fromrefs*="' + footnoteID + '"]');
      var foundRelationsArray = Array.prototype.slice.call(foundRelations);
      
      var idsToGet = foundRelationsArray.map(function( current ) {
        if ( current.hasAttribute('torefs') ) {
          return current.getAttribute('torefs');
        }
      }).filter(function( element ) {
        return element;
      });
      
      var contentToReturn = '';
      idsToGet.forEach(function( current ) {
        var discoveredFootnote = document.getElementById('dynamic-xbrl-form').querySelector(
            '[data-original-id="' + current + '"],[id="' + current + '"]');
        
        if ( discoveredFootnote ) {
          contentToReturn += discoveredFootnote.innerHTML;
        }
      });
      return contentToReturn;
    }
    return null
  },
  
  countryNameEn : function( element ) {
    if ( element && typeof element === 'object' && element['innerText'] ) {
      
      var regexOptions = {
        
        'AF' : /^\s*([Aa]fghanistan)\s*$/,
        'AX' : /^\s*([ÅÃ…Ã¥Aa]land\s+[Ii]slands)\s*$/,
        'AL' : /^\s*([Aa]lbania)\s*$/,
        'DZ' : /^\s*([Aa]lgeria)\s*$/,
        'AS' : /^\s*([Aa]merican\s+[Ss]amoa)\s*$/,
        'AD' : /^\s*([Aa]ndorra)\s*$/,
        'AO' : /^\s*([Aa]ngola)\s*$/,
        'AI' : /^\s*([Aa]nguilla)\s*$/,
        'AQ' : /^\s*([Aa]ntarctica)\s*$/,
        'AG' : /^\s*([Aa]ntigua\s+[Aa]nd\s+[Bb]arbuda)\s*$/,
        'AR' : /^\s*((([Tt]he\s+)?[Rr]epublic\s+[Oo]f\s+)?[Aa]rgentina)\s*$/,
        'AM' : /^\s*([Aa]rmenia)\s*$/,
        'AW' : /^\s*([Aa]ruba)\s*$/,
        'AU' : /^\s*([Aa]ustralia)\s*$/,
        'AT' : /^\s*([Aa]ustria)\s*$/,
        'AZ' : /^\s*([Aa]zerbaijan)\s*$/,
        'BS' : /^\s*([Bb]ahamas)\s*$/,
        'BH' : /^\s*([Bb]ahrain)\s*$/,
        'BD' : /^\s*([Bb]angladesh)\s*$/,
        'BB' : /^\s*([Bb]arbados)\s*$/,
        'BY' : /^\s*([Bb]elarus)\s*$/,
        'BE' : /^\s*([Bb]elgium)\s*$/,
        'BZ' : /^\s*([Bb]elize)\s*$/,
        'BJ' : /^\s*([Bb]enin)\s*$/,
        'BM' : /^\s*([Bb]ermuda)\s*$/,
        'BT' : /^\s*([Bb]hutan)\s*$/,
        'BO' : /^\s*([Bb]olivia)\s*$/,
        'BQ' : /^\s*([Bb]onaire[,]?\s+[Ss]int\s+[Ee]ustatius\s+[Aa]nd\s+[Ss]aba)\s*$/,
        'BA' : /^\s*([Bb]osnia\s+[Aa]nd\s+[Hh]erzegovina)\s*$/,
        'BW' : /^\s*([Bb]otswana)\s*$/,
        'BV' : /^\s*([Bb]ouvet\s+[Ii]sland)\s*$/,
        'BR' : /^\s*((([Tt]he\s+)?[Ff]ederative\s+[Rr]epublic\s+[Oo]f\s+)?[Bb]ra[sz]il)\s*$/,
        'IO' : /^\s*([Bb]ritish\s+[Ii]ndian\s+[Oo]cean\s+[Tt]erritory)\s*$/,
        'BN' : /^\s*([Bb]runei\s+[Dd]arussalam)\s*$/,
        'BG' : /^\s*([Bb]ulgaria)\s*$/,
        'BF' : /^\s*([Bb]urkina\s+[Ff]aso)\s*$/,
        'BI' : /^\s*([Bb]urundi)\s*$/,
        'CV' : /^\s*([Cc]a(bo|pe)\s+[Vv]erde)\s*$/,
        'KH' : /^\s*([Cc]ambodia)\s*$/,
        'CM' : /^\s*([Cc]ameroon)\s*$/,
        'CA' : /^\s*([Cc]anada)\s*$/,
        'KY' : /^\s*([Cc]ayman\s+[Ii]slands)\s*$/,
        'CF' : /^\s*([Cc]entral\s+[Aa]frican\s+[Rr]epublic)\s*$/,
        'TD' : /^\s*([Cc]had)\s*$/,
        'CL' : /^\s*([Cc]hile)\s*$/,
        'CN' : /^\s*((([Tt]he\s+)?[Pp]eople[’'â€™]?s\s+[Rr]epublic\s+[Oo]f\s+)?[Cc]hina)\s*$/,
        'CX' : /^\s*([Cc]hristmas\s+[Ii]sland)\s*$/,
        'CC' : /^\s*([Cc]ocos\s+[Ii]slands)\s*$/,
        'CO' : /^\s*((([Tt]he\s+)?[Rr]epublic\s+[Oo]f\s+)?[Cc]olombia)\s*$/,
        'KM' : /^\s*([Cc]omoros)\s*$/,
        'CD' : /^\s*([Dd]emocratic\s+[Rr]epublic\s+[Oo]f\s+([Tt]he\s+)?[Cc]ongo)\s*$/,
        'CG' : /^\s*([Cc]ongo)\s*$/,
        'CK' : /^\s*([Cc]ook\s+[Ii]slands)\s*$/,
        'CR' : /^\s*([Cc]osta\s+[Rr]ica)\s*$/,
        'CI' : /^\s*([Cc][Ã´oô]te\s+d[’'â€™][Ii]voire)\s*$/,
        'HR' : /^\s*([Cc]roatia)\s*$/,
        'CU' : /^\s*([Cc]uba)\s*$/,
        'CW' : /^\s*([Cc]ura[cç]ao)\s*$/,
        'CY' : /^\s*([Cc]yprus)\s*$/,
        'CZ' : /^\s*([Cc]zechia|[Cc]zech\s+[Rr]epublic)\s*$/,
        'DK' : /^\s*((([Tt]he\s+)?[Kk]ingdom\s+[Oo]f\s+)?[Dd]enmark)\s*$/,
        'DJ' : /^\s*([Dd]jibouti)\s*$/,
        'DM' : /^\s*([Dd]ominica)\s*$/,
        'DO' : /^\s*([Dd]ominican\s+[Rr]epublic)\s*$/,
        'EC' : /^\s*([Ee]cuador)\s*$/,
        'EG' : /^\s*([Ee]gypt)\s*$/,
        'SV' : /^\s*([Ee]l\s+[Ss]alvador)\s*$/,
        'GQ' : /^\s*([Ee]quatorial\s+[Gg]uinea)\s*$/,
        'ER' : /^\s*([Ee]ritrea)\s*$/,
        'EE' : /^\s*([Ee]stonia)\s*$/,
        'SZ' : /^\s*([Ee]swatini)\s*$/,
        'ET' : /^\s*([Ee]thiopia)\s*$/,
        'FK' : /^\s*([Ff]alkland\s+[Ii]slands)\s*$/,
        'FO' : /^\s*([Ff]aroe\s+[Ii]slands)\s*$/,
        'FJ' : /^\s*([Ff]iji)\s*$/,
        'FI' : /^\s*([Ff]inland)\s*$/,
        'FR' : /^\s*([Ff]rance)\s*$/,
        'GF' : /^\s*([Ff]rench\s+[Gg]uiana)\s*$/,
        'PF' : /^\s*([Ff]rench\s+[Pp]olynesia)\s*$/,
        'TF' : /^\s*([Ff]rench\s+[Ss]outhern\s+[Tt]erritories)\s*$/,
        'GA' : /^\s*([Gg]abon)\s*$/,
        'GM' : /^\s*([Gg]ambia)\s*$/,
        'GE' : /^\s*([Gg]eorgia)\s*$/,
        'DE' : /^\s*([Gg]ermany)\s*$/,
        'GH' : /^\s*([Gg]hana)\s*$/,
        'GI' : /^\s*([Gg]ibraltar)\s*$/,
        'GR' : /^\s*([Gg]reece)\s*$/,
        'GL' : /^\s*([Gg]reenland)\s*$/,
        'GD' : /^\s*([Gg]renada)\s*$/,
        'GP' : /^\s*([Gg]uadeloupe)\s*$/,
        'GU' : /^\s*([Gg]uam)\s*$/,
        'GT' : /^\s*([Gg]uatemala)\s*$/,
        'GG' : /^\s*([Gg]uernsey)\s*$/,
        'GN' : /^\s*([Gg]uinea)\s*$/,
        'GW' : /^\s*([Gg]uinea-[Bb]issau)\s*$/,
        'GY' : /^\s*([Gg]uyana)\s*$/,
        'HT' : /^\s*([Hh]aiti)\s*$/,
        'HM' : /^\s*([Hh]eard\s+[Ii]sland\s+[Aa]nd\s+[Mm]cDonald\s+[Ii]slands)\s*$/,
        'VA' : /^\s*([Hh]oly\s+[Ss]ee)\s*$/,
        'HN' : /^\s*([Hh]onduras)\s*$/,
        'HK' : /^\s*([Hh]ong\s+[Kk]ong)\s*$/,
        'HU' : /^\s*([Hh]ungary)\s*$/,
        'IS' : /^\s*([Ii]celand)\s*$/,
        'IN' : /^\s*([Ii]ndia)\s*$/,
        'ID' : /^\s*([Ii]ndonesia)\s*$/,
        'IR' : /^\s*([Ii]ran)\s*$/,
        'IQ' : /^\s*([Ii]raq)\s*$/,
        'IE' : /^\s*([Ii]reland)\s*$/,
        'IM' : /^\s*([Ii]sle\s+[Oo]f\s+[Mm]an)\s*$/,
        'IL' : /^\s*([Ii]srael)\s*$/,
        'IT' : /^\s*([Ii]taly)\s*$/,
        'JM' : /^\s*([Jj]amaica)\s*$/,
        'JP' : /^\s*([Jj]apan)\s*$/,
        'JE' : /^\s*([Jj]ersey)\s*$/,
        'JO' : /^\s*([Jj]ordan)\s*$/,
        'KZ' : /^\s*([Kk]azakhstan)\s*$/,
        'KE' : /^\s*([Kk]enya)\s*$/,
        'KI' : /^\s*([Kk]iribati)\s*$/,
        'KP' : /^\s*(([Nn]orth|[Dd]emocratic\s+[Pp]eople[’'â€™]?s\s+[Rr]epublic\s+[Oo]f)\s+[Kk]orea)\s*$/,
        'KR' : /^\s*(([Ss]outh|[Rr]epublic\s+[Oo]f)\s+[Kk]orea)\s*$/,
        'KW' : /^\s*([Kk]uwait)\s*$/,
        'KG' : /^\s*([Kk]yrgyzstan)\s*$/,
        'LA' : /^\s*([Ll]ao\s+[Pp]eople[’'â€™]?s\s+[Dd]emocratic\s+[Rr]epublic)\s*$/,
        'LV' : /^\s*([Ll]atvia)\s*$/,
        'LB' : /^\s*([Ll]ebanon)\s*$/,
        'LS' : /^\s*([Ll]esotho)\s*$/,
        'LR' : /^\s*([Ll]iberia)\s*$/,
        'LY' : /^\s*([Ll]ibya)\s*$/,
        'LI' : /^\s*([Ll]iechtenstein)\s*$/,
        'LT' : /^\s*([Ll]ithuania)\s*$/,
        'LU' : /^\s*((([Tt]he\s+)?([Gg]rand\s+)?[Dd]uchy\s+[Oo]f\s+)?[Ll]uxembourg)\s*$/,
        'MO' : /^\s*([Mm]acao)\s*$/,
        'MG' : /^\s*([Mm]adagascar)\s*$/,
        'MW' : /^\s*([Mm]alawi)\s*$/,
        'MY' : /^\s*([Mm]alaysia)\s*$/,
        'MV' : /^\s*([Mm]aldives)\s*$/,
        'ML' : /^\s*([Mm]ali)\s*$/,
        'MT' : /^\s*([Mm]alta)\s*$/,
        'MH' : /^\s*((([Tt]he\s+)?[Rr]epublic\s+[Oo]f\s+([Tt]he\s+)?)?[Mm]arshall\s+[Ii]slands)\s*$/,
        'MQ' : /^\s*([Mm]artinique)\s*$/,
        'MR' : /^\s*([Mm]auritania)\s*$/,
        'MU' : /^\s*([Mm]auritius)\s*$/,
        'YT' : /^\s*([Mm]ayotte)\s*$/,
        'MX' : /^\s*([Mm]exico|[Uu]nited\s+[Mm]exican\s+[Ss]tates)\s*$/,
        'FM' : /^\s*([Mm]icronesia)\s*$/,
        'MD' : /^\s*([Mm]oldova)\s*$/,
        'MC' : /^\s*([Mm]onaco)\s*$/,
        'MN' : /^\s*([Mm]ongolia)\s*$/,
        'ME' : /^\s*([Mm]ontenegro)\s*$/,
        'MS' : /^\s*([Mm]ontserrat)\s*$/,
        'MA' : /^\s*([Mm]orocco)\s*$/,
        'MZ' : /^\s*([Mm]ozambique)\s*$/,
        'MM' : /^\s*([Mm]yanmar)\s*$/,
        'NA' : /^\s*([Nn]amibia)\s*$/,
        'NR' : /^\s*([Nn]auru)\s*$/,
        'NP' : /^\s*([Nn]epal)\s*$/,
        'NL' : /^\s*([Nn]etherlands)\s*$/,
        'NC' : /^\s*([Nn]ew\s+[Cc]aledonia)\s*$/,
        'NZ' : /^\s*([Nn]ew\s+[Zz]ealand)\s*$/,
        'NI' : /^\s*([Nn]icaragua)\s*$/,
        'NE' : /^\s*([Nn]iger)\s*$/,
        'NG' : /^\s*([Nn]igeria)\s*$/,
        'NU' : /^\s*([Nn]iue)\s*$/,
        'NF' : /^\s*([Nn]orfolk\s+[Ii]sland)\s*$/,
        'MK' : /^\s*(([Nn]orth\s+)?[Mm]acedonia)\s*$/,
        'MP' : /^\s*([Nn]orthern\s+[Mm]ariana\s+[Ii]slands)\s*$/,
        'NO' : /^\s*([Nn]orway)\s*$/,
        'OM' : /^\s*([Oo]man)\s*$/,
        'PK' : /^\s*([Pp]akistan)\s*$/,
        'PW' : /^\s*([Pp]alau)\s*$/,
        'PS' : /^\s*([Pp]alestine)\s*$/,
        'PA' : /^\s*([Pp]anama)\s*$/,
        'PG' : /^\s*([Pp]apua\s+[Nn]ew\s+[Gg]uinea)\s*$/,
        'PY' : /^\s*([Pp]araguay)\s*$/,
        'PE' : /^\s*([Pp]eru)\s*$/,
        'PH' : /^\s*([Pp]hilippines)\s*$/,
        'PN' : /^\s*([Pp]itcairn)\s*$/,
        'PL' : /^\s*([Pp]oland)\s*$/,
        'PT' : /^\s*([Pp]ortugal)\s*$/,
        'PR' : /^\s*([Pp]uerto\s+[Rr]ico)\s*$/,
        'QA' : /^\s*([Qq]atar)\s*$/,
        'RE' : /^\s*([Rr][éÃ©e]union)\s*$/,
        'RO' : /^\s*([Rr]omania)\s*$/,
        'RU' : /^\s*([Rr]ussian\s+[Ff]ederation)\s*$/,
        'RW' : /^\s*([Rr]wanda)\s*$/,
        'BL' : /^\s*([Ss]aint\s+[Bb]arth[éÃ©e]lemy)\s*$/,
        'SH' : /^\s*([Ss]aint\s+[Hh]elena,\s+[Aa]scension\s+[Aa]nd\s+[Tt]ristan\s+[Dd]a\s+[Cc]unha)\s*$/,
        'KN' : /^\s*([Ss]aint\s+[Kk]itts\s+[Aa]nd\s+[Nn]evis)\s*$/,
        'LC' : /^\s*([Ss]aint\s+[Ll]ucia)\s*$/,
        'MF' : /^\s*([Ss]aint\s+[Mm]artin)\s*$/,
        'PM' : /^\s*([Ss]aint\s+[Pp]ierre\s+[Aa]nd\s+[Mm]iquelon)\s*$/,
        'VC' : /^\s*([Ss]aint\s+[Vv]incent(\s+[Aa]nd\s+([Tt]he\s+)?[Gg]renadines)?)\s*$/,
        'WS' : /^\s*([Ss]amoa)\s*$/,
        'SM' : /^\s*([Ss]an\s+[Mm]arino)\s*$/,
        'ST' : /^\s*([Ss]ao\s+[Tt]ome\s+[Aa]nd\s+[Pp]rincipe)\s*$/,
        'SA' : /^\s*([Ss]audi\s+[Aa]rabia)\s*$/,
        'SN' : /^\s*([Ss]enegal)\s*$/,
        'RS' : /^\s*([Ss]erbia)\s*$/,
        'SC' : /^\s*([Ss]eychelles)\s*$/,
        'SL' : /^\s*([Ss]ierra\s+[Ll]eone)\s*$/,
        'SG' : /^\s*([Ss]ingapore)\s*$/,
        'SX' : /^\s*([Ss]int\s+[Mm]aarten)\s*$/,
        'SK' : /^\s*([Ss]lovakia)\s*$/,
        'SI' : /^\s*([Ss]lovenia)\s*$/,
        'SB' : /^\s*([Ss]olomon\s+[Ii]slands)\s*$/,
        'SO' : /^\s*([Ss]omalia)\s*$/,
        'ZA' : /^\s*((([Tt]he[\s&#xA0;]+)?[Rr]epublic[\s&#xA0;]+[Oo]f[\s&#xA0;]+)?[Ss]outh\s+[Aa]frica)\s*$/,
        'GS' : /^\s*([Ss]outh\s+[Gg]eorgia\s+[Aa]nd\s+([Tt]he\s+)?[Ss]outh\s+[Ss]andwich\s+[Ii]slands)\s*$/,
        'SS' : /^\s*([Ss]outh\s+[Ss]udan)\s*$/,
        'ES' : /^\s*((([Tt]he\s+)?[Kk]ingdom\s+[Oo]f\s+)?[Ss]pain|[Ee]spa[ñÃ±n]a)\s*$/,
        'LK' : /^\s*([Ss]ri\s+[Ll]anka)\s*$/,
        'SD' : /^\s*([Ss]udan)\s*$/,
        'SR' : /^\s*([Ss]uriname)\s*$/,
        'SJ' : /^\s*([Ss]valbard\s+[Aa]nd\s+[Jj]an\s+[Mm]ayen)\s*$/,
        'SE' : /^\s*([Ss]weden)\s*$/,
        'CH' : /^\s*([Ss]witzerland)\s*$/,
        'SY' : /^\s*([Ss]yria(n\s+[Aa]rab\s+[Rr]epublic)?)\s*$/,
        'TW' : /^\s*([Tt]aiwan(\s+[Pp]rovince\s+[Oo]f\s+[Cc]hina)?)\s*$/,
        'TJ' : /^\s*([Tt]ajikistan)\s*$/,
        'TZ' : /^\s*(([Uu]nited\s+[Rr]epublic\s+[Oo]f\s+)?[Tt]anzania)\s*$/,
        'TH' : /^\s*([Tt]hailand)\s*$/,
        'TL' : /^\s*([Tt]imor-[Ll]este)\s*$/,
        'TG' : /^\s*([Tt]ogo)\s*$/,
        'TK' : /^\s*([Tt]okelau)\s*$/,
        'TO' : /^\s*([Tt]onga)\s*$/,
        'TT' : /^\s*([Tt]rinidad\s+[Aa]nd\s+[Tt]obago)\s*$/,
        'TN' : /^\s*([Tt]unisia)\s*$/,
        'TR' : /^\s*([Tt]urkey)\s*$/,
        'TM' : /^\s*([Tt]urkmenistan)\s*$/,
        'TC' : /^\s*([Tt]urks\s+[Aa]nd\s+[Cc]aicos\s+[Ii]slands)\s*$/,
        'TV' : /^\s*([Tt]uvalu)\s*$/,
        'UG' : /^\s*([Uu]ganda)\s*$/,
        'UA' : /^\s*([Uu]kraine)\s*$/,
        'AE' : /^\s*(UAE|[Uu]nited\s+[Aa]rab\s+[Ee]mirates)\s*$/,
        'GB' : /^\s*(U[.]?K[.]?|[Bb]ritain|[Gg]reat\s+[BBb]ritain|[Uu]nited\s+[Kk]ingdom(\s+[Oo]f\s+[Gg]reat\s+[Bb]ritain\s+[Aa]nd\s+[Nn]orthern\s+[Ii]reland)?|[Ee]ngland(\s+[Aa]nd\s+[Ww]ales)?)\s*$/,
        'UM' : /^\s*([Uu]nited\s+[Ss]tates\s+[Mm]inor\s+[Oo]utlying\s+[Ii]slands)\s*$/,
        'US' : /^\s*(U[.]?S[.]?A[.]?|[Uu]nited\s+[Ss]tates(\s+[Oo]f\s+[Aa]merica)?)\s*$/,
        'UY' : /^\s*([Uu]ruguay)\s*$/,
        'UZ' : /^\s*([Uu]zbekistan)\s*$/,
        'VU' : /^\s*([Vv]anuatu)\s*$/,
        'VE' : /^\s*([Vv]enezuela)\s*$/,
        'VN' : /^\s*([Vv]iet\s+[Nn]am)\s*$/,
        'VG' : /^\s*([Bb]ritish\s+[Vv]irgin\s+[Ii]slands|[Vv]irgin\s+[Ii]slands,?\s+[Bb]ritish)\s*$/,
        'VI' : /^\s*([Vv]irgin\s+[Ii]slands,\s+U[.]?S[.]?|U([.]\s*)?S[.]?\s+[Vv]irgin\s+[Ii]slands)\s*$/,
        'WF' : /^\s*([Ww]allis\s+[Aa]nd\s+[Ff]utuna)\s*$/,
        'EH' : /^\s*([Ww]estern\s+[Ss]ahara*)\s*$/,
        'YE' : /^\s*([Yy]emen)\s*$/,
        'ZM' : /^\s*([Zz]ambia)\s*$/,
        'ZW' : /^\s*([Zz]imbabwe)\s*$/,
      };
      
      for ( var option in regexOptions ) {
        if ( regexOptions[option].exec(element['innerText']) && regexOptions[option].exec(element['innerText'])[0] ) {
          return option;
        }
      }
    }
    return 'Format Error: Country Name EN';
  },
  
  stateProvNameEn : function( element ) {
    if ( element && typeof element === 'object' && element['innerText'] ) {
      
      var regexOptions = {
        'AL' : /^\s*([Aa]labama)\s*$/,
        'AK' : /^\s*([Aa]laska)\s*$/,
        'AZ' : /^\s*([Aa]rizona)\s*$/,
        'AR' : /^\s*([Aa]rkansas)\s*$/,
        'CA' : /^\s*([Cc]alifornia)\s*$/,
        'CO' : /^\s*([Cc]olorado)\s*$/,
        'CT' : /^\s*([Cc]onnecticut)\s*$/,
        'DE' : /^\s*([Dd]elaware)\s*$/,
        'FL' : /^\s*([Ff]lorida)\s*$/,
        'GA' : /^\s*([Gg]eorgia)\s*$/,
        'HI' : /^\s*([Hh]awaii)\s*$/,
        'ID' : /^\s*([Ii]daho)\s*$/,
        'IL' : /^\s*([Ii]llinois)\s*$/,
        'IN' : /^\s*([Ii]ndiana)\s*$/,
        'IA' : /^\s*([Ii]owa)\s*$/,
        'KS' : /^\s*([Kk]ansas)\s*$/,
        'KY' : /^\s*([Kk]entucky)\s*$/,
        'LA' : /^\s*([Ll]ouisiana)\s*$/,
        'ME' : /^\s*([Mm]aine)\s*$/,
        'MD' : /^\s*([Mm]aryland)\s*$/,
        'MA' : /^\s*([Mm]assachusetts)\s*$/,
        'MI' : /^\s*([Mm]ichigan)\s*$/,
        'MN' : /^\s*([Mm]innesota)\s*$/,
        'MS' : /^\s*([Mm]ississippi)\s*$/,
        'MO' : /^\s*([Mm]issouri)\s*$/,
        'MT' : /^\s*([Mm]ontana)\s*$/,
        'NE' : /^\s*([Nn]ebraska)\s*$/,
        'NV' : /^\s*([Nn]evada)\s*$/,
        'NH' : /^\s*([Nn]ew\s+[Hh]ampshire)\s*$/,
        'NJ' : /^\s*([Nn]ew\s+[Jj]ersey)\s*$/,
        'NM' : /^\s*([Nn]ew\s+[Mm]exico)\s*$/,
        'NY' : /^\s*([Nn]ew\s+[Yy]ork)\s*$/,
        'NC' : /^\s*([Nn]orth\s+[Cc]arolina)\s*$/,
        'ND' : /^\s*([Nn]orth\s+[Dd]akota)\s*$/,
        'OH' : /^\s*([Oo]hio)\s*$/,
        'OK' : /^\s*([Oo]klahoma)\s*$/,
        'OR' : /^\s*([Oo]regon)\s*$/,
        'PA' : /^\s*([Pp]ennsylvania)\s*$/,
        'RI' : /^\s*([Rr]hode\s+[Ii]sland)\s*$/,
        'SC' : /^\s*([Ss]outh\s+[Cc]arolina)\s*$/,
        'SD' : /^\s*([Ss]outh\s+[Dd]akota)\s*$/,
        'TN' : /^\s*([Tt]ennessee)\s*$/,
        'TX' : /^\s*([Tt]exas)\s*$/,
        'UT' : /^\s*([Uu]tah)\s*$/,
        'VT' : /^\s*([Vv]ermont)\s*$/,
        'VA' : /^\s*([Vv]irginia)\s*$/,
        'WA' : /^\s*([Ww]ashington)\s*$/,
        'WV' : /^\s*([Ww]est\s+[Vv]irginia)\s*$/,
        'WI' : /^\s*([Ww]isconsin)\s*$/,
        'WY' : /^\s*([Ww]yoming)\s*$/,
        'DC' : /^\s*([Dd]istrict\s+[Oo]f\s+[Cc]olumbia)\s*$/,
        'AS' : /^\s*(([Aa]merican\s+)?[Ss]amoa)\s*$/,
        'GU' : /^\s*([Gg]uam)\s*$/,
        'MP' : /^\s*([Nn]orthern\s+[Mm]ariana\s+[Ii]slands)\s*$/,
        'PR' : /^\s*([Pp]uerto\s+[Rr]ico)\s*$/,
        'UM' : /^\s*([Uu]nited\s+[Ss]tates\s+[Mm]inor\s+[Oo]utlying\s+[Ii]slands)\s*$/,
        'VI' : /^\s*([Vv]irgin\s+[Ii]slands,\s+U[.]S[.])\s*$/,
        'AB' : /^\s*([Aa]lberta)\s*$/,
        'BC' : /^\s*([Bb]ritish\s+[Cc]olumbia)\s*$/,
        'MB' : /^\s*([Mm]anitoba)\s*$/,
        'NB' : /^\s*([Nn]ew\s+[Bb]runswick)\s*$/,
        'NL' : /^\s*([Nn]ewfoundland(\s+[Aa]nd\s+[Ll]abrador)?)\s*$/,
        'NS' : /^\s*([Nn]ova\s+[Ss]cotia)\s*$/,
        'NT' : /^\s*([Nn]orthwest\s+[Tt]erritories)\s*$/,
        'NU' : /^\s*([Nn]unavut)\s*$/,
        'ON' : /^\s*([Oo]ntario)\s*$/,
        'PE' : /^\s*([Pp]rince\s+[Ee]dward\s+[Ii]sland)\s*$/,
        'QC' : /^\s*([Qq]u[éeÃ©]bec)\s*$/,
        'SK' : /^\s*([Ss]askatchewan)\s*$/,
        'YT' : /^\s*([Yy]ukon)\s*$/,
      };
      
      for ( var option in regexOptions ) {
        if ( regexOptions[option].exec(element['innerText']) && regexOptions[option].exec(element['innerText'])[0] ) {
          return option;
        }
      }
    }
    return 'Format Error: Country Name EN';
  },
  
  exchNameEn : function( element ) {
    if ( element && typeof element === 'object' && element['innerText'] ) {
      
      var regexOptions = {
        'BOX' : /^\s*(([Tt]he\s+)?[Bb][Oo][Xx]\s+[Ee]xchange(,?\s+[Ll][Ll][Cc])?)\s*$/,
        'CboeBYX' : /^\s*(([Tt]he\s+)?[Cc]boe\s+[Bb][Yy][Xx]\s+[Ee]xchange(,?\s+[Ii]nc[.]?)?)\s*$/,
        'CboeBZX' : /^\s*(([Tt]he\s+)?[Cc]boe\s+[Bb][Zz][Xx]\s+[Ee]xchange(,?\s+[Ii]nc[.]?)?)\s*$/,
        'C2' : /^\s*(([Tt]he\s+)?[Cc]boe\s+[Cc]2\s+[Ee]xchange(,?\s+[Ii]nc[.]?)?)\s*$/,
        'CboeEDGA' : /^\s*(([Tt]he\s+)?[Cc]boe\s+[Ee][Dd][Gg][Aa]\s+[Ee]xchange(,?\s+[Ii]nc[.]?)?)\s*$/,
        'CboeEDGX' : /^\s*(([Tt]he\s+)?[Cc]boe\s+[Ee][Dd][Gg][Xx]\s+[Ee]xchange(,?\s+[Ii]nc[.]?)?)\s*$/,
        'CBOE' : /^\s*(([Tt]he\s+)?[Cc]boe\s+[Ee]xchange(,?\s+[Ii]nc[.]?)?)\s*$/,
        'CHX' : /^\s*(([Tt]he\s+)?[Cc]hicago\s+[Ss]tock\s+[Ee]xchange(,?\s+[Ii]nc[.]?)?)\s*$/,
        'IEX' : /^\s*(([Tt]he\s+)?[Ii]nvestors\s+[Ee]xchange(,?\s+[Ll][Ll][Cc])?)\s*$/,
        'MIAX' : /^\s*(([Tt]he\s+)?[Mm]iami\s+[Ii]nternational\s+[Ss]ecurities\s+[Ee]xchange(,?\s+[Ll][Ll][Cc])?)\s*$/,
        'PEARL' : /^\s*(([Tt]he\s+)?[Mm]IAX\s+[Pp]EARL(,?\s+[Ll][Ll][Cc])?)\s*$/,
        'BX' : /^\s*(([Tt]he\s+)?[Nn][Aa][Ss][Dd][Aa][Qq]\s+[Bb][Xx](,?\s+[Ii]nc[.]?)?)\s*$/,
        'GEMX' : /^\s*(([Tt]he\s+)?[Nn][Aa][Ss][Dd][Aa][Qq]\s+[Gg][Ee][Mm][Xx](,?\s+[Ll][Ll][Cc])?)\s*$/,
        'ISE' : /^\s*(([Tt]he\s+)?[Nn][Aa][Ss][Dd][Aa][Qq]\s+[Ii][Ss][Ee](,?\s+[Ll][Ll][Cc])?)\s*$/,
        'MRX' : /^\s*(([Tt]he\s+)?[Nn][Aa][Ss][Dd][Aa][Qq]\s+[Mm][Rr][Xx](,?\s+[Ll][Ll][Cc])?)\s*$/,
        'Phlx' : /^\s*([Nn][Aa][Ss][Dd][Aa][Qq]\s+[Pp][Hh][Ll][Xx](,?\s+[Ll][Ll][Cc])?)\s*$/,
        'NYSE' : /^\s*(([Tt]he\s+)?[Nn][Yy][Ss][Ee]|([Tt]he\s+)?[Nn]ew\s+[Yy]ork\s+[Ss]tock\s+[Ee]xchange(,?\s+[Ll][Ll][Cc])?)\s*$/,
        'NYSEAMER' : /^\s*(([Tt]he\s+)?[Nn][Yy][Ss][Ee]\s+[Aa]merican(,?\s+[Ll][Ll][Cc])?)\s*$/,
        'NYSEArca' : /^\s*(([Tt]he\s+)?[Nn][Yy][Ss][Ee]\s+[Aa]rca(,?\s+[Ii]nc[.]?)?)\s*$/,
        'NYSENAT' : /^\s*(([Tt]he\s+)?[Nn][Yy][Ss][Ee]\s+[Nn]ational(,?\s+[Ii]nc[.]?)?)\s*$/,
        'NASDAQ' : /^\s*(([Tt]he\s+)?[Nn][Aa][Ss][Dd][Aa][Qq](\s+([Ss]tock|[Gg]lobal(\s+[Ss]elect)?)\s+[Mm]arket(,?\s+[Ll][Ll][Cc])?)?)\s*$/,
      };
      for ( var option in regexOptions ) {
        if ( regexOptions[option].exec(element['innerText']) && regexOptions[option].exec(element['innerText'])[0] ) {
          return option;
        }
      }
    }
    return 'Format Error: Exch Name EN';
  },
  
  edgarProvCountryEn : function( element ) {
    if ( element && typeof element === 'object' && element['innerText'] ) {
      
      var regexOptions = {
        'B5' : /^\s*([Aa]merican\s+[Ss]amoa)\s*$/,
        'GU' : /^\s*([Gg]uam)\s*$/,
        'PR' : /^\s*([Pp]uerto\s+[Rr]ico)\s*$/,
        '2J' : /^\s*([Uu]nited\s+[Ss]tates\s+[Mm]inor\s+[Oo]utlying\s+[Ii]slands)\s*$/,
        'VI' : /^\s*([Vv]irgin\s+[Ii]slands,\s+U[.]?S[.]?|U([.]\s*)?S[.]?\s+[Vv]irgin\s+[Ii]slands)\s*$/,
        'A0' : /^\s*([Aa]lberta(,?\s+[Cc]anada)?)\s*$/,
        'A1' : /^\s*([Bb]ritish\s+[Cc]olumbia(,?\s+[Cc]anada)?)\s*$/,
        'A2' : /^\s*([Mm]anitoba(,?\s+[Cc]anada)?)\s*$/,
        'A3' : /^\s*([Nn]ew\s+[Bb]runswick(,?\s+[Cc]anada)?)\s*$/,
        'A4' : /^\s*([Nn]ewfoundland(\s+[Aa]nd\s+[Ll]abrador)?(,?\s+[Cc]anada)?)\s*$/,
        'A5' : /^\s*([Nn]ova\s+[Ss]cotia(,?\s+[Cc]anada)?)\s*$/,
        'A6' : /^\s*([Oo]ntario(,?\s+[Cc]anada)?)\s*$/,
        'A7' : /^\s*([Pp]rince\s+[Ee]dward\s+[Ii]sland(,?\s+[Cc]anada)?)\s*$/,
        'A8' : /^\s*([Qq]u[eéÃ©]bec(,?\s+[Cc]anada)?)\s*$/,
        'A9' : /^\s*([Ss]askatchewan(,?\s+[Cc]anada)?)\s*$/,
        'B0' : /^\s*([Yy]ukon(,?\s+[Cc]anada)?)\s*$/,
        'B2' : /^\s*([Aa]fghanistan)\s*$/,
        'Y6' : /^\s*([ÅÅÃ…Ã¥Aa]land\s+[Ii]slands)\s*$/,
        'B3' : /^\s*([Aa]lbania)\s*$/,
        'B4' : /^\s*([Aa]lgeria)\s*$/,
        'B6' : /^\s*([Aa]ndorra)\s*$/,
        'B7' : /^\s*([Aa]ngola)\s*$/,
        '1A' : /^\s*([Aa]nguilla)\s*$/,
        'B8' : /^\s*([Aa]ntarctica)\s*$/,
        'B9' : /^\s*([Aa]ntigua\s+[Aa]nd\s+[Bb]arbuda)\s*$/,
        'C1' : /^\s*((([Tt]he\s+)?[Rr]epublic\s+[Oo]f\s+)?[Aa]rgentina)\s*$/,
        '1B' : /^\s*([Aa]rmenia)\s*$/,
        '1C' : /^\s*([Aa]ruba)\s*$/,
        'C3' : /^\s*([Aa]ustralia)\s*$/,
        'C4' : /^\s*([Aa]ustria)\s*$/,
        '1D' : /^\s*([Aa]zerbaijan)\s*$/,
        'C5' : /^\s*([Bb]ahamas)\s*$/,
        'C6' : /^\s*([Bb]ahrain)\s*$/,
        'C7' : /^\s*([Bb]angladesh)\s*$/,
        'C8' : /^\s*([Bb]arbados)\s*$/,
        '1F' : /^\s*([Bb]elarus)\s*$/,
        'C9' : /^\s*([Bb]elgium)\s*$/,
        'D1' : /^\s*([Bb]elize)\s*$/,
        'G6' : /^\s*([Bb]enin)\s*$/,
        'D0' : /^\s*([Bb]ermuda)\s*$/,
        'D2' : /^\s*([Bb]hutan)\s*$/,
        'D3' : /^\s*([Bb]olivia)\s*$/,
        '1E' : /^\s*([Bb]osnia\s+[Aa]nd\s+[Hh]erzegovina)\s*$/,
        'B1' : /^\s*([Bb]otswana)\s*$/,
        'D4' : /^\s*([Bb]ouvet\s+[Ii]sland)\s*$/,
        'D5' : /^\s*((([Tt]he\s+)?[Ff]ederative\s+[Rr]epublic\s+[Oo]f\s+)?[Bb]ra[sz]il)\s*$/,
        'D6' : /^\s*([Bb]ritish\s+[Ii]ndian\s+[Oo]cean\s+[Tt]erritory)\s*$/,
        'D9' : /^\s*([Bb]runei\s+[Dd]arussalam)\s*$/,
        'E0' : /^\s*([Bb]ulgaria)\s*$/,
        'X2' : /^\s*([Bb]urkina\s+[Ff]aso)\s*$/,
        'E2' : /^\s*([Bb]urundi)\s*$/,
        'E8' : /^\s*([Cc]a(bo|pe)\s+[Vv]erde)\s*$/,
        'E3' : /^\s*([Cc]ambodia)\s*$/,
        'E4' : /^\s*([Cc]ameroon)\s*$/,
        'Z4' : /^\s*([Cc]anada)\s*$/,
        'E9' : /^\s*([Cc]ayman\s+[Ii]slands)\s*$/,
        'F0' : /^\s*([Cc]entral\s+[Aa]frican\s+[Rr]epublic)\s*$/,
        'F2' : /^\s*([Cc]had)\s*$/,
        'F3' : /^\s*([Cc]hile)\s*$/,
        'F4' : /^\s*((([Tt]he\s+)?[Pp]eople[’'â€™]?s\s+[Rr]epublic\s+[Oo]f\s+)?[Cc]hina)\s*$/,
        'F6' : /^\s*([Cc]hristmas\s+[Ii]sland)\s*$/,
        'F7' : /^\s*([Cc]ocos\s+[Ii]slands)\s*$/,
        'F8' : /^\s*((([Tt]he\s+)?[Rr]epublic\s+[Oo]f\s+)?[Cc]olombia)\s*$/,
        'F9' : /^\s*([Cc]omoros)\s*$/,
        'Y3' : /^\s*([Dd]emocratic\s+[Rr]epublic\s+[Oo]f\s+([Tt]he\s+)?[Cc]ongo)\s*$/,
        'G0' : /^\s*([Cc]ongo)\s*$/,
        'G1' : /^\s*([Cc]ook\s+[Ii]slands)\s*$/,
        'G2' : /^\s*([Cc]osta\s+[Rr]ica)\s*$/,
        'L7' : /^\s*([Cc][Ã´oô]te\s+d[’'â€™][Ii]voire)\s*$/,
        '1M' : /^\s*([Cc]roatia)\s*$/,
        'G3' : /^\s*([Cc]uba)\s*$/,
        'G4' : /^\s*([Cc]yprus)\s*$/,
        '2N' : /^\s*([Cc]zechia|[Cc]zech\s+[Rr]epublic)\s*$/,
        'G7' : /^\s*((([Tt]he\s+)?[Kk]ingdom\s+[Oo]f\s+)?[Dd]enmark)\s*$/,
        '1G' : /^\s*([Dd]jibouti)\s*$/,
        'G9' : /^\s*([Dd]ominica)\s*$/,
        'G8' : /^\s*([Dd]ominican\s+[Rr]epublic)\s*$/,
        'H1' : /^\s*([Ee]cuador)\s*$/,
        'H2' : /^\s*([Ee]gypt)\s*$/,
        'H3' : /^\s*([Ee]l\s+[Ss]alvador)\s*$/,
        'H4' : /^\s*([Ee]quatorial\s+[Gg]uinea)\s*$/,
        '1J' : /^\s*([Ee]ritrea)\s*$/,
        '1H' : /^\s*([Ee]stonia)\s*$/,
        'H5' : /^\s*([Ee]thiopia)\s*$/,
        'H7' : /^\s*([Ff]alkland\s+[Ii]slands)\s*$/,
        'H6' : /^\s*([Ff]aroe\s+[Ii]slands)\s*$/,
        'H8' : /^\s*([Ff]iji)\s*$/,
        'H9' : /^\s*([Ff]inland)\s*$/,
        'I0' : /^\s*([Ff]rance)\s*$/,
        'I3' : /^\s*([Ff]rench\s+[Gg]uiana)\s*$/,
        'I4' : /^\s*([Ff]rench\s+[Pp]olynesia)\s*$/,
        '2C' : /^\s*([Ff]rench\s+[Ss]outhern\s+[Tt]erritories)\s*$/,
        'I5' : /^\s*([Gg]abon)\s*$/,
        'I6' : /^\s*([Gg]ambia)\s*$/,
        '2Q' : /^\s*([Gg]eorgia)\s*$/,
        '2M' : /^\s*([Gg]ermany)\s*$/,
        'J0' : /^\s*([Gg]hana)\s*$/,
        'J1' : /^\s*([Gg]ibraltar)\s*$/,
        'J3' : /^\s*([Gg]reece)\s*$/,
        'J4' : /^\s*([Gg]reenland)\s*$/,
        'J5' : /^\s*([Gg]renada)\s*$/,
        'J6' : /^\s*([Gg]uadeloupe)\s*$/,
        'J8' : /^\s*([Gg]uatemala)\s*$/,
        'Y7' : /^\s*([Gg]uernsey)\s*$/,
        'J9' : /^\s*([Gg]uinea)\s*$/,
        'S0' : /^\s*([Gg]uinea-[Bb]issau)\s*$/,
        'K0' : /^\s*([Gg]uyana)\s*$/,
        'K1' : /^\s*([Hh]aiti)\s*$/,
        'K4' : /^\s*([Hh]eard\s+[Ii]sland\s+[Aa]nd\s+[Mm]cDonald\s+[Ii]slands)\s*$/,
        'X4' : /^\s*([Hh]oly\s+[Ss]ee)\s*$/,
        'K2' : /^\s*([Hh]onduras)\s*$/,
        'K3' : /^\s*([Hh]ong\s+[Kk]ong)\s*$/,
        'K5' : /^\s*([Hh]ungary)\s*$/,
        'K6' : /^\s*([Ii]celand)\s*$/,
        'K7' : /^\s*([Ii]ndia)\s*$/,
        'K8' : /^\s*([Ii]ndonesia)\s*$/,
        'K9' : /^\s*([Ii]ran)\s*$/,
        'L0' : /^\s*([Ii]raq)\s*$/,
        'L2' : /^\s*([Ii]reland)\s*$/,
        'Y8' : /^\s*([Ii]sle\s+[Oo]f\s+[Mm]an)\s*$/,
        'L3' : /^\s*([Ii]srael)\s*$/,
        'L6' : /^\s*([Ii]taly)\s*$/,
        'L8' : /^\s*([Jj]amaica)\s*$/,
        'M0' : /^\s*([Jj]apan)\s*$/,
        'Y9' : /^\s*([Jj]ersey)\s*$/,
        'M2' : /^\s*([Jj]ordan)\s*$/,
        '1P' : /^\s*([Kk]azakhstan)\s*$/,
        'M3' : /^\s*([Kk]enya)\s*$/,
        'J2' : /^\s*([Kk]iribati)\s*$/,
        'M4' : /^\s*(([Nn]orth|[Dd]emocratic\s+[Pp]eople[’'â€™]?s\s+[Rr]epublic\s+[Oo]f)\s+[Kk]orea)\s*$/,
        'M5' : /^\s*(([Ss]outh|[Rr]epublic\s+[Oo]f)\s+[Kk]orea)\s*$/,
        'M6' : /^\s*([Kk]uwait)\s*$/,
        '1N' : /^\s*([Kk]yrgyzstan)\s*$/,
        'M7' : /^\s*([Ll]ao\s+[Pp]eople[’'â€™]?s\s+[Dd]emocratic\s+[Rr]epublic)\s*$/,
        '1R' : /^\s*([Ll]atvia)\s*$/,
        'M8' : /^\s*([Ll]ebanon)\s*$/,
        'M9' : /^\s*([Ll]esotho)\s*$/,
        'N0' : /^\s*([Ll]iberia)\s*$/,
        'N1' : /^\s*([Ll]ibya)\s*$/,
        'N2' : /^\s*([Ll]iechtenstein)\s*$/,
        '1Q' : /^\s*([Ll]ithuania)\s*$/,
        'N4' : /^\s*((([Tt]he\s+)?([Gg]rand\s+)?[Dd]uchy\s+[Oo]f\s+)?[Ll]uxembourg)\s*$/,
        'N5' : /^\s*([Mm]acao)\s*$/,
        '1U' : /^\s*(([Nn]orth\s+)?[Mm]acedonia)\s*$/,
        'N6' : /^\s*([Mm]adagascar)\s*$/,
        'N7' : /^\s*([Mm]alawi)\s*$/,
        'N8' : /^\s*([Mm]alaysia)\s*$/,
        'N9' : /^\s*([Mm]aldives)\s*$/,
        'O0' : /^\s*([Mm]ali)\s*$/,
        'O1' : /^\s*([Mm]alta)\s*$/,
        '1T' : /^\s*((([Tt]he\s+)?[Rr]epublic\s+[Oo]f\s+([Tt]he\s+)?)?[Mm]arshall\s+[Ii]slands)\s*$/,
        'O2' : /^\s*([Mm]artinique)\s*$/,
        'O3' : /^\s*([Mm]auritania)\s*$/,
        'O4' : /^\s*([Mm]auritius)\s*$/,
        '2P' : /^\s*([Mm]ayotte)\s*$/,
        'O5' : /^\s*([Mm]exico|[Uu]nited\s+[Mm]exican\s+[Ss]tates)\s*$/,
        '1K' : /^\s*([Mm]icronesia)\s*$/,
        '1S' : /^\s*([Mm]oldova)\s*$/,
        'O9' : /^\s*([Mm]onaco)\s*$/,
        'P0' : /^\s*([Mm]ongolia)\s*$/,
        'Z5' : /^\s*([Mm]ontenegro)\s*$/,
        'P1' : /^\s*([Mm]ontserrat)\s*$/,
        // '1S' : /^\s*([Mm]ontserrat)\s*$/,
        'P2' : /^\s*([Mm]orocco)\s*$/,
        'P3' : /^\s*([Mm]ozambique)\s*$/,
        'E1' : /^\s*([Mm]yanmar)\s*$/,
        'T6' : /^\s*([Nn]amibia)\s*$/,
        'P5' : /^\s*([Nn]auru)\s*$/,
        'P6' : /^\s*([Nn]epal)\s*$/,
        'P8' : /^\s*([Nn]etherlands\s+[Aa]ntilles)\s*$/,
        'P7' : /^\s*([Nn]etherlands)\s*$/,
        '1W' : /^\s*([Nn]ew\s+[Cc]aledonia)\s*$/,
        'Q2' : /^\s*([Nn]ew\s+[Zz]ealand)\s*$/,
        'Q3' : /^\s*([Nn]icaragua)\s*$/,
        'Q4' : /^\s*([Nn]iger)\s*$/,
        'Q5' : /^\s*([Nn]igeria)\s*$/,
        'Q6' : /^\s*([Nn]iue)\s*$/,
        'Q7' : /^\s*([Nn]orfolk\s+[Ii]sland)\s*$/,
        // '1V' : /^\s*(([Nn]orth\s+)?[Mm]acedonia)\s*$/,
        '1V' : /^\s*([Nn]orthern\s+[Mm]ariana\s+[Ii]slands)\s*$/,
        'Q8' : /^\s*([Nn]orway)\s*$/,
        'P4' : /^\s*([Oo]man)\s*$/,
        'R0' : /^\s*([Pp]akistan)\s*$/,
        '1Y' : /^\s*([Pp]alau)\s*$/,
        '1X' : /^\s*([Pp]alestine)\s*$/,
        'R1' : /^\s*([Pp]anama)\s*$/,
        'R2' : /^\s*([Pp]apua\s+[Nn]ew\s+[Gg]uinea)\s*$/,
        'R4' : /^\s*([Pp]araguay)\s*$/,
        'R5' : /^\s*([Pp]eru)\s*$/,
        'R6' : /^\s*([Pp]hilippines)\s*$/,
        'R8' : /^\s*([Pp]itcairn)\s*$/,
        'R9' : /^\s*([Pp]oland)\s*$/,
        'S1' : /^\s*([Pp]ortugal)\s*$/,
        'S3' : /^\s*([Qq]atar)\s*$/,
        'S4' : /^\s*([Rr][éÃ©e]union)\s*$/,
        'S5' : /^\s*([Rr]omania)\s*$/,
        '1Z' : /^\s*([Rr]ussian\s+[Ff]ederation)\s*$/,
        'S6' : /^\s*([Rr]wanda)\s*$/,
        'Z0' : /^\s*([Ss]aint\s+[Bb]arth[Ã©eé]lemy)\s*$/,
        'U8' : /^\s*([Ss]aint\s+[Hh]elena,\s+[Aa]scension\s+[Aa]nd\s+[Tt]ristan\s+[Dd]a\s+[Cc]unha)\s*$/,
        'U7' : /^\s*([Ss]aint\s+[Kk]itts\s+[Aa]nd\s+[Nn]evis)\s*$/,
        'U9' : /^\s*([Ss]aint\s+[Ll]ucia)\s*$/,
        'Z1' : /^\s*([Ss]aint\s+[Mm]artin)\s*$/,
        'V0' : /^\s*([Ss]aint\s+[Pp]ierre\s+[Aa]nd\s+[Mm]iquelon)\s*$/,
        'V1' : /^\s*([Ss]aint\s+[Vv]incent(\s+[Aa]nd\s+([Tt]he\s+)?[Gg]renadines)?)\s*$/,
        'Y0' : /^\s*([Ss]amoa)\s*$/,
        'S8' : /^\s*([Ss]an\s+[Mm]arino)\s*$/,
        'S9' : /^\s*([Ss]ao\s+[Tt]ome\s+[Aa]nd\s+[Pp]rincipe)\s*$/,
        'T0' : /^\s*([Ss]audi\s+[Aa]rabia)\s*$/,
        'T1' : /^\s*([Ss]enegal)\s*$/,
        'Z2' : /^\s*([Ss]erbia)\s*$/,
        'T2' : /^\s*([Ss]eychelles)\s*$/,
        'T8' : /^\s*([Ss]ierra\s+[Ll]eone)\s*$/,
        'U0' : /^\s*([Ss]ingapore)\s*$/,
        '2B' : /^\s*([Ss]lovakia)\s*$/,
        '2A' : /^\s*([Ss]lovenia)\s*$/,
        'D7' : /^\s*([Ss]olomon\s+[Ii]slands)\s*$/,
        'U1' : /^\s*([Ss]omalia)\s*$/,
        'T3' : /^\s*((([Tt]he[\s&#xA0;]+)?[Rr]epublic[\s&#xA0;]+[Oo]f[\s&#xA0;]+)?[Ss]outh\s+[Aa]frica)\s*$/,
        '1L' : /^\s*([Ss]outh\s+[Gg]eorgia\s+[Aa]nd\s+([Tt]he\s+)?[Ss]outh\s+[Ss]andwich\s+[Ii]slands)\s*$/,
        'U3' : /^\s*((([Tt]he\s+)?[Kk]ingdom\s+[Oo]f\s+)?[Ss]pain|[Ee]spa[Ã±nñ]a)\s*$/,
        'F1' : /^\s*([Ss]ri\s+[Ll]anka)\s*$/,
        'V2' : /^\s*([Ss]udan)\s*$/,
        'V3' : /^\s*([Ss]uriname)\s*$/,
        'L9' : /^\s*([Ss]valbard\s+[Aa]nd\s+[Jj]an\s+[Mm]ayen)\s*$/,
        'V6' : /^\s*([Ss]waziland)\s*$/,
        'V7' : /^\s*([Ss]weden)\s*$/,
        'V8' : /^\s*([Ss]witzerland)\s*$/,
        'V9' : /^\s*([Ss]yria(n\s+[Aa]rab\s+[Rr]epublic)?)\s*$/,
        'F5' : /^\s*([Tt]aiwan(\s+[Pp]rovince\s+[Oo]f\s+[Cc]hina)?)\s*$/,
        '2D' : /^\s*([Tt]ajikistan)\s*$/,
        'W0' : /^\s*(([Uu]nited\s+[Rr]epublic\s+[Oo]f\s+)?[Tt]anzania)\s*$/,
        'W1' : /^\s*([Tt]hailand)\s*$/,
        'Z3' : /^\s*([Tt]imor-[Ll]este)\s*$/,
        'W2' : /^\s*([Tt]ogo)\s*$/,
        'W3' : /^\s*([Tt]okelau)\s*$/,
        'W4' : /^\s*([Tt]onga)\s*$/,
        'W5' : /^\s*([Tt]rinidad\s+[Aa]nd\s+[Tt]obago)\s*$/,
        'W6' : /^\s*([Tt]unisia)\s*$/,
        'W8' : /^\s*([Tt]urkey)\s*$/,
        '2E' : /^\s*([Tt]urkmenistan)\s*$/,
        'W7' : /^\s*([Tt]urks\s+[Aa]nd\s+[Cc]aicos\s+[Ii]slands)\s*$/,
        '2G' : /^\s*([Tt]uvalu)\s*$/,
        'W9' : /^\s*([Uu]ganda)\s*$/,
        '2H' : /^\s*([Uu]kraine)\s*$/,
        'C0' : /^\s*(UAE|[Uu]nited\s+[Aa]rab\s+[Ee]mirates)\s*$/,
        'X0' : /^\s*(U[.]?K[.]?|[Bb]ritain|[Gg]reat\s+[BBb]ritain|[Uu]nited\s+[Kk]ingdom(\s+[Oo]f\s+[Gg]reat\s+[Bb]ritain\s+[Aa]nd\s+[Nn]orthern\s+[Ii]reland)?|[Ee]ngland(\s+[Aa]nd\s+[Ww]ales)?)\s*$/,
        'X1' : /^\s*(U[.]?S[.]?A[.]?|[Uu]nited\s+[Ss]tates(\s+[Oo]f\s+[Aa]merica)?)\s*$/,
        'X3' : /^\s*([Uu]ruguay)\s*$/,
        '2K' : /^\s*([Uu]zbekistan)\s*$/,
        '2L' : /^\s*([Vv]anuatu)\s*$/,
        'X5' : /^\s*([Vv]enezuela)\s*$/,
        'Q1' : /^\s*([Vv]iet\s+[Nn]am)\s*$/,
        'D8' : /^\s*([Bb]ritish\s+[Vv]irgin\s+[Ii]slands|[Vv]irgin\s+[Ii]slands,?\s+[Bb]ritish)\s*$/,
        'X8' : /^\s*([Ww]allis\s+[Aa]nd\s+[Ff]utuna)\s*$/,
        'U5' : /^\s*([Ww]estern\s+[Ss]ahara*)\s*$/,
        'T7' : /^\s*([Yy]emen)\s*$/,
        'Y4' : /^\s*([Zz]ambia)\s*$/,
        'Y5' : /^\s*([Zz]imbabwe)\s*$/,
        'XX' : /^\s*([Uu]nknown)\s*$/,
      };
      
      for ( var option in regexOptions ) {
        if ( regexOptions[option].exec(element['innerText']) && regexOptions[option].exec(element['innerText'])[0] ) {
          return option;
        }
      }
      
    }
    return 'Format Error: Edgar Prov Country EN';
  },
  
  entityFilerCategoryEn : function( element ) {
    if ( element && typeof element === 'object' && element['innerText'] ) {
      
      var regexOptions = {
        'Large Accelerated Filer' : /^\s*([Ll]arge\s+[Aa]ccelerated\s+[Ff]iler)\s*$/,
        'Accelerated Filer' : /^\s*([Aa]ccelerated\s+[Ff]iler)\s*$/,
        'Non-accelerated Filer' : /^\s*([Nn]on[^\w]+[Aa]ccelerated\s+[Ff]iler)\s*$/,
      };
      for ( var option in regexOptions ) {
        if ( regexOptions[option].exec(element['innerText']) ) {
          return option;
        }
      }
    }
    return 'Format Error: Entity Filer Category EN';
    
  },
  
  noContent : function( element ) {
    return '';
  },
  
  zeroDash : function( element ) {
    
    if ( element && typeof element === 'object' && element['innerText'] ) {
      
      var regex = /^\s*([-]| |\u002D|\u002D|\u058A|\u05BE|\u2010|\u2011|\u2012|\u2013|\u2014|\u2015|\uFE58|\uFE63|\uFF0D)\s*$/;
      
      if ( regex.test(element.innerText) ) {
        return '0';
      }
    }
    return 'Format Error: Zero Dash';
  }
};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var FiltersReports = {
  getReportsByGroupType : function( input ) {
    if ( input && typeof input === 'string' ) {
      return Constants.getMetaReports.filter(function( element ) {
        
        if ( element['groupType'] === input && (element['firstAnchor'] || element['uniqueAnchor']) ) {
          return true;
        }
      });
    }
    return null;
  }
};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var FiltersScale = {
  getScale : function( scale ) {
    if ( scale && Constants.getScaleOptions[scale.toString()] ) {
      return Constants.getScaleOptions[scale.toString()];
    }
    return null;
    
  }
};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var FiltersSign = {
  getSign : function( sign, tag ) {
    if ( tag && typeof tag === 'string' ) {
      var signOptions = {
        '-' : 'Negative',
        '+' : 'Positive'
      };
      if ( sign && typeof sign === 'string' ) {
        return signOptions[sign];
      } else if ( tag.toLowerCase().endsWith(':nonfraction') ) {
        return signOptions['+']
      } else {
        return null;
      }
    }
    return null;
  }
};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var FiltersUnitref = {
  getMeasure : function( unitref ) {
    if ( unitref && typeof unitref === 'string' ) {
      var nameSpace;
      for ( var ns in Constants.getHTMLAttributes ) {
        
        if ( Constants.getHTMLAttributes[ns] === 'http://www.xbrl.org/2003/instance' ) {
          nameSpace = ns.split(':')[1];
        }
      }
      var unitRefElement = document.querySelector('[id="' + unitref + '"]');
      
      if ( unitRefElement && nameSpace ) {
        if ( unitRefElement.querySelector(nameSpace + '\\:divide') ) {
          
          return unitRefElement.querySelector(nameSpace + '\\:divide ' + nameSpace + '\\:unitnumerator').innerText
              .split(':')[1].toUpperCase()
              + ' / '
              + unitRefElement.querySelector(nameSpace + '\\:divide ' + nameSpace + '\\:unitdenominator').innerText
                  .split(':')[1].toUpperCase();
          
        } else {
          
          return unitRefElement.querySelector(nameSpace + '\\:measure').innerText.split(':')[1].toUpperCase();
          
        }
      }
      
      return unitref.toUpperCase() || null;
    }
    return null;
  }
};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var FiltersValue = {
  
  getFormattedValue : function( element, showCollapse ) {
    
    var popoverElement = element.querySelector('.popover');
    var format = element.getAttribute('format');
    
    if ( format && format.split(':')[1] ) {
      var namespace = format.split(':')[0].toLowerCase();
      
      format = format.split(':')[1].toLowerCase();
      if ( Constants.getFormattingObject[namespace] && Constants.getFormattingObject[namespace].indexOf(format) >= 0 ) {
        switch ( format ) {
          
          case 'booleanfalse' : {
            return FiltersNumber.numberFormatting(element, FiltersBoolean.booleanFalse(element));
            break;
          }
          case 'booleantrue' : {
            return FiltersNumber.numberFormatting(element, FiltersBoolean.booleanTrue(element));
            break;
          }
          case 'boolballotbox' : {
            return FiltersNumber.numberFormatting(element, FiltersBoolean.boolBallotBox(element));
            break;
          }
          case 'yesnoballotbox' : {
            return FiltersNumber.numberFormatting(element, FiltersBoolean.yesNoBallotBox(element));
            break;
          }
            
          case 'countrynameen' : {
            return FiltersNumber.numberFormatting(element, FiltersOther.countryNameEn(element));
            break;
          }
          case 'stateprovnameen' : {
            return FiltersNumber.numberFormatting(element, FiltersOther.stateProvNameEn(element));
            break;
          }
          case 'exchnameen' : {
            return FiltersNumber.numberFormatting(element, FiltersOther.exchNameEn(element));
            break;
          }
            
          case 'entityfilercategoryen' : {
            return FiltersNumber.numberFormatting(element, FiltersOther.entityFilerCategoryEn(element));
            break;
          }
            
          case 'edgarprovcountryen' : {
            return FiltersNumber.numberFormatting(element, FiltersOther.edgarProvCountryEn(element));
            break;
          }
            
          case 'calindaymonthyear' : {
            return FiltersNumber.numberFormatting(element, FiltersDate.calINDayMonthYear(element));
            break;
          }
          case 'datedaymonth' : {
            return FiltersNumber.numberFormatting(element, FiltersDate.dateDayMonth(element));
            break;
          }
          case 'datedaymonthdk' : {
            return FiltersNumber.numberFormatting(element, FiltersDate.dateDayMonthDK(element));
            break;
          }
          case 'datedaymonthen' : {
            return FiltersNumber.numberFormatting(element, FiltersDate.dateDayMonthEN(element));
            break;
          }
          case 'datedaymonthyear' : {
            return FiltersNumber.numberFormatting(element, FiltersDate.dateDayMonthYear(element));
            break;
          }
          case 'datedaymonthyeardk' : {
            return FiltersNumber.numberFormatting(element, FiltersDate.dateDayMonthYearDK(element));
            break;
          }
          case 'datedaymonthyearen' : {
            return FiltersNumber.numberFormatting(element, FiltersDate.dateDayMonthYearEN(element));
            break;
          }
          case 'datedaymonthyearin' : {
            return FiltersNumber.numberFormatting(element, FiltersDate.dateDayMonthYearIN(element));
            break;
          }
          case 'datedoteu' : {
            return FiltersNumber.numberFormatting(element, FiltersDate.dateDotEU(element));
            break;
          }
          case 'datedotus' : {
            return FiltersNumber.numberFormatting(element, FiltersDate.dateDotUS(element));
            break;
          }
          case 'dateerayearmonthdayjp' : {
            return FiltersNumber.numberFormatting(element, FiltersDate.dateEraYearMonthDayJP(element));
            break;
          }
          case 'dateerayearmonthjp' : {
            return FiltersNumber.numberFormatting(element, FiltersDate.dateEraYearMonthJP(element));
            break;
          }
          case 'datelongmonthyear' : {
            return FiltersNumber.numberFormatting(element, FiltersDate.dateLongMonthYear(element));
            break;
          }
          case 'datelonguk' : {
            return FiltersNumber.numberFormatting(element, FiltersDate.dateLongUK(element));
            break;
          }
          case 'datelongus' : {
            return FiltersNumber.numberFormatting(element, FiltersDate.dateLongUS(element));
            break;
          }
          case 'datelongyearmonth' : {
            return FiltersNumber.numberFormatting(element, FiltersDate.dateLongYearMonth(element));
            break;
          }
          case 'datemonthday' : {
            return FiltersNumber.numberFormatting(element, FiltersDate.dateMonthDay(element));
            break;
          }
          case 'datemonthdayen' : {
            return FiltersNumber.numberFormatting(element, FiltersDate.dateMonthDayEN(element));
            break;
          }
          case 'datemonthdayyear' : {
            return FiltersNumber.numberFormatting(element, FiltersDate.dateMonthDayYear(element));
            break;
          }
          case 'datemonthdayyearen' : {
            return FiltersNumber.numberFormatting(element, FiltersDate.dateMonthDayYearEN(element));
            break;
          }
          case 'datemonthyear' : {
            return FiltersNumber.numberFormatting(element, FiltersDate.dateMonthYear(element));
            break;
          }
          case 'datemonthyeardk' : {
            return FiltersNumber.numberFormatting(element, FiltersDate.dateMonthYearDK(element));
            break;
          }
          case 'datemonthyearen' : {
            return FiltersNumber.numberFormatting(element, FiltersDate.dateMonthYearEN(element));
            break;
          }
          case 'datemonthyearin' : {
            return FiltersNumber.numberFormatting(element, FiltersDate.dateMonthYearIN(element));
            break;
          }
          case 'dateshortdaymonthuk' : {
            return FiltersNumber.numberFormatting(element, FiltersDate.dateShortDayMonthUK(element));
            
            break;
          }
          case 'dateshorteu' : {
            return FiltersNumber.numberFormatting(element, FiltersDate.dateShortEU(element));
            
            break;
          }
          case 'dateshortmonthdayus' : {
            return FiltersNumber.numberFormatting(element, FiltersDate.dateShortMonthDayUS(element));
            break;
          }
          case 'dateshortmonthyear' : {
            return FiltersNumber.numberFormatting(element, FiltersDate.dateShortMonthYear(element));
            break;
          }
          case 'dateshortuk' : {
            return FiltersNumber.numberFormatting(element, FiltersDate.dateShortUK(element));
            break;
          }
          case 'dateshortus' : {
            return FiltersNumber.numberFormatting(element, FiltersDate.dateShortUS(element));
            break;
          }
          case 'dateshortyearmonth' : {
            return FiltersNumber.numberFormatting(element, FiltersDate.dateShortYearMonth(element));
            break;
          }
          case 'dateslashdaymontheu' : {
            return FiltersNumber.numberFormatting(element, FiltersDate.dateSlashDayMonthEU(element));
            break;
          }
          case 'dateslasheu' : {
            return FiltersNumber.numberFormatting(element, FiltersDate.dateSlashEU(element));
            break;
          }
          case 'dateslashmonthdayus' : {
            return FiltersNumber.numberFormatting(element, FiltersDate.dateSlashMonthDayUS(element));
            break;
          }
          case 'dateslashus' : {
            return FiltersNumber.numberFormatting(element, FiltersDate.dateSlashUS(element));
            break;
          }
            
          case 'datequarterend' : {
            return FiltersNumber.numberFormatting(element, FiltersDate.dateQuarterEnd(element));
            break;
          }
            
          case 'dateyearmonthcjk' : {
            return FiltersNumber.numberFormatting(element, FiltersDate.dateYearMonthCJK(element));
            break;
          }
          case 'dateyearmonthday' : {
            return FiltersNumber.numberFormatting(element, FiltersDate.dateYearMonthDay(element));
            break;
          }
          case 'dateyearmonthdaycjk' : {
            return FiltersNumber.numberFormatting(element, FiltersDate.dateYearMonthDayCJK(element));
            break;
          }
          case 'dateyearmonthen' : {
            return FiltersNumber.numberFormatting(element, FiltersDate.dateYearMonthEN(element));
            break;
          }
          case 'duryear' : {
            return FiltersNumber.numberFormatting(element, FiltersDate.durYear(element));
            break;
          }
          case 'durmonth' : {
            return FiltersNumber.numberFormatting(element, FiltersDate.durMonth(element));
            break;
          }
          case 'durday' : {
            return FiltersNumber.numberFormatting(element, FiltersDate.durDay(element));
            break;
          }
          case 'durhour' : {
            return FiltersNumber.numberFormatting(element, FiltersDate.durHour(element));
            break;
          }
          case 'durwordsen' : {
            return FiltersNumber.numberFormatting(element, FiltersDate.durWordsEn(element));
            break;
          }
          case 'nocontent' : {
            return FiltersNumber.numberFormatting(element, FiltersOther.noContent(element));
            break;
          }
          case 'numcomma' : {
            return FiltersNumber.numberFormatting(element, FiltersNumber.numComma(element));
            break;
          }
          case 'numcommadecimal' : {
            return FiltersNumber.numberFormatting(element, FiltersNumber.numCommaDecimal(element));
            break;
          }
          case 'numcommadot' : {
            return FiltersNumber.numberFormatting(element, FiltersNumber.numCommaDot(element));
            break;
          }
          case 'numdash' : {
            return FiltersNumber.numberFormatting(element, FiltersNumber.numDash(element));
            break;
          }
          case 'numdotcomma' : {
            return FiltersNumber.numberFormatting(element, FiltersNumber.numDotComma(element));
            break;
          }
          case 'numdotdecimal' : {
            return FiltersNumber.numberFormatting(element, FiltersNumber.numDotDecimal(element));
            break;
          }
          case 'numdotdecimalin' : {
            return FiltersNumber.numberFormatting(element, FiltersNumber.numDotDecimalIN(element));
            break;
          }
          case 'numspacecomma' : {
            return FiltersNumber.numberFormatting(element, FiltersNumber.numSpaceComma(element));
            break;
          }
          case 'numspacedot' : {
            return FiltersNumber.numberFormatting(element, FiltersNumber.numSpaceDot(element));
            break;
          }
          case 'numunitdecimal' : {
            return FiltersNumber.numberFormatting(element, FiltersNumber.numUnitDecimal(element));
            break;
          }
          case 'numunitdecimalin' : {
            return FiltersNumber.numberFormatting(element, FiltersNumber.numUnitDecimalIN(element));
            break;
          }
          case 'numwordsen' : {
            return FiltersNumber.numberFormatting(element, FiltersNumber.numWordsEn(element));
            break;
          }
          case 'zerodash' : {
            return FiltersNumber.numberFormatting(element, FiltersOther.zeroDash(element));
            break;
          }
          default : {
            return 'Format not found';
          }
        }
      } else {
        return 'Namespace not found';
      }
      
    } else {
      
      if ( element.hasAttribute('xsi:nil') && (element.getAttribute('xsi:nil') === true) ) {
        return 'nil';
      } else {
        
        var splitText = element.innerText.split(/(\r\n|\n|\r)/gm);
        var dataToReturn = '';
        if ( splitText.length > 1 && showCollapse ) {
          // we show accordion
          dataToReturn = '<div class="collapse d-block collapse-modal-partial" id="collapse-taxonomy">';
          dataToReturn += element.innerHTML;
          
          dataToReturn += '</div>';
          dataToReturn += '<button class="btn btn-primary btn-sm btn-block mt-1" type="button" data-toggle="collapse" data-target="#collapse-taxonomy">Contract / Expand</button>';
          
        } else if ( splitText.length > 1 && !showCollapse ) {
          dataToReturn = 'Click to see Fact';
        } else {
          
          dataToReturn = element.innerText;
          
        }
        return FiltersNumber.numberFormatting(element, dataToReturn);
      }
    }
    
  },
  
  getFormattedValueForContinuedAt : function( element ) {
    var dataToReturn = '<div class="collapse d-block collapse-modal-partial" id="collapse-modal">';
    
    element.forEach(function( current ) {
      var duplicateNode = current.cloneNode(true);
      
      FiltersValue.recursivelyFixHTMLTemp(duplicateNode);
      
      dataToReturn += duplicateNode.outerHTML;
      
    });
    dataToReturn += '</div>';
    dataToReturn += '<button class="btn btn-primary btn-sm mt-1" type="button" data-toggle="collapse" data-target="#collapse-modal">Contract / Expand</button>';
    return dataToReturn;
  },
  
  recursivelyFixHTMLTemp : function( element ) {
    
    // TODO add bootstrap classes?
    if ( element.nodeName.toLowerCase() === 'table' ) {
      element.classList.add('table');
    }
    element.removeAttribute('contextref');
    element.removeAttribute('name');
    element.removeAttribute('id');
    element.removeAttribute('escape');
    element.removeAttribute('continued-taxonomy');
    element.removeAttribute('continued-main-taxonomy');
    element.removeAttribute('class');
    element.removeAttribute('enabled-taxonomy');
    element.removeAttribute('highlight-taxonomy');
    element.removeAttribute('selected-taxonomy');
    element.removeAttribute('hover-taxonomy');
    element.removeAttribute('onclick');
    element.removeAttribute('onmouseenter');
    element.removeAttribute('onmouseleave');
    element.removeAttribute('isamountsonly');
    element.removeAttribute('istextonly');
    element.removeAttribute('iscalculationsonly');
    element.removeAttribute('isnegativesonly');
    element.removeAttribute('isadditionalitemsonly');
    element.removeAttribute('isstandardonly');
    element.removeAttribute('iscustomonly');
    
    element.style.fontSize = null;
    element.style.lineHeight = null;
    // element.removeAttribute('style');
    if ( element['children'].length > 0 ) {
      for ( var i = 0; i < element['children'].length; i++ ) {
        FiltersValue.recursivelyFixHTMLTemp(element['children'][i]);
      }
    } else {
    }
  },
  
  recursivelyFixHTML : function( element ) {
    
    // TODO add bootstrap classes?
    if ( element.nodeName.toLowerCase() === 'table' ) {
      element.classList.add('table');
    }
    element.removeAttribute('style');
    if ( element['children'].length > 0 ) {
      for ( var i = 0; i < element['children'].length; i++ ) {
        FiltersValue.recursivelyFixHTML(element['children'][i]);
      }
    } else {
    }
  }

};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var FormInformation = {
  
  init : function( event, element ) {
    if ( event.type === 'keyup' && (event.keyCode === 13 || event.keyCode === 32) ) {
      $(element).dropdown('toggle');
    }
    FormInformation.xbrlInstance();
    FormInformation.xbrlZip();
    FormInformation.xbrlHtml();
    FormInformation.version();
  },
  
  xbrlInstance : function( ) {
    
    var instance = HelpersUrl.getExternalFile.substring(0, HelpersUrl.getExternalFile.lastIndexOf('.')) + '_htm.xml';
    
    document.getElementById('form-information-instance').setAttribute('href', instance);
    
  },
  
  xbrlZip : function( ) {
    
    var zip = HelpersUrl.getExternalFile.substring(0, HelpersUrl.getExternalFile.lastIndexOf('.')) + '.zip';
    
    document.getElementById('form-information-zip').setAttribute('href', zip);
    
  },
  
  xbrlHtml : function( ) {
    
    document.getElementById('form-information-html').setAttribute('href', HelpersUrl.getExternalFile);
    
  },
  
  version : function( ) {
    document.getElementById('form-information-version').innerText = 'Version: ' + Constants.version;
    
  }

};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var Help = {
  
  toggle : function( event, element ) {
    
    if ( event.keyCode && !(event.keyCode === 13 || event.keyCode === 32) ) {
      return;
    }
    
    if ( element.classList && element.classList.contains('disabled') ) {
      return;
    }
    
    MenusState.toggle('help-menu', false, function( openMenu ) {
      if ( openMenu ) {
        document.getElementById('help-menu').addEventListener('transitionend', function( event ) {
          // our menu is now open
        }, {
          'once' : true
        });
      }
    });
  }
};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var HelpersUrl = {
  
  init : function( internalUrl, callback ) {
    callback(HelpersUrl.setParams(internalUrl));
  },
  
  makeAbsoluteUrlUnlessSimpleAnchorTag : function( element ) {
    var url = new ParsedUrl(element.getAttribute('href'));
    if ( element.getAttribute('href').indexOf('http://') === 0
        || element.getAttribute('href').indexOf('https://') === 0 ) {
      // already absolute URL
      element.setAttribute('tabindex', '18');
    } else {
      if ( element.getAttribute('href').startsWith('#') ) {
        element.setAttribute('tabindex', '18');
        // already simple anchortag
        
      } else {
        element.setAttribute('tabindex', '18');
        element.setAttribute('href', HelpersUrl.getFormAbsoluteURL + element.getAttribute('href'));
      }
    }
  },
  
  fullURL : null,
  
  addLinkattributes : function( element ) {
    var attribute = null;
    if ( element ) {
      if ( element.getAttribute('data-link') ) {
        attribute = 'data-link';
      } else if ( element.getAttribute('href') ) {
        attribute = 'href';
      }
    }
    
    if ( attribute && element.getAttribute(attribute).charAt(0) !== '#' ) {
      var absoluteLinkOfElementAttribute = decodeURIComponent(HelpersUrl
          .getAbsoluteUrl(element.getAttribute(attribute)));
      var url = new ParsedUrl(absoluteLinkOfElementAttribute);
      if ( url.search ) {
        var urlParams = HelpersUrl.returnURLParamsAsObject(url.search.substring(1));
        if ( urlParams.hasOwnProperty('doc-file')
            && Constants.getMetaSourceDocuments.indexOf(urlParams['doc-file']) >= 0 ) {
          element.setAttribute('data-link', urlParams['doc-file']);
          element.setAttribute('href', urlParams['doc-file']);
          element.setAttribute('onclick', 'Links.clickEventInternal(event, this)');
        }
      } else {
        if ( url.hash ) {
          var urlParams = element.getAttribute(attribute).split('#')[0];
          if ( element.getAttribute(attribute).split('#')[0]
              && Constants.getMetaSourceDocuments.indexOf(element.getAttribute(attribute).split('#')[0]) >= 0 ) {
            element.setAttribute('data-link', element.getAttribute(attribute));
            element.setAttribute('href', element.getAttribute(attribute));
            element.setAttribute('onclick', 'Links.clickEventInternal(event, this)');
          }
        } else {
          var index = Constants.getMetaSourceDocuments.indexOf(element.getAttribute(attribute));
          if ( index >= 0 ) {
            // here we add the necessary attributes for multi-form
            element.setAttribute('data-link', Constants.getMetaSourceDocuments[index]);
            element.setAttribute('href', Constants.getMetaSourceDocuments[index]);
            element.setAttribute('onclick', 'Links.clickEventInternal(event, this)');
          } else {
            HelpersUrl.makeAbsoluteUrlUnlessSimpleAnchorTag(element);
          }
        }
      }
    } else {
      HelpersUrl.makeAbsoluteUrlUnlessSimpleAnchorTag(element);
    }
  },
  
  returnURLParamsAsObject : function( url ) {
    
    // var url =
    // "&doc=../DisplayDocument.do%3Fstep%3DdocOnly%26accessionNumber%3D0000350001-19-102670%26interpretedFormat%3Dtrue%26redline%3Dtrue%26filename%3Da4q18doc10k.htm&metalinks=../DisplayDocument.do%3Fstep%3DdocOnly%26accessionNumber%3D0000350001-19-102670%26interpretedFormat%3Dtrue%26redline%3Dtrue%26filename%3DMetaLinks.json";
    // var url =
    // "xbrl=true&doc=../DisplayDocument.do?step=docOnly&accessionNumber=0001314612-19-000089&interpretedFormat=true&redline=true&filename=a4q18doc10k.htm&metalinks=../DisplayDocument.do?step=docOnly&accessionNumber=0001314612-19-000089&interpretedFormat=true&redline=true&filename=MetaLinks.json";
    var urlSplit = url.split(/doc=|file=|metalinks=|xbrl=true|xbrl=false/).filter(function( e ) {
      return e;
    });
    
    var obj = urlSplit.map(
        function( current ) {
          var lastChar = current.slice(-1);
          if ( lastChar === '&' ) {
            current = current.slice(0, -1);
          }
          if ( current.slice(-4) === '.htm' ) {
            current = decodeURIComponent(current);
            var docFile = current.split('filename=')[1] ? current.split('filename=')[1] : current.substring(current
                .lastIndexOf('/') + 1);
            return {
              'doc' : current,
              'doc-file' : docFile
            };
          } else if ( current.slice(-5) === '.json' ) {
            current = decodeURIComponent(current);
            current = current.replace('interpretedFormat=true', 'interpretedFormat=false')
            return {
              'metalinks' : current,
              'metalinks-file' : 'MetaLinks.json'
            };
          }
        }).filter(function( element ) {
      return element;
    });
    var objectToReturn = {};
    for ( var i = 0; i < obj.length; i++ ) {
      var single = obj[i];
      if ( !single.hasOwnProperty('metalinks') ) {
        var metalinks = single['doc'].replace(single['doc-file'], 'MetaLinks.json');
        single['metalinks'] = metalinks;
        single['metalinks-file'] = 'MetaLinks.json';
      }
      
      Object.assign(objectToReturn, single);
    }
    return objectToReturn;
    
  },
  
  getFormAbsoluteURL : null,
  
  getURL : null,
  
  getExternalFile : null,
  
  getExternalMeta : null,
  
  getHTMLFileName : null,
  
  getAnchorTag : null,
  
  getAllParams : null,
  
  setParams : function( internalUrl ) {
    
    if ( (internalUrl && typeof internalUrl === 'string') && (internalUrl !== HelpersUrl.getHTMLFileName) ) {
      HelpersUrl.fullURL = HelpersUrl.fullURL.replace(HelpersUrl.getHTMLFileName, internalUrl);
      HelpersUrl.updateURLWithoutReload();
      HelpersUrl.getHTMLFileName = null;
    }
    
    var url = new ParsedUrl(window.location.href);
    // here we check for cors
    var tempUrl = new ParsedUrl(url.search.substring(1).replace(/doc=|file=/, ''));
    var tempUrlHost = tempUrl.protocol + '//' + tempUrl.host;
    var host = window.location.protocol + '//' + window.location.host;
    if ( tempUrlHost !== host ) {
      ErrorsMajor.cors(tempUrl);
      return false;
    }
    
    HelpersUrl.fullURL = url.href;
    // we are going to set all of the URL Params as a simple object
    if ( url.search ) {
      
      HelpersUrl.getAllParams = HelpersUrl.returnURLParamsAsObject(url.search.substring(1));
      if ( HelpersUrl.getAllParams.hasOwnProperty('metalinks') ) {
        HelpersUrl.getExternalMeta = decodeURIComponent(HelpersUrl.getAllParams['metalinks']);
        HelpersUrl.getExternalMeta = HelpersUrl.getExternalMeta.replace('interpretedFormat=true',
            'interpretedFormat=false');
      }
      
      if ( HelpersUrl.getAllParams.hasOwnProperty('doc-file') ) {
        HelpersUrl.getHTMLFileName = HelpersUrl.getAllParams['doc-file'];
      }
      
      if ( url['hash'] ) {
        HelpersUrl.getAnchorTag = url['hash'];
      }
      
      HelpersUrl.getExternalFile = HelpersUrl.getAllParams['doc'];
      
      if ( !HelpersUrl.getHTMLFileName && HelpersUrl.getExternalFile ) {
        var splitFormURL = HelpersUrl.getExternalFile.split('/');
        HelpersUrl.getHTMLFileName = splitFormURL[splitFormURL.length - 1];
      }
      
      if ( !HelpersUrl.getExternalMeta && HelpersUrl.getExternalFile ) {
        
        var tempMetaLink = HelpersUrl.getExternalFile.replace(HelpersUrl.getHTMLFileName, 'MetaLinks.json');
        
        HelpersUrl.getExternalMeta = tempMetaLink;
      }
    }
    if ( !HelpersUrl.getExternalFile ) {
      return false;
    }
    
    var formUrl = HelpersUrl.getAbsoluteUrl(HelpersUrl.getExternalFile);
    var absoluteURL = formUrl.substr(0, formUrl.lastIndexOf('/') + 1);
    
    HelpersUrl.getFormAbsoluteURL = absoluteURL;
    
    return true;
    
  },
  
  getAbsoluteUrl : function( url ) {
    var a = document.createElement('a');
    a.href = url;
    return a.href;
  },
  
  getParamsFromString : function( name, url ) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    var results = regex.exec(url);
    
    if ( !results ) {
      
      return null;
    }
    if ( !results[3] ) {
      
      return '';
    }
    return decodeURIComponent(results[3].replace(/\+/g, ' '));
  },
  
  updateURLWithoutReload : function( ) {
    window.history.pushState('Next Link', 'Inline XBRL Viewer', HelpersUrl.fullURL);
  }
};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var Images = {
  updateLinks : function( ) {
    
    var foundImages = document.getElementById('dynamic-xbrl-form').querySelectorAll('img');
    
    var foundImagesArray = Array.prototype.slice.call(foundImages);
    
    foundImagesArray.forEach(function( current ) {
      var imageSRC = current['src'].substr(current['src'].lastIndexOf('/') + 1);
      current.setAttribute('data-src', HelpersUrl.getFormAbsoluteURL + imageSRC);
      current.removeAttribute('src');
      var img = new Image();
      img.src = current.getAttribute('data-src');
      img.onload = function( ) {
        current.setAttribute('src', current.getAttribute('data-src'));
      };
    });
  }
};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var Links = {
  
  init : function( ) {
    
    if ( (Constants.getMetaSourceDocuments.length > 1) && (Constants.getMetaVersion >= 2.1) ) {
      Links.updateLinks();
    }
    
    Links.absoluteLinks();
  },
  
  updateLinks : function( ) {
    
    document.getElementById('sections-search-additional').classList.remove('d-none');
    document.getElementById('links-dropdown').classList.remove('d-none');
    
    Links.populate();
  },
  
  absoluteLinks : function( ) {
    var foundLinks = document.getElementById('dynamic-xbrl-form').querySelectorAll('[data-link],[href]');
    
    var foundLinksArray = Array.prototype.slice.call(foundLinks);
    
    foundLinksArray.forEach(function( current ) {
      
      HelpersUrl.addLinkattributes(current);
      
    });
    
  },
  
  clickEventInternal : function( event, element ) {
    // all element hrefs will be an absolute url
    // all element data-link will be the form url
    event.preventDefault();
    
    if ( element.getAttribute('href') && element.getAttribute('href') !== '#' && element.getAttribute('data-link') ) {
      AppInit.init(element.getAttribute('data-link'), function( ) {
        AppInit.additionalSetup();
      });
    }
  },
  
  populate : function( ) {
    
    var innerHtml = '';
    Constants.getMetaSourceDocuments
        .forEach(function( current ) {
          if ( current !== HelpersUrl.getHTMLFileName ) {
            
            innerHtml += '<a onclick="Links.clickEventInternal(event, this)" href="' + current + '" data-link="'
                + current + '" class="dropdown-item">' + current + '</a>';
          } else {
            
            innerHtml += '<a class="dropdown-item" href="#" aria-disabled="true"><i title="Current Form" class="fa fa-bookmark"></i> '
                + current;
          }
        });
    document.getElementById('links-dropdown-content').innerHTML = innerHtml;
  }

};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';
var MenusState = {
  toggle : function( menuId, rightIfTrue, callback ) {
    
    var whichSide = (rightIfTrue) ? 'right' : 'left';
    
    if ( MenusState.openMenu !== '' && MenusState.openMenu !== menuId ) {
      console.log('open?');
      var whichSavedSide = (MenusState.openMenuSide) ? 'right' : 'left';
      document.getElementById(MenusState.openMenu).style[whichSavedSide] = '-100%';
      
      document.getElementById('dynamic-xbrl-form').classList.remove('col-sm-9');
      document.getElementById('dynamic-xbrl-form').classList.remove('offset-sm-3');
      document.getElementById('dynamic-xbrl-form').classList.add('col-sm-12');
      
      document.getElementById('error-container').classList.remove('offset-sm-3');
      document.getElementById('error-container').classList.remove('col-sm-9');
      
      MenusState.openMenu = '';
      MenusState.openMenuSide = null;
    }
    
    if ( document.getElementById(menuId).style[whichSide] === '0px' ) {
      // close the menu
      document.getElementById(menuId).classList.add('invisible');
      document.getElementById(menuId).style[whichSide] = '-100%';
      
      document.getElementById('dynamic-xbrl-form').classList.remove('col-sm-9');
      document.getElementById('dynamic-xbrl-form').classList.remove('offset-sm-3');
      document.getElementById('dynamic-xbrl-form').classList.add('col-sm-12');
      
      document.getElementById('error-container').classList.remove('offset-sm-3');
      document.getElementById('error-container').classList.remove('col-sm-9');
      
      MenusState.openMenu = '';
      MenusState.openMenuSide = null;
      callback(false);
      
    } else {
      
      $('#navbarSupportedContent').collapse('hide');
      
      // open the menu
      if ( rightIfTrue ) {
        document.getElementById(menuId).classList.remove('invisible');
        document.getElementById(menuId).style.right = '0px';
      } else {
        document.getElementById(menuId).classList.remove('invisible');
        document.getElementById(menuId).style.left = '0px';
      }
      document.getElementById('dynamic-xbrl-form').classList.remove('col-sm-12');
      document.getElementById('dynamic-xbrl-form').classList.add('col-sm-9');
      
      document.getElementById('error-container').classList.add('col-sm-9');
      if ( !rightIfTrue ) {
        
        document.getElementById('dynamic-xbrl-form').classList.add('offset-sm-3');
        document.getElementById('error-container').classList.add('offset-sm-3');
      }
      
      MenusState.openMenu = menuId;
      MenusState.openMenuSide = rightIfTrue;
      callback(true);
    }
  },
  
  openMenu : '',
  openMenuSide : null

};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var ModalsCommon = {
  
  carouselInformation : [ {
    'dialog-title' : 'Attributes'
  }, {
    'dialog-title' : 'Labels'
  }, {
    'dialog-title' : 'References'
  }, {
    'dialog-title' : 'Calculation'
  } ],
  
  getAttributes : null,
  
  clickEvent : function( event, element ) {
    if ( event.keyCode && !(event.keyCode === 13 || event.keyCode === 32) ) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    Modals.close(event, element);
    
    document.getElementById('taxonomy-modal').classList.remove('d-none');
    
    TaxonomiesGeneral.selectedTaxonomy(element);
    
    document.getElementById('taxonomy-modal-drag').focus();
    // we add draggable
    Modals.initDrag(document.getElementById('taxonomy-modal-drag'));
    
    ModalsCommon.carouselData(element);
    
    document.getElementById('taxonomy-modal-title').innerText = ModalsCommon.carouselInformation[0]['dialog-title'];
    
    document.getElementById('taxonomy-modal-subtitle').innerHTML = FiltersName.getLabel(element.getAttribute('name'));
    
    $('#taxonomy-modal-carousel').carousel(0);
    
    window.addEventListener('keyup', ModalsCommon.keyboardEvents);
    
    $('#taxonomy-modal-carousel')
        .on(
            'slide.bs.carousel',
            function( event ) {
              var previousActiveIndicator = event['from'];
              var newActiveIndicator = event['to'];
              document.getElementById('taxonomy-modal-carousel-indicators').querySelector(
                  '[data-slide-to="' + previousActiveIndicator + '"]').classList.remove('active');
              document.getElementById('taxonomy-modal-carousel-indicators').querySelector(
                  '[data-slide-to="' + newActiveIndicator + '"]').classList.add('active');
              document.getElementById('taxonomy-modal-title').innerText = ModalsCommon.carouselInformation[event['to']]['dialog-title'];
            });
    
  },
  
  keyboardEvents : function( event ) {
    
    var key = event.keyCode ? event.keyCode : event.which;
    
    if ( key === 49 || key === 97 ) {
      $('#taxonomy-modal-carousel').carousel(0);
      return false;
    }
    if ( key === 50 || key === 98 ) {
      $('#taxonomy-modal-carousel').carousel(1);
      return false;
    }
    if ( key === 51 || key === 99 ) {
      $('#taxonomy-modal-carousel').carousel(2);
      return false;
    }
    if ( key === 52 || key === 100 ) {
      $('#taxonomy-modal-carousel').carousel(3);
      return false;
    }
    if ( key === 37 ) {
      $('#taxonomy-modal-carousel').carousel('prev');
      return false;
    }
    if ( key === 39 ) {
      $('#taxonomy-modal-carousel').carousel('next');
      return false;
    }
    
  },
  
  carouselData : function( element, returnString ) {
    returnString = returnString || false;
    if ( !returnString ) {
      Modals.renderCarouselIndicators('taxonomy-modal-carousel', 'taxonomy-modal-carousel-indicators',
          ModalsContinuedAt.carouselInformation);
    }
    var stringToReturn = '';
    TaxonomyPages
        .firstPage(
            element,
            function( page1Html ) {
              page1Html = page1Html || 'No Data.';
              if ( returnString ) {
                stringToReturn += '<div class="carousel-item table-responsive active"><table class="table table-striped table-sm">'
                    + page1Html + '</table></div>';
              } else {
                document.getElementById('taxonomy-modal-carousel-page-1').innerHTML = page1Html;
              }
              
              TaxonomyPages
                  .secondPage(
                      element,
                      function( page2Html ) {
                        page2Html = page2Html || 'No Data.';
                        if ( returnString ) {
                          stringToReturn += '<div class="carousel-item table-responsive"><table class="table table-striped table-sm">'
                              + page2Html + '</table></div>';
                        } else {
                          document.getElementById('taxonomy-modal-carousel-page-2').innerHTML = page2Html;
                        }
                        
                        TaxonomyPages
                            .thirdPage(
                                element,
                                function( page3Html ) {
                                  page3Html = page3Html || 'No Data.';
                                  if ( returnString ) {
                                    stringToReturn += '<div class="carousel-item table-responsive"><table class="table table-striped table-sm">'
                                        + page3Html + '</table></div>';
                                  } else {
                                    document.getElementById('taxonomy-modal-carousel-page-3').innerHTML = page3Html;
                                  }
                                  TaxonomyPages
                                      .fourthPage(
                                          element,
                                          function( page4Html ) {
                                            page4Html = page4Html || 'No Data.';
                                            if ( returnString ) {
                                              stringToReturn += '<div class="carousel-item table-responsive"><table class="table table-striped table-sm">'
                                                  + page4Html + '</table></div>';
                                            } else {
                                              document.getElementById('taxonomy-modal-carousel-page-4').innerHTML = page4Html;
                                            }
                                          });
                                });
                      });
            });
    if ( returnString ) {
      return stringToReturn;
    }
  }

};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var ModalsContinuedAt = {
  
  carouselInformation : [ {
    'dialog-title' : 'Attributes'
  }, {
    'dialog-title' : 'Labels'
  }, {
    'dialog-title' : 'References'
  }, {
    'dialog-title' : 'Calculation'
  } ],
  
  getAllElements : [ ],
  
  dynamicallyFindContextRefForModal : function( element ) {
    if ( element && element.hasAttribute('contextref') ) {
      ModalsContinuedAt.setAllElements(element);
    } else if ( element && element.hasAttribute('id') ) {
      
      ModalsContinuedAt.dynamicallyFindContextRefForModal(document.getElementById('dynamic-xbrl-form').querySelector(
          '[continuedat="' + element.getAttribute('id') + '"]'));
    } else {
      ErrorsMinor.unknownError();
    }
  },
  
  setAllElements : function( element ) {
    // we always start at the top-level element
    if ( element ) {
      element.setAttribute('selected-taxonomy', true);
      ModalsContinuedAt.getAllElements.push(element);
      
      if ( element.hasAttribute('continuedat') ) {
        
        ModalsContinuedAt.setAllElements(document.getElementById('dynamic-xbrl-form').querySelector(
            '[id="' + element.getAttribute('continuedat') + '"]'));
      }
    }
  },
  
  clickEvent : function( event, element ) {
    
    if ( event.keyCode && !(event.keyCode === 13 || event.keyCode === 32) ) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    ModalsContinuedAt.getAllElements = [ ];
    
    Modals.close(event, element);
    
    document.getElementById('taxonomy-modal').classList.remove('d-none');
    
    ModalsContinuedAt.dynamicallyFindContextRefForModal(element);
    
    if ( ModalsContinuedAt.getAllElements[0] && ModalsContinuedAt.getAllElements[0].getAttribute('id') ) {
      
      TaxonomiesGeneral.selectedTaxonomy(ModalsContinuedAt.getAllElements);
      
      document.getElementById('taxonomy-modal-drag').focus();
      // we add draggable
      Modals.initDrag(document.getElementById('taxonomy-modal-drag'));
      ModalsContinuedAt.carouselData();
      
      document.getElementById('taxonomy-modal-title').innerText = ModalsContinuedAt.carouselInformation[0]['dialog-title'];
      
      document.getElementById('taxonomy-modal-subtitle').innerHTML = FiltersName
          .getLabel(ModalsContinuedAt.getAllElements[0].getAttribute('name'));
      
      $('#taxonomy-modal-carousel').carousel(0);
      
      window.addEventListener('keyup', ModalsCommon.keyboardEvents);
      
      $('#taxonomy-modal-carousel')
          .on(
              'slide.bs.carousel',
              function( event ) {
                var previousActiveIndicator = event['from'];
                var newActiveIndicator = event['to'];
                document.getElementById('taxonomy-modal-carousel-indicators').querySelector(
                    '[data-slide-to="' + previousActiveIndicator + '"]').classList.remove('active');
                document.getElementById('taxonomy-modal-carousel-indicators').querySelector(
                    '[data-slide-to="' + newActiveIndicator + '"]').classList.add('active');
                document.getElementById('taxonomy-modal-title').innerText = ModalsContinuedAt.carouselInformation[event['to']]['dialog-title'];
              });
    }
  },
  
  carouselData : function( element, returnString ) {
    
    returnString = returnString || false;
    if ( !returnString ) {
      Modals.renderCarouselIndicators('taxonomy-modal-carousel', 'taxonomy-modal-carousel-indicators',
          ModalsContinuedAt.carouselInformation);
    } else {
      var stringToReturn = '';
      ModalsContinuedAt.getAllElements = element;
    }
    
    TaxonomyPages
        .firstPage(
            ModalsContinuedAt.getAllElements,
            function( page1Html ) {
              page1Html = page1Html || 'No Data.';
              
              if ( returnString ) {
                stringToReturn += '<div class="carousel-item table-responsive active"><table class="table table-striped table-sm">'
                    + page1Html + '</table></div>';
              } else {
                document.getElementById('taxonomy-modal-carousel-page-1').innerHTML = page1Html;
              }
              
              TaxonomyPages
                  .secondPage(
                      ModalsContinuedAt.getAllElements[0],
                      function( page2Html ) {
                        page2Html = page2Html || 'No Data.';
                        
                        if ( returnString ) {
                          stringToReturn += '<div class="carousel-item table-responsive"><table class="table table-striped table-sm">'
                              + page2Html + '</table></div>';
                        } else {
                          document.getElementById('taxonomy-modal-carousel-page-2').innerHTML = page2Html;
                        }
                        
                        TaxonomyPages
                            .thirdPage(
                                ModalsContinuedAt.getAllElements[0],
                                function( page3Html ) {
                                  page3Html = page3Html || 'No Data.';
                                  
                                  if ( returnString ) {
                                    stringToReturn += '<div class="carousel-item table-responsive"><table class="table table-striped table-sm">'
                                        + page3Html + '</table></div>';
                                  } else {
                                    document.getElementById('taxonomy-modal-carousel-page-3').innerHTML = page3Html;
                                  }
                                  
                                  TaxonomyPages
                                      .fourthPage(
                                          ModalsContinuedAt.getAllElements[0],
                                          function( page4Html ) {
                                            page4Html = page4Html || 'No Data.';
                                            
                                            if ( returnString ) {
                                              stringToReturn += '<div class="carousel-item table-responsive"><table class="table table-striped table-sm">'
                                                  + page4Html + '</table></div>';
                                            } else {
                                              document.getElementById('taxonomy-modal-carousel-page-4').innerHTML = page4Html;
                                            }
                                            
                                          });
                                });
                      });
            });
    return stringToReturn;
    
  }

};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var ModalsFormInformation = {
  
  carouselInformation : [ {
    'dialog-title' : 'Company and Document'
  }, {
    'dialog-title' : 'Tags'
  }, {
    'dialog-title' : 'Files'
  }, {
    'dialog-title' : 'Additional Items'
  } ],
  
  clickEvent : function( event, element ) {
    
    if ( event && event.keyCode && !(event.keyCode === 13 || event.keyCode === 32) ) {
      return;
    }
    
    Modals.close(event, element);
    
    document.getElementById('form-information-modal').classList.remove('d-none');
    
    document.getElementById('form-information-modal-drag').focus();
    
    // we add draggable
    Modals.initDrag(document.getElementById('form-information-modal-drag'));
    
    ModalsFormInformation.carouselData();
    
    document.getElementById('form-information-modal-title').innerText = ModalsFormInformation.carouselInformation[0]['dialog-title'];
    
    $('#form-information-modal-carousel').carousel(0);
    
    window.addEventListener('keyup', ModalsFormInformation.keyboardEvents);
    
    $('#form-information-modal-carousel')
        .on(
            'slide.bs.carousel',
            function( event ) {
              var previousActiveIndicator = event['from'];
              var newActiveIndicator = event['to'];
              document.getElementById('form-information-carousel-indicators').querySelector(
                  '[data-slide-to="' + previousActiveIndicator + '"]').classList.remove('active');
              document.getElementById('form-information-carousel-indicators').querySelector(
                  '[data-slide-to="' + newActiveIndicator + '"]').classList.add('active');
              document.getElementById('form-information-modal-title').innerText = ModalsFormInformation.carouselInformation[event['to']]['dialog-title'];
            });
  },
  
  keyboardEvents : function( event ) {
    
    var key = event.keyCode ? event.keyCode : event.which;
    
    if ( key === 49 || key === 97 ) {
      $('#form-information-modal-carousel').carousel(0);
      return false;
    }
    if ( key === 50 || key === 98 ) {
      $('#form-information-modal-carousel').carousel(1);
      return false;
    }
    if ( key === 51 || key === 99 ) {
      $('#form-information-modal-carousel').carousel(2);
      return false;
    }
    if ( key === 52 || key === 100 ) {
      $('#form-information-modal-carousel').carousel(3);
      return false;
    }
    if ( key === 37 ) {
      $('#form-information-modal-carousel').carousel('prev');
      return false;
    }
    if ( key === 39 ) {
      $('#form-information-modal-carousel').carousel('next');
      return false;
    }
    
  },
  
  carouselData : function( ) {
    
    Modals.renderCarouselIndicators('form-information-modal-carousel', 'form-information-carousel-indicators',
        ModalsFormInformation.carouselInformation);
    
    // we now render one slide at a time!
    ModalsFormInformation.firstSlide(function( slide1Html ) {
      
      slide1Html = slide1Html || 'No Data.';
      document.getElementById('form-information-modal-carousel-page-1').innerHTML = slide1Html;
      ModalsFormInformation.secondSlide(function( slide2Html ) {
        
        slide2Html = slide2Html || 'No Data.';
        document.getElementById('form-information-modal-carousel-page-2').innerHTML = slide2Html;
        ModalsFormInformation.thirdSlide(function( slide3Html ) {
          
          slide3Html = slide3Html || 'No Data.';
          document.getElementById('form-information-modal-carousel-page-3').innerHTML = slide3Html;
          
          ModalsFormInformation.fourthSlide(function( slide4Html ) {
            
            slide4Html = slide4Html || 'No Data.';
            document.getElementById('form-information-modal-carousel-page-4').innerHTML = slide4Html;
          });
        });
      });
      
    });
  },
  
  firstSlide : function( callback ) {
    var possibleLabels = [
        
        {
          'label' : 'Company Name',
          'value' : document.getElementById('dynamic-xbrl-form').querySelector('[name="dei:EntityRegistrantName"]') ? document
              .getElementById('dynamic-xbrl-form').querySelector('[name="dei:EntityRegistrantName"]').textContent
              : 'Not Available.'
        },
        {
          'label' : 'Central Index Key',
          'value' : document.getElementById('dynamic-xbrl-form').querySelector('[name="dei:EntityCentralIndexKey"]') ? document
              .getElementById('dynamic-xbrl-form').querySelector('[name="dei:EntityCentralIndexKey"]').textContent
              : 'Not Available.'
        },
        {
          'label' : 'Document Type',
          'value' : document.getElementById('dynamic-xbrl-form').querySelector('[name="dei:DocumentType"]') ? document
              .getElementById('dynamic-xbrl-form').querySelector('[name="dei:DocumentType"]').textContent
			  : 'Not Available.'
        },
        {
          'label' : 'Period End Date',
          'value' : document.getElementById('dynamic-xbrl-form').querySelector('[name="dei:DocumentPeriodEndDate"]') ? document
              .getElementById('dynamic-xbrl-form').querySelector('[name="dei:DocumentPeriodEndDate"]').textContent
              : 'Not Available.'
        },
        {
          'label' : 'Fiscal Year/Period Focus',
          'value' : (document.getElementById('dynamic-xbrl-form').querySelector('[name="dei:DocumentFiscalYearFocus"]') && document
              .getElementById('dynamic-xbrl-form').querySelector('[name="dei:DocumentFiscalPeriodFocus"]')) ? document
              .getElementById('dynamic-xbrl-form').querySelector('[name="dei:DocumentFiscalYearFocus"]').textContent
              + ' / '
              + document.getElementById('dynamic-xbrl-form').querySelector('[name="dei:DocumentFiscalPeriodFocus"]').textContent
              : 'Not Available.'
        },
        {
          'label' : 'Current Fiscal Year End',
          'value' : document.getElementById('dynamic-xbrl-form').querySelector('[name="dei:CurrentFiscalYearEndDate"]') ? document
              .getElementById('dynamic-xbrl-form').querySelector('[name="dei:CurrentFiscalYearEndDate"]').textContent
              : 'Not Available.'
        },
        {
          'label' : 'Amendment/Description',
          'value' : document.getElementById('dynamic-xbrl-form').querySelector('[name="dei:AmendmentFlag"]') ? document
              .getElementById('dynamic-xbrl-form').querySelector('[name="dei:AmendmentFlag"]').textContent
              : 'Not Available.'
        },
    ];
    
    var tableHtml = '';
    possibleLabels.forEach(function( current, index, array ) {
      if ( current['value'] ) {
        tableHtml += '<tr><th>' + current['label'] + '</th><td data-name="' + current['label'] + '">'
            + current['value'] + '</td></tr>';
      }
    });
    return callback(tableHtml);
    
  },
  
  secondSlide : function( callback ) {
    if ( Constants.getMetaEntityCounts ) {
      
      var primaryTotal = Constants.getMetaEntityCounts['keyStandard'] + Constants.getMetaEntityCounts['keyCustom'];
      
      var axisTotal = Constants.getMetaEntityCounts['axisStandard'] + Constants.getMetaEntityCounts['axisCustom'];
      
      var memberTotal = Constants.getMetaEntityCounts['memberStandard'] + Constants.getMetaEntityCounts['memberCustom'];
      
      var totalStandard = Constants.getMetaEntityCounts['keyStandard'] + Constants.getMetaEntityCounts['axisStandard']
          + Constants.getMetaEntityCounts['memberStandard'];
      
      var totalCustom = Constants.getMetaEntityCounts['keyCustom'] + Constants.getMetaEntityCounts['axisCustom']
          + Constants.getMetaEntityCounts['memberCustom'];
      
      var total = primaryTotal + axisTotal + memberTotal;
      
      var possibleLabels = [
          [ {
            'label' : 'Total Facts',
            'value' : Constants.getHtmlOverallTaxonomiesCount
          }, {
            'label' : 'Inline Version',
            'value' : Constants.getMetaVersion
          }, ],
          [ {
            'label' : 'Tags'
          }, {
            'label' : 'Standard'
          }, {
            'label' : 'Custom'
          }, {
            'label' : 'Total'
          }, ],
          
          [ {
            'label' : 'Primary',
            'values' : [
                Constants.getMetaEntityCounts['keyStandard'],
                
                (primaryTotal > 0) ? Math.round((Constants.getMetaEntityCounts['keyStandard'] / primaryTotal) * 100)
                    + '%' : '0%',
                
                Constants.getMetaEntityCounts['keyCustom'],
                
                (primaryTotal > 0) ? Math.round((Constants.getMetaEntityCounts['keyCustom'] / primaryTotal) * 100)
                    + '%' : '0%',
                
                primaryTotal ]
          } ],
          
          [ {
            'label' : 'Axis',
            'values' : [
                Constants.getMetaEntityCounts['axisStandard'],
                
                (axisTotal > 0) ? Math.round((Constants.getMetaEntityCounts['axisStandard'] / axisTotal) * 100) + '%'
                    : '0%',
                
                Constants.getMetaEntityCounts['axisCustom'],
                
                (axisTotal > 0) ? Math.round((Constants.getMetaEntityCounts['axisCustom'] / axisTotal) * 100) + '%'
                    : '0%',
                
                axisTotal ]
          } ],
          
          [ {
            'label' : 'Member',
            'values' : [
                Constants.getMetaEntityCounts['memberStandard'],
                
                (memberTotal > 0) ? Math.round((Constants.getMetaEntityCounts['memberStandard'] / memberTotal) * 100)
                    + '%' : '0%',
                
                Constants.getMetaEntityCounts['memberCustom'],
                
                (memberTotal > 0) ? Math.round((Constants.getMetaEntityCounts['memberCustom'] / memberTotal) * 100)
                    + '%' : '0%',
                
                memberTotal ]
          } ],
          
          [ {
            'label' : 'Total',
            'values' : [
                Constants.getMetaEntityCounts['keyStandard'] + Constants.getMetaEntityCounts['axisStandard']
                    + Constants.getMetaEntityCounts['memberStandard'],
                
                (totalStandard > 0) ? Math.round((totalStandard / total) * 100) + '%' : '0%',
                
                Constants.getMetaEntityCounts['keyCustom'] + Constants.getMetaEntityCounts['axisCustom']
                    + Constants.getMetaEntityCounts['memberCustom'],
                
                (totalStandard > 0) ? Math.round((totalCustom / total) * 100) + '%' : '0%',
                
                total ]
          } ],
      
      ];
      
      var tableHtml = '';
      possibleLabels.forEach(function( current, index, array ) {
        
        if ( current instanceof Array ) {
          tableHtml += '<tr colspan="8">';
          current.forEach(function( nestedCurrent, nestedIndex ) {
            if ( nestedCurrent['value'] ) {
              tableHtml += '<th colspan="2">' + nestedCurrent['label'] + '</th><td data-name="'
                  + nestedCurrent['label'] + '" colspan="2">' + nestedCurrent['value'] + '</td>';
            } else if ( nestedCurrent['values'] ) {
              tableHtml += '<th colspan="2">' + nestedCurrent['label'] + '</th>';
              
              nestedCurrent['values'].forEach(function( finalCurrent, finalIndex ) {
                tableHtml += '<td data-name="' + nestedCurrent['label'] + '-' + finalIndex + '"colspan="1">'
                    + finalCurrent + '</td>';
              });
            } else {
              
              tableHtml += '<th colspan="2">' + nestedCurrent['label'] + '</th>';
            }
          });
          tableHtml += '</tr>';
        } else {
          if ( current['value'] ) {
            tableHtml += '<tr><th colspan="1">' + current['label'] + '</th><td colspan="1">' + current['value']
                + '</td></tr>';
          }
        }
      });
      
      return callback(tableHtml);
      
    }
    return callback();
  },
  
  thirdSlide : function( callback ) {
    
    var nsPrefix = (Constants.getMetaCustomPrefix) ? Constants.getMetaCustomPrefix.toUpperCase() + ' ' : '';
    
    var possibleLabels = [
        {
          'label' : 'Inline Document',
          'values' : (Constants.getMetaDocuments('inline') && Constants.getMetaDocuments('inline')['local']) ? Constants
              .getMetaDocuments('inline')['local']
              : [ 'Not Available.' ]
        },
        {
          'label' : 'Custom Taxonomy',
          'values' : [ '' ]
        },
        {
          'label' : nsPrefix + 'Schema',
          'values' : (Constants.getMetaDocuments('schema') && Constants.getMetaDocuments('schema')['local']) ? Constants
              .getMetaDocuments('schema')['local']
              : [ 'Not Available.' ]
        },
        {
          'label' : nsPrefix + 'Label',
          'values' : (Constants.getMetaDocuments('labelLink') && Constants.getMetaDocuments('labelLink')['local']) ? Constants
              .getMetaDocuments('labelLink')['local']
              : [ 'Not Available.' ]
        },
        {
          'label' : nsPrefix + 'Calculation',
          'values' : (Constants.getMetaDocuments('calculationLink') && Constants.getMetaDocuments('calculationLink')['local']) ? Constants
              .getMetaDocuments('calculationLink')['local']
              : [ 'Not Available.' ]
        },
        {
          'label' : nsPrefix + 'Presentation',
          'values' : (Constants.getMetaDocuments('presentationLink') && Constants.getMetaDocuments('presentationLink')['local']) ? Constants
              .getMetaDocuments('presentationLink')['local']
              : [ 'Not Available.' ]
        },
        {
          'label' : nsPrefix + 'Definition',
          'values' : (Constants.getMetaDocuments('definitionLink') && Constants.getMetaDocuments('definitionLink')['local']) ? Constants
              .getMetaDocuments('definitionLink')['local']
              : [ 'Not Available.' ]
        
        },
    ];
    
    var tableHtml = '';
    possibleLabels.forEach(function( current, index, array ) {
      if ( current['values'] ) {
        tableHtml += '<tr><th>' + current['label'] + '</th>';
        
        current['values'].forEach(function( nestedCurrent, nestedIndex ) {
          if ( nestedIndex === 0 ) {
            tableHtml += '<td data-name="' + current['label'] + '-' + nestedIndex + '">' + nestedCurrent + '</td>';
          } else {
            tableHtml += '<tr><td></td><td data-name="' + current['label'] + '-' + nestedIndex + '">' + nestedCurrent
                + '</td></tr>';
          }
          
        });
        tableHtml += '</tr>';
      } else {
        tableHtml += '<tr><th>' + current['label'] + '</th></tr>';
      }
    });
    return callback(tableHtml);
    
  },
  
  fourthSlide : function( callback ) {
    
    if ( Constants.getMetaHidden ) {
      var possibleLabels = [ {
        'label' : 'Taxonomy',
        'value' : 'Count',
        'bold' : true
      } ];
      
      Object.keys(Constants.getMetaHidden).forEach(function( current ) {
        var temp = {
          'label' : (current === 'total') ? 'Total' : current,
          'value' : Constants.getMetaHidden[current]
        };
        possibleLabels.push(temp);
      });
      var tableHtml = '';
      possibleLabels.forEach(function( current, index, array ) {
        if ( current['bold'] ) {
          tableHtml += '<tr><th>' + current['label'] + '</th><th>' + current['value'] + '</th></tr>';
          
        } else if ( current['value'] ) {
          tableHtml += '<tr><th data-name="Additional Items Label-' + (index - 1) + '">' + current['label']
              + '</th><td data-name="Additional Items Value-' + (index - 1) + '">' + current['value'] + '</td></tr>';
        }
      });
      return callback(tableHtml);
    }
    return callback();
  }
};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var Modals = {
  
  renderCarouselIndicators : function( carouselId, indicatorId, carouselInformation ) {
    var indicatorHtml = '';
    
    carouselInformation.forEach(function( current, index ) {
      var activeSlide = (index === 0) ? 'active' : ''
      indicatorHtml += '<li data-target="#' + carouselId + '" data-slide-to="' + index + '" class="' + activeSlide
          + '" title="' + current['dialog-title'] + '" href="#" tabindex="14"></li>';
    });
    document.getElementById(indicatorId).innerHTML = indicatorHtml;
  },
  
  close : function( event, element ) {
    
    if ( event.keyCode && !(event.keyCode === 13 || event.keyCode === 32) ) {
      return;
    }
    
    document.getElementById('taxonomy-copy-paste').classList.add('d-none');
    
    window.removeEventListener('keyup', ModalsFormInformation.keyboardEvents);
    window.removeEventListener('keyup', ModalsCommon.keyboardEvents);
    
    // to simplify things, we are going to go through and close every
    // dialog.
    var foundDialogs = document.querySelectorAll('.dialog-box');
    
    var foundDialogsArray = Array.prototype.slice.call(foundDialogs);
    
    foundDialogsArray.forEach(function( current ) {
      
      current.classList.remove('expand-modal');
      document.getElementById('taxonomy-modal-expand').classList.remove('d-none');
      document.getElementById('taxonomy-modal-compress').classList.add('d-none');
      
      current.classList.add('d-none');
    });
    
    TaxonomiesGeneral.removeAllSelectedTaxonomy();
    
  },
  
  copyContent : function( event, element, elementIdToCopy, copyPasteElement ) {
    
    if ( event.keyCode && !(event.keyCode === 13 || event.keyCode === 32) ) {
      return;
    }
    
    if ( !document.getElementById(copyPasteElement).classList.contains('d-none') ) {
      document.getElementById(copyPasteElement).classList.add('d-none');
    } else {
      var sectionToPopulate = '#' + copyPasteElement;
      document.getElementById(copyPasteElement).classList.remove('d-none');
      
      var foundCarouselPages = document.getElementById(elementIdToCopy).querySelectorAll(
          '.carousel-item > table > tbody > tr');
      var foundCarouselPagesArray = Array.prototype.slice.call(foundCarouselPages);
      // TODO should we just put all of the innerText automatically into the
      // users clipboard?
      
      // th elements are the keys
      // td elements are the values
      var textToCopy = '';
      
      foundCarouselPagesArray.forEach(function( current ) {
        if ( current.querySelector('th') && current.querySelector('th').innerText ) {
          textToCopy += current.querySelector('th').innerText.trim() + ' : ';
        }
        
        if ( current.querySelector('td') ) {
          
          if ( current.querySelector('td #collapse-modal') ) {
            var largeTaxonomySelector = current.querySelector('td #collapse-modal');
            
            textToCopy += '\n';
            textToCopy += largeTaxonomySelector.innerText.trim();
            textToCopy += '\n';
            
          } else if ( current.querySelector('td').innerText ) {
            textToCopy += current.querySelector('td').innerText;
            textToCopy += '\n';
          }
        }
      });
      document.querySelector(sectionToPopulate + ' textarea').innerHTML = textToCopy;
    }
  },
  
  closeCopy : function( input ) {
    document.getElementById(input).classList.add('d-none');
  },
  
  expandToggle : function( event, element, idToTarget, idToExpand, idToCompress ) {
    
    if ( event.keyCode && !(event.keyCode === 13 || event.keyCode === 32) ) {
      return;
    }
    idToTarget = idToTarget || 'taxonomy-modal';
    idToExpand = idToExpand || 'taxonomy-modal-expand';
    idToCompress = idToCompress || 'taxonomy-modal-compress';
    
    var modalElement = document.getElementById(idToTarget);
    modalElement.classList.toggle('expand-modal');
    if ( modalElement.classList.contains('expand-modal') ) {
      
      document.getElementById(idToExpand).classList.add('d-none');
      document.getElementById(idToCompress).classList.remove('d-none');
      document.getElementById('taxonomy-modal-drag').classList.add('d-none');
      document.getElementById(idToCompress).focus();
      
    } else {
      
      document.getElementById(idToExpand).classList.remove('d-none');
      document.getElementById(idToCompress).classList.add('d-none');
      document.getElementById('taxonomy-modal-drag').classList.remove('d-none');
      document.getElementById(idToExpand).focus();
    }
  },
  
  initDrag : function( element ) {
    
    var selected = null;
    var xPosition = 0;
    var yPosition = 0;
    var xElement = 0;
    var yElement = 0;
    
    document.onmousemove = dragElement;
    document.onmouseup = destroyDrag;
    
    element.onmousedown = function( ) {
      // not a fan of having all these .parentNode
      drag(this.parentNode.parentNode.parentNode);
      return false;
    };
    
    function drag( element ) {
      selected = element;
      xElement = (xPosition - selected.offsetLeft) + (selected.clientWidth / 2);
      yElement = (yPosition - selected.offsetTop) + (selected.clientHeight / 2);
    }
    
    // Will be called when user dragging an element
    function dragElement( event ) {
      xPosition = document.all ? window.event.clientX : event.pageX;
      yPosition = document.all ? window.event.clientY : event.pageY;
      if ( selected !== null ) {
        selected.style.left = ((xPosition - xElement) + selected.offsetWidth / 2) + 'px';
        selected.style.top = ((yPosition - yElement) + selected.offsetHeight / 2) + 'px';
      }
    }
    
    // Destroy the object when we are done
    function destroyDrag( ) {
      selected = null;
    }
    
  }

};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var ModalsNested = {
  
  carouselInformation : [ {
    'dialog-title' : 'Attributes'
  }, {
    'dialog-title' : 'Labels'
  }, {
    'dialog-title' : 'References'
  }, {
    'dialog-title' : 'Calculation'
  } ],
  
  getAllElementIDs : [ ],
  
  dynamicallyFindContinuedTaxonomies : function( element, elementsInArray ) {
    
    if ( element ) {
      elementsInArray.push(element);
    }
    if ( element && element.hasAttribute('continuedat') ) {
      var continuedElement = document.getElementById('dynamic-xbrl-form').querySelector(
          '[id="' + element.getAttribute('continuedat') + '"]');
      return ModalsNested.dynamicallyFindContinuedTaxonomies(continuedElement, elementsInArray);
      
    } else {
      return elementsInArray

    }
  },
  
  recursielyFindAllNestedTaxonomies : function( element, firstIteration ) {
    firstIteration = firstIteration || false;
    
    if ( firstIteration ) {
      
      if ( (element.hasAttribute('continued-taxonomy') && element.getAttribute('continued-taxonomy') === 'true')
          || (element.tagName.split(':')[1].toLowerCase() === 'continuation') ) {
        
        ModalsNested.recursielyFindAllNestedTaxonomies(TaxonomiesContinuedAt.findContinuedMainTaxonomy(element));
      }
    }
    
    var nestedTaxonomies = element.querySelectorAll('[contextref]');
    var nestedTaxonomiesArray = Array.prototype.slice.call(nestedTaxonomies);
    if ( nestedTaxonomiesArray.length ) {
      
      nestedTaxonomiesArray.forEach(function( current, index, array ) {
        ModalsNested.recursielyFindAllNestedTaxonomies(current);
      });
      
    } else {
      
      if ( element.hasAttribute('continued-main-taxonomy')
          && element.getAttribute('continued-main-taxonomy') === 'true' ) {
        // we are at the beginning of the continued fact
        
        if ( ModalsNested.getAllElementIDs.indexOf(element.getAttribute('id')) === -1 ) {
          // unique id, so we can add it to our big array of nested ids
          ModalsNested.getAllElementIDs.push(element.getAttribute('id'));
          
          var tempContinuedElements = ModalsNested.dynamicallyFindContinuedTaxonomies(element, [ ]);
          tempContinuedElements.shift(element);
          tempContinuedElements.forEach(function( current, index, array ) {
            ModalsNested.recursielyFindAllNestedTaxonomies(current);
          });
          
        }
        
      } else if ( element.hasAttribute('continued-taxonomy') && element.getAttribute('continued-taxonomy') === 'true'
          || (element.tagName.split(':')[1].toLowerCase() === 'continuation') ) {
        // we ignore the continued facts, as they are already accounted for
      } else {
        
        if ( ModalsNested.getAllElementIDs.indexOf(element.getAttribute('id')) === -1 ) {
          ModalsNested.getAllElementIDs.push(element.getAttribute('id'));
        }
        
      }
      
    }
  },
  
  getElementById : function( id ) {
    var element = document.getElementById('dynamic-xbrl-form').querySelector('[id="' + id + '"]');
    if ( element.hasAttribute('continued-main-taxonomy') && element.getAttribute('continued-main-taxonomy') === 'true' ) {
      return ModalsNested.dynamicallyFindContinuedTaxonomies(element, [ ]);
    } else {
      return element;
    }
    
  },
  
  createLabelCarousel : function( ) {
    var titleCarousel = '';
    var contents = '';
    
    document.getElementById('nested-page').innerText = 1;
    document.getElementById('nested-count').innerText = ModalsNested.getAllElementIDs.length;
    
    ModalsNested.getAllElementIDs
        .forEach(function( current, index ) {
          var element = ModalsNested.getElementById(current);
          
          if ( element instanceof Array ) {
            var nestedTaxonomyName = FiltersName.getLabel(element[0].getAttribute([ 'name' ]));
            
            titleCarousel += '<div class="carousel-item"><div class="carousel-content"><p class="text-center font-weight-bold">'
                + nestedTaxonomyName + '</p></div></div>';
            
            contents += '<div class="tab-pane fade" id="nested-taxonomy-' + index + '" role="tabpanel">'
                + ModalsNested.createCarousel(element, index, true) + '</div>';
            
          } else {
            var nestedTaxonomyName = FiltersName.getLabel(element.getAttribute([ 'name' ]));
            
            titleCarousel += '<div class="carousel-item"><div class="carousel-content"><p class="text-center font-weight-bold">'
                + nestedTaxonomyName + '</p></div></div>';
            
            contents += '<div class="tab-pane fade" id="nested-taxonomy-' + index + '" role="tabpanel">'
                + ModalsNested.createCarousel(element, index, false) + '</div>';
          }
        });
    
    document.getElementById('modal-taxonomy-nested-label-carousel').innerHTML += titleCarousel;
    
    document.getElementById('modal-taxonomy-nested-label-carousel').querySelector('.carousel-item').classList
        .add('active');
    
  },
  
  createContentCarousel : function( index ) {
    
    var element = ModalsNested.getElementById((ModalsNested.getAllElementIDs[index]));
    
    ModalsNested.carouselData(element, Taxonomies.isElementContinued(element));
  },
  
  clickEvent : function( event, element ) {
    event.preventDefault();
    event.stopPropagation();
    
    Modals.close(event, element);
    
    ModalsNested.getAllElementIDs = [ ];
    
    document.getElementById('taxonomy-nested-modal').classList.remove('d-none');
    
    document.getElementById('modal-taxonomy-nested-label-carousel').innerHTML = '';
    
    ModalsNested.recursielyFindAllNestedTaxonomies(element, true);
    
    ModalsNested.createLabelCarousel();
    
    ModalsNested.createContentCarousel(0);
    
    TaxonomiesGeneral.selectedTaxonomy(ModalsNested.getElementById(ModalsNested.getAllElementIDs[0]));
    
    document.getElementById('nested-taxonomy-modal-jump').setAttribute('data-id', ModalsNested.getAllElementIDs[0]);
    
    Modals.renderCarouselIndicators('modal-taxonomy-nested-content-carousel',
        'taxonomy-nested-modal-carousel-indicators', ModalsNested.carouselInformation);
    
    // we add draggable
    Modals.initDrag(document.getElementById('taxonomy-nested-modal-drag'));
    
    $('#modal-nested-fact-labels').on(
        'slide.bs.carousel',
        function( event ) {
          
          // we add something...
          document.getElementById('nested-taxonomy-modal-jump').setAttribute('data-id',
              ModalsNested.getAllElementIDs[event['to']]);
          
          // we hide the copy & paste area
          document.getElementById('taxonomy-nested-copy-paste').classList.add('d-none');
          
          var selectedElement = ModalsNested.getElementById(ModalsNested.getAllElementIDs[event['to']]);
          
          TaxonomiesGeneral.selectedTaxonomy(selectedElement);
          
          if ( selectedElement instanceof Array ) {
            selectedElement = selectedElement[0];
          }
          
          selectedElement.scrollIntoView({
            'block' : Constants.scrollPosition
          });
          
          $('#modal-taxonomy-nested-content-carousel').carousel(0);
          
          document.getElementById('nested-page').innerText = (event['to'] + 1);
          ModalsNested.createContentCarousel(event['to']);
        });
    
    $('#modal-taxonomy-nested-content-carousel').on(
        'slide.bs.carousel',
        function( event ) {
          
          var previousActiveIndicator = event['from'];
          var newActiveIndicator = event['to'];
          document.getElementById('taxonomy-nested-modal-carousel-indicators').querySelector(
              '[data-slide-to="' + previousActiveIndicator + '"]').classList.remove('active');
          document.getElementById('taxonomy-nested-modal-carousel-indicators').querySelector(
              '[data-slide-to="' + newActiveIndicator + '"]').classList.add('active');
        });
    
  },
  
  createCarousel : function( element, index, isContinued ) {
    
    if ( isContinued ) {
      return '<div id="taxonomy-nested-modal-carousel-' + index
          + '" class="carousel" data-interval="false" data-keyboard="true"><div class="carousel-inner">'
          + ModalsContinuedAt.carouselData(element, true) + '</div></div>';
    } else {
      return '<div id="taxonomy-nested-modal-carousel-' + index
          + '" class="carousel" data-interval="false" data-keyboard="true"><div class="carousel-inner">'
          + ModalsCommon.carouselData(element, false) + '</div></div>';
      
    }
  },
  
  keyboardEvents : function( event ) {
    
    var key = event.keyCode ? event.keyCode : event.which;
    
    if ( key === 49 || key === 97 ) {
      $('#taxonomy-modal-carousel').carousel(0);
      return false;
    }
    if ( key === 50 || key === 98 ) {
      $('#taxonomy-modal-carousel').carousel(1);
      return false;
    }
    if ( key === 51 || key === 99 ) {
      $('#taxonomy-modal-carousel').carousel(2);
      return false;
    }
    if ( key === 52 || key === 100 ) {
      $('#taxonomy-modal-carousel').carousel(3);
      return false;
    }
    if ( key === 37 ) {
      $('#taxonomy-modal-carousel').carousel('prev');
      return false;
    }
    if ( key === 39 ) {
      $('#taxonomy-modal-carousel').carousel('next');
      return false;
    }
    
  },
  
  carouselData : function( element, isContinued ) {
    
    TaxonomyPages.firstPage(element, function( page1Html ) {
      
      page1Html = page1Html || 'No Data.';
      document.getElementById('modal-taxonomy-nested-content-carousel-page-1').innerHTML = page1Html;
      TaxonomyPages.secondPage(element, function( page2Html ) {
        
        page2Html = page2Html || 'No Data.';
        document.getElementById('modal-taxonomy-nested-content-carousel-page-2').innerHTML = page2Html;
        
        TaxonomyPages.thirdPage(element, function( page3Html ) {
          
          page3Html = page3Html || 'No Data.';
          document.getElementById('modal-taxonomy-nested-content-carousel-page-3').innerHTML = page3Html;
          
          TaxonomyPages.fourthPage(element, function( page4Html ) {
            
            page4Html = page4Html || 'No Data.';
            document.getElementById('modal-taxonomy-nested-content-carousel-page-4').innerHTML = page4Html;
            
          });
        });
      });
    });
  },
  
  dynamicallyAddControls : function( ) {
    Modals.renderCarouselIndicators('modal-taxonomy-nested-content-carousel',
        'taxonomy-nested-modal-carousel-indicators', ModalsNested.carouselInformation);
    
  }
};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var ModalsSettings = {
  clickEvent : function( event, element ) {
    
    if ( event.keyCode && !(event.keyCode === 13 || event.keyCode === 32) ) {
      return;
    }
    Modals.close(event, element);
    
    document.getElementById('settings-modal').classList.remove('d-none');
    
    document.getElementById('settings-modal-drag').focus();
    // we add draggable
    Modals.initDrag(document.getElementById('settings-modal-drag'));
    
    // set correct selected value
    document.getElementById('scroll-position-select').value = Constants.scrollPosition;
  },
  
  scrollPosition : function( event, value ) {
    
    localStorage.setItem('scrollPosition', value);
    Constants.scrollPosition = value;
  },

};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var TaxonomyPages = {
  
  firstPage : function( element, callback ) {
    
    var factValue;
    if ( element.length ) {
      factValue = FiltersValue.getFormattedValueForContinuedAt(element, true);
      element = element[0];
      
    } else {
      
      factValue = FiltersValue.getFormattedValue(element, true);
      
    }
    var possibleLabels = [ {
      'label' : 'Tag',
      'value' : element.getAttribute('name')
    }, {
      'label' : 'Fact',
      'value' : factValue
    }, {
      'label' : 'Fact Language',
      'value' : FiltersOther.getLanguage(element.getAttribute('xml:lang'))
    }, {
      'label' : 'Period',
      'value' : FiltersContextref.getPeriod(element.getAttribute('contextref'))
    }, {
      'label' : 'Axis',
      'value' : FiltersContextref.getAxis(element.getAttribute('contextref'))
    }, {
      'label' : 'Member',
      'value' : FiltersContextref.getMember(element.getAttribute('contextref'))
    }, {
      'label' : 'Measure',
      'value' : FiltersUnitref.getMeasure(element.getAttribute('unitref'))
    }, {
      'label' : 'Scale',
      'value' : FiltersScale.getScale(element.getAttribute('scale'))
    }, {
      'label' : 'Decimals',
      'value' : FiltersCredit.getDecimals(element.getAttribute('decimals'))
    }, {
      'label' : 'Balance',
      'value' : FiltersCredit.getBalance(element)
    }, {
      'label' : 'Sign',
      'value' : FiltersSign.getSign(element.getAttribute('sign'), element['tagName'])
    }, {
      'label' : 'Type',
      'value' : FiltersName.getFormattedType(element.getAttribute('name'))
    }, {
      'label' : 'Format',
      'value' : FiltersFormat.getFormattedFormat(element.getAttribute('format'))
    }, {
      'label' : 'Footnote',
      'value' : FiltersOther.getFootnote(element.getAttribute('data-original-id'))
    } ];
    
    var tableHtml = '';
    possibleLabels.forEach(function( current, index, array ) {
      if ( current['value'] ) {
        if ( current['label'] === 'Fact' ) {
          
          tableHtml += '<tr><th>' + current['label'] + '</th><td><div>' + current['value'] + '</div></td></tr>';
          
        } else {
          
          tableHtml += '<tr><th>' + current['label'] + '</th><td><div class="w-100 word-break">' + current['value']
              + '</div></td></tr>';
        }
        
      }
    });
    return callback(tableHtml);
  },
  
  secondPage : function( element, callback ) {
    
    if ( element.length ) {
      element = element[0];
    }
    var allLabels = FiltersName.getAllLabelObject(element.getAttribute('name'));
    var possibleLabels = [ ];
    for ( var current in allLabels ) {
      
      var tempObject = {
        'label' : current,
        'value' : allLabels[current],
      };
      possibleLabels.push(tempObject);
    }
    var tableHtml = '';
    possibleLabels.forEach(function( current, index, array ) {
      if ( current['value'] ) {
        tableHtml += '<tr><th>' + current['label'] + '</th><td>' + current['value'] + '</td></tr>';
      }
    });
    return callback(tableHtml);
  },
  
  thirdPage : function( element, callback ) {
    
    if ( element.length ) {
      element = element[0];
    }
    
    var allAuthRefs = FiltersName.getAuthRefs(element.getAttribute('name'));
    var tableHtml = '';
    if ( allAuthRefs ) {
      allAuthRefs.forEach(function( current ) {
        var discoveredReference = ConstantsFunctions.getSingleMetaStandardReference(current);
        if ( discoveredReference[0] ) {
          
          var possibleLabels = [ {
            'label' : 'Name',
            'value' : discoveredReference[0]['Name']
          }, {
            'label' : 'Paragraph',
            'value' : discoveredReference[0]['Paragraph']
          }, {
            'label' : 'Publisher',
            'value' : discoveredReference[0]['Publisher']
          }, {
            'label' : 'Section',
            'value' : discoveredReference[0]['Section']
          }, {
            'label' : 'Sub Topic',
            'value' : discoveredReference[0]['SubTopic']
          }, {
            'label' : 'Sub Paragraph',
            'value' : discoveredReference[0]['Subparagraph']
          }, {
            'label' : 'Topic',
            'value' : discoveredReference[0]['Topic']
          }, {
            'label' : 'Subtopic',
            'value' : discoveredReference[0]['Subtopic']
          }, {
            'label' : 'URL <small>(Will Leave SEC Website)</small>',
            'type' : 'link',
            'value' : discoveredReference[0]['URI']
          }, ];
          
          possibleLabels.forEach(function( current, index, array ) {
            if ( current['type'] === 'link' && current['value'] ) {
              
              tableHtml += '<tr><th>' + current['label'] + '</th><td><a href="' + current['value']
                  + '" target="_blank">' + current['value'] + '</a></td></tr>';
            } else if ( current['value'] ) {
              
              tableHtml += '<tr><th>' + current['label'] + '</th><td>' + current['value'] + '</td></tr>';
            }
            if ( index === (possibleLabels.length - 1) ) {
              tableHtml += '<tr><td colspan="3" class="blank-table-row"></td></tr>';
            }
          });
        }
      });
    }
    return callback(tableHtml);
  },
  
  fourthPage : function( element, callback ) {
    
    if ( element.length ) {
      element = element[0];
    }
    
    var possibleLabels = FiltersName.getCalculationsForModal(element.getAttribute('name')) || [ ];
    
    possibleLabels.unshift({
      'label' : 'Balance',
      'value' : FiltersCredit.getBalance(element) || 'N/A'
    });
    
    var tableHtml = '';
    possibleLabels.forEach(function( current, index, array ) {
      if ( current['blank'] ) {
        tableHtml += '<tr><td colspan="3" class="blank-table-row"></td></tr>';
      }
      if ( current['value'] ) {
        tableHtml += '<tr><th>' + current['label'] + '</th><td>' + current['value'] + '</td></tr>';
      }
    });
    return callback(tableHtml);
  }

};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var Pagination = {
  init : function( paginaitonContent, selectorForPaginationControls, selectorForPaginationContent, modalAction ) {
    Pagination.reset();
    Pagination.getModalAction = modalAction;
    Pagination.getPaginationControlsSelector = selectorForPaginationControls;
    Pagination.getPaginationSelector = selectorForPaginationContent;
    Pagination.setArray(paginaitonContent);
    Pagination.getCurrentPage = 1;
    Pagination.getTotalPages = Math.ceil(Pagination.getArray.length / Constants.getPaginationPerPage);
    Pagination.getPaginationTemplate(Pagination.getCurrentPage);
    
    Pagination.setPageSelect();
    
  },
  
  reset : function( ) {
    Pagination.getModalAction = false;
    Pagination.setArray([ ]);
    Pagination.getPaginationControlsSelector = '';
    Pagination.getPaginationControlsSelector = '';
    Pagination.getPaginationSelector = '';
    Pagination.getCurrentPage = 1;
    Pagination.getTotalPages = 0;
  },
  
  getModalAction : false,
  
  getArray : [ ],
  
  setArray : function( input ) {
    Pagination.getArray = input;
  },
  
  getPaginationControlsSelector : '',
  
  getPaginationSelector : '',
  
  getCurrentPage : 1,
  
  getTotalPages : 0,
  
  getPaginationTemplate : function( currentPage ) {
    document.querySelector(Pagination.getPaginationControlsSelector).innerHTML = Pagination.getControlsTemplate();
    var listHtml = '';
    
    var beginAt = ((currentPage - 1) * Constants.getPaginationPerPage);
    var endAt = beginAt + Constants.getPaginationPerPage;
    
    document.querySelector(Pagination.getPaginationControlsSelector + ' .pagination-info').innerHTML = currentPage
        + ' of ' + Pagination.getTotalPages;
    
    var arrayForPage = Pagination.getArray.slice(beginAt, endAt);
    arrayForPage.forEach(function( current ) {
      listHtml += TaxonomiesGeneral.getTaxonomyListTemplate(current, Pagination.getModalAction);
    });
    document.querySelector(Pagination.getPaginationSelector).innerHTML = listHtml;
  },
  
  firstPage : function( ) {
    
    Pagination.getCurrentPage = 1;
    Pagination.getPaginationTemplate(Pagination.getCurrentPage);
  },
  
  lastPage : function( ) {
    
    Pagination.getCurrentPage = Pagination.getTotalPages;
    Pagination.getPaginationTemplate(Pagination.getCurrentPage);
  },
  
  previousPage : function( ) {
    
    Pagination.getCurrentPage = Pagination.getCurrentPage - 1;
    Pagination.getPaginationTemplate(Pagination.getCurrentPage);
  },
  
  nextPage : function( ) {
    
    Pagination.getCurrentPage = Pagination.getCurrentPage + 1;
    Pagination.getPaginationTemplate(Pagination.getCurrentPage);
  },
  
  previousTaxonomy : function( event, element, trueIfHighlightLast ) {
    
    var beginAt = ((Pagination.getCurrentPage - 1) * Constants.getPaginationPerPage);
    var endAt = beginAt + Constants.getPaginationPerPage;
    
    var currentTaxonomies = Pagination.getArray.slice(beginAt, endAt);
    
    var selectedTaxonomy = currentTaxonomies.map(function( current, index ) {
      
      var element = TaxonomiesGeneral.getMenuTaxonomyByDataID(current);
      if ( element && element.getAttribute('selected-taxonomy') === 'true' ) {
        return index;
      }
    }).filter(function( element ) {
      return element >= 0;
    });
    
    if ( selectedTaxonomy.length === 0 ) {
      if ( trueIfHighlightLast ) {
        
        var element = TaxonomiesGeneral.getMenuTaxonomyByDataID(currentTaxonomies[currentTaxonomies.length - 1]);
        TaxonomiesGeneral.goTo(event, element, true);
      } else {
        
        var element = TaxonomiesGeneral.getMenuTaxonomyByDataID(currentTaxonomies[0]);
        TaxonomiesGeneral.goTo(event, element, true);
      }
    } else {
      if ( (selectedTaxonomy[0] - 1) < 0 ) {
        if ( Pagination.getCurrentPage - 1 > 0 ) {
          Pagination.previousPage();
          Pagination.previousTaxonomy(event, element, true);
        }
      } else {
        
        var element = TaxonomiesGeneral.getMenuTaxonomyByDataID(currentTaxonomies[(selectedTaxonomy[0] - 1)]);
        TaxonomiesGeneral.goTo(event, element, true);
      }
    }
  },
  
  nextTaxonomy : function( event, element ) {
    var beginAt = ((Pagination.getCurrentPage - 1) * Constants.getPaginationPerPage);
    var endAt = beginAt + Constants.getPaginationPerPage;
    var currentTaxonomies = Pagination.getArray.slice(beginAt, endAt);
    var selectedTaxonomy = currentTaxonomies.map(function( current, index ) {
      
      var element = TaxonomiesGeneral.getMenuTaxonomyByDataID(current);
      if ( element && element.getAttribute('selected-taxonomy') === 'true' ) {
        
        return index;
      }
      
    }).filter(function( element ) {
      
      return element >= 0;
    });
    if ( selectedTaxonomy.length === 0 ) {
      
      var element = TaxonomiesGeneral.getMenuTaxonomyByDataID(currentTaxonomies[0]);
      TaxonomiesGeneral.goTo(event, element, true);
    } else {
      
      if ( (selectedTaxonomy[0] + 1) >= currentTaxonomies.length ) {
        
        if ( (Pagination.getCurrentPage - 1) !== (Pagination.getTotalPages - 1) ) {
          
          Pagination.nextPage();
          Pagination.nextTaxonomy(event, element);
        }
      } else {
        var element = TaxonomiesGeneral.getMenuTaxonomyByDataID(currentTaxonomies[selectedTaxonomy[0] + 1]);
        TaxonomiesGeneral.goTo(event, element, true);
      }
    }
  },
  
  getControlsTemplate : function( ) {
    
    var firstPage = (Pagination.getCurrentPage === 1) ? 'disabled' : '';
    var previousPage = (Pagination.getCurrentPage - 1 <= 0) ? 'disabled' : '';
    var nextPage = (Pagination.getCurrentPage + 1 > Pagination.getTotalPages) ? 'disabled' : '';
    var lastPage = (Pagination.getCurrentPage === Pagination.getTotalPages) ? 'disabled' : '';
    var template = '';
    
    Pagination.setPageSelect();
    
    template += '<div class="w-100 d-flex justify-content-between py-2 px-1">';
    
    template += '<div>';
    template += '<ul class="pagination pagination-sm mb-0">';
    
    template += '<li class="page-item">';
    template += '<a href="#" onclick="Pagination.previousTaxonomy(event, this);" class="page-link" onclick="Pagination.firstPage();" tabindex="13">';
    template += 'Prev';
    template += '</a>';
    template += '</li>';
    
    template += '<li class="page-item">';
    template += '<a href="#" data-test="next-taxonomy" onclick="Pagination.nextTaxonomy(event, this);" class="page-link" onclick="Pagination.firstPage();" tabindex="13">';
    template += 'Next';
    template += '</a>';
    template += '</li>';
    
    template += '</ul>';
    template += '</div>';
    template += '<div class="pagination-info"></div>';
    template += '<nav>';
    template += '<ul class="pagination pagination-sm mb-0">';
    template += '<li class="page-item ' + firstPage + '">';
    template += '<a href="#" class="page-link" onclick="Pagination.firstPage();" tabindex="13">';
    template += '<i class="fas fa-lg fa-angle-double-left"></i>';
    template += '</a>';
    template += '</li>';
    template += '<li class="page-item ' + previousPage + '">';
    template += '<a href="#" class="page-link" onclick="Pagination.previousPage();" tabindex="13">';
    template += '<i class="fas fa-lg fa-angle-left"></i>';
    template += '</a>';
    template += '</li>';
    template += '<li class="page-item ' + nextPage + '">';
    template += '<a href="#" class="page-link" onclick="Pagination.nextPage();" tabindex="13">';
    template += '<i class="fas fa-lg fa-angle-right"></i>';
    template += '</a>';
    template += '</li>';
    template += '<li class="page-item ' + lastPage + '">';
    template += '<a href="#" class="page-link" onclick="Pagination.lastPage();" tabindex="13">';
    template += '<i class="fas fa-lg fa-angle-double-right"></i>';
    template += '</a>';
    template += '</li>';
    template += '</ul>';
    template += '</nav>';
    template += '</div>';
    
    return template;
    
  },
  
  setPageSelect : function( ) {
    
    var pageSelectHTML = '<option value="null">Select a Page</option>';
    
    for ( var i = 0; i < Pagination.getTotalPages; i++ ) {
      if ( (i + 1) === Pagination.getCurrentPage ) {
        pageSelectHTML += '<option selected value="' + (i + 1) + '">Page ' + (i + 1) + '</option>';
        
      } else {
        pageSelectHTML += '<option value="' + (i + 1) + '">Page ' + (i + 1) + '</option>';
        
      }
    }
    document.getElementById('taxonomies-menu-page-select').innerHTML = pageSelectHTML;
  },
  
  goToPage : function( event, element ) {
    
    if ( element && element.value && !isNaN(element.value) ) {
      Pagination.getCurrentPage = parseInt(element.value);
      Pagination.getPaginationTemplate(Pagination.getCurrentPage);
    }
  },
  
  goToTaxonomy : function( event, element ) {
    
    if ( element && element.hasAttribute('data-id') ) {
      
      if ( MenusState.openMenu === 'taxonomies-menu' ) {
        
        Pagination.findTaxonomyAndGoTo(element.getAttribute('data-id'));
        
      } else {
        MenusState.toggle('taxonomies-menu', true, function( openMenu ) {
          if ( openMenu ) {
            document.getElementById('taxonomies-menu').addEventListener('transitionend', function( event ) {
              // our menu is now open
              // we populate the menu with associated data
              setTimeout(function( ) {
                TaxonomiesMenu.prepareForPagination();
                Pagination.findTaxonomyAndGoTo(element.getAttribute('data-id'));
              });
              
            }, {
              'once' : true
            });
          }
        });
      }
    }
  },
  
  findTaxonomyAndGoTo : function( elementID ) {
    var index = -1;
    for ( var i = 0; i < Pagination.getArray.length; i++ ) {
      if ( Pagination.getArray[i] === elementID ) {
        index = i;
        break;
      }
    }
    if ( index >= 0 ) {
      (index === 0) ? (index = 1) : (index = index);
      var pageToGoTo = Math.ceil(index / Constants.getPaginationPerPage);
      Pagination.getCurrentPage = pageToGoTo;
      Pagination.getPaginationTemplate(pageToGoTo);
      Pagination.scrollToSelectedTaxonomy(index);
    } else {
      ErrorsMinor.factNotActive();
    }
  },
  
  scrollToSelectedTaxonomy : function( index ) {
    var elementToScrollTo = document.getElementById('taxonomies-menu-list-pagination').querySelector(
        '[selected-taxonomy="true"]');
    if ( elementToScrollTo ) {
      elementToScrollTo.scrollIntoView({
        'block' : Constants.scrollPosition
      });
    }
  }

};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';
if ( !Array.from ) {
  Array.from = (function( ) {
    var toStr = Object.prototype.toString;
    var isCallable = function( fn ) {
      return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
    };
    var toInteger = function( value ) {
      var number = Number(value);
      if ( isNaN(number) ) {
        return 0;
      }
      if ( number === 0 || !isFinite(number) ) {
        return number;
      }
      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
    };
    var maxSafeInteger = Math.pow(2, 53) - 1;
    var toLength = function( value ) {
      var len = toInteger(value);
      return Math.min(Math.max(len, 0), maxSafeInteger);
    };
    
    // The length property of the from method is 1.
    return function from( arrayLike/* , mapFn, thisArg */) {
      // 1. Let C be the this value.
      var C = this;
      
      // 2. Let items be ToObject(arrayLike).
      var items = Object(arrayLike);
      
      // 3. ReturnIfAbrupt(items).
      if ( arrayLike == null ) {
        throw new TypeError('Array.from requires an array-like object - not null or undefined');
      }
      
      // 4. If mapfn is undefined, then let mapping be false.
      var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
      var T;
      if ( typeof mapFn !== 'undefined' ) {
        // 5. else
        // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
        if ( !isCallable(mapFn) ) {
          throw new TypeError('Array.from: when provided, the second argument must be a function');
        }
        
        // 5. b. If thisArg was supplied, let T be thisArg; else let T be
        // undefined.
        if ( arguments.length > 2 ) {
          T = arguments[2];
        }
      }
      
      // 10. Let lenValue be Get(items, "length").
      // 11. Let len be ToLength(lenValue).
      var len = toLength(items.length);
      
      // 13. If IsConstructor(C) is true, then
      // 13. a. Let A be the result of calling the [[Construct]] internal method
      // of C with an argument list containing the single item len.
      // 14. a. Else, Let A be ArrayCreate(len).
      var A = isCallable(C) ? Object(new C(len)) : new Array(len);
      
      // 16. Let k be 0.
      var k = 0;
      // 17. Repeat, while k < len… (also steps a - h)
      var kValue;
      while (k < len) {
        kValue = items[k];
        if ( mapFn ) {
          A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
        } else {
          A[k] = kValue;
        }
        k += 1;
      }
      // 18. Let putStatus be Put(A, "length", len, true).
      A.length = len;
      // 20. Return A.
      return A;
    };
  }());
}

if ( !Array.prototype.find ) {
  Object.defineProperty(Array.prototype, 'find', {
    value : function( predicate ) {
      // 1. Let O be ? ToObject(this value).
      if ( this == null ) {
        throw new TypeError('"this" is null or not defined');
      }
      
      var o = Object(this);
      
      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;
      
      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if ( typeof predicate !== 'function' ) {
        throw new TypeError('predicate must be a function');
      }
      
      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      var thisArg = arguments[1];
      
      // 5. Let k be 0.
      var k = 0;
      
      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O
        // »)).
        // d. If testResult is true, return kValue.
        var kValue = o[k];
        if ( predicate.call(thisArg, kValue, k, o) ) {
          return kValue;
        }
        // e. Increase k by 1.
        k++;
      }
      
      // 7. Return undefined.
      return undefined;
    },
    configurable : true,
    writable : true
  });
}

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

;(function (globalObject) {
  'use strict';

/*
 * bignumber.js v8.1.1 A JavaScript library for arbitrary-precision arithmetic.
 * https://github.com/MikeMcl/bignumber.js Copyright (c) 2019 Michael Mclaughlin
 * <M8ch88l@gmail.com> MIT Licensed.
 * 
 * BigNumber.prototype methods | BigNumber methods | absoluteValue abs | clone
 * comparedTo | config set decimalPlaces dp | DECIMAL_PLACES dividedBy div |
 * ROUNDING_MODE dividedToIntegerBy idiv | EXPONENTIAL_AT exponentiatedBy pow |
 * RANGE integerValue | CRYPTO isEqualTo eq | MODULO_MODE isFinite |
 * POW_PRECISION isGreaterThan gt | FORMAT isGreaterThanOrEqualTo gte | ALPHABET
 * isInteger | isBigNumber isLessThan lt | maximum max isLessThanOrEqualTo lte |
 * minimum min isNaN | random isNegative | sum isPositive | isZero | minus |
 * modulo mod | multipliedBy times | negated | plus | precision sd | shiftedBy |
 * squareRoot sqrt | toExponential | toFixed | toFormat | toFraction | toJSON |
 * toNumber | toPrecision | toString | valueOf |
 * 
 */


  var BigNumber,
    isNumeric = /^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i,
    hasSymbol = typeof Symbol == 'function' && typeof Symbol.iterator == 'symbol',

    mathceil = Math.ceil,
    mathfloor = Math.floor,

    bignumberError = '[BigNumber Error] ',
    tooManyDigits = bignumberError + 'Number primitive has more than 15 significant digits: ',

    BASE = 1e14,
    LOG_BASE = 14,
    MAX_SAFE_INTEGER = 0x1fffffffffffff,         // 2^53 - 1
    // MAX_INT32 = 0x7fffffff, // 2^31 - 1
    POWS_TEN = [1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13],
    SQRT_BASE = 1e7,

    // EDITABLE
    // The limit on the value of DECIMAL_PLACES, TO_EXP_NEG, TO_EXP_POS,
	// MIN_EXP, MAX_EXP, and
    // the arguments to toExponential, toFixed, toFormat, and toPrecision.
    MAX = 1E9;                                   // 0 to MAX_INT32


  /*
	 * Create and return a BigNumber constructor.
	 */
  function clone(configObject) {
    var div, convertBase, parseNumeric,
      P = BigNumber.prototype = { constructor: BigNumber, toString: null, valueOf: null },
      ONE = new BigNumber(1),


      // ----------------------------- EDITABLE CONFIG DEFAULTS
		// -------------------------------


      // The default values below must be integers within the inclusive ranges
		// stated.
      // The values can also be changed at run-time using BigNumber.set.

      // The maximum number of decimal places for operations involving
		// division.
      DECIMAL_PLACES = 20,                     // 0 to MAX

      // The rounding mode used when rounding to the above decimal places, and
		// when using
      // toExponential, toFixed, toFormat and toPrecision, and round (default
		// value).
      // UP 0 Away from zero.
      // DOWN 1 Towards zero.
      // CEIL 2 Towards +Infinity.
      // FLOOR 3 Towards -Infinity.
      // HALF_UP 4 Towards nearest neighbour. If equidistant, up.
      // HALF_DOWN 5 Towards nearest neighbour. If equidistant, down.
      // HALF_EVEN 6 Towards nearest neighbour. If equidistant, towards even
		// neighbour.
      // HALF_CEIL 7 Towards nearest neighbour. If equidistant, towards
		// +Infinity.
      // HALF_FLOOR 8 Towards nearest neighbour. If equidistant, towards
		// -Infinity.
      ROUNDING_MODE = 4,                       // 0 to 8

      // EXPONENTIAL_AT : [TO_EXP_NEG , TO_EXP_POS]

      // The exponent value at and beneath which toString returns exponential
		// notation.
      // Number type: -7
      TO_EXP_NEG = -7,                         // 0 to -MAX

      // The exponent value at and above which toString returns exponential
		// notation.
      // Number type: 21
      TO_EXP_POS = 21,                         // 0 to MAX

      // RANGE : [MIN_EXP, MAX_EXP]

      // The minimum exponent value, beneath which underflow to zero occurs.
      // Number type: -324 (5e-324)
      MIN_EXP = -1e7,                          // -1 to -MAX

      // The maximum exponent value, above which overflow to Infinity occurs.
      // Number type: 308 (1.7976931348623157e+308)
      // For MAX_EXP > 1e7, e.g. new BigNumber('1e100000000').plus(1) may be
		// slow.
      MAX_EXP = 1e7,                           // 1 to MAX

      // Whether to use cryptographically-secure random number generation, if
		// available.
      CRYPTO = false,                          // true or false

      // The modulo mode used when calculating the modulus: a mod n.
      // The quotient (q = a / n) is calculated according to the corresponding
		// rounding mode.
      // The remainder (r) is calculated as: r = a - n * q.
      //
      // UP 0 The remainder is positive if the dividend is negative, else is
		// negative.
      // DOWN 1 The remainder has the same sign as the dividend.
      // This modulo mode is commonly known as 'truncated division' and is
      // equivalent to (a % n) in JavaScript.
      // FLOOR 3 The remainder has the same sign as the divisor (Python %).
      // HALF_EVEN 6 This modulo mode implements the IEEE 754 remainder
		// function.
      // EUCLID 9 Euclidian division. q = sign(n) * floor(a / abs(n)).
      // The remainder is always positive.
      //
      // The truncated division, floored division, Euclidian division and IEEE
		// 754 remainder
      // modes are commonly used for the modulus operation.
      // Although the other rounding modes can also be used, they may not give
		// useful results.
      MODULO_MODE = 1,                         // 0 to 9

      // The maximum number of significant digits of the result of the
		// exponentiatedBy operation.
      // If POW_PRECISION is 0, there will be unlimited significant digits.
      POW_PRECISION = 0,                    // 0 to MAX

      // The format specification used by the BigNumber.prototype.toFormat
		// method.
      FORMAT = {
        prefix: '',
        groupSize: 3,
        secondaryGroupSize: 0,
        groupSeparator: ',',
        decimalSeparator: '.',
        fractionGroupSize: 0,
        fractionGroupSeparator: '\xA0',      // non-breaking space
        suffix: ''
      },

      // The alphabet used for base conversion. It must be at least 2
		// characters long, with no '+',
      // '-', '.', whitespace, or repeated character.
      // '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_'
      ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz';


    // ------------------------------------------------------------------------------------------


    // CONSTRUCTOR


    /*
	 * The BigNumber constructor and exported function. Create and return a new
	 * instance of a BigNumber object.
	 * 
	 * v {number|string|BigNumber} A numeric value. [b] {number} The base of v.
	 * Integer, 2 to ALPHABET.length inclusive.
	 */
    function BigNumber(v, b) {
      var alphabet, c, caseChanged, e, i, isNum, len, str,
        x = this;

      // Enable constructor call without `new`.
      if (!(x instanceof BigNumber)) return new BigNumber(v, b);

      if (b == null) {

        if (v && v._isBigNumber === true) {
          x.s = v.s;

          if (!v.c || v.e > MAX_EXP) {
            x.c = x.e = null;
          } else if (v.e < MIN_EXP) {
            x.c = [x.e = 0];
          } else {
            x.e = v.e;
            x.c = v.c.slice();
          }

          return;
        }

        if ((isNum = typeof v == 'number') && v * 0 == 0) {

          // Use `1 / n` to handle minus zero also.
          x.s = 1 / v < 0 ? (v = -v, -1) : 1;

          // Fast path for integers, where n < 2147483648 (2**31).
          if (v === ~~v) {
            for (e = 0, i = v; i >= 10; i /= 10, e++);

            if (e > MAX_EXP) {
              x.c = x.e = null;
            } else {
              x.e = e;
              x.c = [v];
            }

            return;
          }

          str = String(v);
        } else {

          if (!isNumeric.test(str = String(v))) return parseNumeric(x, str, isNum);

          x.s = str.charCodeAt(0) == 45 ? (str = str.slice(1), -1) : 1;
        }

        // Decimal point?
        if ((e = str.indexOf('.')) > -1) str = str.replace('.', '');

        // Exponential form?
        if ((i = str.search(/e/i)) > 0) {

          // Determine exponent.
          if (e < 0) e = i;
          e += +str.slice(i + 1);
          str = str.substring(0, i);
        } else if (e < 0) {

          // Integer.
          e = str.length;
        }

      } else {

        // '[BigNumber Error] Base {not a primitive number|not an integer|out of
		// range}: {b}'
        intCheck(b, 2, ALPHABET.length, 'Base');

        // Allow exponential notation to be used with base 10 argument, while
        // also rounding to DECIMAL_PLACES as with other bases.
        if (b == 10) {
          x = new BigNumber(v);
          return round(x, DECIMAL_PLACES + x.e + 1, ROUNDING_MODE);
        }

        str = String(v);

        if (isNum = typeof v == 'number') {

          // Avoid potential interpretation of Infinity and NaN as base 44+
			// values.
          if (v * 0 != 0) return parseNumeric(x, str, isNum, b);

          x.s = 1 / v < 0 ? (str = str.slice(1), -1) : 1;

          // '[BigNumber Error] Number primitive has more than 15 significant
			// digits: {n}'
          if (BigNumber.DEBUG && str.replace(/^0\.0*|\./, '').length > 15) {
            throw Error
             (tooManyDigits + v);
          }
        } else {
          x.s = str.charCodeAt(0) === 45 ? (str = str.slice(1), -1) : 1;
        }

        alphabet = ALPHABET.slice(0, b);
        e = i = 0;

        // Check that str is a valid base b number.
        // Don't use RegExp, so alphabet can contain special characters.
        for (len = str.length; i < len; i++) {
          if (alphabet.indexOf(c = str.charAt(i)) < 0) {
            if (c == '.') {

              // If '.' is not the first character and it has not be found
				// before.
              if (i > e) {
                e = len;
                continue;
              }
            } else if (!caseChanged) {

              // Allow e.g. hexadecimal 'FF' as well as 'ff'.
              if (str == str.toUpperCase() && (str = str.toLowerCase()) ||
                  str == str.toLowerCase() && (str = str.toUpperCase())) {
                caseChanged = true;
                i = -1;
                e = 0;
                continue;
              }
            }

            return parseNumeric(x, String(v), isNum, b);
          }
        }

        // Prevent later check for length on converted number.
        isNum = false;
        str = convertBase(str, b, 10, x.s);

        // Decimal point?
        if ((e = str.indexOf('.')) > -1) str = str.replace('.', '');
        else e = str.length;
      }

      // Determine leading zeros.
      for (i = 0; str.charCodeAt(i) === 48; i++);

      // Determine trailing zeros.
      for (len = str.length; str.charCodeAt(--len) === 48;);

      if (str = str.slice(i, ++len)) {
        len -= i;

        // '[BigNumber Error] Number primitive has more than 15 significant
		// digits: {n}'
        if (isNum && BigNumber.DEBUG &&
          len > 15 && (v > MAX_SAFE_INTEGER || v !== mathfloor(v))) {
            throw Error
             (tooManyDigits + (x.s * v));
        }

         // Overflow?
        if ((e = e - i - 1) > MAX_EXP) {

          // Infinity.
          x.c = x.e = null;

        // Underflow?
        } else if (e < MIN_EXP) {

          // Zero.
          x.c = [x.e = 0];
        } else {
          x.e = e;
          x.c = [];

          // Transform base

          // e is the base 10 exponent.
          // i is where to slice str to get the first element of the
			// coefficient array.
          i = (e + 1) % LOG_BASE;
          if (e < 0) i += LOG_BASE;  // i < 1

          if (i < len) {
            if (i) x.c.push(+str.slice(0, i));

            for (len -= LOG_BASE; i < len;) {
              x.c.push(+str.slice(i, i += LOG_BASE));
            }

            i = LOG_BASE - (str = str.slice(i)).length;
          } else {
            i -= len;
          }

          for (; i--; str += '0');
          x.c.push(+str);
        }
      } else {

        // Zero.
        x.c = [x.e = 0];
      }
    }


    // CONSTRUCTOR PROPERTIES


    BigNumber.clone = clone;

    BigNumber.ROUND_UP = 0;
    BigNumber.ROUND_DOWN = 1;
    BigNumber.ROUND_CEIL = 2;
    BigNumber.ROUND_FLOOR = 3;
    BigNumber.ROUND_HALF_UP = 4;
    BigNumber.ROUND_HALF_DOWN = 5;
    BigNumber.ROUND_HALF_EVEN = 6;
    BigNumber.ROUND_HALF_CEIL = 7;
    BigNumber.ROUND_HALF_FLOOR = 8;
    BigNumber.EUCLID = 9;


    /*
	 * Configure infrequently-changing library-wide settings.
	 * 
	 * Accept an object with the following optional properties (if the value of
	 * a property is a number, it must be an integer within the inclusive range
	 * stated):
	 * 
	 * DECIMAL_PLACES {number} 0 to MAX ROUNDING_MODE {number} 0 to 8
	 * EXPONENTIAL_AT {number|number[]} -MAX to MAX or [-MAX to 0, 0 to MAX]
	 * RANGE {number|number[]} -MAX to MAX (not zero) or [-MAX to -1, 1 to MAX]
	 * CRYPTO {boolean} true or false MODULO_MODE {number} 0 to 9 POW_PRECISION
	 * {number} 0 to MAX ALPHABET {string} A string of two or more unique
	 * characters which does not contain '.'. FORMAT {object} An object with
	 * some of the following properties: prefix {string} groupSize {number}
	 * secondaryGroupSize {number} groupSeparator {string} decimalSeparator
	 * {string} fractionGroupSize {number} fractionGroupSeparator {string}
	 * suffix {string}
	 * 
	 * (The values assigned to the above FORMAT object properties are not
	 * checked for validity.)
	 * 
	 * E.g. BigNumber.config({ DECIMAL_PLACES : 20, ROUNDING_MODE : 4 })
	 * 
	 * Ignore properties/parameters set to null or undefined, except for
	 * ALPHABET.
	 * 
	 * Return an object with the properties current values.
	 */
    BigNumber.config = BigNumber.set = function (obj) {
      var p, v;

      if (obj != null) {

        if (typeof obj == 'object') {

          // DECIMAL_PLACES {number} Integer, 0 to MAX inclusive.
          // '[BigNumber Error] DECIMAL_PLACES {not a primitive number|not an
			// integer|out of range}: {v}'
          if (obj.hasOwnProperty(p = 'DECIMAL_PLACES')) {
            v = obj[p];
            intCheck(v, 0, MAX, p);
            DECIMAL_PLACES = v;
          }

          // ROUNDING_MODE {number} Integer, 0 to 8 inclusive.
          // '[BigNumber Error] ROUNDING_MODE {not a primitive number|not an
			// integer|out of range}: {v}'
          if (obj.hasOwnProperty(p = 'ROUNDING_MODE')) {
            v = obj[p];
            intCheck(v, 0, 8, p);
            ROUNDING_MODE = v;
          }

          // EXPONENTIAL_AT {number|number[]}
          // Integer, -MAX to MAX inclusive or
          // [integer -MAX to 0 inclusive, 0 to MAX inclusive].
          // '[BigNumber Error] EXPONENTIAL_AT {not a primitive number|not an
			// integer|out of range}: {v}'
          if (obj.hasOwnProperty(p = 'EXPONENTIAL_AT')) {
            v = obj[p];
            if (v && v.pop) {
              intCheck(v[0], -MAX, 0, p);
              intCheck(v[1], 0, MAX, p);
              TO_EXP_NEG = v[0];
              TO_EXP_POS = v[1];
            } else {
              intCheck(v, -MAX, MAX, p);
              TO_EXP_NEG = -(TO_EXP_POS = v < 0 ? -v : v);
            }
          }

          // RANGE {number|number[]} Non-zero integer, -MAX to MAX inclusive
			// or
          // [integer -MAX to -1 inclusive, integer 1 to MAX inclusive].
          // '[BigNumber Error] RANGE {not a primitive number|not an
			// integer|out of range|cannot be zero}: {v}'
          if (obj.hasOwnProperty(p = 'RANGE')) {
            v = obj[p];
            if (v && v.pop) {
              intCheck(v[0], -MAX, -1, p);
              intCheck(v[1], 1, MAX, p);
              MIN_EXP = v[0];
              MAX_EXP = v[1];
            } else {
              intCheck(v, -MAX, MAX, p);
              if (v) {
                MIN_EXP = -(MAX_EXP = v < 0 ? -v : v);
              } else {
                throw Error
                 (bignumberError + p + ' cannot be zero: ' + v);
              }
            }
          }

          // CRYPTO {boolean} true or false.
          // '[BigNumber Error] CRYPTO not true or false: {v}'
          // '[BigNumber Error] crypto unavailable'
          if (obj.hasOwnProperty(p = 'CRYPTO')) {
            v = obj[p];
            if (v === !!v) {
              if (v) {
                if (typeof crypto != 'undefined' && crypto &&
                 (crypto.getRandomValues || crypto.randomBytes)) {
                  CRYPTO = v;
                } else {
                  CRYPTO = !v;
                  throw Error
                   (bignumberError + 'crypto unavailable');
                }
              } else {
                CRYPTO = v;
              }
            } else {
              throw Error
               (bignumberError + p + ' not true or false: ' + v);
            }
          }

          // MODULO_MODE {number} Integer, 0 to 9 inclusive.
          // '[BigNumber Error] MODULO_MODE {not a primitive number|not an
			// integer|out of range}: {v}'
          if (obj.hasOwnProperty(p = 'MODULO_MODE')) {
            v = obj[p];
            intCheck(v, 0, 9, p);
            MODULO_MODE = v;
          }

          // POW_PRECISION {number} Integer, 0 to MAX inclusive.
          // '[BigNumber Error] POW_PRECISION {not a primitive number|not an
			// integer|out of range}: {v}'
          if (obj.hasOwnProperty(p = 'POW_PRECISION')) {
            v = obj[p];
            intCheck(v, 0, MAX, p);
            POW_PRECISION = v;
          }

          // FORMAT {object}
          // '[BigNumber Error] FORMAT not an object: {v}'
          if (obj.hasOwnProperty(p = 'FORMAT')) {
            v = obj[p];
            if (typeof v == 'object') FORMAT = v;
            else throw Error
             (bignumberError + p + ' not an object: ' + v);
          }

          // ALPHABET {string}
          // '[BigNumber Error] ALPHABET invalid: {v}'
          if (obj.hasOwnProperty(p = 'ALPHABET')) {
            v = obj[p];

            // Disallow if only one character,
            // or if it contains '+', '-', '.', whitespace, or a repeated
			// character.
            if (typeof v == 'string' && !/^.$|[+-.\s]|(.).*\1/.test(v)) {
              ALPHABET = v;
            } else {
              throw Error
               (bignumberError + p + ' invalid: ' + v);
            }
          }

        } else {

          // '[BigNumber Error] Object expected: {v}'
          throw Error
           (bignumberError + 'Object expected: ' + obj);
        }
      }

      return {
        DECIMAL_PLACES: DECIMAL_PLACES,
        ROUNDING_MODE: ROUNDING_MODE,
        EXPONENTIAL_AT: [TO_EXP_NEG, TO_EXP_POS],
        RANGE: [MIN_EXP, MAX_EXP],
        CRYPTO: CRYPTO,
        MODULO_MODE: MODULO_MODE,
        POW_PRECISION: POW_PRECISION,
        FORMAT: FORMAT,
        ALPHABET: ALPHABET
      };
    };


    /*
	 * Return true if v is a BigNumber instance, otherwise return false.
	 * 
	 * If BigNumber.DEBUG is true, throw if a BigNumber instance is not
	 * well-formed.
	 * 
	 * v {any}
	 * 
	 * '[BigNumber Error] Invalid BigNumber: {v}'
	 */
    BigNumber.isBigNumber = function (v) {
      if (!v || v._isBigNumber !== true) return false;
      if (!BigNumber.DEBUG) return true;

      var i, n,
        c = v.c,
        e = v.e,
        s = v.s;

      out: if ({}.toString.call(c) == '[object Array]') {

        if ((s === 1 || s === -1) && e >= -MAX && e <= MAX && e === mathfloor(e)) {

          // If the first element is zero, the BigNumber value must be zero.
          if (c[0] === 0) {
            if (e === 0 && c.length === 1) return true;
            break out;
          }

          // Calculate number of digits that c[0] should have, based on the
			// exponent.
          i = (e + 1) % LOG_BASE;
          if (i < 1) i += LOG_BASE;

          // Calculate number of digits of c[0].
          // if (Math.ceil(Math.log(c[0] + 1) / Math.LN10) == i) {
          if (String(c[0]).length == i) {

            for (i = 0; i < c.length; i++) {
              n = c[i];
              if (n < 0 || n >= BASE || n !== mathfloor(n)) break out;
            }

            // Last element cannot be zero, unless it is the only element.
            if (n !== 0) return true;
          }
        }

      // Infinity/NaN
      } else if (c === null && e === null && (s === null || s === 1 || s === -1)) {
        return true;
      }

      throw Error
        (bignumberError + 'Invalid BigNumber: ' + v);
    };


    /*
	 * Return a new BigNumber whose value is the maximum of the arguments.
	 * 
	 * arguments {number|string|BigNumber}
	 */
    BigNumber.maximum = BigNumber.max = function () {
      return maxOrMin(arguments, P.lt);
    };


    /*
	 * Return a new BigNumber whose value is the minimum of the arguments.
	 * 
	 * arguments {number|string|BigNumber}
	 */
    BigNumber.minimum = BigNumber.min = function () {
      return maxOrMin(arguments, P.gt);
    };


    /*
	 * Return a new BigNumber with a random value equal to or greater than 0 and
	 * less than 1, and with dp, or DECIMAL_PLACES if dp is omitted, decimal
	 * places (or less if trailing zeros are produced).
	 * 
	 * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
	 * 
	 * '[BigNumber Error] Argument {not a primitive number|not an integer|out of
	 * range}: {dp}' '[BigNumber Error] crypto unavailable'
	 */
    BigNumber.random = (function () {
      var pow2_53 = 0x20000000000000;

      // Return a 53 bit integer n, where 0 <= n < 9007199254740992.
      // Check if Math.random() produces more than 32 bits of randomness.
      // If it does, assume at least 53 bits are produced, otherwise assume at
		// least 30 bits.
      // 0x40000000 is 2^30, 0x800000 is 2^23, 0x1fffff is 2^21 - 1.
      var random53bitInt = (Math.random() * pow2_53) & 0x1fffff
       ? function () { return mathfloor(Math.random() * pow2_53); }
       : function () { return ((Math.random() * 0x40000000 | 0) * 0x800000) +
         (Math.random() * 0x800000 | 0); };

      return function (dp) {
        var a, b, e, k, v,
          i = 0,
          c = [],
          rand = new BigNumber(ONE);

        if (dp == null) dp = DECIMAL_PLACES;
        else intCheck(dp, 0, MAX);

        k = mathceil(dp / LOG_BASE);

        if (CRYPTO) {

          // Browsers supporting crypto.getRandomValues.
          if (crypto.getRandomValues) {

            a = crypto.getRandomValues(new Uint32Array(k *= 2));

            for (; i < k;) {

              // 53 bits:
              // ((Math.pow(2, 32) - 1) * Math.pow(2, 21)).toString(2)
              // 11111 11111111 11111111 11111111 11100000 00000000 00000000
              // ((Math.pow(2, 32) - 1) >>> 11).toString(2)
              // 11111 11111111 11111111
              // 0x20000 is 2^21.
              v = a[i] * 0x20000 + (a[i + 1] >>> 11);

              // Rejection sampling:
              // 0 <= v < 9007199254740992
              // Probability that v >= 9e15, is
              // 7199254740992 / 9007199254740992 ~= 0.0008, i.e. 1 in 1251
              if (v >= 9e15) {
                b = crypto.getRandomValues(new Uint32Array(2));
                a[i] = b[0];
                a[i + 1] = b[1];
              } else {

                // 0 <= v <= 8999999999999999
                // 0 <= (v % 1e14) <= 99999999999999
                c.push(v % 1e14);
                i += 2;
              }
            }
            i = k / 2;

          // Node.js supporting crypto.randomBytes.
          } else if (crypto.randomBytes) {

            // buffer
            a = crypto.randomBytes(k *= 7);

            for (; i < k;) {

              // 0x1000000000000 is 2^48, 0x10000000000 is 2^40
              // 0x100000000 is 2^32, 0x1000000 is 2^24
              // 11111 11111111 11111111 11111111 11111111 11111111 11111111
              // 0 <= v < 9007199254740992
              v = ((a[i] & 31) * 0x1000000000000) + (a[i + 1] * 0x10000000000) +
                 (a[i + 2] * 0x100000000) + (a[i + 3] * 0x1000000) +
                 (a[i + 4] << 16) + (a[i + 5] << 8) + a[i + 6];

              if (v >= 9e15) {
                crypto.randomBytes(7).copy(a, i);
              } else {

                // 0 <= (v % 1e14) <= 99999999999999
                c.push(v % 1e14);
                i += 7;
              }
            }
            i = k / 7;
          } else {
            CRYPTO = false;
            throw Error
             (bignumberError + 'crypto unavailable');
          }
        }

        // Use Math.random.
        if (!CRYPTO) {

          for (; i < k;) {
            v = random53bitInt();
            if (v < 9e15) c[i++] = v % 1e14;
          }
        }

        k = c[--i];
        dp %= LOG_BASE;

        // Convert trailing digits to zeros according to dp.
        if (k && dp) {
          v = POWS_TEN[LOG_BASE - dp];
          c[i] = mathfloor(k / v) * v;
        }

        // Remove trailing elements which are zero.
        for (; c[i] === 0; c.pop(), i--);

        // Zero?
        if (i < 0) {
          c = [e = 0];
        } else {

          // Remove leading elements which are zero and adjust exponent
			// accordingly.
          for (e = -1 ; c[0] === 0; c.splice(0, 1), e -= LOG_BASE);

          // Count the digits of the first element of c to determine leading
			// zeros, and...
          for (i = 1, v = c[0]; v >= 10; v /= 10, i++);

          // adjust the exponent accordingly.
          if (i < LOG_BASE) e -= LOG_BASE - i;
        }

        rand.e = e;
        rand.c = c;
        return rand;
      };
    })();


    /*
	 * Return a BigNumber whose value is the sum of the arguments.
	 * 
	 * arguments {number|string|BigNumber}
	 */
    BigNumber.sum = function () {
      var i = 1,
        args = arguments,
        sum = new BigNumber(args[0]);
      for (; i < args.length;) sum = sum.plus(args[i++]);
      return sum;
    };


    // PRIVATE FUNCTIONS


    // Called by BigNumber and BigNumber.prototype.toString.
    convertBase = (function () {
      var decimal = '0123456789';

      /*
		 * Convert string of baseIn to an array of numbers of baseOut. Eg.
		 * toBaseOut('255', 10, 16) returns [15, 15]. Eg. toBaseOut('ff', 16,
		 * 10) returns [2, 5, 5].
		 */
      function toBaseOut(str, baseIn, baseOut, alphabet) {
        var j,
          arr = [0],
          arrL,
          i = 0,
          len = str.length;

        for (; i < len;) {
          for (arrL = arr.length; arrL--; arr[arrL] *= baseIn);

          arr[0] += alphabet.indexOf(str.charAt(i++));

          for (j = 0; j < arr.length; j++) {

            if (arr[j] > baseOut - 1) {
              if (arr[j + 1] == null) arr[j + 1] = 0;
              arr[j + 1] += arr[j] / baseOut | 0;
              arr[j] %= baseOut;
            }
          }
        }

        return arr.reverse();
      }

      // Convert a numeric string of baseIn to a numeric string of baseOut.
      // If the caller is toString, we are converting from base 10 to baseOut.
      // If the caller is BigNumber, we are converting from baseIn to base 10.
      return function (str, baseIn, baseOut, sign, callerIsToString) {
        var alphabet, d, e, k, r, x, xc, y,
          i = str.indexOf('.'),
          dp = DECIMAL_PLACES,
          rm = ROUNDING_MODE;

        // Non-integer.
        if (i >= 0) {
          k = POW_PRECISION;

          // Unlimited precision.
          POW_PRECISION = 0;
          str = str.replace('.', '');
          y = new BigNumber(baseIn);
          x = y.pow(str.length - i);
          POW_PRECISION = k;

          // Convert str as if an integer, then restore the fraction part by
			// dividing the
          // result by its base raised to a power.

          y.c = toBaseOut(toFixedPoint(coeffToString(x.c), x.e, '0'),
           10, baseOut, decimal);
          y.e = y.c.length;
        }

        // Convert the number as integer.

        xc = toBaseOut(str, baseIn, baseOut, callerIsToString
         ? (alphabet = ALPHABET, decimal)
         : (alphabet = decimal, ALPHABET));

        // xc now represents str as an integer and converted to baseOut. e is
		// the exponent.
        e = k = xc.length;

        // Remove trailing zeros.
        for (; xc[--k] == 0; xc.pop());

        // Zero?
        if (!xc[0]) return alphabet.charAt(0);

        // Does str represent an integer? If so, no need for the division.
        if (i < 0) {
          --e;
        } else {
          x.c = xc;
          x.e = e;

          // The sign is needed for correct rounding.
          x.s = sign;
          x = div(x, y, dp, rm, baseOut);
          xc = x.c;
          r = x.r;
          e = x.e;
        }

        // xc now represents str converted to baseOut.

        // THe index of the rounding digit.
        d = e + dp + 1;

        // The rounding digit: the digit to the right of the digit that may be
		// rounded up.
        i = xc[d];

        // Look at the rounding digits and mode to determine whether to round
		// up.

        k = baseOut / 2;
        r = r || d < 0 || xc[d + 1] != null;

        r = rm < 4 ? (i != null || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2))
              : i > k || i == k &&(rm == 4 || r || rm == 6 && xc[d - 1] & 1 ||
               rm == (x.s < 0 ? 8 : 7));

        // If the index of the rounding digit is not greater than zero, or xc
		// represents
        // zero, then the result of the base conversion is zero or, if rounding
		// up, a value
        // such as 0.00001.
        if (d < 1 || !xc[0]) {

          // 1^-dp or 0
          str = r ? toFixedPoint(alphabet.charAt(1), -dp, alphabet.charAt(0)) : alphabet.charAt(0);
        } else {

          // Truncate xc to the required number of decimal places.
          xc.length = d;

          // Round up?
          if (r) {

            // Rounding up may mean the previous digit has to be rounded up and
			// so on.
            for (--baseOut; ++xc[--d] > baseOut;) {
              xc[d] = 0;

              if (!d) {
                ++e;
                xc = [1].concat(xc);
              }
            }
          }

          // Determine trailing zeros.
          for (k = xc.length; !xc[--k];);

          // E.g. [4, 11, 15] becomes 4bf.
          for (i = 0, str = ''; i <= k; str += alphabet.charAt(xc[i++]));

          // Add leading zeros, decimal point and trailing zeros as required.
          str = toFixedPoint(str, e, alphabet.charAt(0));
        }

        // The caller will add the sign.
        return str;
      };
    })();


    // Perform division in the specified base. Called by div and convertBase.
    div = (function () {

      // Assume non-zero x and k.
      function multiply(x, k, base) {
        var m, temp, xlo, xhi,
          carry = 0,
          i = x.length,
          klo = k % SQRT_BASE,
          khi = k / SQRT_BASE | 0;

        for (x = x.slice(); i--;) {
          xlo = x[i] % SQRT_BASE;
          xhi = x[i] / SQRT_BASE | 0;
          m = khi * xlo + xhi * klo;
          temp = klo * xlo + ((m % SQRT_BASE) * SQRT_BASE) + carry;
          carry = (temp / base | 0) + (m / SQRT_BASE | 0) + khi * xhi;
          x[i] = temp % base;
        }

        if (carry) x = [carry].concat(x);

        return x;
      }

      function compare(a, b, aL, bL) {
        var i, cmp;

        if (aL != bL) {
          cmp = aL > bL ? 1 : -1;
        } else {

          for (i = cmp = 0; i < aL; i++) {

            if (a[i] != b[i]) {
              cmp = a[i] > b[i] ? 1 : -1;
              break;
            }
          }
        }

        return cmp;
      }

      function subtract(a, b, aL, base) {
        var i = 0;

        // Subtract b from a.
        for (; aL--;) {
          a[aL] -= i;
          i = a[aL] < b[aL] ? 1 : 0;
          a[aL] = i * base + a[aL] - b[aL];
        }

        // Remove leading zeros.
        for (; !a[0] && a.length > 1; a.splice(0, 1));
      }

      // x: dividend, y: divisor.
      return function (x, y, dp, rm, base) {
        var cmp, e, i, more, n, prod, prodL, q, qc, rem, remL, rem0, xi, xL, yc0,
          yL, yz,
          s = x.s == y.s ? 1 : -1,
          xc = x.c,
          yc = y.c;

        // Either NaN, Infinity or 0?
        if (!xc || !xc[0] || !yc || !yc[0]) {

          return new BigNumber(

           // Return NaN if either NaN, or both Infinity or 0.
           !x.s || !y.s || (xc ? yc && xc[0] == yc[0] : !yc) ? NaN :

            // Return ±0 if x is ±0 or y is ±Infinity, or return ±Infinity as y
			// is ±0.
            xc && xc[0] == 0 || !yc ? s * 0 : s / 0
         );
        }

        q = new BigNumber(s);
        qc = q.c = [];
        e = x.e - y.e;
        s = dp + e + 1;

        if (!base) {
          base = BASE;
          e = bitFloor(x.e / LOG_BASE) - bitFloor(y.e / LOG_BASE);
          s = s / LOG_BASE | 0;
        }

        // Result exponent may be one less then the current value of e.
        // The coefficients of the BigNumbers from convertBase may have trailing
		// zeros.
        for (i = 0; yc[i] == (xc[i] || 0); i++);

        if (yc[i] > (xc[i] || 0)) e--;

        if (s < 0) {
          qc.push(1);
          more = true;
        } else {
          xL = xc.length;
          yL = yc.length;
          i = 0;
          s += 2;

          // Normalise xc and yc so highest order digit of yc is >= base / 2.

          n = mathfloor(base / (yc[0] + 1));

          // Not necessary, but to handle odd bases where yc[0] == (base / 2)
			// - 1.
          // if (n > 1 || n++ == 1 && yc[0] < base / 2) {
          if (n > 1) {
            yc = multiply(yc, n, base);
            xc = multiply(xc, n, base);
            yL = yc.length;
            xL = xc.length;
          }

          xi = yL;
          rem = xc.slice(0, yL);
          remL = rem.length;

          // Add zeros to make remainder as long as divisor.
          for (; remL < yL; rem[remL++] = 0);
          yz = yc.slice();
          yz = [0].concat(yz);
          yc0 = yc[0];
          if (yc[1] >= base / 2) yc0++;
          // Not necessary, but to prevent trial digit n > base, when using
			// base 3.
          // else if (base == 3 && yc0 == 1) yc0 = 1 + 1e-15;

          do {
            n = 0;

            // Compare divisor and remainder.
            cmp = compare(yc, rem, yL, remL);

            // If divisor < remainder.
            if (cmp < 0) {

              // Calculate trial digit, n.

              rem0 = rem[0];
              if (yL != remL) rem0 = rem0 * base + (rem[1] || 0);

              // n is how many times the divisor goes into the current
				// remainder.
              n = mathfloor(rem0 / yc0);

              // Algorithm:
              // product = divisor multiplied by trial digit (n).
              // Compare product and remainder.
              // If product is greater than remainder:
              // Subtract divisor from product, decrement trial digit.
              // Subtract product from remainder.
              // If product was less than remainder at the last compare:
              // Compare new remainder and divisor.
              // If remainder is greater than divisor:
              // Subtract divisor from remainder, increment trial digit.

              if (n > 1) {

                // n may be > base only when base is 3.
                if (n >= base) n = base - 1;

                // product = divisor * trial digit.
                prod = multiply(yc, n, base);
                prodL = prod.length;
                remL = rem.length;

                // Compare product and remainder.
                // If product > remainder then trial digit n too high.
                // n is 1 too high about 5% of the time, and is not known to
				// have
                // ever been more than 1 too high.
                while (compare(prod, rem, prodL, remL) == 1) {
                  n--;

                  // Subtract divisor from product.
                  subtract(prod, yL < prodL ? yz : yc, prodL, base);
                  prodL = prod.length;
                  cmp = 1;
                }
              } else {

                // n is 0 or 1, cmp is -1.
                // If n is 0, there is no need to compare yc and rem again
				// below,
                // so change cmp to 1 to avoid it.
                // If n is 1, leave cmp as -1, so yc and rem are compared again.
                if (n == 0) {

                  // divisor < remainder, so n must be at least 1.
                  cmp = n = 1;
                }

                // product = divisor
                prod = yc.slice();
                prodL = prod.length;
              }

              if (prodL < remL) prod = [0].concat(prod);

              // Subtract product from remainder.
              subtract(rem, prod, remL, base);
              remL = rem.length;

               // If product was < remainder.
              if (cmp == -1) {

                // Compare divisor and new remainder.
                // If divisor < new remainder, subtract divisor from remainder.
                // Trial digit n too low.
                // n is 1 too low about 5% of the time, and very rarely 2 too
				// low.
                while (compare(yc, rem, yL, remL) < 1) {
                  n++;

                  // Subtract divisor from remainder.
                  subtract(rem, yL < remL ? yz : yc, remL, base);
                  remL = rem.length;
                }
              }
            } else if (cmp === 0) {
              n++;
              rem = [0];
            } // else cmp === 1 and n will be 0

            // Add the next digit, n, to the result array.
            qc[i++] = n;

            // Update the remainder.
            if (rem[0]) {
              rem[remL++] = xc[xi] || 0;
            } else {
              rem = [xc[xi]];
              remL = 1;
            }
          } while ((xi++ < xL || rem[0] != null) && s--);

          more = rem[0] != null;

          // Leading zero?
          if (!qc[0]) qc.splice(0, 1);
        }

        if (base == BASE) {

          // To calculate q.e, first get the number of digits of qc[0].
          for (i = 1, s = qc[0]; s >= 10; s /= 10, i++);

          round(q, dp + (q.e = i + e * LOG_BASE - 1) + 1, rm, more);

        // Caller is convertBase.
        } else {
          q.e = e;
          q.r = +more;
        }

        return q;
      };
    })();


    /*
	 * Return a string representing the value of BigNumber n in fixed-point or
	 * exponential notation rounded to the specified decimal places or
	 * significant digits.
	 * 
	 * n: a BigNumber. i: the index of the last digit required (i.e. the digit
	 * that may be rounded up). rm: the rounding mode. id: 1 (toExponential) or
	 * 2 (toPrecision).
	 */
    function format(n, i, rm, id) {
      var c0, e, ne, len, str;

      if (rm == null) rm = ROUNDING_MODE;
      else intCheck(rm, 0, 8);

      if (!n.c) return n.toString();

      c0 = n.c[0];
      ne = n.e;

      if (i == null) {
        str = coeffToString(n.c);
        str = id == 1 || id == 2 && (ne <= TO_EXP_NEG || ne >= TO_EXP_POS)
         ? toExponential(str, ne)
         : toFixedPoint(str, ne, '0');
      } else {
        n = round(new BigNumber(n), i, rm);

        // n.e may have changed if the value was rounded up.
        e = n.e;

        str = coeffToString(n.c);
        len = str.length;

        // toPrecision returns exponential notation if the number of significant
		// digits
        // specified is less than the number of digits necessary to represent
		// the integer
        // part of the value in fixed-point notation.

        // Exponential notation.
        if (id == 1 || id == 2 && (i <= e || e <= TO_EXP_NEG)) {

          // Append zeros?
          for (; len < i; str += '0', len++);
          str = toExponential(str, e);

        // Fixed-point notation.
        } else {
          i -= ne;
          str = toFixedPoint(str, e, '0');

          // Append zeros?
          if (e + 1 > len) {
            if (--i > 0) for (str += '.'; i--; str += '0');
          } else {
            i += e - len;
            if (i > 0) {
              if (e + 1 == len) str += '.';
              for (; i--; str += '0');
            }
          }
        }
      }

      return n.s < 0 && c0 ? '-' + str : str;
    }


    // Handle BigNumber.max and BigNumber.min.
    function maxOrMin(args, method) {
      var n,
        i = 1,
        m = new BigNumber(args[0]);

      for (; i < args.length; i++) {
        n = new BigNumber(args[i]);

        // If any number is NaN, return NaN.
        if (!n.s) {
          m = n;
          break;
        } else if (method.call(m, n)) {
          m = n;
        }
      }

      return m;
    }


    /*
	 * Strip trailing zeros, calculate base 10 exponent and check against
	 * MIN_EXP and MAX_EXP. Called by minus, plus and times.
	 */
    function normalise(n, c, e) {
      var i = 1,
        j = c.length;

       // Remove trailing zeros.
      for (; !c[--j]; c.pop());

      // Calculate the base 10 exponent. First get the number of digits of
		// c[0].
      for (j = c[0]; j >= 10; j /= 10, i++);

      // Overflow?
      if ((e = i + e * LOG_BASE - 1) > MAX_EXP) {

        // Infinity.
        n.c = n.e = null;

      // Underflow?
      } else if (e < MIN_EXP) {

        // Zero.
        n.c = [n.e = 0];
      } else {
        n.e = e;
        n.c = c;
      }

      return n;
    }


    // Handle values that fail the validity test in BigNumber.
    parseNumeric = (function () {
      var basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i,
        dotAfter = /^([^.]+)\.$/,
        dotBefore = /^\.([^.]+)$/,
        isInfinityOrNaN = /^-?(Infinity|NaN)$/,
        whitespaceOrPlus = /^\s*\+(?=[\w.])|^\s+|\s+$/g;

      return function (x, str, isNum, b) {
        var base,
          s = isNum ? str : str.replace(whitespaceOrPlus, '');

        // No exception on ±Infinity or NaN.
        if (isInfinityOrNaN.test(s)) {
          x.s = isNaN(s) ? null : s < 0 ? -1 : 1;
        } else {
          if (!isNum) {

            // basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i
            s = s.replace(basePrefix, function (m, p1, p2) {
              base = (p2 = p2.toLowerCase()) == 'x' ? 16 : p2 == 'b' ? 2 : 8;
              return !b || b == base ? p1 : m;
            });

            if (b) {
              base = b;

              // E.g. '1.' to '1', '.1' to '0.1'
              s = s.replace(dotAfter, '$1').replace(dotBefore, '0.$1');
            }

            if (str != s) return new BigNumber(s, base);
          }

          // '[BigNumber Error] Not a number: {n}'
          // '[BigNumber Error] Not a base {b} number: {n}'
          if (BigNumber.DEBUG) {
            throw Error
              (bignumberError + 'Not a' + (b ? ' base ' + b : '') + ' number: ' + str);
          }

          // NaN
          x.s = null;
        }

        x.c = x.e = null;
      }
    })();


    /*
	 * Round x to sd significant digits using rounding mode rm. Check for
	 * over/under-flow. If r is truthy, it is known that there are more digits
	 * after the rounding digit.
	 */
    function round(x, sd, rm, r) {
      var d, i, j, k, n, ni, rd,
        xc = x.c,
        pows10 = POWS_TEN;

      // if x is not Infinity or NaN...
      if (xc) {

        // rd is the rounding digit, i.e. the digit after the digit that may be
		// rounded up.
        // n is a base 1e14 number, the value of the element of array x.c
		// containing rd.
        // ni is the index of n within x.c.
        // d is the number of digits of n.
        // i is the index of rd within n including leading zeros.
        // j is the actual index of rd within n (if < 0, rd is a leading zero).
        out: {

          // Get the number of digits of the first element of xc.
          for (d = 1, k = xc[0]; k >= 10; k /= 10, d++);
          i = sd - d;

          // If the rounding digit is in the first element of xc...
          if (i < 0) {
            i += LOG_BASE;
            j = sd;
            n = xc[ni = 0];

            // Get the rounding digit at index j of n.
            rd = n / pows10[d - j - 1] % 10 | 0;
          } else {
            ni = mathceil((i + 1) / LOG_BASE);

            if (ni >= xc.length) {

              if (r) {

                // Needed by sqrt.
                for (; xc.length <= ni; xc.push(0));
                n = rd = 0;
                d = 1;
                i %= LOG_BASE;
                j = i - LOG_BASE + 1;
              } else {
                break out;
              }
            } else {
              n = k = xc[ni];

              // Get the number of digits of n.
              for (d = 1; k >= 10; k /= 10, d++);

              // Get the index of rd within n.
              i %= LOG_BASE;

              // Get the index of rd within n, adjusted for leading zeros.
              // The number of leading zeros of n is given by LOG_BASE - d.
              j = i - LOG_BASE + d;

              // Get the rounding digit at index j of n.
              rd = j < 0 ? 0 : n / pows10[d - j - 1] % 10 | 0;
            }
          }

          r = r || sd < 0 ||

          // Are there any non-zero digits after the rounding digit?
          // The expression n % pows10[d - j - 1] returns all digits of n to
			// the right
          // of the digit at j, e.g. if n is 908714 and j is 2, the expression
			// gives 714.
           xc[ni + 1] != null || (j < 0 ? n : n % pows10[d - j - 1]);

          r = rm < 4
           ? (rd || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2))
           : rd > 5 || rd == 5 && (rm == 4 || r || rm == 6 &&

            // Check whether the digit to the left of the rounding digit is odd.
            ((i > 0 ? j > 0 ? n / pows10[d - j] : 0 : xc[ni - 1]) % 10) & 1 ||
             rm == (x.s < 0 ? 8 : 7));

          if (sd < 1 || !xc[0]) {
            xc.length = 0;

            if (r) {

              // Convert sd to decimal places.
              sd -= x.e + 1;

              // 1, 0.1, 0.01, 0.001, 0.0001 etc.
              xc[0] = pows10[(LOG_BASE - sd % LOG_BASE) % LOG_BASE];
              x.e = -sd || 0;
            } else {

              // Zero.
              xc[0] = x.e = 0;
            }

            return x;
          }

          // Remove excess digits.
          if (i == 0) {
            xc.length = ni;
            k = 1;
            ni--;
          } else {
            xc.length = ni + 1;
            k = pows10[LOG_BASE - i];

            // E.g. 56700 becomes 56000 if 7 is the rounding digit.
            // j > 0 means i > number of leading zeros of n.
            xc[ni] = j > 0 ? mathfloor(n / pows10[d - j] % pows10[j]) * k : 0;
          }

          // Round up?
          if (r) {

            for (; ;) {

              // If the digit to be rounded up is in the first element of
				// xc...
              if (ni == 0) {

                // i will be the length of xc[0] before k is added.
                for (i = 1, j = xc[0]; j >= 10; j /= 10, i++);
                j = xc[0] += k;
                for (k = 1; j >= 10; j /= 10, k++);

                // if i != k the length has increased.
                if (i != k) {
                  x.e++;
                  if (xc[0] == BASE) xc[0] = 1;
                }

                break;
              } else {
                xc[ni] += k;
                if (xc[ni] != BASE) break;
                xc[ni--] = 0;
                k = 1;
              }
            }
          }

          // Remove trailing zeros.
          for (i = xc.length; xc[--i] === 0; xc.pop());
        }

        // Overflow? Infinity.
        if (x.e > MAX_EXP) {
          x.c = x.e = null;

        // Underflow? Zero.
        } else if (x.e < MIN_EXP) {
          x.c = [x.e = 0];
        }
      }

      return x;
    }


    function valueOf(n) {
      var str,
        e = n.e;

      if (e === null) return n.toString();

      str = coeffToString(n.c);

      str = e <= TO_EXP_NEG || e >= TO_EXP_POS
        ? toExponential(str, e)
        : toFixedPoint(str, e, '0');

      return n.s < 0 ? '-' + str : str;
    }


    // PROTOTYPE/INSTANCE METHODS


    /*
	 * Return a new BigNumber whose value is the absolute value of this
	 * BigNumber.
	 */
    P.absoluteValue = P.abs = function () {
      var x = new BigNumber(this);
      if (x.s < 0) x.s = 1;
      return x;
    };


    /*
	 * Return 1 if the value of this BigNumber is greater than the value of
	 * BigNumber(y, b), -1 if the value of this BigNumber is less than the value
	 * of BigNumber(y, b), 0 if they have the same value, or null if the value
	 * of either is NaN.
	 */
    P.comparedTo = function (y, b) {
      return compare(this, new BigNumber(y, b));
    };


    /*
	 * If dp is undefined or null or true or false, return the number of decimal
	 * places of the value of this BigNumber, or null if the value of this
	 * BigNumber is ±Infinity or NaN.
	 * 
	 * Otherwise, if dp is a number, return a new BigNumber whose value is the
	 * value of this BigNumber rounded to a maximum of dp decimal places using
	 * rounding mode rm, or ROUNDING_MODE if rm is omitted.
	 * 
	 * [dp] {number} Decimal places: integer, 0 to MAX inclusive. [rm] {number}
	 * Rounding mode. Integer, 0 to 8 inclusive.
	 * 
	 * '[BigNumber Error] Argument {not a primitive number|not an integer|out of
	 * range}: {dp|rm}'
	 */
    P.decimalPlaces = P.dp = function (dp, rm) {
      var c, n, v,
        x = this;

      if (dp != null) {
        intCheck(dp, 0, MAX);
        if (rm == null) rm = ROUNDING_MODE;
        else intCheck(rm, 0, 8);

        return round(new BigNumber(x), dp + x.e + 1, rm);
      }

      if (!(c = x.c)) return null;
      n = ((v = c.length - 1) - bitFloor(this.e / LOG_BASE)) * LOG_BASE;

      // Subtract the number of trailing zeros of the last number.
      if (v = c[v]) for (; v % 10 == 0; v /= 10, n--);
      if (n < 0) n = 0;

      return n;
    };


    /*
	 * n / 0 = I n / N = N n / I = 0 0 / n = 0 0 / 0 = N 0 / N = N 0 / I = 0 N /
	 * n = N N / 0 = N N / N = N N / I = N I / n = I I / 0 = I I / N = N I / I =
	 * N
	 * 
	 * Return a new BigNumber whose value is the value of this BigNumber divided
	 * by the value of BigNumber(y, b), rounded according to DECIMAL_PLACES and
	 * ROUNDING_MODE.
	 */
    P.dividedBy = P.div = function (y, b) {
      return div(this, new BigNumber(y, b), DECIMAL_PLACES, ROUNDING_MODE);
    };


    /*
	 * Return a new BigNumber whose value is the integer part of dividing the
	 * value of this BigNumber by the value of BigNumber(y, b).
	 */
    P.dividedToIntegerBy = P.idiv = function (y, b) {
      return div(this, new BigNumber(y, b), 0, 1);
    };


    /*
	 * Return a BigNumber whose value is the value of this BigNumber
	 * exponentiated by n.
	 * 
	 * If m is present, return the result modulo m. If n is negative round
	 * according to DECIMAL_PLACES and ROUNDING_MODE. If POW_PRECISION is
	 * non-zero and m is not present, round to POW_PRECISION using
	 * ROUNDING_MODE.
	 * 
	 * The modular power operation works efficiently when x, n, and m are
	 * integers, otherwise it is equivalent to calculating
	 * x.exponentiatedBy(n).modulo(m) with a POW_PRECISION of 0.
	 * 
	 * n {number|string|BigNumber} The exponent. An integer. [m]
	 * {number|string|BigNumber} The modulus.
	 * 
	 * '[BigNumber Error] Exponent not an integer: {n}'
	 */
    P.exponentiatedBy = P.pow = function (n, m) {
      var half, isModExp, i, k, more, nIsBig, nIsNeg, nIsOdd, y,
        x = this;

      n = new BigNumber(n);

      // Allow NaN and ±Infinity, but not other non-integers.
      if (n.c && !n.isInteger()) {
        throw Error
          (bignumberError + 'Exponent not an integer: ' + valueOf(n));
      }

      if (m != null) m = new BigNumber(m);

      // Exponent of MAX_SAFE_INTEGER is 15.
      nIsBig = n.e > 14;

      // If x is NaN, ±Infinity, ±0 or ±1, or n is ±Infinity, NaN or ±0.
      if (!x.c || !x.c[0] || x.c[0] == 1 && !x.e && x.c.length == 1 || !n.c || !n.c[0]) {

        // The sign of the result of pow when x is negative depends on the
		// evenness of n.
        // If +n overflows to ±Infinity, the evenness of n would be not be
		// known.
        y = new BigNumber(Math.pow(+valueOf(x), nIsBig ? 2 - isOdd(n) : +valueOf(n)));
        return m ? y.mod(m) : y;
      }

      nIsNeg = n.s < 0;

      if (m) {

        // x % m returns NaN if abs(m) is zero, or m is NaN.
        if (m.c ? !m.c[0] : !m.s) return new BigNumber(NaN);

        isModExp = !nIsNeg && x.isInteger() && m.isInteger();

        if (isModExp) x = x.mod(m);

      // Overflow to ±Infinity: >=2**1e10 or >=1.0000024**1e15.
      // Underflow to ±0: <=0.79**1e10 or <=0.9999975**1e15.
      } else if (n.e > 9 && (x.e > 0 || x.e < -1 || (x.e == 0
        // [1, 240000000]
        ? x.c[0] > 1 || nIsBig && x.c[1] >= 24e7
        // [80000000000000] [99999750000000]
        : x.c[0] < 8e13 || nIsBig && x.c[0] <= 9999975e7))) {

        // If x is negative and n is odd, k = -0, else k = 0.
        k = x.s < 0 && isOdd(n) ? -0 : 0;

        // If x >= 1, k = ±Infinity.
        if (x.e > -1) k = 1 / k;

        // If n is negative return ±0, else return ±Infinity.
        return new BigNumber(nIsNeg ? 1 / k : k);

      } else if (POW_PRECISION) {

        // Truncating each coefficient array to a length of k after each
		// multiplication
        // equates to truncating significant digits to POW_PRECISION + [28, 41],
        // i.e. there will be a minimum of 28 guard digits retained.
        k = mathceil(POW_PRECISION / LOG_BASE + 2);
      }

      if (nIsBig) {
        half = new BigNumber(0.5);
        if (nIsNeg) n.s = 1;
        nIsOdd = isOdd(n);
      } else {
        i = Math.abs(+valueOf(n));
        nIsOdd = i % 2;
      }

      y = new BigNumber(ONE);

      // Performs 54 loop iterations for n of 9007199254740991.
      for (; ;) {

        if (nIsOdd) {
          y = y.times(x);
          if (!y.c) break;

          if (k) {
            if (y.c.length > k) y.c.length = k;
          } else if (isModExp) {
            y = y.mod(m);    // y = y.minus(div(y, m, 0,
								// MODULO_MODE).times(m));
          }
        }

        if (i) {
          i = mathfloor(i / 2);
          if (i === 0) break;
          nIsOdd = i % 2;
        } else {
          n = n.times(half);
          round(n, n.e + 1, 1);

          if (n.e > 14) {
            nIsOdd = isOdd(n);
          } else {
            i = +valueOf(n);
            if (i === 0) break;
            nIsOdd = i % 2;
          }
        }

        x = x.times(x);

        if (k) {
          if (x.c && x.c.length > k) x.c.length = k;
        } else if (isModExp) {
          x = x.mod(m);    // x = x.minus(div(x, m, 0, MODULO_MODE).times(m));
        }
      }

      if (isModExp) return y;
      if (nIsNeg) y = ONE.div(y);

      return m ? y.mod(m) : k ? round(y, POW_PRECISION, ROUNDING_MODE, more) : y;
    };


    /*
	 * Return a new BigNumber whose value is the value of this BigNumber rounded
	 * to an integer using rounding mode rm, or ROUNDING_MODE if rm is omitted.
	 * 
	 * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
	 * 
	 * '[BigNumber Error] Argument {not a primitive number|not an integer|out of
	 * range}: {rm}'
	 */
    P.integerValue = function (rm) {
      var n = new BigNumber(this);
      if (rm == null) rm = ROUNDING_MODE;
      else intCheck(rm, 0, 8);
      return round(n, n.e + 1, rm);
    };


    /*
	 * Return true if the value of this BigNumber is equal to the value of
	 * BigNumber(y, b), otherwise return false.
	 */
    P.isEqualTo = P.eq = function (y, b) {
      return compare(this, new BigNumber(y, b)) === 0;
    };


    /*
	 * Return true if the value of this BigNumber is a finite number, otherwise
	 * return false.
	 */
    P.isFinite = function () {
      return !!this.c;
    };


    /*
	 * Return true if the value of this BigNumber is greater than the value of
	 * BigNumber(y, b), otherwise return false.
	 */
    P.isGreaterThan = P.gt = function (y, b) {
      return compare(this, new BigNumber(y, b)) > 0;
    };


    /*
	 * Return true if the value of this BigNumber is greater than or equal to
	 * the value of BigNumber(y, b), otherwise return false.
	 */
    P.isGreaterThanOrEqualTo = P.gte = function (y, b) {
      return (b = compare(this, new BigNumber(y, b))) === 1 || b === 0;

    };


    /*
	 * Return true if the value of this BigNumber is an integer, otherwise
	 * return false.
	 */
    P.isInteger = function () {
      return !!this.c && bitFloor(this.e / LOG_BASE) > this.c.length - 2;
    };


    /*
	 * Return true if the value of this BigNumber is less than the value of
	 * BigNumber(y, b), otherwise return false.
	 */
    P.isLessThan = P.lt = function (y, b) {
      return compare(this, new BigNumber(y, b)) < 0;
    };


    /*
	 * Return true if the value of this BigNumber is less than or equal to the
	 * value of BigNumber(y, b), otherwise return false.
	 */
    P.isLessThanOrEqualTo = P.lte = function (y, b) {
      return (b = compare(this, new BigNumber(y, b))) === -1 || b === 0;
    };


    /*
	 * Return true if the value of this BigNumber is NaN, otherwise return
	 * false.
	 */
    P.isNaN = function () {
      return !this.s;
    };


    /*
	 * Return true if the value of this BigNumber is negative, otherwise return
	 * false.
	 */
    P.isNegative = function () {
      return this.s < 0;
    };


    /*
	 * Return true if the value of this BigNumber is positive, otherwise return
	 * false.
	 */
    P.isPositive = function () {
      return this.s > 0;
    };


    /*
	 * Return true if the value of this BigNumber is 0 or -0, otherwise return
	 * false.
	 */
    P.isZero = function () {
      return !!this.c && this.c[0] == 0;
    };


    /*
	 * n - 0 = n n - N = N n - I = -I 0 - n = -n 0 - 0 = 0 0 - N = N 0 - I = -I
	 * N - n = N N - 0 = N N - N = N N - I = N I - n = I I - 0 = I I - N = N I -
	 * I = N
	 * 
	 * Return a new BigNumber whose value is the value of this BigNumber minus
	 * the value of BigNumber(y, b).
	 */
    P.minus = function (y, b) {
      var i, j, t, xLTy,
        x = this,
        a = x.s;

      y = new BigNumber(y, b);
      b = y.s;

      // Either NaN?
      if (!a || !b) return new BigNumber(NaN);

      // Signs differ?
      if (a != b) {
        y.s = -b;
        return x.plus(y);
      }

      var xe = x.e / LOG_BASE,
        ye = y.e / LOG_BASE,
        xc = x.c,
        yc = y.c;

      if (!xe || !ye) {

        // Either Infinity?
        if (!xc || !yc) return xc ? (y.s = -b, y) : new BigNumber(yc ? x : NaN);

        // Either zero?
        if (!xc[0] || !yc[0]) {

          // Return y if y is non-zero, x if x is non-zero, or zero if both
			// are zero.
          return yc[0] ? (y.s = -b, y) : new BigNumber(xc[0] ? x :

           // IEEE 754 (2008) 6.3: n - n = -0 when rounding to -Infinity
           ROUNDING_MODE == 3 ? -0 : 0);
        }
      }

      xe = bitFloor(xe);
      ye = bitFloor(ye);
      xc = xc.slice();

      // Determine which is the bigger number.
      if (a = xe - ye) {

        if (xLTy = a < 0) {
          a = -a;
          t = xc;
        } else {
          ye = xe;
          t = yc;
        }

        t.reverse();

        // Prepend zeros to equalise exponents.
        for (b = a; b--; t.push(0));
        t.reverse();
      } else {

        // Exponents equal. Check digit by digit.
        j = (xLTy = (a = xc.length) < (b = yc.length)) ? a : b;

        for (a = b = 0; b < j; b++) {

          if (xc[b] != yc[b]) {
            xLTy = xc[b] < yc[b];
            break;
          }
        }
      }

      // x < y? Point xc to the array of the bigger number.
      if (xLTy) t = xc, xc = yc, yc = t, y.s = -y.s;

      b = (j = yc.length) - (i = xc.length);

      // Append zeros to xc if shorter.
      // No need to add zeros to yc if shorter as subtract only needs to start
		// at yc.length.
      if (b > 0) for (; b--; xc[i++] = 0);
      b = BASE - 1;

      // Subtract yc from xc.
      for (; j > a;) {

        if (xc[--j] < yc[j]) {
          for (i = j; i && !xc[--i]; xc[i] = b);
          --xc[i];
          xc[j] += BASE;
        }

        xc[j] -= yc[j];
      }

      // Remove leading zeros and adjust exponent accordingly.
      for (; xc[0] == 0; xc.splice(0, 1), --ye);

      // Zero?
      if (!xc[0]) {

        // Following IEEE 754 (2008) 6.3,
        // n - n = +0 but n - n = -0 when rounding towards -Infinity.
        y.s = ROUNDING_MODE == 3 ? -1 : 1;
        y.c = [y.e = 0];
        return y;
      }

      // No need to check for Infinity as +x - +y != Infinity && -x - -y !=
		// Infinity
      // for finite x and y.
      return normalise(y, xc, ye);
    };


    /*
	 * n % 0 = N n % N = N n % I = n 0 % n = 0 -0 % n = -0 0 % 0 = N 0 % N = N 0 %
	 * I = 0 N % n = N N % 0 = N N % N = N N % I = N I % n = N I % 0 = N I % N =
	 * N I % I = N
	 * 
	 * Return a new BigNumber whose value is the value of this BigNumber modulo
	 * the value of BigNumber(y, b). The result depends on the value of
	 * MODULO_MODE.
	 */
    P.modulo = P.mod = function (y, b) {
      var q, s,
        x = this;

      y = new BigNumber(y, b);

      // Return NaN if x is Infinity or NaN, or y is NaN or zero.
      if (!x.c || !y.s || y.c && !y.c[0]) {
        return new BigNumber(NaN);

      // Return x if y is Infinity or x is zero.
      } else if (!y.c || x.c && !x.c[0]) {
        return new BigNumber(x);
      }

      if (MODULO_MODE == 9) {

        // Euclidian division: q = sign(y) * floor(x / abs(y))
        // r = x - qy where 0 <= r < abs(y)
        s = y.s;
        y.s = 1;
        q = div(x, y, 0, 3);
        y.s = s;
        q.s *= s;
      } else {
        q = div(x, y, 0, MODULO_MODE);
      }

      y = x.minus(q.times(y));

      // To match JavaScript %, ensure sign of zero is sign of dividend.
      if (!y.c[0] && MODULO_MODE == 1) y.s = x.s;

      return y;
    };


    /*
	 * n * 0 = 0 n * N = N n * I = I 0 * n = 0 0 * 0 = 0 0 * N = N 0 * I = N N *
	 * n = N N * 0 = N N * N = N N * I = N I * n = I I * 0 = N I * N = N I * I =
	 * I
	 * 
	 * Return a new BigNumber whose value is the value of this BigNumber
	 * multiplied by the value of BigNumber(y, b).
	 */
    P.multipliedBy = P.times = function (y, b) {
      var c, e, i, j, k, m, xcL, xlo, xhi, ycL, ylo, yhi, zc,
        base, sqrtBase,
        x = this,
        xc = x.c,
        yc = (y = new BigNumber(y, b)).c;

      // Either NaN, ±Infinity or ±0?
      if (!xc || !yc || !xc[0] || !yc[0]) {

        // Return NaN if either is NaN, or one is 0 and the other is Infinity.
        if (!x.s || !y.s || xc && !xc[0] && !yc || yc && !yc[0] && !xc) {
          y.c = y.e = y.s = null;
        } else {
          y.s *= x.s;

          // Return ±Infinity if either is ±Infinity.
          if (!xc || !yc) {
            y.c = y.e = null;

          // Return ±0 if either is ±0.
          } else {
            y.c = [0];
            y.e = 0;
          }
        }

        return y;
      }

      e = bitFloor(x.e / LOG_BASE) + bitFloor(y.e / LOG_BASE);
      y.s *= x.s;
      xcL = xc.length;
      ycL = yc.length;

      // Ensure xc points to longer array and xcL to its length.
      if (xcL < ycL) zc = xc, xc = yc, yc = zc, i = xcL, xcL = ycL, ycL = i;

      // Initialise the result array with zeros.
      for (i = xcL + ycL, zc = []; i--; zc.push(0));

      base = BASE;
      sqrtBase = SQRT_BASE;

      for (i = ycL; --i >= 0;) {
        c = 0;
        ylo = yc[i] % sqrtBase;
        yhi = yc[i] / sqrtBase | 0;

        for (k = xcL, j = i + k; j > i;) {
          xlo = xc[--k] % sqrtBase;
          xhi = xc[k] / sqrtBase | 0;
          m = yhi * xlo + xhi * ylo;
          xlo = ylo * xlo + ((m % sqrtBase) * sqrtBase) + zc[j] + c;
          c = (xlo / base | 0) + (m / sqrtBase | 0) + yhi * xhi;
          zc[j--] = xlo % base;
        }

        zc[j] = c;
      }

      if (c) {
        ++e;
      } else {
        zc.splice(0, 1);
      }

      return normalise(y, zc, e);
    };


    /*
	 * Return a new BigNumber whose value is the value of this BigNumber
	 * negated, i.e. multiplied by -1.
	 */
    P.negated = function () {
      var x = new BigNumber(this);
      x.s = -x.s || null;
      return x;
    };


    /*
	 * n + 0 = n n + N = N n + I = I 0 + n = n 0 + 0 = 0 0 + N = N 0 + I = I N +
	 * n = N N + 0 = N N + N = N N + I = N I + n = I I + 0 = I I + N = N I + I =
	 * I
	 * 
	 * Return a new BigNumber whose value is the value of this BigNumber plus
	 * the value of BigNumber(y, b).
	 */
    P.plus = function (y, b) {
      var t,
        x = this,
        a = x.s;

      y = new BigNumber(y, b);
      b = y.s;

      // Either NaN?
      if (!a || !b) return new BigNumber(NaN);

      // Signs differ?
       if (a != b) {
        y.s = -b;
        return x.minus(y);
      }

      var xe = x.e / LOG_BASE,
        ye = y.e / LOG_BASE,
        xc = x.c,
        yc = y.c;

      if (!xe || !ye) {

        // Return ±Infinity if either ±Infinity.
        if (!xc || !yc) return new BigNumber(a / 0);

        // Either zero?
        // Return y if y is non-zero, x if x is non-zero, or zero if both are
		// zero.
        if (!xc[0] || !yc[0]) return yc[0] ? y : new BigNumber(xc[0] ? x : a * 0);
      }

      xe = bitFloor(xe);
      ye = bitFloor(ye);
      xc = xc.slice();

      // Prepend zeros to equalise exponents. Faster to use reverse then do
		// unshifts.
      if (a = xe - ye) {
        if (a > 0) {
          ye = xe;
          t = yc;
        } else {
          a = -a;
          t = xc;
        }

        t.reverse();
        for (; a--; t.push(0));
        t.reverse();
      }

      a = xc.length;
      b = yc.length;

      // Point xc to the longer array, and b to the shorter length.
      if (a - b < 0) t = yc, yc = xc, xc = t, b = a;

      // Only start adding at yc.length - 1 as the further digits of xc can be
		// ignored.
      for (a = 0; b;) {
        a = (xc[--b] = xc[b] + yc[b] + a) / BASE | 0;
        xc[b] = BASE === xc[b] ? 0 : xc[b] % BASE;
      }

      if (a) {
        xc = [a].concat(xc);
        ++ye;
      }

      // No need to check for zero, as +x + +y != 0 && -x + -y != 0
      // ye = MAX_EXP + 1 possible
      return normalise(y, xc, ye);
    };


    /*
	 * If sd is undefined or null or true or false, return the number of
	 * significant digits of the value of this BigNumber, or null if the value
	 * of this BigNumber is ±Infinity or NaN. If sd is true include integer-part
	 * trailing zeros in the count.
	 * 
	 * Otherwise, if sd is a number, return a new BigNumber whose value is the
	 * value of this BigNumber rounded to a maximum of sd significant digits
	 * using rounding mode rm, or ROUNDING_MODE if rm is omitted.
	 * 
	 * sd {number|boolean} number: significant digits: integer, 1 to MAX
	 * inclusive. boolean: whether to count integer-part trailing zeros: true or
	 * false. [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
	 * 
	 * '[BigNumber Error] Argument {not a primitive number|not an integer|out of
	 * range}: {sd|rm}'
	 */
    P.precision = P.sd = function (sd, rm) {
      var c, n, v,
        x = this;

      if (sd != null && sd !== !!sd) {
        intCheck(sd, 1, MAX);
        if (rm == null) rm = ROUNDING_MODE;
        else intCheck(rm, 0, 8);

        return round(new BigNumber(x), sd, rm);
      }

      if (!(c = x.c)) return null;
      v = c.length - 1;
      n = v * LOG_BASE + 1;

      if (v = c[v]) {

        // Subtract the number of trailing zeros of the last element.
        for (; v % 10 == 0; v /= 10, n--);

        // Add the number of digits of the first element.
        for (v = c[0]; v >= 10; v /= 10, n++);
      }

      if (sd && x.e + 1 > n) n = x.e + 1;

      return n;
    };


    /*
	 * Return a new BigNumber whose value is the value of this BigNumber shifted
	 * by k places (powers of 10). Shift to the right if n > 0, and to the left
	 * if n < 0.
	 * 
	 * k {number} Integer, -MAX_SAFE_INTEGER to MAX_SAFE_INTEGER inclusive.
	 * 
	 * '[BigNumber Error] Argument {not a primitive number|not an integer|out of
	 * range}: {k}'
	 */
    P.shiftedBy = function (k) {
      intCheck(k, -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER);
      return this.times('1e' + k);
    };


    /*
	 * sqrt(-n) = N sqrt(N) = N sqrt(-I) = N sqrt(I) = I sqrt(0) = 0 sqrt(-0) =
	 * -0
	 * 
	 * Return a new BigNumber whose value is the square root of the value of
	 * this BigNumber, rounded according to DECIMAL_PLACES and ROUNDING_MODE.
	 */
    P.squareRoot = P.sqrt = function () {
      var m, n, r, rep, t,
        x = this,
        c = x.c,
        s = x.s,
        e = x.e,
        dp = DECIMAL_PLACES + 4,
        half = new BigNumber('0.5');

      // Negative/NaN/Infinity/zero?
      if (s !== 1 || !c || !c[0]) {
        return new BigNumber(!s || s < 0 && (!c || c[0]) ? NaN : c ? x : 1 / 0);
      }

      // Initial estimate.
      s = Math.sqrt(+valueOf(x));

      // Math.sqrt underflow/overflow?
      // Pass x to Math.sqrt as integer, then adjust the exponent of the
		// result.
      if (s == 0 || s == 1 / 0) {
        n = coeffToString(c);
        if ((n.length + e) % 2 == 0) n += '0';
        s = Math.sqrt(+n);
        e = bitFloor((e + 1) / 2) - (e < 0 || e % 2);

        if (s == 1 / 0) {
          n = '1e' + e;
        } else {
          n = s.toExponential();
          n = n.slice(0, n.indexOf('e') + 1) + e;
        }

        r = new BigNumber(n);
      } else {
        r = new BigNumber(s + '');
      }

      // Check for zero.
      // r could be zero if MIN_EXP is changed after the this value was
		// created.
      // This would cause a division by zero (x/t) and hence Infinity below,
		// which would cause
      // coeffToString to throw.
      if (r.c[0]) {
        e = r.e;
        s = e + dp;
        if (s < 3) s = 0;

        // Newton-Raphson iteration.
        for (; ;) {
          t = r;
          r = half.times(t.plus(div(x, t, dp, 1)));

          if (coeffToString(t.c).slice(0, s) === (n = coeffToString(r.c)).slice(0, s)) {

            // The exponent of r may here be one less than the final result
			// exponent,
            // e.g 0.0009999 (e-4) --> 0.001 (e-3), so adjust s so the rounding
			// digits
            // are indexed correctly.
            if (r.e < e) --s;
            n = n.slice(s - 3, s + 1);

            // The 4th rounding digit may be in error by -1 so if the 4 rounding
			// digits
            // are 9999 or 4999 (i.e. approaching a rounding boundary) continue
			// the
            // iteration.
            if (n == '9999' || !rep && n == '4999') {

              // On the first iteration only, check to see if rounding up
				// gives the
              // exact result as the nines may infinitely repeat.
              if (!rep) {
                round(t, t.e + DECIMAL_PLACES + 2, 0);

                if (t.times(t).eq(x)) {
                  r = t;
                  break;
                }
              }

              dp += 4;
              s += 4;
              rep = 1;
            } else {

              // If rounding digits are null, 0{0,4} or 50{0,3}, check for
				// exact
              // result. If not, then there are further digits and m will be
				// truthy.
              if (!+n || !+n.slice(1) && n.charAt(0) == '5') {

                // Truncate to the first rounding digit.
                round(r, r.e + DECIMAL_PLACES + 2, 1);
                m = !r.times(r).eq(x);
              }

              break;
            }
          }
        }
      }

      return round(r, r.e + DECIMAL_PLACES + 1, ROUNDING_MODE, m);
    };


    /*
	 * Return a string representing the value of this BigNumber in exponential
	 * notation and rounded using ROUNDING_MODE to dp fixed decimal places.
	 * 
	 * [dp] {number} Decimal places. Integer, 0 to MAX inclusive. [rm] {number}
	 * Rounding mode. Integer, 0 to 8 inclusive.
	 * 
	 * '[BigNumber Error] Argument {not a primitive number|not an integer|out of
	 * range}: {dp|rm}'
	 */
    P.toExponential = function (dp, rm) {
      if (dp != null) {
        intCheck(dp, 0, MAX);
        dp++;
      }
      return format(this, dp, rm, 1);
    };


    /*
	 * Return a string representing the value of this BigNumber in fixed-point
	 * notation rounding to dp fixed decimal places using rounding mode rm, or
	 * ROUNDING_MODE if rm is omitted.
	 * 
	 * Note: as with JavaScript's number type, (-0).toFixed(0) is '0', but e.g.
	 * (-0.00001).toFixed(0) is '-0'.
	 * 
	 * [dp] {number} Decimal places. Integer, 0 to MAX inclusive. [rm] {number}
	 * Rounding mode. Integer, 0 to 8 inclusive.
	 * 
	 * '[BigNumber Error] Argument {not a primitive number|not an integer|out of
	 * range}: {dp|rm}'
	 */
    P.toFixed = function (dp, rm) {
      if (dp != null) {
        intCheck(dp, 0, MAX);
        dp = dp + this.e + 1;
      }
      return format(this, dp, rm);
    };


    /*
	 * Return a string representing the value of this BigNumber in fixed-point
	 * notation rounded using rm or ROUNDING_MODE to dp decimal places, and
	 * formatted according to the properties of the format or FORMAT object (see
	 * BigNumber.set).
	 * 
	 * The formatting object may contain some or all of the properties shown
	 * below.
	 * 
	 * FORMAT = { prefix: '', groupSize: 3, secondaryGroupSize: 0,
	 * groupSeparator: ',', decimalSeparator: '.', fractionGroupSize: 0,
	 * fractionGroupSeparator: '\xA0', // non-breaking space suffix: '' };
	 * 
	 * [dp] {number} Decimal places. Integer, 0 to MAX inclusive. [rm] {number}
	 * Rounding mode. Integer, 0 to 8 inclusive. [format] {object} Formatting
	 * options. See FORMAT pbject above.
	 * 
	 * '[BigNumber Error] Argument {not a primitive number|not an integer|out of
	 * range}: {dp|rm}' '[BigNumber Error] Argument not an object: {format}'
	 */
    P.toFormat = function (dp, rm, format) {
      var str,
        x = this;

      if (format == null) {
        if (dp != null && rm && typeof rm == 'object') {
          format = rm;
          rm = null;
        } else if (dp && typeof dp == 'object') {
          format = dp;
          dp = rm = null;
        } else {
          format = FORMAT;
        }
      } else if (typeof format != 'object') {
        throw Error
          (bignumberError + 'Argument not an object: ' + format);
      }

      str = x.toFixed(dp, rm);

      if (x.c) {
        var i,
          arr = str.split('.'),
          g1 = +format.groupSize,
          g2 = +format.secondaryGroupSize,
          groupSeparator = format.groupSeparator || '',
          intPart = arr[0],
          fractionPart = arr[1],
          isNeg = x.s < 0,
          intDigits = isNeg ? intPart.slice(1) : intPart,
          len = intDigits.length;

        if (g2) i = g1, g1 = g2, g2 = i, len -= i;

        if (g1 > 0 && len > 0) {
          i = len % g1 || g1;
          intPart = intDigits.substr(0, i);
          for (; i < len; i += g1) intPart += groupSeparator + intDigits.substr(i, g1);
          if (g2 > 0) intPart += groupSeparator + intDigits.slice(i);
          if (isNeg) intPart = '-' + intPart;
        }

        str = fractionPart
         ? intPart + (format.decimalSeparator || '') + ((g2 = +format.fractionGroupSize)
          ? fractionPart.replace(new RegExp('\\d{' + g2 + '}\\B', 'g'),
           '$&' + (format.fractionGroupSeparator || ''))
          : fractionPart)
         : intPart;
      }

      return (format.prefix || '') + str + (format.suffix || '');
    };


    /*
	 * Return an array of two BigNumbers representing the value of this
	 * BigNumber as a simple fraction with an integer numerator and an integer
	 * denominator. The denominator will be a positive non-zero value less than
	 * or equal to the specified maximum denominator. If a maximum denominator
	 * is not specified, the denominator will be the lowest value necessary to
	 * represent the number exactly.
	 * 
	 * [md] {number|string|BigNumber} Integer >= 1, or Infinity. The maximum
	 * denominator.
	 * 
	 * '[BigNumber Error] Argument {not an integer|out of range} : {md}'
	 */
    P.toFraction = function (md) {
      var d, d0, d1, d2, e, exp, n, n0, n1, q, r, s,
        x = this,
        xc = x.c;

      if (md != null) {
        n = new BigNumber(md);

        // Throw if md is less than one or is not an integer, unless it is
		// Infinity.
        if (!n.isInteger() && (n.c || n.s !== 1) || n.lt(ONE)) {
          throw Error
            (bignumberError + 'Argument ' +
              (n.isInteger() ? 'out of range: ' : 'not an integer: ') + valueOf(n));
        }
      }

      if (!xc) return new BigNumber(x);

      d = new BigNumber(ONE);
      n1 = d0 = new BigNumber(ONE);
      d1 = n0 = new BigNumber(ONE);
      s = coeffToString(xc);

      // Determine initial denominator.
      // d is a power of 10 and the minimum max denominator that specifies the
		// value exactly.
      e = d.e = s.length - x.e - 1;
      d.c[0] = POWS_TEN[(exp = e % LOG_BASE) < 0 ? LOG_BASE + exp : exp];
      md = !md || n.comparedTo(d) > 0 ? (e > 0 ? d : n1) : n;

      exp = MAX_EXP;
      MAX_EXP = 1 / 0;
      n = new BigNumber(s);

      // n0 = d1 = 0
      n0.c[0] = 0;

      for (; ;)  {
        q = div(n, d, 0, 1);
        d2 = d0.plus(q.times(d1));
        if (d2.comparedTo(md) == 1) break;
        d0 = d1;
        d1 = d2;
        n1 = n0.plus(q.times(d2 = n1));
        n0 = d2;
        d = n.minus(q.times(d2 = d));
        n = d2;
      }

      d2 = div(md.minus(d0), d1, 0, 1);
      n0 = n0.plus(d2.times(n1));
      d0 = d0.plus(d2.times(d1));
      n0.s = n1.s = x.s;
      e = e * 2;

      // Determine which fraction is closer to x, n0/d0 or n1/d1
      r = div(n1, d1, e, ROUNDING_MODE).minus(x).abs().comparedTo(
          div(n0, d0, e, ROUNDING_MODE).minus(x).abs()) < 1 ? [n1, d1] : [n0, d0];

      MAX_EXP = exp;

      return r;
    };


    /*
	 * Return the value of this BigNumber converted to a number primitive.
	 */
    P.toNumber = function () {
      return +valueOf(this);
    };


    /*
	 * Return a string representing the value of this BigNumber rounded to sd
	 * significant digits using rounding mode rm or ROUNDING_MODE. If sd is less
	 * than the number of digits necessary to represent the integer part of the
	 * value in fixed-point notation, then use exponential notation.
	 * 
	 * [sd] {number} Significant digits. Integer, 1 to MAX inclusive. [rm]
	 * {number} Rounding mode. Integer, 0 to 8 inclusive.
	 * 
	 * '[BigNumber Error] Argument {not a primitive number|not an integer|out of
	 * range}: {sd|rm}'
	 */
    P.toPrecision = function (sd, rm) {
      if (sd != null) intCheck(sd, 1, MAX);
      return format(this, sd, rm, 2);
    };


    /*
	 * Return a string representing the value of this BigNumber in base b, or
	 * base 10 if b is omitted. If a base is specified, including base 10, round
	 * according to DECIMAL_PLACES and ROUNDING_MODE. If a base is not
	 * specified, and this BigNumber has a positive exponent that is equal to or
	 * greater than TO_EXP_POS, or a negative exponent equal to or less than
	 * TO_EXP_NEG, return exponential notation.
	 * 
	 * [b] {number} Integer, 2 to ALPHABET.length inclusive.
	 * 
	 * '[BigNumber Error] Base {not a primitive number|not an integer|out of
	 * range}: {b}'
	 */
    P.toString = function (b) {
      var str,
        n = this,
        s = n.s,
        e = n.e;

      // Infinity or NaN?
      if (e === null) {
        if (s) {
          str = 'Infinity';
          if (s < 0) str = '-' + str;
        } else {
          str = 'NaN';
        }
      } else {
        if (b == null) {
          str = e <= TO_EXP_NEG || e >= TO_EXP_POS
           ? toExponential(coeffToString(n.c), e)
           : toFixedPoint(coeffToString(n.c), e, '0');
        } else if (b === 10) {
          n = round(new BigNumber(n), DECIMAL_PLACES + e + 1, ROUNDING_MODE);
          str = toFixedPoint(coeffToString(n.c), n.e, '0');
        } else {
          intCheck(b, 2, ALPHABET.length, 'Base');
          str = convertBase(toFixedPoint(coeffToString(n.c), e, '0'), 10, b, s, true);
        }

        if (s < 0 && n.c[0]) str = '-' + str;
      }

      return str;
    };


    /*
	 * Return as toString, but do not accept a base argument, and include the
	 * minus sign for negative zero.
	 */
    P.valueOf = P.toJSON = function () {
      return valueOf(this);
    };


    P._isBigNumber = true;

    if (hasSymbol) {
      P[Symbol.toStringTag] = 'BigNumber';

      // Node.js v10.12.0+
      P[Symbol.for('nodejs.util.inspect.custom')] = P.valueOf;
    }

    if (configObject != null) BigNumber.set(configObject);

    return BigNumber;
  }


  // PRIVATE HELPER FUNCTIONS

  // These functions don't need access to variables,
  // e.g. DECIMAL_PLACES, in the scope of the `clone` function above.


  function bitFloor(n) {
    var i = n | 0;
    return n > 0 || n === i ? i : i - 1;
  }


  // Return a coefficient array as a string of base 10 digits.
  function coeffToString(a) {
    var s, z,
      i = 1,
      j = a.length,
      r = a[0] + '';

    for (; i < j;) {
      s = a[i++] + '';
      z = LOG_BASE - s.length;
      for (; z--; s = '0' + s);
      r += s;
    }

    // Determine trailing zeros.
    for (j = r.length; r.charCodeAt(--j) === 48;);

    return r.slice(0, j + 1 || 1);
  }


  // Compare the value of BigNumbers x and y.
  function compare(x, y) {
    var a, b,
      xc = x.c,
      yc = y.c,
      i = x.s,
      j = y.s,
      k = x.e,
      l = y.e;

    // Either NaN?
    if (!i || !j) return null;

    a = xc && !xc[0];
    b = yc && !yc[0];

    // Either zero?
    if (a || b) return a ? b ? 0 : -j : i;

    // Signs differ?
    if (i != j) return i;

    a = i < 0;
    b = k == l;

    // Either Infinity?
    if (!xc || !yc) return b ? 0 : !xc ^ a ? 1 : -1;

    // Compare exponents.
    if (!b) return k > l ^ a ? 1 : -1;

    j = (k = xc.length) < (l = yc.length) ? k : l;

    // Compare digit by digit.
    for (i = 0; i < j; i++) if (xc[i] != yc[i]) return xc[i] > yc[i] ^ a ? 1 : -1;

    // Compare lengths.
    return k == l ? 0 : k > l ^ a ? 1 : -1;
  }


  /*
	 * Check that n is a primitive number, an integer, and in range, otherwise
	 * throw.
	 */
  function intCheck(n, min, max, name) {
    if (n < min || n > max || n !== mathfloor(n)) {
      throw Error
       (bignumberError + (name || 'Argument') + (typeof n == 'number'
         ? n < min || n > max ? ' out of range: ' : ' not an integer: '
         : ' not a primitive number: ') + String(n));
    }
  }


  // Assumes finite n.
  function isOdd(n) {
    var k = n.c.length - 1;
    return bitFloor(n.e / LOG_BASE) == k && n.c[k] % 2 != 0;
  }


  function toExponential(str, e) {
    return (str.length > 1 ? str.charAt(0) + '.' + str.slice(1) : str) +
     (e < 0 ? 'e' : 'e+') + e;
  }


  function toFixedPoint(str, e, z) {
    var len, zs;

    // Negative exponent?
    if (e < 0) {

      // Prepend zeros.
      for (zs = z + '.'; ++e; zs += z);
      str = zs + str;

    // Positive exponent
    } else {
      len = str.length;

      // Append zeros.
      if (++e > len) {
        for (zs = z, e -= len; --e; zs += z);
        str += zs;
      } else if (e < len) {
        str = str.slice(0, e) + '.' + str.slice(e);
      }
    }

    return str;
  }


  // EXPORT


  BigNumber = clone();
  BigNumber['default'] = BigNumber.BigNumber = BigNumber;

  // AMD.
  if (typeof define == 'function' && define.amd) {
    define(function () { return BigNumber; });

  // Node.js and other environments that support module.exports.
  } else if (typeof module != 'undefined' && module.exports) {
    module.exports = BigNumber;

  // Browser.
  } else {
    if (!globalObject) {
      globalObject = typeof self != 'undefined' && self ? self : window;
    }

    globalObject.BigNumber = BigNumber;
  }
})(this);
/*
 * Created by staff of the U.S. Securities and Exchange Commission. Data and
 * content created by government employees within the scope of their employment
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';
if ( !Element.prototype.matches ) {
  Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if ( !Element.prototype.closest ) {
  Element.prototype.closest = function( s ) {
    var el = this;
    
    do {
      if ( el.matches(s) )
        return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

if ( typeof Object.assign != 'function' ) {
  // Must be writable: true, enumerable: false, configurable: true
  Object.defineProperty(Object, "assign", {
    value : function assign( target, varArgs ) { // .length of function is 2
      'use strict';
      if ( target == null ) { // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object');
      }
      
      var to = Object(target);
      
      for ( var index = 1; index < arguments.length; index++ ) {
        var nextSource = arguments[index];
        
        if ( nextSource != null ) { // Skip over if undefined or null
          for ( var nextKey in nextSource ) {
            // Avoid bugs when hasOwnProperty is shadowed
            if ( Object.prototype.hasOwnProperty.call(nextSource, nextKey) ) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable : true,
    configurable : true
  });
}

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

function ParsedUrl( url ) {
  var parser = document.createElement("a");
  parser.href = url;
  
  // IE 8 and 9 dont load the attributes "protocol" and "host" in case the
  // source URL
  // is just a pathname, that is, "/example" and not
  // "http://domain.com/example".
  parser.href = parser.href;
  
  // IE 7 and 6 wont load "protocol" and "host" even with the above workaround,
  // so we take the protocol/host from window.location and place them manually
  if ( parser.host === "" ) {
    var newProtocolAndHost = window.location.protocol + "//" + window.location.host;
    if ( url.charAt(1) === "/" ) {
      parser.href = newProtocolAndHost + url;
    }
    else {
      // the regex gets everything up to the last "/"
      // /path/takesEverythingUpToAndIncludingTheLastForwardSlash/thisIsIgnored
      // "/" is inserted before because IE takes it of from pathname
      var currentFolder = ("/" + parser.pathname).match(/.*\//)[0];
      parser.href = newProtocolAndHost + currentFolder + url;
    }
  }
  
  // copies all the properties to this object
  var properties = [ 'host', 'hostname', 'hash', 'href', 'port', 'protocol', 'search' ];
  for ( var i = 0, n = properties.length; i < n; i++ ) {
    this[properties[i]] = parser[properties[i]];
  }
  
  // pathname is special because IE takes the "/" of the starting of pathname
  this.pathname = (parser.pathname.charAt(0) !== "/" ? "/" : "") + parser.pathname;
}

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

if ( !String.prototype.endsWith ) {
  String.prototype.endsWith = function( search, this_len ) {
    if ( this_len === undefined || this_len > this.length ) {
      this_len = this.length;
    }
    return this.substring(this_len - search.length, this_len) === search;
  };
}

if ( !String.prototype.startsWith ) {
  String.prototype.startsWith = function( search, this_len ) {
    this_len = this_len || 0;
    return this.indexOf(search, this_len) === this_len;
  }
}

if ( !String.prototype.padEnd ) {
  String.prototype.padEnd = function padEnd( targetLength, padString ) {
    targetLength = targetLength >> 0;
    // floor if number or convert non-number to 0;
    padString = String((typeof padString !== 'undefined' ? padString : ' '));
    if ( this.length > targetLength ) {
      return String(this);
    }
    else {
      targetLength = targetLength - this.length;
      if ( targetLength > padString.length ) {
        padString += padString.repeat(targetLength / padString.length);
        // append to original to ensure we are longer than needed
      }
      return String(this) + padString.slice(0, targetLength);
    }
  };
}

if ( !String.prototype.repeat ) {
  String.prototype.repeat = function( count ) {
    'use strict';
    if ( this == null ) {
      throw new TypeError('can\'t convert ' + this + ' to object');
    }
    var str = '' + this;
    count = +count;
    if ( count != count ) {
      count = 0;
    }
    if ( count < 0 ) {
      throw new RangeError('repeat count must be non-negative');
    }
    if ( count == Infinity ) {
      throw new RangeError('repeat count must be less than infinity');
    }
    count = Math.floor(count);
    if ( str.length == 0 || count == 0 ) {
      return '';
    }
    // Ensuring count is a 31-bit integer allows us to heavily optimize the
    // main part. But anyway, most current (August 2014) browsers can't handle
    // strings 1 << 28 chars or longer, so:
    if ( str.length * count >= 1 << 28 ) {
      throw new RangeError('repeat count must not overflow maximum string size');
    }
    var maxCount = str.length * count;
    count = Math.floor(Math.log(count) / Math.log(2));
    while (count) {
      str += str;
      count--;
    }
    str += str.substring(0, maxCount - str.length);
    return str;
  }
}

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var Scroll = {
  
  toTop : function( ) {
    var formElement = document.getElementById('dynamic-xbrl-form');
    formElement.scrollTop = 0;
    Scroll.removeAnchorTag();
  },
  
  scroll : function( event, element ) {
    if ( element.scrollTop === 0 ) {
      document.getElementById('back-to-top').classList.add('d-none');
      
    }
    else {
      document.getElementById('back-to-top').classList.remove('d-none');
    }
  },
  
  removeAnchorTag : function( ) {
    location.hash = '';
  }
};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var SearchFunctions = {
  
  getAllElementsForContent : [ ],
  
  elementLabelFromRegex : function( element, regex, highlighted ) {
    if ( !highlighted ) {
      return regex.test(FiltersName.getAllLabels(element.getAttribute('name')));
    }
    return highlighted;
    
  },
  
  elementNameForRegex : function( element ) {
    return element.getAttribute('name') || '';
  },
  
  elementContentForRegex : function( element ) {
    if ( Taxonomies.isElementContinued(element) ) {
      var tempContinuedElements = ModalsNested.dynamicallyFindContinuedTaxonomies(element, [ ]);
      var continuedElementsInnerText = '';
      for ( var i = 0; i < tempContinuedElements.length; i++ ) {
        if ( tempContinuedElements[i].textContent ) {
          continuedElementsInnerText += ' ' + tempContinuedElements[i].textContent.trim();
        }
      }
      return continuedElementsInnerText;
    } else {
      return element.textContent;
    }
  },
  
  elementLabelForRegex : function( element ) {
    
    return FiltersName.getAllLabels(element.getAttribute('name')).join(' ');
    
  },
  
  elementDefinitionForRegex : function( element ) {
    return FiltersName.getDefinition(name);
  },
  
  elementDimensionsForRegex : function( element ) {
    var dimensionContainer = document.getElementById(element.getAttribute('contextref'))
        .querySelectorAll('[dimension]');
    var dimensionContainerInnerText = '';
    
    for ( var i = 0; i < dimensionContainer.length; i++ ) {
      if ( dimensionContainer[i].innerText ) {
        dimensionContainerInnerText += ' ' + dimensionContainer[i].innerText;
      }
    }
    return dimensionContainerInnerText;
  },
  
  elementReferencesForRegex : function( element, searchOptions ) {
    var name = element.getAttribute('name').replace(':', '_');
    
    var result = Constants.getMetaTags.map(
        function( element ) {
          if ( element['original-name'] === name && element['auth_ref'].length ) {
            var objectToSearch = SearchFunctions.searchReferencesForAuthRef(element['auth_ref'][0],
                Constants.getMetaStandardReference);
            
            if ( objectToSearch ) {
              return SearchFunctions.searchObjectOfSingleReferenceForRegex(objectToSearch, searchOptions);
            }
          }
        }).filter(function( element ) {
      return element;
    });
    return result.join(' ');
    
  },
  
  searchReferencesForAuthRef : function( originalNameValue, standardReferenceArray ) {
    for ( var i = 0; i < standardReferenceArray.length; i++ ) {
      
      if ( standardReferenceArray[i]['original-name'] === originalNameValue ) {
        return standardReferenceArray[i];
      }
    }
  },
  
  searchObjectOfSingleReferenceForRegex : function( object, searchOptions ) {
    // we create a string of all the options the user has requested
    // then we regex that string
    var textToRegex = '';
    
    if ( searchOptions['options'].indexOf(6) >= 0 && object['Topic'] ) {
      textToRegex += ' ' + object['Topic'];
    }
    
    if ( searchOptions['options'].indexOf(7) >= 0 && object['SubTopic'] ) {
      textToRegex += ' ' + object['SubTopic'];
    }
    
    if ( searchOptions['options'].indexOf(8) >= 0 && object['Paragraph'] ) {
      textToRegex += ' ' + object['Paragraph'];
    }
    
    if ( searchOptions['options'].indexOf(9) >= 0 && object['Publisher'] ) {
      textToRegex += ' ' + object['Publisher'];
    }
    
    if ( searchOptions['options'].indexOf(10) >= 0 && object['Section'] ) {
      textToRegex += ' ' + object['Section'];
    }
    
    return textToRegex;
    
  }

};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var Search = {
  
  clear : function( event, element ) {
    
    document.getElementById('global-search').value = '';
    UserFiltersState.setUserSearch({});
    UserFiltersState.filterUpdates();
  },
  
  submit : function( event, element ) {
    // 1 => Include Fact Name
    // 2 => Include Fact Content
    // 3 => Include Labels
    // 4 => Include Definitions
    // 5 => Include Dimensions
    // 6 => Include References Topic
    // 7 => Include References Sub Topic
    // 8 => Match References Paragraph
    // 9 => Match References Publisher
    // 10 => Match References Section
    // 11 => Match Case
    
    var valueToSearchFor = document.getElementById('global-search').value;
    var options = document.querySelectorAll('[name="search-options"]');
    var optionsArray = Array.prototype.slice.call(options);
    optionsArray = optionsArray.map(function( current ) {
      if ( current['checked'] ) {
        return parseInt(current['value']);
      }
    }).filter(function( element ) {
      return element
    });
    
    var matchCase = optionsArray.indexOf(11) >= 0;
    
    // we don't use the global
    var regexOptions = 'sm';
    if ( !matchCase ) {
      regexOptions += 'i';
    }
    
    valueToSearchFor = Search.createValueToSearchFor(valueToSearchFor);
    
    var regex = new RegExp(valueToSearchFor, regexOptions);
    
    var objectForState = {
      'regex' : regex,
      'options' : optionsArray
    };
    
    UserFiltersState.setUserSearch(objectForState);
    UserFiltersState.filterUpdates();
    
    return false;
  },
  
  createValueToSearchFor : function( input ) {
    // AND template = (?=.*VARIABLE1)(?=.*VARIABLE2)
    // OR template = (VARIABLE1)|(VARIABLE2)
    
    // TODO this will require a second/third look
    var inputArray = input.replace(/ and /g, ' & ').replace(/ or /g, ' | ').split(' ');
    
    if ( inputArray.length > 1 ) {
      var regex = '^';
      inputArray.forEach(function( current, index, array ) {
        if ( current === '|' ) {
          regex += '|'
        } else if ( current === '&' ) {
          // business as usual
        } else {
          regex += '(?=.*' + current + ')';
        }
      });
      return regex;
    } else {
      return input;
    }
  }
};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var Sections = {
  
  currentlyOpenChildMenu : {},
  
  searchObject : {},
  
  clickEvent : function( event, element ) {
    
    if ( event.keyCode && !(event.keyCode === 13 || event.keyCode === 32) ) {
      return;
    }
    
    if ( element.getAttribute('baseref') && (element.getAttribute('baseref') !== HelpersUrl.getHTMLFileName) ) {
      
      // we load it, then send the user to the correct spot
      
      AppInit.init(element.getAttribute('baseref'), function( ) {
        AppInit.additionalSetup();
        Sections.fallbackElementScroll(event, element);
      });
    } else {
      Sections.fallbackElementScroll(event, element);
      
    }
    
  },
  
  fallbackElementScroll : function( event, element ) {
    Sections.setSelectedAttributes(element);
    var taxonomyElement = TaxonomiesGeneral.getElementByNameContextref(element.getAttribute('name'), element
        .getAttribute('contextref'));
    
    if ( taxonomyElement ) {
      taxonomyElement.scrollIntoView({
        'block' : Constants.scrollPosition
      });
    } else {
      ErrorsMinor.factNotFound();
    }
  },
  
  toggle : function( event, element ) {
    
    if ( event.keyCode && !(event.keyCode === 13 || event.keyCode === 32) ) {
      return;
    }
    
    if ( element.classList && element.classList.contains('disabled') ) {
      return;
    }
    
    MenusState.toggle('sections-menu', false, function( openMenu ) {
      if ( openMenu ) {
        document.getElementById('sections-menu').addEventListener('transitionend', function( event ) {
          // our menu is now open
          // we populate the menu with associated data
          Sections.populate();
        }, {
          'once' : true
        });
      }
    });
    
  },
  
  formChange : function( ) {
    
    if ( MenusState.openMenu === 'sections-menu' ) {
      if ( Sections.currentlyOpenChildMenu.hasOwnProperty('id')
          && Sections.currentlyOpenChildMenu.hasOwnProperty('group') ) {
        Sections.populateChildCollapse(Sections.currentlyOpenChildMenu['id'], Sections.currentlyOpenChildMenu['group']);
      }
    }
    
  },
  
  populate : function( searchObject ) {
    
    searchObject = searchObject || {};
    
    Sections.searchObject = searchObject;
    
    Sections.populateParentCollapse('tagged-sections-0', 'collapseDocumentEntityTypesBadge', 'document',
        'collapseDocumentEntityTypes');
    
    Sections.populateParentCollapse('tagged-sections-1', 'collapseFinancialStatementsBadge', 'statement',
        'collapseFinancialStatements');
    
    Sections.populateParentCollapse('tagged-sections-2', 'collapseNotesToTheFinancialsBadge', 'disclosure',
        'collapseNotesToTheFinancials');
    
    Sections.populateParentCollapse('tagged-sections-3', 'collapseRRSummariesBadge', 'RR_Summaries',
        'collapseRRSummaries');
    
    Sections.formChange();
  },
  
  populateParentCollapse : function( parentId, badgeId, groupType, containerId ) {
    
    var discoveredGroupType = Sections.filterGroupType(groupType);
    
    if ( discoveredGroupType.length === 0 ) {
      document.getElementById(parentId).classList.add('d-none');
    } else {
      document.getElementById(parentId).classList.remove('d-none');
      var collapseButton = document.querySelector('#' + parentId + ' button');
      
      collapseButton.setAttribute('onClick', 'Sections.prepareChildCollapse(this, "' + groupType + '");');
      
      document.getElementById(badgeId).textContent = discoveredGroupType.length;
    }
    
  },
  
  filterGroupType : function( groupType ) {
    var discoveredGroupType = FiltersReports.getReportsByGroupType(groupType);
    var discoveredGroupTypeArray = Array.prototype.slice.call(discoveredGroupType);
    // we sort by Long Name to put it in the correct order.
    discoveredGroupTypeArray.sort(function( first, second ) {
      return (first['longName']).localeCompare(second['longName']);
    });
    
    if ( Object.keys(Sections.searchObject).length === 0
        || (Object.keys(Sections.searchObject).length === 1 && Sections.searchObject['type'] && Sections.searchObject['type'] === 1) ) {
      
      return discoveredGroupTypeArray;
      
    } else {
      var filteredDiscoveredGroupTypeArray = discoveredGroupTypeArray.filter(function( element ) {
        var keepElement = true;
        if ( Sections.searchObject['type'] ) {
          if ( Sections.searchObject['type'] === 2 ) {
            // return true if baseref is same as current url
            if ( element['firstAnchor'] && element['firstAnchor']['baseRef'] ) {
              
              keepElement = (element['firstAnchor']['baseRef'] === HelpersUrl.getExternalFile
                  .substr(HelpersUrl.getExternalFile.lastIndexOf('/') + 1));
              
            } else if ( element['uniqueAnchor'] && element['uniqueAnchor']['baseRef'] ) {
              
              keepElement = (element['uniqueAnchor']['baseRef'] === HelpersUrl.getExternalFile
                  .substr(HelpersUrl.getExternalFile.lastIndexOf('/') + 1));
              
            }
          }
          if ( Sections.searchObject['type'] === 3 ) {
            // return true if baseref is NOT same as current url
            if ( element['firstAnchor'] && element['firstAnchor']['baseRef'] ) {
              
              keepElement = (element['firstAnchor']['baseRef'] !== HelpersUrl.getExternalFile
                  .substr(HelpersUrl.getExternalFile.lastIndexOf('/') + 1));
              
            } else if ( element['uniqueAnchor'] && element['uniqueAnchor']['baseRef'] ) {
              
              keepElement = (element['uniqueAnchor']['baseRef'] !== HelpersUrl.getExternalFile
                  .substr(HelpersUrl.getExternalFile.lastIndexOf('/') + 1));
              
            }
          }
        }
        if ( Sections.searchObject['value'] ) {
          
          if ( keepElement ) {
            
            keepElement = Sections.searchObject['value'].test(element['shortName']);
            
          }
          
        }
        
        return keepElement;
      });
      
      return filteredDiscoveredGroupTypeArray;
    }
    
  },
  
  prepareChildCollapse : function( event, groupType ) {
    // TODO small error handling to ensure we have our HTML correct
    var idToPopulate = event.dataset['target'].substring(1);
    if ( document.getElementById(idToPopulate).classList.contains('show') ) {
      Sections.currentlyOpenChildMenu = {};
      Sections.emptyChildCollapse(idToPopulate);
    } else {
      
      Sections.currentlyOpenChildMenu = {
        'id' : '#' + idToPopulate,
        'group' : groupType
      };
      
      Sections.populateChildCollapse(event.dataset['target'], groupType);
    }
  },
  
  populateChildCollapse : function( idToPopulate, groupType ) {
    
    var discoveredGroupType = Sections.filterGroupType(groupType);
    
    var listHtml = '';
    discoveredGroupType
        .forEach(function( current, index ) {
          
          var name = '';
          var contextref = '';
          var baseref = '';
          var sameBaseRef = true;
          
          if ( current['firstAnchor'] ) {
            
            name = current['firstAnchor']['name'];
            contextref = current['firstAnchor']['contextRef'];
            baseref = current['firstAnchor']['baseRef'];
            if ( current['firstAnchor']['baseRef'] ) {
              
              sameBaseRef = HelpersUrl.getHTMLFileName === current['firstAnchor']['baseRef'];
            }
            
          } else if ( current['uniqueAnchor'] ) {
            
            name = current['uniqueAnchor']['name'];
            contextref = current['uniqueAnchor']['contextRef'];
            baseref = current['uniqueAnchor']['baseRef'];
            if ( current['uniqueAnchor']['baseRef'] ) {
              
              sameBaseRef = HelpersUrl.getHTMLFileName === current['uniqueAnchor']['baseRef'];
            }
            
          }
          
          // listHtml += '<small>';
          if ( sameBaseRef ) {
            listHtml += '<li name="'
                + name
                + '" contextref="'
                + contextref
                + '" selected-taxonomy="false" onclick="Sections.clickEvent(event, this);" onkeyup="Sections.clickEvent(event, this);" class="click list-group-item list-group-item-action d-flex align-items-center" tabindex="2">';
          } else {
            listHtml += '<li name="'
                + name
                + '" contextref="'
                + contextref
                + '" baseref="'
                + baseref
                + '" onclick="Sections.clickEvent(event, this);" onkeyup="Sections.clickEvent(event, this);" class="click list-group-item list-group-item-action d-flex align-items-center" tabindex="2">';
            listHtml += '<i class="fas fa-external-link-alt mr-3"></i>';
          }
          listHtml += current['shortName'];
          listHtml += '</li>';
          // listHtml += '</small>';
          
        });
    
    idToPopulate = idToPopulate.substring(1);
    document.getElementById(idToPopulate).getElementsByClassName('list-group')[0].innerHTML = listHtml;
    $('#' + idToPopulate).collapse('show');
  },
  
  emptyChildCollapse : function( idToEmpty ) {
    $('#' + idToEmpty).collapse('hide');
    document.getElementById(idToEmpty).getElementsByClassName('list-group')[0].innerHTML = '';
  },
  
  setSelectedAttributes : function( element ) {
    
    var selected = document.getElementById('tagged-sections').querySelectorAll('[selected-taxonomy]');
    var selectedArray = Array.prototype.slice.call(selected);
    selectedArray.forEach(function( current ) {
      current.setAttribute('selected-taxonomy', false);
    });
    element.setAttribute('selected-taxonomy', true);
  }
};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var SectionsSearch = {
  
  submit : function( event, element ) {
    
    // 1 => All Sections
    // 2 => Show Internal Sections Only
    // 3 => Show External Sections Only
    
    var options = document.querySelectorAll('[name="sections-search-options"]');
    
    var valueToSearchFor = document.getElementById('sections-search').value;
    
    var optionsArray = Array.prototype.slice.call(options);
    optionsArray = optionsArray.map(function( current ) {
      if ( current['checked'] ) {
        return parseInt(current['value']);
      }
    }).filter(function( element ) {
      return element;
    });
    
    var searchObject = {
      'type' : optionsArray[0],
      'value' : (valueToSearchFor) ? new RegExp(valueToSearchFor, 'i') : null
    };
    Sections.populate(searchObject);
    return false;
    
  },
  
  clear : function( event, element ) {
    
    document.querySelector('input[name="sections-search-options"]').checked = true;
    document.getElementById('sections-search').value = '';
    Sections.populate();
    
  }
};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var TaxonomiesContinuedAt = {
  
  addContinuedAtFunctionality : function( callback ) {
    
    var foundContinuedAtTotalElements = document.getElementById('dynamic-xbrl-form').querySelectorAll(
        '[continuedat], ' + Constants.getHtmlPrefix + '\\:continuation');
    
    var foundContinuedAtTotalElementsArray = Array.prototype.slice.call(foundContinuedAtTotalElements);
    
    var continuedAtParentIndex = 0;
    var order = 0;
    foundContinuedAtTotalElementsArray.forEach(function( current, index ) {
      if ( current.getAttribute('contextref') ) {
        // these are the parents
        current.setAttribute('continued-at-taxonomy', continuedAtParentIndex);
        current.setAttribute('continued-at-order', order);
        current.removeAttribute('enabled-taxonomy');
        current.setAttribute('continued-taxonomy', true);
        TaxonomiesContinuedAt.iterateDomForNestedContinuedAt(current.getAttribute('continuedat'),
            continuedAtParentIndex, order);
        continuedAtParentIndex++;
        order = 0;
        
      }
      current.setAttribute('onMouseEnter', 'TaxonomiesContinuedAt.enterElement(this);');
      current.setAttribute('onMouseLeave', 'TaxonomiesContinuedAt.leaveElement(this);');
      current.setAttribute('onClick',
          '(function(e) {e.preventDefault(); e.stopPropagation();})(event);ModalsContinuedAt.clickEvent(this);');
    });
    return callback();
  },
  
  addContinuedAtFunctionalityToSpecificElement : function( element ) {
    element.removeAttribute('enabled-taxonomy');
    element.setAttribute('continued-taxonomy', true);
    element.setAttribute('onMouseEnter', 'TaxonomiesContinuedAt.enterElement(this);');
    element.setAttribute('onMouseLeave', 'TaxonomiesContinuedAt.leaveElement(this);');
    element.setAttribute('onClick',
        '(function(e) {e.preventDefault(); e.stopPropagation();})(event);ModalsContinuedAt.clickEvent(this);');
  },
  
  iterateDomForNestedContinuedAt : function( idRef, parentId, order ) {
    order++;
    if ( idRef && document.getElementById(idRef) ) {
      document.getElementById(idRef).setAttribute('continued-at-taxonomy', parentId);
      document.getElementById(idRef).setAttribute('continued-at-order', order);
      if ( document.getElementById(idRef).getAttribute('continuedat') ) {
        order++;
        TaxonomiesContinuedAt.iterateDomForNestedContinuedAt(
            document.getElementById(idRef).getAttribute('continuedat'), parentId, order);
      }
    }
  },
  
  dynamicallyFindAllContinuedAtElements : function( idRef, continuedAtRef ) {
    
    var potentialSiblingOrParent = document.querySelector('[continuedat="' + idRef + '"]:not(.continued-taxonomy)');
    
    if ( potentialSiblingOrParent ) {
      potentialSiblingOrParent.classList.add('continued-taxonomy');
      TaxonomiesContinuedAt.dynamicallyFindAllContinuedAtElements(potentialSiblingOrParent.getAttribute('id'),
          potentialSiblingOrParent.getAttribute('continuedat'));
    }
    var potentialSibling = document.querySelector('#' + continuedAtRef + ':not(.continued-taxonomy)');
    
    if ( potentialSibling ) {
      potentialSibling.classList.add('continued-taxonomy');
      TaxonomiesContinuedAt.dynamicallyFindAllContinuedAtElements(potentialSibling.getAttribute('id'), potentialSibling
          .getAttribute('continuedat'));
    }
  },
  
  dynamicallyFindContextRefForHover : function( element, hover, parentElement ) {
    
    if ( element && element && element.hasAttribute('contextref') ) {
      TaxonomiesContinuedAt.updateHoverEffectOnAllChildren(element, hover);
    } else if ( element && element.hasAttribute('id') ) {
      TaxonomiesContinuedAt.dynamicallyFindContextRefForHover(document.getElementById('dynamic-xbrl-form')
          .querySelector('[continuedat="' + element.getAttribute('id') + '"]'), hover, parentElement);
      
    } else {
      ErrorsMinor.continuedAt();
      TaxonomiesContinuedAt.removeAttributes(parentElement);
    }
  },
  
  updateHoverEffectOnAllChildren : function( element, hover ) {
    // we always start at the top-level element
    
    if ( hover === true && (element && element.hasAttribute('continued-main-taxonomy')) ) {
      TaxonomiesGeneral.addPopover(element, true);
    }
    if ( element ) {
      element.setAttribute('hover-taxonomy', hover);
      
      if ( element.hasAttribute('continuedat') ) {
        TaxonomiesContinuedAt.updateHoverEffectOnAllChildren(document.getElementById('dynamic-xbrl-form')
            .querySelector('[id="' + element.getAttribute('continuedat') + '"]'), hover);
      }
    }
  },
  
  findContinuedMainTaxonomy : function( element ) {
    if ( element.hasAttribute('continued-main-taxonomy') && element.getAttribute('continued-main-taxonomy') === 'true' ) {
      return element;
    } else {
      return TaxonomiesContinuedAt.findContinuedMainTaxonomy(document.getElementById('dynamic-xbrl-form').querySelector(
          '[continuedat="' + element.getAttribute('id') + '"]'));
    }
  },
  // element.hasAttribute('continued-main-taxonomy')
  enterElement : function( event, element ) {
    event.stopPropagation();
    event.preventDefault();
    TaxonomiesContinuedAt.dynamicallyFindContextRefForHover(element, true, element);
  },
  
  removeAttributes : function( element ) {
    element.removeAttribute('onclick');
    element.removeAttribute('onmouseenter');
    element.removeAttribute('onmouseleave');
    element.removeAttribute('enabled-taxonomy');
    element.removeAttribute('highlight-taxonomy');
    element.removeAttribute('selected-taxonomy');
    element.removeAttribute('hover-taxonomy');
  }

};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var TaxonomiesGeneral = {
  
  enterElement : function( event, element ) {
    
    event.stopPropagation();
    
    if ( FiltersName.getLabel(element.getAttribute('name')) ) {
      
      TaxonomiesGeneral.addPopover(element);
    }
    element.setAttribute('hover-taxonomy', true);
  },
  
  addPopover : function( element, isContinued ) {
    isContinued = isContinued || false;
    
    var popoversDiscovered = document.querySelectorAll('.popover');
    var popoversDiscoveredArray = Array.prototype.slice.call(popoversDiscovered);
    
    popoversDiscoveredArray.forEach(function( current ) {
      current.parentNode.removeChild(current);
    });
    
    var terseLabelOnly = FiltersName.getTerseLabelOnlyLabel(element.getAttribute('name')) ? FiltersName
        .getLabel(element.getAttribute('name')) : 'Not Available.';
    
    element.setAttribute('data-toggle', 'popover');
    element.setAttribute('data-title', terseLabelOnly);
    
    var popoverHtml = '';
    popoverHtml += '<div class="popover" role="tooltip">';
    popoverHtml += '<div class="arrow"></div>';
    popoverHtml += '<h3 class="popover-header text-center text-popover-clamp-1 py-0"></h3>';
    popoverHtml += '<div class="text-center text-popover-clamp-2 py-1">' + FiltersValue.getFormattedValue(element)
        + '</div>';
    popoverHtml += '<div class="text-center p-2">' + FiltersContextref.getPeriod(element.getAttribute('contextref'))
        + '</div>';
    popoverHtml += '<p class="text-center p-2">Click for additional information.</p>';
    popoverHtml += '</div>';
    
    $(element).popover({
      'placement' : 'auto',
      'template' : popoverHtml,
    // 'container' : 'element'
    });
    $(element).popover('show');
  },
  
  removeAllSelectedTaxonomy : function( ) {
    var otherSelectedTaxonomies = document.querySelectorAll('[selected-taxonomy="true"]');
    
    var otherSelectedTaxonomiesArray = Array.prototype.slice.call(otherSelectedTaxonomies);
    
    otherSelectedTaxonomiesArray.forEach(function( current ) {
      current.setAttribute('selected-taxonomy', false);
    });
  },
  
  selectedTaxonomy : function( element ) {
    TaxonomiesGeneral.removeAllSelectedTaxonomy();
    
    var foundTaxonomies;
    
    if ( element instanceof Array ) {
      element.forEach(function( current, index ) {
        if ( index === 0 ) {
          var menuTaxonomy = document.querySelector('[data-id="' + current.getAttribute('id') + '"]');
          if ( menuTaxonomy ) {
            menuTaxonomy.setAttribute('selected-taxonomy', true);
          }
        }
        current.setAttribute('selected-taxonomy', true);
      });
    } else {
      
      if ( element.getAttribute('id') ) {
        foundTaxonomies = document.querySelectorAll('#' + element.getAttribute('id') + ' ,[data-id="'
            + element.getAttribute('id') + '"]');
      } else {
        
        foundTaxonomies = document.querySelectorAll('[contextref="' + element.getAttribute('contextref') + '"][name="'
            + element.getAttribute('name') + '"]');
      }
      
      var foundTaxonomiesArray = Array.prototype.slice.call(foundTaxonomies);
      
      foundTaxonomiesArray.forEach(function( current ) {
        
        if ( !Taxonomies.isElementContinued(current) ) {
          current.setAttribute('selected-taxonomy', true);
        }
        
      });
    }
  },
  
  getElementByNameContextref : function( name, contextref ) {
    return document.getElementById('dynamic-xbrl-form').querySelector(
        '[name="' + name + '"][contextref="' + contextref + '"]');
  },
  
  getTaxonomyById : function( id ) {
    var element = document.getElementById('dynamic-xbrl-form').querySelector('[id="' + id + '"]');
    if ( element.hasAttribute('continued-main-taxonomy') && element.getAttribute('continued-main-taxonomy') === 'true' ) {
      return ModalsNested.dynamicallyFindContinuedTaxonomies(element, [ ]);
    } else {
      return element;
    }
    
  },
  
  getMenuTaxonomyByDataID : function( dataId ) {
    
    return document.getElementById('taxonomies-menu-list-pagination').querySelector('[data-id="' + dataId + '"]');
  },
  
  goTo : function( event, element, modalPopup ) {
    
    if ( event.keyCode && !(event.keyCode === 13 || event.keyCode === 32) ) {
      return;
    }
    var menuElementToScrollTo;
    var elementToScrollTo;
    
    if ( element.getAttribute('data-id') ) {
      elementToScrollTo = document.getElementById('dynamic-xbrl-form').querySelector(
          '#' + element.getAttribute('data-id'));
      
      menuElementToScrollTo = document.querySelector('[data-id="' + element.getAttribute('data-id') + '"]');
      
    } else if ( element.getAttribute('id') ) {
      
      elementToScrollTo = document.getElementById('dynamic-xbrl-form').querySelector('#' + element.getAttribute('id'));
      
      menuElementToScrollTo = document.querySelector('[data-id="' + element.getAttribute('id') + '"]');
      
    } else {
      
      elementToScrollTo = document.getElementById('dynamic-xbrl-form').querySelector(
          '[name="' + element.getAttribute('name') + '"][contextref="' + element.getAttribute('contextref') + '"]');
      
    }
    
    if ( menuElementToScrollTo ) {
      menuElementToScrollTo.scrollIntoView({
        'block' : Constants.scrollPosition
      });
    }
    
    if ( elementToScrollTo ) {
      TaxonomiesGeneral.selectedTaxonomy(elementToScrollTo);
      
      if ( modalPopup ) {
        
        if ( Taxonomies.isElementContinued(elementToScrollTo) ) {
          ModalsContinuedAt.clickEvent(event, elementToScrollTo);
        } else {
          ModalsCommon.clickEvent(event, elementToScrollTo);
        }
        
      }
      
      elementToScrollTo.scrollIntoView({
        'block' : Constants.scrollPosition
      });
      
    } else {
      // let user know it isn't going to work.
      ErrorsMinor.factNotFound();
    }
    
  },
  
  getTaxonomyListTemplate : function( elementID, modalAction ) {
    
    var template = '';
    var element = TaxonomiesGeneral.getTaxonomyById(elementID);
    element = (element instanceof Array) ? element[0] : element;
    
    if ( element.getAttribute('id') ) {
      template += '<a selected-taxonomy="'
          + element.getAttribute('selected-taxonomy')
          + '" contextref="'
          + element.getAttribute('contextref')
          + '" name="'
          + element.getAttribute('name')
          + '" data-id="'
          + element.getAttribute('id')
          + '" onclick="TaxonomiesGeneral.goTo(event, this, '
          + modalAction
          + ');"'
          + element.getAttribute('id')
          + '" onkeyup="TaxonomiesGeneral.goTo(event, this, '
          + modalAction
          + ');"'
          + 'class="click list-group-item list-group-item-action flex-column align-items-start px-2 py-2 w-100" tabindex="13">';
      
    } else {
      
      template += '<a selected-taxonomy="' + element.getAttribute('selected-taxonomy') + '" contextref="'
          + element.getAttribute('contextref') + '" name="' + element.getAttribute('name')
          + '" onclick="TaxonomiesGeneral.goTo(event, this, ' + modalAction
          + ');" class="click list-group-item list-group-item-action flex-column align-items-start px-2 py-2">';
    }
    template += '<div class="d-flex w-100 justify-content-between">';
    template += '<p class="mb-1 font-weight-bold">' + (FiltersName.getLabel(element.getAttribute('name')) || '')
        + '</p>';
    template += TaxonomiesGeneral.getTaxonomyBadge(element) || '';
    template += '</div>';
    template += '<p class="mb-1">' + FiltersContextref.getPeriod(element.getAttribute('contextref')) + '</p>';
    // template += '<hr>';
    template += '<small class="mb-1">' + FiltersValue.getFormattedValue(element, false) + '</small>';
    template += '</a>';
    
    return template;
  },
  
  getTaxonomyBadge : function( element ) {
    
    var label = '';
    var title = '';
    
    if ( element.hasAttribute('isAdditionalItemsOnly') && element.getAttribute('isAdditionalItemsOnly') === 'true' ) {
      label += 'A';
      title += 'Additional';
    }
    
    if ( !element.hasAttribute('isCustomOnly') ) {
      element.setAttribute('isCustomOnly',
          (element.getAttribute('name').split(':')[0].toLowerCase() === Constants.getMetaCustomPrefix) ? true : false);
    }
    // custom
    if ( element.hasAttribute('isCustomOnly') && element.getAttribute('isCustomOnly') === 'true' ) {
      if ( label ) {
        label += ' & C';
        title += ' & Custom';
      } else {
        label += 'C';
        title += 'Custom';
      }
    }
    
    // dimensions
    if ( FiltersContextref.getDimensions(element.getAttribute('contextref')).length > 0 ) {
      if ( label ) {
        label += ' & D';
        title += ' & Dimension';
      } else {
        label += 'D';
        title += 'Dimension';
      }
    }
    
    if ( label ) {
      return '<span><span title="' + title + '" class="m-1 badge badge-dark">' + label + '</span></span>';
    }
    return;
  },
  
  isParentNodeHidden : function( element ) {
    if ( element && element.nodeName.toLowerCase().endsWith(':hidden') ) {
      return true;
    }
    if ( element && element.parentNode ) {
      return TaxonomiesGeneral.isParentNodeHidden(element.parentNode);
    } else {
      return false;
    }
    
  },
  
  specialSort : function( unsortedArray ) {
    var hiddenTaxonomies = [ ];
    var returnedArray = unsortedArray.map(function( current, index ) {
      if ( current.hasAttribute('isAdditionalItemsOnly') && current.getAttribute('isAdditionalItemsOnly') === 'true' ) {
        hiddenTaxonomies.push(current.getAttribute('id'));
      } else {
        return current ? current.getAttribute('id') : null;
      }
      
    }).filter(function( element ) {
      return element;
    }).concat(hiddenTaxonomies);
    
    return returnedArray;
  }

};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var Taxonomies = {
  
  updateTaxonomyCount : function( includeHighlights, initialCountIfTrue ) {
    initialCountIfTrue = initialCountIfTrue || false;
    var taxonomyTotalElements = document.querySelectorAll('.taxonomy-total-count');
    var taxonomyTotalElementsArray = Array.prototype.slice.call(taxonomyTotalElements);
    
    var foundTaxonomies = null;
    if ( includeHighlights ) {
      foundTaxonomies = document.getElementById('dynamic-xbrl-form').querySelectorAll(
          '[contextref][enabled-taxonomy="true"][highlight-taxonomy="true"]');
    } else {
      foundTaxonomies = document.getElementById('dynamic-xbrl-form').querySelectorAll(
          '[contextref][enabled-taxonomy="true"]');
    }
    
    var taxonomyCount = foundTaxonomies.length;
    Constants.getHtmlOverallTaxonomiesCount = taxonomyCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    taxonomyTotalElementsArray.forEach(function( current ) {
      if ( Constants.getHtmlOverallTaxonomiesCount === '0' ) {
        document.getElementById('facts-menu').setAttribute('disabled', true);
        document.getElementById('facts-menu').classList.add('disabled');
      } else {
        document.getElementById('facts-menu').removeAttribute('disabled');
        document.getElementById('facts-menu').classList.remove('disabled');
      }
      current.textContent = Constants.getHtmlOverallTaxonomiesCount;
    });
    
    if ( !initialCountIfTrue ) {
      TaxonomiesMenu.prepareForPagination();
    } else {
      
      Errors.checkPerformanceConcern(foundTaxonomies.length);
    }
    return taxonomyCount;
  },
  
  loadingTaxonomyCount : function( callback ) {
    var taxonomyTotalElements = document.querySelectorAll('.taxonomy-total-count');
    var taxonomyTotalElementsArray = Array.prototype.slice.call(taxonomyTotalElements);
    document.getElementById('facts-menu').setAttribute('disabled', true);
    taxonomyTotalElementsArray.forEach(function( current ) {
      current.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    });
    setTimeout(function( ) {
      callback();
    }, 50);
  },
  
  fixStyleString : function( input ) {
    return input.split(';').reduce(function( accumulator, currentValue ) {
      var rulePair = currentValue.split(':');
      if ( rulePair[0] && rulePair[1] ) {
        accumulator[rulePair[0].trim()] = rulePair[1].trim();
      }
      return accumulator;
    }, {});
  },
  
  updateStyleTaxonomies : function( ) {
    
    // TODO need more test cases
    var foundStyles = document.getElementById('dynamic-xbrl-form').querySelectorAll('[style*="-sec-ix-hidden"]');
    var foundStylesArray = Array.prototype.slice.call(foundStyles);
    
    foundStylesArray.forEach(function( current ) {
      var updatedStyle = Taxonomies.fixStyleString(current.getAttribute('style'));
      
      var hiddenElement = document.getElementById('dynamic-xbrl-form').querySelector(
          '[id="' + updatedStyle['-sec-ix-hidden'] + '"]');
      
      if ( hiddenElement && !hiddenElement.getAttribute('xsi:nil') ) {
        // we now create an entirely new element based on the innerHTML
        // of current, and the attributes of hiddenElement
        var newElement = '';
        
        newElement += '<' + hiddenElement.tagName.toLowerCase();
        // add all of the necessary attributes
        for ( var i = 0; i < hiddenElement.attributes.length; i++ ) {
          var attribute = hiddenElement.attributes[i];
          newElement += ' ' + attribute.name + '="' + attribute.value + '"';
        }
        
        newElement += ' isadditionalitemsonly="true"';
        
        newElement += '>';
        newElement += current.innerHTML;
        // close the tag
        newElement += '</' + hiddenElement.tagName.toLowerCase() + '>';
        
        hiddenElement.removeAttribute('contextref');
        hiddenElement.removeAttribute('name');
        
        current.innerHTML = newElement;
        
      }
      
    });
  },
  
  addEventAttributes : function( ) {
    
    Taxonomies.updateStyleTaxonomies();
    
    var foundTaxonomies = document.getElementById('dynamic-xbrl-form').querySelectorAll(
        '[contextref], [continuedat], ' + Constants.getHtmlPrefix + '\\:continuation');
    var foundTaxonomiesArray = Array.prototype.slice.call(foundTaxonomies);
    var isChrome = window.chrome;
    foundTaxonomiesArray
        .forEach(function( current, index ) {
          if ( current.tagName.toLowerCase().indexOf('continuation') === -1 && !current.hasAttribute('continuedat') ) {
            
            if ( current.hasAttribute('name') && current.getAttribute('name').toLowerCase().indexOf('textblock') >= 0 ) {
              current.setAttribute('text-block-taxonomy', true);
              
              var leftSpan = document.createElement('span');
              leftSpan.setAttribute('class', 'float-left text-block-indicator-left position-absolute');
              leftSpan.title = 'One or more textblock facts are between this symbol and the right side symbol.';
              current.parentNode.insertBefore(leftSpan, current);
              
              var rightSpan = document.createElement('span');
              rightSpan.setAttribute('class', 'float-right text-block-indicator-right position-absolute');
              rightSpan.title = 'One or more textblock facts are between this symbol and the left side symbol.';
              current.parentNode.insertBefore(rightSpan, current);
            }
            if ( current.hasAttribute('id') ) {
              current.setAttribute('data-original-id', current.getAttribute('id'))
            }
            current.setAttribute('id', 'fact-identifier-' + index);
            current.setAttribute('continued-taxonomy', false);
          } else if ( current.tagName.toLowerCase().indexOf('continuation') === -1
              && current.hasAttribute('continuedat') ) {
            
            var leftSpan = document.createElement('span');
            leftSpan.setAttribute('class', 'float-left text-block-indicator-left position-absolute');
            leftSpan.title = 'One or more textblock facts are between this symbol and the right side symbol.';
            current.parentNode.insertBefore(leftSpan, current);
            
            var rightSpan = document.createElement('span');
            rightSpan.setAttribute('class', 'float-right text-block-indicator-right position-absolute');
            rightSpan.title = 'One or more textblock facts are between this symbol and the left side symbol.';
            current.parentNode.insertBefore(rightSpan, current);
            
            current.setAttribute('continued-main-taxonomy', true);
            if ( current.hasAttribute('id') ) {
              current.setAttribute('data-original-id', current.getAttribute('id'))
            }
            current.setAttribute('id', 'fact-identifier-' + index);
          } else if ( current.tagName.toLowerCase().indexOf('continuation') >= 0 ) {
            
            current.setAttribute('continued-taxonomy', true);
            // current.classList.add('d-inherit');
          }
          
          current.setAttribute('enabled-taxonomy', true);
          current.setAttribute('highlight-taxonomy', false);
          current.setAttribute('selected-taxonomy', false);
          current.setAttribute('hover-taxonomy', false);
          
          current.setAttribute('onClick', 'Taxonomies.clickEvent(event, this)');
          current.setAttribute('onKeyUp', 'Taxonomies.clickEvent(event, this)');
          
          current.setAttribute('onMouseEnter', 'Taxonomies.enterElement(event, this);');
          current.setAttribute('onMouseLeave', 'Taxonomies.leaveElement(event, this);');
          current.setAttribute('tabindex', '18');
          if ( current.hasAttribute('contextref') && isChrome && foundTaxonomiesArray.length < 7500 ) {
            Taxonomies.setFilterAttributes(current);
          } else {
            // we always want to set isAdditionalItemsOnly="boolean"
            if ( !current.hasAttribute('isAdditionalItemsOnly') ) {
              current.setAttribute('isAdditionalItemsOnly', TaxonomiesGeneral.isParentNodeHidden(current));
            }
          }
          
          // we want to wrap every fact with a common span
          var span = document.createElement('span');
          current.parentNode.insertBefore(span, current);
          span.appendChild(current);
          
        });
    Taxonomies.updateTaxonomyCount(null, true);
  },
  
  setFilterAttributes : function( element ) {
    if ( element ) {
      var elementIsCalculationsOnly = false;
      if ( Constants.getMetaCalculationsParentTags.indexOf(element.getAttribute('name').replace(':', '_')) >= 0 ) {
        if ( FiltersContextref.getDimensions(element.getAttribute('contextref')).length === 0 ) {
          elementIsCalculationsOnly = true;
        }
      }
      
      element.setAttribute('isAmountsOnly', ((element['tagName'].split(':')[1].toLowerCase() === 'nonfraction') ? true
          : false));
      
      element.setAttribute('isTextOnly', ((element['tagName'].split(':')[1].toLowerCase() === 'nonnumeric') ? true
          : false));
      
      element.setAttribute('isCalculationsOnly', elementIsCalculationsOnly);
      
      element.setAttribute('isNegativesOnly', ((element.getAttribute('sign') === '-') ? true : false));
      
      if ( !element.hasAttribute('isAdditionalItemsOnly') ) {
        element.setAttribute('isAdditionalItemsOnly', TaxonomiesGeneral.isParentNodeHidden(element));
      }
      
      element.getAttribute('name').split(':')[0].toLowerCase() === Constants.getMetaCustomPrefix;
      
      element.setAttribute('isStandardOnly',
          (element.getAttribute('name').split(':')[0].toLowerCase() !== Constants.getMetaCustomPrefix) ? true : false);
      
      element.setAttribute('isCustomOnly',
          (element.getAttribute('name').split(':')[0].toLowerCase() === Constants.getMetaCustomPrefix) ? true : false);
    }
  },
  
  isElementContinued : function( element ) {
    
    if ( element ) {
      if ( element instanceof Array ) {
        return true;
      }
      if ( element.hasAttribute('continued-taxonomy') && element.getAttribute('continued-taxonomy') === 'true' ) {
        return true;
      }
      if ( element.hasAttribute('continued-main-taxonomy')
          && element.getAttribute('continued-main-taxonomy') === 'true' ) {
        return true;
      }
    }
    return false;
  },
  
  isElementNested : function( element ) {
    ModalsNested.getAllElementIDs = [ ];
    ModalsNested.recursielyFindAllNestedTaxonomies(element, true);
    
    return (ModalsNested.getAllElementIDs.length > 1);
  },
  
  clickEvent : function( event, element ) {
    
    if ( event.keyCode && !(event.keyCode === 13 || event.keyCode === 32) ) {
      return;
    }
    
    event.stopPropagation();
    event.preventDefault();
    
    if ( Taxonomies.isElementNested(element) ) {
      
      ModalsNested.clickEvent(event, element);
      
    } else if ( Taxonomies.isElementContinued(element) ) {
      
      ModalsContinuedAt.clickEvent(event, element);
      
      if ( ModalsContinuedAt.getAllElements && ModalsContinuedAt.getAllElements[0]
          && ModalsContinuedAt.getAllElements[0].hasAttribute('id') ) {
        document.getElementById('taxonomy-modal-jump').setAttribute('data-id',
            ModalsContinuedAt.getAllElements[0].getAttribute('id'));
        
      }
      
    } else {
      if ( element && element.hasAttribute('id') ) {
        document.getElementById('taxonomy-modal-jump').setAttribute('data-id', element.getAttribute('id'));
        
      }
      ModalsCommon.clickEvent(event, element);
      if ( element && element.hasAttribute('id') ) {
        document.getElementById('taxonomy-modal-jump').setAttribute('data-id', element.getAttribute('id'));
        
      }
    }
  },
  
  enterElement : function( event, element ) {
    
    event.stopPropagation();
    event.preventDefault();
    
    Taxonomies.resetAllPopups(function( ) {
      Taxonomies.resetAllHoverAttributes();
      element.setAttribute('hover-taxonomy', true);
      if ( Taxonomies.isElementContinued(element) ) {
        if ( element.hasAttribute('continued-main-taxonomy') ) {
          Taxonomies.addPopover(element);
        }
      } else {
        Taxonomies.addPopover(element);
      }
    });
    
  },
  
  addPopover : function( element ) {
    var terseLabelOnly = FiltersName.getLabelForTitle(element.getAttribute('name')) ? FiltersName
        .getLabelForTitle(element.getAttribute('name')) : 'Not Available.';
    
    element.setAttribute('data-toggle', 'popover');
    element.setAttribute('data-title', terseLabelOnly);
    
    var popoverHtml = '';
    popoverHtml += '<div class="popover" role="tooltip">';
    popoverHtml += '<div class="arrow"></div>';
    popoverHtml += '<h3 class="popover-header text-center text-popover-clamp-1 py-0"></h3>';
    popoverHtml += '<div class="text-center text-popover-clamp-2 py-1">' + FiltersValue.getFormattedValue(element)
        + '</div>';
    popoverHtml += '<div class="text-center p-2">' + FiltersContextref.getPeriod(element.getAttribute('contextref'))
        + '</div>';
    popoverHtml += '<p class="text-center p-2">Click for additional information.</p>';
    popoverHtml += '</div>';
    
    $(element).popover({
      'placement' : 'auto',
      'template' : popoverHtml,
      'container' : 'body'
    });
    $(element).popover('show');
  },
  
  leaveElement : function( event, element ) {
    event.stopPropagation();
    event.preventDefault();
    // hide them all!
    $(element).popover('hide');
    Taxonomies.resetAllPopups(function( ) {
      Taxonomies.resetAllHoverAttributes();
    });
  },
  
  resetAllPopups : function( callback ) {
    var foundPopupClasses = document.getElementById('dynamic-xbrl-form').querySelectorAll('.popover');
    var foundPopupClassesArray = Array.prototype.slice.call(foundPopupClasses);
    foundPopupClassesArray.forEach(function( current ) {
      current.parentNode.removeChild(current);
      
    });
    
    callback();
  },
  
  resetAllHoverAttributes : function( ) {
    var foundHoverClasses = document.getElementById('dynamic-xbrl-form').querySelectorAll('[hover-taxonomy="true"]');
    
    var foundHoverClassesArray = Array.prototype.slice.call(foundHoverClasses);
    
    foundHoverClassesArray.forEach(function( current ) {
      
      current.setAttribute('hover-taxonomy', false);
    });
  }
};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var TaxonomiesMenu = {
  
  getCurrentPage : null,
  
  getLastPage : null,
  
  getGlobalSearch : false,
  
  toggle : function( event, element ) {
    
    if ( event.keyCode && !(event.keyCode === 13 || event.keyCode === 32) ) {
      return;
    }
    
    if ( element.classList && element.classList.contains('disabled') ) {
      return;
    }
    MenusState.toggle('taxonomies-menu', true, function( openMenu ) {
      if ( openMenu ) {
        document.getElementById('taxonomies-menu').addEventListener('transitionend', function( event ) {
          // our menu is now open
          // we populate the menu with associated data
          setTimeout(function( ) {
            TaxonomiesMenu.prepareForPagination();
          });
          
        }, {
          'once' : true
        });
      }
    });
    
  },
  
  formChange : function( ) {
    if ( MenusState.openMenu === 'taxonomies-menu' ) {
      TaxonomiesMenu.prepareForPagination();
    }
  },
  
  prepareForPagination : function( ) {
    
    var enabledTaxonomies;
    
    if ( Object.keys(UserFiltersState.getUserSearch).length === 0 ) {
      enabledTaxonomies = document.getElementById('dynamic-xbrl-form').querySelectorAll(
          '[contextref][enabled-taxonomy="true"]');
    } else {
      enabledTaxonomies = document.getElementById('dynamic-xbrl-form').querySelectorAll(
          '[contextref][enabled-taxonomy="true"][highlight-taxonomy="true"]');
    }
    
    var enabledTaxonomiesArray = TaxonomiesGeneral.specialSort(Array.prototype.slice.call(enabledTaxonomies));
    
    Pagination.init(enabledTaxonomiesArray, ('#taxonomies-menu-list-pagination .pagination'),
        ('#taxonomies-menu-list-pagination .list-group'), true);
    
  }
};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var UserFiltersDataRadios = {
  
  clickEvent : function( event, element ) {
    
    // 0 = All
    // 1 = Amounts Only
    // 2 = Text Only
    // 3 = Calculations Only
    // 4 = Negatives Only
    // 5 = Additional Items Only
    
    var radioValue = parseInt(element.querySelector('input[name="data-radios"]:checked').value);
    UserFiltersState.setDataRadios(radioValue);
    UserFiltersState.filterUpdates();
  }

};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var UserFiltersDropdown = {
  
  filterActive : false,
  
  init : function( ) {
    
    UserFiltersDropdown.dataRadios();
    UserFiltersDropdown.tagsRadios();
    UserFiltersDropdown.moreFilters();
    UserFiltersDropdown.updateFilterActive();
    UserFiltersDropdown.activeFilters();
  },
  
  activeFilters : function( ) {
    if ( UserFiltersDropdown.filterActive ) {
      document.getElementById('current-filters-reset').classList.remove('d-none');
    } else {
      document.getElementById('current-filters-reset').classList.add('d-none');
    }
  },
  
  dataRadios : function( ) {
    if ( UserFiltersState.getDataRadios > 0 ) {
      document.getElementById('nav-filter-data').setAttribute('title', 'This filter is in use.');
      document.getElementById('nav-filter-data').classList.add('text-warning');
      // UserFiltersDropdown.filterActive = true;
    } else {
      document.getElementById('nav-filter-data').removeAttribute('title');
      document.getElementById('nav-filter-data').classList.remove('text-warning');
    }
  },
  
  tagsRadios : function( ) {
    if ( UserFiltersState.getTagsRadios > 0 ) {
      document.getElementById('nav-filter-tags').setAttribute('title', 'This filter is in use.');
      document.getElementById('nav-filter-tags').classList.add('text-warning');
      // UserFiltersDropdown.filterActive = true;
    } else {
      document.getElementById('nav-filter-tags').removeAttribute('title');
      document.getElementById('nav-filter-tags').classList.remove('text-warning');
    }
  },
  
  moreFilters : function( ) {
    var moreFiltersCount = 0;
    moreFiltersCount += UserFiltersState.getAxes.length;
    moreFiltersCount += UserFiltersState.getMembers.length;
    moreFiltersCount += UserFiltersState.getBalance.length;
    moreFiltersCount += UserFiltersState.getMeasure.length;
    moreFiltersCount += UserFiltersState.getPeriod.length;
    moreFiltersCount += UserFiltersState.getScale.length;
    
    if ( moreFiltersCount > 0 ) {
      document.getElementById('nav-filter-more').querySelector('.badge').innerText = moreFiltersCount;
      document.getElementById('nav-filter-more').setAttribute('title', 'This filter is in use.');
      document.getElementById('nav-filter-more').classList.add('text-warning');
      // UserFiltersDropdown.filterActive = true;
    } else {
      document.getElementById('nav-filter-more').querySelector('.badge').innerText = '';
      document.getElementById('nav-filter-more').removeAttribute('title');
      document.getElementById('nav-filter-more').classList.remove('text-warning');
    }
  },
  
  resetAll : function( ) {
    UserFiltersDropdown.filterActive = false;
    
    UserFiltersState.getDataRadios = 0;
    document.querySelector('input[name="data-radios"]').checked = true;
    
    UserFiltersState.getTagsRadios = 0;
    document.querySelector('input[name="tags-radios"]').checked = true;
    
    UserFiltersState.getAxes = [ ];
    var foundAxes = document.querySelectorAll('#user-filters-axis input');
    var foundAxesArray = Array.prototype.slice.call(foundAxes);
    foundAxesArray.forEach(function( current ) {
      current.checked = false;
    });
    
    UserFiltersState.getMembers = [ ];
    var foundMembers = document.querySelectorAll('#user-filters-members input');
    var foundMembersArray = Array.prototype.slice.call(foundMembers);
    foundMembersArray.forEach(function( current ) {
      current.checked = false;
    });
    
    UserFiltersState.getBalance = [ ];
    var foundBalances = document.querySelectorAll('#user-filters-balances input');
    var foundBalancesArray = Array.prototype.slice.call(foundBalances);
    foundBalancesArray.forEach(function( current ) {
      current.checked = false;
    });
    
    UserFiltersState.getMeasure = [ ];
    var foundMeasures = document.querySelectorAll('#user-filters-measures input');
    var foundMeasuresArray = Array.prototype.slice.call(foundMeasures);
    foundMeasuresArray.forEach(function( current ) {
      current.checked = false;
    });
    
    UserFiltersState.getPeriod = [ ];
    var foundPeriods = document.querySelectorAll('#user-filters-periods input');
    var foundPeriodsArray = Array.prototype.slice.call(foundPeriods);
    foundPeriodsArray.forEach(function( current ) {
      current.checked = false;
    });
    
    UserFiltersState.getScale = [ ];
    var foundScales = document.querySelectorAll('#user-filters-scales input');
    var foundScalesArray = Array.prototype.slice.call(foundScales);
    foundScalesArray.forEach(function( current ) {
      current.checked = false;
    });
    
    
    UserFiltersState.filterUpdates();
    
  },
  
  updateFilterActive : function( ) {
    var totalFiltersCount = 0;
    totalFiltersCount += UserFiltersState.getDataRadios;
    totalFiltersCount += UserFiltersState.getTagsRadios;
    totalFiltersCount += UserFiltersState.getAxes.length;
    totalFiltersCount += UserFiltersState.getMembers.length;
    totalFiltersCount += UserFiltersState.getBalance.length;
    totalFiltersCount += UserFiltersState.getMeasure.length;
    totalFiltersCount += UserFiltersState.getPeriod.length;
    totalFiltersCount += UserFiltersState.getScale.length;
    
    if ( totalFiltersCount === 0 ) {
      UserFiltersDropdown.filterActive = false;
    } else {
      UserFiltersDropdown.filterActive = true;
    }
  }
};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var UserFiltersGeneral = {
  
  moreFiltersClickEvent : function( event, element ) {
    
    if ( !UserFiltersMoreFiltersPeriodSetUp.filtersSet ) {
      UserFiltersMoreFiltersPeriodSetUp.setPeriods(function( ) {
        UserFiltersMoreFiltersPeriodSetUp.filtersSet = true;
        
        if ( !UserFiltersMoreFiltersMeasureSetUp.filtersSet ) {
          UserFiltersMoreFiltersMeasureSetUp.setMeasures(function( ) {
            UserFiltersMoreFiltersMeasureSetUp.filtersSet = true;
            
            if ( !UserFiltersMoreFiltersAxesSetUp.filtersSet ) {
              UserFiltersMoreFiltersAxesSetUp.setAxes(function( ) {
                UserFiltersMoreFiltersAxesSetUp.filtersSet = true;
                
                if ( !UserFiltersMoreFiltersMembersSetUp.filtersSet ) {
                  UserFiltersMoreFiltersMembersSetUp.setMembers(function( ) {
                    UserFiltersMoreFiltersMembersSetUp.filtersSet = true;
                    
                    if ( !UserFiltersMoreFiltersScaleSetUp.filtersSet ) {
                      UserFiltersMoreFiltersScaleSetUp.setScales(function( ) {
                        UserFiltersMoreFiltersScaleSetUp.filtersSet = true;
                        
                        // the Balances are not dynamic, they are already in the
                        // html
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  },
  
  setAllFilteredDataTemp : function( dataFilter, tagsFilter ) {
    
    UserFiltersGeneral.resetAllFilteredData();
    if ( dataFilter ) {
      UserFiltersGeneral.setCurrentDataFilter(dataFilter);
      // 0 = All
      // 1 = Amounts Only
      // 2 = Text Only
      // 3 = Calculations Only
      // 4 = Negatives Only
      // 5 = Additional Items Only
      switch ( dataFilter ) {
        case 'Amounts Only' : {
          UserFiltersDataRadios.updateFacts('nonfraction');
          break;
        }
        case 'Text Only' : {
          UserFiltersDataRadios.updateFacts('nonnumeric');
          break;
        }
        case 'Calculations Only' : {
          UserFiltersDataRadios.updateCalculationsOnly();
          break;
        }
        case 'Negatives Only' : {
          UserFiltersDataRadios.updateFactsNegativesOnly();
          break;
        }
        case 'Additional Items Only' : {
          UserFiltersDataRadios.updateAdditionalItemsOnly();
          break;
        }
      }
    }
    if ( !dataFilter ) {
      UserFiltersDataRadios.all();
    }
    if ( tagsFilter ) {
      switch ( tagsFilter ) {
        case 'Standard Only' : {
          UserFiltersTagsRadios.updateFactsStandard();
          
          break;
        }
        case 'Custom Only' : {
          UserFiltersTagsRadios.updateFactsCustom();
          break;
        }
      }
    }
    if ( !tagsFilter ) {
      UserFiltersTagsRadios.all();
    }
    
    UserFiltersGeneral.setEnabledTaxonomies();
  },
  
  setEnabledTaxonomies : function( ) {
    
    var foundTaxonomies = document.getElementById('dynamic-xbrl-form').querySelectorAll('[contextref]');
    var foundTaxonomiesArray = Array.prototype.slice.call(foundTaxonomies);
    foundTaxonomies.forEach(function( current ) {
      if ( UserFiltersGeneral.getAllFilteredData.indexOf(current) >= 0 ) {
        current.setAttribute('enabled-taxonomy', true);
      } else {
        current.setAttribute('enabled-taxonomy', false);
      }
    });
    
  },
  
  resetAllFilteredData : function( ) {
    var foundTaxonomies = document.getElementById('dynamic-xbrl-form').querySelectorAll('[contextref]');
    
    var foundTaxonomiesArray = Array.prototype.slice.call(foundTaxonomies);
    
    UserFiltersGeneral.getAllFilteredData = foundTaxonomiesArray;
  },
  
  setAllFilteredData : function( input, dataFilter, tagsFilter ) {
    
    UserFiltersGeneral.getAllFilteredData = input;
    
    UserFiltersGeneral.updateTaxonomyCounts(input.length);
    if ( dataFilter ) {
      
      UserFiltersGeneral.setCurrentDataFilter(dataFilter);
    } else {
      UserFiltersGeneral.setCurrentTagsFilter(tagsFilter);
    }
  },
  
  getAllFilteredData : null,
  
  updateTaxonomyCounts : function( input ) {
    
    var taxonomyTotalElements = document.querySelectorAll('.taxonomy-total-count');
    
    var taxonomyTotalElementsArray = Array.prototype.slice.call(taxonomyTotalElements);
    
    taxonomyTotalElementsArray.forEach(function( current ) {
      current.textContent = input;
    });
    TaxonomiesMenu.prepareForPagination();
  },
  
  updateCurrentFiltersDropdown : function( ) {
    
    if ( UserFiltersGeneral.getCurrentTagsFilter ) {
      
      document.getElementById('current-filters-dropdown').classList.remove('d-none');
      var dropdownHtml = '<a onclick="UserFiltersGeneral.resetTagsFilter();" class="dropdown-item click">';
      dropdownHtml += '<label><i class="fas fa-times mr-1"></i>';
      dropdownHtml += UserFiltersGeneral.getCurrentTagsFilter;
      dropdownHtml += '</label></a>';
      document.getElementById('current-filters-tags').innerHTML = dropdownHtml;
    }
    if ( !UserFiltersGeneral.getCurrentTagsFilter ) {
      
      document.getElementById('current-filters-tags').innerHTML = '';
    }
    
    if ( UserFiltersGeneral.getCurrentDataFilter ) {
      
      document.getElementById('current-filters-dropdown').classList.remove('d-none');
      var dropdownHtml = '<a onclick="UserFiltersGeneral.resetDataFilter();" class="dropdown-item click">';
      dropdownHtml += '<label><i class="fas fa-times mr-1"></i>';
      dropdownHtml += UserFiltersGeneral.getCurrentDataFilter;
      dropdownHtml += '</label></a>';
      document.getElementById('current-filters-data').innerHTML = dropdownHtml;
    }
    if ( !UserFiltersGeneral.getCurrentDataFilter ) {
      
      document.getElementById('current-filters-data').innerHTML = '';
    }
    
    if ( !UserFiltersGeneral.getCurrentTagsFilter && !UserFiltersGeneral.getCurrentDataFilter ) {
      
      document.getElementById('current-filters-dropdown').classList.add('d-none');
    }
  },
  
  setCurrentDataFilter : function( input ) {
    if ( input ) {
      UserFiltersGeneral.getCurrentDataFilter = input;
    } else {
      UserFiltersGeneral.getCurrentDataFilter = null;
    }
    
    UserFiltersGeneral.updateCurrentFiltersDropdown();
  },
  
  getCurrentDataFilter : null,
  
  setCurrentTagsFilter : function( input ) {
    if ( input ) {
      UserFiltersGeneral.getCurrentTagsFilter = input;
    } else {
      UserFiltersGeneral.getCurrentTagsFilter = null;
    }
    
    UserFiltersGeneral.updateCurrentFiltersDropdown();
  },
  
  getCurrentTagsFilter : null,
  
  resetDataFilter : function( ) {
    var radios = document.querySelectorAll('[name="data-radios"]');
    var radiosArray = Array.prototype.slice.call(radios);
    UserFiltersGeneral.getCurrentDataFilter = null;
    
    radiosArray.forEach(function( current, index ) {
      if ( index === 0 ) {
        current['checked'] = true;
        UserFiltersDataRadios.all();
      } else {
        current['checked'] = false;
      }
    });
  },
  
  resetTagsFilter : function( ) {
    var radios = document.querySelectorAll('[name="tags-radios"]');
    var radiosArray = Array.prototype.slice.call(radios);
    UserFiltersGeneral.getCurrentTagsFilter = null;
    
    radiosArray.forEach(function( current, index ) {
      if ( index === 0 ) {
        current['checked'] = true;
        UserFiltersTagsRadios.all();
      } else {
        current['checked'] = false;
      }
    });
  },
  
  resetAllFilters : function( ) {
    UserFiltersGeneral.resetDataFilter();
    UserFiltersGeneral.resetTagsFilter();
  }
};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var UserFiltersMoreFiltersAxesSetUp = {
  filtersSet : false,
  
  axisOptions : [ ],
  
  setAxes : function( callback ) {
    var foundDimensions = document.getElementById('dynamic-xbrl-form').querySelectorAll('[dimension*="Axis"]');
    var foundDimensionsArray = Array.prototype.slice.call(foundDimensions);
    
    foundDimensionsArray.forEach(function( current ) {
      var tempObject = {
        'name' : current.getAttribute('dimension'),
        'label' : current.getAttribute('dimension').split(':')[1].replace(/([A-Z])/g, ' $1').trim().slice(0, -5),
      };
      
      var axisExists = UserFiltersMoreFiltersAxesSetUp.axisOptions.filter(function( element ) {
        return element['name'] === tempObject['name'];
      });
      
      if ( axisExists.length === 0 ) {
        UserFiltersMoreFiltersAxesSetUp.axisOptions.push(tempObject);
        
      }
      
    });
    UserFiltersMoreFiltersAxesSetUp.axisOptions.sort(function( first, second ) {
      if ( first['label'] > second['label'] ) {
        return 1
      }
      if ( first['label'] < second['label'] ) {
        return -1;
      }
      return 0;
    });
    
    document.getElementById('filters-axis-count').innerText = UserFiltersMoreFiltersAxesSetUp.axisOptions.length;
    
    UserFiltersMoreFiltersAxesSetUp.populate();
    
    callback();
  },
  
  populate : function( ) {
    var innerHtml = '';
    UserFiltersMoreFiltersAxesSetUp.axisOptions.forEach(function( current, index ) {
      innerHtml += '<div class="d-flex justify-content-between align-items-center w-100 px-2">';
      innerHtml += '<div class="form-check">';
      innerHtml += '<input  onclick="UserFiltersMoreFiltersAxes.clickEvent(event, this, ' + index
          + ')" title="Select/Deselect this option." class="form-check-input" type="checkbox" tabindex="9">';
      innerHtml += '<label class="form-check-label">' + current['label'] + '</label>';
      innerHtml += '</div></div>';
    });
    document.getElementById('user-filters-axis').innerHTML = innerHtml;
  }
};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var UserFiltersMoreFiltersAxes = {
  clickEvent : function( event, element, index ) {
    
    if ( event['target'] ) {
      if ( event['target'].checked ) {
        UserFiltersMoreFiltersAxes.addAxis(UserFiltersMoreFiltersAxesSetUp.axisOptions[index]);
      } else {
        UserFiltersMoreFiltersAxes.removeAxis(UserFiltersMoreFiltersAxesSetUp.axisOptions[index]);
      }
    }
  },
  
  addAxis : function( input ) {
    var newAxis = UserFiltersState.getAxes.filter(function( element ) {
      if ( input['name'] === element['name'] ) {
        return true;
      }
    });
    if ( newAxis.length === 0 ) {
      UserFiltersState.getAxes.push(input);
    }
    UserFiltersState.filterUpdates();
  },
  
  removeAxis : function( input ) {
    if ( UserFiltersState.getAxes.indexOf(input) >= 0 ) {
      UserFiltersState.getAxes.splice(UserFiltersState.getAxes.indexOf(input), 1);
      UserFiltersState.filterUpdates();
    }
  }

};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var UserFiltersMoreFiltersBalances = {
  clickEvent : function( event, element, index ) {
    
    var balance = (index === 0) ? 'debit' : 'credit';
    if ( event['target'] ) {
      if ( event['target'].checked ) {
        UserFiltersMoreFiltersBalances.addBalance(balance);
      }
      else {
        UserFiltersMoreFiltersBalances.removeBalance(balance);
      }
    }
  },
  
  addBalance : function( input ) {
    UserFiltersState.getBalance.push(input);
    UserFiltersState.filterUpdates();
  },
  
  removeBalance : function( input ) {
    if ( UserFiltersState.getBalance.indexOf(input) >= 0 ) {
      UserFiltersState.getBalance.splice(UserFiltersState.getBalance.indexOf(input), 1);
      UserFiltersState.filterUpdates();
    }
  }

};

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
    var innerHtml = '';
    UserFiltersMoreFiltersMeasureSetUp.measuresOptions.forEach(function( current, index ) {
      innerHtml += '<div class="d-flex justify-content-between align-items-center w-100 px-2">';
      innerHtml += '<div class="form-check">';
      innerHtml += '<input onclick="UserFiltersMoreFiltersMeasure.clickEvent(event, this, ' + index
          + ')" title="Select/Deselect this option." class="form-check-input" type="checkbox" tabindex="9">';
      innerHtml += '<label class="form-check-label">' + FiltersUnitref.getMeasure(current) + '</label>';
      innerHtml += '</div></div>';
    });
    document.getElementById('user-filters-measures').innerHTML = innerHtml;
  }
};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var UserFiltersMoreFiltersMeasure = {
  clickEvent : function( event, element, index ) {
    if ( event['target'] ) {
      if ( event['target'].checked ) {
        UserFiltersMoreFiltersMeasure.addMeasure(UserFiltersMoreFiltersMeasureSetUp.measuresOptions[index]);
      }
      else {
        UserFiltersMoreFiltersMeasure.removeMeasure(UserFiltersMoreFiltersMeasureSetUp.measuresOptions[index]);
      }
    }
  },
  
  addMeasure : function( input ) {
    UserFiltersState.getMeasure.push(input);
    UserFiltersState.filterUpdates();
  },
  
  removeMeasure : function( input ) {
    if ( UserFiltersState.getMeasure.indexOf(input) >= 0 ) {
      UserFiltersState.getMeasure.splice(UserFiltersState.getMeasure.indexOf(input), 1);
      UserFiltersState.filterUpdates();
    }
  }

};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var UserFiltersMoreFiltersMembersSetUp = {
  filtersSet : false,
  
  membersOptions : [ ],
  
  setMembers : function( callback ) {
    var foundDimensions = document.getElementById('dynamic-xbrl-form').querySelectorAll('[dimension*="Axis"]');
    var foundDimensionsArray = Array.prototype.slice.call(foundDimensions);
    var tempArray = [ ];
    foundDimensionsArray.forEach(function( current ) {
      
      if ( current && current['innerText'] ) {
        // gatherAllIDS.push(current.closest('[id]').getAttribute('id'))
        var tempObject = {
          'parentID' : current.closest('[id]').getAttribute('id'),
          'name' : current['innerText'].trim(),
          'label' : (current['innerText'].trim().split(':')[1].endsWith('Member')) ? (current['innerText'].trim()
              .split(':')[1].replace(/([A-Z])/g, ' $1').trim().slice(0, -7))
              : (current['innerText'].trim().split(':')[1].replace(/([A-Z])/g, ' $1').trim()),
        };
        
        // var memberExists =
        // UserFiltersMoreFiltersMembersSetUp.membersOptions.filter(function(
        // element ) {
        // return element['name'] === tempObject['name'];
        // });
        
        // console.log(memberExists);
        
        // if ( memberExists.length === 0 ) {
        // console.log('new name!');
        tempArray.push(tempObject);
        // UserFiltersMoreFiltersMembersSetUp.membersOptions.push(tempObject);
        
        // }
      }
      
    });
    tempArray.sort(function( first, second ) {
      if ( first['label'] > second['label'] ) {
        return 1
      }
      if ( first['label'] < second['label'] ) {
        return -1;
      }
      return 0;
    });
    
    var setAllParentIDS = function( currentName, finalized, tempArray, iterate ) {
      for ( iterate = iterate || 0; iterate < tempArray.length; iterate++ ) {
        if ( tempArray[iterate]['name'] === currentName ) {
          finalized[finalized.length - 1]['parentID'].push(tempArray[iterate]['parentID']);
        } else {
          finalized.push({
            'parentID' : [ tempArray[iterate]['parentID'] ],
            'name' : tempArray[iterate]['name'],
            'label' : tempArray[iterate]['label']
          });
          return setAllParentIDS(tempArray[iterate]['name'], finalized, tempArray, iterate);
        }
      }
      return finalized;
    }
    document.getElementById('filters-members-count').innerText = UserFiltersMoreFiltersMembersSetUp.membersOptions.length;
    if ( tempArray.length ) {
      var currentName = tempArray[0]['name'];
      
      var finalized = [ {
        'parentID' : [ ],
        'name' : tempArray[0]['name'],
        'label' : tempArray[0]['label'],
      } ];
      
      UserFiltersMoreFiltersMembersSetUp.membersOptions = setAllParentIDS(currentName, finalized, tempArray, 0);
      UserFiltersMoreFiltersMembersSetUp.populate();
    }
    callback();
  },
  
  populate : function( ) {
    var innerHtml = '';
    UserFiltersMoreFiltersMembersSetUp.membersOptions.forEach(function( current, index ) {
      innerHtml += '<div class="d-flex justify-content-between align-items-center w-100 px-2">';
      innerHtml += '<div class="form-check">';
      innerHtml += '<input  onclick="UserFiltersMoreFiltersMembers.clickEvent(event, this, ' + index
          + ')" title="Select/Deselect this option." class="form-check-input" type="checkbox" tabindex="9">';
      innerHtml += '<label class="form-check-label">' + current['label'] + '</label>';
      innerHtml += '</div></div>';
    });
    document.getElementById('user-filters-members').innerHTML = innerHtml;
  }
};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var UserFiltersMoreFiltersMembers = {
  clickEvent : function( event, element, index ) {
    
    if ( event['target'] ) {
      if ( event['target'].checked ) {
        UserFiltersMoreFiltersMembers.addMembers(UserFiltersMoreFiltersMembersSetUp.membersOptions[index]);
      } else {
        UserFiltersMoreFiltersMembers.removeMembers(UserFiltersMoreFiltersMembersSetUp.membersOptions[index]);
      }
    }
  },
  
  addMembers : function( input ) {
    var newMembers = UserFiltersState.getMembers.filter(function( element ) {
      if ( input['name'] === element['name'] ) {
        return true;
      }
    });
    if ( newMembers.length === 0 ) {
      UserFiltersState.getMembers.push(input);
    }
    UserFiltersState.filterUpdates();
  },
  
  removeMembers : function( input ) {
    if ( UserFiltersState.getMembers.indexOf(input) >= 0 ) {
      UserFiltersState.getMembers.splice(UserFiltersState.getMembers.indexOf(input), 1);
      UserFiltersState.filterUpdates();
    }
  }

};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var UserFiltersMoreFiltersPeriodSetUp = {
  filtersSet : false,
  
  periodsOptions : [ ],
  
  setPeriods : function( callback ) {
    
    var nameSpace = '';
    for ( var ns in Constants.getHTMLAttributes ) {
      
      if ( Constants.getHTMLAttributes[ns] === 'http://www.xbrl.org/2003/instance' ) {
        nameSpace += ns.split(':')[1] + '\\:period,';
      }
    }
    
    if ( nameSpace ) {
      
      nameSpace = nameSpace.substring(0, nameSpace.length - 1);
      
      var foundPeriods = document.getElementById('dynamic-xbrl-form').querySelectorAll(nameSpace);
      
      var foundPeriodsArray = Array.prototype.slice.call(foundPeriods);
      foundPeriodsArray.forEach(function( current ) {
        
        var periodDate = FiltersContextref.getPeriod(current.parentElement.getAttribute('id'));
        var contextRef = current.parentElement.getAttribute('id');
        var periodYear = moment(periodDate, [ 'MM/DD/YYYY', 'As of MM/DD/YYYY' ]).year();
        
        var yearExists = UserFiltersMoreFiltersPeriodSetUp.periodsOptions.filter(function( element, index ) {
          if ( element['year'] === periodYear ) {
            return element;
          }
        });
        
        if ( yearExists.length > 0 ) {
          UserFiltersMoreFiltersPeriodSetUp.periodsOptions.forEach(function( nestedCurrent ) {
            if ( nestedCurrent['year'] === periodYear ) {
              
              var addNewOption = true;
              nestedCurrent['options'].forEach(function( finalCurrent, finalIndex, finalArray ) {
                if ( finalCurrent['instanceDate'] === periodDate ) {
                  finalCurrent['contextref'].push(contextRef);
                  addNewOption = false;
                }
              });
              if ( addNewOption ) {
                var tempOptions = {
                  'contextref' : [ contextRef ],
                  'instanceDate' : periodDate
                };
                nestedCurrent['options'].push(tempOptions);
              }
            }
          });
        } else {
          var tempObj = {
            'year' : periodYear,
            'options' : [ {
              'contextref' : [ contextRef ],
              'instanceDate' : periodDate
            } ]
          };
          UserFiltersMoreFiltersPeriodSetUp.periodsOptions.push(tempObj);
        }
      });
    }
    var filtersPeriodsCount = 0;
    UserFiltersMoreFiltersPeriodSetUp.periodsOptions.forEach(function( current ) {
      filtersPeriodsCount += current['options'].length;
    });
    
    document.getElementById('filters-periods-count').innerText = filtersPeriodsCount;
    
    UserFiltersMoreFiltersPeriodSetUp.periodsOptions = UserFiltersMoreFiltersPeriodSetUp.periodsOptions.sort(function(
        first, second ) {
      if ( first['year'] > second['year'] ) {
        return -1;
      }
      if ( first['year'] < second['year'] ) {
        return 1;
      }
      return 0;
    });
    
    UserFiltersMoreFiltersPeriodSetUp.populateParentCollapse('user-filters-periods',
        UserFiltersMoreFiltersPeriodSetUp.periodsOptions);
    
    callback();
  },
  
  populateParentCollapse : function( parentId, arrayOfInfo ) {
    var parentDiv = document.querySelector('#' + parentId + ' .list-group');
    parentDiv.innerHTML = '';
    arrayOfInfo.forEach(function( current, index ) {
      
      var innerHtml = '';
      innerHtml += '<div class="d-flex justify-content-between align-items-center w-100 px-1">';
      innerHtml += '<div class="form-check">';
      
      innerHtml += '<input onclick="UserFiltersMoreFiltersPeriod.parentClick(event, this, ' + index
          + ')" title="Select/Deselect all options below." class="form-check-input" type="checkbox" tabindex="9">';
      innerHtml += '<label class="form-check-label">';
      innerHtml += '<a href="#period-filters-accordion-' + index + '" data-toggle="collapse" tabindex="9">'
          + current['year'] + '</a>';
      innerHtml += '</label>';
      innerHtml += '</div>';
      innerHtml += '<span class="badge badge-secondary">';
      innerHtml += current['options'].length;
      innerHtml += '</span>';
      innerHtml += '</button>';
      innerHtml += '</div>';
      innerHtml += '<div data-parent="#user-filters-periods" id="period-filters-accordion-' + index
          + '" class="collapse">';
      
      // we add all the individual 'options'
      current['options'].forEach(function( nestedCurrent, nestedIndex ) {
        innerHtml += '<div class="d-flex justify-content-between align-items-center w-100 px-2">';
        innerHtml += '<div class="form-check">';
        
        innerHtml += '<input onclick="UserFiltersMoreFiltersPeriod.childClick(event, this, ' + index + ', '
            + nestedIndex
            + ')" title="Select/Deselect this option." class="form-check-input" type="checkbox" tabindex="9">';
        innerHtml += '<label class="form-check-label">';
        innerHtml += nestedCurrent['instanceDate'];
        innerHtml += '</label>';
        innerHtml += '</div>';
        innerHtml += '</div>';
      });
      innerHtml += '</div>';
      parentDiv.innerHTML += innerHtml;
    });
  }

};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var UserFiltersMoreFiltersPeriod = {
  
  clickEvent : function( event, element ) {
    if ( (event['target'] && event['target'].getAttribute('data-filter')) ) {
      var dataFilter = JSON.parse(decodeURIComponent(event['target'].getAttribute('data-filter')));
      if ( dataFilter['all'] ) {
        UserFiltersMoreFiltersPeriod.parentClick(dataFilter, event['target']);
      }
      else {
        UserFiltersMoreFiltersPeriod.childClick(event, element, dataFilter);
      }
    }
  },
  
  parentClick : function( event, element, parentIndex ) {
    UserFiltersMoreFiltersPeriod.checkToggleAll(event, element, parentIndex);
  },
  
  childClick : function( event, element, parentIndex, childIndex ) {
    UserFiltersMoreFiltersPeriod.checkToggle(event, element, parentIndex, childIndex);
  },
  
  checkToggleAll : function( filter, element, parentIndex ) {
    var foundInputs = document.querySelectorAll('#period-filters-accordion-' + parentIndex + ' input[type=checkbox]');
    var foundInputsArray = Array.prototype.slice.call(foundInputs);
    if ( element.checked ) {
      // check all of the children
      foundInputsArray.forEach(function( current ) {
        current.checked = true;
      });
      UserFiltersMoreFiltersPeriod.setStateFromParent(parentIndex, true);
    }
    else {
      // uncheck all of the children
      foundInputsArray.forEach(function( current ) {
        current.checked = false;
      });
      UserFiltersMoreFiltersPeriod.setStateFromParent(parentIndex, false);
    }
  },
  
  checkToggle : function( filter, element, parentIndex, childIndex ) {
    if ( element.checked ) {
      // check this child
      UserFiltersMoreFiltersPeriod.setStateFromChild(parentIndex, childIndex, true);
    }
    else {
      // uncheck this child
      UserFiltersMoreFiltersPeriod.setStateFromChild(parentIndex, childIndex, false);
    }
  },
  
  setStateFromParent : function( parentIndex, addIsTrueRemoveIsFalse ) {
    if ( addIsTrueRemoveIsFalse ) {
      // we add to our state
      var newPeriods = UserFiltersMoreFiltersPeriodSetUp.periodsOptions[parentIndex]['options'].filter(function(
          element ) {
        if ( UserFiltersState.getPeriod.indexOf(element) === -1 ) {
          return true;
        }
      });
      UserFiltersState.getPeriod = UserFiltersState.getPeriod.concat(newPeriods);
    }
    else {
      // we remove from our state
      var removePeriods = UserFiltersMoreFiltersPeriodSetUp.periodsOptions[parentIndex]['options'].map(function(
          current, index ) {
        if ( UserFiltersState.getPeriod.indexOf(current) >= 0 ) {
          return current;
        }
      });
      UserFiltersState.getPeriod = UserFiltersState.getPeriod.filter(function( element ) {
        return removePeriods.indexOf(element) === -1;
      });
    }
    UserFiltersState.filterUpdates();
  },
  
  setStateFromChild : function( parentIndex, childIndex, addIsTrueRemoveIsFalse ) {
    if ( addIsTrueRemoveIsFalse ) {
      // we add to our state
      var newPeriod = UserFiltersState.getPeriod
          .filter(function( element ) {
            if ( UserFiltersMoreFiltersPeriodSetUp.periodsOptions[parentIndex]['options'][childIndex]['instanceDate'] === element['instanceDate'] ) {
              return true;
            }
          });
      if ( newPeriod.length === 0 ) {
        UserFiltersState.getPeriod
            .push(UserFiltersMoreFiltersPeriodSetUp.periodsOptions[parentIndex]['options'][childIndex]);
      }
      
    }
    else {
      // we remove from our state
      UserFiltersState.getPeriod = UserFiltersState.getPeriod
          .filter(function( element ) {
            if ( UserFiltersMoreFiltersPeriodSetUp.periodsOptions[parentIndex]['options'][childIndex]['instanceDate'] === element['instanceDate'] ) {
              return false;
            }
            return true;
          });
    }
    UserFiltersState.filterUpdates();
  }

};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var UserFiltersMoreFiltersScaleSetUp = {
  filtersSet : false,
  
  scaleOptions : [ ],
  
  setScales : function( callback ) {
    var foundScales = document.getElementById('dynamic-xbrl-form').querySelectorAll('[scale]');
    var foundScalesArray = Array.prototype.slice.call(foundScales);
    
    UserFiltersMoreFiltersScaleSetUp.scaleOptions = foundScalesArray.map(function( current ) {
      return current.getAttribute('scale');
    }).filter(function( element, index, array ) {
      return array.indexOf(element) === index;
    }).sort().reverse();
    
    document.getElementById('filters-scales-count').innerText = UserFiltersMoreFiltersScaleSetUp.scaleOptions.length;
    
    UserFiltersMoreFiltersScaleSetUp.populate();
    
    callback();
  },
  
  populate : function( ) {
    
    var innerHtml = '';
    UserFiltersMoreFiltersScaleSetUp.scaleOptions.forEach(function( current, index ) {
      innerHtml += '<div class="d-flex justify-content-between align-items-center w-100 px-2">';
      innerHtml += '<div class="form-check">';
      innerHtml += '<input onclick="UserFiltersMoreFiltersScale.clickEvent(event, this, ' + index
          + ')" title="Select/Deselect this option." class="form-check-input" type="checkbox">';
      innerHtml += '<label class="form-check-label">' + FiltersScale.getScale(current) + '</label>';
      innerHtml += '</div></div>';
    });
    document.getElementById('user-filters-scales').innerHTML = innerHtml;
    
  }
};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var UserFiltersMoreFiltersScale = {
  
  clickEvent : function( event, element, index ) {
    
    if ( event['target'] ) {
      if ( event['target'].checked ) {
        UserFiltersMoreFiltersScale.addScale(UserFiltersMoreFiltersScaleSetUp.scaleOptions[index]);
      }
      else {
        UserFiltersMoreFiltersScale.removeScale(UserFiltersMoreFiltersScaleSetUp.scaleOptions[index]);
      }
    }
  },
  
  addScale : function( input ) {
    UserFiltersState.getScale.push(input);
    UserFiltersState.filterUpdates();
  },
  
  removeScale : function( input ) {
    if ( UserFiltersState.getScale.indexOf(input) >= 0 ) {
      UserFiltersState.getScale.splice(UserFiltersState.getScale.indexOf(input), 1);
      UserFiltersState.filterUpdates();
    }
  }

};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';
var UserFiltersState = {
  
  getAxes : [ ],
  
  getMembers : [ ],
  
  getBalance : [ ],
  
  getMeasure : [ ],
  
  getPeriod : [ ],
  
  getScale : [ ],
  
  getDataRadios : 0,
  
  setDataRadios : function( input ) {
    if ( input >= 0 && input <= 5 ) {
      UserFiltersState.getDataRadios = input;
    } else {
      ErrorsMinor.unknownError();
    }
  },
  
  getTagsRadios : 0,
  
  setTagsRadio : function( input ) {
    if ( input >= 0 && input <= 2 ) {
      UserFiltersState.getTagsRadios = input;
    } else {
      ErrorsMinor.unknownError();
    }
  },
  
  getSectionsRadios : 0,
  
  setSectionsRadios : function( input ) {
    if ( input >= 0 && input <= 4 ) {
      UserFiltersState.getSectionsRadios = input;
    } else {
      ErrorsMinor.unknownError();
    }
  },
  
  getUserSearch : {},
  
  setUserSearch : function( input ) {
    UserFiltersState.getUserSearch = input;
  },
  
  filterUpdates : function( ) {
    UserFiltersDropdown.init();
    
    Taxonomies.loadingTaxonomyCount(function( ) {
      
      var foundTaxonomies = document.getElementById('dynamic-xbrl-form').querySelectorAll('[contextref]');
      var foundTaxonomiesArray = Array.prototype.slice.call(foundTaxonomies);
      
      foundTaxonomiesArray.forEach(function( current ) {
        
        // special highlight
        UserFiltersState.search(current, enabledTaxonomy);
        
        var enabledTaxonomy = true;
        
        enabledTaxonomy = UserFiltersState.dataRadios(current, enabledTaxonomy)

        enabledTaxonomy = UserFiltersState.tagRadios(current, enabledTaxonomy);
        
        enabledTaxonomy = UserFiltersState.periods(current, enabledTaxonomy);
        
        enabledTaxonomy = UserFiltersState.measures(current, enabledTaxonomy);
        
        enabledTaxonomy = UserFiltersState.axes(current, enabledTaxonomy);
        
        enabledTaxonomy = UserFiltersState.members(current, enabledTaxonomy);
        
        enabledTaxonomy = UserFiltersState.scales(current, enabledTaxonomy);
        
        enabledTaxonomy = UserFiltersState.balances(current, enabledTaxonomy);
        
        current.setAttribute('enabled-taxonomy', enabledTaxonomy);
        
      });
      
      Taxonomies.updateTaxonomyCount(Object.keys(UserFiltersState.getUserSearch).length === 2);
    });
  },
  
  dataRadios : function( current, enabledTaxonomy ) {
    // 0 = All
    // 1 = Amounts Only
    // 2 = Text Only
    // 3 = Calculations Only
    // 4 = Negatives Only
    // 5 = Additional Items Only
    if ( UserFiltersState.getDataRadios && enabledTaxonomy ) {
      switch ( UserFiltersState.getDataRadios ) {
        case 5 : {
          // Additional Items Only
          if ( !current.hasAttribute('isAdditionalItemsOnly') ) {
            current.setAttribute('isAdditionalItemsOnly', TaxonomiesGeneral.isParentNodeHidden(current));
          }
          if ( current.hasAttribute('isAdditionalItemsOnly')
              && current.getAttribute('isAdditionalItemsOnly') === 'true' ) {
            return true;
          }
          return false;
          
          break;
        }
        case 4 : {
          // Negatives Only
          if ( !current.hasAttribute('isNegativesOnly') ) {
            current.setAttribute('isNegativesOnly', ((current.getAttribute('sign') === '-') ? true : false));
          }
          if ( current.hasAttribute('isNegativesOnly') && current.getAttribute('isNegativesOnly') === 'true' ) {
            return true;
          }
          return false;
          
          break;
        }
        case 3 : {
          // Calculations Only
          if ( !current.hasAttribute('isCalculationsOnly') ) {
            var elementIsCalculationsOnly = false;
            if ( Constants.getMetaCalculationsParentTags.indexOf(current.getAttribute('name').replace(':', '_')) >= 0 ) {
              if ( FiltersContextref.getDimensions(current.getAttribute('contextref')).length === 0 ) {
                elementIsCalculationsOnly = true;
              }
            }
            
            current.setAttribute('isCalculationsOnly', elementIsCalculationsOnly);
          }
          if ( current.hasAttribute('isCalculationsOnly') && current.getAttribute('isCalculationsOnly') === 'true' ) {
            return true;
          }
          return false;
          
          break;
        }
        case 2 : {
          // Text Only
          if ( !current.hasAttribute('isTextOnly') ) {
            current.setAttribute('isTextOnly',
                ((current['tagName'].split(':')[1].toLowerCase() === 'nonnumeric') ? true : false));
          }
          if ( current.hasAttribute('isTextOnly') && current.getAttribute('isTextOnly') === 'true' ) {
            return true;
          }
          return false;
          
          break;
        }
        case 1 : {
          // Amounts Only
          if ( !current.hasAttribute('isAmountsOnly') ) {
            current.setAttribute('isAmountsOnly',
                ((current['tagName'].split(':')[1].toLowerCase() === 'nonfraction') ? true : false));
          }
          if ( current.hasAttribute('isAmountsOnly') && current.getAttribute('isAmountsOnly') === 'true' ) {
            return true;
          }
          return false;
          
          break;
        }
        default : {
          // All
          return true;
        }
      }
    }
    return enabledTaxonomy;
  },
  
  tagRadios : function( current, enabledTaxonomy ) {
    // 0 = All
    // 1 = Standard Only
    // 2 = Custom Only
    if ( UserFiltersState.getTagsRadios && enabledTaxonomy ) {
      switch ( UserFiltersState.getTagsRadios ) {
        case 2 : {
          // Custom Only
          
          if ( !current.hasAttribute('isCustomOnly') ) {
            current.setAttribute('isCustomOnly',
                (current.getAttribute('name').split(':')[0].toLowerCase() === Constants.getMetaCustomPrefix) ? true
                    : false);
          }
          
          if ( current.hasAttribute('isCustomOnly') && current.getAttribute('isCustomOnly') === 'true' ) {
            return true;
          }
          return false;
          
          break;
        }
        case 1 : {
          // Standard Only
          if ( !current.hasAttribute('isStandardOnly') ) {
            current.setAttribute('isStandardOnly',
                (current.getAttribute('name').split(':')[0].toLowerCase() !== Constants.getMetaCustomPrefix) ? true
                    : false);
          }
          
          if ( current.hasAttribute('isStandardOnly') && current.getAttribute('isStandardOnly') === 'true' ) {
            return true;
          }
          return false;
          
          break;
        }
        default : {
          // All
          return true;
        }
      }
    }
    return enabledTaxonomy;
  },
  
  periods : function( current, enabledTaxonomy ) {
    
    if ( UserFiltersState.getPeriod.length && enabledTaxonomy ) {
      
      for ( var i = 0; i < UserFiltersState.getPeriod.length; i++ ) {
        if ( UserFiltersState.getPeriod[i]['contextref'].indexOf(current.getAttribute('contextref')) >= 0 ) {
          return true;
        }
      }
      return false;
    }
    return enabledTaxonomy;
  },
  
  measures : function( current, enabledTaxonomy ) {
    
    if ( UserFiltersState.getMeasure.length && enabledTaxonomy ) {
      
      if ( current.hasAttribute('unitref') ) {
        for ( var i = 0; i < UserFiltersState.getMeasure.length; i++ ) {
          if ( current.getAttribute('unitref') === UserFiltersState.getMeasure[i] ) {
            return true;
          }
        }
      }
      return false;
      
    }
    return enabledTaxonomy;
  },
  
  axes : function( current, enabledTaxonomy ) {
    if ( UserFiltersState.getAxes.length && enabledTaxonomy ) {
      
      for ( var i = 0; i < UserFiltersState.getAxes.length; i++ ) {
        if ( document.querySelector('#dynamic-xbrl-form [id="' + current.getAttribute('contextref') + '"] [dimension="'
            + UserFiltersState.getAxes[i]['name'] + '"]') ) {
          return true;
        }
      }
      return false;
      
    }
    return enabledTaxonomy;
  },
  
  members : function( current, enabledTaxonomy ) {
    
    if ( UserFiltersState.getMembers.length && enabledTaxonomy ) {
      for ( var i = 0; i < UserFiltersState.getMembers.length; i++ ) {
        for ( var k = 0; k < UserFiltersState.getMembers[i]['parentID'].length; k++ ) {
          if ( current.getAttribute('contextref') === UserFiltersState.getMembers[i]['parentID'][k] ) {
            return true;
          }
        }
      }
      return false;
      
    }
    return enabledTaxonomy;
  },
  
  scales : function( current, enabledTaxonomy ) {
    if ( UserFiltersState.getScale.length && enabledTaxonomy ) {
      
      for ( var i = 0; i < UserFiltersState.getScale.length; i++ ) {
        if ( UserFiltersState.getScale[i] === current.getAttribute('scale') ) {
          return true;
        }
      }
      return false;
      
    }
    return enabledTaxonomy;
  },
  
  balances : function( current, enabledTaxonomy ) {
    if ( UserFiltersState.getBalance.length && enabledTaxonomy ) {
      
      var tagInformation = FiltersName.getTag(current.getAttribute('name'));
      
      if ( tagInformation.length && tagInformation[0]['crdr'] ) {
        if ( UserFiltersState.getBalance.indexOf(tagInformation[0]['crdr']) >= 0 ) {
          return true;
        }
      }
      return false;
    }
    return enabledTaxonomy;
  },
  
  search : function( current, enabledTaxonomy ) {
    var fullContentToRegexAgainst = '';
    var highlight = false;
    if ( (Object.keys(UserFiltersState.getUserSearch).length === 2) ) {
      
      if ( UserFiltersState.getUserSearch['options'].indexOf(1) >= 0 ) {
        // include fact name
        fullContentToRegexAgainst += ' ' + SearchFunctions.elementNameForRegex(current);
      }
      
      if ( UserFiltersState.getUserSearch['options'].indexOf(2) >= 0 ) {
        // include fact content
        fullContentToRegexAgainst += ' ' + SearchFunctions.elementContentForRegex(current);
      }
      
      if ( UserFiltersState.getUserSearch['options'].indexOf(3) >= 0 ) {
        // include labels
        fullContentToRegexAgainst += ' ' + SearchFunctions.elementLabelForRegex(current);
      }
      
      if ( UserFiltersState.getUserSearch['options'].indexOf(4) >= 0 ) {
        // include definitions
        fullContentToRegexAgainst += ' ' + SearchFunctions.elementDefinitionForRegex(current);
      }
      
      if ( UserFiltersState.getUserSearch['options'].indexOf(5) >= 0 ) {
        // include dimensions
        fullContentToRegexAgainst += ' ' + SearchFunctions.elementDimensionsForRegex(current);
      }
      
      if ( UserFiltersState.getUserSearch['options'].indexOf(6) >= 0
          || UserFiltersState.getUserSearch['options'].indexOf(7) >= 0
          || UserFiltersState.getUserSearch['options'].indexOf(9) >= 0
          || UserFiltersState.getUserSearch['options'].indexOf(10) >= 0 ) {
        // include references
        fullContentToRegexAgainst += ' '
            + SearchFunctions.elementReferencesForRegex(current, UserFiltersState.getUserSearch);
      }
      
      highlight = UserFiltersState.getUserSearch.regex.test(fullContentToRegexAgainst);
      
    }
    
    if ( Taxonomies.isElementContinued(current) ) {
      UserFiltersState.setContinuedAtHighlight(current, highlight);
    } else {
      current.setAttribute('highlight-taxonomy', highlight);
    }
    
  },
  
  setContinuedAtHighlight : function( current, highlight ) {
    if ( current ) {
      current.setAttribute('highlight-taxonomy', highlight);
      if ( current.hasAttribute('continuedat') ) {
        
        UserFiltersState.setContinuedAtHighlight(document.getElementById('dynamic-xbrl-form').querySelector(
            '[id="' + current.getAttribute('continuedat') + '"]'), highlight);
      }
    }
    
  }

};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var UserFiltersTagsRadios = {
  
  clickEvent : function( event, element ) {
    
    // 0 = All
    // 1 = Standard Only
    // 2 = Custom Only
    
    var radioValue = parseInt(element.querySelector('input[name="tags-radios"]:checked').value);
    UserFiltersState.setTagsRadio(radioValue);
    UserFiltersState.filterUpdates();
  }

};

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

var AppInit = {
  init : function( internalUrl, callback ) {
    
    AppInit.emptySidebars();
    
    internalUrl = internalUrl || false;
    
    HelpersUrl.init(internalUrl, function( result ) {
      console.log(result);
      if ( result ) {
        AjaxForm.init(function( formLoaded ) {
          if ( formLoaded ) {
            Images.updateLinks();
            // Links.init();
            
            // TODO maybe put this somewhere better
            if ( HelpersUrl.getAnchorTag ) {
              
              var elementToScrollTo = document.getElementById('dynamic-xbrl-form').querySelector(
                  HelpersUrl.getAnchorTag);
              
              if ( elementToScrollTo ) {
                
                elementToScrollTo.scrollIntoView({
                  'block' : Constants.scrollPosition
                });
              }
              
            }
            // we wait for the event loop to clear
            // this is to allow the form to be inserted into the application
            setTimeout(function( ) {
              callback(true);
            });
          } else {
            ErrorsMajor.formLinksNotFound();
            callback(false);
          }
          
        });
      } else {
        document.getElementById('xbrl-form-loading').classList.add('d-none');
        Taxonomies.updateTaxonomyCount();
        ErrorsMajor.urlParams();
        callback(false);
      }
    });
    
  },
  
  initialSetup : function( ) {
    
    AjaxMeta.init(function( result ) {
      Taxonomies.addEventAttributes();
      Links.init();
      
      if ( result ) {
        
        var disabledNavs = document.querySelectorAll('.navbar .disabled, [disabled]');
        var disabledNavsArray = Array.prototype.slice.call(disabledNavs);
        
        disabledNavsArray.forEach(function( current ) {
          current.classList.remove('disabled');
          current.removeAttribute('disabled');
        });
      } else {
        
        var disabledNavs = document
            .querySelectorAll('.navbar .disabled:not(.meta-required), [disabled]:not(.meta-required) ');
        var disabledNavsArray = Array.prototype.slice.call(disabledNavs);
        
        document.querySelector('[name="search-options"][value="1"]').removeAttribute('checked');
        
        disabledNavsArray.forEach(function( current ) {
          current.classList.remove('disabled');
          current.removeAttribute('disabled');
        });
      }
      
    });
  },
  
  additionalSetup : function( ) {
    // we go here if a user changes forms (metalinks is already in memory)
    Taxonomies.addEventAttributes();
    Taxonomies.setFilterAttributes();
    Links.init();
    Sections.formChange();
    TaxonomiesMenu.formChange();
  },
  
  emptySidebars : function( ) {
    
    UserFiltersMoreFiltersPeriodSetUp.filtersSet = false;
    UserFiltersMoreFiltersMeasureSetUp.filtersSet = false;
    UserFiltersMoreFiltersAxesSetUp.filtersSet = false;
    UserFiltersMoreFiltersScaleSetUp.filtersSet = false;
    
    document.getElementById('error-container').innerHTML = '';
    
    var taxonomyCount = document.querySelectorAll('.taxonomy-total-count');
    var taxonomyCountArray = Array.prototype.slice.call(taxonomyCount);
    
    taxonomyCountArray.forEach(function( current ) {
      current.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    });
    
    var loadingHtml = '<span class="text-center py-5">Loading.</span>';
    if ( Sections.currentlyOpenChildMenu.hasOwnProperty('id')
        && Sections.currentlyOpenChildMenu.hasOwnProperty('group') ) {
      document.querySelector(Sections.currentlyOpenChildMenu['id'] + ' .list-group').innerHTML = loadingHtml;
    }
    
    document.querySelector('#taxonomies-menu-list-pagination .pagination').innerHTML = '';
    document.querySelector('#taxonomies-menu-list-pagination .list-group').innerHTML = loadingHtml;
    
  }

};

(function( ) {
  // the user has just loaded up the application
  AppInit.init('', function( formLoaded ) {
    if ( formLoaded ) {
      
      AppInit.initialSetup();
    } else {
      
      ErrorsMajor.inactive();
    }
  });
})();

/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment 
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

'use strict';

function setCustomCSS( ) {
  
  var taggedData = localStorage.getItem('taggedData') || 'FF6600';
  var searchResults = localStorage.getItem('searchResults') || 'FFD700';
  var selectedFact = localStorage.getItem('selectedFact') || '003768';
  var tagShading = localStorage.getItem('tagShading') || 'rgba(255,0,0,0.3)';
  var cssObject = {
    
    '#dynamic-xbrl-form [enabled-taxonomy="true"][continued-taxonomy="false"]' : {
      'border-top' : '2px solid #' + taggedData,
      'border-bottom' : '2px solid #' + taggedData,
      'display' : 'inline',
    },
    
    '#dynamic-xbrl-form [enabled-taxonomy="true"][continued-main-taxonomy="true"]' : {
      'border-left' : '2px solid #' + taggedData,
      'border-right' : '2px solid #' + taggedData,
    },
    
    '#dynamic-xbrl-form [enabled-taxonomy="true"][text-block-taxonomy="true"]' : {
      'border-left' : '2px solid #' + taggedData,
      'border-right' : '2px solid #' + taggedData,
      'border-top' : 'none',
      'border-bottom' : 'none'
    },
    
    '#dynamic-xbrl-form [highlight-taxonomy="true"]' : {
      'background-color' : '#' + searchResults + ' !important',
    },
    
    '#dynamic-xbrl-form [highlight-taxonomy="true"] > *' : {
      'background-color' : '#' + searchResults + ' !important',
    },
    
    '#dynamic-xbrl-form [selected-taxonomy="true"][continued-main-taxonomy="true"]' : {
      'border-left' : '2px solid #' + selectedFact,
      'border-right' : '2px solid #' + selectedFact,
    },
    
    '#dynamic-xbrl-form [selected-taxonomy="true"][text-block-taxonomy="true"]' : {
      'border-left' : '2px solid #' + selectedFact,
      'border-right' : '2px solid #' + selectedFact,
    },
    
    '#dynamic-xbrl-form [selected-taxonomy="true"][continued-taxonomy="false"]' : {
      'border' : '3px solid #' + selectedFact + ' !important',
      'display' : 'inline',
    },
    
    '#dynamic-xbrl-form [hover-taxonomy="true"]' : {
      'background-color' : tagShading,
    },
    
    '.tagged-data-example-1' : {
      'border-top' : '2px solid #' + taggedData,
      'border-bottom' : '2px solid #' + taggedData,
    },
    
    '.search-results-example-1' : {
      'background-color' : '#' + searchResults,
    },
    
    '.tag-shading-exmple-1:hover' : {
      'background-color' : tagShading,
    },
    
    '.selected-fact-example-1' : {
      'border' : '3px solid #' + selectedFact + ' !important',
    },
  
  };
  
  var cssString = '';
  
  for ( var key in cssObject ) {
    cssString += ' ' + key + '{';
    for ( var nestedKey in cssObject[key] ) {
      cssString += nestedKey + ':' + cssObject[key][nestedKey] + ';';
    }
    cssString += '}';
  }
  var head = document.head || document.getElemtsByTagName('head')[0];
  var style = document.getElementById('customized-styles') || document.createElement('style');
  
  head.appendChild(style);
  
  style.type = 'text/css';
  style.id = 'customized-styles';
  
  style.appendChild(document.createTextNode(cssString));
  
}
(function( ) {
  setCustomCSS();
  var taggedData = localStorage.getItem('taggedData') || 'FF6600';
  var searchResults = localStorage.getItem('searchResults') || 'FFD700';
  var selectedFact = localStorage.getItem('selectedFact') || '003768';
  var tagShading = localStorage.getItem('tagShading') || 'rgba(255,0,0,0.3)';
  
  var pickrOptions = [ {
    'selector' : '#tagged-data-color-picker',
    'default' : taggedData
  }, {
    'selector' : '#search-results-color-picker',
    'default' : searchResults
  }, {
    'selector' : '#selected-fact-color-picker',
    'default' : selectedFact
  }, {
    'selector' : '#tag-shading-color-picker',
    'default' : tagShading
  } ];
  
  pickrOptions.forEach(function( current, index ) {
    Pickr.create({
      'el' : current['selector'],
      'default' : current['default'],
      'components' : {
        preview : true,
        hue : true,
        opacity : (index === 3),
        interaction : {
          save : true,
          cancel : true,
        },
      },
      strings : {
        save : 'Set',
        cancel : 'Reset'
      }
    }).on('save', function( color, instance ) {
      if ( color ) {
        // set as new color
        switch ( index ) {
          case 0 : {
            localStorage.setItem('taggedData', color.toHEXA().toString().replace('#', ''));
            setCustomCSS();
            break;
          }
          case 1 : {
            localStorage.setItem('searchResults', color.toHEXA().toString().replace('#', ''));
            setCustomCSS();
            break;
          }
          case 2 : {
            localStorage.setItem('selectedFact', color.toHEXA().toString().replace('#', ''));
            setCustomCSS();
            break;
          }
          case 3 : {
            localStorage.setItem('tagShading', color.toRGBA().toString(0));
            setCustomCSS();
            break;
          }
          default : {
            ErrorsMinor.unknownError();
          }
        }
      }
      
    }).on('cancel', function( instance ) {
      // reset back to the original value(s)
      switch ( index ) {
        case 0 : {
          instance.setColor('FF6600');
          localStorage.setItem('taggedData', 'FF6600');
          setCustomCSS();
          break;
        }
        case 1 : {
          instance.setColor('FFD700');
          localStorage.setItem('searchResults', 'FFD700');
          setCustomCSS();
          break;
        }
        case 2 : {
          instance.setColor('003768');
          localStorage.setItem('selectedFact', '003768');
          setCustomCSS();
          break;
        }
        case 3 : {
          instance.setColor('rgba(255,0,0,0.3)');
          localStorage.setItem('tagShading', 'rgba(255,0,0,0.3)');
          setCustomCSS();
          break;
        }
        default : {
          ErrorsMinor.unknownError();
        }
      }
    });
  });
})();
