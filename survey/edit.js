
'use strict';

/**
 * Seo survey edit class constructor
 * 
 * @class Seo.SurveyEdit
 * @constructor 
 * @namespace Seo
 * @author w.kowalik 
 * @access public
 * @copyright visualnet.pl 2013
 */

Seo.SurveyEdit = Class.create(Seo.Element.prototype,{ 
      
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
            url: Routing.generate('seo_tools_survey_question_save'),
            data:{
                'cid': object.category_id,
                'sid': object.survey_id,
                'position': object.position,
                'type': object.type,
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
                        Seo.categoryEdit.loadQuestionPartial(object.type);
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
        object.type = element.data('type');
        object.position = questionPosition;

        return this._saveQuestion(object); 
      
    },
    
    /**
    * Save related category
    * 
    * @method _saveRelatedCategory
    * @access private
    * @param {Object} object
    * @return {Boolean}
    */           
    _saveRelatedCategory: function (object) {
      
        var self = this, 
            categories = this._multiSelect('select-multi-category');

        if(categories.length === 0){
            Seo.modalBox.error('Nie wybrano żadnego kategorii');
            return false;
        } 
        
        $.ajax({
            type: 'GET',
            url: Routing.generate('seo_tools_category_related_select_save', {
                'sqid': object.data('question-id'),
                'categories[]': categories
            }),
            
            success: function (data) {
                
                if(data.state){
                    Seo.categoryEdit.loadQuestionPartial(self.type.QUESTIONNAIRE_QUESTION);
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
    * Show add category monit
    * 
    * @method _addQuestionRelatedCategoryMonit
    * @access private
    * @param {Element} element
    * @return void
    */      
    _addQuestionRelatedCategoryMonit: function (element) {
     
        var buttons, self = this;
        
        element.data('href', Routing.generate('seo_tools_category_related_select', {
            'sqid': element.data('question-id'),
            'group': $('#category-group').data('value')
        }));

        buttons =  {
                                    
            'Dodaj': function() {
                self._saveRelatedCategory(element);
            },
            
            'Dodaj i zakończ': function() {
                if(self._saveRelatedCategory(element)){
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
        content.attr('src', Routing.generate('seo_tools_question_type', {layout: 'popup', group: element.data('type')}));
        
        buttons = {
          
          'Wybierz': function () {
              
                var newQuestionId = $('#question-iframe').contents().find('#question').data('id');
                
                if (newQuestionId === undefined) {
                    Seo.modalBox.error('Pytanie nie zostało zapisane');
                    return;
                }
              
                object.category_id = $('#category').data('id');
                object.survey_id = $('#survey').data('id');
                object.type = element.data('type');
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
        content.attr('src', Routing.generate('seo_tools_question_edit', {id: element.data('question-id'), layout: 'popup'}));
                
        buttons = {

          'Zamknij': function () {
              $(this).dialog('close');
              Seo.categoryEdit.loadQuestionPartial(element.data('type'));
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
        
        element.data('href', Routing.generate('seo_tools_survey_question_add', {
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
        
       
        // check if session is active 
        if(options.isActive == 0){
        
            $('#survey-intro').attr('readonly','readonly');
        
            $('#survey-introduction').button({
                icons: {
                    primary: 'ui-icon-pencil'
                }
            }).click(function() {
                $('#survey-introduction-form').submit();
            });

        }

        // save introduction survey 
        $('#survey-introduction-form').submit(function() {
            
            var intro = $('#survey-intro');
            
            $.ajax({
                type: 'POST',
                url: Routing.generate('seo_tools_survey_introdution_save'),
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
        
        // save introduction button
        $('#survey-introduction').button({
            icons: {
                primary: 'ui-icon-pencil'
            }
        }).click(function() {
            $('#survey-introduction-form').submit();
        });         
        
        // save finish survey 
        $('#survey-finish-form').submit(function() {
            
            var finish = $('#survey-fin');
            
            $.ajax({
                type: 'POST',
                url: Routing.generate('seo_tools_survey_finish_save'),
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
           
           Seo.categoryEdit.loadQuestionPartial(self.type.QUESTIONNAIRE_QUESTION);
          
        });
                 
    }
   
});

$(document).ready(function () {

    Seo.surveyEdit = new Seo.SurveyEdit();
    Seo.surveyEdit.setOptions({
        isActive: $('#is-session-active').data('value')
    });
    Seo.surveyEdit.setListeners();    
   
});
