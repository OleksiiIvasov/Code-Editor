const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;
const filename = ext => !isDev ? `[name].${ext}` : `[name].[hash].${ext}`;
const optimization = () => {
	const config = {
		splitChunks: {
			chunks: 'all'
		}
	}
	if (isProd) {
		config.minimizer = [
		new OptimizeCssAssetsWebpackPlugin(),
		new TerserWebpackPlugin()
		]
	}
	return config;
}
const jsLoaders = () => {
	const loaders = [{
		loader: 'eslint-loader',
	}]
	return loaders;
}
module.exports = {
	context: path.resolve(__dirname,'src'),
	mode: 'development',
	entry: {
		bundle: './js/index.js',
	},
	output: {
		filename: filename('js'),
		path: path.resolve(__dirname, 'dist')
	},
	optimization: optimization(),
	devServer: {
		port: 4200,
		open: true,
		hot: isDev
	},
	devtool: isDev ? 'source-map' : false,
	module: {
		rules: [
		{
			test:/\.css$/,
			use:[{
				loader: MiniCssExtractPlugin.loader,
				options: {
					hmr: isDev,
					reloadAll: true
				},
			}, 'css-loader']
		},
		{
			test: /\.s[ac]ss$/i,
			use: [
			"style-loader",
			"css-loader",
			"sass-loader",
			]
		},
		{
			test: /\.js$/,
			exclude: /node_modules/,
			use: jsLoaders()
		},
		]
	},
	plugins: [
	new HTMLWebpackPlugin({
		template: './index.html',
		minify: {
			collapseWhitespace: isProd
		}
	}),
	new CleanWebpackPlugin(),
	new MiniCssExtractPlugin({
		filename: filename('scss')
	}),
	]
}