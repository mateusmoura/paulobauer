$( function()
{
	
Label.prototype = new google.maps.OverlayView;

// Implement onAdd
Label.prototype.onAdd = function() {
 var pane = this.getPanes().overlayLayer;
 pane.appendChild(this.div_);

 // Ensures the label is redrawn if the text or position is changed.
 var me = this;
 this.listeners_ = [
   google.maps.event.addListener(this, 'position_changed',
       function() { me.draw(); }),
   google.maps.event.addListener(this, 'text_changed',
       function() { me.draw();  })
 ];
};

// Implement onRemove
Label.prototype.onRemove = function() {
 //this.div_.parentNode.removeChild(this.div_);
 
 for( var i = 0; i < oThis.listDivs.length; i++ )
 {
	 //console.log( "passa aqui somente assim > ", oThis.listDivs.length, " agora está em > ", i )
	 oThis.listDivs[i].parentNode.removeChild( oThis.listDivs[i] );
	 oThis.markersLabel[i].setMap(null);
 }
 // Label is removed from the map, stop updating its position/text.
 //console.log( "onRemove" )
 /*for (var i = 0, I = this.listeners_.length; i < I; ++i) {
   google.maps.event.removeListener(this.listeners_[i]);
 }*/
};

// Implement draw
Label.prototype.draw = function() {
 var projection = this.getProjection();
 var position = projection.fromLatLngToDivPixel(this.get('position'));

 var div = this.div_;
 div.style.left = position.x + 'px';
 div.style.top = ( Number( position.y ) - 20 ) + 'px';
 div.style.display = 'block';

 this.span_.innerHTML = this.textLabelM;//this.get('text').toString();
};
});
// Define the overlay, derived from google.maps.OverlayView
function Label(opt_options, textLabel) {
	
 // Initialization
 this.setValues(opt_options);
 this.textLabelM = textLabel;
 // Label specific
 var span = this.span_ = document.createElement('span');
 span.style.cssText = 'position: relative; left: -50%; top: -8px; ' +
                      'white-space: nowrap; text-align:left;' +
                      'padding: 8px 20px 16px; background:url(' + base_url + 'pub/img/mapa/pin/placa.png) no-repeat center top;';

 var div = this.div_ = document.createElement('div');
 div.appendChild(span);
 div.style.cssText = 'position: absolute; display: none; z-index:99; text-align:left;';
 oThis.listDivs.push( div );
};