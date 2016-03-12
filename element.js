
'use strict';

/**
 * Seo element class constructor
 * 
 * @class Seo.Element
 * @constructor 
 * @namespace Seo
 * @author w.kowalik 
 * @access public
 * @copyright visualnet.pl 2013
 */

Seo.Element = Class.create(Seo.prototype,{


    /**
    * Spinner img
    * 
    * @property _spinner
    * @type String
    */   
    _spinner: $('<img>').attr('src', '/images/spinner.gif'),

    /**
    * Message when there are answers
    * and user add/delete a suggestion
    * 
    * @property _addDeleteMonit
    * @type String
    */      
    _addDeleteMonit: 'test1',
    
    /**
    * Message when user is going to version
    * 
    * @property _versioningMonit
    * @type String
    */      
    _versioningMonit: 'test2',        
    
    /**
    * Message when error appears in system
    * 
    * @property _errorMonit
    * @type String
    */      
    _errorMonit: 'Wystąpił wewnętrzny błąd systemu',   
    
    /**
    * Message when user will delete item
    * 
    * @property _deleteMonit
    * @type String
    */      
    _deleteMonit: 'Czy jesteś tego pewien?',       

    /**
    * Options object
    * 
    * @property _options
    * @type Object
    */
   _options: {},
   
    /**
    * Element type
    * 
    * @property type
    * @type Object
    */     
    type: {
        'QUESTIONNAIRE_QUESTION': 1, 
        'CERTIFICATE_QUESTION': 2
    },   
   
    /**
    * Init method after create instance
    * 
    * @method init
    * @return void
    */   
   init: function () {
      
   },
   
    /**
    * Get options
    * 
    * @method getOptions
    * @access public
    * @return {Object} options 
    */       
   getOptions: function () {
       
        return this._options;
    
   },
   
    /**
    * Set options
    * 
    * @method setOptions
    * @access public
    * @throw Error
    * @return void
    */   
   setOptions: function (options) {
       
        if ($.isPlainObject(options) === false) {
            throw new Error('[element.js] Wrong options parameter - object required');
        }
        
        this._options = options;
       
   },
   
    /**
    * Set listeners
    * 
    * @method setListeners
    * @access public
    * @throw Error
    * @return void
    */
   setListeners: function () {
             
   }
   
});