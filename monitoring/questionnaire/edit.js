
'use strict';

/**
 * Seo monitoring questionnaire edit class constructor
 * 
 * @class Seo.MonitoringQuestionnaireEdit
 * @constructor 
 * @namespace Seo
 * @author w.kowalik 
 * @access public
 * @copyright visualnet.pl 2014
 */

Seo.MonitoringQuestionnaireEdit = Class.create(Seo.Element.prototype,{ 
      
    /**
    * Init method after create instance
    * 
    * @method init
    * @return void
    */   
    init: function () {
             
    },
    
    /**
    * Save question
    * 
    * @method _saveQuestion
    * @access private
    * @param {Object} object
    * @param {Integer} newQuestionId
    * @return {Boolean}
    */       
    _saveQuestion: function (object, newQuestionId) {
      
        if (newQuestionId == null) {
            newQuestionId = false;
        }
      
       var self = this, questions = [], message;
           
        
        if (newQuestionId) {
            questions.push(newQuestionId);
        } else {
            questions = self._multiSelect('select-multi-question');
        }
      
        if(questions.length === 0){
            Seo.modalBox.error('Nie wybrano żadnego pytania');
            return false;
        }
      
        $.ajax({
            type: 'GET',
            url: Routing.generate('monitoring_questionnaire_question_save'),
            data:{
                'cid': object.category_id,
                'sid': object.survey_id,
                'position': object.position,
                'questions[]': questions
            },
            
            success: function (data) {
                
                if(data.state){
                
                    if(data.notices){
                        
                        message = 'Poniższe pytania istnieją już na ankiecie:<br /><br />';
                        
                        $.each(data.notices, function (i, object) {
                            message += '<b>'+object+'</b><br />';
                        });                        
                        
                        Seo.modalBox.monit(message, {width: 420, height: 200, title: 'Ostrzeżenie'});
                    }
                    
                    if(data.reload){
                        Seo.monitoringCategoryEdit.loadQuestionPartial();
                    }
                
                }else{
                    Seo.modalBox.error('Wystąpił błąd podczas zapisu pytań');
                }
                
            },
            
            error: function() {
                Seo.modalBox.error(self._errorMonit);
            }

        });      
        
        return true;
      
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
    * Choose question
    * 
    * @method _chooseQuestion
    * @access private
    * @return Boolean
    */        
    _chooseQuestion: function (element) {
      
        var object = {}, 
            questionPosition = element.data('question-position');

        object.category_id = $('#category').data('id');
        object.survey_id = $('#survey').data('id');
        object.position = questionPosition;

        return this._saveQuestion(object); 
      
    },
         
    /**
    * Show add new question monit
    * 
    * @method _addNewQuestion
    * @access private
    * @return void
    */       
    _addNewQuestion: function (element) {
        
        var buttons = {}, self = this, object = {},
            content = $('<iframe></iframe>');
                                     
        content.attr('id', 'question-iframe');
        content.css('border','0px');
        content.css('width', '100%');
        content.css('height', '100%');
        content.attr('src', Routing.generate('monitoring_question_type', {layout: 'popup', group: element.data('type')}));
        
        buttons = {
          
          'Wybierz': function () {
              
                var newQuestionId = $('#question-iframe').contents().find('#question').data('id');
                
                if (newQuestionId === undefined) {
                    Seo.modalBox.error('Pytanie nie zostało zapisane');
                    return;
                }
              
                object.category_id = $('#category').data('id');
                object.survey_id = $('#survey').data('id');
                object.position = element.data('question-position');     
                
                self._saveQuestion(object, newQuestionId);
                
                $(this).dialog('close');
              
          },
          
          'Zamknij': function () {
              $(this).dialog('close');
          }
            
        };
        
        Seo.modalBox.generate($(this), content, false, buttons);        
        
    },
    
    /**
    * Show edit question monit
    * 
    * @method _addNewQuestion
    * @access private
    * @return void
    */       
    _editQuestion: function (element) {
        
        var buttons = {}, self = this, object = {},
            content = $('<iframe></iframe>');
                                     
        content.attr('id', 'question-iframe');
        content.css('border','0px');
        content.css('width', '100%');
        content.css('height', '100%');
        content.attr('src', Routing.generate('monitoring_question_edit', {id: element.data('question-id'), layout: 'popup'}));
                
        buttons = {

          'Zamknij': function () {
              $(this).dialog('close');
              Seo.monitoringCategoryEdit.loadQuestionPartial();
          }
            
        };
        
        Seo.modalBox.generate(element, content, false, buttons);        
        
    },    
    
    /**
    * Show add question monit
    * 
    * @method _addQuestionMonit
    * @access private
    * @param {Element} element
    * @return void
    */      
    _addQuestionMonit: function (element) {
     
        var buttons, self = this;
        
        element.data('href', Routing.generate('monitoring_questionnaire_question_add', {
            type: element.data('type')
        }));

        buttons =  {
            
            'Nowe pytanie': function() {
                self._addNewQuestion(element);       
            },
                        
            'Wybierz': function() {
                self._chooseQuestion(element);
            },
            
            'Wybierz i zakończ': function() {
                if(self._chooseQuestion(element)){
                    $(this).dialog('close');
                }
            },
            
            'Zamknij': function() {
                $(this).dialog('close');
            }	
        };
        
        Seo.modalBox.generate(element, false, true, buttons);         
      
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
            self = this;
      
        // listener for survey buttons 
        $('.survey-button').on('mouseover', function(){
            $(this).addClass('ui-state-hover'); 
        });
     
        $('.survey-button').on('mouseout', function(){
            $(this).removeClass('ui-state-hover'); 
        });  
        
        
        $('#survey-intro').attr('readonly','readonly');

        $('#survey-introduction').button({
            icons: {
                primary: 'ui-icon-pencil'
            }
        }).click(function() {
            $('#survey-introduction-form').submit();
        });

        // save introduction survey 
        $('#survey-introduction-form').submit(function() {
            
            var intro = $('#survey-intro');
            
            $.ajax({
                type: 'POST',
                url: Routing.generate('monitoring_questionnaire_introdution_save'),
                data:{
                    
                    id: intro.data('survey-id'),
                    survey_intro: intro.attr('value')
                    
                },
                success: function(msg) {
                    Seo.modalBox.monit('Wstęp dla ankiety został zapisany');
                }
                
            });
            
            return false;
        });    
                
        // save finish survey 
        $('#survey-finish-form').submit(function() {
            
            var finish = $('#survey-fin');
            
            $.ajax({
                type: 'POST',
                url: Routing.generate('monitoring_questionnaire_finish_save'),
                data:{
                    
                    id: finish.data('survey-id'),
                    survey_finish: finish.attr('value')
                    
                },
                success: function(msg) {
                    Seo.modalBox.monit('Zakończenie dla ankiety zostało zapisane');
                },
                error: function () {
                    Seo.modalBox.error(self._errorMonit);
                }
                
            });
            
            return false;
        });    
        
        // save finish button
        $('#survey-finish').button({
            icons: {
                primary: 'ui-icon-pencil'
            }
        }).click(function() {
            $('#survey-finish-form').submit();
        });  
        
        // show survey preview
        $('#preview').on('click', function () {
            var url = $(this).data('url');
            window.open(url, 'Ankieta', 'menubar=0,resizable=1,width=930,height=620,scrollbars=yes');
        });     
                                  
        // show survey header
        $('.survey-heading').click(function() {
            $(this).next('.survey-option-content').slideToggle(500);
        });   
        
        // filter question by criteria
        $('.question-filter').on('click', function () {
           
           var checkbox = $(this).find('input');
           
           if( checkbox.is(':checked') == false ){
               checkbox.attr('checked', true);
           }else{
               checkbox.attr('checked', false);
           }
           
           Seo.monitoringCategoryEdit.loadQuestionPartial();
          
        });
                 
    }
   
});

$(document).ready(function () {

    Seo.monitoringQuestionnaireEdit = new Seo.MonitoringQuestionnaireEdit();
    Seo.monitoringQuestionnaireEdit.setListeners();    
   
});
