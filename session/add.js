
'use strict';

/**
 * Seo session add class constructor
 * 
 * @class Seo.SessionAdd
 * @constructor 
 * @namespace Seo
 * @author w.kowalik 
 * @access public
 * @copyright visualnet.pl 2013
 */

Seo.SessionAdd = Class.create(Seo.Element.prototype,{
      
    /**
    * Init method after create instance
    * 
    * @method init
    * @return void
    */   
    init: function () {
              
    },
    
   /**
    * Show add code monit
    * 
    * @method _addCodeMonit
    * @access private
    * @param {Element} element
    * @return void
    */      
    _add: function (element) {
     
        var buttons, self = this;
        
        element.data('href', Routing.generate('seo_tools_category_session_new', {id: $('#category').data('id')}));

        buttons = {

            "save":{
                text:'Zapisz',
                'class':'button-save',
                'data-form-id': 'session-form',
                click: function (e){
                    e.preventDefault();
                }
            },

            "close":{
                text:'Zamknij',
                'class':'close',
                click: function (){
                    $(this).dialog('close');
                }
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
         
        var options = this.getOptions(), self = this;     
         
        $('#add-category-session').off('click');
                
        $('#add-category-session').on('click', function () {
           self._add($(this));
        });
         
        $('#back-to-question-list').on('click', function () {
           window.location.href = Routing.generate('seo_tools_question');
        }); 
        
        $('.quit-session').button({
            text: false,
            icons: {
                primary: 'ui-icon-close'
            }
        });           
            
    }
    
});    

$(document).ready(function () {

    Seo.sessionAdd = new Seo.SessionAdd();    
    Seo.sessionAdd.setListeners();    

});