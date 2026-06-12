const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// RAM-arme Umgebungen (CI/Sandbox): Worker-Zahl drosselbar, z.B. METRO_MAX_WORKERS=1
if (process.env.METRO_MAX_WORKERS) {
  config.maxWorkers = parseInt(process.env.METRO_MAX_WORKERS, 10);
}

module.exports = withNativeWind(config, { input: './global.css' });
