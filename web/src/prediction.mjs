import { parseSequence } from '../../src/parse-sequence.mjs';
import { recognizePatterns } from '../../src/recognize-patterns.mjs';

function predictSequence(rawText) {
  const sequence = parseSequence(rawText);
  const matches = recognizePatterns(sequence.terms);

  return {
    sequence,
    matches,
    status: matches.length > 0 ? 'matched' : 'unsupported',
  };
}

export { predictSequence };