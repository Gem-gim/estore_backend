export const getIp = async () => {
  const res = await fetch(
    `https://api.ipregistry.co/?key=${process.env.APIREGISTRY_API}`,
    { next: { revalidate: 1000000 } }
  );

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
};
