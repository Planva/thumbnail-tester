import { create } from 'xmlbuilder2';
import { writeFileSync } from 'fs';

const BASE_URL = 'https://www.thumbnail-tester.com';

const routes = [
  {
    path: '/',
    priority: '1.0',
    changefreq: 'weekly'
  },
  {
    path: '/youtube-b/b-test',
    priority: '0.9',
    changefreq: 'weekly'
  },
  {
    path: '/thumbnail-tester-ai',
    priority: '0.9',
    changefreq: 'weekly'
  },
  {
    path: '/thumbnail-tester-online-free',
    priority: '0.9',
    changefreq: 'weekly'
  },
  {
    path: '/how-to-ab-test-thumbnails',
    priority: '0.8',
    changefreq: 'monthly'
  },
  {
    path: '/youtube-thumbnail-test-and-compare',
    priority: '0.8',
    changefreq: 'weekly'
  }
];

const sitemap = create({ version: '1.0' })
  .ele('urlset', { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9' });

routes.forEach(route => {
  sitemap
    .ele('url')
      .ele('loc').txt(`${BASE_URL}${route.path}`).up()
      .ele('lastmod').txt(new Date().toISOString().split('T')[0]).up()
      .ele('changefreq').txt(route.changefreq).up()
      .ele('priority').txt(route.priority).up();
});

const xml = sitemap.end({ prettyPrint: true });
writeFileSync('public/sitemap.xml', xml);
console.log('Sitemap generated successfully!');