import { $, Backbone, _ } from 'vendor/shim';
import BoxView from 'views/box';

export default Backbone.View.extend({
    className: 'boxes',

    initialize: function () {
        this.subviews = {};

        this.listenTo(this.collection, 'reset', this.render);
        this.listenTo(this.collection, 'allSame', this.stopAndFadeOut);
        this.listenTo(this.collection, 'allDifferent', this.shakeEmUp);
    },

    render: function () {
        var self = this,
            fragment = document.createDocumentFragment(),
            renderedBoxViews;

        // Render each box view into the fragment
        renderedBoxViews = _.transform(this.collection.models, function (fragment, model) {
            var view = new BoxView({
                model: model
            });

            self.subviews['item-' + model.cid] = view;

            fragment.appendChild(view.render().el);

            view.$el.hide();
            
            _.defer(function () {
                view.$el.show();
                view.$el
                    .addClass('fadeInLeft animated')
                    .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                        $(this).removeClass('fadeInLeft animated');
                    });
            });
        }, fragment);

        // Append the fragment
        this.$el.empty().append(renderedBoxViews);

        return this;
    },

    cheatMode: function (color) {
        color = color || 'E74C88';
        
        this.collection.each(function (model) {
            model.set('color', color);
        });
    },

    stopAndFadeOut: function () {
        var self = this;

        self.trigger('bingo');
        
        this.collection.each(function (model) {
            model.stopChanging();

            var view = self.subviews['item-' + model.cid],
                animate = function (animationClass, done) {
                    var toggledClass = animationClass + ' animated';
                    view.$el
                        .toggleClass(toggledClass, true)
                        .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                            view.$el.toggleClass(toggledClass, false);
                            done();
                        });
                },
                bounce = function (done) {
                    animate('bounce', done);
                },
                pulse = function (done) {
                    animate('pulse', done);
                },
                fadeRight = function (done) {
                    animate('fadeOutRight', done);
                };

            // TODO: Promises for this pyramid of doom
            bounce(function () {
                pulse(function () {
                    fadeRight(function () {
                        self.collection.remove(model);
                        view.remove();

                        if (self.collection.length === 0) {
                            _.delay(function () {
                                self.collection.fetch();
                            }, 500);
                        }
                    });
                });
            });
        });
    },

    shakeEmUp: function () {
        var self = this;

        this.collection.each(function (model) {
            var view = self.subviews['item-' + model.cid];

            view.$el
                .toggleClass('shake animated')
                .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                    view.$el.removeClass('shake animated');
                });
        });
    },

    remove: function () {
        // Remove each subview
        _.invoke(this.subviews, 'remove');

        Backbone.View.prototype.remove.apply(this, arguments);
    }
});
