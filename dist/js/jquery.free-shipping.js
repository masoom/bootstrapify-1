(function($,_) {

  var FreeShipping = function($ele, settings){
    this.$ele = $ele;
    this.settings = settings;
    this.$template = $(settings.template);
    this.$wrapper = $(settings.wrapper);
    
    this.init();
  };
  
  FreeShipping.prototype.init = function () {
    var locales = this._calc_locales(this.settings);
    this._render(locales);
  };
  
  FreeShipping.prototype.update = function (data) {
    this.$wrapper.html('');
    this.settings = $.extend(this.settings, data);
    this.init();
  };
  
  FreeShipping.prototype._calc_locales = function (data) {
    var total = parseInt(data.cart_total) / 100;
    var free_shipping = parseInt(data.free_shipping) / 100;
    var diff = free_shipping - total;
    return {
      total: this._as_money(total),
      free_shipping: this._as_money(free_shipping),
      difference: (diff > 0)? this._as_money(diff) : this._as_money(0),
      has_free_shipping: (total > free_shipping)? true : false
    };
  };
  
  FreeShipping.prototype._render = function (locales) {
    var template = _.template($.trim(this.$template.text()));
    var rendered = template(locales);
    this.$wrapper.append(rendered);
  };
  
  FreeShipping.prototype._as_money = function(int, prefix, suffix) {
    prefix = prefix || '$';
    suffix = suffix || '';
    return prefix + int.toFixed(2).toLocaleString() + suffix;
  };

  $.fn.freeShipping = function (opts) {
    var settings = $.extend({}, $.fn.freeShipping.defaults, opts);
    return this.each(function () {
      var $ele = $(this);
      $ele.data('_freeShipping', new FreeShipping($ele, settings));
    });
  };
  
  $.fn.freeShipping.defaults = {
    cart_total: 0,
    free_shipping: 0,
    template: '#free-shipping-template',
    wrapper: '#free-shipping-wrapper'
  };

}(jQuery, _));