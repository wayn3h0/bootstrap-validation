/* =========================================================
* Copyright 2012 Wayne Ho. All rights reserved.
* Use of this source code is governed by a apache
* license that can be found in the LICENSE file.
* ========================================================= */

!function($) {
    $.fn.validation = function(options) {
        return this.each(function() {
            global = $.extend({}, $.fn.validation.defaults, options);
            validateForm(this);
        });
    };
    
    $.fn.validation.defaults = {
        validators : [
            {
                name: 'required', 
                validate: function() {
                    return $.trim($(this).val()) != '';
                }
            },
            {
                name: 'checked', 
                validate: function() {
                    return $(this).is(':checked');
                }
            },
            {
                name: 'compare',
                validate: function() {
                   target = $(this).attr('data-compare-target');
                   if (target != undefined) {
                        return $(this).val() == $("#"+target).val();
                   } 

                   return true;
                }
            },
            {
                name: 'char',
                validate: function() {
                    return /^[a-zA-Z]*$/.test($(this).val());
                }
            },
            {
                name: 'number', 
                validate: function() {
                    return /^[0-9]\d*$/.test($(this).val());
                }
            },
            {
                name: 'email', 
                validate: function() {
                    return /^([a-zA-Z0-9_\.-]+)@([a-zA-Z0-9\.-]+)\.([a-zA-Z\.]{2,6})$/.test($(this).val());
                }
            },
            {
                name: 'pattern',
                validate: function() {
                    pattern = $(this).attr('data-regex-pattern');
                    if(pattern != undefined) {
                        var regexp =  new RegExp(pattern);
                        return regexp.test($(this).val());
                    }

                    return true;
                }
            }
        ]
    };

    var global = {};
    var firstSubmit = true;

    var validateElement = function(target, validators) {   // Validate input element
        var element = $(target);
        var passed = true;
        var  message='';
        for (i = 0; i < validators.length; i++) {
            var validatorName = validators[i];
            message = element.attr('data-' + validatorName + '-message');
            for (j = 0; j < global.validators.length; j++) {
                var validator = global.validators[j];
                if (validatorName == validator.name) {
                    if (!validator.validate.call(element)) {
                        passed = false;
                        break;
                    }
                }
            }

            if (!passed) {
                break;
            }
        }

        var controls = element.parents('.controls');
        var controlGroup = element.parents('.control-group');
        var help = controls.children('.help-block, .help-inline');

        // remove them first anywhy
        controlGroup.removeClass('error');
        if (help.length > 0) {
            help.remove();
        }

        if (!passed) {
            controlGroup.addClass('error');
            if (message != undefined) {
                controls.append('<span class="help-inline">' + message + '</span>');
            }
        }

        return passed;
    };

    var validateForm = function(target) {
        $(target).submit(function() {
            if (firstSubmit) { // bind event handlers when first submit
                $('input, textarea', this).each(function() {
                    var element = $(this); 
                    var validators = (element.attr('data-validators') == undefined) ? null : element.attr('data-validators').split(' ');
                    
                    if (validators != null && validators.length > 0) { // has validator
                        element.bind('focus', function() { // bind event handler for got focus
                            var controls = element.parents('.controls');
                            var controlGroup = element.parents('.control-group');
                            var help = controls.children('.help-block, .help-inline');
                            controlGroup.removeClass('error');
                            if (help.length > 0) {
                                help.remove();
                            }
                        }); 

                        element.bind('blur change', function() { // bind event handler for lost focus
                            validateElement(this, validators);
                        });
                    }
                });

                firstSubmit = false;
            }


            var allPassed = true;
            $('input, textarea', this).each(function() { // validate each elements
                var element = $(this);
                var validators = (element.attr('data-validators') == undefined) ? null : element.attr('data-validators').split(' ');
                if (validators != null && validators.length > 0) { // has validator
                   if (!validateElement(this, validators)) { // not passed
                        allPassed = false;
                        scrollTo(0, element[0].offsetTop - 50); // set focus
                   } 
                }
            });

            return allPassed;
        });
    };
}(window.jQuery);
