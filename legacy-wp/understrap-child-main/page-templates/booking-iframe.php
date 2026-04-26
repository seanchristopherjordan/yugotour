<?php
/**
 * Template Name: Booking Iframe
 */
defined( 'ABSPATH' ) || exit;
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <?php wp_head(); ?>
</head>
<body <?php body_class('iframe-page'); ?>>
<div class="booking-iframe-wrap">
    <?php
    while ( have_posts() ) {
        the_post();
        the_content();
    }
    ?>
</div>


<script>
document.addEventListener('DOMContentLoaded', function() {

    const ajaxUrl = '<?php echo admin_url('admin-ajax.php'); ?>';

    // --- FETCH AND POPULATE TOUR DATA ---
    // Called on page load (if tourID in URL) and on dropdown change
    function fetchTourData(tourID) {
        if (!tourID) return;

        // Fetch includes
        fetch(ajaxUrl + '?action=get_tour_includes&tourID=' + tourID)
            .then(r => r.json())
            .then(data => {
                const includesEl = document.querySelector('.yugo-includes-content');
                if (includesEl) {
                    includesEl.innerHTML = (data.success && data.data) ? data.data : '';
                }
            });

        // Future fetches for extras etc. will go here
        // fetchTourExtras(tourID);
    }

    // --- ON PAGE LOAD: read tourID from URL ---
    const params = new URLSearchParams(window.location.search);
    const urlTourID = params.get('tourID');
    if (urlTourID) {
        fetchTourData(urlTourID);
    }

	// --- ON DROPDOWN CHANGE: watch ONLY the tour dropdowns ---
	// Belgrade dropdown: field key o2d6j
	// Sarajevo dropdown: field key zcobz
	const belgradeDropdown = document.querySelector('select[name="item_meta[16]"]');
	const sarajevoDropdown = document.querySelector('select[name="item_meta[18]"]');

	[belgradeDropdown, sarajevoDropdown].forEach(function(dropdown) {
		if (!dropdown) return;
		dropdown.addEventListener('change', function() {
			const selectedTourID = this.value;
			if (selectedTourID) {
				fetchTourData(selectedTourID);
			}
		});
	});

});
</script>





<?php wp_footer(); ?>
</body>
</html>