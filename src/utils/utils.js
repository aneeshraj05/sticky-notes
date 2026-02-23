export const setNewOffset = (card, delta = { x: 0, y: 0 }) => {
  const x = card.offsetLeft - delta.x;
  const y = card.offsetTop - delta.y;

  return {
    x: Math.max(0, x),
    y: Math.max(0, y)
  };
};

export const setNewSize = (card, delta = { x: 0, y: 0 }) => {
  const width = card.offsetWidth - delta.x;
  const height = card.offsetHeight - delta.y;

  return {
    width: Math.max(200, width),
    height: Math.max(150, height),
  };
};


export const setZIndex = (selectedCard) => {
  const cards = document.getElementsByClassName("card");

  let max = 0;

  Array.from(cards).forEach(card => {
    const z = parseInt(card.style.zIndex) || 0;
    if (z > max) max = z;
  });

  selectedCard.style.zIndex = max + 1;
};


export const bodyParser = (body) => {
  try {
    return JSON.parse(body);
  } catch {
    return body;
  }
};