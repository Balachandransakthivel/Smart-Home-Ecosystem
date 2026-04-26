const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

const { resolver } = config;

// Disable 'exports' field support in Metro. 
// Many libraries (like socket.io) have broken or complex 'exports' that Metro fails to resolve correctly in React Native.
// This forces Metro to fall back to the standard 'main' field.
resolver.exportsFields = [];

// Ensure we prefer CJS (CommonJS) over ESM (ES Modules)
resolver.resolverMainFields = ['react-native', 'main', 'browser'];

// Add support for .mjs and handle potential ESM resolution issues
resolver.sourceExts.push('mjs', 'cjs');

module.exports = config;
