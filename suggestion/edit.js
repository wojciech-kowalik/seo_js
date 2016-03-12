
'use strict';

/**
 * Seo suggest edit class constructor
 * 
 * @class Seo.SuggestionEdit
 * @constructor 
 * @namespace Seo
 * @author w.kowalik 
 * @access public
 * @copyright visualnet.pl 2013
 */

Seo.SuggestionEdit = Class.create(Seo.Element.prototype, {
        
    /**
    * Set counter value for new suggesion
    * 
    * @property _counter
    * @type Integer
    * @default 0
    */
    _counter: 0,
    
    /**
    * Direction vars
    * 
    * @property _direction
    * @type Object
    */
    _direction: {
        'UP': 0,
        'DOWN': 1
    },
    
    /**
    * Versioning flag
    * 
    * @property _versioning
    * @type Boolean
    */
    _versioning: false,
    
    
    /**
    * Primary version flag
    * 
    * @property _isPrimaryVersion
    * @type Boolean
    */
    _isPrimaryVersion: true,    
    
    /**
    * Set if alternative has been showed
    * 
    * @property _alternativeShowed
    * @type Boolean
    */
    _alternativeShowed: false,
        
    /**
    * Partial for suggestion row
    * 
    * @property _partial
    * @type String
    * @default ''
    */
    _partial: '',
    
    /**
    * Row view
    * 
    * @property _suggestionRow
    * @type String
    * @default ''
    */
    _suggestionRow: '',
    
    /**
    * Quick add template
    * 
    * @property _quickAddTemplate
    * @type String
    * @default ''
    */
    _quickAddTemplate: '',
        
    /**
    * Init method after create instance
    * 
    * @method init
    * @return void
    */
    init: function () {
        this._partial = $('#sort-down-partial').html();
        this._suggestionRow = $('#suggestion-row').html();
        this._quickAddTemplate = $('#quick-add-template').html();
    },
   
   
    /**
    * Check if question must have primary version
    * 
    * @method _checkPrimaryVersion
    * @return void
    */   
    _checkPrimaryVersion: function() {
        
        if(this._isSuggestions() === true){
            this._isPrimaryVersion = true;
        }else{
            this._isPrimaryVersion = false;
        }

    },
          
    /**
    * Check if question has suggestions
    * 
    * @method _isSuggestions
    * @return {Boolean}
    */              
    _isSuggestions: function () {

        var suggestions = $('.suggest-list tbody tr'),
                questionType = $('#seo_tools_question_question_type_id'),
                questionTypeValues = [1, 3, 4];

        if ($.inArray(+questionType.val(), questionTypeValues) !== -1) {

            if (suggestions.length === 0) {
                return false;
            }

        }
        
        return true;

    },        
   
    /**
    * Get ordinal numbers from suggestions
    * 
    * @method _getOrdinalNumbers
    * @access private
    * @return {Array} ordinals
    */
    _getOrdinalNumbers: function () {
        
        var ordinals = [];
        
        $.each($('.ordinal-number'), function (i, object) {
           
            if ($(object).hasClass('display-none') === false) {
                ordinals.push(parseInt($(object).val(), 10));
            }

        });

        return ordinals;
        
    },
    
    /**
    * Seek and get element for swap
    * 
    * @method _getElementForSwap
    * @access private
    * @param {Object} direction 
    * @param {Integer} sort
    * @return {Object} elementForSwap
    */     
    _getElementForSwap: function (direction, sort) {
        
        var elements = $('#suggestion-list-container').children(), 
        maxSort = this._maxOrdinal(this._getOrdinalNumbers()),
        elementForSwap = {};
        
        if(sort === 1 || sort === maxSort){
            return elementForSwap;
        }
        
        if(direction === this._direction.UP){
            sort = parseInt(sort, 10) - 1;
        }
        
        if(direction === this._direction.DOWN){
            sort = parseInt(sort, 10) + 1;
        }        
                
        $.each(elements, function (i, element) {
    
            var search = $(element);
    
            if(search.hasClass('display-none') === false){
                
                if(parseInt(search.attr('class'),10) === sort){
                    elementForSwap = search;
                }
            }
    
        });
        
        return elementForSwap;
        
    },

    /**
    * Set counter for index new element
    * 
    * @method _setCounter
    * @access private
    * @return void
    */      
    _setCounter: function () {
        this._counter = this._counter + 1;  
    },
   
    /**
    * Get counter value
    * 
    * @method _getCounter
    * @access private
    * @return {Integer} this._counter
    */    
    _getCounter: function () {
        return this._counter;  
    },
       
    /**
    * Get maximum
    * 
    * @method _maxOrdinal
    * @access private
    * @param {Array} array
    * @return {Integer}
    */     
    _maxOrdinal: function (array) {
        
        if (array.length === 0){
            return 0;
        }
        
        return Math.max.apply( Math, array);
    },
    
    /**
    * Check for what kind of buttons does element have
    * 
    * @method _checkButtonSort
    * @access private
    * @param {Object} element
    * @return {Object}
    */       
    _checkButtonSort: function (element){
        
        var out = {
            'sort_up': false, 
            'sort_down': false
        }, 
        actions = element.find('.actions').children('.sort');
                  
        $.each(actions, function (i, element) {
            
            if($(element).hasClass('sort-up')){
                out.sort_up = true;
            }
            
            if($(element).hasClass('sort-down')){
                out.sort_down = true;
            }            
            
        });
        
        return out;
        
    },
    
    /**
    * Quick add suggestion
    * 
    * @method _quickAdd
    * @access private
    * @return {Boolean}
    */       
    _quickAdd: function () {
        
        var content = $('#suggestion-content').val(), 
            lines, errors = [], values = [], 
            success = [], i, j, temp, suggestion = {};
        
        if(content === ''){
            Seo.modalBox.error('Brak sugestii do dodania');
            return false;
        }
        
        lines = content.split('\n');
        
        for(i = 0; i < lines.length; i++){           
            
            if(lines[i].indexOf('|') !== -1) {
                
                values = lines[i].split('|');
 
                if( values[1] != 1 ) {
                    errors.push('W linii: '+(i+1)+' wartość sugestii otwartej musi być równa 1');
                }else{
                        
                    temp = {name: values[0], is_open: 1};
                } 
                
            }else{
                temp = {name: lines[i], is_open: 0};
            }
            
            success.push(temp);           
            
        }
        
        if(errors.length === 0){
            
            for(j = 0; j < success.length; j++){  
                
                suggestion.name = success[j].name;
                suggestion.is_open = success[j].is_open;
                
                this.add(suggestion);
            }
   
        }else{
            
            Seo.modalBox.monit(errors.join('<br />'), {
                width: 350, 
                title: 'Wystąpił błąd'
            });
            
            return false;
        }
        
        return true;
  
    },
    
    /**
    * Quick add monit
    * 
    * @method _quickAddMonit
    * @access private
    * @param {Object} object
    * @return void
    */       
    _quickAddMonit: function (object) {
        
        var buttons = {}, self = this;
        
        buttons = {

            'Dodaj': function() {
                
                if(self._quickAdd()){
                    Seo.modalBox.monit('Kafeteria została zaktualizowana', {width: 250, height: 150, title: 'Komunikat'});
                    Seo.modalBox.close();
                }
            },
            'Zamknij': function () {
                $(this).dialog('close');
            }
        };      
      
        Seo.modalBox.generate(object, this._quickAddTemplate, false, buttons);        
        
    },
    
    /**
    * Show pop up with quick suggestion add
    * 
    * @method quickAddPopUp
    * @access public
    * @return void
    */     
    quickAddPopUp: function () {
      
        var object = $('<div>'), buttons = {}, self = this,
            usedInSurvey = $('#used-in-survey').data('value');
        
        object.data('width', 600);
        object.data('height', 360);
        object.data('title', 'Szybkie dodawanie sugestii');
      
        if( (usedInSurvey == 1 && !self._alternativeShowed)){

            buttons = {

                'Tak': function() {
                    
                    Seo.modalBox.close();
                    
                    self._quickAddMonit(object);
                    
                    // disable save button
                    $('#save-cafeteria').button('disable');
                    
                    // set flag after showed
                    self._alternativeShowed = true;                        

                    
                },
                'Nie': function () {

                    Seo.modalBox.close();
                }
            };

            Seo.modalBox.alternative(self._addDeleteMonit, buttons);

        }else{
            
            self._quickAddMonit(object);
            
        }
      
    },
    
    /**
    * Show alternative
    * 
    * @method alternative
    * @access public
    * @param {String} methodName
    * @param {Object} object
    * @param {String} message
    * @return {Boolean}
    */      
    alternative: function (methodName, object, message) {
      
        var usedInSurvey = $('#used-in-survey').data('value'), 
            buttons, self = this;
                       
        if( (usedInSurvey == 1 && !self._alternativeShowed) || methodName === 'save'){

            buttons = {

                'Tak': function() {

                    // invoke method
                    self[methodName](object);
                    
                    // disable save button
                    $('#save-cafeteria').button('disable');
                    
                    // set flag after showed
                    self._alternativeShowed = true;                        

                    Seo.modalBox.close();
                },
                'Nie': function () {

                    Seo.modalBox.close();
                }
            };

            Seo.modalBox.alternative(message, buttons);

        }else{
            
            // invoke method
            self[methodName](object);
        }  
        
        return true;
      
    },
    
    /**
    * Set binders
    * 
    * @method binders
    * @access public
    * @return void
    */     
    binders: function () {
      
        var elements = $('#suggestion-list-container').children(), self = this;
      
        $.each(elements, function (i, element) {
    
            var id = $(element).attr('id');
            
            $('#delete-'+id).unbind('click');
            $('#sort-up-'+id).unbind('click');
            $('#sort-down-'+id).unbind('click');
            
            $('#delete-'+id).bind('click', function() {
                self.alternative('del', $(this), self._addDeleteMonit);
            });

            $('#sort-up-'+id).bind('click', function() {
                self.sort($(this), self._direction.UP);
            });   

            $('#sort-down-'+id).bind('click', function() {
                self.sort($(this), self._direction.DOWN);
            });  

        });      
      
    },

    /**
    * Replace elements
    * 
    * @method replace
    * @access public
    * @param {Object} target
    * @param {Object} original
    * @return void
    */   
    replace: function (target, original) {
        
        var buttonsTarget = this._checkButtonSort(target), 
        suggestion = {}, cloneTarget;

        suggestion.id = original.attr('id');
        suggestion.name = original.children('.container-name').children('input').val();
        suggestion.is_open = original.children('.container-is-open').children('input').is(':checked');
        suggestion.ordinal_number = target.children('.actions').children('.ordinal-number').val();
        suggestion.is_added = original.children('.actions').children('.is-added').val();
        suggestion.sort_up = buttonsTarget.sort_up;
        suggestion.sort_down = buttonsTarget.sort_down;
        
        cloneTarget = Mustache.render(this._suggestionRow, suggestion, {
            'sort_down_partial': this._partial
        });        

        target.replaceWith(cloneTarget); 
       
        this.binders();
        
    },
    
    /**
    * Sort method
    * 
    * @method sort
    * @access public
    * @param {Object} element
    * @param {Object} direction
    * @return void
    */      
    sort: function (element, direction) {
                
        var suggestionOriginal = $('#'+element.data('suggestion-id')),
        suggestionTarget = this._getElementForSwap(direction, suggestionOriginal.attr('class'));

        this.replace(suggestionTarget, suggestionOriginal);
        this.replace(suggestionOriginal, suggestionTarget);

        this.binders();

    },
      
    /**
    * Add suggestion to cafeteria
    * 
    * @method add
    * @access public
    * @param {Object} suggestionData
    * @return {Boolean}
    */     
    add: function (suggestionData) {
       
        this._setCounter();
              
        var suggestion = {}, 
        maxOrdinalNumber = this._maxOrdinal(this._getOrdinalNumbers()), self = this;
        
        suggestion.id = 'new-'+this._getCounter();
        
        // get set data
        if($.isPlainObject(suggestionData)) {
            suggestion.name = suggestionData.name;
            suggestion.is_open = suggestionData.is_open;
        }else{
            suggestion.name = '';
            suggestion.is_open = 0;            
        }
        
        if(maxOrdinalNumber > 0){
            suggestion.sort_up = true;
        }
                
        suggestion.ordinal_number = parseInt(maxOrdinalNumber,10) + 1;

        $('#suggestion-list-container').append(
            Mustache.render(self._suggestionRow, suggestion, {
                'sort_down_partial': self._partial
            })
            );
        
        // set is-added to true
        $('#'+suggestion.id+' .actions .is-added').val(1);
                
        // restore previous ordinal number
        suggestion.ordinal_number = maxOrdinalNumber;

        // get sort down partial    
        $('.'+suggestion.ordinal_number+' .actions').append(
            Mustache.render(self._partial, suggestion)        
            );
                
        this.binders();  
        
        return true;

    },
    
    /**
    * Delete suggestion from cafeteria
    * 
    * @method del
    * @access public
    * @param {Object} element
    * @return {Boolean}
    */ 
    del: function (element) {
       
        var id = element.parent().parent().attr('id'),
        suggestion = $('#'+id), consequent = [], predecessor = [],
        deletedOrdinalNumber = suggestion.find('.ordinal-number'),
        deletedOrdinalNumberValue = parseInt(deletedOrdinalNumber.val(), 10),
        className;
       
        suggestion.find('.is-deleted').val(1);
       
        // reorder ordinal numbers
        $.each($('.ordinal-number'), function (i, object) {
           
            if($(object).hasClass('display-none') === false){
           
                var ordinalNumber = parseInt($(object).val(), 10);            

                if(ordinalNumber < deletedOrdinalNumberValue) {
                    
                    // get consequent for deleted row
                    consequent.push($(object).parent().children('a.sort-down').attr('id'));
                }

                if(ordinalNumber > deletedOrdinalNumberValue) {
                    
                    $(object).val(ordinalNumber - 1);
                    className = ordinalNumber - 1;
                    
                    // set value for table row
                    $(object).parent().parent().removeClass().addClass(''+className+'');

                    // get predecessor for deleted row
                    predecessor.push($(object).parent().children('a.sort-up').attr('id'));
                }
            
            }

        });
       
        // manipulate order buttons
       
        if(predecessor.length === 0){
            $('#'+consequent.slice(-1)[0]).remove();
        }
       
        if(consequent.length === 0){
            $('#'+predecessor.slice(0)[0]).remove();
        }       
              
        deletedOrdinalNumber.addClass('display-none');
        suggestion.addClass('display-none');
        
        this.binders();
        
        return true;
             
    },
    
    /**
    * Send data
    * 
    * @method send
    * @access public
    * @param {Object} parameters
    * @param {Object} form
    * @return void
    */       
    send: function (parameters, form) {
                
        $.post(Routing.generate('seo_tools_suggestion_save', parameters) , form.serialize(),
            function(data){

                if(data.state){
                    window.location = data.redirect;
                }else{
                    Seo.modalBox.error('Wystąpił błąd podczas zapisu danych');
                }
            
            });         
        
    },
   
    /**
    * Save cafeteria
    * 
    * @method save
    * @access public
    * @return void
    */    
    save: function () {
     
        var form = $('#suggestions-form'), 
            isError = false, parameters = {}, backup = false, self = this;              
                
        // validate values before save
        $.each(form.find('.name'), function (i, element) {
            if($(element).val() === '' && !$(element).parent().parent().hasClass('display-none')){
                $(element).addClass('error-input');
                isError = true;
            }
        });
        
        if(isError){
            Seo.modalBox.error('Wystąpił błąd w kafeterii');
            return;
        }
        
        parameters.layout = $('#layout').data('content');
        parameters.id = $('#question-id').data('id');

        // check if is versioning state
        if(this._versioning){
            parameters.isVersioning = this._versioning;           
        }

            // add first version of question with default data
            if( $('#has-versions').data('content') === 0 && this._versioning && this._isPrimaryVersion){   

                $.ajax({
                    type: 'GET',
                    dataType: 'json',
                    url: Routing.generate('seo_tools_question_primary_version', {
                        id: parameters.id
                    }),

                    success: function(data) {

                        if(data.state){
                            self.send(parameters, form);
                        }else{
                            Seo.modalBox.error('Wystąpił błąd podczas tworzenia wersji podstawowej');
                        }

                    },
                    error: function(data) {
                        Seo.modalBox.error('Wystąpił błąd podczas tworzenia wersji podstawowej');
                    }
                });   

            }else{
                this.send(parameters, form);
            }
        

    },
   
    /**
    * Build cafeteria
    * 
    * @method load
    * @access public
    * @return void
    */     
    load: function () {
          
        var self = this;
    
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: Routing.generate('seo_tools_question_suggestions', {
                id: $('#question-id').data('id')
            }),

            success: function(data) {

                if(data.suggestions){

                    $.each( data.suggestions, function( id, suggestion ) {

                        $('#suggestion-list-container').append(
                            Mustache.render(self._suggestionRow, suggestion, {
                                'sort_down_partial': self._partial
                            })
                            );
                                                       
                    });
                    
                    self.binders();
                    self._checkPrimaryVersion();
                
                }

            },
            error: function(data) {
                throw new Error('[edit.js] Error in application');
            }
        });     
     
    },
      
    /**
    * Set listeners
    * 
    * @method setListeners
    * @access public
    * @return void
    */
    setListeners: function () {
         
        var options = this.getOptions(), 
        self = this;     
    
        $('#save-cafeteria').on('click', function (e) {
       
            e.preventDefault();
            e.stopPropagation();         
       
            self.save();
       
        });
        
        $('#version-cafeteria').on('click', function (e) {
       
            e.preventDefault();
            e.stopPropagation();         
       
            if(self._isSuggestions() === false){
                Seo.modalBox.error('Niemożliwe utworzenie wersji - brak sugestii dla pytania');
                return;
            }
            
            self._versioning = true;
            self.alternative('save', {}, self._versioningMonit);
       
        });        
    
        $('#add-suggestion').on('click', function (e) {
       
            e.preventDefault();
            e.stopPropagation();  
            
            self.alternative('add', $(this), self._addDeleteMonit);
                  
        });  
        
        $('#quick-add-suggestion').on('click', function (e) {
       
            e.preventDefault();
            e.stopPropagation();  
            
            self.quickAddPopUp();
                  
        });           
                
    }
   
});

$(document).ready(function () {

    Seo.suggestionEdit = new Seo.SuggestionEdit();
    Seo.suggestionEdit.load();
    Seo.suggestionEdit.setListeners();    

});