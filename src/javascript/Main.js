//= require Dizmo

Class('Calculator.Main', {

    has: {
        dizmo: {
            is: 'ro', init: function () {
                return new Calculator.Dizmo();
            }
        },
        x: {
            is: 'rw', init: 0
        },
        y: {
            is: 'rw', init: 0
        },
        yFlag: {
            is: 'rw', init: false
        },
        enterFlag: {
            is: 'rw', init: false
        },
        opFlag: {
            is: 'rw', init: false
        },
        operation: {
            is: 'rw', init: null
        }
    },

    after: {
        initialize: function () {
            this.initEvents();
            this.displayX();
        }
    },

    methods: {
        initEvents: function () {
            var $operator = jQuery('.operator');
            $operator.css('background-color', '#3c3c3c');
            $operator.css('color', '#dfdfdf');
            $operator.click(function (ev) {
                this.enterOp(jQuery(ev.target));
            }.bind(this));

            jQuery('.digit').click(function (ev) {
                this.enterDigit(jQuery(ev.target));
            }.bind(this));
            jQuery('#sign').click(function () {
                this.doUnaryMinus();
            }.bind(this));
            jQuery('#clear').click(function () {
                this.clear();
            }.bind(this));
            jQuery('#clear-all').click(function () {
                this.clearAll();
            }.bind(this));
        },

        highlightOp: function (style) {
            var $op = jQuery('.operator');
            $op.css('background-color', '#3c3c3c');
            $op.css('color', '#dfdfdf');

            if (this.operation !== 'equals') {
                jQuery('#' + this.operation).css(style||'color', '#8ea318');
            }
        },

        clear: function () {
            this.x = 0;
            this.displayX();
        },

        clearAll: function () {
            this.x = 0;
            this.y = 0;
            this.yFlag = false;
            this.enterFlag = false;
            this.opFlag = false;
            this.displayX();
        },

        enterDigit: function ($sender) {
            this.highlightOp();
            this.opFlag = false;

            if (this.enterFlag) {
                this.y = this.x;
                this.x = 0;
                this.enterFlag = false;
            }

            if (this.x.toString() !== '0.' && this.x === 0) {
                this.x = '';
            }

            var digit;
            if ($sender.attr('id') === 'point') {
                if (this.x && !this.x.match(/\./) || !this.x) {
                    digit = '.';
                }
            } else {
                digit = $sender.val();
            }

            if (digit) this.x = this.x + digit;
            if (this.x === '.') this.x = '0.';

            this.displayX();
        },

        enterOp: function ($sender) {
            if (this.opFlag) {
                this.operation = $sender.attr('id');
                this.highlightOp('background-color');
            } else {
                this.opFlag = true;
                this.x = parseFloat(this.x);
                this.y = parseFloat(this.y);

                if (this.yFlag) switch (this.operation) {
                    case 'add':
                        this.x = this.y + this.x;
                        break;
                    case 'subtract':
                        this.x = this.y - this.x;
                        break;
                    case 'multiply':
                        this.x = this.y * this.x;
                        break;
                    case 'divide':
                        this.x = this.y / this.x;
                        break;
                }

                this.y = this.x;
                this.yFlag = true;

                this.operation = $sender.attr('id');
                this.highlightOp('background-color');
                this.enterFlag = true;

                this.cleanX();
                this.displayX();
            }
        },

        checkSize: function () {
            var $readout = jQuery('#readout');
            var size = parseInt($readout.css('font-size')),
                width = $readout.width();
            if (width > 210 || width < 180) {
                while (width > 210 && size > 8) {
                    size = parseFloat(size) * 0.9;
                    $readout.css('font-size', size);
                    width = $readout.width();
                }
                while (width < 180 && size < 80) {
                    size = parseFloat(size) * 1.1;
                    $readout.css('font-size', size);
                    width = $readout.width();
                }
            }
        },

        cleanX: function () {
            this.x = this.x.toFixed(10);
            while (this.x.match(/\..*0$/)) {
                this.x = this.x.replace(/0$/, '');
            }
            if (this.x.match(/\.$/)) {
                this.x = this.x.replace(/\.$/, '');
            }
        },

        displayX: function () {
            jQuery('#readout').html(this.x);
            if (this.x === 'NaN' || this.x === 'Infinity') {
                this.x = 0;
            }
            this.checkSize();
        },

        doUnaryMinus: function () {
            if (this.x === 0) return;
            this.x = -this.x;
            this.displayX();
        }
    }
});