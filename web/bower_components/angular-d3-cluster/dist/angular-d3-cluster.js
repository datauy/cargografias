/**
 * angular-d3-cluster is a simple cluster chart directive.
 *
 * @author Howard.Zuo
 * @date   Dec 19th, 2014
 *
 **/
(function(angular, global) {
    'use strict';

    var definition = function(d3) {

        var defaults = {
            padding: 1.5,
            clusterPadding: 40,
            subjectRange: [30, 45],
            arounderRange: [10, 25],
            maxRadius: 45,
            subjectFontSize: 12,
            arounderFontSize: 8,
            positiveColor: '#FF0000',
            negativeColor: '#00E700'
        };

        var color = {
            white: '#fff'
        };

        var getValue = function(option, key) {
            if (!option) {
                return defaults[key];
            }
            return typeof option[key] !== 'undefined' ? option[key] : defaults[key];
        };

        var dir = function($timeout) {
            return {
                restrict: 'A',
                scope: {
                    option: '=',
                    data: '='
                },
                link: function($scope, element) {

                    var win = angular.element(global);
                    //options
                    var width, height, padding, clusterPadding,
                        maxRadius, subjectRange, arounderRange,
                        subjectFontSize, arounderFontSize, positiveColor, negativeColor;
                    // The subjects.
                    var minSubject, maxSubject, minArounder, maxArounder;
                    //radius
                    var subjectRadius, arounderRadius;
                    //iterator
                    var i = 0,
                        j = 0;

                    //clusters
                    var clusters, nodes;

                    var g;

                    var drawChart = function() {
                        clusters = [];
                        nodes = [];
                        width = element.prop('clientWidth');
                        height = element.prop('clientHeight');
                        // separation between same-color circles
                        padding = getValue($scope.option, 'padding');
                        // separation between different-color circles
                        clusterPadding = getValue($scope.option, 'clusterPadding');
                        //the max size of a radius
                        maxRadius = getValue($scope.option, 'maxRadius');
                        //limit the subject size
                        subjectRange = getValue($scope.option, 'subjectRange');
                        //limit the arounder size
                        arounderRange = getValue($scope.option, 'arounderRange');
                        subjectFontSize = getValue($scope.option, 'subjectFontSize');
                        arounderFontSize = getValue($scope.option, 'arounderFontSize');
                        positiveColor = getValue($scope.option, 'positiveColor');
                        negativeColor = getValue($scope.option, 'negativeColor');

                        for (i = 0; i < $scope.data.length; i++) {
                            if (!minSubject || minSubject > Math.abs($scope.data[i].value)) {
                                minSubject = Math.abs($scope.data[i].value);
                            }
                            if (!maxSubject || maxSubject < Math.abs($scope.data[i].value)) {
                                maxSubject = Math.abs($scope.data[i].value);
                            }
                            for (j = 0; j < $scope.data[i].children.length; j++) {
                                if (!minArounder || minArounder > Math.abs($scope.data[i].children[j].value)) {
                                    minArounder = Math.abs($scope.data[i].children[j].value);
                                }
                                if (!maxArounder || maxArounder < Math.abs($scope.data[i].children[j].value)) {
                                    maxArounder = Math.abs($scope.data[i].children[j].value);
                                }
                            }
                        }
                        subjectRadius = d3.scale.linear()
                            .domain([minSubject, maxSubject])
                            .range(subjectRange);

                        arounderRadius = d3.scale.linear()
                            .domain([minArounder, maxArounder])
                            .range(arounderRange);

                        for (i = 0; i < $scope.data.length; i++) {
                            var cluster = {
                                cluster: i,
                                radius: subjectRadius(Math.abs($scope.data[i].value)),
                                name: $scope.data[i].name,
                                value: $scope.data[i].value,
                                subjectId: $scope.data[i].subjectId
                            };
                            clusters.push(cluster);
                            nodes.push(cluster);
                            for (j = 0; j < $scope.data[i].children.length; j++) {
                                var subNode = {
                                    cluster: i,
                                    radius: arounderRadius(Math.abs($scope.data[i].children[j].value)),
                                    name: $scope.data[i].children[j].name,
                                    value: $scope.data[i].children[j].value,
                                    arounderId: $scope.data[i].children[j].arounderId
                                };
                                nodes.push(subNode);
                            }
                        }

                        var force = d3.layout.force()
                            .nodes(nodes)
                            .size([width, height])
                            .gravity(0.02)
                            .charge(-5)
                            .on('tick', tick)
                            .start();

                        element.find('svg').remove();

                        var svg = d3.select(element[0]).append('svg')
                            .attr('width', width)
                            .attr('height', height);

                        g = svg.selectAll('g')
                            .data(nodes)
                            .enter()
                            .append('g')
                            .call(force.drag);

                        g.append('circle')
                            .attr('r', function(d) {
                                return d.radius;
                            })
                            .style('fill', function(d) {
                                if (clusters[d.cluster] === d) {
                                    return color.white;
                                }
                                return d.value >= 0 ? positiveColor : negativeColor;
                            })
                            .style('stroke', function(d) {
                                return d.value >= 0 ? positiveColor : negativeColor;
                            })
                            .on('click', function(d) {
                                if (d3.event.preventDefault) {
                                    d3.event.preventDefault();
                                }
                                if (d3.event.stopPropagation) {
                                    d3.event.stopPropagation();
                                }
                                if (clusters[d.cluster] === d && $scope.option && $scope.option.onSubjectClick) {
                                    $scope.option.onSubjectClick(d);
                                }
                                if (clusters[d.cluster] !== d && $scope.option && $scope.option.onArounderClick) {
                                    $scope.option.onArounderClick(d);
                                }
                            });

                        g.append('text')
                            .text(function(d) {
                                return d.name;
                            })
                            .attr({
                                'alignment-baseline': 'middle',
                                'text-anchor': 'middle'
                            })
                            .style('font-size', function(d) {
                                if (clusters[d.cluster] === d) {
                                    return subjectFontSize;
                                }
                                return arounderFontSize;
                            })
                            .style('fill', function(d) {
                                if (clusters[d.cluster] === d) {
                                    return d.value >= 0 ? positiveColor : negativeColor;
                                }
                                return color.white;
                            })
                            .style('display', function(d) {
                                return (this.getComputedTextLength() > 2 * d.radius) ? 'none' : 'block';
                            })
                            .on('click', function(d) {
                                if (d3.event.preventDefault) {
                                    d3.event.preventDefault();
                                }
                                if (d3.event.stopPropagation) {
                                    d3.event.stopPropagation();
                                }
                                if (clusters[d.cluster] === d && $scope.option && $scope.option.onSubjectClick) {
                                    $scope.option.onSubjectClick(d);
                                }
                                if (clusters[d.cluster] !== d && $scope.option && $scope.option.onArounderClick) {
                                    $scope.option.onArounderClick(d);
                                }
                            });
                    };

                    drawChart();

                    $scope.$watch('option', function(newValue, oldValue) {
                        if (newValue && oldValue) {
                            drawChart();
                        }
                    }, true);

                    $scope.$watch('data', function() {
                        drawChart();
                    }, true);

                    var resizeHandler = function() {
                        $timeout(function() {
                            drawChart();
                        }, 1000);
                    };

                    win.on('resize', resizeHandler);
                    $scope.$on('$destroy', function() {
                        win.off('resize', resizeHandler);
                    });

                    function tick(e) {

                        g.each(adjustcluster(10 * e.alpha * e.alpha))
                            .each(collide(0.5))
                            .attr('transform', function(d) {
                                return 'translate(' + d.x + ', ' + d.y + ')';
                            });
                    }

                    // Move d to be adjacent to the cluster node.
                    function adjustcluster(alpha) {
                        return function(d) {
                            var cluster = clusters[d.cluster];
                            if (cluster === d) return;
                            var x = d.x - cluster.x,
                                y = d.y - cluster.y,
                                l = Math.sqrt(x * x + y * y),
                                r = d.radius + cluster.radius;
                            if (l != r) {
                                l = (l - r) / l * alpha;
                                d.x -= x *= l;
                                d.y -= y *= l;
                                cluster.x += x;
                                cluster.y += y;
                            }
                        };
                    }

                    // Resolves collisions between d and all other circles.
                    function collide(alpha) {
                        var quadtree = d3.geom.quadtree(nodes);
                        return function(d) {
                            var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
                                nx1 = d.x - r,
                                nx2 = d.x + r,
                                ny1 = d.y - r,
                                ny2 = d.y + r;
                            quadtree.visit(function(quad, x1, y1, x2, y2) {
                                if (quad.point && (quad.point !== d)) {
                                    var x = d.x - quad.point.x,
                                        y = d.y - quad.point.y,
                                        l = Math.sqrt(x * x + y * y),
                                        r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
                                    if (l < r) {
                                        l = (l - r) / l * alpha;
                                        d.x -= x *= l;
                                        d.y -= y *= l;
                                        quad.point.x += x;
                                        quad.point.y += y;
                                    }
                                }
                                return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
                            });
                        };
                    }

                }
            };
        };

        var mod = angular.module('angular-d3-cluster', []);
        mod.directive('ngCluster', ['$timeout', dir]);

    };

    if (typeof exports === 'object') {
        module.exports = definition(require('d3'));
    } else if (typeof define === 'function' && define.amd) {
        define(['d3'], definition);
    } else {
        definition(global.d3);
    }

}(angular, window));
