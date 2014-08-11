
import colors from 'util/colors';
import BoxModel from 'models/box';
import BoxCollection from 'collections/box';
import BoxView from 'views/box';
import BoxesView from 'views/boxes';

var App = {
    // Just for testing out this is being shimmed properly
    modules: true,
    colors: colors,
    BoxModel: BoxModel,
    BoxCollection: BoxCollection,
    BoxView: BoxView,
    BoxesView: BoxesView
};

export default App;
