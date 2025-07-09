module.exports = {
  apps: [
    {
      name: 'admin',
      script: 'npm',
      args: ['run', 'preview'],
      time: true,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
