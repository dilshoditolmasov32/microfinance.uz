import { START_LOCATION } from 'vue-router'

const ID = METRIKA_COUNTER_ID
const TAG_URL = `https://mc.yandex.ru/metrika/tag.js?id=${ID}`

export default defineNuxtPlugin(() => {
  // Local development must not count as site traffic.
  if (import.meta.dev) return

  // The counter snippet exactly as Yandex Metrika issued it.
  useHead({
    script: [{
      key: 'yandex-metrika',
      innerHTML: `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,'script','${TAG_URL}','ym');ym(${ID},'init',{ssr:true,webvisor:true,clickmap:true,ecommerce:"dataLayer",referrer:document.referrer,url:location.href,accurateTrackBounce:true,trackLinks:true});`,
    }],
    noscript: [{
      key: 'yandex-metrika-noscript',
      innerHTML: `<div><img src="https://mc.yandex.ru/watch/${ID}" style="position:absolute; left:-9999px;" alt="" /></div>`,
      tagPosition: 'bodyClose',
    }],
  })

  if (import.meta.server) return

  // The snippet counts only the first page load. Navigation between pages happens without a
  // reload, so each later page is reported here. Anchor jumps within a page are not page views.
  useRouter().afterEach((to, from) => {
    if (from === START_LOCATION || to.path === from.path) return
    window.ym?.(ID, 'hit', window.location.origin + to.fullPath, {
      referer: window.location.origin + from.fullPath,
    })
  })
})
