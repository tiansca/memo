/* 解析页面html，整理为数组
* contentListEl:  页面内容的dom数组
* hasVideo: 是否获取video标签，默认false*/

async function getNewsList(contentListEl) {
    const news = []
    for (const index in contentListEl) {
        const item = contentListEl[index]
        console.log(item.tagName)
        if (!item.tagName) {
            continue
        }
        const tagName = item.tagName.toLowerCase()
        if (tagName === 'p') {
            if (item.innerHTML) {
                news.push({
                    type: 'text',
                    data: item.innerHTML,
                    index
                })
            }
            // console.log(tagName, item.innerHTML)
        } else if (tagName === 'a') {
            if (item.getAttribute('href')) {
                news.push({
                    type: 'video',
                    data: item.getAttribute('href'),
                    index
                })
            }
            // console.log(tagName, item.getAttribute('href'))
        } else if (tagName === 'figure') {
            const img = item.querySelector('img')
            if (img) {
                // console.log(tagName, img.getAttribute('data-original'))
                news.push({
                    type: 'img',
                    data: img.getAttribute('data-original') || img.getAttribute('src'),
                    index
                })
            }
        } else if (tagName === 'div')  {
            if (item.outerHTML.indexOf('RichText-video') !== -1) {
                news.push({
                    type: 'video',
                    data: null,
                    index
                })
            }
        }
    }
    return news
}
module.exports = getNewsList