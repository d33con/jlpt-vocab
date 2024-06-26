export type WordType = {
  id?: number;
  word: string;
  meaning: string;
  furigana: string;
  romaji: string;
  level: number;
  dateAdded: string;
};

export type KanjiType = {
  kanji: string;
  grade: number;
  heisig_en: string;
  stroke_count: number;
  meanings: string[];
  kun_readings: string[];
  on_readings: string[];
  name_readings: string[];
  jlpt: number;
  unicode: string;
};

export type SavedList = {
  id: number;
  slug: string;
  name: string;
  dateAdded: Date;
  words: WordType[];
  user: {
    email: string;
    name: string;
  };
};

export type SavedListResponse = {
  list: SavedList;
  levelCounts: LevelCounts[];
};

export type LevelCounts = {
  _count: {
    word: number;
  };
  level: number;
};
