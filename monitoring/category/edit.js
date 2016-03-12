
'use strict';

/**
 * Seo monitoring category edit class constructor
 * 
 * @class Seo.MonitoringCategoryEdit
 * @constructor 
 * @namespace Seo
 * @author w.kowalik 
 * @access public
 * @copyright visualnet.pl 2013
 */

Seo.MonitoringCategoryEdit = Class.create(Seo.Element.prototype,{
            
    /**
    * Init method after create instance
    * 
    * @method init
    * @return void
    */   
    init: function () {
              
    },
    
    /**
    * Load partial data
    * 
    * @method loadQuestionPartial
    * @access public
    * @param {Integer} type
    * @param {Boolean} filter
    * @return void
    */      
    loadQuestionPartial: function () {
        
        var url, filter, self = this,
        showAddQuestionButton = $('#show-add-question-button').data('content');
        
        // get show button value
        if(showAddQuestionButton != ''){
            showAddQuestionButton = 1;
        }else{
            showAddQuestionButton = 0;
        }
            
        // get show button value
        if( $('.question-filter-checkbox').is(':checked') ){
            filter = 1;
        }else{
            filter = 0;
        }               
                           
        url = Routing.generate('monitoring_questionnaire_questions', {
            'sid': $('#survey').data('id'),
            'cid': $('#category').data('id'),
            'show': showAddQuestionButton,
            'filter': filter
        });  
                        
        $.ajax({
            type: 'GET',
            url: url,

            success: function (data) {    

                $('#survey-questions').html(data);
                $('#survey-questions').css('opacity',1);
                
            },
            
            beforeSend: function () {
                $('#survey-questions').css('opacity', 0.35);
            },            
            
            error: function() {
                Seo.modalBox.error(self._errorMonit);
            }

        });         
        
    },
        
    /**
    * Load tree
    * 
    * @method _shiftCriteria
    * @access public
    * @return void
    */      
    loadTree: function () {
      
        var self = this;
            
        $.ajax({
            type: 'GET',
            url: Routing.generate('monitoring_category_tree', {
                id: $('#category-root').data('value')
            }),

            success: function (data) {    
                $('#tree').html(data);
                $('#tree').css('opacity', 1);
            },     
            
            beforeSend: function () {
                $('#tree').css('opacity', 0.35);
            },              
            
            error: function() {
                Seo.modalBox.error(self._errorMonit);
            }

        });       
      
    },
   
    /**
    * Load survey structure
    * 
    * @method load
    * @return void
    */     
    load: function () {
    
        var url = Routing.generate('monitoring_questionnaire_modify'),
        node = $('#tree').dynatree('getActiveNode'),
        rootNode = $('#tree').dynatree('getRoot'),
        realRoot = rootNode.childList[0],
        self = this,
        surveyId = $('#survey-choice').val();

        if( (surveyId == 0) || (surveyId == null) ) {
            Seo.modalBox.monit('Ankieta nie została wybrana');
            $('#survey-preview').html('');
            return;
        }

        if( node ){
            url += '?cid=' + node.data.key;
        } else {
            url += '?cid=' + realRoot.data.key;
        }
                
        url += '&sid=' + surveyId;
        
        $.ajax({
            type: 'GET',
            url: url,

            success: function (data) {    
                
                $('#survey-preview').html(data);
                                                
                // load survey questions
                self.loadQuestionPartial();
                
            },
            
            beforeSend: function () {
                $('#survey-preview').html(self._spinner);
            },            
            
            error: function() {
                Seo.modalBox.error(self._errorMonit);
            }

        });         
        
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
        treeCategoryId = $('#tree-category'),
        self = this;
    
        $('#tree').dynatree({
            
            onCreate: function (){
                
                $('.tree-modal-handler').button({
                    icons: {
                        primary: "ui-icon-plus"
                    }
                }).addClass('ui-state-hover');

                $('.tree-modal-handler').off('click');

                $('.tree-modal-handler').on('mouseout', function () {
                    $('.tree-modal-handler').addClass('ui-state-hover');
                });

                $('.tree-modal-handler').on('click', function(e) {

                    e.preventDefault();
                    e.stopPropagation();

                    Seo.modalBox.generate($(this), false, true);
                    
                }); 
                                   
            },
            
            onActivate: function(node) {
                self.load(this.getActiveNode().data.key);
            },
            
            autoExpandMS: 1000,
            preventVoidMoves: true, // Prevent dropping nodes 'before self', etc.            
            minExpandLevel: 2
        });      
    
        $('#survey-choice').on('change', function(){
       
            var element = $(this), 
            url = Routing.generate('monitoring_questionnaire_modify'),
            node = $('#tree').dynatree('getActiveNode'),
            rootNode = $('#tree').dynatree('getRoot'),
            realRoot = rootNode.childList[0];
               
            $('#survey-choice option:selected').each(function () {
                url += '?sid=' + element.attr('value');
            });

            if( node ){
                url += '&cid=' + node.data.key;
            } else {
                url += '&cid=' + realRoot.data.key;
            }
            
            $.ajax({
                url: Routing.generate('monitoring_category_save_selected_survey'),
                type: 'GET',
                async: false,
                data: {
                    id : element.val()
                }
            });   
            
            self.load();
       
        });
     
        $('#tree-expand').on('click', function() {
            $('#tree').dynatree('getRoot').visit(function(node){
                node.toggleExpand();
            });
            return false;
        });    
        
        $('#edit-survey').on('click', function(e){

            e.preventDefault();
            e.stopPropagation();

            var surveyId = $('#survey-choice').val();

            if( (surveyId == 0) || (surveyId == null) ) {
                Seo.modalBox.monit('Ankieta nie została wybrana');
                $('#survey-preview').html('');
                return;
            }

            $(this).data('href', Routing.generate('monitoring_questionnaire_edit', {
                id: surveyId
            }));

            Seo.modalBox.generate($(this), false, true);      

        });         
    
        if(treeCategoryId.length != 0){

            $('#tree').dynatree('getTree').activateKey(treeCategoryId.data('id'));
            $('#tree').dynatree('getTree').selectKey(treeCategoryId.data('id')).makeVisible();
            $('#tree').dynatree('getTree').selectKey(treeCategoryId.data('id')).select(true);

        }     
      
    }
   
});

$(document).ready(function () {

    Seo.monitoringCategoryEdit = new Seo.MonitoringCategoryEdit();    
    Seo.monitoringCategoryEdit.setListeners();    

});