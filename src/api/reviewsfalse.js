export const getAllReviews = async (onlyNotApproved = false) => {
  const res = await fetch(
    `/api/reviews${onlyNotApproved ? '?approved=false' : ''}`
  );
  if (!res.ok) throw new Error('Не вдалося отримати відгуки');
  return await res.json();
};
