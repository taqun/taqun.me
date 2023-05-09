/** @type {import('next-sitemap').IConfig} */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

module.exports = {
  siteUrl: 'https://taqun.me',
  transform: async (config, path) => {
    let lastmod;

    if (path === '/') {
      // today
      const d = new Date();
      const year = d.getFullYear();
      const month =
        d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1;
      const date = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate();
      lastmod = `${year}-${month}-${date}`;
    } else if (path.includes('/articles/')) {
      // publish date
      lastmod = path.match(/\d{4}-\d{2}-\d{2}/)?.[0];
    }

    return {
      loc: encodeURI(path),
      lastmod: lastmod || null,
    };
  },
};
