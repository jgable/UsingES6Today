import { Backbone, _ } from 'vendor/shim';
import colors from 'util/colors';

// A super simple box model
export default Backbone.Model.extend({
    defaults: {
        color: null
    },

    fetch: function () {
        // Just generate a new color on fetch
        
        var currColor = this.get('color'),
            newColor = _.sample(colors);

        // Ensure a new color
        while (newColor === currColor) {
            newColor = _.sample(colors);
        }

        this.set('color', newColor);
    },

    startChanging: function (intervalDelay) {
        // Start an interval to fetch every 600-3000 milliseconds
        this.intervalDelay = intervalDelay || _.random(600, 3000);
        this.interval = setInterval(this.fetch.bind(this), this.intervalDelay);
    },

    stopChanging: function () {
        if (this.interval) {
            clearInterval(this.interval);
        }
    },

    remove: function () {
        this.stopChanging();
    }
});
