module.exports = {
  apps: [{
    script: 'src/index.js',
    watch: true,
    name: 'blog-platform',
  }],

  deploy: {
    production: {
      user: 'TAPAN_KHOKHARIYA',
      host: '192.168.1.117',
    },
  },
};