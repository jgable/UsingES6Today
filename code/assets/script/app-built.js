define("app-shim", 
  ["util/colors","models/box","collections/box","views/box","views/boxes","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __exports__) {
    "use strict";

    var colors = __dependency1__["default"];
    var BoxModel = __dependency2__["default"];
    var BoxCollection = __dependency3__["default"];
    var BoxView = __dependency4__["default"];
    var BoxesView = __dependency5__["default"];

    var App = {
        // Just for testing out this is being shimmed properly
        modules: true,
        colors: colors,
        BoxModel: BoxModel,
        BoxCollection: BoxCollection,
        BoxView: BoxView,
        BoxesView: BoxesView
    };

    __exports__["default"] = App;
  });
define("collections/box", 
  ["vendor/shim","util/colors","models/box","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";

    var Backbone = __dependency1__.Backbone;
    var _ = __dependency1__._;

    var colors = __dependency2__["default"];
    var BoxModel = __dependency3__["default"];

    // An equally simple collection
    __exports__["default"] = Backbone.Collection.extend({
        model: BoxModel,

        initialize: function () {
            this.on('change', this.checkForSameOrDifferent, this);
        },

        fetch: function () {
            // Generate 5 random boxes
            var models = _.times(5, function () {
                var model = new BoxModel({
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
  });
define("models/box", 
  ["vendor/shim","util/colors","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Backbone = __dependency1__.Backbone;
    var _ = __dependency1__._;
    var colors = __dependency2__["default"];

    var { Model } = Backbone;

    // A super simple box model
    class Box extends Model {
        defaults() {
            return {
                color: null
            };
        }

        fetch() {
            // Just generate a new color on fetch
            
            var currColor = this.get('color'),
                newColor = _.sample(colors);

            // Ensure a new color
            while (newColor === currColor) {
                newColor = _.sample(colors);
            }

            this.set('color', newColor);
        }

        startChanging(intervalDelay) {
            // Start an interval to fetch every 600-3000 milliseconds
            this.intervalDelay = intervalDelay || _.random(600, 3000);
            this.interval = setInterval(this.fetch.bind(this), this.intervalDelay);
        }

        stopChanging() {
            if (this.interval) {
                clearInterval(this.interval);
            }
        }

        remove() {
            this.stopChanging();
        }
    }

    __exports__["default"] = Box;
  });
define("util/colors", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = [
        // Dark blue
        '213D55',
        // Bright blue
        '56B6D0',
        // Pink
        'E74C88',
        
        // Commented these out because bingos were getting kind of hard
        /*
        // Gray,
        '9FA7AC',
        // Greenish
        '1CF49C',
        // Purplish
        'D77BDB'
        */
    ];
  });
define("vendor/shim", 
  ["exports"],
  function(__exports__) {
    "use strict";

    var $ = window.jQuery;
    __exports__.$ = $;var _ = window._;
    __exports__._ = _;var Backbone = window.Backbone;
    __exports__.Backbone = Backbone;
  });
define("views/box", 
  ["vendor/shim","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Backbone = __dependency1__.Backbone;

    __exports__["default"] = Backbone.View.extend({
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
  });
define("views/boxes", 
  ["vendor/shim","views/box","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var $ = __dependency1__.$;
    var Backbone = __dependency1__.Backbone;
    var _ = __dependency1__._;
    var BoxView = __dependency2__["default"];

    __exports__["default"] = Backbone.View.extend({
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
  });