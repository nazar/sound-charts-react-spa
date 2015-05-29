var gulp = require( 'gulp' );
var gutil = require( 'gulp-util' );
var webpack = require( 'webpack' );
var gulpWebpack = require( 'gulp-webpack' );
var WebpackDevServer = require( 'webpack-dev-server' );
var stylus = require( 'gulp-stylus' );
var clean = require( 'gulp-clean' );
var rsync = require( 'gulp-rsync' );

// The development server (the recommended option for development)
gulp.task( 'default', [ 'webpack-dev-server', 'stylus:compile' ] );

gulp.task( 'webpack-dev-server', function ( callback ) {
    var config = Object.create( require( './webpack.dev.js' ) );

    // Start a webpack-dev-server
    new WebpackDevServer( webpack( config ), {
        publicPath: config.output.publicPath,
        hot: true,
        historyApiFallback: true,
        stats: {
            colors: true
        }
    } ).listen( 8080, '0.0.0.0', function ( err ) {
            if ( err ) {
                throw new gutil.PluginError( 'webpack-dev-server', err );
            }
            gutil.log( '[webpack-dev-server]', 'http://192.168.10.10:8080' );
            callback();
        } );

    //setup stylus watcher
    gulp.watch( [ 'assets/stylus/*.styl', 'assets/stylus/**/*.styl' ], [ 'stylus:compile' ] );
} );

gulp.task( 'stylus:compile', function () {
    return gulp.src( './assets/stylus/main.styl' )
        .pipe( stylus() )
        .pipe( gulp.dest( './assets' ) );
} );

gulp.task( 'clean:build', function () {
    return gulp.src( 'build/*', { read: false } )
        .pipe( clean() );
} );

gulp.task( 'build:cp:index', function () {
    return gulp.src( './index.html' )
        .pipe( gulp.dest( 'build/' ) );
} );

gulp.task( 'build', [ 'clean:build', 'stylus:compile', 'build:cp:index' ], function () {
    return gulp.src( 'app/app.js' )
        .pipe( gulpWebpack( require( './webpack.prod.js' ), webpack ) )
        .pipe( gulp.dest( 'build/bundle/' ) );
} );

gulp.task( 'deploy',  function () { // ,
    return gulp.src( 'build/**' )
        .pipe( rsync( {
            root: 'build',
            hostname: '176.58.125.89',
            username: 'nazar',
            destination: '/var/www/charts.charb.it/spa/',
            incremental: true,
            progress: true,
            recursive: true,
            clean: true,
            compress: true
        } ) );
} );