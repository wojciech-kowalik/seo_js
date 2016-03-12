
'use strict';

/**
 * Seo certificate edit class constructor
 * 
 * @class Seo.CertificateEdit
 * @constructor 
 * @namespace Seo
 * @author w.kowalik 
 * @access public
 * @copyright visualnet.pl 2013
 */

Seo.SurveyQuestionEdit = Class.create(Seo.SurveyEdit.prototype,{ 
      
    /**
    * Init method after create instance
    * 
    * @method init
    * @return void
    */   
    init: function () {
             
    },
    
    mySubscriber: function( msg, data ){
        console.log( msg, data );
    },
         
    /**
    * Sort question
    * 
    * @method _sortQuestion
    * @access private
    * @param {Object} object
    * @return {Boolean}
    */     
    _sortQuestion: function (object) {
        
        var self = this;
        
        $.ajax({
            type: 'GET',
            url: Routing.generate('seo_tools_survey_question_sort', 
            {
                'direction': object.data('direction'), 
                'id': object.data('question-id')
            }),

            success: function (data) {
                
                if(data.state){
                    Seo.categoryEdit.loadQuestionPartial(object.data('type'));
                }else{
                    Seo.modalBox.error('Wystąpił błąd podczas sortowania pytań');
                }
                
            },
            
            error: function() {
                Seo.modalBox.error(self._errorMonit);
            }

        }); 
        
        return true;
      
    },
    
    /**
    * Sort question
    * 
    * @method _saveShift
    * @access private
    * @param {Object} object
    * @param {mixed} destination
    * @param {Integer} questionId
    * @return {Boolean}
    */         
    _saveShift: function (object, destination, questionId) {
        
      var error, self = this;  
        
      $.ajax({
            type: 'GET',
            url: Routing.generate('seo_tools_survey_question_shift', 
            {
                'destination': destination, 
                'id': questionId,
                'sid': $('#survey').data('id'),
                'type': object.data('type')
            }),

            success: function (data) {
                
                if(data.state){
                    Seo.categoryEdit.loadQuestionPartial(object.data('type'));
                }else{
                                        
                    if(data.error) {
                        error = data.error;
                    } else {
                        error = 'Wystąpił błąd podczas sortowania pytań';
                    }
                    
                    Seo.modalBox.error(error);

                }
                
            },
            
            error: function() {
                Seo.modalBox.error(self._errorMonit);
            }

        });         
        
    },
    
    /**
    * Shift question
    * 
    * @method _shiftQuestion
    * @access private
    * @param {Object} object
    * @return {Boolean}
    */     
    _shiftQuestion: function (object) {
        
        var questionId = object.data('question-id'),
        destination = $('.shift-step-'+questionId),
        self = this;
        
        if(destination.val() === '') {
            Seo.modalBox.error('Nie podano przesunięcia');
            return false; 
        }
        
        // save shift position
        self._saveShift(object, destination.val(), questionId);
        
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
         
        var options = this.getOptions(), 
                      self = this, startPosition, endPosition, object = {};
                
        // unbinders        
        $('.question-add').unbind('click');  
        $('.question-edit').unbind('click');  
        $('.check-question').unbind('click');
        $('.question-drop').unbind('click');
        $('.question-sort').unbind('click');
        //$('.question-shift').unbind('click');
        $('.related-categories').unbind('click');
        $('.question-criterion-choice').unbind('change');
             
        // manipulate question require
        $('.check-question').bind('click', function () {
            
            if($(this).is(':checked')) {
                $(this).button( "option", "label", "tak" );
            } else {
                $(this).button( "option", "label", "nie" );
            }
            $.ajax({
                type: "POST",
                url: Routing.generate('seo_tools_survey_question_require'),
                data: "id=" + $(this).attr('value') + "&require=" + $(this).is(':checked'),
                success: function(data) {
                    if(data.state == false) {
                        Seo.modalBox.error('Wystąpił błąd podczas zapisu');
                    }
                }
            });            
            
        });

        // add question
        $('.question-add').bind('click', function () {            
            self._addQuestionMonit($(this));
        });
        
        // edit question
        $('.question-edit').bind('click', function () {            
            self._editQuestion($(this));
        });        
        
        // drop button
        $('.question-drop').on('click', function (e) {
            
            e.preventDefault();
            e.stopPropagation();
            
            Seo.modalBox.del($(this));
            
        });     
                
        // sort button
        $('.question-sort').on('click', function (e) {
            
            e.preventDefault();
            e.stopPropagation();
            
            self._sortQuestion($(this));
            
        });
        
        // shift button
        $('.question-shift').on('click', function (e) {
            
            e.preventDefault();
            e.stopPropagation();
            
            self._shiftQuestion($(this));
            
        });           
            
        $('.ordinal-side').on('click', function () {
           
            $.ajax({

                type: "GET",
                dataType: 'json',
                url: Routing.generate('seo_tools_change_ordinal_side', {
                    'id': $(this).data('id'),
                    'type': $(this).data('type')
                }),  
                
                success: function (data) {

                    if (data.state) {
                        Seo.modalBox.monit('Ustawienie strony zostało zmienione');
                    }

                },

                error: function(data) {
                    Seo.modalBox.error('Wystąpił błąd zmiany ustawień');
                }
            });   
           
        });             
            
        $('.related-categories').on('click', function (e) {
          
            e.preventDefault();
            e.stopPropagation();
            
            self._addQuestionRelatedCategoryMonit($(this));
          
        }); 
        
        // criterion choice for question
        $('.question-criterion-choice').on('change', function() {
            
            var p = $(this).data('question-id'), c = $(this).val();
            
            $.ajax({
                type: "POST",
                url: Routing.generate('seo_tools_survey_change_criterion', {
                    sqid: p,
                    cid: c
                }),

                success: function(data) {
                    
                    if(data.state) {
                        
                        Seo.modalBox.monit('Dla wybranego pytania ankiety zmieniono kryterium');
                        Seo.categoryEdit.loadQuestionPartial(self.type.QUESTIONNAIRE_QUESTION);
                        
                    }else {
                        Seo.modalBox.error(data.error);
                    }
                },
                error: function () {
                    Seo.modalBox.error(self._errorMonit);
                }
                
            });            
        });     
                
        // turn off sorting if filter is active
        if( $('.question-filter-checkbox').is(':checked') == false ){
        
            // question move
            $( "#sortable" ).sortable({

                revert: true,
                cursor: 'move',
                start: function(event, ui) {
                    ui.item.data('start-position', ui.item.index() + 1);
                },
                change: function(event, ui) {

                    startPosition = ui.item.data('start-position');
                    endPosition = ui.placeholder.index();

                    if (startPosition < endPosition) {
                        ui.item.data('end-position', endPosition);
                    } else {
                        ui.item.data('end-position', endPosition + 1);
                    }

                },
                update: function(event, ui) {
                },
                stop: function (event, ui) {

                    object = $('<div></div>').data('type', ui.item.data('type'));
                    self._saveShift(object, ui.item.data('end-position'), ui.item.data('question-id'));

                }
            });        
        
        }
            
    }
   
});

$(document).ready(function () {

    Seo.surveyQuestionEdit = new Seo.SurveyQuestionEdit();
    Seo.surveyQuestionEdit.setListeners();    
   
});
