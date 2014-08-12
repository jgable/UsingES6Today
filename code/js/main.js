(function ($, _, Backbone, undefined) {

    System.baseURL = '/script/';
    System.import('app-shim').then(function (AppModule) {
        var AppShim;
        // Detect the shim
        if (AppModule && AppModule.default) {
            AppShim = AppModule.default;
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
    }, function (err) {
        console.log(err);
    });

}(jQuery, _, Backbone));
