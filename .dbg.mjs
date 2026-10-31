import { chromium } from '@playwright/test'
import { buildSvg } from './skills/sunnyside-thumbnail/scripts/make-sleeve.mjs'
const svg = buildSvg({ word: 'LAB', variant: 'petri', palette: 'mint', ratio: 1.6, width: 1000 })
const b = await chromium.launch({ channel: 'chrome' })
const p = await b.newPage()
await p.setContent(`<body style="margin:0">${svg}</body>`)
await p.waitForTimeout(300)
const out = await p.evaluate(async () => {
  const s = document.querySelector('svg')
  const blob = new XMLSerializer().serializeToString(s)
  const img = new Image(); img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(blob)))
  await img.decode()
  const W=1000,H=625
  const c=document.createElement('canvas'); c.width=W; c.height=H
  const ctx=c.getContext('2d',{willReadFrequently:true}); ctx.drawImage(img,0,0,W,H)
  const {data}=ctx.getImageData(0,0,W,H)
  const ink=[25,26,46]
  const hits=[]
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    const i=(y*W+x)*4
    const d=Math.abs(data[i]-ink[0])+Math.abs(data[i+1]-ink[1])+Math.abs(data[i+2]-ink[2])
    if(d<60) hits.push([x,y,data[i],data[i+1],data[i+2]])
  }
  const maxX=Math.max(...hits.map(h=>h[0])), maxY=Math.max(...hits.map(h=>h[1]))
  return {
    count:hits.length,
    atMaxX: hits.filter(h=>h[0]===maxX).slice(0,3),
    atMaxY: hits.filter(h=>h[1]===maxY).slice(0,3),
  }
})
console.log(JSON.stringify(out,null,1))
await b.close()
