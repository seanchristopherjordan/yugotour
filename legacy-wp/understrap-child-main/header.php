<?php
/**
 * The header for our theme
 *
 * Displays all of the <head> section and everything up till <div id="content">
 *
 * @package Understrap
 */

defined( 'ABSPATH' ) || exit;

$bootstrap_version = get_theme_mod( 'understrap_bootstrap_version', 'bootstrap4' );
$navbar_type       = get_theme_mod( 'understrap_navbar_type', 'collapse' );
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="profile" href="http://gmpg.org/xfn/11">
    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?> <?php understrap_body_attributes(); ?>>
<?php do_action( 'wp_body_open' ); ?>
<div class="site" id="page">

    <!-- ******************* The Navbar Area ******************* -->
    <header id="wrapper-navbar" class="yugotour-header">
        <nav class="yugotour-nav">
            <div class="container-fluid d-flex align-items-center justify-content-end h-100">
                
                <a class="yugo-logo-link" href="<?php echo esc_url( home_url( '/' ) ); ?>">
                    <img src="<?php echo get_stylesheet_directory_uri(); ?>/images/yugotour-header-logo.svg" alt="YugoTour">
                </a>

                <div class="d-flex align-items-center">
                    <div class="desktop-links d-none d-lg-flex">
                        <a href="/belgrade">belgrade</a>
                        <a href="/sarajevo">sarajevo</a>
                        <a href="/book" class="book-now" id="headerBookNow">book now</a>
                    </div>
                    
                    <button class="menu-trigger" type="button">
                        <span class="menu-text">menu</span>
                        <div class="hamburger">
                            <span></span>
                            <span></span>
                        </div>
                    </button>
                </div>
            </div>
        </nav>

        <!-- MEGAMENU MODAL -->
        <div id="yugo-modal" class="yugo-takeover-modal">
            <div class="modal-image-split">
                <div class="active-preview-img default-bg"></div>
                <div id="hover-a" class="active-preview-img hover-layer"></div>
                <div id="hover-b" class="active-preview-img hover-layer"></div>
            </div>
            <div class="modal-content-wrap">
                <div class="modal-header-mimic">
                    <button class="menu-trigger modal-close-btn is-active" type="button">
                        <span class="menu-text">menu</span>
                        <div class="hamburger"><span></span><span></span></div>
                    </button>
                </div>
                <nav class="modal-nav-body">
                    <ul class="main-links">
                        <li><a href="/belgrade" data-img="menu-belgrade.webp">belgrade</a></li>
                        <li><a href="/sarajevo" data-img="menu-sarajevo.webp">sarajevo</a></li>
                        <li><a href="/yugopedia" data-img="menu-yugopedia.webp">yugopedia</a></li>
                        <li><a href="/about-us" data-img="menu-aboutus.webp">about us</a></li>
                        <li><a href="/book-now" data-img="menu-booknow.webp" id="menuBookNow">book now</a></li>
                    </ul>
                    <div class="secondary-links-grid">
                        <a href="/contact">Contact</a>
                        <a href="/blog">Blog</a>
                        <a href="/faqs">FAQs</a>
                        <a href="/media">Media</a>
                    </div>
                    <div class="social-footer">
                        <div class="social-group">
                            <span>Belgrade</span>
                            <div class="icons">
                                <a href="<?php echo esc_url( get_theme_mod( 'belgrade_ig', '#' ) ); ?>" target="_blank" rel="noopener noreferrer">
                                    <i class="fab fa-instagram"></i>
                                </a>
                                <a href="<?php echo esc_url( get_theme_mod( 'belgrade_fb', '#' ) ); ?>" target="_blank" rel="noopener noreferrer">
                                    <i class="fab fa-facebook"></i>
                                </a>
                            </div>
                        </div>
                        <div class="social-group">
                            <span>Sarajevo</span>
                            <div class="icons">
                                <a href="<?php echo esc_url( get_theme_mod( 'sarajevo_ig', '#' ) ); ?>" target="_blank" rel="noopener noreferrer">
                                    <i class="fab fa-instagram"></i>
                                </a>
                                <a href="<?php echo esc_url( get_theme_mod( 'sarajevo_fb', '#' ) ); ?>" target="_blank" rel="noopener noreferrer">
                                    <i class="fab fa-facebook"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        </div>
   </header>
