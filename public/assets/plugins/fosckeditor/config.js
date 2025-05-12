/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.disableAutoInline = true;

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';

    //config.extraPlugins = 'codesnippet';


    /*config.extraPlugins = 'autogrow';
    config.autoGrow_minHeight = 200;
    config.autoGrow_maxHeight = 600;
    config.autoGrow_bottomSpace = 50;*/



    //config.extraPlugins = 'mentions';

    //config.extraPlugins = 'textwatcher';
    //config.extraPlugins = 'autotag';
    //config.extraPlugins = 'autocomplete';
    //config.extraPlugins = 'textmatch';

    config.extraPlugins = 'autocomplete';
    config.extraPlugins = 'codemirror';

    //config.contentsCss = 'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css';
};

