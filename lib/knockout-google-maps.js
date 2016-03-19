/**!
 * The MIT License
 *
 * Copyright (c) 2013 Nick Fisher
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * knockout-google-maps
 * https://github.com/nfisher/knockout-google-maps
 *
 * @author Nicholas Fisher https://github.com/nrf110
   @enhanced by jasper chiu http://github.com/chunchill
 */

(function (factory) {
    if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
        // CommonJS or Node: hard-coded dependency on "knockout"
        factory(require("knockout"));
    } else if (typeof define === "function" && define["amd"]) {
        //AMD anonymous module with hard-coded dependency on "knockout"
        define(["knockout"], factory);
    } else {
        // <script> tag: use the global 'ko' object, registering the binding handler
        factory(ko);
    }
})(function (ko) {

    /*
     * Utility functions
     */

    /**
     * Check if 2 floating point numbers are equal
     *
     * @see http://stackoverflow.com/a/588014
     */

    var floatEqual = function (f1, f2) {
        return (Math.abs(f1 - f2) < 0.000001);
    };

    var unwrap = ko.utils.unwrapObservable,
        forEach = ko.utils.arrayForEach,
        map = ko.utils.arrayMap,
        find = ko.utils.arrayFirst,
        filter = ko.utils.arrayFilter,
        extend = function (target) {
            for (var idx = 1; idx < arguments.length; idx++) {
                var source = arguments[idx];
                for (prop in source) {
                    target[prop] = unwrap(source[prop]);
                }
            }
            return target;
        };

    var mapFilter = function (array, predicate, transform) {
        var results = [];
        for (var idx = 0; idx < array.length; idx++) {
            var item = array[idx];
            if (predicate(item)) results.push(transform(item));
        }
        return results;
    };

    var queueTask = function (callback) {
        window.setTimeout(callback, 0);
    };

    var MapModel = function (bindings, element) {
        var _mapInstance = null,
            _markers = [], // caches the instances of google.maps.Marker
            _handlers = [], // event handler objects
            _defaults = {
                zoom: 8,
                draggable: false,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            },
            o = extend({}, _defaults, unwrap(bindings.options)),
            self = this,
            currentInfoWindow = null;

        self.center = unwrap(bindings.center);
        self.zoom = unwrap(bindings.zoom);
        self.draggable = unwrap(bindings.draggable);
        self.dragging = false;
        self.markers = [];

        var customMapType = new google.maps.StyledMapType([
            {
                stylers: [
                    {hue: '#890000'},
                    {visibility: 'simplified'},
                    {gamma: 0.5},
                    {weight: 0.5}
                ]
            },
            {
                elementType: 'labels',
                stylers: [{visibility: 'off'}]
            },
            {
                featureType: 'water',
                stylers: [{color: '#890000'}]
            }
        ], {
            name: 'Custom Style'
        });
        var customMapTypeId = 'custom_style';

        _mapInstance = new google.maps.Map(element, extend(o, {
            center: bindings.center,
            zoom: bindings.zoom,
            draggable: bindings.draggable,
            mapTypeId: bindings.mapTypeId,
            mapTypeControlOptions: {
                mapTypeIds: [google.maps.MapTypeId.ROADMAP, customMapTypeId]
            }
        }));
        _mapInstance.mapTypes.set(customMapTypeId, customMapType);
        _mapInstance.setMapTypeId(customMapTypeId);
        google.maps.event.addListener(_mapInstance, 'dragstart', function () {
            google.maps.event.trigger(_mapInstance, "resize");
            self.dragging = true;
        });
        google.maps.event.addListener(_mapInstance, 'idle', function () {
            self.dragging = false;
        });
        google.maps.event.addListener(_mapInstance, 'drag', function () {
            self.dragging = true;
        });
        google.maps.event.addListener(_mapInstance, 'zoom_changed', function () {
            self.zoom = _mapInstance.getZoom();
            self.center = _mapInstance.getCenter();
        });
        google.maps.event.addListener(_mapInstance, 'center_changed', function () {
            self.center = _mapInstance.getCenter();
        });

        if (_handlers.length > 0) {
            forEach(_handlers, function (handler) {
                google.maps.event.addListener(_mapInstance, handler.on, handler.handler);
            });
        }

        self.draw = function () {
            google.maps.event.trigger(_mapInstance, "resize");

            var instanceCenter = _mapInstance.getCenter();

            if (!floatEqual(instanceCenter.lat(), self.center.lat())
                || !floatEqual(instanceCenter.lng(), self.center.lng())) {
                _mapInstance.setCenter(self.center);
            }

            if (_mapInstance.getZoom() != self.zoom) {
                _mapInstance.setZoom(self.zoom);
            }
        };

        self.on = function (evt, handler) {
            self._handlers = self._handlers || [];
            self._handlers.push({
                "on": evt,
                "handler": handler
            });
        };

        self.fit = function () {
            if (_mapInstance && _markers.length > 0) {
                var bounds = new google.maps.LatLngBounds();

                forEach(_markers, function (marker) {
                    bounds.extend(marker.getPosition());
                });

                _mapInstance.fitBounds(bounds);
            }
        };
        var lineSymbol = {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 5,
            strokeColor: '#6b6b6b'
        };
        self.polyline = new google.maps.Polyline({
            path: [],
            strokeColor: '#000000',
            icons: [{
                icon: lineSymbol,
                offset: '100%'
            }]
        });
        self.polylineTimer = {};
        self.drawPolyline = function (points) {

            self.polyline = new google.maps.Polyline({
                path: points,
                strokeColor: '#000000',
				strokeWeight: 1,
                icons: [{
                    icon: lineSymbol,
                    offset: '100%'
                }]
            });
            self.polyline.setMap(_mapInstance);
            var count = 0;
            self.polylineTimer = window.setInterval(function () {
                count = (count + 1) % 200;
                var icons = self.polyline.get('icons');
                icons[0].offset = (count / 2) + '%';
                self.polyline.set('icons', icons);
            }, 90);
        };

        self.removePolyline = function () {
            clearTimeout(self.polylineTimer);
            self.polyline.setMap(null);
        };

        self.addMarker = function (idx, lat, lng, icon, infoWindowContent) {
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(lat, lng),
                map: _mapInstance,
                icon: icon
            });
            if (marker.icon == null || marker.icon == undefined) {
                marker.setAnimation(google.maps.Animation.BOUNCE);
                var toggleBounce = function () {
                    if (marker.getAnimation() != null) {
                        marker.setAnimation(null);
                    } else {
                        marker.setAnimation(google.maps.Animation.BOUNCE);
                    }
                }
                google.maps.event.addListener(marker, "click", toggleBounce);
            }
            // TODO: find a better way of mating info windows to knockout templates
            if (infoWindowContent != null) {
                var infoWindow = new google.maps.InfoWindow({
                    content: infoWindowContent
                });
                google.maps.event.addListener(marker, "click", function () {
                    if (currentInfoWindow != null) {
                        currentInfoWindow.close();
                    }
                    infoWindow.open(_mapInstance, marker);
                    currentInfoWindow = infoWindow;
                });
            }


            _markers[idx] = marker;

            self.markers[idx] = {
                "lat": lat,
                "lng": lng,
                "draggable": false,
                "icon": icon,
                "infoWindowContent": infoWindowContent
            };

            return marker;
        };

        self.removeMarker = function (idx) {
            var marker = _markers[0];
            _markers.splice(0, 1);
            self.markers.splice(0, 1);
            marker.setMap(null);
        };
    };

    ko.bindingHandlers.gmaps = (function () {
        var parseBindings = function (valueAccessor, allBindings) {
            var options = valueAccessor() || {},
                bindings = { options: options };

            forEach(['handlers', 'draggable', 'zoom', 'center', 'markers', 'mapTypeId', 'fit', 'polylinePoints', 'requireResize'], function (binding) {
                if (allBindings[binding])
                    bindings[binding] = allBindings[binding];
                if (bindings.options[binding])
                    bindings[binding] = bindings.options[binding];

            });

            return bindings;
        };

        return {
            init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var allBindings = allBindingsAccessor(),
                    bindings = parseBindings(valueAccessor, allBindings),
                    _map = new MapModel(bindings, element);
                var initialMarks = unwrap(bindings.markers);
                $.each(initialMarks, function (idx, item) {
                    _map.addMarker(idx, item.latitude, item.longitude, item.icon, item.infoWindowContent);
                });
                var updateBinding = function (binding, value) {
                    if (ko.utils.isWriteableObservable(bindings[binding])) {
                        bindings[binding](value);
                    } else if (allBindings['_ko_property_writers'] && allBindings['_ko_property_writers'][binding]) {
                        allBindings['_ko_property_writers'][binding](value); // update non-observable property
                    }
                };

                _map.on('drag', function () {
                    var center = _map.center;

                    queueTask(function () {
                        updateBinding('center', {
                            latitude: center.lat(),
                            longitude: center.lng()
                        })
                    });
                });

                _map.on('zoom_changed', function () {
                    var oldZoom = unwrap(bindings.zoom);
                    if (oldZoom != _map.zoom) {
                        queueTask(function () {
                            updateBinding('zoom', _map.zoom);
                        });
                    }
                });

                _map.on('center_changed', function () {
                    var center = _map.center;

                    queueTask(function () {
                        if (!_map.dragging) {
                            updateBinding('center', {
                                latitude: center.lat(),
                                longitude: center.lng()
                            });
                        }
                    });
                });


                viewModel['_map'] = _map;

                _map.draw();
                bindings.markers.subscribe(function (changes) {
                    queueTask(function () {
                        var removedIndexes = mapFilter(changes, function (item) {
                            return item.status === 'deleted';
                        }, function (item) {
                            return item.index;
                        });
                        var added = filter(changes, function (item) {
                            return item.status === 'added';
                        });

                        forEach(removedIndexes, _map.removeMarker);

                        forEach(added, function (item) {
                            _map.addMarker(item.index, item.value.latitude, item.value.longitude, item.value.icon, item.value.infoWindowContent);
                        });

                        // Fit map when there is more than one marker.
                        // This will change the center coordinates
                        if (bindings['fit'] && unwrap(bindings.fit) && _map.markers.length > 1) {
                            _map.fit();
                        }
                    });
                }, null, 'arrayChange');


                // update map when center changes
                bindings.center.subscribe(function (newValue) {
                    var center = _map.center,
                        lat = center.lat(),
                        lng = center.lng();

                    if (floatEqual(lat, newValue.lat()) && floatEqual(lng, newValue.lat())) {
                        return;
                    }

                    if (!_map.dragging) {
                        _map.center = new google.maps.LatLng(newValue.lat(), newValue.lng());
                        _map.draw();
                    }
                });

                bindings.zoom.subscribe(function (newValue) {
                    if (newValue !== _map.zoom) {
                        _map.zoom = newValue;
                        _map.draw();
                    }
                });

                bindings.polylinePoints.subscribe(function (newValues) {
                    _map.removePolyline();
                    _map.drawPolyline(newValues);
                });
            }
        };
    })();
});