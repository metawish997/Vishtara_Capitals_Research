/***************************************************
==================== JS INDEX ======================
****************************************************/

(function ($) {
	"use strict";

	var windowOn = $(window);


	// PreLoader Js
	windowOn.on('load', function () {
		$("#loading").fadeOut(500);
	});


	// Common Js//
	$("[data-background]").each(function () {
		$(this).css("background-image", "url( " + $(this).attr("data-background") + "  )");
	});

	$("[data-width]").each(function () {
		$(this).css("width", $(this).attr("data-width"));
	});

	$("[data-height]").each(function () {
		$(this).css("height", $(this).attr("data-height"));
	});

	$("[data-bg-color]").each(function () {
		$(this).css("background-color", $(this).attr("data-bg-color"));
	});

	$("[data-text-color]").each(function () {
		$(this).css("color", $(this).attr("data-text-color"));
	});


	// header height js
	if ($('.tp-header-height').length > 0) {
		var headerHeight = document.querySelector(".tp-header-height");      
		var setHeaderHeight = headerHeight.offsetHeight;
		
		$(".tp-header-height").each(function () {
			$(this).css({
				'height' : setHeaderHeight + 'px'
			});
		});
	  }


	//  Nice Select Js//
	$('.tp-select').niceSelect();


	// ==========================
	// Open Handlers
	// ==========================
	$(".tp-offcanvas-open-btn").on("click", function () {
		$(".tp-offcanvas-area, .body-overlay").addClass("opened");
	});

	$(".tp-search-open-btn").on("click", function () {
		$(".tp-search-area, .body-overlay").addClass("opened");
	});

	// ==========================
	// Close Handlers
	// ==========================
	$(".tp-offcanvas-close-btn, .tp-search-close-btn, .body-overlay").on("click", function () {
		$(".tp-offcanvas-area, .tp-search-area").removeClass("opened");
		$(".body-overlay").removeClass("opened");
	});


	// magnificPopup img view //
	$('.popup-image').magnificPopup({
		type: 'image',
		gallery: {
			enabled: true
		}
	});


	// magnificPopup video view //
	$(".popup-video").magnificPopup({
		type: "iframe",
	});


	// Counter Js //
	new PureCounter();


	// Smooth Scroll Js//
	function smoothSctoll() {
		$('.smooth a').on('click', function (event) {
			let target = $(this.getAttribute('href'));
			if (target.length) {
				event.preventDefault();
				$('html, body').stop().animate({
					scrollTop: target.offset().top - 60
				}, 1500);
			}
		});
	}
	smoothSctoll();


	// back to top //
	function back_to_top() {
		var btn = $('#back_to_top');
		var btn_wrapper = $('.back-to-top-wrapper');
		windowOn.scroll(function () {
			if (windowOn.scrollTop() > 300) {
				btn_wrapper.addClass('back-to-top-btn-show');
			} else {
				btn_wrapper.removeClass('back-to-top-btn-show');
			}
		});

		btn.on('click', function (e) {
			e.preventDefault();
			$('html, body').animate({ scrollTop: 0 }, '300');
		});
	}
	back_to_top();


	// mobile menu Js//
	let tpMenuWrap = $('.tp-mobile-menu-active > ul').clone();
	let tpSideMenu = $('.tp-offcanvas-menu nav');
	tpSideMenu.append(tpMenuWrap);
	if ($(tpSideMenu).find('.submenu, .mega-menu').length != 0) {
		$(tpSideMenu).find('.submenu, .mega-menu').parent().append
			('<button class="tp-menu-close"></button>');
	}
	let sideMenuList = $('.tp-offcanvas-menu nav > ul > li button.tp-menu-close, .tp-offcanvas-menu nav > ul li.has-dropdown > a, .tp-offcanvas-menu nav > ul li.has-dropdown > ul > li.menu-item-has-children > a');
	$(sideMenuList).on('click', function (e) {
		e.preventDefault();
		$(this).parent().toggleClass('active');
		$(this).siblings('.submenu, .mega-menu').slideToggle();
	});


	// Sticky Header
	$(window).on('scroll', function () {
		var scroll = $(window).scrollTop();
		if (scroll < 200) {
			$("#header-sticky").removeClass("header-sticky");
		} else {
			$("#header-sticky").addClass("header-sticky");
		}
	});


	// scroll wrapper //
	let tl = gsap.timeline();
	gsap.registerPlugin(ScrollTrigger);

	//fade-class-active //
	if ($(".tp-fade-anim").length > 0) {
		gsap.utils.toArray(".tp-fade-anim").forEach((item) => {

		let tp_fade_offset = item.getAttribute("data-fade-offset") || 40,
			tp_duration_value = item.getAttribute("data-duration") || 0.75,
			tp_fade_direction = item.getAttribute("data-fade-from") || "bottom",
			tp_onscroll_value = item.getAttribute("data-on-scroll") || 1,
			tp_delay_value = item.getAttribute("data-delay") || 0.15,
			tp_ease_value = item.getAttribute("data-ease") || "power2.out";

		let tp_anim_setting = {
			opacity: 0,
			ease: tp_ease_value,
			duration: parseFloat(tp_duration_value),
			delay: parseFloat(tp_delay_value),
			x: (tp_fade_direction == "left" ? -tp_fade_offset : (tp_fade_direction == "right" ? tp_fade_offset : 0)),
			y: (tp_fade_direction == "top" ? -tp_fade_offset : (tp_fade_direction == "bottom" ? tp_fade_offset : 0)),
		};

		if (tp_onscroll_value == 1) {
			tp_anim_setting.scrollTrigger = {
				trigger: item,
				start: 'top 90%',
				toggleActions: "play none none none",
				once: true
				};
			}

			gsap.from(item, tp_anim_setting);
		});

		ScrollTrigger.refresh();
	}

	// button hover
    document.querySelectorAll('.tp-btn-event').forEach(button => {
        const arrow = button.querySelector('.button-image');
        const dot = button.querySelector('.button-dot');

        // Initial state (arrow starts from bottom-left)
        gsap.set(arrow, {
            transform: "translate3d(-24px, 24px, 0px) scale3d(1,1,1)",
            opacity: 1
        });

        button.addEventListener('mouseenter', () => {
            // Dot expand
            gsap.to(dot, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
            // Arrow comes to center
            gsap.to(arrow, {
                transform: "translate3d(0px, 0px, 0px) scale3d(1,1,1)",
                opacity: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        button.addEventListener('mouseleave', () => {
            // Dot shrink
            gsap.to(dot, {
                scale: 0.25,
                duration: 0.3,
                ease: "power2.inOut"
            });
            // Arrow exits to top-right then reset
            const tl = gsap.timeline();
            tl.to(arrow, {
                transform: "translate3d(24px, -24px, 0px) scale3d(1,1,1)",
                opacity: 0,
                duration: 0.25,
                ease: "power2.in"
            })
			.set(arrow, {
				transform: "translate3d(-24px, 24px, 0px) scale3d(1,1,1)"
			});
        });
    });
	

	// section title animation
	document.addEventListener("DOMContentLoaded", (event) => {
		function createScrollTrigger(triggerElement, timeline) {
			ScrollTrigger.create({
				trigger: triggerElement,
				start: "top 80%",
				once: true,
				onEnter: () => timeline.play(),
			});
		}

		// 2. Split the text into chars (Required for [text-split])
		const splitTypeElements = document.querySelectorAll("[data-text-split]");
		splitTypeElements.forEach((element) => {
			new SplitType(element, {
				types: "words, chars",
				tagName: "span",
			});
			// Ensure visibility after split
			gsap.set(element, { opacity: 1 });
		});

		// 3. The specific animation for [letters-fade-in]
		const lettersFadeInElements = document.querySelectorAll("[data-letters-fade-in]");
		lettersFadeInElements.forEach((element) => {
			const tl = gsap.timeline({ paused: true });
			const chars = element.querySelectorAll(".char");
			
			tl.from(chars, {
				opacity: 0,
				duration: 0.2,
				ease: "power1.out",
				stagger: { amount: 0.8 },
			});
			
			createScrollTrigger(element, tl);
		});
	});


	//  handle data-speed attr
	let speedXTriggers = [];
		function initSpeedX() {
			speedXTriggers.forEach(st => st.kill());
			speedXTriggers = [];
			if (window.innerWidth < 1200) return;
			gsap.utils.toArray("[data-speed-x]").forEach(el => {
				const speedX = parseFloat(el.dataset.speedX) || 0;
				const st = ScrollTrigger.create({
					trigger: el,
					scrub: true,
					onUpdate: (self) => {
						const progress = self.progress;
						const move = progress * speedX * 300;
						gsap.set(el, { x: -move });
					}
				});
				speedXTriggers.push(st);
			});
		}
		function handleDataSpeedAttr() {
			const elements = document.querySelectorAll("[data-speed], [data-speed-original]");
			elements.forEach(el => {
				if (!el.dataset.speedOriginal && el.dataset.speed) {
					el.dataset.speedOriginal = el.dataset.speed;
				}
				if (window.innerWidth < 1200) {
					el.removeAttribute("data-speed");
				} else {
					if (el.dataset.speedOriginal) {
						el.setAttribute("data-speed", el.dataset.speedOriginal);
					}
				}
			});
			initSpeedX();
		}
		handleDataSpeedAttr();
		window.addEventListener("resize", () => {
		handleDataSpeedAttr();
		ScrollTrigger.refresh();
	});


	// file upload js
	document.addEventListener("DOMContentLoaded", () => {
		document.querySelectorAll(".tp-file-upload").forEach((box) => {
			const input = box.querySelector(".file-input");
			const preview = box.querySelector(".preview-image");
			const content = box.querySelector(".tp-file-upload-content-pos");

			if (!input || !preview) return;

			input.addEventListener("change", (e) => {
				const [file] = e.target.files;

				if (file && file.type.startsWith("image/")) {
					preview.src = URL.createObjectURL(file);
					preview.style.display = "block";
					
					if (content) content.style.display = "none";
					preview.onload = () => URL.revokeObjectURL(preview.src);
				}
			});
		});
	});



})(jQuery);
