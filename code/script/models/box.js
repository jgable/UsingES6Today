import { Backbone, _ } from 'vendor/shim';
import colors from 'util/colors';

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

export default Box;
