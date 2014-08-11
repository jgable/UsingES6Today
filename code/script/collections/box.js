
import { Backbone, _ } from 'vendor/shim';

import colors from 'util/colors';
import BoxModel from 'models/box';

// An equally simple collection
export default Backbone.Collection.extend({
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
