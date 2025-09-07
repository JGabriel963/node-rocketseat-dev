import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("products").del();

  await knex("products").insert([
    { name: "Batata frita", price: 20 },
    { name: "Hambúrguer", price: 35 },
    { name: "Pizza de Calabresa", price: 55 },
    { name: "Pizza de Mussarela", price: 50 },
    { name: "Coxinha", price: 8 },
    { name: "Pastel de Carne", price: 10 },
    { name: "Esfiha de Queijo", price: 9 },
    { name: "Hot Dog", price: 18 },
    { name: "Lasanha", price: 42 },
    { name: "Macarronada", price: 38 },
    { name: "Suco de Laranja", price: 12 },
    { name: "Refrigerante Lata", price: 7 },
    { name: "Água Mineral", price: 5 },
    { name: "Milkshake Chocolate", price: 22 },
    { name: "Açaí 500ml", price: 25 },
    { name: "Salada Caesar", price: 30 },
    { name: "Tapioca de Queijo", price: 15 },
    { name: "Pão de Queijo", price: 6 },
    { name: "Brigadeiro", price: 4 },
    { name: "Pudim", price: 14 },
  ]);
}
