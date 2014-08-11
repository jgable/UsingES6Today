import { Backbone } from 'vendor/shim';

export default Backbone.View.extend({
    className: 'boxes-box',

    initialize: function () {
        this.listenTo(this.model, 'change:color', this.render);
    },

    render: function () {
        this.$el.css({
            backgroundColor: '#' + this.model.get('color')
        });

        return this;
    }
});
