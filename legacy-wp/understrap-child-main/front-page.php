<?php
/**
 * The template for displaying the Front Page
 */
defined( 'ABSPATH' ) || exit;
get_header();
$container = get_theme_mod( 'understrap_container_type' );
?>

<section id="hero-video-module" class="hero-video-wrapper">
    <div class="hero-video-container">
        <div class="hero-logo-overlay">
            <img src="<?php echo get_stylesheet_directory_uri(); ?>/images/yugotour-logo-video-overlay.svg" alt="Yugotour Logo">
        </div>
        <video autoplay muted loop playsinline 
               poster="<?php echo get_stylesheet_directory_uri(); ?>/images/webm-fallback0.webp" 
               class="hero-video-element">
            <source src="<?php echo get_stylesheet_directory_uri(); ?>/images/header-hero-video-notitle.webm" type="video/webm">
            <img src="<?php echo get_stylesheet_directory_uri(); ?>/images/webm-fallback0.webp" alt="Yugotour Hero">
        </video>
    </div>
</section>



<section id="intro-section" class="intro-module" style="background-image: url('<?php echo get_stylesheet_directory_uri(); ?>/images/texture-cream.webp');">
    
	<div class="tripadvisor-badge-anchor">
        <img src="<?php echo get_stylesheet_directory_uri(); ?>/images/tripadvisor-travelers-choice-badge.webp" alt="Tripadvisor Travelers Choice 2025">
    </div>
	
    <div class="spomenik-bg">
        <img src="<?php echo get_stylesheet_directory_uri(); ?>/images/halftoned-spomenik.webp" alt="">
    </div>

    <div class="container">
        <div class="row">
            <div class="col-12 col-lg-9 offset-lg-1">
                <div class="intro-copy-wrapper">
                    <h2 class="staggered-headline">
                        <span class="line-1"><?php the_field('intro_headline_top'); ?></span>
                        <span class="line-2"><?php the_field('intro_headline_bottom'); ?></span>
                    </h2>
                    <div class="intro-text-1-container">
                        <p class="intro-text-1">
                            <?php the_field('intro_body_1'); ?>
                            <a href="<?php the_field('intro_button_url'); ?>" class="yugo-red-link">
                                <?php the_field('intro_button_text'); ?> &rarr;
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div class="row justify-content-center">
            <div class="col-12 text-center">
                <picture class="yugo-car-display">
                    <source srcset="<?php echo get_stylesheet_directory_uri(); ?>/images/yugos-desktop.webp" media="(min-width: 992px)">
                    <img src="<?php echo get_stylesheet_directory_uri(); ?>/images/yugos-mobile.webp" alt="Yugoslav Cars">
                </picture>
            </div>
        </div>

        <div class="row">
            <div class="col-12 col-lg-9 offset-lg-1">
                <div class="how-it-works">
                    <p class="how-it-works-title"><strong><?php the_field('how_it_works_title'); ?></strong></p>
                    <ul class="yugo-bullets">
                        <li><span>❶</span> <?php the_field('bullet_1'); ?></li>
                        <li><span>❷</span> <?php the_field('bullet_2'); ?></li>
                        <li><span>❸</span> <?php the_field('bullet_3'); ?></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</section>


<section class="city-picker-module">
    <div class="container">
        <div class="picker-stack-wrapper">
            
            <div class="picker-header">
                <h2 class="headline-en">Where to, Comrade?</h2>
                <img src="<?php echo get_stylesheet_directory_uri(); ?>/images/star.webp" class="yugo-star" alt="*">
                <h2 class="headline-latin">Kuda, Druže?</h2>
                <img src="<?php echo get_stylesheet_directory_uri(); ?>/images/star.webp" class="yugo-star" alt="*">
                <h2 class="headline-cyrillic">Куда, Друже?</h2>
            </div>
            
            <div class="flag-ribbon-wrap">
                <img src="<?php echo get_stylesheet_directory_uri(); ?>/images/flag-ribbon.webp" class="flag-ribbon" alt="">
            </div>

            <div class="map-wrapper">
                <div class="map-inner">
                    <img src="<?php echo get_stylesheet_directory_uri(); ?>/images/yugo-map.webp" class="base-map" alt="Yugoslavia Map">
                    
                    <a href="/belgrade-tours" class="city-sign belgrade-pos">
                        <img src="<?php echo get_stylesheet_directory_uri(); ?>/images/belgrade-sign.webp" alt="Belgrade Tours">
                    </a>
                    
                    <a href="/sarajevo-tours" class="city-sign sarajevo-pos">
                        <img src="<?php echo get_stylesheet_directory_uri(); ?>/images/sarajevo-sign.webp" alt="Sarajevo Tours">
                    </a>
                </div>
            </div>
        </div>

        <img src="<?php echo get_stylesheet_directory_uri(); ?>/images/partizan-girl.webp" class="partizan-girl" alt="">
    </div>
</section>






<section id="tour-carousel-module" class="yugo-full-width">
    <div class="d-none d-lg-block">
        <?php echo do_shortcode('[metaslider id="83"]'); ?>
    </div>
    <div class="d-block d-lg-none">
        <?php echo do_shortcode('[metaslider id="106"]'); ?>
    </div>
</section>




<section id="tales-from-the-road" class="tales-module">
    <div class="container">
        <h2 class="tales-main-title">Tales From the Road</h2>

<div class="city-review-group">
    <h3 class="city-label">BELGRADE</h3>
    <div class="jotform-wrapper">
        <div id="JFWebsiteWidget-019d5f672eff751aaabdf254da1d85f411f4"></div> 
        <script src='https://www.jotform.com/website-widgets/embed/019d5f672eff751aaabdf254da1d85f411f4'></script>
    </div>
</div>

<div class="city-review-group">
    <h3 class="city-label">SARAJEVO</h3>
    <div class="jotform-wrapper">
        <div id="JFWebsiteWidget-019d5feef4297bba973ed40b64c5f91f4cad"></div>
        <script src='https://www.jotform.com/website-widgets/embed/019d5feef4297bba973ed40b64c5f91f4cad'></script>
    </div>
</div>
        
</div>
    </div>
</section>



<?php 
    // Fetch the URL from the Customizer, or use your default
    $yugo_video_url = get_theme_mod('yugo_tv_video_url', 'https://www.youtube.com/watch?v=w3MiHAacio0');
    
    // Convert standard YT link to embed format
    $embed_url = str_replace("watch?v=", "embed/", $yugo_video_url);
?>

<section class="tv-section">
    <div class="tv-divider-bar"></div>

    <div class="tv-container">
        <div class="video-layer">
            <iframe 
                src="<?php echo esc_url($embed_url); ?>?rel=0&modestbranding=1&playsinline=1&iv_load_policy=3" 
                frameborder="0" 
                allow="autoplay; encrypted-media; picture-in-picture" 
                allowfullscreen
                playsinline> </iframe>
        </div>

        <div class="tv-overlay">
            <picture>
                <source srcset="<?php echo get_stylesheet_directory_uri(); ?>/images/television-desktop.webp" media="(min-width: 992px)">
                <img src="<?php echo get_stylesheet_directory_uri(); ?>/images/television-mobile.webp" alt="Vintage TV Frame">
            </picture>
        </div>
    </div>

    <div class="tv-divider-bar"></div>
</section>



<?php
// Removed the front-page-wrapper completely to avoid ghost characters and extra spacing.
get_footer();