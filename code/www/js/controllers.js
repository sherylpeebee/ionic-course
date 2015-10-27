angular.module('songhop.controllers', ['ionic', 'songhop.services'])
/*
Controller for the discover page
*/
.controller('DiscoverCtrl', function($scope, $timeout, User, Recommendations, $ionicLoading) {

   Recommendations.init()
    .then(function(){
      $scope.currentSong = Recommendations.queue[0];
      hideLoading();
      Recommendations.playCurrentSong();
    });

  $scope.sendFeedback = function (bool) {
    if (bool) {
      User.addSongToFavorites($scope.currentSong);
    }

    $scope.currentSong.favorited = bool;
    $scope.currentSong.hide = true;
    Recommendations.nextSong();

    $timeout(function(){
      $scope.currentSong = Recommendations.queue[0];
    }, 250);

    Recommendations.playCurrentSong();

  };

  $scope.nextAlbumImg = function() {//a little hack for caching the next image in advance for faster image loading
    if (Recommendations.queue.length > 1) {//called in "discover" view; note the css for img-lookahead
      return Recommendations.queue[1].image_large;
    }

    return '';
  };

  var showLoading = function() {
    $ionicLoading.show({
      template: '<i class="ion-loading-c"></i>',
      noBackdrop: true
    });
  };

  var hideLoading = function() {
    $ionicLoading.hide();
  };

  showLoading();

})


/*
Controller for the favorites page
*/
.controller('FavoritesCtrl', function($scope, User) {
  $scope.favorites = User.favorites;
  $scope.removeSong = function(song, index) {
    User.removeSongFromFavorites(song, index);
  };
})


/*
Controller for our tab bar
*/
.controller('TabsCtrl', function($scope, Recommendations) {
  $scope.enteringFavorites = function() {
    Recommendations.haltAudio();
  };


  $scope.leavingFavorites = function() {
    console.log('deselectedd');
    Recommendations.init();
  };

});
