
'use strict';

/**
 * Seo category edit class constructor
 * 
 * @class Seo.CategoryEdit
 * @constructor 
 * @namespace Seo
 * @author w.kowalik 
 * @access public
 * @copyright visualnet.pl 2013
 */

Seo.CategoryEdit = Class.create(Seo.Element.prototype,{
            
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
    loadQuestionPartial: function (type) {
        
        var typeName, url, filter, self = this,
        showAddQuestionButton = $('#show-add-question-button').data('content');
        
        // get show button value
        if(showAddQuestionButton != ''){
            showAddQuestionButton = 1;
        }else{
            showAddQuestionButton = 0;
        }
               
        if (type === this.type.QUESTIONNAIRE_QUESTION){
            
            typeName = 'questions';
            
            // get show button value
            if( $('.question-filter-checkbox').is(':checked') ){
                filter = 1;
            }else{
                filter = 0;
            }               
            
        } 
       
        if (type === this.type.CERTIFICATE_QUESTION){
            typeName = 'certificates';
        }                
               
        url = Routing.generate('seo_tools_survey_questions', {
            'sid': $('#survey').data('id'),
            'cid': $('#category').data('id'),
            'show': showAddQuestionButton,
            'type': type,
            'active': $('#is-session-active').data('value'),
            'filter': filter
        });  
                        
        $.ajax({
            type: 'GET',
            url: url,

            success: function (data) {    

                $('#survey-'+typeName).html(data);
                $('#survey-'+typeName).css('opacity',1);
            },
            
            beforeSend: function () {
                $('#survey-'+typeName).css('opacity', 0.35);
            },            
            
            error: function() {
                Seo.modalBox.error(self._errorMonit);
            }

        });         
        
    },
    
    /**
    * Load partial data
    * 
    * @method _shiftCriteria
    * @access private
    * @param {Integer} source
    * @param {Integer} destination
    * @return void
    */          
    _shiftCriteria: function (source, destination) {
      
        var url, self = this;
      
        url = Routing.generate('seo_tools_category_tree_shift', {
            'sid': source, 
            'did': destination, 
            'id': $('#category-root').data('value')
            }
        );
      
        $.ajax({
            type: 'GET',
            url: url,

            success: function (data) {    

                if(data.state){
                    $('#tree').css('opacity', 0.35);
                    window.location.reload();
                }else{
                    
                    if(data.error){
                        Seo.modalBox.error(data.error);
                        return;
                    }
                    
                }
                
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
            url: Routing.generate('seo_tools_category_tree', {
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
    
        var url = Routing.generate('seo_tools_survey_modify'),
        node = $('#tree').dynatree('getActiveNode'),
        rootNode = $('#tree').dynatree('getRoot'),
        realRoot = rootNode.childList[0],
        self = this,
        surveyId = $('#survey-choice').val();

        if(surveyId == 0) {
            Seo.modalBox.monit('Aniekta nie została wybrana');
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
                                
                // load certificates
                self.loadQuestionPartial(self.type.CERTIFICATE_QUESTION);
                
                // load survey questions
                self.loadQuestionPartial(self.type.QUESTIONNAIRE_QUESTION);
                
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
            
// temporary commented 20.08
// TODO: test it            
            
//            dnd: {
//               
//                onDragStart: function(node) {
//
//                    if($(node.data.title).data('criteria') == 1){
//                        return true;
//                    }
//                    
//                    return false;
//                },
//                onDragStop: function(node) {
//                },
//                onDragEnter: function(node, sourceNode) {
//                    
//                    if($(node.data.title).data('criteria') == 1){
//                        return true;
//                    }
//                    
//                    return false;
//
//                },
//                onDragOver: function(node, sourceNode, hitMode) {                    
//                    
//                    // Prevent dropping a parent below it's own child
//                    if(node.isDescendantOf(sourceNode)){
//                        return false;
//                    }
//                    
//                    // Prohibit creating childs in non-folders (only sorting allowed)
//                    if( !node.data.isFolder && hitMode === "over" ){
//                        return false;
//                    }
//                    
//                },
//                onDrop: function(node, sourceNode, hitMode, ui, draggable) {
//                    
//                    sourceNode.move(node, hitMode);
//                    self._shiftCriteria(sourceNode.data.key, node.data.key);
//
//                },
//                onDragLeave: function(node, sourceNode) {
//                }
//            },
            
            autoExpandMS: 1000,
            preventVoidMoves: true, // Prevent dropping nodes 'before self', etc.            
            minExpandLevel: 2
        });      
    
        $('#survey-choice').on('change', function(){
       
            var element = $(this), 
            url = Routing.generate('seo_tools_survey_modify'),
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
                url: Routing.generate('seo_tools_category_save_selected_survey'),
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

            $(this).data('href', Routing.generate('seo_tools_survey_edit', {
                id: $('#survey-choice').val()
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

    Seo.categoryEdit = new Seo.CategoryEdit();    
    Seo.categoryEdit.setListeners();    

});