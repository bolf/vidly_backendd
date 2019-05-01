const genres = [
  { id: 1, name: "Comedy" },
  { id: 2, name: "Thriller" },
  { id: 3, name: "Western" },
  { id: 4, name: "Horror" }
];

module.exports = {
  getGenres: () => {
    return genres;
  },
  getGenreById: (genres_, id) => {
    return genres_.find(genre => genre.id === id);
  }
};
