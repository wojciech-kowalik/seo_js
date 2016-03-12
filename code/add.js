
'use strict';

/**
 * Seo code add class constructor
 * 
 * @class Seo.CodeAdd
 * @constructor 
 * @namespace Seo
 * @author w.kowalik 
 * @access public
 * @copyright visualnet.pl 2013
 */

Seo.CodeAdd = Class.create(Seo.Element.prototype,{
      
    /**
    * Init method after create instance
    * 
    * @method init
    * @return void
    */   
    init: function () {
              
    },
    
   /**
    * Show add code monit
    * 
    * @method _addCodeMonit
    * @access private
    * @param {Element} element
    * @return void
    */      
    _addCodeMonit: function (element) {
     
        var buttons, self = this;
        
        element.data('href', Routing.generate('seo_tools_question_code_book_add', {id: $('#question').data('id')}));

        buttons =  {
                        
            'Wybierz': function() {
                self._saveCode(element, false);
            },
            
            'Wybierz i zakończ': function() {
                
                if(self._saveCode(element, true)){
                    
                    $(this).dialog('close');
                }
            },
            
            'Zamknij': function() {
                $(this).dialog('close');
                window.location.reload();
            }	
        };
        
        Seo.modalBox.generate(element, false, true, buttons);         
      
    },  
    
    /**
    * Get selected elements
    * 
    * @method _multiSelect
    * @access private
    * @return {Array} elements
    */     
    _multiSelect: function (elementType) {
        
        var elements = [];
        
        $('input.'+elementType+':checked').each(function (i) {
            elements[elements.length] = $(this).val();
        });
        
        return elements;     
        
    },    
    
   /**
    * Save code to question
    * 
    * @method _saveCode
    * @access private
    * @param {Object} object
    * @param {Boolean} forceReload
    * @return {Boolean}
    */       
    _saveCode: function (object, forceReload) {
      
       var self = this, codes = [], message;

        codes = self._multiSelect('select-multi-code');
 
        if(codes.length === 0){
            Seo.modalBox.error('Nie wybrano żadnego kodu');
            return false;
        }
      
        $.ajax({
            type: 'GET',
            url: Routing.generate('seo_tools_question_code_book_save', {
               'id': object.data('question-id'),
                'codes[]': codes
            }),
            
            success: function (data) {
                
                if(data.state){
                
                    if(data.notices){
                        
                        message = 'Poniższe kody zostały już przypisane:<br /><br />';
                        
                        $.each(data.notices, function (i, object) {
                            message += '<b>'+object+'</b><br />';
                        });                        
                        
                        Seo.modalBox.monit(message, {width: 420, height: 200, title: 'Ostrzeżenie'});
                        return;
                    }else{
                        Seo.modalBox.monit(data.monit, {width: 200, height: 150, title: 'Komunikat'});
                        $('#search-code').trigger('click');
                    }
                 
                    if(data.reload && forceReload){
                        window.location.reload();
                    }
                
                }else{
                    Seo.modalBox.error('Wystąpił błąd podczas zapisu kodów');
                }
                
            },
            
            error: function() {
                Seo.modalBox.error(self._errorMonit);
            }

        });      
        
        return true;
      
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
         
        var options = this.getOptions(), self = this,
            spinner = this._spinner.css('position', 'relative').css('top', '50px'),
            spinnerContainer = $('<div>').css('text-align', 'center').css('width', '100%');     
         
        $('#add-code-to-question').off('click');
                
        $('#add-code-to-question').on('click', function () {
           self._addCodeMonit($(this));
        });
         
        $('#back-to-question-list').on('click', function () {
           window.location.href = Routing.generate('seo_tools_question');
        }); 
         
        // search button listener 
        $('#search-code').button({
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
                url: Routing.generate('seo_tools_code_book_search'),
                data:{
                    page: page, 
                    phrase: phrase,
                    id: $('#question').data('id')
                },
            
                beforeSend: function () {
                    spinnerContainer.append(spinner);
                    $('#code-result').html(spinnerContainer);
                },
            
                success: function(data) {
                    $('#code-result').html(data);
                }

            });        
        
        }); 
        
        // clear filter button
        $('#search-clear-code').button({
            icons: {
                primary: "ui-icon ui-icon-close"
            }
        }).on('click', function() {
            
            $('#phrase').val('');
            $('#search-code').trigger('click');
            
        });
             
    }
   
});

$(document).ready(function () {

    Seo.codeAdd = new Seo.CodeAdd();    
    Seo.codeAdd.setListeners();    

});