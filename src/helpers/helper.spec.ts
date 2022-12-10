import { Helper } from './helper';

describe('Word validation', () => {
  it('All correct', () => {
    const result = Helper.compareUserWords('momos', 'momos');
    expect(result).toEqual([
      {
        letter: 'm',
        value: 1,
      },
      {
        letter: 'o',
        value: 1,
      },
      {
        letter: 'm',
        value: 1,
      },
      {
        letter: 'o',
        value: 1,
      },
      {
        letter: 's',
        value: 1,
      },
    ]);
  });

  it('Middle correct', () => {
    const result = Helper.compareUserWords('momos', 'mooms');
    expect(result).toEqual([
      {
        letter: 'm',
        value: 1,
      },
      {
        letter: 'o',
        value: 1,
      },
      {
        letter: 'o',
        value: 2,
      },
      {
        letter: 'm',
        value: 2,
      },
      {
        letter: 's',
        value: 1,
      },
    ]);
  });

  it('All incorrect', () => {
    const result = Helper.compareUserWords('momos', 'lunar');
    expect(result).toEqual([
      {
        letter: 'l',
        value: 3,
      },
      {
        letter: 'u',
        value: 3,
      },
      {
        letter: 'n',
        value: 3,
      },
      {
        letter: 'a',
        value: 3,
      },
      {
        letter: 'r',
        value: 3,
      },
    ]);
  });
});
