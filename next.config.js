
module.exports = {
    future: {
        webpack5: true,
    },

webpack(config) {
    config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
    }
    return config;
},
eslint: {
    ignoreDuringBuilds: true,
  },
}