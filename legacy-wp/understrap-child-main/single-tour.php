<?php
/**
 * Template for single Tour posts
 */
defined( 'ABSPATH' ) || exit;
get_header();
?>

<div class="wrapper" id="page-wrapper">
    <div class="container">

        <?php while ( have_posts() ) : the_post(); ?>

            <h1><?php the_title(); ?></h1>

            <?php 
            $tour_id = get_field('tour_id');
            if ( $tour_id ) : ?>
                <p>Tour ID: <?php echo esc_html( $tour_id ); ?></p>
                <button class="book-this-tour yugo-btn-red" data-tour-id="<?php echo esc_attr( $tour_id ); ?>">
                    Book This Tour
                </button>
            <?php endif; ?>

        <?php endwhile; ?>

    </div>
</div>

<?php get_footer(); ?>