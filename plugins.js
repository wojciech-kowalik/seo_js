
'use strict';

/**
 * Seo jQuery plugins
 * 
 * @namespace jQuery
 * @author w.kowalik 
 * @access public
 * @copyright visualnet.pl 2013
 */

(function ( $ ) {

    /**
     * Check if DOM element exists then invoke function
     * 
     * @access public
     * @return DOMElement
     * @see example
     * 
     *  $('#example-element').seoIfExists(function () {
     *       this.exampleMethod()
     *       ....
     *       or
     *       some code
     *   });
     */
    jQuery.fn.seoIfExists = function( func ){

        if(!this.length){            
            console.warn('Element "'+this.selector+'" doesn\'t exists');
        }else{
            func.apply( this );
        }
        
        return this;

    };

}( jQuery ));