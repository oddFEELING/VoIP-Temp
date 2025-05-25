export type PackagePlan = {
  name: string;
  price: number;
  description: string;
};

export const PackagePlans: PackagePlan[] = [
  {
    name: "Silver",
    price: 5.99,
    description: "Ideal for individuals and small teams.",
  },
  {
    name: "Gold",
    price: 14.99,
    description: "Perfect for growing businesses.",
  },
  {
    name: "Diamond",
    price: 19.99,
    description: "Designed for large organizations.",
  },
];
