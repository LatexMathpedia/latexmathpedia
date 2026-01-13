import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

function getPages(dir: string, baseUrl: string, basePath: string = ''): MetadataRoute.Sitemap {
    const files = fs.readdirSync(dir);
    let pages: MetadataRoute.Sitemap = [];

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory() && !file.startsWith('_') && !file.startsWith('.') && !file.startsWith('(')) {
            pages = pages.concat(getPages(filePath, baseUrl, `${basePath}/${file}`));
        } else if (file === 'page.tsx' || file === 'page.jsx') {
            const url = basePath === '' ? baseUrl : `${baseUrl}${basePath}`;
            pages.push({
                url: url,
                lastModified: stat.mtime,
                changeFrequency: 'monthly',
                priority: basePath === '' ? 1.0 : 0.8,
            });
        }
    });

    return pages;
}

function getBlogPosts(baseUrl: string): MetadataRoute.Sitemap {
    const blogDir = path.join(process.cwd(), 'content/posts');

    if (!fs.existsSync(blogDir)) {
        console.warn('Blog directory does not exist:', blogDir);
        return [];
    }

    const files = fs.readdirSync(blogDir);
    const blogPosts: MetadataRoute.Sitemap = [];

    files.forEach(file => {
        if (file.endsWith('.mdx') || file.endsWith('.md')) {
            const slug = file.replace(/\.mdx?$/, '');
            const filePath = path.join(blogDir, file);
            const stat = fs.statSync(filePath);
            
            blogPosts.push({
                url: `${baseUrl}/dashboard/blog/${slug}`,
                lastModified: stat.mtime,
                changeFrequency: 'monthly',
                priority: slug === 'analisis3-ejercicios-1' ? 0.9 : 0.7,
            });
        }
    });

    return blogPosts;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://mathtexpedia.es';
  const appDir = path.join(process.cwd(), 'app')

  const staticPages = getPages(appDir, baseUrl);
  const blogPosts = getBlogPosts(baseUrl);

  const filteredPages = staticPages.filter(page => !page.url.includes('[slug]') && !page.url.includes('admin'));
  
  return [...filteredPages, ...blogPosts];
}