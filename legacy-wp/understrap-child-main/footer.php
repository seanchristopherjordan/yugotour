<?php
/**
 * The template for displaying the footer for Yugotour
 */
defined( 'ABSPATH' ) || exit;
$container = get_theme_mod( 'understrap_container_type' );

// Fetching Customizer Values
$belgrade_address = get_theme_mod('belgrade_address');
$sarajevo_address = get_theme_mod('sarajevo_address');

$belgrade_fb = get_theme_mod('belgrade_fb');
$belgrade_ig = get_theme_mod('belgrade_ig');
$sarajevo_fb = get_theme_mod('sarajevo_fb');
$sarajevo_ig = get_theme_mod('sarajevo_ig');

$belgrade_google = get_theme_mod('belgrade_google');
$belgrade_trip   = get_theme_mod('belgrade_trip');
$sarajevo_google = get_theme_mod('sarajevo_google');
$sarajevo_trip   = get_theme_mod('sarajevo_trip');
?>

<?php get_template_part( 'sidebar-templates/sidebar', 'footerfull' ); ?>

<div class="wrapper" id="wrapper-footer">
    <footer class="yugo-main-footer" id="colophon">
        
        <img src="<?php echo get_stylesheet_directory_uri(); ?>/images/jugotura-logo.webp" class="jugotura-stamp">

        <div class="<?php echo esc_attr( $container ); ?>">
            <div class="footer-grid">
                
                <div class="footer-col brand-col order-1">
                    <img src="<?php echo get_stylesheet_directory_uri(); ?>/images/yugotour-footer-logo.webp" alt="Yugotour" class="footer-logo">
                    
                   <div class="address-content">
    <div class="address-block">
        <strong>Yugotour Belgrade</strong>
        <p>
            <?php echo nl2br( wp_kses_post( get_theme_mod('belgrade_address') ) ); ?>
        </p>
    </div>
    
    <div class="address-block address-spacer">
        <strong>Yugotour Sarajevo</strong>
        <p>
            <?php echo nl2br( wp_kses_post( get_theme_mod('sarajevo_address') ) ); ?>
        </p>
    </div>
</div>
                </div>

                <div class="footer-col navigate-col order-2">
                    <h5>NAVIGATE</h5>
                    <ul class="footer-links">
                        <li><a href="/book-now" class="footer-book-now">Book Now</a></li>
                        <li><a href="/belgrade-tours">Belgrade Tours</a></li>
                        <li><a href="/sarajevo-tours">Sarajevo Tours</a></li>
                        <li><a href="/about-us">About Us</a></li>
                        <li><a href="/yugopedia">Yugopedia</a></li>
                        <li><a href="/faqs">FAQs</a></li>
                        <li><a href="/blog">Blog</a></li>
                        <li><a href="/media">Media</a></li>
						<li><a href="/contact-us">Contact Us</a></li>
						
                    </ul>
                </div>

                <div class="footer-col content-col order-3 order-lg-5">
                    <h5>FOLLOW</h5>
                    <div class="social-group">
                        <span>Belgrade</span>
                        <div class="icons">
                            <?php if($belgrade_fb) : ?><a href="<?php echo esc_url($belgrade_fb); ?>" target="_blank"><i class="fab fa-facebook-f"></i></a><?php endif; ?>
                            <?php if($belgrade_ig) : ?><a href="<?php echo esc_url($belgrade_ig); ?>" target="_blank"><i class="fab fa-instagram"></i></a><?php endif; ?>
                        </div>
                    </div>
                    <div class="social-group">
                        <span>Sarajevo</span>
                        <div class="icons">
                            <?php if($sarajevo_fb) : ?><a href="<?php echo esc_url($sarajevo_fb); ?>" target="_blank"><i class="fab fa-facebook-f"></i></a><?php endif; ?>
                            <?php if($sarajevo_ig) : ?><a href="<?php echo esc_url($sarajevo_ig); ?>" target="_blank"><i class="fab fa-instagram"></i></a><?php endif; ?>
                        </div>
                    </div>
                </div>

                <div class="footer-col content-col order-4">
                    <h5>GAS US UP</h5>
                    <div class="review-group">
                        <span>Belgrade</span>
                        <div class="review-icons">
                            <?php if($belgrade_google) : ?><a href="<?php echo esc_url($belgrade_google); ?>" target="_blank"><i class="fab fa-google"></i></a><?php endif; ?>
                            <?php if($belgrade_trip) : ?>
                                <a href="<?php echo esc_url($belgrade_trip); ?>" target="_blank">
                                    <img src="<?php echo get_stylesheet_directory_uri(); ?>/images/tripadvisor_icon1.png" class="custom-icon">
                                </a>
                            <?php endif; ?>
                        </div>
                    </div>
                    <div class="review-group">
                        <span>Sarajevo</span>
                        <div class="review-icons">
                            <?php if($sarajevo_google) : ?><a href="<?php echo esc_url($sarajevo_google); ?>" target="_blank"><i class="fab fa-google"></i></a><?php endif; ?>
                            <?php if($sarajevo_trip) : ?>
                                <a href="<?php echo esc_url($sarajevo_trip); ?>" target="_blank">
                                    <img src="<?php echo get_stylesheet_directory_uri(); ?>/images/tripadvisor_icon1.png" class="custom-icon">
                                </a>
                            <?php endif; ?>
                        </div>
                    </div>
                    <img src="<?php echo get_stylesheet_directory_uri(); ?>/images/yugotour-googlereview-qrcode.webp" class="qr-code qr-desktop d-none d-lg-block">
                </div>

                <div class="footer-col content-col order-5 order-lg-3">
                    <h5>FINE PRINT</h5>
                    <ul class="footer-links">
                        <li><a href="/terms-of-service">Terms of Service</a></li>
                        <li><a href="/accessibility">Accessibility</a></li>
                    </ul>
                </div>

            </div>

            <div class="footer-bottom">
                <p>Site by Sean J<br>Copyright © <?php echo date('Y'); ?> Yugotour</p>
            </div>
        </div>
        
        <div class="footer-black-bar"></div>
	
	</footer>
</div>

<div id="yugo-booking-modal" class="yugo-booking-modal">
    <div class="booking-modal-header">
        <div class="booking-modal-close" id="bookingModalClose">
            <button class="menu-trigger is-active" type="button">
                <span class="menu-text">close</span>
                <div class="hamburger">
                    <span></span>
                    <span></span>
                </div>
            </button>
        </div>
    </div>
    <iframe 
        id="yugo-booking-iframe"
        class="yugo-booking-iframe"
        src=""
        data-src="<?php echo esc_url( home_url('/book-now/') ); ?>"
        frameborder="0"
        allowtransparency="true">
    </iframe>
</div>

<?php wp_footer(); ?>
</body>
</html>