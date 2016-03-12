
'use strict';

/**
 * Seo question class constructor
 * 
 * @class Seo.Modalbox
 * @constructor 
 * @namespace Seo
 * @author w.kowalik 
 * @access public
 * @copyright visualnet.pl 2013
 */
Seo.create('Modalbox', {
   
    /**
    * Is modal
    * 
    * @property _modal
    * @type Boolean
    * @default true
    */   
   _modal: true,
   
    /**
    * Is resizable
    * 
    * @property _resizable
    * @type Boolean
    * @default true
    */     
   _resizable: true,
   
    /**
    * Modal width
    * 
    * @property _width
    * @type String
    * @default auto
    */
    _width: 'auto',
    
    /**
    * Modal height
    * 
    * @property _height
    * @type String
    * @default auto
    */    
    _height: 'auto',
    
    /**
    * Modal minimal height
    * 
    * @property _minHeight
    * @type String
    * @default 300
    */          
    _minHeight: 150,
    
    /**
    * Modal title
    * 
    * @property _title
    * @type String
    * @default ''
    */     
    _title: '',
    
    /**
    * Css class for modal
    * 
    * @property _dialogClass
    * @type String
    * @default ''
    */     
    _dialogClass: '',    
    
    /**
    * Modal element
    * 
    * @property _element
    * @type Object
    * @default {}
    */       
    _element: {},
    
    /**
    * Handler to dialog element
    * 
    * @property _element
    * @type Object
    * @default {}
    */      
    dialogElement: {},
    
    /**
    * Init method after create instance
    * 
    * @method init
    * @return void
    */    
    init: function () {
        
        this.dialogElement = $('#dialog');
        this.dialogElement.attr('title', '');  
        
    },
    
    /**
    * Set element
    * 
    * @param {Object} DOMelement
    * @return void
    */
    _set: function (element) {
            
        if (element === undefined) {
            this._element = this.dialogElement;
        } else {
            this._element = element;
            this.dialogElement = element;
        }
        
    },
    
   /**
    * Make modalbox
    * 
    * @param {Object} DOMelement
    * @param mixed content
    * @param {Boolean} isAjax
    * @return void
    */
    generate: function(object, content, isAjax, buttons, element){     
                     
        var self = this, spinner, spinnerContainer;             
                     
        this._set(element);
        
        this._dialogClass = '';
        this._title = 'Komunikat';
                        
        this._element.html('');
                           
        if (typeof (isAjax) === undefined) {
            isAjax = false;
        }
                        
        if (object.data('width')) {
            this._width = object.data('width');
        }        
            
        if (object.data('height')) {
            this._height = object.data('height');
        }
            
        if (object.data('title')) {
            this._title = object.data('title');
        }
        
        if (object.data('class')) {
            this._dialogClass = object.data('class');
        }        
                            
        spinner = $('<img>').attr('src','/images/spinner.gif').css('position', 'relative').css('top', '50px');
        spinnerContainer = $('<div>').css('text-align', 'center').css('width', '100%');
        spinnerContainer.append(spinner);

        this._element.append(spinnerContainer);                              
                            
        if (isAjax) {
                            
            this._element.load(object.data('href'), function (response, status, xhr) {
                
                if (status === 'error') {
                    self.error('Wystąpił błąd w aplikacji');
                    throw new Error('[modal.js] Wystąpił błąd w aplikacji');
                }
            });
            
        } else {
            this._element.html(content);
        }
            
        var params = {
                
            modal: this._modal,
            resizable: this._resizable,
            width: this._width,
            height: this._height,
            buttons: buttons,
            minHeight: this._minHeight,
            title: this._title,
            dialogClass: this._dialogClass
                
        };

        // event handler after close element
        //this._element.on( "dialogclose", function( event, ui ) { $(this).remove(); } );

        return this._element.dialog(params);

    },
    
    /**
    * Close modalbox
    *
    * @return void
    */
    close: function () {
        $(this.dialogElement).dialog('close');
    },
    
    /**
    * Predefinde error message
    * 
    * @param {String} message
    * @return void
    */
    error: function (message) {
            
        var element = $('<div></div>'),
            buttons = { 'Zamknij': function () { $(this).dialog('close'); } };

        element.data('title', 'Wystąpił błąd');
        element.data('width', 250);
        element.data('height', 150);
        element.data('class', 'ui-state-error');
            
        this.generate(element, message, false, buttons, element);  
            
        return true;
    },

    /**
    * Predefinde monit box
    * 
    * @param {String} message
    * @param {Object} config
    * @return void
    */
    monit: function (message, config) {
        
        var element = $('<div></div>'), 
            buttons = { 'Zamknij': function () { $(this).dialog('close'); } };
        
        if($.isPlainObject(config)){
            
            if(config.width){
                element.data('width', config.width); 
            }
            
            if(config.height){
                element.data('height', config.height); 
            }
            
            if(config.title){
                element.data('title', config.title); 
            }
            
        }  
        
        this.generate(element, message, false, buttons, element); 
        
        return true;

    },
    
    /**
    * Predefinde info box
    * 
    * @param {String} message
    * @return void
    */
    info: function (message) {
                
        var element = $('<div></div>');
        
        element.data('height', 80);   
        element.data('width', 200); 
        this.generate(element, message, false); 
        
        return true;
    },    
        
    /**
    * Predefinde box with alternative
    * 
    * @param {String} message
    * @param {Object} buttons 
    * @return void
    */
    alternative: function (message, buttons) {
                        
        var self = this, buttons, element = {};
           
        element = $('<div>');   
        element.data('width',200);
        element.data('height',120);
                    
        this.generate(element, message, false, buttons); 
        
        return true;

    },        
        
    /**
    * Predefinde confirm box after action
    * 
    * @param {Object} element
    * @return void
    */
    confirm: function (element) {
                        
        var self = this, buttons;
            
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: element.data('href'),
            success: function(data) { 
                
                buttons = {

                    'Ok': function() {

                        // redirect if exists url
                        if(data.redirect){
                            window.location = data.redirect;
                        }
                        
                        self.close();
                    }
                };                

                self.generate(element, data.message, false, buttons); 
                
            },
            error: function (data) {
                self.error('Wystąpił błąd w aplikacji');
            }
        });
        

    },
        
    /**
    * Predefinde delete modal box
    * 
    * @param {Object} DOMelement
    * @return void
    */
    del: function(element){
            
        var uri = element.data('href'),
            buttons = {
            'Tak': function() {
                    
                $.get(element.data('href'), function (data) {
                    
                    // execute code after delete item
                    if(data.js_content) {
                        eval(data.js_content);
                    }else{
                    
                        // redirect if exists url
                        if(data.redirect){
                            window.location = data.redirect;
                        }else{
                            window.location.reload();
                        }
                    
                    }
                    
                }, 'json');
                
                $(this).dialog('close');
              
            },
            'Nie': function () {
                $(this).dialog('close');
            }
        };        
        
        element.data('title', element.data('title'));

        this.generate(element, 'Czy jeste\u015b tego pewien?', false, buttons);         
            
    }
   
});

$(document).ready(function () {

    Seo.modalBox = new Seo.Modalbox();
    
    $('.button-close').on('click', function () {
        Seo.modalBox.close();
    });
     
    $('.modal-delete-handler').on('click', function (e) {

        e.preventDefault();
        e.stopPropagation();

        Seo.modalBox.del($(this));
    });
    
    $('.modal-confirm-handler').on('click', function (e) {

        e.preventDefault();
        e.stopPropagation();

        Seo.modalBox.confirm($(this));
    });    
    
    $('.button-save').on('click', function(){

        var _form = $(this).closest('form'), subModal = $('<div id="sub-dialog"></div>'), 
                    self = $(this), buttons, errors;   

        // check if form id exists in data parameter
        if(_form.attr('action') === undefined){
            _form =  $('#'+self.data('form-id'));
        }

        // clean errors classes
        $('form input.error').removeClass('error');
        $('#global-errors').html('example').addClass('hidden');

        $.post(_form.attr('action'), _form.serialize(),
            function(data){

                // get data
                if(data.errors){

                    // parse json objects
                    errors = $.parseJSON(data.errors);

                    if(errors == null){
                        errors = data.errors;
                    }        

                    $.each(errors, function(i, val) {
                            $('#'+i).addClass('error');
                            $('#'+i).attr('placeholder', val);                        
                    });

                    buttons = {
                        'Ok': function() {
                            $( this ).dialog( 'close' );
                        }
                    };                 

                }else{

                    buttons = {
                        'Ok': function() {
                            
                            $( this ).dialog( 'close' );
                                                       
                            // redirect if exists url
                            if(data.redirect){
                                window.location = data.redirect;
                            }else{
                                location.reload();
                            }
                        }
                    };                

                }

                Seo.modalBox.generate(self, data.message, false, buttons, subModal);

            }, 'json');

    });     
    
});