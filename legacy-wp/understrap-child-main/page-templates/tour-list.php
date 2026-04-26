<?php
/**
 * Template Name: Tour List Page
 *
 * @package understrap
 */

defined( 'ABSPATH' ) || exit;

get_header();

$current_slug = $post->post_name;
$city = ( strpos( $current_slug, 'sarajevo' ) !== false ) ? 'sarajevo' : 'belgrade';
$img_path = get_stylesheet_directory_uri() . '/images/';
?>

<div class="wrapper" id="page-wrapper">

    <header class="tour-header">

        <div class="header-layer layer-1">
            <picture>
                <source srcset="<?php echo $img_path . $city; ?>-mobile-header-layer-1.webp" media="(max-width: 991px)">
                <img src="<?php echo $img_path . $city; ?>-header-layer-1.webp" alt="Layer 1">
            </picture>
        </div>

        <div class="header-layer layer-2">
            <picture>
                <source srcset="<?php echo $img_path . $city; ?>-mobile-header-layer-2.webp" media="(max-width: 991px)">
                <img src="<?php echo $img_path . $city; ?>-header-layer-2.webp" alt="Layer 2">
            </picture>
        </div>

        <div class="header-text-layer">
            <div class="container">
                <h1 class="tour-title"><?php the_title(); ?></h1>
            </div>
        </div>

        <div class="header-layer layer-3">
            <picture>
                <source srcset="<?php echo $img_path . $city; ?>-mobile-header-layer-3.webp" media="(max-width: 991px)">
                <img src="<?php echo $img_path . $city; ?>-header-layer-3.webp" alt="Layer 3">
            </picture>
        </div>

        <div class="header-layer layer-4">
            <img src="<?php echo $img_path . $city; ?>-mobile-header-layer-4.webp" alt="Layer 4">
        </div>

    </header>

    <section id="tour-list-intro" class="tour-intro-section <?php echo esc_attr($city); ?>" style="--tour-bg: url('<?php echo get_stylesheet_directory_uri(); ?>/images/<?php echo $city; ?>-list-page-background.webp');">

        <div class="container">
            <div class="row">
                <div class="col-lg-8">
                    <h1 class="intro-headline">
                        <span class="part-black"><?php the_field('intro_header_black'); ?></span> <span class="part-red"><?php the_field('intro_header_red'); ?></span>
                    </h1>
                    <div class="intro-copy-rich">
                        <?php the_field('intro_body_text'); ?>
                    </div>
                </div>
            </div>

            <!-- TOUR GRID -->
            <section class="tour-grid">
                <?php
                $args = array(
                    'post_type'      => 'tour',
                    'posts_per_page' => -1,
                    'orderby'        => 'menu_order',
                    'order'          => 'ASC',
                    'tax_query'      => array(
                        array(
                            'taxonomy' => 'tour_city',
                            'field'    => 'slug',
                            'terms'    => $city,
                        ),
                    ),
                );

                $tour_query = new WP_Query( $args );

                if ( $tour_query->have_posts() ) :
                    while ( $tour_query->have_posts() ) : $tour_query->the_post();

                        $thumbnail     = get_field('tour_thumbnail');
                        $duration      = get_field('tour_duration');
                        $price_group   = get_field('tour_price_group');
                        $includes      = get_field('tour_includes');
                        $extra_1       = get_field('tour_extra_1');
                        $extra_1_price = get_field('tour_extra_1_price');
                        $extra_2       = get_field('tour_extra_2');
                        $extra_2_price = get_field('tour_extra_2_price');
                        $intro_1       = get_field('tour_intro_1');
                ?>

                    <article class="tour-tile">
                        <a href="<?php the_permalink(); ?>" class="tour-tile-inner">

                            <div class="tile-image-wrap">
                                <?php if ( $thumbnail ) : ?>
                                    <img src="<?php echo esc_url($thumbnail); ?>" alt="<?php the_title_attribute(); ?>" class="tile-bg-img">
                                <?php endif; ?>
                                <div class="tile-gradient"></div>
                                <h2 class="tile-title"><?php the_title(); ?></h2>
                                <span class="tile-cta">LET'S GO &rarr;</span>
                            </div>

                            <div class="tile-info-bar">

                                <?php if ( $intro_1 ) : ?>
                                <div class="tile-intro-text">
                                    <?php echo wp_kses_post($intro_1); ?>
                                </div>
                                <?php endif; ?>

                                <div class="tile-info-lines">
								<p class="tile-info-line">
									<?php if ( $duration ) : ?>
										<span class="info-val"><?php echo esc_html($duration); ?></span>
									<?php endif; ?>
									<?php if ( $price_group ) : ?>
										<span class="info-sep">|</span>
										<span class="info-val"><?php echo esc_html($price_group); ?>€</span>
									<?php endif; ?>
									<?php if ( $includes ) : ?>
										<span class="info-sep">|</span>
										<span class="info-val">INCL. <?php echo wp_strip_all_tags($includes); ?></span>
									<?php endif; ?>
									<?php if ( $extra_1 || $extra_2 ) : ?>
										<span class="info-extras">
											+<?php echo esc_html($extra_1); ?><?php if ($extra_1_price) echo ' ' . esc_html($extra_1_price) . '€'; ?>
											<?php if ( $extra_2 ) : ?>
												| +<?php echo esc_html($extra_2); ?><?php if ($extra_2_price) echo ' ' . esc_html($extra_2_price) . '€'; ?>
											<?php endif; ?>
										</span>
									<?php endif; ?>
								</p>
							</div>

                            </div>

                        </a>
                    </article>

                <?php
                    endwhile;
                    wp_reset_postdata();
                else :
                    echo '<p>No tours found for this city yet. Check back soon!</p>';
                endif;
                ?>
            </section>
            <!-- END TOUR GRID -->

        </div>

        <!-- END TOUR GRID -->

    </div>

</section>

<?php
if ( $city === 'belgrade' ) {
    $slider_desktop = 195;
    $slider_mobile  = 189;
} else {
    $slider_desktop = 202;
    $slider_mobile  = 196;
}
?>

<section id="tour-carousel-module" class="yugo-full-width">
    <div class="d-none d-lg-block">
        <?php echo do_shortcode('[metaslider id="' . $slider_desktop . '"]'); ?>
    </div>
    <div class="d-block d-lg-none">
        <?php echo do_shortcode('[metaslider id="' . $slider_mobile . '"]'); ?>
    </div>
</section>


<?php
// Tales From the Road — single city widget
$belgrade_widget = '019d5f672eff751aaabdf254da1d85f411f4';
$sarajevo_widget = '019d5feef4297bba973ed40b64c5f91f4cad';
$widget_id = ( $city === 'sarajevo' ) ? $sarajevo_widget : $belgrade_widget;
?>

<section id="tales-from-the-road" class="tales-module">
    <div class="container">
        <h2 class="tales-main-title">Tales From the Road</h2>
        <div class="jotform-wrapper">
            <div id="JFWebsiteWidget-<?php echo $widget_id; ?>"></div>
            <script src='https://www.jotform.com/website-widgets/embed/<?php echo $widget_id; ?>'></script>
        </div>
    </div>
</section>



<section class="yugo-simulator-module">
    <div class="sim-black-bar sim-bar-top"></div>

    <div class="sim-bg-wrap">
        <picture class="sim-bg-picture">
            <source srcset="<?php echo get_stylesheet_directory_uri(); ?>/images/space-age-wireframe-desktop.webp" media="(min-width: 992px)">
            <img src="<?php echo get_stylesheet_directory_uri(); ?>/images/space-age-wireframe-mobile.webp" alt="" class="sim-bg-img">
        </picture>

        <div class="sim-content">

		<div class="sim-headline">YUGOTOUR SIMULATOR</div>

            <div class="sim-car-wrap">

                <!-- DRIVING VIDEO (behind everything) -->
                <video autoplay muted loop playsinline class="sim-drive-video">
                    <source src="<?php echo get_stylesheet_directory_uri(); ?>/images/yugo-tour-simulator-smallest-possible.webm" type="video/webm">
                </video>

                <!-- CAR INTERIOR OVERLAY -->
                <img src="<?php echo get_stylesheet_directory_uri(); ?>/images/CarInterior2.webp" alt="Yugo Interior" class="sim-car-interior">

                <!-- STEERING WHEEL -->
                <div class="sim-steering-wrap" id="simSteeringWrap">
                    <img src="<?php echo get_stylesheet_directory_uri(); ?>/images/steering-wheel-570kb.webp" alt="" class="sim-steering-wheel" id="simSteeringWheel">
                </div>

                <!-- SOUND TOGGLE -->
                <div class="sim-sound-wrap" id="simSoundWrap">
                    <img src="<?php echo get_stylesheet_directory_uri(); ?>/images/sound-off.webp" alt="Sound Off" class="sim-sound-btn" id="simSoundBtn">
                </div>

                <!-- RADIO AUDIO -->
                <audio id="simRadio" loop preload="none">
                    <source src="<?php echo get_stylesheet_directory_uri(); ?>/audio/yugo-simulator-radio-chatter.mp3" type="audio/mpeg">
                </audio>

                <!-- HORN AUDIO -->
                <audio id="simHorn" preload="auto">
                    <source src="<?php echo get_stylesheet_directory_uri(); ?>/audio/horn.mp3" type="audio/mpeg">
                </audio>

            </div><!-- .sim-car-wrap -->

        </div><!-- .sim-content -->
    </div><!-- .sim-bg-wrap -->

    <div class="sim-black-bar sim-bar-bottom"></div>
</section>





</div><?php
get_footer();