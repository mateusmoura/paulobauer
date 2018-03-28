function Coloroverlay(opt_options) {
	console.log(this.opt_options, '<<< mateus');

	this.setValues(opt_options);

	$("body").append('<div id="overlay2"></div>');
	this.div_ = $("body").find("#overlay2")[0];
};
Coloroverlay.prototype = new google.maps.OverlayView;

Coloroverlay.prototype.onAdd = function() {
	var pane = this.getPanes().overlayLayer;
	pane.appendChild(this.div_);

	var me = this;

	google.maps.event.addListener(google__map, 'bounds_changed', function() {
		me.draw();
	});
};

Coloroverlay.prototype.draw = function() {
	var projection = this.getProjection();
	var position = projection.fromLatLngToDivPixel(this.map.getCenter());
	var div = this.div_;
	$(div).css({
		display : "block",
		left : position.x,
		top : position.y
	});
};
