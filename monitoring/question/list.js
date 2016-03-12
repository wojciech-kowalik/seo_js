
'use strict';

/**
 * Seo question list class constructor
 * 
 * @class Seo.MonitoringQuestionList
 * @constructor 
 * @namespace Seo
 * @author w.kowalik 
 * @access public
 * @copyright visualnet.pl 2013
 */

Seo.MonitoringQuestionList = Class.create(Seo.Element.prototype,{
    
    counter: 0,
    
    /**
    * Init method after create instance
    * 
    * @method init
    * @return void
    */   
    init: function () {

        // initial classes    
        $('.search').addClass('ui-widget ui-widget-content ui-helper-clearfix ui-corner-all')
            .find('.search-header')
                .addClass('ui-widget-content ui-corner-all')
                .prepend('<span class="ui-icon ui-icon-plusthick" style="float: right;" title="zwiń/rozwiń"></span>')
                .end()
            .find('.search-content')
                .hide();

        // style question table
        $('#question-list').styleTable();

        // set sortable column
        $('.column').sortable({
            connectWith: '.column'
        });

    },    
    
    /**
    * Add code row
    * 
    * @method _addQuestionBookCode
    * @return void
    */   
    _addQuestionBookCode: function (){
        
        var table = $('table.book-codes'), 
                    row, numberTd, descriptionTd, textareaDescription,
                    examplificationTd, textareaExamplification, actionTd;
                    
        $('.delete-code-book').unbind('click');            
                    
        row = $('<tr></tr>');
        
        numberTd = $('<td></td>');
        numberTd.html('0<input type="hidden" name="code_id[]" value="new-'+this.counter+'" />' );
        
        descriptionTd = $('<td></td>');
        textareaDescription = $('<textarea></textarea>');
        textareaDescription.attr('name', 'description[new-'+this.counter+']');
        
        descriptionTd.append(textareaDescription);        
        
        examplificationTd = $('<td></td>');
        textareaExamplification = $('<textarea></textarea>');
        textareaExamplification.attr('name', 'examplification[new-'+this.counter+']');        
        
        examplificationTd.append(textareaExamplification); 
        
        actionTd = $('<td></td>');
        actionTd.html('<a class="delete-code-book" data-id="row-new-'+this.counter+'">Usuń</a>');
        
        row.append(numberTd);
        row.append(descriptionTd);
        row.append(examplificationTd);
        row.append(actionTd);
        
        row.attr('id', 'row-new-'+this.counter);
        
        table.append(row);
        
        $('.delete-code-book').button({
            text: false,
            icons: {
                primary: 'ui-icon-minus'
            }
        });   
        
        $('.delete-code-book').bind('click', function(e) {
          
            e.preventDefault();
            e.stopPropagation(); 
            
            $('#'+$(this).data('id')).remove();
          
        });        
        
        this.counter++;
        
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
       
        var self = this;
       
        // show search
        $('.search-header').click(function () {
            $('.search-header span.ui-icon:first').toggleClass('ui-icon-plusthick ui-icon-minusthick');
            $(this).parents('.search:first').find('.search-content').toggle();
        });
        
        // send search form
        $('.tool-button-submit-filter').click(function () {
            $('#questionListForm').submit();
        });
                    
        $('#question-list-form input').keypress(function (e) {
                       
            if (e.which == 13) {
                $('#question-list-form').submit();
            }
            
         });
        
        // go back to tools
        $('#back').click(function () {
            window.location = Routing.generate('monitoring_question_list');
        });

        $('.tool-button-delete').button({
            text: false,
            icons: {
                primary: 'ui-icon-minus'
            }
        });
        
        $('.tool-button-submit-filter').button({
            icons: {
                primary: 'ui-icon-search'
            }
        });     

        $('.tool-button-submit-filter-no-text, .tool-button-clear-filter').button({
            icons: {
                primary: 'ui-icon-trash'
            }
        }).on('click', function (e) {
            
            e.preventDefault();
            e.stopPropagation();
            
            window.location = Routing.generate('monitoring_question_clear_filter');
        }); 
        
        $('.tool-button-edit').button({
            text: false,
            icons: {
                primary: 'ui-icon-pencil'
            }
        });
        
        $('.tool-button-change-history').button({
            text: false,
            icons: {
                primary: 'ui-icon-calendar'
            }
        });        
        
        $('.tool-button-use').button({
            text: false,
            icons: {
                primary: 'ui-icon-tag'
            }
        });
        
        $('.tool-button-version').button({
            text: false,
            icons: {
                primary: 'ui-icon-wrench'
            }
        });  
        
        $('.tool-button-save-as').button({
            text: false,
            icons: {
                primary: 'ui-icon-transferthick-e-w'
            }
        });
        
        $('.tool-button-code').button({
            text: false,
            icons: {
                primary: 'ui-icon-script'
            }
        });        
       
    }    
    
});

$(document).ready(function () {

    Seo.questionList = new Seo.MonitoringQuestionList();
    Seo.questionList.setListeners();    

});
