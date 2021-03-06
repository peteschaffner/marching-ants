
/**
 * Module dependencies.
 */

var Emitter = require('emitter');
var $ = require('jquery');

/**
 * Expose `MarchingAnts`.
 */

module.exports = MarchingAnts;

/**
 * Apply the average use-case of surrounding
 * multiple `el`s with marching ants.
 *
 * Options:
 *
 *  - `speed` rotation speed in milliseconds [60]
 *  - `radius` border radius of the dashed rectangle [5]
 *  - `strokeWidth` stroke width [2]
 *  - `strokeColor` stroke color ['rgba(0,0,0,0.1)']
 *  - `strokeDasharray` dash size and spacing ['6,5']
 *  - `fill` fill color ['none']
 *
 * @param {Mixed} els
 * @param {Object|Number} options or speed
 * @api public
 */

function marchingAnts(els, options) {
  $(els).each(function(i, el) {
    new MarchingAnts($(el), options);
  });
}

/**
 * Initialize a `MarchingAnts`.
 *
 * Options:
 *
 *  - `speed` rotation speed in milliseconds [60]
 *  - `radius` border radius of the dashed rectangle [5]
 *  - `strokeWidth` stroke width [2]
 *  - `strokeColor` stroke color ['rgba(0,0,0,0.1)']
 *  - `strokeDasharray` dash size and spacing ['6,5']
 *  - `fill` fill color ['none']
 *
 * @param {Mixed} el
 * @param {Object|Number} options or speed
 * @api public
 */

function MarchingAnts (el, options) {
  if (!(this instanceof MarchingAnts)) { return marchingAnts(el, options); }
  if (!svgTest()) { return $(el).addClass('ma-no-svg'); }
  if (typeof options === 'number') { options = { speed : options }; }
  
  var self = this;
  
  this.options = $.extend({
    speed: 60,
    radius: 5,
    strokeWidth: 2,
    strokeColor: 'rgba(0,0,0,0.1)',
    strokeDasharray: '6,5',
    fill: 'none'
  }, options);
  this.el = $(el);
  this.ants = $(require('./template'));
  this.rect = this.ants.children('rect');
  this.overlay = $(this.ants[2]);
  this.width = this.el.outerWidth();
  this.height = this.el.outerHeight();
  this.interval = null;
  
  
  // style our ants and overlay
  this.rect.attr({
    width: this.width - (this.options.strokeWidth * 2),
    height: this.height - (this.options.strokeWidth * 2),
    rx: this.options.radius,
    ry: this.options.radius,
    x: this.options.strokeWidth,
    y: this.options.strokeWidth,
    stroke: this.options.strokeColor,
    'stroke-width': this.options.strokeWidth,
    'stroke-dasharray': this.options.strokeDasharray,
    fill: this.options.fill
  });
  
  this.overlay.css('border-radius', this.options.radius + 1);
  this.el.css('border-radius', this.options.radius + 1);
  
  // append ants and bind events
  this.el.addClass('ma')
    .append(this.ants)
    .on('dragenter', function() {
      self.el.addClass('over');
    });
    
  // need to use an overlay to fix the `dragenter`
  // event firing for every child node
  this.overlay.on('dragenter', this.march.bind(this));
  // BUG: `dragleave` isn't firing in Opera
  this.overlay.on('dragleave', this.stop.bind(this));
  
  // handle element resizing
  $(window).resize(function() { resize(self); });
}

/**
 * Mixin emitter.
 */

Emitter(MarchingAnts.prototype);

/**
 * Make the ants march.
 * 
 * @api public
 */
 
MarchingAnts.prototype.march = function() {
  var self = this;
  
  if (this.isMarching) { return; }
  this.emit('march');
  this.interval = setInterval(function() {
    self.rect.attr('stroke-dashoffset', self.rect.attr('stroke-dashoffset')-1);
  }, this.options.speed);
  this.isMarching = true;
};

/**
 * Make the ants stop marching.
 * 
 * @api public
 */

MarchingAnts.prototype.stop = function() {
  if (!this.isMarching) { return; }
  this.emit('stop');
  clearInterval(this.interval);
  this.el.removeClass('over');
  this.isMarching = false;
};

/**
 * Resize the ants (based on window resize).
 * 
 * @param {MarchingAnts} obj
 * @api private
 */

function resize(obj) {
  if (obj.el.outerWidth() !== obj.width ||
    obj.el.outerHeight() !== obj.height) {
    obj.rect.attr({
      width: obj.el.outerWidth() - (obj.options.strokeWidth * 2),
      height: obj.el.outerHeight() - (obj.options.strokeWidth * 2)
    });
  }
}

/**
 * Test for svg support.
 * 
 * @api private
 */

function svgTest() {
  var div = document.createElement('div');
  var ns = 'http://www.w3.org/2000/svg';
  
  div.innerHTML = '<svg/>';
  return (div.firstChild && div.firstChild.namespaceURI) == ns;
}
