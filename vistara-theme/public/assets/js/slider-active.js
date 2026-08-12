(function ($) {
	"use strict";

	//home-two-slider
	let tp_cn_slider_main = new Swiper('.tp-cn-hero-slider-active', {
		slidesPerView: 1,
		loop: true,
		effect: 'fade',
		autoplay: false,
		spaceBetween: 0,
	});

	const heroNavButtons = document.querySelectorAll('.tp-cn-hero-btn-box span');
	heroNavButtons.forEach((button, index) => {
		button.addEventListener('click', () => {
			tp_cn_slider_main.slideToLoop(index);
		});
	});

	tp_cn_slider_main.on('slideChange', function () {
		let activeIndex = tp_cn_slider_main.realIndex;
		heroNavButtons.forEach((btn, idx) => {
			btn.classList.toggle('active', idx === activeIndex);
		});
	});
	tp_cn_slider_main.emit('slideChange');


	//home-five-slider
	let tp_at_slider_main = new Swiper('.tp-at-hero-slider-active', {
		slidesPerView: 1,
		loop: true,
		effect: 'fade',
		autoplay: true,
		spaceBetween: 0,
		autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
	});


	////brand-slider
	let tp_brand_slide = new Swiper(".tp-brand-slider-active", {
		loop: true,
        freemode: true,
        slidesPerView: 5,
        spaceBetween: 30,
        centeredSlides: true,
        allowTouchMove: false,
        speed: 4000,
        autoplay: {
            delay: 1,
            disableOnInteraction: true,
        },
        breakpoints: {
			'1400': {
				slidesPerView: 5,
			},
			'1200': {
				slidesPerView: 3.5,
			},
			'992': {
				slidesPerView: 3,
			},
			'768': {
				slidesPerView: 3,
			},
			'576': {
				slidesPerView: 2,
			},
			'0': {
				slidesPerView: 2,
			},
		},
	});


    ////text-slider
    var tp_text_slide = new Swiper(".tp-text-slider-active", {
        loop: true,
        freemode: true,
        slidesPerView: 'auto',
        spaceBetween: 30,
        centeredSlides: true,
        allowTouchMove: false,
        speed: 4000,
        autoplay: {
            delay: 1,
            disableOnInteraction: true,
        },
    });


	// testimonial-active
    document.addEventListener('DOMContentLoaded', function () {

		// Step 1: Thumb Swiper
		var thumbSwiper = new Swiper(".tp-testimonial-bottom-thumb-active", {
			spaceBetween: 24,
			slidesPerView: 4,
			loop: true,
			watchSlidesProgress: true,
			loopedSlides: 4,
			breakpoints: {
				1400: { slidesPerView: 4 },
				1200: { slidesPerView: 4 },
				992:  { slidesPerView: 4 },
				768:  { slidesPerView: 4 },
				576:  { slidesPerView: 3 },
				0:    { slidesPerView: 2 },
			},
		});

		// Step 2: Main Content Swiper
		var mainSwiper = new Swiper(".tp-testimonial-content-active", {
			spaceBetween: 24,
			slidesPerView: 1,
			loop: true,
			loopedSlides: 4,
			autoplay: {
				delay: 6000,
				disableOnInteraction: false,
			},
		});

		// Step 3: author Swiper
		var authorSwiper = new Swiper(".tp-testimonial-bottom-author-active", {
			spaceBetween: 24,
			slidesPerView: 1,
			loop: true,
			loopedSlides: 4,
			autoplay: {
				delay: 6000,
				disableOnInteraction: false,
			},
		});

		mainSwiper.on('slideChange', function () {
		thumbSwiper.slideToLoop(mainSwiper.realIndex);
		authorSwiper.slideToLoop(mainSwiper.realIndex);
	});

	thumbSwiper.on('click', function () {
		var realIndex = thumbSwiper.slides[thumbSwiper.clickedIndex]
				?.getAttribute('data-swiper-slide-index');
			if (realIndex !== undefined) {
				mainSwiper.slideToLoop(parseInt(realIndex));
				authorSwiper.slideToLoop(parseInt(realIndex));
			}
		});

		authorSwiper.on('click', function () {
			var realIndex = authorSwiper.slides[authorSwiper.clickedIndex]
					?.getAttribute('data-swiper-slide-index');
			if (realIndex !== undefined) {
				mainSwiper.slideToLoop(parseInt(realIndex));
				thumbSwiper.slideToLoop(parseInt(realIndex));
			}
		});

		var nextBtn = document.querySelector(".tp-testimonial-next");
		if (nextBtn) {
			nextBtn.addEventListener('click', function () {
				mainSwiper.slideNext();
			});
		}
	});


    var slider = new Swiper(".tp-about-active", {
        spaceBetween: 24,
        slidesPerView: 1,
        loop: true,
        loopedSlides: 4,
        autoplay: {
            delay: 6000,
            disableOnInteraction: false,
        },
		pagination: {
			el: ".tp-about-dots",
			clickable: true,
		},
    });


    var slider = new Swiper(".tp-fa-service-active", {
        spaceBetween: 24,
        slidesPerView: 2.5,
        loop: true,
        loopedSlides: 4,
        autoplay: {
            delay: 6000,
            disableOnInteraction: false,
        },
        breakpoints: {
			'992': {
				slidesPerView: 2.5,
			},
			'768': {
				slidesPerView: 2,
			},
			'576': {
				slidesPerView: 1.5,
			},
			'0': {
				slidesPerView: 1,
			},
		},
    });


    var slider = new Swiper(".tp-fa-gallery-active", {
        spaceBetween: 24,
        slidesPerView: 5,
        loop: true,
        autoplay: false,
        breakpoints: {
			'1200': {
				slidesPerView: 5,
			},
			'992': {
				slidesPerView: 4,
			},
			'768': {
				slidesPerView: 3,
			},
			'576': {
				slidesPerView: 2,
			},
			'0': {
				slidesPerView: 1,
			},
		},
    });


    var slider = new Swiper(".tp-cc-project-active", {
        spaceBetween: 24,
        slidesPerView: 3,
        loop: true,
        autoplay: true,
        autoplay: {
            delay: 6000,
            disableOnInteraction: false,
        },
        pagination: {
		  el: ".tp-cc-project-dot",
		  clickable: true,
		},
        breakpoints: {
			'1200': {
				slidesPerView: 3,
			},
			'992': {
				slidesPerView: 2.5,
			},
			'768': {
				slidesPerView: 2,
			},
			'500': {
				slidesPerView: 1,
			},
			'0': {
				slidesPerView: 1,
			},
		},
    });


    var slider = new Swiper(".tp-at-team-active", {
        spaceBetween: 24,
        slidesPerView: 2,
        loop: true,
        breakpoints: {
			'1200': {
				slidesPerView: 2,
			},
			'992': {
				slidesPerView: 2,
			},
			'768': {
				slidesPerView: 2,
			},
			'577': {
				slidesPerView: 2,
			},
			'0': {
				slidesPerView: 1,
			},
		},
    });


    var slider = new Swiper(".tp-at-testimonial-active", {
        spaceBetween: 24,
        slidesPerView: 5,
        loop: true,
        autoplay: true,
        speed: 4000,
        autoplay: {
            delay: 1,
            disableOnInteraction: true,
        },
        breakpoints: {
			'1600': {
				slidesPerView: 5,
			},
			'1400': {
				slidesPerView: 4,
			},
			'1200': {
				slidesPerView: 4,
			},
			'992': {
				slidesPerView: 3,
			},
			'768': {
				slidesPerView: 2,
			},
			'576': {
				slidesPerView: 2,
			},
			'0': {
				slidesPerView: 1,
			},
		},
    });



})(jQuery);