import pico from 'picoid';

const names = [
  'Tajuana',
  'Cleo',
  'Chanell',
  'Eulah',
  'Alverta',
  'Kasi',
  'Sudie',
  'Celina',
  'Edison',
  'Haydee',
  'Latosha',
  'Cesar',
  'Eve',
  'Denese',
  'Julian',
  'Heriberto',
  'Sharell',
  'Sheree',
  'Angeline',
  'Shanae',
];

function randomName() {
  return names[Math.floor(Math.random() * names.length)];
}

function fakeIt(obj) {
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === 'object') {
      obj[key] = fakeIt(obj[key]);
      continue;
    }

    if (/id/i.test(key)) {
      obj[key] = pico(5);
      continue;
    }

    if (/name/i.test(key)) {
      obj[key] = randomName();
      continue;
    }

    if (/date/i.test(key)) {
      obj[key] = new Date().toISOString();
      continue;
    }

    if (obj[key] === 'boolean') {
      obj[key] = Math.random() > 0.5;
      continue;
    }

    if (obj[key] === 0) {
      obj[key] = Math.floor(Math.random() * 10);
      continue;
    }
  }

  return obj;
}

async function handler(req, res) {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(200).json({ ok: true });
  }

  const result = fakeIt(req.body);
  res.status(200).json(result);
}

export default handler;
