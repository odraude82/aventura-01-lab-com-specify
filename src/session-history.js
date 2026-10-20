function createSessionHistory() {
  const records = [];

  return {
    add(record) {
      records.push(record);
    },
    list() {
      return [...records];
    },
    clear() {
      records.length = 0;
    },
  };
}

module.exports = { createSessionHistory };
