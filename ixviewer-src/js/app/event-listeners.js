
'use strict';

$(document).ready(function() {

    // onClick and onKeyup functions
    $('#dialog-box-close')
        .on('click', function(e) {Modals.close(e, e.target)})
        .on('keyup', function(e) {Modals.close(e, e.target)});
    $('#dialog-box-copy-content')
        .on('click', function(e) {Modals.copyContent(e, e.target, 'form-information-modal-carousel', 'form-information-copy-paste')})
        .on('keyup', function(e) {Modals.copyContent(e, e.target, 'form-information-modal-carousel', 'form-information-copy-paste')});
    $('#dialog-content-copy-content')
        .on('click', function(e) {Modals.copyContent(e, e.target, 'form-information-modal-carousel', 'form-information-copy-paste')})
        .on('keyup', function(e) {Modals.copyContent(e, e.target, 'form-information-modal-carousel', 'form-information-copy-paste')});
    $('#facts-menu')
        .on('click', function(e) {TaxonomiesMenu.toggle(e, e.target)})
        .on('keyup', function(e) {TaxonomiesMenu.toggle(e, e.target)});
    $('#form-information-help')
        .on('click', function(e) {Help.toggle(e, e.target)})
        .on('keyup', function(e) {Help.toggle(e, e.target)});
    $('#menu-dropdown-information')
        .on('click', function(e) {ModalsFormInformation.clickEvent(e, e.target)})
        .on('keyup', function(e) {ModalsFormInformation.clickEvent(e, e.target)});
    $('#menu-dropdown-link')
        .on('click', function(e) {FormInformation.init(e, e.target)})
        .on('keyup', function(e) {FormInformation.init(e, e.target)});
    $('#menu-dropdown-settings')
        .on('click', function(e) {ModalsSettings.clickEvent(e, e.target)})
        .on('keyup', function(e) {ModalsSettings.clickEvent(e, e.target)});
    $('#sections-dropdown-link')
        .on('click', function(e) {Sections.toggle(e, e.target)})
        .on('keyup', function(e) {Sections.toggle(e, e.target)});
    $('#sections-menu-toggle')
        .on('click', function(e) {Sections.toggle(e, e.target)})
        .on('keyup', function(e) {Sections.toggle(e, e.target)});
    $('#taxonomy-copy-content')
        .on('click', function(e) {Modals.copyContent(e, e.target, 'taxonomy-modal-carousel', 'taxonomy-copy-paste')})
        .on('keyup', function(e) {Modals.copyContent(e, e.target, 'taxonomy-modal-carousel', 'taxonomy-copy-paste')});
    $('#taxonomy-modal-close')
        .on('click', function(e) {Modals.close(e, e.target)})
        .on('keyup', function(e) {Modals.close(e, e.target)});
    $('#taxonomy-modal-compress')
        .on('click', function(e) {Modals.expandToggle(e, e.target, 'taxonomy-modal', 'taxonomy-modal-expand', 'taxonomy-modal-compress')})
        .on('keyup', function(e) {Modals.expandToggle(e, e.target, 'taxonomy-modal', 'taxonomy-modal-expand', 'taxonomy-modal-compress')});
    $('#taxonomy-modal-copy-content')
        .on('click', function(e) {Modals.copyContent(e, e.target, 'taxonomy-modal-carousel', 'taxonomy-copy-paste')})
        .on('keyup', function(e) {Modals.copyContent(e, e.target, 'taxonomy-modal-carousel', 'taxonomy-copy-paste')});
    $('#taxonomy-modal-expand')
        .on('click', function(e) {Modals.expandToggle(e, e.target, 'taxonomy-modal', 'taxonomy-modal-expand', 'taxonomy-modal-compress')})
        .on('keyup', function(e) {Modals.expandToggle(e, e.target, 'taxonomy-modal', 'taxonomy-modal-expand', 'taxonomy-modal-compress')});
    $('#taxonomy-modal-jump')
        .on('click', function(e) {Pagination.goToTaxonomy(e, e.target)})
        .on('keyup', function(e) {Pagination.goToTaxonomy(e, e.target)});
    $('#taxonomy-nested-modal-compress')
        .on('click', function(e) {Modals.expandToggle(e, e.target,'taxonomy-nested-modal', 'taxonomy-nested-modal-expand', 'taxonomy-nested-modal-compress')})
        .on('keyup', function(e) {Modals.expandToggle(e, e.target,'taxonomy-nested-modal', 'taxonomy-nested-modal-expand', 'taxonomy-nested-modal-compress')});
    $('#taxonomy-nested-copy-content')
        .on('click', function(e) {Modals.copyContent(e, e.target, 'modal-taxonomy-nested-content-carousel', 'taxonomy-nested-copy-paste')})
        .on('keyup', function(e) {Modals.copyContent(e, e.target, 'modal-taxonomy-nested-content-carousel', 'taxonomy-nested-copy-paste')});
    $('#taxonomy-nested-modal-copy-content')
        .on('click', function(e) {Modals.copyContent(e, e.target, 'modal-taxonomy-nested-content-carousel', 'taxonomy-nested-copy-paste')})
        .on('keyup', function(e) {Modals.copyContent(e, e.target, 'modal-taxonomy-nested-content-carousel', 'taxonomy-nested-copy-paste')});
    $('#taxonomy-nested-modal-expand')
        .on('click', function(e) {Modals.expandToggle(e, e.target, 'taxonomy-nested-modal', 'taxonomy-nested-modal-expand', 'taxonomy-nested-modal-compress')})
        .on('keyup', function(e) {Modals.expandToggle(e, e.target, 'taxonomy-nested-modal', 'taxonomy-nested-modal-expand', 'taxonomy-nested-modal-compress')});
    $('#taxonomy-nested-modal-jump')
        .on('click', function(e) {Pagination.goToTaxonomy(e, e.target)})
        .on('keyup', function(e) {Pagination.goToTaxonomy(e, e.target)});

    // onCLick functions
    $('#back-to-top-btn')
        .on('click', function() {Scroll.toTop()});
    $('#current-filters-reset-all')
        .on('click', function() {UserFiltersDropdown.resetAll()});
    $('#help-menu-close')
        .on('click', function(e) {Help.toggle(e, e.target)});
    $('#nav-filter-more')
        .on('click', function(e) {UserFiltersGeneral.moreFiltersClickEvent(e, e.target)});
    $('#search-btn-clear')
        .on('click', function(e) {Search.clear(e, e.target)});
    $('#section-menu-search-btn-clear')
        .on('click', function(e) {SectionsSearch.clear(e, e.target)});
    $('#settings-modal-close')
        .on('click', function(e) {Modals.close(e, e.target)});
    $('#taxonomy-menu-secondary-toggle')
        .on('click', function(e) {TaxonomiesMenu.toggle(e, e.target)});
    $('#taxonomy-nested-moodal-close')
        .on('click', function(e) {Modals.close(e.target)});
    $('#user-filters-balances-credit')
        .on('click', function(e) {UserFiltersMoreFiltersBalances.clickEvent(e, e.target, 1)});
    $('#user-filters-balances-debit')
        .on('click', function(e) {UserFiltersMoreFiltersBalances.clickEvent(e, e.target, 0)});

    // onChange functions
    $('#nav-filter-dropdown')
        .on('change', function(e) {UserFiltersDataRadios.clickEvent(e, e.target)});
    $('#nav-filter-tags-dropdown')
        .on('change', function(e) {UserFiltersTagsRadios.clickEvent(e, e.target)});
    $('#scroll-position-select')
        .on('change', function(e) {ModalsSettings.scrollPosition(e, e.target);});
    $('#taxonomies-menu-page-select')
        .on('change', function(e) {Pagination.goToPage(e, e.target);});

    // onSubmit functions
    $('#global-search-form')
        .on('submit', function(e) {Search.submit(e, e.target); return false;});
    $('#sections-menu-search-submit')
        .on('submit', function(e) {SectionsSearch.submit(e, e.target); return false;});
});
