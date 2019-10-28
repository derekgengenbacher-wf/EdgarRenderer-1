// Created by Derek Mother Fucking Gengenbacher because the SEC is absolutely terrible at its job

'use strict';

$(document).ready(function() {

    // onClick and onKeyup functions
    $('#dialog-box-close')
        .bind('click', function(e) {Modals.close(e, e.target)})
        .bind('keyup', function(e) {Modals.close(e, e.target)});
    $('#dialog-box-copy-content')
        .bind('click', function(e) {Modals.copyContent(e, e.target, 'form-information-modal-carousel', 'form-information-copy-paste')})
        .bind('keyup', function(e) {Modals.copyContent(e, e.target, 'form-information-modal-carousel', 'form-information-copy-paste')});
    $('#dialog-content-copy-content')
        .bind('click', function(e) {Modals.copyContent(e, e.target, 'form-information-modal-carousel', 'form-information-copy-paste')})
        .bind('keyup', function(e) {Modals.copyContent(e, e.target, 'form-information-modal-carousel', 'form-information-copy-paste')});
    $('#facts-menu')
        .bind('click', function(e) {TaxonomiesMenu.toggle(e, e.target)})
        .bind('keyup', function(e) {TaxonomiesMenu.toggle(e, e.target)});
    $('#form-information-help')
        .bind('click', function(e) {Help.toggle(e, e.target)})
        .bind('keyup', function(e) {Help.toggle(e, e.target)});
    $('#menu-dropdown-information')
        .bind('click', function(e) {ModalsFormInformation.clickEvent(e, e.target)})
        .bind('keyup', function(e) {ModalsFormInformation.clickEvent(e, e.target)});
    $('#menu-dropdown-link')
        .bind('click', function(e) {FormInformation.init(e, e.target)})
        .bind('keyup', function(e) {FormInformation.init(e, e.target)});
    $('#menu-dropdown-settings')
        .bind('click', function(e) {ModalsSettings.clickEvent(e, e.target)})
        .bind('keyup', function(e) {ModalsSettings.clickEvent(e, e.target)});
    $('#sections-dropdown-link')
        .bind('click', function(e) {Sections.toggle(e, e.target)})
        .bind('keyup', function(e) {Sections.toggle(e, e.target)});
    $('#sections-menu-toggle')
        .bind('click', function(e) {Sections.toggle(e, e.target)})
        .bind('keyup', function(e) {Sections.toggle(e, e.target)});
    $('#taxonomy-copy-content')
        .bind('click', function(e) {Modals.copyContent(e, e.target, 'taxonomy-modal-carousel', 'taxonomy-copy-paste')})
        .bind('keyup', function(e) {Modals.copyContent(e, e.target, 'taxonomy-modal-carousel', 'taxonomy-copy-paste')});
    $('#taxonomy-modal-close')
        .bind('click', function(e) {Modals.close(e, e.target)})
        .bind('keyup', function(e) {Modals.close(e, e.target)});
    $('#taxonomy-modal-compress')
        .bind('click', function(e) {Modals.expandToggle(e, e.target, 'taxonomy-modal', 'taxonomy-modal-expand', 'taxonomy-modal-compress')})
        .bind('keyup', function(e) {Modals.expandToggle(e, e.target, 'taxonomy-modal', 'taxonomy-modal-expand', 'taxonomy-modal-compress')});
    $('#taxonomy-modal-copy-content')
        .bind('click', function(e) {Modals.copyContent(e, e.target, 'taxonomy-modal-carousel', 'taxonomy-copy-paste')})
        .bind('keyup', function(e) {Modals.copyContent(e, e.target, 'taxonomy-modal-carousel', 'taxonomy-copy-paste')});
    $('#taxonomy-modal-expand')
        .bind('click', function(e) {Modals.expandToggle(e, e.target, 'taxonomy-modal', 'taxonomy-modal-expand', 'taxonomy-modal-compress')})
        .bind('keyup', function(e) {Modals.expandToggle(e, e.target, 'taxonomy-modal', 'taxonomy-modal-expand', 'taxonomy-modal-compress')});
    $('#taxonomy-modal-jump')
        .bind('click', function(e) {Pagination.goToTaxonomy(e, e.target)})
        .bind('keyup', function(e) {Pagination.goToTaxonomy(e, e.target)});
    $('#taxonomy-nested-modal-compress')
        .bind('click', function(e) {Modals.expandToggle(e, e.target,'taxonomy-nested-modal', 'taxonomy-nested-modal-expand', 'taxonomy-nested-modal-compress')})
        .bind('keyup', function(e) {Modals.expandToggle(e, e.target,'taxonomy-nested-modal', 'taxonomy-nested-modal-expand', 'taxonomy-nested-modal-compress')});
    $('#taxonomy-nested-copy-content')
        .bind('click', function(e) {Modals.copyContent(e, e.target, 'modal-taxonomy-nested-content-carousel', 'taxonomy-nested-copy-paste')})
        .bind('keyup', function(e) {Modals.copyContent(e, e.target, 'modal-taxonomy-nested-content-carousel', 'taxonomy-nested-copy-paste')});
    $('#taxonomy-nested-modal-copy-content')
        .bind('click', function(e) {Modals.copyContent(e, e.target, 'modal-taxonomy-nested-content-carousel', 'taxonomy-nested-copy-paste')})
        .bind('keyup', function(e) {Modals.copyContent(e, e.target, 'modal-taxonomy-nested-content-carousel', 'taxonomy-nested-copy-paste')});
    $('#taxonomy-nested-modal-expand')
        .bind('click', function(e) {Modals.expandToggle(e, e.target, 'taxonomy-nested-modal', 'taxonomy-nested-modal-expand', 'taxonomy-nested-modal-compress')})
        .bind('keyup', function(e) {Modals.expandToggle(e, e.target, 'taxonomy-nested-modal', 'taxonomy-nested-modal-expand', 'taxonomy-nested-modal-compress')});
    $('#taxonomy-nested-modal-jump')
        .bind('click', function(e) {Pagination.goToTaxonomy(e, e.target)})
        .bind('keyup', function(e) {Pagination.goToTaxonomy(e, e.target)});

    // onCLick functions
    $('#back-to-top-btn')
        .bind('click', function() {Scroll.toTop()});
    $('#current-filters-reset-all')
        .bind('click', function() {UserFiltersDropdown.resetAll()});
    $('#help-menu-close')
        .bind('click', function(e) {Help.toggle(e, e.target)});
    $('#nav-filter-more')
        .bind('click', function(e) {UserFiltersGeneral.moreFiltersClickEvent(e, e.target)});
    $('#search-btn-clear')
        .bind('click', function(e) {Search.clear(e, e.target)});
    $('#section-menu-search-btn-clear')
        .bind('click', function(e) {SectionsSearch.clear(e, e.target)});
    $('#settings-modal-close')
        .bind('click', function(e) {Modals.close(e, e.target)});
    $('#taxonomy-menu-secondary-toggle')
        .bind('click', function(e) {TaxonomiesMenu.toggle(e, e.target)});
    $('#taxonomy-nested-moodal-close')
        .bind('click', function(e) {Modals.close(e.target)});
    $('#user-filters-balances-credit')
        .bind('click', function(e) {UserFiltersMoreFiltersBalances.clickEvent(e, e.target, 1)});
    $('#user-filters-balances-debit')
        .bind('click', function(e) {UserFiltersMoreFiltersBalances.clickEvent(e, e.target, 0)});

    // onChange functions
    $('#nav-filter-dropdown')
        .bind('change', function(e) {UserFiltersDataRadios.clickEvent(e, e.target)});
    $('#nav-filter-tags-dropdown')
        .bind('change', function(e) {UserFiltersTagsRadios.clickEvent(e, e.target)});
    $('#scroll-position-select')
        .bind('change', function(e) {ModalsSettings.scrollPosition(e, e.target);});
    $('#taxonomies-menu-page-select')
        .bind('change', function(e) {Pagination.goToPage(e, e.target);});

    // onSubmit functions
    $('#global-search-form')
        .bind('submit', function(e) {Search.submit(e, e.target); return false;});
    $('#sections-menu-search-submit')
        .bind('submit', function(e) {SectionsSearch.submit(e, e.target); return false;});
});
