// Fixit Plugin v1.0.1 for jQuery
// ==============================
// Author: Prakash Sharma
// Created: 05/06/2016
// Website: https://github.com/itsprakash87/fixit
// Description: 
// Fix any element on the page according to the options passed.
// You can also add class to the element when it is fixed.
// It also trigger events when element is "fixed" and "unfixed".

(function ($) {
    var $i = 0;
    $.fn.fixit = function (options) {
        

        // Default values.
        var settings = $.extend({
            topMargin: 0,
            offest:0,
            addClassAfter: null,
            sameDimension: true,
            zIndex: 0,
            reset:false,
            direction:false,
        }, options);

        $(this).each(function(index, element){
                var $w = $(window); 
                var $el = $(element); 
                var $_top_last = 0; 
                var $_actual_position = $el.css("position");
                var previousScroll = 0;
                var checkDirection= settings.direction ? false : true;

                $(window).scroll(function () {
                
         


                if (settings.direction) {
                    
                    var currentScroll = $(this).scrollTop();

                   if (currentScroll > previousScroll){
                       settings.direction =='down'? checkDirection = true : checkDirection = false;
                   } else {
                      settings.direction =='up'? checkDirection = true : checkDirection = false;
                   }
                   previousScroll = currentScroll;
                }


                    // Get element and scroll positions.
                    var $_top = $el.offset().top, viewTop = $w.scrollTop() + settings.topMargin;
                    elem=$el;
                    // Get height and width of element.
                    var $width_ele = $(elem).outerWidth(); 
                    var $height_ele = $(elem).outerHeight(); 

                    if ($el.css("position") != "fixed" && viewTop > ($_top + settings.offest) && checkDirection && settings.reset==false) {
                        // Fix the element.
                        $_actual_position = $el.css("position");
                        $el.css("position", "fixed");
                        $el.css("top", "" + settings.topMargin + "px");
                        $el.css("z-index", "" + settings.zIndex);

                        if (settings.sameDimension) {
                            $el.css("width", $width_ele);
                            $el.css("height", $height_ele);
                        }

                        $("<div id = 'remove_" + $i + "' class='" + ($el.attr("class")) + "' style = 'width:" + ($width_ele) + ";height:" + ($height_ele) + ";opacity:0;'></div>").insertAfter($el);

                        if (settings.addClassAfter != null) {
                            $el.addClass(settings.addClassAfter);
                        }
                        $_top_last = $_top;
                        $i++;
                        $el.trigger("fixed");
                    }
                    else if ($el.css("position") == "fixed" && viewTop <= $_top_last || settings.reset==true || !checkDirection) {
                        // Unfix the element.
                        $i--;
                        $("#remove_" + $i).remove();
                        $el.css("position", $_actual_position);
                        $el.removeAttr("style");
                        if (settings.addClassAfter != null) {
                            $el.removeClass(settings.addClassAfter);
                        }
                        $el.trigger("unfixed");
                    }
                });
                return $el;
        });


    };

})(jQuery);
