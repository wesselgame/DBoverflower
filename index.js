const data = require('./data.json');
const snek = require('./deps/snek');
const colors = require('./deps/colors');

const shortURL = data.url.split('/')[0] ? data.url.split('/')[2] : 'INVALID_URL';

process.seed = Math.ceil( Math.random() * Number.MAX_SAFE_INTEGER );
console.log(`>> Started process with seed ${colors.green(process.seed)}`);

for (name in data.names) {
  const extra = Math.floor(Math.random() * 9);
  const username = `${data['fields'].name}: ${data.names[name].toLowerCase() + extra + data['fields'].mail}`;
  const password = `${data['fields'].pass}: ${(Math.random() + 3).toString(36).substring(3)}`;

  setTimeout(async() => {
    try {
      console.log(`>> Posting ${colors.yellow(`{ ${username}, ${password} }`)} to ${colors.green(shortURL)}`);
      const res = await snek
        .post(data.url)
        .send({ username, password });
      if (res.statusCode !== 200) {
        console.log(`!! PostError ${res.statusCode} - ${colors.red(`${res.statusText}`)}`);
        process.exit(500);
      }
    } catch (err) {
      console.log(`!! Error ${err.code} - ${colors.red(`${err.message}\n${err.stack}`)}`);
      process.exit(err.code);
    } finally {
      console.log(`>> Data sent to ${colors.green(shortURL)}`);
    }
  }, data.ratelimit);
}

process.on('exit', (code) => {
  if (![0, 200].includes(code)) return;
  console.log(`>> all data sent to ${colors.green(shortURL)}, exiting`);
});