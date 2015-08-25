Class("Calculator.Dizmo", {

    my: {
        methods: {
            load: function (path, fallback) {
                var value = dizmo.privateStorage.getProperty(path);
                if (value === null) {
                    return fallback;
                } else if (value === '"null"') {
                    return null; // no fallback!
                } else {
                    return value;
                }
            },

            save: function (path, value) {
                if (value === undefined) {
                    dizmo.privateStorage.deleteProperty(path);
                } else if (value === null) {
                    dizmo.privateStorage.setProperty(path, '"null"');
                } else {
                    dizmo.privateStorage.setProperty(path, value);
                }
            }
        }
    },

    after: {
        initialize: function () {
            this.initEvents();
        }
    },

    methods: {
        initEvents: function () {
            viewer.subscribeToAttribute('displayMode', function (path, value) {
                dizmo.setAttribute('hideframe', value === 'presentation');
            });

            dizmo.onDock(function (other) {
            });

            dizmo.onUndock(function (other) {
            });

            dizmo.canDock(true);
        }
    }
});
