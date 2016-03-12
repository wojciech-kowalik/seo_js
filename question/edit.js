
'use strict';

/**
 * Seo question edit class constructor
 * 
 * @class Seo.QuestionEdit
 * @constructor 
 * @namespace Seo
 * @author w.kowalik 
 * @access public
 * @copyright visualnet.pl 2013
 */

Seo.QuestionEdit = Class.create(Seo.Element.prototype,{
      
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
         
    $('#tabs-question').tabs({
        cache: true,
        load: function (e, ui) {
            $(ui.panel).find('.tab-loading').remove();
        },
        select: function (e, ui) {
            var panel = $(ui.panel);

            if (panel.is(':empty')) {
                panel.append('<div class="tab-loading">Proszę czekać...</div>');
            }
            }
        });

    $('.question-list-back').click(function() {
        window.location = Routing.generate('seo_tools_question');
    });  

    $('.question-save').click(function() {
        $(this).closest('form').submit();
    });  
    
    $('.question-save-as').click(function() {
        
        var form = $(this).closest('form');
        form.attr('action', Routing.generate('seo_tools_question_save_as', {id: $(this).data('id'), layout: $('#layout').data('content')}));
        
        form.submit();
    });     
    
    if(options.isNewObject === 1){
        $('#tabs-question').tabs({ disabled: [1] });    
    }  

    if(options.isSuggestView === 1){
        $('#tabs-question').tabs({ selected: 1 });
    }
    
    $('#question-versioning').click(function(e){
        
       e.preventDefault();
       e.stopPropagation();        
        
       var suggestions = $('.suggest-list tbody tr'), 
           questionType = $('#seo_tools_question_question_type_id'),
           questionTypeValues = [1,3,4];
        
       $('#form-question-edit').attr('action', $(this).data('href')); 
                       
        if($.inArray(+questionType.val(), questionTypeValues) !== -1){
        
            if(suggestions.length === 0){
                Seo.modalBox.error('Niemożliwe utworzenie wersji - brak sugestii dla pytania');
                return;
            }
        
        }
        
        // add first version of question with default data
        if($('#has-versions').data('content') == 0){   
            
            $.ajax({
                type: 'GET',
                dataType: 'json',
                url: Routing.generate('seo_tools_question_primary_version', {
                    id: $('#question-id').data('id')
                }),

                success: function(data) {

                    if(data.state){
                        $('#form-question-edit').submit();
                    }else{
                        Seo.modalBox.error('Wystąpił błąd podczas tworzenia wersji podstawowej');
                    }

                },
                error: function(data) {
                    Seo.modalBox.error('Wystąpił błąd podczas tworzenia wersji podstawowej');
                }
            });   

        }else{
            $('#form-question-edit').submit();
        }        

    });
             
   }
   
});

$(document).ready(function () {

    Seo.questionEdit = new Seo.QuestionEdit();
        
    Seo.questionEdit.setOptions({
        isNewObject: $('#is-new-object').data('content'), 
        isSuggestView: $('#is-suggest-view').data('content')
    });
    
    Seo.questionEdit.setListeners();    

});