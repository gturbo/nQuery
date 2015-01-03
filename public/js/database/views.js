var nQ = window.nQ;

nQ.DatabaseDetailView = nQ.FormView.extend({
    tagName: 'div',
    template: 'database_detail',
    save: function () {
        var model = this.model, prevId = model.id;

        model.save(null, {
            noRender: 1,
            success: function (model) {
                if (!prevId) {
                    // new model created add to collection and refresh url whith returned id
                    nQ.data.databases.add(model);
                    window.location.hash = 'database/' + model.id;
                } else {
                    // update list view with changes
                    var dbListView =  nQ.layout.database.dbList.currentView;
                    var currentView =dbListView.currentView;
                    currentView.render();
                    // and select it
                    dbListView.select(model.id);
                }
            }
        });
    }
});

nQ.DatabaseLayout = Marionette.LayoutView.extend({
    events: {
        'click #add-db': 'addDatabase'
    },
    onShow: function () {
        this.dbList.show(this.options.databasesView);
    },
    addDatabase: function () {
        window.location.hash = 'database/new_database';
    }
});

nQ.DatabaseView = Marionette.ItemView.extend({
    tagName: 'div',
    template: 'database_resume',
    className: 'row',
    events: {
        'click button': 'buttonClicked'
        , 'click': 'clicked'
    },
    clicked: function (evt) {
        //   if ($(evt.target).closest('button').length)
        //       return true;
        window.location.hash = 'database/' + this.model.id;
    },
    buttonClicked: function (evt) {
        var target = $(evt.target).closest('button');
        switch (target.length && target[0].id) {
            case 'delete':
                var reset = this.$el.hasClass('active');
                this.model.destroy();
                if (reset)
                    window.location.hash = 'database';
                return false;
            default:
                return true;
        }
    }

});

nQ.DatabasesView = Marionette.CompositeView.extend({
    tagName: 'div',
    template: 'database_list',
    childViewContainer: '#datalist',
    childView: nQ.DatabaseView,
    unselect: function () {
        if (this.currentView) {
            this.currentView.$el.removeClass('active');
            delete this.currentView;
        }
    },
    select: function (id) {
        this.unselect();
        var view = this.children.findByModel(this.collection.get(id));
        if (view) {
            this.currentView = view;
            view.$el.addClass('active');
        }
    }
});

