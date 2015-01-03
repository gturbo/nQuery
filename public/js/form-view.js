/**
 * view designed to handle user inputs using input felds
 * event are automaticaly bound to input[text] and textarea
 *
 * on change model is set, errors are raised and buond to the view
 * conventions:
 * -----------------------------------------------
 *  INPUT ATTRIBUTES
 * -----------------------------------------------
 *  input and textares must have ids identical to desired attribute names
 *  namespacing is allowed using _ separator
 *  example : input id="bankaccount_bank" sets property/attribute bank of view model attribute bankaccount
 *
 *  attribute date when set (ie: date="1") handles date input:
 *  	- a datepicker is automatically appended to the input
 *  	- model holds a long integer corresponding to the elapsed ms from 1/1/1970 00:00:00 GMT
 *
 *  attribute nokeyup disables keyup event on desired input
 *
 * -----------------------------------------------
 *  ERROR HANDLING
 * -----------------------------------------------
 * errors for an attribute myAttributeName are displayed in predefined fields using following convention
 *  1 we look for a DOM element in the view with errorfor="myAttributeName"
 *  2 if not found we append a div with errorfor="myAttributeName"
 *  	 inside the DOM element having special attribute errorforall in the view
 *  3 if not found nothing is done
 *
 * errors are displayed sequentially in <p> elements
 * errorfor elements are showed on error events from the model and hidden on valid events
 * input elements are appended an error class on errors and a valid class on valid
 *
 * error containers should be provided with hidden class for not being displayed at view first rendering
 *
 * -----------------------------------------------
 *  Click HANDLING
 * -----------------------------------------------
 * view dom element with convention : id = "lnk[action]" will trigger
 *  event handling function called action passed as an option to the view during creation
 *  exemple: <div id='lnksubmit'></div>
 *  will be bound to the submit handler of the view
 * -----------------------------------------------
 *  OPTIONS
 * -----------------------------------------------
 *
 *  dynFields: 	allows to pass an array of attributes names that will be validated during view global validation
 *  			example: in send contact tracker screen 1 i allows to check for receiver being set (required rule)
 *  			all inputs / textarea present in the view hve their corresponding attributes automatically validated
 *
 * 	saveOptions :
 * 				any input[button] in the view has its click event automatically bound to the submit function
 * 				submit function validates the view and upon success it saves the model
 * 				passing saveOptions as option to the model's save method
 *
 * 				special option clear allows a new model to be created and the view fields being reset
 *
 *  			example usage:
 *  				saveOptions: { success : function(resp, options) {
 *  								// special code after save has succeeded
 *		  							// the context this is set to the view
 *  							},
 *  						  clear: 1
 *  						}
 *  afterRender : function to call after rendering the view in the context of the view
 *  afterFirstRender : function to call after the first rendering of the view in the context of the view
 *  noFocus : if set prevents setting focus to the first form input
 *
 **/
var ItemView = Backbone.Marionette.ItemView
nQ.FormView = ItemView.extend({
    constructor: function(options) {
        var moduleEvents = {
            'keyup input': "keyup",
            'blur input,textarea': "_keyup",
            'focus input,textarea': "focus",
            'click button': 'click'
            };
        if (options.events) {
            options = $.extend({}, options);
            options.events = $.extend(moduleEvents, options.events);

        }
        this.events = (this.events) ? _.extend(moduleEvents, this.events) : moduleEvents;
         return ItemView.call(this, options);
    },
    initialize: function(options) {
        /**
         * submit {
         *   el
         *   clear:true/false
         *   success
         * }
         **/
        // bindAll doesn't work in initialize context
        // it works fine in a subfunction
        // some mystery with javascript context in nested constructor context ??
        if (_.isFunction(this.model))
            this.model = this.model();

        if (this.model) this.bind();
    },
    bind: function() {
        _.bindAll(this, 'modelChange', 'setError');
        this.model.bind('change', this.modelChange);
  //      this.model.bind('error', this.setError);
  //      this.model.bind('valid', this.setError);
    },
    unbind: function() {
        this.el.unbind();
        this.model.unbind('change', this.modelChange);
  //      this.model.unbind('error', this.setError);
  //      this.model.unbind('valid', this.setError);
        this.options.unbind && this.options.unbind.call(this);
    },
    close: function() {
        this.unbind();
        this.$('[errorfor]').hide();
        ItemView.prototype.close.call(this);
    },
    postRender: function() {
        this.getFields();
        if (!this.options.noFocus && this.DOMFields.length) {
            this.setFocus(this.DOMFields[0]);
        }
        else {// disable keyup event on the view
            // this.undelegateEvents();
        }
        this.getTabbables();
        var errForAll = this.$('[errorforall]');
        if (errForAll.length) {
            this.errForAll$ = errForAll;
        }
        else {
            delete this.errForAll$;
        }
        var self = this;

        var i = document.createElement('input');
        i.setAttribute('type', 'date');
        if (i.type === 'text') {
            // add date pickers as browser doesn't handle input type date
            $('input[type=date]', this.el).each(function() {
                var defaultDate = Number(this.getAttribute('date'))
                defaultDate = isNaN(defaultDate) ? serverTime.nowD() : new Date(defaultDate);
                // this refers to the DOM input element
                $(this).datepicker({
                    dateFormat: 'dd/mm/yy',
                    altFormat: 'dd/mm/yy',
                    changeYear: true,
                    duration: 'fast',
                    defaultDate: defaultDate,
                    firstDay: 1,
                    showOn: "both",
                    buttonImage: "content/images/calendar.gif",
                    buttonImageOnly: true,
                    onSelect: function(dateText){
                        // this refers to the dom input element
                        // self refers to the view
                        self._keyup({
                            target: this
                        });
                    }
                });
            });
        }
    },
    render: function() {
        ItemView.prototype.render.call(this);
        this.postRender();
        return this;
    },

    // builds field list from the view using reflection over dom content
    // and adding optional dynFields that are not managed by a standard DOM element
    getFields: function() {
        var options = this.options;
        var fields = this.fields = (options && options.dynFields) ? _.clone(options.dynFields) : [];
        // select input of type text, password and textareas
        var DOMFields = this.DOMFields = [];
        this.$('input,textarea').each(function() {
            // jquery each sets this to the current item
            var elem = $(this);
            var id = elem.attr('id');
            var isButton = (elem.attr('type') == 'button' ? 1 : 0);
            if (id && !isButton) {
                fields.push(id);
                DOMFields.push(elem);
            }
        });
    },
    //clear the domfields
    clearFields: function() {
        _.each(this.DOMFields, function(field) {
            if (field.val)
                field.val('').blur();
            else
                this.$("#" + field).val('').blur();
        }, this);
    },
    // overriden version of jquery focus function
    // needed because firefox and other browsers doesn't handle properly $.focus during event handlers execution
    setFocus: function($el) {
        if ($el && $el.length)
            _.defer(function() {
                $el.focus();
            });
    },
    // enforce validation of all view fields by the model and returns result
    validate: function(options) {
        return this.model.validate();

        // old code
        var fields = this.fields.concat('all'), model = this.model;
        var valid = model.validate.call(model, options, fields);
        if (!valid) {
            // set focus to the first field in error
            var errors = model.errors;
            errField = _.detect(this.DOMFields, function($el) {
                return errors[$el.attr('id')];
            });
            this.setFocus(errField);
            return false;
        }
        // check for pending rules
        var pending = model.pending;
        for (var key in pending) {
            if (_.indexOf(fields, key) >= 0)
                return false;
        }
        return true;
    },
    // bound to error and valid events of the model
    setError: function(model, attr) {
        var errors = model.errors[attr], $inp = this.$('#' + attr), $error = this.$('[errorfor=' + attr + ']');
        // if no error field is found and errForAll is defined add an error <p> inside it for this attr
        // if rules changed field value update view
        if (errors) {
            if (!$error.length && $inp.length) {
                if (this.errForAll$) {
                    $error = $('<div class="error hidden">').attr('errorfor', attr).appendTo(this.errForAll$);
                }
                else { // create an autogenerated error container
                    $error = $('<div class="autoError hidden">').attr('errorfor', attr).insertAfter($inp);
                    var position = $inp.offset();
                    position.top += $inp.height()+6;
                    // ensure we stay inside the view
                    position['max-width'] = ((this.el.offset()).left + this.el.width() - position.left) + 'px';
                    $error.css(position);
                }
            }
            $inp.removeClass('valid').addClass('error');
            if (!!$error.length) {
                $error.empty();
                _.each(errors, function(msg) {
                    $error.append($('<p>').html(msg));
                });
                $error.show();
            }
        }
        else {
            $inp.removeClass('error').addClass('valid');
            if ($error.hasClass('autoError'))
                $error.remove();
            $error.empty().hide();
        }
    },
    forceError: function(attr, ruleName, autoRemoveDelay) {
        // we build a fake model to call the view seterror function
        var fakeErrors = {}, fakeModel = {errors:fakeErrors}, fakeError = {};
        fakeError[ruleName] = errorMsg[ruleName];
        fakeErrors[attr]=fakeError;
        this.setError(fakeModel,attr);
        if (autoRemoveDelay) {
            var self = this;
            setTimeout(function(){
                delete self.model.errors[ruleName];
                self.setError(self.model, attr);
            }, autoRemoveDelay)
        }
    },
    modelChange: function(model, options) {
        if (!options.noRender)
            this.render();
    },
    getTabbables: function() {
        this.$tabbables = this.$('input:enabled,textarea:enabled');
        this.$photoCtn = this.$('#lnkPhotoHandler');
        this.photoSize = ((/large/i).exec(this.$photoCtn.attr('class'))) ? 'large' : 'small';
    },
    tabulate: function(e) {
        var $tabbables = this.$tabbables, length = $tabbables.length;
        if (length) {
            // if shift key is pressed, we must remove 1 to the index,
            // we add length to keep with positive indexes
            var i = e.shiftKey ? length - 1 : 1;
            i = ($tabbables.index(e.target) + i) % $tabbables.length;
            $tabbables[i].focus(1);
        }
    },
    // remove hint on first input focus
    focus: function(e) {
        var target = $(e.target), val = target.val(), title = target.attr('title');
        if (val && val === title && target.hasClass('auto-hint')) {
            target.val('');
            target.removeClass('auto-hint');
        }
        return true;
    },
    _keyup: function(evt){
        var target = evt.target, data = {}, attr = target.getAttribute('id');
        var val = target.value, model = this.model;
        // if target is a date input field, we pass the long value to the model
        // we don't want to pass it until its OK
        if (target.getAttribute('date')) {
            val = _.dateFromLocal(val);
            if (!val) { // the date is invalid dateFromLocal returns 0
                this.forceError(attr, "date");
                return false;
            }
        }
        // if target is an amount input field, we pass the long value to the model
        if (target.getAttribute('type') == 'nbamount') {
            if (isNaN(val) && typeof val=="string") { // the amount is invalid try to correct it
                val = val.replace(/[^\d.,]+/g,'');
                val = val.replace(/,/g,'.');
                target.value=val;
                if (isNaN(val) || val === "") {
                    this.forceError(attr, "amount");
                    return false;
                }
            }
            val =(val === "") ? void 0 : _.amtToLong(val);
        }
        // if value has changed set it
        if (attr && val != model.get(attr)) {
            // add a noRender option as we have already handled rendering of change
            var opts = {noRender: 1};
            if (this.options.silent)
                opts.silent = 1;
            if (val == void 0)
                model.unset(attr, opts);
            else  {
                data[attr] = val;
                model.set(data, opts);
            }
        }
        return true;
    },
    // needed to  split event into two function to enable event target change tracking
    keyup: function(evt) {
        var target = evt.target;

        //$.debug('        keyup ' + target.getAttribute('id') + ' ' + target.value + ' ' + evt.liveFired.getAttribute('id'));
        // if we are called from within another view return
        // tabulate and eventually submit when enter or tab is pressed
        // except in textarea
        if ((evt.keyCode === $.ui.keyCode.ENTER)
            && (target.tagName.toLowerCase() !== 'textarea')) {
            var save = this.save || this.optons.save;
            if (save && _.isFunction(save))
                save.call(this);
            else {
                if (!(target.getAttribute('nokeyup') || target.getAttribute('type') == 'file')) {
                    // force model synchronization now
                    this._keyup(evt);
                }
                // for a date picker close it as it is opened upon field focus
                if (target.getAttribute('type') == 'file' || target.getAttribute('type') == 'button' || target.getAttribute('date'))
                    return true; // let native event handler handle event
                if (this.validate()) {
                    this.submit();
                    if (this.parent && this.parent.confirm) // confirm popupApp if exists
                        this.parent.confirm();
                }
                else {
                    if (target.getAttribute('date')) {
                        var $target = $(target);
                        $target.datepicker('hide');
                    }
                    this.tabulate(evt);
                    return true;
                }
            }
            return true;
        } else {
            // if input has nokeyup attribute exit
            if (target.getAttribute('nokeyup')) {
                return true;
            }
            // if needed define a debounce function and call it
            if ( !this.debKeyup || this.lastTarget !== target){
                this.debKeyup = _.debounce(this._keyup,500);
            }
            this.debKeyup(evt);
            this.lastTarget = target;
            return true;
        }
    },
    getLink: function(elem, i) {
        if (elem) {
            var id = elem.id;
            if (id && id.substring(0, 3) == "lnk")
                return id.substring(3);
            else
            if (i < 15 && elem !== this.el[0])
                return this.getLink(elem.parentNode, i + 1);
            else
                return false;
        }
    },
    // click handler with a convention
    // clicked object must be named lnk + handler name
    // exemple: a dom element with id="evtsubmit" will submit the view
    clickBase: function(e) {
        var action = this.getLink(e.target,0);
        if (action) {
            var handler = this.options[action] || this[action];
            if (handler) {
                handler.call(this, e);
                return false;
            }
        }
        return true;
    },
    click: function(evt) {
        // if parent handler doesn't apply proceed with next handler
        if (this.clickBase.call(this, evt)) {
            // handling of checkBoxes for jqTagCheckbox
            var target = evt.target, $checkField = $(target), option = $checkField.attr('id');
            if (!option)
                return true;
            var parent = $checkField[0].parentNode;
            if (!(parent && parent.getAttribute))
                return true;
            var attr = parent.getAttribute('id'), flagName = parent.getAttribute('flag'), sel = parent.getAttribute('sel');
            if (!(attr && flagName))
                return true;
            var Flag = Flags[flagName];
            if (!Flag)
                return true;
            var value = this.model.get(attr), css = $checkField.attr("class"), suffix = "-full", filter = Number(parent.getAttribute('filter'));

            var params = new Object();
            if (sel == "multi")
                params[attr] = value ^ Flag[option];
            else
                params[attr] = ((value & (~filter)) |  Flag[option]); /* invert the filter, "and" it with value to reset previews flags to 0 then add the selected flag*/
            this.model.set(params);

            //update checkbox view
            $("#" + attr).html($.jqTagCheckBox({
                model: this.model,
                title: "",
                id: attr,
                flag: flagName,
                filter: filter
            }, {
                oneSel: (sel == "multi" ? false : true),
                keepParent: true
            }));

            var clickOverride = void 0, stopEvent = false;
            if (this.options.click && _.isFunction(this.options.click))
                clickOverride = this.options.click;
            var stopEvent = clickOverride && clickOverride.call(this, $checkField, parent);

            return stopEvent; // stop event propagation
        } else
            return false;
    },
    // save the model after submit
    submit: function() {
        var save = true;
        //if no error save model
        var submitObj = (typeof(this.options.saveOptions) == 'object') ? this.options.saveOptions : {};
        // todo remove validation here as it is already done in save ?
        if (this.validate({submit:1}) && (!this.options.beforeSubmit || this.options.beforeSubmit.call(this))) {
            var options = _.extend({
                context: this
            }, submitObj);
            this.model.save({}, options);

            if (submitObj.clear) {
                this.clearFields();
                this.model.unbind();
                this.model = new this.model.constructor();
                this.bind();
            }
        }
        return false;
    },
    cancel: function() {
        if (this.options.templateCancel)
            this.el.html($.tplExec(this.model, this.options.templateCancel));
        else        // try to get the template from the name convention (ex : profile_myprofile)
            this.el.html($.tplExec(this.model, this.template.substring(0, this.template.indexOf('_')) + '_sum'));
    },
    PhotoHandler: function() {
        //Popup view to display photo upload
        var baseView = this, baseEntity = this.model,
            photoEntity = (baseEntity.photoHolder && baseEntity.photoHolder()) || baseEntity,
            oldPhotoId = photoEntity.get("photo"),
            photoId = oldPhotoId ?
                (baseEntity.id ? 0 : oldPhotoId)   // if underlying entity has an id create a new photo to allow cancellation
                : 0,
            model = new BO({photo:photoId});
        model.photoEntity = photoEntity.getPhotoEntity();
        var popPhotoUpload = new PopupAppView({
            model: model,
            template: "photo_form",
            width: 533,
            height: 80,
            title: 'Ajouter une photo',
            buttons: {
                close: 0
            },
            confirm: function() {
                //set photo id of clone model
                photoEntity.set({photo: this.model.get('photo')});
                // if photo entity is nested proxy event to base entity
                this.close();
            },
            getUploadUrl: function() {
                return "portal/Photo/upload/" + photoEntity.getPhotoEntity() + "/" + this.model.get('photo');
            },
            afterCreate: function() {
                this.photoEl = this.$('#photoImg');
                this.fileError = $('#fileError', this.el);
                this.loading = $('#loading', this.el);
                var ajaxOptions = this.ajaxOptions = {
                    context: this,
                    iframe: true,
                    dataType: 'json',
                    beforeSubmit: function() {
                        this.context.fileError.hide();
                        this.context.loading.show();
                    },
                    url: this.options.getUploadUrl(),
                    success: function(resp) {
                        if (resp.id) {
                            this.model.set({photo: resp.id});
                            this.ajaxOptions.url = this.options.getUploadUrl();
                            this.photoEl.attr("src", this.model.getPhotoUrl('large'));
                            this.fileError.hide();
                            // set focus on validate button
                            this.$(this.options.ids.btnValid).focus(1);
                        }
                        else {
                            // error message
                            this.fileError.show();
                        }
                        this.loading.hide();
                    },
                    error: function(data) {
                        this.loading.hide();
                        $.debug(JSON.stringify(arguments));
                    }
                };
                $("#filePath", this.el).bind('change', _.bind(function() {
                    $('#frmPhotoUpload', this.el).ajaxSubmit(ajaxOptions);
                    return true;
                }, this));
            }  // initialize
        }); //  popPhotoUpload
    } // PhotoHandler
});