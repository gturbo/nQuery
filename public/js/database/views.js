var nQ= window.nQ;
nQ.DatabaseView = Marionette.ItemView.extend({
    tagName: 'tr',
    template: 'database_table',
    className: 'databaseTable',
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
    childViewContainer: "tbody",
    childView: nQ.DatabaseView
});
