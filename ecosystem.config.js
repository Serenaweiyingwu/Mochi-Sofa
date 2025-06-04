module.exports = {
  apps: [
    {
      name: 'mochi-sofa-dev',
      cwd: '/home/ubuntu/develop-mochi-sofa',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3002
      }
    }
  ]
} 