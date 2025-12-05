function addDays(date, days) {
  const copy = new Date(date.getTime());
  copy.setDate(copy.getDate() + days);
  return copy;
}

function parseRelativeDate(text) {
  const lower = text.toLowerCase();
  const now = new Date();

  if (lower.includes('tomorrow')) {
    return addDays(now, 1).toISOString();
  }

  if (lower.includes('in 3 days')) {
    return addDays(now, 3).toISOString();
  }

  if (lower.includes('next week')) {
    return addDays(now, 7).toISOString();
  }

  // you can add "next monday" etc later
  return undefined;
}

module.exports = {
  parseRelativeDate,
};