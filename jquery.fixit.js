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
	var fixedElementCount = 0;

	$.fn.fixit = function (options) {

		// Default values.
		var settings = $.extend({
			topMargin: 0,
			offset: 0,
			addClassAfter: null,
			sameDimension: true,
			zIndex: 0,
			reset: false,
			direction: false,
		}, options);

		$(this).each(function (index, element) {
			var $w = $(window);
			var $el = $(element);
			var actualTopPosition = 0;
			var previousScroll = 0;
			var rightDirection = !settings.direction;

			$w.scroll(function () {

				if (settings.direction) {
					var currentScroll = $(this).scrollTop();

					if(settings.direction !== "down" || settings.direction !== "up"){
						rightDirection = true;
					}
					else if (currentScroll > previousScroll) {
						settings.direction == "down" ? rightDirection = true : rightDirection = false;
					} else {
						settings.direction == "up" ? rightDirection = true : rightDirection = false;
					}

					previousScroll = currentScroll;
				}

				// Get element's and scroll positions.
				var currentTopPosition = $el.offset().top;
				var scrollPosition = $w.scrollTop() + settings.topMargin;
				
				// Get height and width of element.
				var elementWidth = $el.outerWidth();
				var elementHeight = $el.outerHeight();

				if ($el.css("position") !== "fixed" && scrollPosition > (currentTopPosition + settings.offset) && rightDirection && settings.reset === false) {
					// Fix the element.
					$el.css("position", "fixed");
					$el.css("top", "" + settings.topMargin + "px");
					$el.css("z-index", "" + settings.zIndex);

					if (settings.sameDimension) {
						$el.css("width", elementWidth);
						$el.css("height", elementHeight);
					}
					// Add a dummy placeholder element at the place of the element so that after getting fixed, the space is not occupied by the next element.
					$("<div id = 'remove_" + fixedElementCount + "' class='" + ($el.attr("class")) + "' style = 'width:" + (elementWidth) + "px;height:" + (elementHeight) + "px;opacity:0;'></div>").insertAfter($el);

					if (settings.addClassAfter != null) {
						$el.addClass(settings.addClassAfter);
					}
					actualTopPosition = currentTopPosition;
					fixedElementCount++;
					$el.trigger("fixed");
				}
				else if ($el.css("position") === "fixed" && scrollPosition <= actualTopPosition || settings.reset === true || !rightDirection) {
					// Unfix the element.
					fixedElementCount--;
					// Remove the corresponding dummy placeholder element.
					$("#remove_" + fixedElementCount).remove();
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
