var nQ= window.nQ;
nQ.DatabaseLayout = Marionette.LayoutView.extend({
    onShow: function() {
        this.dbList.show(this.options.databasesView);
    }
});

nQ.DatabaseView = Marionette.ItemView.extend({
    tagName: 'div',
    template: 'database_resume',
    className: 'row',
    events: {
        'click': 'clicked'
    },
    clicked: function (args) {
        window.location.hash = 'database/' + this.model.id;
    }
});

nQ.DatabasesView = Marionette.CompositeView.extend({
    tagName: 'div',
    template: 'database_list',
    childViewContainer: '#datalist',
    childView: nQ.DatabaseView,
    unselect: function() {
        if (this.currentView) {
            this.currentView.$el.removeClass('active');
            delete this.currentView;
        }
    },
    select: function(id) {
        this.unselect();
        var view = this.children.findByModel(this.collection.get(id));
        if (view) {
            this.currentView = view;
            view.$el.addClass('active');
        }
    }
});

nQ.DatabaseDetailView = Marionette.ItemView.extend({
    tagName: 'div',
    template: 'database_detail'
});
