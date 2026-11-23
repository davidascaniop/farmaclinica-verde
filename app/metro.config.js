// Permite que Metro lea /shared y /assets, que viven fuera de /app.
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
config.watchFolders = [path.resolve(__dirname, '../shared'), path.resolve(__dirname, '../assets')];
// Los archivos de fuera de /app resuelven sus dependencias en app/node_modules.
config.resolver.nodeModulesPaths = [path.resolve(__dirname, 'node_modules')];

module.exports = config;
