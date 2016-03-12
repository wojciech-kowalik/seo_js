
'use strict';

/**
 * Seo question add class constructor
 * 
 * @class Seo.MonitoringQuestionAdd
 * @constructor 
 * @namespace Seo
 * @author w.kowalik 
 * @access public
 * @copyright visualnet.pl 2013
 */

Seo.MonitoringQuestionAdd = Class.create(Seo.Element.prototype,{
      
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
         
        var options = this.getOptions(), 
            spinner = this._spinner.css('position', 'relative').css('top', '50px'),
            spinnerContainer = $('<div>').css('text-align', 'center').css('width', '100%');     
         
        // search button listener 
        $('#search-question').button({
            icons: {
                primary: "ui-icon ui-icon-search"
            }
        }).on('click', function(e, page, phrase) {
                    
            if(page === undefined){
                page = 1;
            }
            
            if(phrase === undefined){
                phrase = $('#phrase').val();
            }            
  
            $.ajax({
                type: 'POST',
                url: Routing.generate('monitoring_question_search'),
                data:{
                    page: page,
                    phrase: phrase
                },
            
                beforeSend: function () {
                    spinnerContainer.append(spinner);
                    $('#question-result').html(spinnerContainer);
                },
            
                success: function(data) {
                    $('#question-result').html(data);
                }

            });        
        
        }); 
        
        // clear filter button
        $('#search-clear-question').button({
            icons: {
                primary: "ui-icon ui-icon-close"
            }
        }).on('click', function() {
            
            $('#phrase').val('');
            $('#search-question').trigger('click');
            
        });
             
    }
   
});

$(document).ready(function () {

    Seo.monitoringQuestionAdd = new Seo.MonitoringQuestionAdd();    
    Seo.monitoringQuestionAdd.setListeners();    

});