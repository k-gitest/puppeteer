const puppeteer = require('puppeteer');
const https = require('https');
const url = 'https://***.json';

https.get(url, (res) => {
  let body = '';
  res.setEncoding('utf8');

  res.on('data', (chunk) => {
    body += chunk;
  });

  res.on('end', (res) => {
    res = JSON.parse(body);
    puppet(res);
  });

}).on('error', (e) => {
  console.log(e.message);
});

const get_html = async (url, selector, selector_link, word, engine, word_list) => {

  const user_agent = word_list["userAgent"][Math.floor(Math.random() * word_list["userAgent"].length)]

  arrayShuffle(word_list["proxy"])
  const proxy = word_list["proxy"][Math.floor(Math.random() * word_list["proxy"].length)]
  console.log(proxy)

  //ブラウザ開く
  // ヘッドレス、目視確認用に操作遅延（ms）
  const browser = await puppeteer.launch({
    headless: true,
    "slowMo": 200,
    "ignoreHTTPSErrors": true, // SSL証明書エラー無視する
    args: [
      '--incognito',
      '--lang=ja',
      '--no-sandbox',
      user_agent
    ]
  });

  //タブを開く
  const page = await browser.newPage();

  try {
    //アクセスurl
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 35000 });
    //要素読み込みを待つ
    await page.waitForSelector(selector, { waitUntil: 'networkidle2', timeout: 35000 })
    // 要素を取得
    const target = selector;

    if (engine === "site") {
      const word = url.split('=')
      await page.waitForSelector('input') //inputが読み込まれる迄待つ
      await page.type('input', word[1], { delay: 100 }) //inputにwordを入力（100msで入力）
      await page.keyboard.press('Enter') //キーボードのenterを押す
      //検索後にtitleが読み込まれるまで待つ
      await page.waitForSelector(target, { waitUntil: 'networkidle2', timeout: 35000 });
      const title = await page.title()
      return title
    }
    else {
      await page.waitForSelector(target) //inputが読み込まれる迄待つ
      await page.type(target, word, { delay: 100 }) //inputにwordを入力（100msで入力）
      await page.keyboard.press('Enter') //キーボードのenterを押す
      //検索後にtitleが読み込まれるまで待つ
      await page.waitForSelector(selector_link, { waitUntil: 'networkidle2', timeout: 32000 });

      // $evalで一つのセレクターの要素取得
      // $$evalで複数セレクターの要素取得
      const links = await page.$$eval(selector_link, links => {
        return links.map(link => link.textContent);
      });

      return links
    }

  }
  catch (err) {
    console.log("取得できませんでした", err)
    return false
  }
  finally {
    //目視用で2秒間待機
    await page.waitForTimeout(2000)
    //ブラウザ閉じる
    await browser.close();
  }

}

const get_search_url = async (word, word_list) => {
  try {
    let url = selector = selector_link = ""

    const engine = await word_list["search"][Math.floor(Math.random() * word_list["search"].length)]

    if (engine === "site") {
      url = "https://***"
      selector = "#search_form_input_homepage"
      selector_link = "h2 > a"
    }
    else if (engine === "site") {
      url = "https://***"
      selector = ".a4bIc > input"
      selector_link = ".yuRUbf > a"
    }
    else if (engine === "site") {
      url = "https://***"
      selector = "._1wsoZ5fswvzAoNYvIJgrU4"
      selector_link = ".sw-Card__title > a"
    }
    else if (engine === "site") {
      url = "https://***"
      selector = "title"
    }
    else if (engine === "site") {
      url = "https://***"
      selector = ".sb_form_c > input"
      selector_link = "h2 > a"
    }
    else {
      return false
    }

    const links = await get_html(url, selector, selector_link, word, engine, word_list)
    return true

  }
  catch (err) {
    console.log("取得できませんでした", err)
    return false
  }

}

const puppet = async (word_list) => {
  try {

    const word_all = word_list["one"]
    await arrayShuffle(word_all)

    for (let [index, word] of word_all.entries()) {

      console.log(index)
      if (index !== 0 && index / 10 % 0) {
        await sleep(30)
      }
      else {
        const random = await randint(20, 10)
        await sleep(random)
        await get_search_url(word, word_list)
      }

    }

    await sleep(await randint(20, 10))
    puppet(word_list)

  }
  catch (err) {
    console.log("エラーになりました", err)
  }

}

// ランダム関数（最大値,最小値）
const randint = async (max, min) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// 配列シャッフル
const arrayShuffle = async (array) => {
  for (let i = (array.length - 1); 0 < i; i--) {
    // 0〜(i+1)の範囲で値を取得
    let r = Math.floor(Math.random() * (i + 1));
    // 要素の並び替えを実行
    let tmp = array[i];
    array[i] = array[r];
    array[r] = tmp;
  }
  return array;
}

// sleep関数
const sleep = async (time) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, time * 1000)
  })
}
