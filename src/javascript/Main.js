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
            },

            publish: function (path, value) {
                if (typeof value === 'undefined') {
                    value = path;
                    path = 'stdout';
                }

                dizmo.publicStorage.setProperty(path, value);
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
            viewer.subscribeToAttribute('settings/displaymode', function (path, value) {
                dizmo.setAttribute('state/framehidden', value === 'presentation');
            });

            dizmo.canDock(true);
        }
    }
});

Class('Calculator.Main', {

    has: {
        dizmo: {
            is: 'ro', init: function () {
                return new Calculator.Dizmo();
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

            // initial values if undefined
            if (!dizmo.privateStorage.getProperty("state/opflag")) dizmo.privateStorage.setProperty("state/opflag",false);
            if (!dizmo.privateStorage.getProperty("state/y")) dizmo.privateStorage.setProperty("state/y",0);
            if (!dizmo.privateStorage.getProperty("state/x")) dizmo.privateStorage.setProperty("state/x",0);
            if (!dizmo.privateStorage.getProperty("state/enterflag")) dizmo.privateStorage.setProperty("state/enterflag",false);
            if (!dizmo.privateStorage.getProperty("state/yflag")) dizmo.privateStorage.setProperty("state/yflag",false);

            var that=this;

	    this.displayX(dizmo.privateStorage.getProperty("state/x"));

            dizmo.privateStorage.subscribeToProperty("state/x",function(p,v,o){
                // when x changes, update the display
                that.displayX(x);
            });

            var $operator = jQuery('.operator');
            $operator.css('background-color', '#3c3c3c');
            $operator.css('color', '#dfdfdf');

            $operator.click(function (ev) {
                that.enterOp(jQuery(ev.target));
            });

            jQuery('.digit').click(function (ev) {
                that.enterDigit(jQuery(ev.target));
            });
            jQuery('#sign').click(function () {
                that.doUnaryMinus();
            });
            jQuery('#clear').click(function () {
                that.clear();
            });
            jQuery('#clear-all').click(function () {
                that.clearAll();
            });
        },

        highlightOp: function (style) {
            var operation=dizmo.privateStorage.getProperty("state/operation");

            var $op = jQuery('.operator');
            $op.css('background-color', '#3c3c3c');
            $op.css('color', '#dfdfdf');

            if (operation !== 'equals') {
                jQuery('#' + operation).css(style||'color', '#8ea318');
            }
        },

        clear: function () {
            dizmo.privateStorage.setProperty("state/x",0);
            dizmo.privateStorage.setProperty("state/operation",null);
        },

        clearAll: function () {
            dizmo.privateStorage.setProperty("state/opflag",false);
            dizmo.privateStorage.setProperty("state/y",0);
            dizmo.privateStorage.setProperty("state/x",0);
            dizmo.privateStorage.setProperty("state/enterflag",false);
            dizmo.privateStorage.setProperty("state/yflag",false);
            dizmo.privateStorage.setProperty("state/operation",null);
        },

        enterDigit: function ($sender) {

            var x=dizmo.privateStorage.getProperty("state/x");
            var y=dizmo.privateStorage.getProperty("state/y");
            var enterFlag=dizmo.privateStorage.getProperty("state/enterflag");
	    var opFlag;

            this.highlightOp();
            opFlag = false;

            if (enterFlag) {
                y = x;
                x = 0;
                enterFlag = false;
            }

            if (x.toString() !== '0.' && x === 0) {
                x = '';
            }

            var digit;
            if ($sender.attr('id') === 'point') {
                if (x && !x.match(/\./) || !x) {
                    digit = '.';
                }
            } else {
                digit = $sender.val();
            }

            if (digit) x = x + digit;
            if (x === '.') x = '0.';

            dizmo.privateStorage.setProperty("state/y",y);
            dizmo.privateStorage.setProperty("state/x",x);
            dizmo.privateStorage.setProperty("state/enterflag",enterFlag);
            dizmo.privateStorage.setProperty("state/opflag",opFlag);

        },

        enterOp: function ($sender) {

            var x=dizmo.privateStorage.getProperty("state/x");
            var opFlag=dizmo.privateStorage.getProperty("state/opflag");
            var y=dizmo.privateStorage.getProperty("state/y");
            var operation=dizmo.privateStorage.getProperty("state/operation");
            var enterFlag=dizmo.privateStorage.getProperty("state/enterflag");
            var yFlag=dizmo.privateStorage.getProperty("state/yflag");

            if (opFlag) {
                operation = $sender.attr('id');
                dizmo.privateStorage.setProperty("state/operation",operation);

                this.highlightOp('background-color');
            } else {
                opFlag = true;
                x = parseFloat(x);
                y = parseFloat(y);

                if (yFlag) switch (operation) {
                    case 'add':
                        x = y + x;
                        break;
                    case 'subtract':
                        x = y - x;
                        break;
                    case 'multiply':
                        x = y * x;
                        break;
                    case 'divide':
                        x = y / x;
                        break;
                }

                y = x;
                yFlag = true;

                operation = $sender.attr('id');
                dizmo.privateStorage.setProperty("state/operation",operation);

                this.highlightOp('background-color');
                enterFlag = true;

                x=this.cleanX(x);
            }

            dizmo.privateStorage.setProperty("state/opflag",opFlag);
            dizmo.privateStorage.setProperty("state/y",y);
            dizmo.privateStorage.setProperty("state/enterflag",enterFlag);
            dizmo.privateStorage.setProperty("state/yflag",yFlag);
            dizmo.privateStorage.setProperty("state/x",x);

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

        cleanX: function (t) {
            t = t.toFixed(10);
            while (t.match(/\..*0$/)) {
                t = t.replace(/0$/, '');
            }
            if (t.match(/\.$/)) {
                t = t.replace(/\.$/, '');
            }
            return t;
        },

        displayX: function (x) {
            jQuery('#readout').html(x);
            this.dizmo.my.publish(x);

            if (x === 'NaN') x = 0;
            if (x === 'Infinity') x = 0;
            dizmo.privateStorage.setProperty("state/x",x);
            this.checkSize();
        },

        doUnaryMinus: function () {
            var x=dizmo.privateStorage.getProperty("state/x");
            if (x === 0) return;
            x = -x;
            dizmo.privateStorage.setProperty("state/x",x);
        }
    }
});
