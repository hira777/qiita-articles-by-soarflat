module.exports = {
  title: 'Qiita Articles by soarflat',
  description: 'soarflatが書いたQiitaの記事',
  base: '/qiita-articles-by-soarflat/',
  serviceWorker: true,
  themeConfig: {
    docsDir: 'docs',
    sidebarDepth: 2,
    nav: [
      {
        text: 'JavaScript',
        link: '/javascript/',
      },
      {
        text: 'webpack',
        link: '/webpack/',
      },
      {
        text: 'HTML/CSS',
        link: '/html-css/',
      },
      {
        text: 'Other',
        link: '/other/',
      },
    ],
    sidebar: {
      '/javascript/': [
        {
          title: 'JavaScript',
          collapsable: false,
          children: ['', 'es2015-tutorial', 'async-await-tutorial'],
        },
      ],
      '/webpack/': [
        {
          title: 'webpack',
          collapsable: false,
          children: ['', 'webpack-4-tutorial'],
        },
      ],
      '/html-css/': [
        {
          title: 'HTML/CSS',
          collapsable: false,
          children: ['', 'pug-template'],
        },
      ],
    },
  },
};
