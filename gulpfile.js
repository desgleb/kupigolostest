const { src, dest, parallel, series, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const notify = require('gulp-notify');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const fileInclude = require('gulp-file-include');
const htmlmin = require('gulp-htmlmin');
const svgSprite = require('gulp-svg-sprite');
const ttf2woff2 = require('gulp-ttf2woff2');
const fs = require('fs');
const del = require('del');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const uglify = require('gulp-uglify-es').default;
const tiny = require('gulp-tinypng-compress');
const gutil = require('gulp-util');
const ftp = require('vinyl-ftp');
const rev = require('gulp-rev');
const revWrite = require('gulp-rev-rewrite');
const revdel = require('gulp-rev-delete-original');

const fonts = () => {
    return src('./src/fonts/**.ttf')
        .pipe(ttf2woff2())
        .pipe(dest('./app/fonts'));
}

const checkWeight = (fontname) => {
    let weight = 400;

    switch (true) {
        case /Thin/.test(fontname):
            weight = 100;
            break;
        case /ExtraLight/.test(fontname):
            weight = 200;
            break;
        case /Light/.test(fontname):
            weight = 300;
            break;
        case /Regular/.test(fontname):
            weight = 400;
            break;
        case /Medium/.test(fontname):
            weight = 500;
            break;
        case /Semibold/.test(fontname):
            weight = 600;
            break;
        case /Bold/.test(fontname):
            weight = 700;
            break;
        case /Heavy/.test(fontname):
            weight = 800;
            break;
        case /Black/.test(fontname):
            weight = 900;
            break;
        default:
            weight = 400;
    }
    return weight;
}

const cb = () => { }

let srcFonts = './src/scss/_fonts.scss';
let appFonts = './app/fonts';

const fontsStyle = (done) => {
    let file_content = fs.readFileSync(srcFonts);

    fs.writeFile(srcFonts, '', cb);
    fs.readdir(appFonts, function (err, items) {
        if (items) {
            let c_fontname;
            for (var i = 0; i < items.length; i++) {
                let fontname = items[i].split('.');
                fontname = fontname[0];
                let font = fontname.split('-')[0];
                let weight = checkWeight(fontname);
                if (c_fontname != fontname) {
                    fs.appendFile(srcFonts, '@include font-face("' + font + '", "' + fontname + '", ' + weight + ');\r\n', cb);
                }
                c_fontname = fontname;
            }
        }
    })

    done();
}

const svgSprites = () => {
    return src('./src/img/svg/**.svg')
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: '../sprite.svg',
                }
            }
        }))
        .pipe(dest('./app/img'));
}

const styles = () => {
    return src('./src/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'expanded',
        }).on('error', notify.onError()))
        .pipe(rename({
            suffix: '.min',
        }))
        .pipe(autoprefixer({
            cascade: false,
        }))
        .pipe(cleanCSS({
            level: 2,
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('./app/css/'))
        .pipe(browserSync.stream());
}

const htmlInclude = () => {
    return src(['./src/*.html'])
        .pipe(fileInclude({
            prefix: '@',
            basepath: '@file'
        }))
        .pipe(dest('./app'))
        .pipe(browserSync.stream());
}

const imgToApp = () => {
    return src(['./src/img/**.jpg',
        './src/img/**.jpeg',
        './src/img/**.webp',
        './src/img/*.svg',
        './src/img/**.png'])
        .pipe(dest('./app/img'));
}

const resources = () => {
    return src('./src/resources/**')
        .pipe(dest('./app'));
}

const clean = () => {
    return del(['app/*']);
}

const scripts = () => {
    return src('./src/js/main.js')
        .pipe(webpackStream({
            output: {
                filename: 'main.min.js',
            },
            module: {
                rules: [
                    {
                        test: /\.m?js$/,
                        exclude: /node_modules/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: [
                                    ['@babel/preset-env', { targets: "defaults" }]
                                ]
                            }
                        }
                    }
                ]
            }
        }))
        .pipe(sourcemaps.init())
        .pipe(uglify({
            toplevel: true,
        }).on("error", notify.onError()))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('./app/js'))
        .pipe(browserSync.stream());
}

const watchFiles = () => {
    browserSync.init({
        server: {
            baseDir: './app',
        }
    });

    watch('./src/scss/**/*.scss', styles);
    watch('./src/html/*.html', htmlInclude);
    watch('./src/*.html', htmlInclude);
    watch('./src/img/**.jpg', imgToApp);
    watch('./src/img/**.jpeg', imgToApp);
    watch('./src/img/**.png', imgToApp);
    watch('./src/img/**.svg', svgSprites);
    watch('./src/resources/**', resources);
    watch('./src/fonts/**.ttf', fonts);
    watch('./src/fonts/**.ttf', fontsStyle);
    watch('./src/js/**/*.js', scripts);
}

exports.styles = styles;
exports.htmlInclude = htmlInclude;
exports.watchFiles = watchFiles;

exports.default = series(clean, parallel(htmlInclude, scripts, fonts, resources, imgToApp, svgSprites), fontsStyle, styles, watchFiles);



const tinypng = () => {
    return src(['./src/img/**.jpg',
        './src/img/**.jpeg',
        './src/img/**.webp',
        './src/img/**.png',])
        .pipe(tiny({
            key: '9y9wcD7nzjsh2wg2J85l4SnwgvHZk0gc',
            sigFile: './app/img/.tinypng-sigs',
            parallel: true,
            parallelMax: 50,
            log: true,
        }))
        .pipe(dest('./app/img'));
}

const stylesBuild = () => {
    return src('./src/scss/**/*.scss')
        .pipe(sass({
            outputStyle: 'expanded',
        }).on('error', notify.onError()))
        .pipe(rename({
            suffix: '.min',
        }))
        .pipe(autoprefixer({
            cascade: false,
        }))
        .pipe(cleanCSS({
            level: 2,
        }))
        .pipe(dest('./app/css/'))
}


const scriptsBuild = () => {
    return src('./src/js/main.js')
        .pipe(webpackStream({
            output: {
                filename: 'main.min.js',
            },
            module: {
                rules: [
                    {
                        test: /\.m?js$/,
                        exclude: /node_modules/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: [
                                    ['@babel/preset-env', { targets: "defaults" }]
                                ]
                            }
                        }
                    }
                ]
            }
        }))
        .pipe(uglify({
            toplevel: true,
        }).on("error", notify.onError()))
        .pipe(dest('./app/js'))
}

const cache = () => {
    return src('app/**/*.{css,js,svg,png,jpg,jpeg,woff2,webp}', {
        base: 'app'
    })
        .pipe(rev())
        .pipe(revdel())
        .pipe(dest('app'))
        .pipe(rev.manifest('rev.json'))
        .pipe(dest('app'))
}

const rewrite = () => {
    const manifest = src('app/rev.json');

    return src('app/**/*.html')
        .pipe(revWrite({
            manifest,
        }))
        .pipe(dest('app'));
}

const htmlMinify = () => {
    return src('app/**/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(dest('app'));
}

exports.cache = series(cache, rewrite);

exports.build = series(clean, parallel(htmlInclude, scriptsBuild, fonts, resources, imgToApp, svgSprites), fontsStyle, stylesBuild, htmlMinify, tinypng);


// deploy
const deploy = () => {
    let conn = ftp.create({
        host: 'vh324.timeweb.ru',
        user: 'cv94680',
        password: 'VqtU295QZnNgEN!',
        parallel: 10,
        log: gutil.log,
    });

    let globs = [
        'app/**',
    ];

    return src(globs, {
        base: './app',
        buffer: false,
    })
        .pipe(conn.newer('/sdp/public_html/')) //only upload newer files
        .pipe(conn.dest('/sdp/public_html/'))
}

exports.deploy = deploy;
