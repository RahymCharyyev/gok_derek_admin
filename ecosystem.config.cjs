module.exports = {
  apps: [
    {
      name: 'gokderek_admin',
      script: 'npm',
      args: ['run', 'preview'],
      time: true,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
