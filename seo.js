
var Seo = Seo || {};

'use strict';

/**
 * Seo class
 * 
 * @class Seo
 * @constructor 
 * @namespace Seo
 * @author w.kowalik 
 * @access public
 * @copyright visualnet.pl 2013
 */
Seo = Class.create({
    
    /**
    * Number version
    * 
    * @property VERSION
    * @type String
    */    
    VERSION: '1.0',
    
    /**
    * Get version
    * 
    * @method getVersion
    * @access public
    * @return {String} version
    */      
    getVersion: function () {
        return this.VERSION;
    }
    
},true);
