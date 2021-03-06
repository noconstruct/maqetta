define([
	"dojo/_base/declare",
	"dojo/query",
	"./_FixedElemMixin",
	"./InitialSizeHelper"
], function(
	declare,
	query,
	_FixedElemMixin,
	InitialSizeHelper
) {

return declare([_FixedElemMixin, InitialSizeHelper], {

	create: function(widget, srcElement){
		// Fix for #705.
		// The Heading widget's startup logic registers an onmousedown
		// handler on the back arrow's DOM node if there is both
		// a "back" and "moveTo" property that has a reference to a view.
		// This built-in onclick handler will launch an animated
		// transition to make that view visible. This is good for runtime execution,
		// but we don't want this onmousedown handler to execute in the page editor.
		// So, register an "onmousedown" handler in the capture phase (happens before default bubble phase)
		// that calls stopPropagation(), which prevents the Heading's onmousedown logic from getting invoked.
		// We then call context.onMouseDown so that the Heading widget will get selected.
		var dijitWidget = widget.dijitWidget;
		if(dijitWidget){
			var backButtonWidget = dijitWidget.backButton;
			if(backButtonWidget){
				// Set a special flag to tell page editor
				// that the dojo widget corresponding to the automatically
				// generated ToolBarButton for the 'back' property
				// should not be treated as a dvWidget
				backButtonWidget._maqNotDVWidget = true;
				var backButtonNode = backButtonWidget.domNode;
				if(!backButtonWidget._maqClickHandler){
					backButtonWidget._maqClickHandler = backButtonNode.addEventListener("mousedown",function(e){
						// Stop event from going to dojo
						e.stopPropagation();
						// Pass event to Context so normal Maqetta mousedown logic executes
						var context = widget.getContext();
						context.onMouseDown(e);
					}, true);
				}
			}
		}
	},
	
	/**
	* Override the default action in 'DijitWidget.addChild()', which simply calls `addChild()`
	* on the associated Dijit widget instance (i.e. `widget.dijitWidget`).
	*
	* NOTE: Only applies to widgets of class "dijit", which are instances of DijitWidget.
	*
	* XXX This should be refactored in such a way that it is available to all widget types,
	* not just DijitWidget instances (or remove from DijitWidget).
	*
	* @param {davinci/ve/DijitWidget} widget the (Maqetta) widget instance
	* @param {dijit/_Widget} dijitWidget the Dijit widget instance
	* @param {Number|String} [index]
	* The equivalent of the 'pos' parameter to 'dojo.place()', can be a number or
	* a position name. Defaults to "last".
	*/
	addChild: function(widget, dijitWidget, index) {
		var idx = (typeof index == 'number' && widget.dijitWidget.backButton) ? index+1 : index;
		widget.dijitWidget.addChild(dijitWidget, idx);
	},
	
	/**
	* Helper function called whenever a widget-specific property is changed
	* @param {object} args - object with these properties
	* . widget the dvWidget whose property(ies) has changed
	* compoundCommand the CompoundCommand object that contains the ModifyCommand
	* modifyCommand the ModifyCommand object that will soon be executed to change properties
	*/
	onWidgetPropertyChange: function(args){
		if(args && args.modifyCommand && args.modifyCommand._properties.back === ''){
			// '$MAQ_MODIFYCOMMAND_DELETE_PROPERTY$' is a special flag to ModifyCommand
			// saying that the property should be entirely wiped, not just set to empty string.
			args.modifyCommand._properties.back = '$MAQ_MODIFYCOMMAND_DELETE_PROPERTY$';
		}
	}
});

});