export type WordType = {
  id?: number;
  word: string;
  meaning: string;
  furigana: string;
  romaji: string;
  level: number;
  dateAdded: string;
};

export type SavedList = {
  id: number;
  slug: string;
  name: string;
  dateAdded: Date;
  words: WordType[];
  user: {
    email: string;
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
