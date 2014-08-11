(function ($, _, Backbone, undefined) {

    // Detect the shim
    var AppShim = require('app-shim');
    if (AppShim && AppShim.default) {
        AppShim = AppShim.default;
    }

    var App = AppShim || {},
        colors = App.colors;

    // *** Models

    // *** Collections

    // An equally simple collection
    App.BoxCollection = Backbone.Collection.extend({
        model: App.BoxModel,

        initialize: function () {
            this.on('change', this.checkForSameOrDifferent, this);
        },

        fetch: function () {
            // Generate 5 random boxes
            var models = _.times(5, function () {
                var model = new App.BoxModel({
                    color: _.sample(colors)
                });

                model.startChanging();

                return model;
            });

            this.reset(models);
        },

        checkForSameOrDifferent: function () {
            if (this.length === 0) {
                return;
            }

            var firstColor = this.at(0).get('color'),
                areSame = this.all(function (model) {
                    return model.get('color') === firstColor;
                }),
                areAllDifferent = _.unique(this.pluck('color')).length === this.length;

            if (areSame) {
                this.trigger('allSame');
            } else if (areAllDifferent) {
                this.trigger('allDifferent');
            }
        }
    });

    // *** Views

    App.BoxView = Backbone.View.extend({
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

    App.BoxesView = Backbone.View.extend({
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
                var view = new App.BoxView({
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

    // *** Init

    // Export for testing or other people to use
    window.App = App;

    // Render the boxes view
    var boxesView = App.view = new App.BoxesView({
            el: $('#boxes'),
            collection: new App.BoxCollection()
        }),
        bingos = 0;

    // Listen for bingos and keep track of them
    boxesView.on('bingo', function () {
        bingos += 1;

        var bingoText = bingos > 1 ? bingos + ' Bingos' : '1 Bingo';

        $('.bingos-count').text(bingoText);
    });

    // Load the boxes up and render the view
    boxesView.collection.fetch();

}(jQuery, _, Backbone));
