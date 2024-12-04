const getStars = (rating: number) => {
  const fullStar = String.fromCharCode(9733); // ★
  const halfStar = String.fromCharCode(9734); // ☆

  // Calculate the number of full and half stars
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5 ? 1 : 0;

  // Construct the stars string
  return String(fullStar).repeat(fullStars) + (hasHalfStar ? halfStar : "");
};

export default getStars;
