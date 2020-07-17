import { Client } from "@elastic/elasticsearch";

export const elasticClient = new Client({
  node: process.env.ELASTIC_HOST || "http://localhost:9200"
});
