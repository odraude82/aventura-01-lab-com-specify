function copyRecord(prediction) {
  return {
    sequence: {
      ...prediction.sequence,
      terms: [...prediction.sequence.terms],
    },
    matches: prediction.matches.map((match) => ({
      ...match,
      parameters: { ...match.parameters },
    })),
  };
}

function createSessionHistory() {
  const records = [];

  return {
    add(prediction) {
      if (prediction?.status !== 'matched' || !prediction.sequence || prediction.matches.length === 0) {
        return;
      }
      records.push(copyRecord(prediction));
    },
    list() {
      return records.map((record) => copyRecord(record));
    },
    clear() {
      records.length = 0;
    },
  };
}

export { createSessionHistory };