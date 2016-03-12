
'use strict';

/**
 * Seo code search class constructor
 * 
 * @class Seo.CodeSearch
 * @constructor 
 * @namespace Seo
 * @author w.kowalik 
 * @access public
 * @copyright visualnet.pl 2013
 */

Seo.CodeSearch = Class.create(Seo.Element.prototype,{
      
    /**
    * Init method after create instance
    * 
    * @method init
    * @return void
    */   
    init: function () {
              
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
         
        var options = this.getOptions();
        
        // select all elements
        $('.select-all-code').click(function () {
            if($(this).attr('checked')) {
                $('.select-multi-code').attr('checked','checked');
            }else {
                $('.select-multi-code').removeAttr('checked');
            }
                
        });
        
        // listerner on pager elements
        $('#code-search-list-pager').find('a').click(function (e) {
            
            e.preventDefault();
            
            self = $(this);
            
            $('#search-code').trigger('click', [
                self.find(".page").val(), 
                self.find(".phrase").val()
            ]);
            
        });        
  
    }
   
});

$(document).ready(function () {

    Seo.codeSearch = new Seo.CodeSearch();    
    Seo.codeSearch.setListeners();    

});