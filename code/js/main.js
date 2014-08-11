(function ($, _, Backbone, undefined) {

    // Detect the shim
    var AppShim = require('app-shim');
    if (AppShim && AppShim.default) {
        AppShim = AppShim.default;
    }

    var App = AppShim || {};

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
