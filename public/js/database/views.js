var nQ= window.nQ;
nQ.DatabaseLayout = Marionette.LayoutView.extend({
    onShow: function() {
        this.dbList.show(this.options.databasesView);
    }
});

nQ.DatabaseView = Marionette.ItemView.extend({
    tagName: 'div',
    template: 'database_table',
    className: 'row',
    events: {
        'click': 'clicked'
    },
    clicked: function (args) {
        window.location.hash = 'database/' + this.model.cid;
    }
});

nQ.DatabasesView = Marionette.CompositeView.extend({
    tagName: 'div',
    template: 'databases_table',
    childViewContainer: '#datalist',
    childView: nQ.DatabaseView
});
