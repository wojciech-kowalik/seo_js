
'use strict';

/**
 * User class constructor
 * 
 * @class Seo.UserAdd
 * @constructor 
 * @namespace Seo
 * @author w.kowalik 
 * @access public
 * @copyright visualnet.pl 2013
 */

Seo.UserAdd = Class.create(Seo.Element.prototype,{
      
    /**
    * Init method after create instance
    * 
    * @method init
    * @return void
    */   
    init: function () {
              
    },
    
   /**
    * Show attention form
    * 
    * @method _showForm
    * @access private
    * @param {Element} element
    * @return void
    */      
    _showForm: function (element) {
     
        var buttons, self = this;
        
        element.data('href', Routing.generate('attention_form'));

        buttons = {


            "close":{
                text:'Zamknij',
                'class':'close',
                click: function (){
                    $(this).dialog('close');
                }
            },

            "save":{
                text:'Wyślij',
                'class':'button-save',
                click: function (e){
            
                    e.preventDefault();
                    self._saveForm();
                    
                }
            }

        };
        
        Seo.modalBox.generate(element, false, true, buttons);         
      
    }, 
            
   /**
    * Show attention form
    * 
    * @method _saveForm
    * @access private
    * @return void
    */      
    _saveForm: function () {
        
        var container = $('.ui-dialog'), self = this, spinner = this._spinner,
            email = container.find('#attention-form').find('.email'),
            description = container.find('#attention-form').find('.description'),
            subject = container.find('#attention-form').find('.subject'),
            confirm = container.find('#attention-form').find('.confirm'),
            url = container.find('#attention-url'),
            user = container.find('#user-name-surname'),
            regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                                      
        $.each(container.find('#attention-form').find('.error-input'), function (key, value) {          
            $(this).removeClass('error-input');
        });        
        
        // check email value        
        if( (email.val() === '') || regex.test(email.val()) === false) {
            email.addClass('error-input');
            return;
        }    
  
        // check subject value      
        if(subject.val() === ''){
            subject.addClass('error-input');
            return;
        }              
        
        // check description value      
        if(description.val() === ''){
            description.addClass('error-input');
            return;
        }  
        
        $.ajax({
            
            type: 'GET',
            dataType: 'json',
            url: Routing.generate('attention_form_save', {
                email: email.val(),
                description: description.val(),
                subject: subject.val(),
                url: url.text(),
                confirm: (confirm.is(":checked") ? 1 : 0),
                user: user.text()
            }),
            
            beforeSend: function(data) {
                
              spinner.css('position', 'relative').css('top', '5px').css('right', '10px');
              container.find('.ui-dialog-buttonset').prepend(spinner);
            },

            success: function(data) {

                if(data.state){
                    Seo.modalBox.monit('Zgłoszenie zostało wysłane', {width: 250, height: 150});
                }else{
                    Seo.modalBox.error(data.message);
                }
                
                spinner.remove();

            },
                    
            error: function(data) {
                Seo.modalBox.error('Wystąpił błąd podczas wysyłania wiadomości ');
                spinner.remove();
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
         
        var options = this.getOptions(), self = this;
        
        $('#attention-form-button').on('click', function () {
           self._showForm($(this));
        });
           
    }
   
});

$(document).ready(function () {

    Seo.userAdd = new Seo.UserAdd();    
    Seo.userAdd.setListeners();    

});