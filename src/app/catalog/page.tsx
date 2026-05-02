import { getFlowers } from "@/lib/knowledge-base";
import CatalogClient from "./CatalogClient";

export default function CatalogPage() {
  const flowers = getFlowers();
  return <CatalogClient flowers={flowers} />;
}
