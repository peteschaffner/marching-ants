
/**
 * Module dependencies.
 */

var Emitter = require('emitter');
var $ = require('jquery');
var svg = require('./template');

/**
 * Expose `marchingAnts`.
 */

module.exports = marchingAnts;

/**
 * Apply the average use-case of surrounding
 * the `el` with marching ants.
 *
 * Options:
 *
 *  - `speed` rotation speed in milliseconds [200]
 *  - `border radius` border radius of the dashed rectangle [5]
 *
 * @param {Mixed} el
 * @param {Object|Number} options or speed
 * @api public
 */

function marchingAnts(el, options) {
  options = $.extend({
    speed: 60,
    radius: 5,
    strokeWidth: 2,
    strokeColor: 'rgba(0,0,0,0.1)',
    strokeDasharray: '6,5',
    fill: 'none'
  }, options);
  
  $(el).each(function(i, el) {
    var $el = $(el);
    var $svg = $(svg);
    var $rect = $svg.children('rect');
    var $overlay = $($svg[2]);
    var width = $el.outerWidth();
    var height = $el.outerHeight();
    var interval;
    
    // style our ants and overlay
    $rect.attr({
      width: width - (options.strokeWidth * 2),
      height: height - (options.strokeWidth * 2),
      rx: options.radius,
      ry: options.radius,
      x: options.strokeWidth,
      y: options.strokeWidth,
      stroke: options.strokeColor,
      'stroke-width': options.strokeWidth,
      'stroke-dasharray': options.strokeDasharray,
      fill: options.fill
    });
    
    $overlay.css('border-radius', options.radius + 1);
    $el.css('border-radius', options.radius + 1);
    
    // append ants to target
    $el.addClass('ma')
      .append($svg);
    
    // handle element resizing
    $(window).resize(function() {
      if ($el.outerWidth() != width || $el.outerHeight() != height) {
        $rect.attr({
          width: $el.outerWidth() - 4,
          height: $el.outerHeight() - 4
        });
      }
    });
    
    // handle drag hover animation
    $el.on('dragenter', function() {
      $el.addClass('over');
    });
    
    // TODO: cleanup
    // dragleave isn't firing in Opera
    $(document).on('dragend', function() {
      clearInterval(interval);
      $('.ma-overlay').removeClass('over');
    });
    
    $overlay.on('dragenter', function() {
      interval = setInterval(function() {
        $rect.attr('stroke-dashoffset', $rect.attr('stroke-dashoffset') - 1);
      }, options.speed);
    }).on('dragleave', function() {
      clearInterval(interval);
      $el.removeClass('over');
    });
  });
}
