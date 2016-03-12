
'use strict';

/**
 * Seo monitoring questionnaire question edit class constructor
 * 
 * @class Seo.MonitoringQuestinnaireQuestionEdit
 * @constructor 
 * @namespace Seo
 * @author w.kowalik 
 * @access public
 * @copyright visualnet.pl 2014
 */

Seo.MonitoringQuestinnaireQuestionEdit = Class.create(Seo.MonitoringQuestionnaireEdit.prototype,{ 
      
    /**
    * Init method after create instance
    * 
    * @method init
    * @return void
    */   
    init: function () {
             
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
            url: Routing.generate('monitoring_questionnaire_question_sort', 
            {
                'direction': object.data('direction'), 
                'id': object.data('question-id')
            }),

            success: function (data) {
                
                if(data.state){
                    Seo.monitoringCategoryEdit.loadQuestionPartial();
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
            url: Routing.generate('monitoring_questionnaire_question_shift', 
            {
                'destination': destination, 
                'id': questionId,
                'sid': $('#survey').data('id'),
                'type': object.data('type')
            }),

            success: function (data) {
                
                if(data.state){
                    Seo.monitoringCategoryEdit.loadQuestionPartial();
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
             
        // add question
        $('.question-add').bind('click', function () {            
            self._addQuestionMonit($(this));
        });
        
        // edit question
        $('.question-edit').bind('click', function () {            
            self._editQuestion($(this));
        });        
        
        // manipulate question require
        $('.check-question').bind('click', function () {
            
            if($(this).is(':checked')) {
                $(this).button( "option", "label", "tak" );
            } else {
                $(this).button( "option", "label", "nie" );
            }
            $.ajax({
                type: "POST",
                url: Routing.generate('monitoring_questionnaire_question_require'),
                data: "id=" + $(this).attr('value') + "&require=" + $(this).is(':checked'),
                success: function(data) {
                    if(data.state == false) {
                        Seo.modalBox.error('Wystąpił błąd podczas zapisu');
                    }
                }
            });            
            
        });        
        
        // drop button
        $('.question-drop').on('click', function (e) {
            
            e.preventDefault();
            e.stopPropagation();
            
            Seo.modalBox.del($(this));
            
        });     
                
        // sort button
        $('.question-questionnaire-sort').on('click', function (e) {
            
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
                url: Routing.generate('monitoring_change_ordinal_side', {
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

    Seo.monitoringQuestinnaireQuestionEdit = new Seo.MonitoringQuestinnaireQuestionEdit();
    Seo.monitoringQuestinnaireQuestionEdit.setListeners();    
   
});
