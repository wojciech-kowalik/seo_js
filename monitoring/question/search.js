
'use strict';

/**
 * Seo question search class constructor
 * 
 * @class Seo.MonitoringQuestionSearch
 * @constructor 
 * @namespace Seo
 * @author w.kowalik 
 * @access public
 * @copyright visualnet.pl 2014
 */

Seo.MonitoringQuestionSearch = Class.create(Seo.Element.prototype,{
      
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
        $('.select-all-question').click(function () {
            if($(this).attr('checked')) {
                $('.select-multi-question').attr('checked','checked');
            }else {
                $('.select-multi-question').removeAttr('checked');
            }
                
        });
        
        // listerner on pager elements
        $('#question-search-list-pager').find('a').click(function (e) {
            
            e.preventDefault();
            
            var self = $(this);
            
            $('#search-question').trigger('click', [
                self.find(".page").val(), 
                self.find(".phrase").val()
            ]);
            
        });        
  
    }
   
});

$(document).ready(function () {

    Seo.monitoringQuestionSearch = new Seo.MonitoringQuestionSearch();    
    Seo.monitoringQuestionSearch.setListeners();    

});