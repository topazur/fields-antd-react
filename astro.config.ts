import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
// import starlightLinksValidator from 'starlight-links-validator';
import react from '@astrojs/react'
import preview from '@odinlin/astro-preview'

export const locales = {
  'root': { label: 'English', lang: 'en' },
  'zh-cn': { label: '简体中文', lang: 'zh-CN' },
}

/**
 * @type {import('astro/config').defineConfig}
 * @docs https://astro.build/config
 * @docs https://starlight.astro.build/
 */
export default defineConfig({
  srcDir: './site',
  publicDir: './site/public/',
  /** 设置开发服务器的路由匹配行为 */
  trailingSlash: 'always',
  /** 通过自定义集成扩展Astro */
  integrations: [
    starlight({
      title: 'Fields',
      // logo: {
      //   light: '/site/assets/logo-light.svg',
      //   dark: '/site/assets/logo-dark.svg',
      //   replacesTitle: true,
      // },
      customCss: ['./src/style.less'],
      editLink: {
        baseUrl: 'https://github.com/topazur/fields-antd-react/main/',
      },
      social: {
        github: 'https://github.com/topazur/fields-antd-react',
      },
      head: [
        {
          tag: 'link',
          attrs: { rel: 'shortcut icon', href: '/navbar-logo.svg', type: 'image/x-icon' },
        },
        // {
        //   tag: 'meta',
        //   attrs: { property: 'og:image', content: `${originUrl}og.jpg?v=1` },
        // },
        // {
        //   tag: 'meta',
        //   attrs: { property: 'twitter:image', content: `${originUrl}og.jpg?v=1` },
        // },
      ],
      locales,
      sidebar: [
        {
          label: 'Start Here',
          translations: {
            'zh-CN': '从这里开始',
          },
          items: [
            // Each item here is one entry in the navigation menu.
            {
              label: 'Getting Started',
              link: 'getting-started',
              translations: {
                'zh-CN': '开始使用',
              },
            },
            {
              label: 'Quick debugging',
              link: 'example',
              translations: {
                'zh-CN': '快速调试',
              },
            },
          ],
        },
        {
          label: 'Input controls',
          translations: {
            'zh-CN': '输入控件',
          },
          autogenerate: { directory: 'components' },
          // badge: 'New',
        },
        {
          label: 'Others',
          translations: {
            'zh-CN': '其他',
          },
          autogenerate: { directory: 'others' },
          // badge: 'New',
        },
      ],
    }),
    /** Astro 集成 为你的 React 组件实现服务器端渲染和客户端水合 */
    react({
      experimentalReactChildren: true,
    }),
    preview(),
  ],
  /** 自定义 vite 配置项 */
  vite: {},
})
