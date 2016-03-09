// This controller is tied to achievements.html
angular.module('achievements.controller', [])
  .controller('AchievementsController', function ($scope, $window, Calendar,
                                                  DummyRuns, RateGraph, Statistics) {
    var session = $window.localStorage;
    var medals = JSON.parse(session.achievements);
    $scope.total = medals['Gold'] + medals['Silver'] + medals['Bronze'] + medals['High Five'];
    $scope.session = session;
    // Use numeric strings for medal counts to display in d3
    var medalCounts = [
      medals['Gold'].toString(),
      medals['Silver'].toString(),
      medals['Bronze'].toString(),
      medals['High Five'].toString()
    ];

    var debouncedCreateCalendar = _.debounce(Calendar.createCalendar, 200);
    var debouncedCreateRateGraph = _.debounce(RateGraph.createRateGraph, 200);

    window.addEventListener('resize', function() {
      debouncedCreateCalendar(DummyRuns.dummy());
      debouncedCreateRateGraph(DummyRuns.dummy());
    })


    // Animates display of medal counts
    $scope.incrementCounts = function (width) {
      selection = d3.select('body')
        .selectAll('span.number')
        .data(medalCounts);
      selection.transition()
      .tween('html', function (d) {
        var i = d3.interpolate(this.textContent, d);
        return function (t) {
          this.textContent = Math.round(i(t));
        };
      })
      .duration(1500)
      .style('width', width + 'px');
    };

    $scope.statistics = Statistics.generateStatistics(DummyRuns.dummy());


    Calendar.createCalendar(DummyRuns.dummy());
    RateGraph.createRateGraph(DummyRuns.dummy());

    setTimeout(function () {
      $scope.incrementCounts();
    }, 500);

  });
