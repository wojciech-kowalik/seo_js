
'use strict';

/**
 * Seo differential class constructor
 * 
 * @class Seo.Differential
 * @constructor 
 * @namespace Seo
 * @author w.kowalik 
 * @access public
 * @copyright visualnet.pl 2013
 */

Seo.Differential = Class.create(Seo.Element.prototype,{
      
    /**
    * Set if is edit
    * 
    * @property isEdit
    * @type Integer
    */           
     isEdit: $('#is-edit').data('content'),
      
    /**
     * Init method after create instance
     * 
     * @method init
     * @return void
     */   
    init: function () {
        
        if(this.isEdit == 0){
            this._generateColumns($('#column-counter :selected').val()); 
        }else{
            $('#column-counter').attr('disabled', 'disabled');
        }
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
         
        $('#column-counter').change(function() {
            
            $("#diff-columns").html('');
            self._generateColumns($(this).val());
        });
    },
    
    /**
    * Render step
    * 
    * @method _render
    * @access private
    * @param {String} label
    * @param {String} value
    * @return {String}
    */       
    _render: function (label, value, id) {
        return Mustache.render($('#differential-row').html(), {label: label, value: value, id: id} );
    },
    
    /**
    * Load steps for suggestion
    * 
    * @method load
    * @access private
    * @return {Boolean}
    */       
    load: function () {
      
        var self = this;
      
        $.ajax({
            type: "GET",
            dataType: 'json',
            url: Routing.generate('seo_tools_suggestion_get_differential', {
                id: $('#suggestion-id').data('content')
            }),

            success: function (data) {

                if (data.state) {
                    
                    $('#left_desc').val(data.suggestion.left_desc);
                    $('#right_desc').val(data.suggestion.right_desc);
                    self._generateColumns(data);
                    
                } else {
                    Seo.modalBox.error('Wystąpił błąd podczas tworzenia wersji podstawowej');
                }

            },
            
            beforeSend: function () {
                //Seo.modalBox.error('Trwa ładowanie');
            },
            
            error: function(data) {
                Seo.modalBox.error('Wystąpił błąd podczas tworzenia wersji podstawowej');
            }
        });
        
        return true;
    },
     
    /**
    * Generate steps
    * 
    * @method _generateColumns
    * @access private
    * @param {Object} rows
    * @return void
    */
    _generateColumns: function (rows) {
        
        var i, count;     
        
        if(typeof rows === 'object'){

            count = rows.steps.length;
            
            for (i = 0; i < count; i++) {
                $('#diff-columns').append(this._render(rows.steps[i].label, rows.steps[i].value, rows.steps[i].id));
            } 
            
        }else{
            for (i = 0; i < rows; i++) {
                $('#diff-columns').append(this._render(i+1, i+1, i));
            }                
        }

    } 

});

$(document).ready(function () {

    Seo.differential = new Seo.Differential();
    
    if(Seo.differential.isEdit == 1){
        Seo.differential.load();
    }
    
    Seo.differential.setListeners();    

});