
'use strict';

/**
 * Seo monitoring category list class constructor
 * 
 * @class Seo.CategoryList
 * @constructor 
 * @namespace Seo
 * @author w.kowalik 
 * @access public
 * @copyright visualnet.pl 2014
 */

Seo.MonitoringCategoryList = Class.create(Seo.Element.prototype,{
    
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
        $('#category-list').styleTable();

        // set sortable column
        $('.column').sortable({
            connectWith: '.column'
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
       
        // show search
        $('.search-header').click(function () {
            $('.search-header span.ui-icon:first').toggleClass('ui-icon-plusthick ui-icon-minusthick');
            $(this).parents('.search:first').find('.search-content').toggle();
        });
        
        // send search form
        $('.tool-button-submit-filter').click(function () {
            $('#questionListForm').submit();
        });
        
        // go back to tools
        $('#back').click(function () {
            window.location = Routing.generate('monitoring_category');
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
        
        $('.tool-button-session').button({
            text: false,
            icons: {
                primary: 'ui-icon-document'
            }
        });        

        $('.tool-button-submit-filter-no-text, .monitoring-clear-filter').button({
            icons: {
                primary: 'ui-icon-trash'
            }
        }).on('click', function (e) {
            
            e.preventDefault();
            e.stopPropagation();
            
            window.location = Routing.generate('monitoring_category_clear_filter');
        }); 
        
        $('.tool-button-edit').button({
            text: false,
            icons: {
                primary: 'ui-icon-pencil'
            }
        });
              
        
        $('.tool-button-node').button({
            text: false,
            icons: {
                primary: 'ui-icon-tag'
            }
        });       
       
    }    
    
});

$(document).ready(function () {

    Seo.monitoringCategoryList = new Seo.MonitoringCategoryList();
    Seo.monitoringCategoryList.setListeners();    

});