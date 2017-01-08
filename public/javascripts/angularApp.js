angular.module('Blog', ['ui.router'])
.config(['$stateProvider','$urlRouterProvider',
	function($stateProvider, $urlRouterProvider){
		$stateProvider.state('home',{
			url: '/home',
			templateUrl: '/home.html',
			controller: 'MainCtrl',
			resolve: { //automatically query all posts from our backend before stated actually finished loading
				postPromise: ['posts', function(posts){
					return posts.getAll();
				}]
			}
		});
		$stateProvider.state('posts',{
			url:'/posts/{id}',
			templateUrl:'/posts.html',
			controller:'PostsCtrl',
			resolve: {
				post:['$stateParams', 'posts', function ($stateParams, posts){
					return posts.get($stateParams.id);
				}]
			}
		});
		$stateProvider.state('admin',{
			url:'/admin',
			templateUrl:'/admin.html',
			controller:'MainCtrl',
		});
	$urlRouterProvider.otherwise('home');
}])

.controller('MainCtrl', ['$scope','posts',
	function($scope, posts){
		$scope.posts = posts.posts;

		$scope.addPost = function(){
			if( !$scope.title || $scope.title === ''){return;}
			if( !$scope.text || $scope.text === ''){return;}

			posts.create({
				title: $scope.title,
				link: $scope.link,
				text: $scope.text,
			});

			$scope.title = '';
			$scope.link = '';
			$scope.text = '';
		}

		$scope.incrementUpvotes = function(post){
			posts.upvote(post);
		}

		$scope.decrementUpvotes = function(post){
			posts.downvote(post);
		}
	}])

.controller('PostsCtrl', ['$scope', 'posts', 'post',
	function($scope, posts,post){
		$scope.post = post;

	$scope.addComment = function(){
		if( !$scope.body || $scope.body === ''){
			return;
		}

		posts.addComment(post._id, {
			body: $scope.body,
			author: 'user',
		}).success(function(comment){
			$scope.post.comments.push(comment);
		});

		$scope.body = '';
	};

	$scope.incrementUpvotes = function (comment) {
        comment.upvotes += 1;
    };

	$scope.incrementUpvote = function(comment){
		console.log('upvote!')
		posts.upvoteComment(post, comment);
	};

	$scope.decrementUpvote = function(comment){
		console.log('downvote!')
		posts.downvoteComment(post, comment);
	};

}])

.factory('posts', ['$http', function($http){
  var o = {
    posts: []
  };

  o.getAll = function(){
  	return $http.get('/posts').success(function(data){
  		angular.copy(data, o.posts); //important cause it creates a deep copy of the the returned data
  	});
  };

  o.create = function(post){
  	return $http.post('/posts', post).success(function(data){
  		o.posts.push(data);
  	});
  };

  o.upvote = function(post){
  	return $http.put('/posts/' + post._id + '/upvote').success(function(data){
  		post.upvotes +=1;
  	});
  };

  o.downvote = function(post){
  	return $http.put('/posts/' + post._id + '/downvote').success(function(data){
  		post.upvotes -=1;
  	});
  };

  o.get = function(id){
  	return $http.get('/posts/' + id).then(function(res){
  		console.log(res);
  		return res.data;
  	});
  };

  o.addComment = function(id, comment){
  	return $http.post('/posts/' + id + '/comments', comment);
  };

  o.upvoteComment = function(post, comment){
  	return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote')
  	.success(function(data){
  		comment.upvotes +=1;
  	});
  };

  o.downvoteComment = function(post, comment){
  	return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/downvote')
  	.success(function(data){
  		comment.upvotes -=1;
  	});
  };

  return o;
}]);
