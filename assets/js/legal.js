/**
 * JobRelay legal pages.
 *
 * The contents list: open on wide screens, and the link for the section
 * you're reading gets aria-current="location", which the CSS highlights.
 * Based on the site theme's assets/js/toc-spy.js.
 */
( function () {
	const toc = document.querySelector( '.legal-toc' );

	if ( ! toc ) {
		return;
	}

	// Saved closed, so phones see a short "On this page" bar.
	const wide = window.matchMedia( '(min-width: 960px)' );
	const syncOpen = () => {
		if ( wide.matches ) {
			toc.open = true;
		}
	};
	syncOpen();
	wide.addEventListener( 'change', syncOpen );

	const links = Array.from( toc.querySelectorAll( 'a[href^="#"]' ) );

	if ( ! links.length || ! ( 'IntersectionObserver' in window ) ) {
		return;
	}

	const sections = links
		.map( ( link ) => ( { link, heading: document.getElementById( decodeURIComponent( link.hash.slice( 1 ) ) ) } ) )
		.filter( ( section ) => section.heading );

	const setCurrent = ( current ) => {
		links.forEach( ( link ) => {
			if ( link === current ) {
				link.setAttribute( 'aria-current', 'location' );
			} else {
				link.removeAttribute( 'aria-current' );
			}
		} );
	};

	// A heading counts as "being read" once it passes the top fifth of the window.
	const visible = new Set();

	const observer = new IntersectionObserver(
		( entries ) => {
			entries.forEach( ( entry ) => {
				if ( entry.boundingClientRect.top < window.innerHeight * 0.2 ) {
					visible.add( entry.target );
				} else {
					visible.delete( entry.target );
				}
			} );

			const passed = sections.filter( ( section ) => visible.has( section.heading ) );
			setCurrent( passed.length ? passed[ passed.length - 1 ].link : null );
		},
		{ rootMargin: '0px 0px -80% 0px', threshold: [ 0, 1 ] }
	);

	sections.forEach( ( section ) => observer.observe( section.heading ) );
} )();
