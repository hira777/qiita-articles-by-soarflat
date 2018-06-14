module.exports = {
  title: 'Qiita Articles by soarflat',
  description: 'soarflatが書いたQiitaの記事',
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
    },
  },
};
