//= require Dizmo

Class("Calculator.Main", {
    has: {
        // This will be your wrapper around the dizmo API. It is instantiated
        // before the the initialize function (defined below) is called and can
        // therefor already be used there.
        dizmo: {
            is: 'ro',
            init: function() {
                return new Calculator.Dizmo();
            }
        },
        x: {
            is: 'rw',
            init: 0
        },
        y: {
            is: 'rw',
            init: 0
        },
        yFlag: {
            is: 'rw',
            init: false
        },
        enterFlag: {
            is: 'rw',
            init: false
        },
        opFlag: {
            is: 'rw',
            init: false
        },
        operation: {
            is: 'rw',
            init: null
        }
    },

    after: {
        initialize: function() {
            var self = this;

            self.initEvents();
            self.dizmofyElements();

            self.displayX();
            Calculator.Dizmo.publish(self.x);
        }
    },

    methods: {
        initEvents: function() {
            var self = this;

            $('.operator').css('background-color', '#3c3c3c');
            $('.operator').css('color', 'white');

            $('.done-btn').click(function() {
                Calculator.Dizmo.showFront();
            });
            $('#clear').click(function() {
                self.clear();
            });
            $('#clearAll').click(function() {
                self.clearAll();
            });
            $('.operator').click(function() {
                self.enterOp($(this));
            });
            $('.digit').click(function() {
                self.enterDigit($(this));
            });
            $('#sign').click(function() {
                self.doUnaryMinus();
            });
        },

        dizmofyElements: function() {
            var self = this;

            // $('#readout').dinput({
            //     theme: 'dark'
            // });
            $('#readout').addClass('no-dizmo-drag');

            // $('button').dbutton({
            //     theme: 'dark'
            // });
            $('button').addClass('no-dizmo-drag');
        },

        highlightOpBackground: function() {
            var self = this;
            $('.operator').css('background-color', '#3c3c3c');
            $('.operator').css('color', 'white');
            if (self.operation != 'equals') {
                $('#' + self.operation).css('background-color', '#8ea318');
            }
        },

        highlightOp: function() {
            var self = this;
            $('.operator').css('background-color', '#3c3c3c');
            $('.operator').css('color', 'white');
            if (self.operation != 'equals') {
                $('#' + self.operation).css('color', '#8ea318');
            }
        },

        clear: function() {
            var self = this;
            self.x = 0;
            self.displayX();
        },

        clearAll: function() {
            var self = this;
            self.x = 0;
            self.y = 0;
            self.yFlag = false;
            self.enterFlag = false;
            self.opFlag = false;
            self.displayX();
        },

        enterDigit: function($sender) {
            var self = this;

            self.highlightOp();

            self.opFlag = false;
            if (self.enterFlag) {
                self.y = self.x;
                self.x = 0;
                self.enterFlag = false;
            }

            if (self.x.toString() != '0.' && self.x == 0) self.x = '';

            var digit;
            if ($sender.attr('id') == 'point') {
                if ((self.x && !self.x.match(/\./)) || !self.x) digit = '.';
            } else {
                digit = $sender.val();
            }

            if (digit) self.x = self.x + digit;

            if (self.x == '.') self.x = '0.';

            self.displayX();
        },

        enterOp: function($sender) {
            var self = this;
            if (self.opFlag) {
                self.operation = $sender.attr('id');
                self.highlightOpBackground();
                return;
            }
            self.opFlag = true;
            self.x = parseFloat(self.x);
            self.y = parseFloat(self.y);
            if (self.yFlag) {
                switch (self.operation) {
                    case 'add':
                        self.x = self.y + self.x;
                        break;
                    case 'subtract':
                        self.x = self.y - self.x;
                        break;
                    case 'multiply':
                        self.x = self.y * self.x;
                        break;
                    case 'divide':
                        self.x = self.y / self.x;
                        break;
                }
            }

            self.y = self.x;
            self.yFlag = true;

            self.operation = $sender.attr('id');
            self.highlightOpBackground();
            self.enterFlag = true;

            self.cleanX()

            if (self.operation == 'equals') {
                Calculator.Dizmo.publish(self.x);
            }

            self.displayX();
        },

        checkSize: function() {
            var self = this;
            var x = jQuery('#readout').width();
            var currentSize = parseInt($('#readout').css('font-size'));

            if (x > 210 || x < 180) {
                while (x > 210 && currentSize > 8) {
                    currentSize = parseFloat(currentSize) * 0.9;
                    $('#readout').css('font-size', currentSize);
                    x = jQuery("#readout").width();
                }

                while (x < 180 && currentSize < 80) {
                    currentSize = parseFloat(currentSize) * 1.1;
                    $('#readout').css('font-size', currentSize);
                    x = jQuery("#readout").width();
                }



            }



        },

        cleanX: function() {
            var self = this;
            self.x = self.x.toFixed(10);
            while (self.x.match(/\..*0$/)) {
                self.x = self.x.replace(/0$/, '');
            }
            if (self.x.match(/\.$/)) self.x = self.x.replace(/\.$/, '');
        },

        displayX: function() {
            var self = this;
            $('#readout').html(self.x);
            if (self.x == 'NaN' || self.x == 'Infinity') {
                self.x = 0;
            }

            self.checkSize();
        },


        doUnaryMinus: function() {
            var self = this;
            if (self.x == 0) return;
            self.x = -self.x;
            self.displayX();
        }

    }
});