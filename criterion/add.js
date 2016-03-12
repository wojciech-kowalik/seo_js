
'use strict';

/**
 * Criterion add class constructor
 * 
 * @class Seo.CriterionAdd
 * @constructor 
 * @namespace Seo
 * @author w.kowalik 
 * @access public
 * @copyright visualnet.pl 2013
 */

Seo.CriterionAdd = Class.create(Seo.Element.prototype, {
    /**
     * Init method after create instance
     * 
     * @method init
     * @return void
     */
    init: function() {

    },
    /**
     * Maximum number of questions per one chart
     * 
     * @property MAX_QUESTIONS_PER_CHART
     * @type int
     */
    MAX_QUESTIONS_PER_CHART: 19,
    /**
     * Data type
     * 
     * @property _type
     * @type Object
     */
    type: {
        'CHARTS': 'charts',
        'TABLES': 'tables'
    },
    /**
     * Get data for criterion
     * 
     * @method _getData
     * @param {String} type
     * @access private
     * @return void
     */
    _getData: function(type) {

        var url, routingAlias;

        if (type === undefined) {
            type = this.type.CHARTS;
        }

        routingAlias = 'evaluation_criterion_get_' + type;

        url = Routing.generate(routingAlias, {
            'cid': $('#criterion').data('id'),
            'eid': $('#evaluation').data('id'),
            'sid': $('#summary').data('id')
        });

        $.ajax({
            type: "GET",
            url: url,
            success: function(data) {

                if (data) {
                    $('#' + type + '-container').css('opacity', 1);
                    $('#' + type + '-container').html(data);
                } else {
                    Seo.modalBox.error('Wystąpił błąd podczas pobierania danych dla pytania');
                }

            },
            beforeSend: function() {
                $('#' + type + '-container').css('opacity', 0.15);
            },
            error: function(data) {
                Seo.modalBox.error('Wystąpił błąd podczas pobierania danych dla pytania');
            }
        });

    },
    /**
     * Get string with first capitalize letter
     * 
     * @method _ucfirst
     * @access private
     * @param {String} str
     * @return String
     */
    _ucfirst: function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    /**
     * Delete data from preview
     * 
     * @method _deleteData
     * @access private
     * @param {Object} object
     * @param {String} type
     * @return void
     */
    _deleteData: function(object, type) {

        var buttons = {}, self = this, url,
                routingAlias, deleteTranslate;

        if (type === undefined) {
            type = this.type.CHARTS;
        }

        switch (type) {

            case self.type.CHARTS:
                {
                    routingAlias = 'evaluation_criterion_delete_chart';
                    deleteTranslate = 'Czy usun\u0105ć wykres?';
                }
                break;

            case self.type.TABLES:
                {
                    routingAlias = 'evaluation_criterion_delete_table';
                    deleteTranslate = 'Czy usun\u0105ć tabelę?';
                }
                break;

            default:
                routingAlias = 'evaluation_criterion_delete_chart';
                break;
        }

        url = Routing.generate(routingAlias, {
            'qid': object.data('question-id'),
            'cid': object.data('criterion-id'),
            'sid': object.data('survey-id'),
            'eid': object.data('evaluation-id')
        });

        buttons = {
            'Tak': function() {

                $.ajax({
                    type: "GET",
                    dataType: 'json',
                    url: url,
                    success: function(data) {

                        if (data.state) {
                            Seo.modalBox.close();
                            $(document).trigger('SeoEvents.Get' + self._ucfirst(type) + 'Preview');
                        }

                    },
                    error: function(data) {
                        Seo.modalBox.error('Wystąpił błąd podczas usuwania');
                    }
                });


            },
            'Nie': function() {
                Seo.modalBox.close();
            }
        };

        Seo.modalBox.alternative(deleteTranslate, buttons);

    },
    /**
     * Get question data
     * 
     * @method _getQuestionData
     * @access private
     * @param {Object} object
     * @param {jQuery} swapElement
     * @return void
     */
    _getQuestionData: function(object, swapElement) {

        var monit, loader, url = Routing.generate('evaluation_criterion_get_question_data', {
            'id': object.data('id'),
            'cid': object.data('criterion-id'),
            'sid': object.data('survey-id'),
            'eid': object.data('evaluation-id'),
            'aid': object.data('area-id'),
            'rid': object.data('requirement-id'),
            'vid': object.data('version-id')
        });

        loader = $('.ajax-comment-loader');
        monit = (swapElement) ? 'trwa odświeżanie' : 'trwa ładowanie';
        loader.find('.loader-monit').text(monit);

        $.ajax({
            type: "GET",
            url: url,
            success: function(data) {

                if (data) {

                    if (swapElement) {
                        swapElement.replaceWith(data);
                    } else {

                        // check element, if it exists delete previous  
                        $.each($('#question-analize-panel').find('.data-main-container'), function(key, element) {

                            if ((object.data('id') === $(element).data('question-id'))
                                    && (object.data('survey-id') === $(element).data('survey-id'))) {

                                $(this).remove();
                            }

                        });

                        $('#question-analize-panel').scrollTop(0);
                        $('#question-analize-panel').prepend(data);
                    }

                    $('#question-analize-panel').css('opacity', 1);

                    loader.hide();

                } else {
                    Seo.modalBox.error('Wystąpił błąd podczas pobierania danych dla pytania');
                }

            },
            beforeSend: function() {
                $('#question-analize-panel').css('opacity', 0.15);
                loader.show();
            },
            error: function(data) {
                Seo.modalBox.error('Wystąpił błąd podczas pobierania danych dla pytania');
                loader.hide();
            }
        });

    },
    /**
     * Set/unset editor binders
     * 
     * @method _toggleEditorBinders
     * @access private
     * @param {Cleditor} editor
     * @return void
     */
    _toggleEditorBinders: function(editor) {

        var iframeHtml = editor.$frame.contents();

        iframeHtml.off('contextmenu');
        iframeHtml.off('keydown');

        iframeHtml.on('contextmenu', function(e) {
            return false;
        });

        iframeHtml.on('keydown', function(e) {

            if (e.ctrlKey == true && (e.which == '118' || e.which == '86')) {
                Seo.modalBox.error('Użyj proszę przycisku "wklej jako tekst" (trzeci od prawej)');
                $(this).html('<p></p>');
                return false;
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
    setListeners: function() {

        var options = this.getOptions(),
                HEIGHT_EDITOR = 500, self = this, url, route,
                editor = $('.editor').cleditor({
            width: '99.7%',
            controls:
                    "bold italic underline strikethrough subscript superscript" +
                    " | removeformat | bullets numbering | outdent " +
                    "indent | alignleft center alignright justify | undo redo | " +
                    "rule link unlink | pastetext | print source"})[0];


        $(document).on('click', '.chart-delete', function(e) {
            e.preventDefault();
            self._deleteData($(this), self.type.CHARTS);
        });

        $(document).on('click', '.table-delete', function(e) {
            e.preventDefault();
            self._deleteData($(this), self.type.TABLES);
        });

        $(document).on('SeoEvents.GetChartsPreview', function() {
            self._getData(self.type.CHARTS);
        });

        $(document).on('SeoEvents.GetTablesPreview', function() {
            self._getData(self.type.TABLES);
        });

        $(document).on('click', '.close-container', function() {

            var container = $(this).closest('.data-main-container');

            $.each($('.questions').find('.question-analize'), function() {

                if ($(this).hasClass('question-selected') && (container.data('question-id') === $(this).data('id'))) {
                    $(this).removeClass('question-selected');
                }

            });

            container.remove();

        });

        $(document).on('click', '.refresh-container', function() {

            var swapElement = $(this).closest('.data-main-container'),
                    object = $('<span></span>');

            object.data('id', swapElement.data('question-id'));
            object.data('criterion-id', swapElement.data('criterion-id'));
            object.data('survey-id', swapElement.data('survey-id'));
            object.data('evaluation-id', swapElement.data('evaluation-id'));
            object.data('area-id', swapElement.data('area-id'));
            object.data('requirement-id', swapElement.data('requirement-id'));

            self._getQuestionData(object, swapElement);

        });

        $(document).on('click', '.select-chart', function(e) {

            var questionId = $(this).data('question-id'),
                    criterionId = $(this).data('survey-id'),
                    handlerElement = $('#handler-question-' + questionId + '-' + criterionId),
                    counter = 0, isAdded = false, elementHandler = $(this), monit;

            if (handlerElement.length > 0) {
                counter = handlerElement.data('count-questions');
            }
            
            if ($(this).is(':checked') === false) {
                route = 'evaluation_criterion_delete_chart';
            } else {
                
                isAdded = true;
                route = 'evaluation_criterion_add_chart';

                if (counter > self.MAX_QUESTIONS_PER_CHART) {

                    var element = $('<div></div>'),
                            buttons = {
                        'Zamknij': function() {
                            $(this).dialog('close');
                        }
                    };

                    element.data('title', 'Wystąpił błąd');
                    element.data('width', 350);
                    element.data('class', 'ui-state-error');

                    Seo.modalBox.generate(element, 'Przepraszamy ale ze względu na ograniczenia formatowania w raporcie, wykres nie może być dołączony, liczba odpowiedzi nie powinna przekraczać ' + self.MAX_QUESTIONS_PER_CHART, false, buttons, element);
                    $(this).attr('checked', false);
                    return;

                }

            }

            url = Routing.generate(route, {
                'qid': $(this).data('question-id'),
                'sid': $(this).data('survey-id'),
                'eid': $(this).data('evaluation-id'),
                'cid': $(this).data('criterion-id')
            });

            $.get(url, function(data) {

                if (data.state) {
                                        
                    monit = (isAdded) ? "(dodano)" : "(usunięto)";
                    elementHandler.parent().find(".success-monit").html(monit).fadeIn().delay(2000).fadeOut();
                    
                    $(document).trigger('SeoEvents.GetChartsPreview');
                }

            });

        });

        $(document).on('click', '.select-table', function() {

            if ($(this).is(':checked') === false) {
                route = 'evaluation_criterion_delete_table';
            } else {
                route = 'evaluation_criterion_add_table';
            }

            url = Routing.generate(route, {
                'qid': $(this).data('question-id'),
                'sid': $(this).data('survey-id'),
                'eid': $(this).data('evaluation-id'),
                'cid': $(this).data('criterion-id')
            });

            $.get(url, function(data) {

                if (data.state) {
                    $(document).trigger('SeoEvents.GetTablesPreview');
                }

            });

        });

        $(document).on('click', '.show-answers', function() {

            var linkContent = $(this).find('.answers-link'), url, loader = $('.ajax-comment-loader'),
                    container = $(this).find('.answers-container');

            if (linkContent.hasClass('open')) {

                container.html('');
                linkContent.removeClass('open');
                linkContent.text('[pokaż odpowiedzi]');

            } else {

                url = Routing.generate('evaluation_suggestion_answers', {
                    'id': linkContent.data('answer-id'),
                    'qid': linkContent.data('question-id'),
                    'sid': linkContent.data('survey-id'),
                    'eid': linkContent.data('evaluation-id')
                });

                loader.show();
                $('#question-analize-panel').css('opacity', 0.15);

                $.get(url, function(data) {

                    if (data.state) {
                        container.html(data.content);
                        linkContent.text('[ukryj odpowiedzi]');
                        linkContent.addClass('open');
                        loader.hide();
                        $('#question-analize-panel').css('opacity', 1);
                    }

                });

            }

        });

        $(document).on('click', '.question-analize', function() {

            $(this).addClass('question-selected');
            self._getQuestionData($(this));

        });

        $('#criterion-left-column').on('click', '.criterion-description-handler', function() {

            if ($(this).hasClass('selected')) {
                $(this).find('span').text('rozwiń');
                $(this).removeClass('selected');
                $(this).closest('h1').find('.criterion-description').hide();
            } else {
                $(this).addClass('selected');
                $(this).find('span').text('zwiń');
                $(this).closest('h1').find('.criterion-description').show();
            }

        });

        $('.criterion-tabs').tabs();
        $('#criterion-tabs-info').tabs();

        self._toggleEditorBinders(editor);

        $('.collapse').on('click', function() {

            $('#left-panel-container').hide();
            $('.uncollapse-container').show();
            $('.collapse').hide();

            editor.$main.height(HEIGHT_EDITOR);
            editor.focus();
            editor.refresh();

            self._toggleEditorBinders(editor);

        });

        $('.uncollapse').on('click', function() {

            $('.uncollapse-container').hide();
            $('.collapse').show();
            $('#left-panel-container').show();

            editor.$main.height(HEIGHT_EDITOR / 2);
            editor.focus();
            editor.refresh();

            self._toggleEditorBinders(editor);

        });

        $(document).trigger('SeoEvents.GetChartsPreview');
        $(document).trigger('SeoEvents.GetTablesPreview');

    }

});

$(document).ready(function() {

    Seo.criterionAdd = new Seo.CriterionAdd();
    Seo.criterionAdd.setListeners();

});